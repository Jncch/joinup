const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}/api${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Users API
  async getUsers() {
    return this.request('/users');
  }

  async getFreelancers() {
    return this.request('/users/freelancers');
  }

  async getCommunities() {
    return this.request('/users/communities');
  }

  async getUserProfile(userId) {
    return this.request(`/users/${userId}`);
  }

  // Communities API
  async searchCommunities(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/communities?${query}`);
  }

  async getFeaturedCommunities() {
    return this.request('/communities/featured');
  }

  // Matching API
  async getMatches(userId = null) {
    const query = userId ? `?user_id=${userId}` : '';
    return this.request(`/matching${query}`);
  }

  async createMatch(data) {
    return this.request('/matching', {
      method: 'POST',
      body: data,
    });
  }

  async updateMatchStatus(matchId, status) {
    return this.request(`/matching/${matchId}/status`, {
      method: 'PUT',
      body: { status },
    });
  }

  async sendMessage(data) {
    return this.request('/matching/messages', {
      method: 'POST',
      body: data,
    });
  }

  async getMessages(matchId) {
    return this.request(`/matching/${matchId}/messages`);
  }
}

export const apiClient = new ApiClient();
