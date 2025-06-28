import authService from './authService';
import config from '../config/config';

const API_BASE_URL = config.API_BASE_URL;

class UserService {
  async getAllUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/user`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getUsers(page = 1, pageSize = 10, searchTerm = '', sortBy = 'Id', sortDirection = 'asc') {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        sortBy,
        sortDirection
      });

      if (searchTerm) {
        params.append('searchTerm', searchTerm);
      }

      const response = await fetch(`${API_BASE_URL}/user/paginated?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getUserProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/user/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async addUser(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/user`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to add user');
      }

      return await response.text();
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id, userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to update user');
      }

      return await response.text();
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to delete user');
      }

      return await response.text();
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();
