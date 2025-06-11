import React from 'react';
import NotificationList from '@/components/organisms/NotificationList';

const NotificationsPage = () => {
  return (
    <div className="h-full overflow-y-auto bg-background">
      <NotificationList />
    </div>
  );
};

export default NotificationsPage;