import { supabase } from '../lib/supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  async _handleResponse(response) {
    // 1. Handle 204 No Content (Common for DELETE)
    if (response.status === 204) {
      return null;
    }

    // 2. Parse JSON
    const data = await response.json().catch(() => null);

    // 3. Handle Errors 
    if (!response.ok) {
      throw new Error(data?.error || data?.message || `Request failed: ${response.statusText}`);
    }

    return data;
  },

  async getToken() {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session?.access_token) {
      throw new Error('User is not authenticated');
    }
    
    return session.access_token;
  },

  async uploadResume(file) {
    const token = await this.getToken();
    const formData = new FormData();
    formData.append('resume', file);

    const response = await fetch(`${API_URL}/resumes/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    });

    return this._handleResponse(response);
  },

  async getResumes() {
    const token = await this.getToken();
    const response = await fetch(`${API_URL}/resumes`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return this._handleResponse(response);
  },

  async getResume(id) {
    if (!id) throw new Error('Resume ID is required'); 

    const token = await this.getToken();
    const response = await fetch(`${API_URL}/resumes/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return this._handleResponse(response);
  },

  async deleteResume(id) {
    if (!id) throw new Error('Resume ID is required');

    const token = await this.getToken();
    const response = await fetch(`${API_URL}/resumes/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return this._handleResponse(response);
  }
};