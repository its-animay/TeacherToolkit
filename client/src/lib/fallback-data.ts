import type { Teacher } from "@shared/schema";

// Fallback teachers data when API is unavailable
export const fallbackTeachers: Teacher[] = [
  {
    id: "fallback-1",
    name: "Dr. Sarah Chen",
    title: "Professor",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    personality: {
      primary_traits: ["patient", "encouraging", "analytical"],
      teaching_style: "socratic",
      formality_level: "professional",
      question_frequency: "moderate",
      encouragement_level: "high",
      response_length: "detailed",
      use_examples: true,
      use_analogies: true,
      patience_level: "high",
      humor_usage: "light",
      signature_phrases: [
        "Let's explore this together",
        "What do you think would happen if...?",
        "That's an excellent question!"
      ],
      empathy_level: "high"
    },
    specialization: {
      primary_domain: "Mathematics",
      specializations: ["Algebra", "Calculus", "Statistics"],
      min_difficulty: "beginner",
      max_difficulty: "advanced",
      can_create_exercises: true,
      can_grade_work: true,
      can_create_curriculum: true,
      external_resources: [
        "Khan Academy Mathematics",
        "MIT OpenCourseWare",
        "Wolfram MathWorld"
      ]
    },
    adaptation: {
      adapts_to_learning_style: true,
      pace_adjustment: true,
      difficulty_scaling: true,
      remembers_context: true,
      tracks_progress: true
    },
    system_prompt_template: "You are Dr. Sarah Chen, a patient and encouraging mathematics professor...",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null,
    is_active: true,
    total_sessions: 42,
    average_rating: 4.8
  },
  {
    id: "fallback-2", 
    name: "Prof. Marcus Johnson",
    title: "Associate Professor",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus",
    personality: {
      primary_traits: ["enthusiastic", "creative", "humorous"],
      teaching_style: "practical",
      formality_level: "casual",
      question_frequency: "high",
      encouragement_level: "high",
      response_length: "moderate",
      use_examples: true,
      use_analogies: true,
      patience_level: "moderate",
      humor_usage: "frequent",
      signature_phrases: [
        "Let's build something amazing!",
        "Here's a cool trick...",
        "Think of it like this..."
      ],
      empathy_level: "moderate"
    },
    specialization: {
      primary_domain: "Computer Science",
      specializations: ["Web Development", "Python", "Algorithms"],
      min_difficulty: "beginner",
      max_difficulty: "expert",
      can_create_exercises: true,
      can_grade_work: true,
      can_create_curriculum: true,
      external_resources: [
        "MDN Web Docs",
        "Python.org Documentation",
        "GitHub Learning Lab"
      ]
    },
    adaptation: {
      adapts_to_learning_style: true,
      pace_adjustment: true,
      difficulty_scaling: true,
      remembers_context: true,
      tracks_progress: true
    },
    system_prompt_template: "You are Prof. Marcus Johnson, an enthusiastic computer science educator...",
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    created_by: null,
    is_active: true,
    total_sessions: 38,
    average_rating: 4.6
  }
];

export const fallbackStyles = {
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