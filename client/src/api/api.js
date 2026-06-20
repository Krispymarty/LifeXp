import axios from 'axios';

export const api = axios.create({
  baseURL: '/api'
});

export const endpoints = {
  dashboard: () => api.get('/dashboard').then((res) => res.data),
  experiences: () => api.get('/experiences').then((res) => res.data),
  createExperience: (payload) => api.post('/experiences', payload).then((res) => res.data),
  deleteExperience: (id) => api.delete(`/experiences/${id}`).then((res) => res.data),
  skills: () => api.get('/skills').then((res) => res.data),
  badges: () => api.get('/badges').then((res) => res.data)
};
