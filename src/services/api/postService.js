import postsData from '../mockData/posts.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PostService {
  constructor() {
    this.posts = [...postsData];
  }

  async getAll() {
    await delay(300);
    return [...this.posts];
  }

  async getById(id) {
    await delay(200);
    const post = this.posts.find(post => post.id === id);
    return post ? { ...post } : null;
  }

  async create(postData) {
    await delay(400);
    const newPost = {
      ...postData,
      id: `post_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.posts.unshift(newPost);
    return { ...newPost };
  }

  async update(id, postData) {
    await delay(300);
    const index = this.posts.findIndex(post => post.id === id);
    if (index !== -1) {
      this.posts[index] = { ...this.posts[index], ...postData };
      return { ...this.posts[index] };
    }
    throw new Error('Post not found');
  }

  async delete(id) {
    await delay(300);
    const index = this.posts.findIndex(post => post.id === id);
    if (index !== -1) {
      this.posts.splice(index, 1);
      return true;
    }
    throw new Error('Post not found');
  }

  async getByUserId(userId) {
    await delay(250);
    return this.posts.filter(post => post.userId === userId);
  }
}

export default new PostService();