import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import StoryCard from '@/components/molecules/StoryCard';
import StoryModal from '@/components/organisms/StoryModal';
import StoryService from '@/services/api/storyService';
import UserService from '@/services/api/userService';

const StorySection = () => {
  const [stories, setStories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view' or 'create'
  const [selectedStories, setSelectedStories] = useState([]);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [storiesData, usersData] = await Promise.all([
        StoryService.getActiveStories(),
        UserService.getAll()
      ]);
      setStories(storiesData);
      setUsers(usersData);
    } catch (err) {
      setError(err.message || 'Failed to load stories');
      toast.error('Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStory = () => {
    setModalMode('create');
    setShowStoryModal(true);
  };

  const handleViewUserStories = (userId) => {
    const userStories = stories.filter(story => story.userId === userId);
    if (userStories.length > 0) {
      setSelectedStories(userStories);
      setSelectedStoryIndex(0);
      setModalMode('view');
      setShowStoryModal(true);
    } else {
      toast.info('No stories available');
    }
  };

  const handleCloseModal = () => {
    setShowStoryModal(false);
    setSelectedStories([]);
    setSelectedStoryIndex(0);
    // Refresh stories after creating
    if (modalMode === 'create') {
      loadData();
    }
  };

  const getUserById = (userId) => {
    return users.find(u => u.id === userId) || { displayName: 'Unknown User', username: 'unknown' };
  };

  const getUniqueUserStories = () => {
    const userStoryMap = new Map();
    stories.forEach(story => {
      if (!userStoryMap.has(story.userId)) {
        userStoryMap.set(story.userId, story);
      }
    });
    return Array.from(userStoryMap.values());
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
          <div className="flex-shrink-0 w-16 h-16 bg-gray-700 rounded-full animate-pulse" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-16 h-16 bg-gray-700 rounded-full animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const uniqueUserStories = getUniqueUserStories();

  return (
    <>
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
          <StoryCard 
            type="your" 
            name="Your Story" 
            onClick={handleCreateStory}
          />
          {uniqueUserStories.map((story) => {
            const user = getUserById(story.userId);
            return (
              <StoryCard
                key={story.userId}
                type="user"
                name={user.displayName}
                initial={user.displayName.charAt(0)}
                onClick={() => handleViewUserStories(story.userId)}
              />
            );
          })}
        </div>
      </div>

      <StoryModal
        isOpen={showStoryModal}
        onClose={handleCloseModal}
        stories={selectedStories}
        initialStoryIndex={selectedStoryIndex}
        mode={modalMode}
      />
    </>
  );
};

export default StorySection;