import React from 'react';

const LoadingSkeleton = ({ type = 'default' }) => {
  const renderPostSkeleton = () => (
    <div className="animate-pulse">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
      <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-700 rounded w-5/6 mb-4"></div>
      <div className="h-48 bg-gray-700 rounded-lg mb-4"></div>
      <div className="flex justify-between">
        <div className="h-8 bg-gray-700 rounded w-16"></div>
        <div className="h-8 bg-gray-700 rounded w-16"></div>
        <div className="h-8 bg-gray-700 rounded w-16"></div>
      </div>
    </div>
  );

  const renderProfileSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-48 bg-gray-700 rounded-t-lg mb-4"></div>
      <div className="px-6 pb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="h-8 bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
          <div className="h-10 bg-gray-700 rounded-xl w-24"></div>
        </div>
        <div className="flex space-x-6">
          <div className="text-center">
            <div className="h-6 bg-gray-700 rounded w-8 mb-1"></div>
            <div className="h-4 bg-gray-700 rounded w-12"></div>
          </div>
          <div className="text-center">
            <div className="h-6 bg-gray-700 rounded w-8 mb-1"></div>
            <div className="h-4 bg-gray-700 rounded w-16"></div>
          </div>
          <div className="text-center">
            <div className="h-6 bg-gray-700 rounded w-8 mb-1"></div>
            <div className="h-4 bg-gray-700 rounded w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserListSkeleton = () => (
    <div className="animate-pulse space-y-3">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex items-center justify-between p-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded w-24"></div>
              <div className="h-3 bg-gray-700 rounded w-16"></div>
            </div>
          </div>
          <div className="h-8 bg-gray-700 rounded w-16"></div>
        </div>
      ))}
    </div>
  );

  const renderDefaultSkeleton = () => (
    <div className="animate-pulse space-y-4">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="space-y-3">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        </div>
      ))}
    </div>
  );

  switch (type) {
    case 'post':
      return renderPostSkeleton();
    case 'profile':
      return renderProfileSkeleton();
    case 'userList':
      return renderUserListSkeleton();
    default:
      return renderDefaultSkeleton();
  }
};

export default LoadingSkeleton;