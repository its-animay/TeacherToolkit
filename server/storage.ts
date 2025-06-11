import { teachers, type Teacher, type InsertTeacher, ratings, type InsertRating, type Rating, users, type User, type InsertUser } from "@shared/schema";
import { nanoid } from "nanoid";

export interface IStorage {
  // User methods (existing)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Teacher methods
  getTeacher(id: string): Promise<Teacher | undefined>;
  getAllTeachers(): Promise<Teacher[]>;
  createTeacher(teacher: InsertTeacher): Promise<Teacher>;
  updateTeacher(id: string, updates: Partial<InsertTeacher>): Promise<Teacher | undefined>;
  deleteTeacher(id: string): Promise<boolean>;
  searchTeachers(filters: any): Promise<{ teachers: Teacher[], pagination: any }>;
  getTeachersByDomain(domain: string): Promise<Teacher[]>;
  incrementSession(teacherId: string): Promise<boolean>;
  
  // Rating methods
  addRating(rating: InsertRating): Promise<Rating>;
  getTeacherRatings(teacherId: string): Promise<Rating[]>;
  calculateAverageRating(teacherId: string): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private teachers: Map<string, Teacher>;
  private teacherRatings: Map<string, Rating[]>;
  private currentUserId: number;
  private currentRatingId: number;

  constructor() {
    this.users = new Map();
    this.teachers = new Map();
    this.teacherRatings = new Map();
    this.currentUserId = 1;
    this.currentRatingId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Teacher methods
  async getTeacher(id: string): Promise<Teacher | undefined> {
    return this.teachers.get(id);
  }

  async getAllTeachers(): Promise<Teacher[]> {
    return Array.from(this.teachers.values()).sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  async createTeacher(insertTeacher: InsertTeacher): Promise<Teacher> {
    const id = nanoid();
    const now = new Date();
    const teacher: Teacher = {
      id,
      name: insertTeacher.name,
      title: insertTeacher.title,
      avatar_url: insertTeacher.avatar_url || null,
      personality: insertTeacher.personality,
      specialization: insertTeacher.specialization,
      adaptation: insertTeacher.adaptation,
      system_prompt_template: insertTeacher.system_prompt_template ?? null,
      created_at: now,
      updated_at: now,
      created_by: insertTeacher.created_by || null,
      is_active: insertTeacher.is_active ?? true,
      total_sessions: 0,
      average_rating: null
    };
    this.teachers.set(id, teacher);
    return teacher;
  }

  async updateTeacher(id: string, updates: Partial<InsertTeacher>): Promise<Teacher | undefined> {
    const teacher = this.teachers.get(id);
    if (!teacher) return undefined;

    const updatedTeacher: Teacher = {
      ...teacher,
      ...updates,
      updated_at: new Date()
    };
    this.teachers.set(id, updatedTeacher);
    return updatedTeacher;
  }

  async deleteTeacher(id: string): Promise<boolean> {
    const deleted = this.teachers.delete(id);
    if (deleted) {
      this.teacherRatings.delete(id);
    }
    return deleted;
  }

  async searchTeachers(filters: any): Promise<{ teachers: Teacher[], pagination: any }> {
    let teachers = Array.from(this.teachers.values());

    // Apply filters
    if (filters.domain) {
      teachers = teachers.filter(t => 
        t.specialization.primary_domain.toLowerCase().includes(filters.domain.toLowerCase())
      );
    }

    if (filters.teaching_style) {
      teachers = teachers.filter(t => 
        t.personality.teaching_style === filters.teaching_style
      );
    }

    if (filters.difficulty_level) {
      teachers = teachers.filter(t => 
        t.specialization.min_difficulty === filters.difficulty_level ||
        t.specialization.max_difficulty === filters.difficulty_level
      );
    }

    if (filters.traits && filters.traits.length > 0) {
      teachers = teachers.filter(t => 
        filters.traits.some((trait: string) => t.personality.primary_traits.includes(trait))
      );
    }

    if (filters.query) {
      const query = filters.query.toLowerCase();
      teachers = teachers.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.title.toLowerCase().includes(query) ||
        t.specialization.primary_domain.toLowerCase().includes(query)
      );
    }

    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const offset = (page - 1) * limit;
    const total = teachers.length;
    const paginatedTeachers = teachers.slice(offset, offset + limit);

    return {
      teachers: paginatedTeachers,
      pagination: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit)
      }
    };
  }

  async getTeachersByDomain(domain: string): Promise<Teacher[]> {
    return Array.from(this.teachers.values()).filter(t => 
      t.specialization.primary_domain.toLowerCase() === domain.toLowerCase()
    );
  }

  async incrementSession(teacherId: string): Promise<boolean> {
    const teacher = this.teachers.get(teacherId);
    if (!teacher) return false;

    teacher.total_sessions += 1;
    teacher.updated_at = new Date();
    this.teachers.set(teacherId, teacher);
    return true;
  }

  // Rating methods
  async addRating(insertRating: InsertRating): Promise<Rating> {
    const id = this.currentRatingId++;
    const rating: Rating = {
      ...insertRating,
      id,
      created_at: new Date()
    };

    // Store rating
    const teacherRatings = this.teacherRatings.get(insertRating.teacher_id) || [];
    teacherRatings.push(rating);
    this.teacherRatings.set(insertRating.teacher_id, teacherRatings);

    // Update teacher's average rating
    await this.updateTeacherAverageRating(insertRating.teacher_id);

    return rating;
  }

  async getTeacherRatings(teacherId: string): Promise<Rating[]> {
    return this.teacherRatings.get(teacherId) || [];
  }

  async calculateAverageRating(teacherId: string): Promise<number> {
    const ratings = await this.getTeacherRatings(teacherId);
    if (ratings.length === 0) return 0;
    
    const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return sum / ratings.length;
  }

  private async updateTeacherAverageRating(teacherId: string): Promise<void> {
    const teacher = this.teachers.get(teacherId);
    if (!teacher) return;

    const averageRating = await this.calculateAverageRating(teacherId);
    teacher.average_rating = averageRating;
    teacher.updated_at = new Date();
    this.teachers.set(teacherId, teacher);
  }
}

export const storage = new MemStorage();
