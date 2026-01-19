import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ReviewIssue {
  line: number;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  risk: string;
  suggestion: string;
}

export interface ReviewScores {
  correctness: number;
  readability: number;
  maintainability: number;
  performance: number;
  security: number;
  overall: number;
}

export interface ReviewResponse {
  id: string;
  code: string;
  language: string;
  skill_level: string;
  focus_areas: string[];
  issues: ReviewIssue[];
  improved_code: string;
  explanation: string;
  scores: ReviewScores;
  follow_up_questions: string[];
  timestamp: string;
}

export interface SubmitReviewRequest {
  code: string;
  language: string;
  skill_level: string;
  focus_areas: string[];
}

export const reviewApi = {
  submitReview: async (data: SubmitReviewRequest): Promise<ReviewResponse> => {
    const response = await api.post<ReviewResponse>('/api/reviews', data);
    return response.data;
  },

  getReviews: async (): Promise<ReviewResponse[]> => {
    const response = await api.get<ReviewResponse[]>('/api/reviews');
    return response.data;
  },

  getReview: async (id: string): Promise<ReviewResponse> => {
    const response = await api.get<ReviewResponse>(`/api/reviews/${id}`);
    return response.data;
  },
};

export default api;
