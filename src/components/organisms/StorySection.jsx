import React from 'react';
import StoryCard from '@/components/molecules/StoryCard';

const StorySection = () => {
  const users = ['Alex', 'Sarah', 'Mike', 'Emma', 'Jake'];

  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
        <StoryCard type="your" name="Your Story" />
        {users.map((name) => (
          <StoryCard key={name} type="user" name={name} initial={name.charAt(0)} />
        ))}
      </div>
    </div>
  );
};

export default StorySection;