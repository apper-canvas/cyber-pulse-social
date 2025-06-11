import React from 'react';
import { motion } from 'framer-motion';
import Avatar from '@/components/atoms/Avatar';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

const CommentInput = ({ currentUser, value, onChange, onPostComment, placeholder = "Add a comment..." }) => {
  return (
    <div className="flex space-x-3">
      <Avatar initial={currentUser?.displayName?.charAt(0) || 'U'} size="sm" />
      <div className="flex-1 flex space-x-3">
        <Input
          type="text"
          value={value}
          onChange={onChange}
          onKeyPress={(e) => e.key === 'Enter' && onPostComment()}
          placeholder={placeholder}
          className="flex-1 bg-gray-700 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPostComment}
          disabled={!value?.trim()}
          className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Post
        </Button>
      </div>
    </div>
  );
};

export default CommentInput;