import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import StoryService from '@/services/api/storyService';
import UserService from '@/services/api/userService';

const StoryModal = ({ isOpen, onClose, stories = [], initialStoryIndex = 0, mode = 'view' }) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [storyText, setStoryText] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadUsers();
      if (mode === 'view' && stories.length > 0) {
        // Auto advance stories every 5 seconds
        const timer = setInterval(() => {
          setCurrentStoryIndex(prev => {
            if (prev < stories.length - 1) {
              return prev + 1;
            } else {
              onClose();
              return prev;
            }
          });
        }, 5000);
        return () => clearInterval(timer);
      }
    }
  }, [isOpen, mode, stories.length, onClose]);

  const loadUsers = async () => {
    try {
      const usersData = await UserService.getAll();
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/') && file.size < 10 * 1024 * 1024) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error('Please select an image file under 10MB');
      }
    }
  };

  const handleCreateStory = async () => {
    if (!imagePreview) {
      toast.error('Please select an image for your story');
      return;
    }

    setCreating(true);
    try {
      const currentUser = users[0]; // Simulate current user
      await StoryService.create({
        userId: currentUser.id,
        imageUrl: imagePreview,
        text: storyText.trim()
      });
      
      toast.success('Story created successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to create story');
    } finally {
      setCreating(false);
    }
  };

  const handlePrevious = () => {
    setCurrentStoryIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentStoryIndex(prev => {
      if (prev < stories.length - 1) {
        return prev + 1;
      } else {
        onClose();
        return prev;
      }
    });
  };

  const getCurrentUser = (userId) => {
    return users.find(u => u.id === userId) || { displayName: 'Unknown User', username: 'unknown' };
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-sm h-full max-h-[600px] bg-black rounded-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-colors"
          >
            <ApperIcon name="X" size={20} />
          </button>

          {mode === 'create' ? (
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white">Create Story</h2>
              </div>

              {/* Image upload area */}
              <div className="flex-1 p-4 flex flex-col">
                {!imagePreview ? (
                  <div className="flex-1 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center space-y-4">
                    <ApperIcon name="Camera" size={48} className="text-gray-400" />
                    <div className="text-center">
                      <p className="text-white font-medium">Add a photo</p>
                      <p className="text-gray-400 text-sm">Choose from gallery</p>
                    </div>
                    <Button
                      variant="primary"
                      onClick={() => document.getElementById('story-image-upload').click()}
                    >
                      Select Photo
                    </Button>
                    <input
                      id="story-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="flex-1 relative">
                    <img
                      src={imagePreview}
                      alt="Story preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg" />
                    
                    {/* Text overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <Input
                        value={storyText}
                        onChange={(e) => setStoryText(e.target.value)}
                        placeholder="Add text to your story..."
                        className="bg-black bg-opacity-50 text-white placeholder-gray-300 border-none"
                        maxLength={100}
                      />
                    </div>

                    {/* Change photo button */}
                    <button
                      onClick={() => document.getElementById('story-image-upload').click()}
                      className="absolute top-4 left-4 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-colors"
                    >
                      <ApperIcon name="Camera" size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="p-4 border-t border-gray-700 flex space-x-3">
                <Button
                  variant="secondary"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleCreateStory}
                  disabled={!imagePreview || creating}
                  loading={creating}
                  className="flex-1"
                >
                  Share Story
                </Button>
              </div>
            </div>
          ) : (
            // View mode
            stories.length > 0 && (
              <div className="h-full relative">
                {/* Story progress bars */}
                <div className="absolute top-4 left-4 right-4 z-10 flex space-x-1">
                  {stories.map((_, index) => (
                    <div
                      key={index}
                      className="flex-1 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden"
                    >
                      <div
                        className={`h-full bg-white transition-all duration-300 ${
                          index < currentStoryIndex ? 'w-full' :
                          index === currentStoryIndex ? 'w-1/2' : 'w-0'
                        }`}
                      />
                    </div>
                  ))}
                </div>

                {/* User info */}
                <div className="absolute top-12 left-4 right-4 z-10 flex items-center space-x-3">
                  <Avatar
                    initial={getCurrentUser(stories[currentStoryIndex]?.userId).displayName?.[0]}
                    size="sm"
                  />
                  <div>
                    <p className="text-white font-medium text-sm">
                      {getCurrentUser(stories[currentStoryIndex]?.userId).displayName}
                    </p>
                    <p className="text-gray-300 text-xs">
                      {new Date(stories[currentStoryIndex]?.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                {/* Story image */}
                <img
                  src={stories[currentStoryIndex]?.imageUrl}
                  alt="Story"
                  className="w-full h-full object-cover"
                />

                {/* Story text overlay */}
                {stories[currentStoryIndex]?.text && (
                  <div className="absolute bottom-20 left-4 right-4 z-10">
                    <p className="text-white text-lg font-medium text-center bg-black bg-opacity-50 p-3 rounded-lg">
                      {stories[currentStoryIndex].text}
                    </p>
                  </div>
                )}

                {/* Navigation buttons */}
                <button
                  onClick={handlePrevious}
                  disabled={currentStoryIndex === 0}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ApperIcon name="ChevronLeft" size={20} />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-colors"
                >
                  <ApperIcon name="ChevronRight" size={20} />
                </button>
              </div>
            )
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StoryModal;