import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';
import PostService from '../services/api/postService';
import UserService from '../services/api/userService';

export default function Create() {
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
      // Get current user (simulate with first user)
      const users = await UserService.getAll();
      const currentUser = users[0];

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
      navigate('/home');
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
    <div className="h-full overflow-y-auto bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/home')}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              >
                <ApperIcon name="ArrowLeft" size={20} className="text-gray-400" />
              </motion.button>
              <h1 className="text-xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Create Post
              </h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={loading || (!content.trim() && images.length === 0)}
              className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Posting...' : 'Post'}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Create Form */}
      <div className="max-w-2xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">Alex Chen</h3>
              <p className="text-gray-400 text-sm">@alexchen</p>
            </div>
          </div>

          {/* Content Input */}
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening?"
              rows={6}
              className="w-full bg-transparent text-white text-lg placeholder-gray-400 resize-none focus:outline-none break-words"
              maxLength={280}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-400 text-sm">
                {content.length}/280
              </span>
              {content.length > 250 && (
                <div className="w-8 h-8 relative">
                  <svg className="w-8 h-8 transform -rotate-90">
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      className="text-gray-600"
                    />
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray={`${(content.length / 280) * 88} 88`}
                      className={content.length > 280 ? "text-error" : content.length > 250 ? "text-warning" : "text-primary"}
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Image Upload Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              dragActive 
                ? 'border-primary bg-primary/5 scale-105' 
                : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            <input
              type="file"
              id="image-upload"
              multiple
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files)}
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

          {/* Image Preview */}
          {images.length > 0 && (
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
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ApperIcon name="X" size={16} />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}

          {/* Post Options */}
          <div className="flex items-center justify-between p-4 bg-surface/30 rounded-xl border border-gray-700">
            <div className="flex items-center space-x-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 text-gray-400 hover:text-primary transition-colors"
                onClick={() => document.getElementById('image-upload').click()}
              >
                <ApperIcon name="Image" size={20} />
                <span className="text-sm">Photo</span>
              </motion.button>
              
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 text-gray-400 hover:text-secondary transition-colors"
              >
                <ApperIcon name="Video" size={20} />
                <span className="text-sm">Video</span>
              </motion.button>
              
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 text-gray-400 hover:text-accent transition-colors"
              >
                <ApperIcon name="Smile" size={20} />
                <span className="text-sm">Emoji</span>
              </motion.button>
            </div>
            
            <div className="flex items-center space-x-2">
              <ApperIcon name="Globe" size={16} className="text-gray-400" />
              <span className="text-sm text-gray-400">Everyone can reply</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}