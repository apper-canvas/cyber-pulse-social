import commentsData from '../mockData/comments.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CommentService {
  constructor() {
    this.comments = [...commentsData];
  }

  async getAll() {
    await delay(200);
    return [...this.comments];
  }

  async getById(id) {
    await delay(150);
    const comment = this.comments.find(comment => comment.id === id);
    return comment ? { ...comment } : null;
  }

  async create(commentData) {
    await delay(300);
    const newComment = {
      ...commentData,
      id: `comment_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.comments.push(newComment);
    return { ...newComment };
  }

  async update(id, commentData) {
    await delay(250);
    const index = this.comments.findIndex(comment => comment.id === id);
    if (index !== -1) {
      this.comments[index] = { ...this.comments[index], ...commentData };
      return { ...this.comments[index] };
    }
    throw new Error('Comment not found');
  }

  async delete(id) {
    await delay(250);
    const index = this.comments.findIndex(comment => comment.id === id);
    if (index !== -1) {
      this.comments.splice(index, 1);
      return true;
    }
    throw new Error('Comment not found');
  }

  async getByPostId(postId) {
    await delay(200);
    return this.comments.filter(comment => comment.postId === postId);
  }
}

export default new CommentService();