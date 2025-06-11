import followsData from '../mockData/follows.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class FollowService {
  constructor() {
    this.follows = [...followsData];
  }

  async getAll() {
    await delay(200);
    return [...this.follows];
  }

  async create(followData) {
    await delay(300);
    const newFollow = {
      ...followData,
      createdAt: new Date().toISOString()
    };
    this.follows.push(newFollow);
    return { ...newFollow };
  }

  async delete(followerId, followingId) {
    await delay(250);
    const index = this.follows.findIndex(
      follow => follow.followerId === followerId && follow.followingId === followingId
    );
    if (index !== -1) {
      this.follows.splice(index, 1);
      return true;
    }
    throw new Error('Follow relationship not found');
  }

  async getFollowers(userId) {
    await delay(200);
    return this.follows.filter(follow => follow.followingId === userId);
  }

  async getFollowing(userId) {
    await delay(200);
    return this.follows.filter(follow => follow.followerId === userId);
  }

  async isFollowing(followerId, followingId) {
    await delay(150);
    return this.follows.some(
      follow => follow.followerId === followerId && follow.followingId === followingId
    );
  }
}

export default new FollowService();