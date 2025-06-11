import { apiRequest } from "./queryClient";
import type { Teacher, InsertTeacher, InsertRating } from "@shared/schema";

const API_BASE = "/enhanced-teacher";

// Get API base URL dynamically with fallbacks
const getApiBaseUrl = (): string => {
  // Priority: localStorage > environment variable > default fallback
  return localStorage.getItem('enhanced_teacher_api_url') || 
         import.meta.env.VITE_API_BASE_URL || 
         'http://localhost:8090/api/v1';
};

// Enhanced API request function that uses the external API base URL
const enhancedApiRequest = async (method: string, endpoint: string, body?: any): Promise<Response> => {
  const apiBaseUrl = getApiBaseUrl();
  const fullUrl = `${apiBaseUrl}${endpoint}`;
  
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  if (body && method !== "GET") {
    config.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(fullUrl, config);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }
    
    return response;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Network Error: Unable to connect to ${apiBaseUrl}. Please check your API configuration in Settings.`);
    }
    throw error;
  }
};

export const teacherApi = {
  // Get all teachers
  getTeachers: async (): Promise<Teacher[]> => {
    const response = await enhancedApiRequest("GET", `${API_BASE}/`);
    return response.json();
  },

  // Get teacher by ID
  getTeacher: async (id: string): Promise<Teacher> => {
    const response = await enhancedApiRequest("GET", `${API_BASE}/${id}`);
    return response.json();
  },

  // Create teacher
  createTeacher: async (data: InsertTeacher): Promise<Teacher> => {
    const response = await enhancedApiRequest("POST", `${API_BASE}/`, data);
    return response.json();
  },

  // Update teacher
  updateTeacher: async (id: string, data: Partial<InsertTeacher>): Promise<Teacher> => {
    const response = await enhancedApiRequest("PUT", `${API_BASE}/${id}`, data);
    return response.json();
  },

  // Delete teacher
  deleteTeacher: async (id: string): Promise<{ message: string }> => {
    const response = await enhancedApiRequest("DELETE", `${API_BASE}/${id}`);
    return response.json();
  },

  // Search teachers
  searchTeachers: async (filters: Record<string, any>): Promise<{
    teachers: Teacher[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      total_pages: number;
    };
  }> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && value !== 'all') {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.append(key, String(value));
        }
      }
    });
    
    const response = await enhancedApiRequest("GET", `${API_BASE}/search?${params}`);
    return response.json();
  },

  // Get teachers by domain
  getTeachersByDomain: async (domain: string): Promise<Teacher> => {
    const response = await enhancedApiRequest("GET", `${API_BASE}/domain/${domain}`);
    return response.json();
  },

  // Add rating
  addRating: async (teacherId: string, rating: number): Promise<{ message: string }> => {
    const response = await enhancedApiRequest("POST", `${API_BASE}/${teacherId}/rating`, { rating });
    return response.json();
  },

  // Increment session
  incrementSession: async (teacherId: string): Promise<{ message: string }> => {
    const response = await enhancedApiRequest("POST", `${API_BASE}/${teacherId}/increment-session`);
    return response.json();
  },

  // Generate prompt
  generatePrompt: async (teacherId: string, context?: any): Promise<{
    teacher_id: string;
    name: string;
    system_prompt: string;
  }> => {
    const response = await enhancedApiRequest("POST", `${API_BASE}/${teacherId}/generate-prompt`, { context });
    return response.json();
  },

  // Create defaults
  createDefaults: async (): Promise<{
    message: string;
    teachers: Teacher[];
    count: number;
  }> => {
    const response = await enhancedApiRequest("POST", `${API_BASE}/create-defaults`);
    return response.json();
  },

  // Get styles
  getStyles: async (): Promise<{
    teaching_styles: Array<{ value: string; label: string }>;
    personality_traits: Array<{ value: string; label: string }>;
    difficulty_levels: Array<{ value: string; label: string }>;
  }> => {
    const response = await enhancedApiRequest("GET", `${API_BASE}/styles/all`);
    return response.json();
  }
};
