import React from 'react';
import PageHeader from '@/components/molecules/PageHeader';
import StorySection from '@/components/organisms/StorySection';
import PostFeed from '@/components/organisms/PostFeed';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const HomePage = () => {
return (
    <div className="h-full overflow-y-auto bg-background">
      <PageHeader />
      <StorySection />
      <PostFeed />
    </div>
  );
};

export default HomePage;