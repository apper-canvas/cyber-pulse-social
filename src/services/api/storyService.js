import storiesData from '../mockData/stories.json';

class StoryService {
  constructor() {
    this.stories = [...storiesData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.stories.filter(story => !story.isDeleted)];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const story = this.stories.find(s => s.id === id && !s.isDeleted);
    if (!story) {
      throw new Error('Story not found');
    }
    return { ...story };
  }

  async getByUserId(userId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.stories.filter(story => story.userId === userId && !story.isDeleted);
  }

  async create(storyData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newStory = {
      id: Date.now().toString(),
      userId: storyData.userId,
      imageUrl: storyData.imageUrl,
      text: storyData.text || '',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      views: [],
      isDeleted: false
    };

    this.stories.push(newStory);
    return { ...newStory };
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.stories.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Story not found');
    }

    this.stories[index] = {
      ...this.stories[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return { ...this.stories[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = this.stories.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Story not found');
    }

    this.stories[index].isDeleted = true;
    return { success: true };
  }

  async addView(storyId, userId) {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const story = this.stories.find(s => s.id === storyId);
    if (story && !story.views.includes(userId)) {
      story.views.push(userId);
    }
    return { success: true };
  }

  async getActiveStories() {
    await new Promise(resolve => setTimeout(resolve, 200));
    const now = new Date().toISOString();
    return this.stories.filter(story => 
      !story.isDeleted && 
      story.expiresAt > now
    );
  }
}

export default new StoryService();