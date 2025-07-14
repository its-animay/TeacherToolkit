import { getUserFromStorage } from './auth';
import axios from 'axios';

export interface Instructor {
  id: string;
  email: string;
  username: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface InstructorListResponse {
  instructors: Instructor[];
  total: number;
  skip: number;
  limit: number;
}

export interface CreateInstructorData {
  email: string;
  password: string;
  full_name: string;
  username: string;
  phone_number?: string;
  avatar_url?: string;
  bio?: string;
}

class InstructorService {
  private baseUrl = import.meta.env.VITE_INSTRUCTOR_API_URL || 'https://mordernera.com/api/v1/instructor';

  private getAuthHeaders() {
    const user = getUserFromStorage();
    const token = user?.access_token;
    
    return {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    };
  }

  async getInstructors(params?: {
    skip?: number;
    limit?: number;
    sort_by?: string;
    sort_dir?: 'asc' | 'desc';
  }): Promise<InstructorListResponse> {
    const queryParams = new URLSearchParams({
      skip: (params?.skip || 0).toString(),
      limit: (params?.limit || 50).toString(),
      sort_by: params?.sort_by || 'created_at',
      sort_dir: params?.sort_dir || 'desc',
    });

    const response = await axios.get(`${this.baseUrl}/instructors?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });

    return response.data;
  }

  async createInstructor(data: CreateInstructorData): Promise<Instructor> {
    const payload = new URLSearchParams();
    payload.append('instructor_data', JSON.stringify(data));

    const response = await axios.post(
      `${this.baseUrl}/create-instructor`,
      payload,
      {
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data;
  }

  async deleteInstructor(id: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/instructors/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  async getInstructor(id: string): Promise<Instructor> {
    const response = await axios.get(`${this.baseUrl}/instructors/${id}`, {
      headers: this.getAuthHeaders(),
    });

    return response.data;
  }

  async updateInstructor(id: string, data: Partial<CreateInstructorData>): Promise<Instructor> {
    const payload = new URLSearchParams();
    payload.append('instructor_data', JSON.stringify(data));

    const response = await axios.put(
      `${this.baseUrl}/instructors/${id}`,
      payload,
      {
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data;
  }
}

export const instructorService = new InstructorService();
export default InstructorService;