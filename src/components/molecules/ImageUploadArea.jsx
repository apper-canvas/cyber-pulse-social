import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';

const ImageUploadArea = ({ onDrop, onDragOver, onDragLeave, onFileChange, dragActive }) => {
  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
        dragActive
          ? 'border-primary bg-primary/5 scale-105'
          : 'border-gray-600 hover:border-gray-500'
      }`}
    >
      <Input
        type="file"
        id="image-upload"
        multiple
        accept="image/*"
        onChange={onFileChange}
        className="hidden"
      />
      <label htmlFor="image-upload" className="cursor-pointer">
        <ApperIcon name="Upload" size={32} className="text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400">
          Drag & drop images here or <span className="text-primary">click to browse</span>
        </p>
        <p className="text-gray-500 text-sm mt-2">Up to 5MB per image</p>
      </label>
    </div>
  );
};

export default ImageUploadArea;