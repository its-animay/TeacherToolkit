import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTeacherSchema, insertRatingSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Enhanced Teacher API routes - Use environment variable for base URL
  const BASE_URL = process.env.VITE_API_BASE_URL || "http://localhost:3000";
  const API_VERSION = process.env.API_VERSION || "v1";
  const API_BASE = `${BASE_URL}/enhanced-teacher`;
  
  // Alternative: If you just want the path without full URL
  // const API_BASE = `/api/${API_VERSION}/enhanced-teacher`;

  // List all teachers
  app.get("/enhanced-teacher", async (req, res) => {
    try {
      const teachers = await storage.getAllTeachers();
      res.json(teachers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch teachers" });
    }
  });

  // Create new teacher
  app.post("/enhanced-teacher", async (req, res) => {
    try {
      const validatedData = insertTeacherSchema.parse(req.body);
      const teacher = await storage.createTeacher(validatedData);
      res.status(201).json(teacher);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid teacher data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create teacher" });
      }
    }
  });

  // Get specific teacher
  app.get("/enhanced-teacher/:teacher_id", async (req, res) => {
    try {
      const teacher = await storage.getTeacher(req.params.teacher_id);
      if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
      }
      res.json(teacher);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch teacher" });
    }
  });

  // Update teacher
  app.put("/enhanced-teacher/:teacher_id", async (req, res) => {
    try {
      const updates = req.body;
      const teacher = await storage.updateTeacher(req.params.teacher_id, updates);
      if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
      }
      res.json(teacher);
    } catch (error) {
      res.status(500).json({ error: "Failed to update teacher" });
    }
  });

  // Delete teacher
  app.delete("/enhanced-teacher/:teacher_id", async (req, res) => {
    try {
      const deleted = await storage.deleteTeacher(req.params.teacher_id);
      if (!deleted) {
        return res.status(404).json({ error: "Teacher not found" });
      }
      res.json({ message: `Enhanced teacher ${req.params.teacher_id} deleted successfully` });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete teacher" });
    }
  });

  // Search teachers with filters
  app.get("/enhanced-teacher/search", async (req, res) => {
    try {
      const filters = req.query;
      const result = await storage.searchTeachers(filters);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to search teachers" });
    }
  });

  // Get teachers by domain
  app.get("/enhanced-teacher/domain/:domain", async (req, res) => {
    try {
      const teachers = await storage.getTeachersByDomain(req.params.domain);
      if (teachers.length === 0) {
        return res.status(404).json({ error: "No teachers found for this domain" });
      }
      res.json(teachers[0]); // Return first teacher for the domain
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch teachers by domain" });
    }
  });

  // Add teacher rating
  app.post("/enhanced-teacher/:teacher_id/rating", async (req, res) => {
    try {
      const ratingData = insertRatingSchema.parse({
        teacher_id: req.params.teacher_id,
        rating: req.body.rating
      });
      await storage.addRating(ratingData);
      res.json({ message: `Rating added successfully for teacher ${req.params.teacher_id}` });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid rating data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to add rating" });
      }
    }
  });

  // Increment session count
  app.post("/enhanced-teacher/:teacher_id/increment-session", async (req, res) => {
    try {
      const success = await storage.incrementSession(req.params.teacher_id);
      if (!success) {
        return res.status(404).json({ error: "Teacher not found" });
      }
      res.json({ message: `Session count incremented for teacher ${req.params.teacher_id}` });
    } catch (error) {
      res.status(500).json({ error: "Failed to increment session count" });
    }
  });

  // Generate system prompt
  app.post("/enhanced-teacher/:teacher_id/generate-prompt", async (req, res) => {
    try {
      const teacher = await storage.getTeacher(req.params.teacher_id);
      if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
      }

      const context = req.body.context || {};
      let systemPrompt = teacher.system_prompt_template || 
        `You are ${teacher.name}, ${teacher.title}.\n\nYou have these personality traits: ${teacher.personality.primary_traits.join(', ')}.\nYour teaching style is ${teacher.personality.teaching_style}.\nYou specialize in ${teacher.specialization.primary_domain}.`;

      // Replace placeholders with actual values
      systemPrompt = systemPrompt
        .replace(/{teacher_name}/g, teacher.name)
        .replace(/{title}/g, teacher.title)
        .replace(/{domain}/g, teacher.specialization.primary_domain);

      res.json({
        teacher_id: teacher.id,
        name: teacher.name,
        system_prompt: systemPrompt
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate system prompt" });
    }
  });

  // Create default teachers
  app.post("/enhanced-teacher/create-defaults", async (req, res) => {
    try {
      const defaultTeachers = [
        {
          name: "Dr. Elizabeth Chen",
          title: "Professor",
          avatar_url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
          personality: {
            primary_traits: ["analytical", "encouraging", "patient"],
            teaching_style: "socratic",
            formality_level: "casual",
            question_frequency: "high",
            encouragement_level: "high",
            response_length: "moderate",
            use_examples: true,
            use_analogies: true,
            patience_level: "high",
            humor_usage: "moderate",
            signature_phrases: ["Let's think about this step by step", "Great question!", "What do you think might happen if...?"],
            empathy_level: "high"
          },
          specialization: {
            primary_domain: "Mathematics",
            specializations: ["Calculus", "Linear Algebra", "Statistics"],
            min_difficulty: "beginner",
            max_difficulty: "expert",
            can_create_exercises: true,
            can_grade_work: true,
            can_create_curriculum: true,
            external_resources: ["Khan Academy", "Wolfram Alpha", "MIT OpenCourseWare"]
          },
          adaptation: {
            adapts_to_learning_style: true,
            pace_adjustment: true,
            difficulty_scaling: true,
            remembers_context: true,
            tracks_progress: true
          }
        },
        {
          name: "Alex Rivera",
          title: "Senior Developer",
          avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
          personality: {
            primary_traits: ["practical", "creative", "humorous"],
            teaching_style: "practical",
            formality_level: "casual",
            question_frequency: "moderate",
            encouragement_level: "high",
            response_length: "moderate",
            use_examples: true,
            use_analogies: true,
            patience_level: "high",
            humor_usage: "frequent",
            signature_phrases: ["Let's code this up!", "Here's a neat trick", "Don't worry, we've all been there"],
            empathy_level: "high"
          },
          specialization: {
            primary_domain: "Programming",
            specializations: ["JavaScript", "React", "Node.js", "Python"],
            min_difficulty: "beginner",
            max_difficulty: "advanced",
            can_create_exercises: true,
            can_grade_work: true,
            can_create_curriculum: true,
            external_resources: ["MDN Web Docs", "freeCodeCamp", "Stack Overflow"]
          },
          adaptation: {
            adapts_to_learning_style: true,
            pace_adjustment: true,
            difficulty_scaling: true,
            remembers_context: true,
            tracks_progress: true
          }
        }
      ];

      const createdTeachers = [];
      for (const teacherData of defaultTeachers) {
        const teacher = await storage.createTeacher(teacherData);
        createdTeachers.push(teacher);
      }

      res.json({
        message: "Default teachers created",
        teachers: createdTeachers,
        count: createdTeachers.length
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to create default teachers" });
    }
  });

  // Get all available styles and options
  app.get("/enhanced-teacher/styles/all", async (req, res) => {
    try {
      const styles = {
        teaching_styles: [
          { value: "socratic", label: "Socratic" },
          { value: "explanatory", label: "Explanatory" },
          { value: "practical", label: "Practical" },
          { value: "theoretical", label: "Theoretical" },
          { value: "adaptive", label: "Adaptive" }
        ],
        personality_traits: [
          { value: "encouraging", label: "Encouraging" },
          { value: "patient", label: "Patient" },
          { value: "challenging", label: "Challenging" },
          { value: "humorous", label: "Humorous" },
          { value: "formal", label: "Formal" },
          { value: "casual", label: "Casual" },
          { value: "analytical", label: "Analytical" },
          { value: "creative", label: "Creative" }
        ],
        difficulty_levels: [
          { value: "beginner", label: "Beginner" },
          { value: "intermediate", label: "Intermediate" },
          { value: "advanced", label: "Advanced" },
          { value: "expert", label: "Expert" }
        ]
      };
      res.json(styles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch styles" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}