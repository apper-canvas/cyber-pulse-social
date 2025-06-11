import usersData from '../mockData/users.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserService {
  constructor() {
    this.users = [...usersData];
  }

  async getAll() {
    await delay(200);
    return [...this.users];
  }

  async getById(id) {
    await delay(150);
    const user = this.users.find(user => user.id === id);
    return user ? { ...user } : null;
  }

  async create(userData) {
    await delay(300);
    const newUser = {
      ...userData,
      id: `user_${Date.now()}`,
      followersCount: 0,
      followingCount: 0,
      postsCount: 0
    };
    this.users.push(newUser);
    return { ...newUser };
  }

  async update(id, userData) {
    await delay(250);
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...userData };
      return { ...this.users[index] };
    }
    throw new Error('User not found');
  }

  async delete(id) {
    await delay(300);
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    throw new Error('User not found');
  }

  async searchUsers(query) {
    await delay(200);
    const lowercaseQuery = query.toLowerCase();
    return this.users.filter(user => 
      user.username.toLowerCase().includes(lowercaseQuery) ||
      user.displayName.toLowerCase().includes(lowercaseQuery)
    );
  }
}

export default new UserService();