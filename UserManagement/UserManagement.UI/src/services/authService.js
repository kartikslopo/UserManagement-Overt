import config from '../config/config';

const API_BASE_URL = config.API_BASE_URL;

class AuthService {
  constructor() {
    this.token = localStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }

  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid username or password');
        } else if (response.status === 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          const error = await response.text();
          throw new Error(error || `HTTP error! status: ${response.status}`);
        }
      }

      const data = await response.json();
      
      this.token = data.token;
      this.user = {
        username: data.username,
        role: data.role,
        access: data.access
      };

      localStorage.setItem('token', this.token);
      localStorage.setItem('user', JSON.stringify(this.user));

      return data;
    } catch (error) {
      // Check if it's a network error
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to the server. Please check if the API is running and accessible.');
      }
      throw error;
    }
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    return !!this.token;
  }

  getUser() {
    return this.user;
  }

  getToken() {
    return this.token;
  }

  hasRole(role) {
    return this.user?.role === role;
  }

  canEdit() {
    return this.user?.role === 'Admin';
  }

  canView() {
    return this.user?.role === 'Admin' || this.user?.role === 'Viewer';
  }
}

export default new AuthService();
