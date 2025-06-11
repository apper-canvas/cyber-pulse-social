import React from 'react';
import PageHeader from '@/components/molecules/PageHeader';
import StorySection from '@/components/organisms/StorySection';
import PostFeed from '@/components/organisms/PostFeed';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const HomePage = () => {
  return (
    <div className="h-full overflow-y-auto bg-background">
      <PageHeader
        title="Home Feed"
        rightContent={
          <div className="flex items-center space-x-3">
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
              <ApperIcon name="Search" size={20} className="text-gray-400" />
            </Button>
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
              <ApperIcon name="Settings" size={20} className="text-gray-400" />
            </Button>
          </div>
        }
      />
      <StorySection />
      <PostFeed />
    </div>
  );
};

export default HomePage;