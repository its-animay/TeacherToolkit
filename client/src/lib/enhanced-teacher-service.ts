import { apiRequest } from "./queryClient";

export interface EnhancedTeacher {
  id: string;
  name: string;
  domain: string;
  teaching_style: string;
  personality_traits: string[];
  expertise_areas: string[];
  bio: string;
  avatar_url: string;
  email: string;
  background: string;
  preferred_language: string;
  difficulty_level: string;
  max_session_length: number;
  response_time: string;
  availability: string;
  session_count: number;
  average_rating: number;
  total_ratings: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  instructorId?: string;
}

export interface InstructorTeacherMapping {
  instructorId: string;
  teacherId: string;
  createdAt: string;
}

class EnhancedTeacherService {
  private baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://mordernera.com/api/v1';
  
  private getAuthHeaders() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = user.access_token;
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getTeacher(teacherId: string): Promise<EnhancedTeacher> {
    const response = await apiRequest("GET", `${this.baseUrl}/enhanced-teacher/${teacherId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch teacher: ${response.status}`);
    }
    
    return response.json();
  }

  async getTeacherByInstructor(instructorId: string): Promise<EnhancedTeacher | null> {
    try {
      const response = await apiRequest("GET", `${this.baseUrl}/enhanced-teacher/by-instructor/${instructorId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null; // No teacher found for this instructor
        }
        throw new Error(`Failed to fetch teacher by instructor: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching teacher by instructor:', error);
      return null;
    }
  }

  async getAllTeachers(): Promise<EnhancedTeacher[]> {
    const response = await apiRequest("GET", `${this.baseUrl}/enhanced-teacher`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch teachers: ${response.status}`);
    }
    
    return response.json();
  }

  async getInstructorTeacherMappings(): Promise<InstructorTeacherMapping[]> {
    try {
      const response = await apiRequest("GET", `${this.baseUrl}/instructor-teacher-mappings`);
      
      if (!response.ok) {
        return [];
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching instructor-teacher mappings:', error);
      return [];
    }
  }

  async createTeacher(teacherData: any): Promise<EnhancedTeacher> {
    const response = await apiRequest("POST", `${this.baseUrl}/enhanced-teacher`, teacherData);
    
    if (!response.ok) {
      throw new Error(`Failed to create teacher: ${response.status}`);
    }
    
    return response.json();
  }

  async updateTeacher(teacherId: string, teacherData: any): Promise<EnhancedTeacher> {
    const response = await apiRequest("PUT", `${this.baseUrl}/enhanced-teacher/${teacherId}`, teacherData);
    
    if (!response.ok) {
      throw new Error(`Failed to update teacher: ${response.status}`);
    }
    
    return response.json();
  }

  async deleteTeacher(teacherId: string): Promise<boolean> {
    const response = await apiRequest("DELETE", `${this.baseUrl}/enhanced-teacher/${teacherId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to delete teacher: ${response.status}`);
    }
    
    return true;
  }
}

export const enhancedTeacherService = new EnhancedTeacherService();