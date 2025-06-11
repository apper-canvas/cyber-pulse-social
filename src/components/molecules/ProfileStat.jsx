import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';

const ProfileStat = ({ count, label, onClick }) => {
  return (
    <Button
      whileHover={{ scale: 1.05 }}
      className="text-center"
      onClick={onClick}
    >
      <div className="text-white font-bold text-lg">{count}</div>
      <div className="text-gray-400 text-sm">{label}</div>
    </Button>
  );
};

export default ProfileStat;