import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Input from '@/components/atoms/Input';
import UserDisplay from '@/components/molecules/UserDisplay';
import CharacterCounter from '@/components/molecules/CharacterCounter';
import ImageUploadArea from '@/components/molecules/ImageUploadArea';
import ImagePreviewList from '@/components/molecules/ImagePreviewList';
import PostOptions from '@/components/molecules/PostOptions';

import PostService from '@/services/api/postService';
import UserService from '@/services/api/userService';

const CreatePostForm = ({ onSubmitSuccess }) => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && images.length === 0) {
      toast.error('Please add some content or images');
      return;
    }

    setLoading(true);
    try {
      const users = await UserService.getAll();
      const currentUser = users[0]; // Simulate current user

      const newPost = {
        userId: currentUser.id,
        content: content.trim(),
        imageUrls: images,
        videoUrl: null,
        likes: [],
        commentCount: 0,
        createdAt: new Date().toISOString(),
        isDeleted: false
      };

      await PostService.create(newPost);
      toast.success('Post created successfully!');
      if (onSubmitSuccess) {
        onSubmitSuccess();
      } else {
        navigate('/home');
      }
    } catch (err) {
      toast.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (files) => {
    const validFiles = Array.from(files).filter(file =>
      file.type.startsWith('image/') && file.size < 5 * 1024 * 1024 // 5MB limit
    );

    if (validFiles.length !== files.length) {
      toast.warning('Some files were skipped (only images under 5MB allowed)');
    }

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <UserDisplay user={{ displayName: 'Alex Chen', username: 'alexchen' }} avatarSize="md" />

      <div>
        <Input
          as="textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?"
          rows={6}
          className="w-full bg-transparent text-white text-lg placeholder-gray-400 resize-none focus:outline-none break-words"
          maxLength={280}
        />
        <CharacterCounter currentLength={content.length} maxLength={280} />
      </div>

      <ImageUploadArea
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onFileChange={(e) => handleImageUpload(e.target.files)}
        dragActive={dragActive}
      />

      <ImagePreviewList images={images} onRemoveImage={removeImage} />

      <PostOptions onPhotoClick={() => document.getElementById('image-upload').click()} />
    </form>
  );
};

export default CreatePostForm;