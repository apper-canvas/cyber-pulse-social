import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ImagePreviewList = ({ images, onRemoveImage }) => {
  if (images.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      {images.map((image, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group"
        >
          <img
            src={image}
            alt={`Upload ${index + 1}`}
            className="w-full h-48 object-cover rounded-xl"
          />
          <Button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onRemoveImage(index)}
            className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ApperIcon name="X" size={16} />
          </Button>
        </motion.div>
      ))}
    </div>
  );
};

export default ImagePreviewList;