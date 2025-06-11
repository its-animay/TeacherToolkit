import { pgTable, text, serial, integer, boolean, jsonb, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Teacher personality schema
const personalitySchema = z.object({
  primary_traits: z.array(z.string()).default([]),
  teaching_style: z.string().default("explanatory"),
  formality_level: z.string().default("casual"),
  question_frequency: z.string().default("moderate"),
  encouragement_level: z.string().default("high"),
  response_length: z.string().default("moderate"),
  use_examples: z.boolean().default(true),
  use_analogies: z.boolean().default(true),
  patience_level: z.string().default("high"),
  humor_usage: z.string().default("moderate"),
  signature_phrases: z.array(z.string()).default([]),
  empathy_level: z.string().default("high")
});

// Teacher specialization schema
const specializationSchema = z.object({
  primary_domain: z.string(),
  specializations: z.array(z.string()).default([]),
  min_difficulty: z.string().default("beginner"),
  max_difficulty: z.string().default("expert"),
  can_create_exercises: z.boolean().default(false),
  can_grade_work: z.boolean().default(false),
  can_create_curriculum: z.boolean().default(false),
  external_resources: z.array(z.string()).default([])
});

// Teacher adaptation schema
const adaptationSchema = z.object({
  adapts_to_learning_style: z.boolean().default(false),
  pace_adjustment: z.boolean().default(false),
  difficulty_scaling: z.boolean().default(false),
  remembers_context: z.boolean().default(false),
  tracks_progress: z.boolean().default(false)
});

export const teachers = pgTable("teachers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  avatar_url: text("avatar_url"),
  personality: jsonb("personality").$type<z.infer<typeof personalitySchema>>().notNull(),
  specialization: jsonb("specialization").$type<z.infer<typeof specializationSchema>>().notNull(),
  adaptation: jsonb("adaptation").$type<z.infer<typeof adaptationSchema>>().notNull(),
  system_prompt_template: text("system_prompt_template"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  created_by: text("created_by"),
  is_active: boolean("is_active").default(true).notNull(),
  total_sessions: integer("total_sessions").default(0).notNull(),
  average_rating: real("average_rating")
});

export const insertTeacherSchema = createInsertSchema(teachers).omit({
  id: true,
  created_at: true,
  updated_at: true,
  total_sessions: true,
  average_rating: true
}).extend({
  personality: personalitySchema,
  specialization: specializationSchema,
  adaptation: adaptationSchema
});

export type InsertTeacher = z.infer<typeof insertTeacherSchema>;
export type Teacher = typeof teachers.$inferSelect;

// Rating table for teacher ratings
export const ratings = pgTable("ratings", {
  id: serial("id").primaryKey(),
  teacher_id: text("teacher_id").notNull().references(() => teachers.id, { onDelete: 'cascade' }),
  rating: real("rating").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull()
});

export const insertRatingSchema = createInsertSchema(ratings).omit({
  id: true,
  created_at: true
});

export type InsertRating = z.infer<typeof insertRatingSchema>;
export type Rating = typeof ratings.$inferSelect;

// Users table (keeping existing structure)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
