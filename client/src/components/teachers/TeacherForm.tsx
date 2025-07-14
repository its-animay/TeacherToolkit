import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTeacherSchema, type InsertTeacher } from "@shared/schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ChevronLeft, ChevronRight, Check, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TeacherFormProps {
  initialData?: Partial<InsertTeacher>;
  onSubmit: (data: InsertTeacher) => void;
  onSaveDraft?: (data: Partial<InsertTeacher>) => void;
  isLoading?: boolean;
}

const STEPS = [
  { id: 1, title: "Basic Info", description: "Name, title, and avatar" },
  { id: 2, title: "Personality", description: "Teaching style and traits" },
  { id: 3, title: "Specialization", description: "Domain and capabilities" },
];

const TEACHING_STYLES = [
  { value: "socratic", label: "Socratic" },
  { value: "explanatory", label: "Explanatory" },
  { value: "practical", label: "Practical" },
  { value: "theoretical", label: "Theoretical" },
  { value: "adaptive", label: "Adaptive" },
];

const PERSONALITY_TRAITS = [
  "encouraging", "patient", "challenging", "humorous", 
  "formal", "casual", "analytical", "creative"
];

const DOMAINS = [
  "Mathematics", "Physics", "Computer Science", "Chemistry", 
  "Biology", "Languages", "History", "Literature", "Engineering"
];

const DIFFICULTY_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
];

export default function TeacherForm({ initialData, onSubmit, onSaveDraft, isLoading }: TeacherFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepErrors, setStepErrors] = useState<Record<number, string[]>>({});

  const form = useForm<InsertTeacher>({
    resolver: zodResolver(insertTeacherSchema),
    defaultValues: {
      name: "",
      title: "",
      avatar_url: "",
      system_prompt_template: "You are {teacher_name}, {title}.\n\n{personality}\n\n{domain}\n\nYour teaching approach is {teaching_style} and you specialize in {specializations}.",
      personality: {
        primary_traits: [],
        teaching_style: "",
        formality_level: "",
        question_frequency: "",
        encouragement_level: "",
        response_length: "",
        use_examples: true,
        use_analogies: true,
        patience_level: "",
        humor_usage: "",
        signature_phrases: [],
        empathy_level: ""
      },
      specialization: {
        primary_domain: "",
        specializations: [],
        min_difficulty: "beginner",
        max_difficulty: "expert",
        can_create_exercises: false,
        can_grade_work: false,
        can_create_curriculum: false,
        external_resources: []
      },
      adaptation: {
        adapts_to_learning_style: true,
        pace_adjustment: true,
        difficulty_scaling: true,
        remembers_context: true,
        tracks_progress: true
      },
      is_active: true,
      ...initialData
    }
  });

  const validateStep = (step: number): boolean => {
    const errors: string[] = [];
    const values = form.getValues();

    if (step === 1) {
      if (!values.name?.trim()) errors.push("Teacher Name is required");
      if (!values.avatar_url?.trim()) errors.push("Avatar URL is required");
      if (!values.system_prompt_template?.trim()) errors.push("System Prompt Template is required");
    } else if (step === 2) {
      if (!values.personality?.teaching_style) errors.push("Teaching Style is required");
      if (!values.personality?.formality_level) errors.push("Formality Level is required");
      if (!values.personality?.humor_usage) errors.push("Humor Usage is required");
      if (!values.personality?.question_frequency) errors.push("Question Frequency is required");
      if (!values.personality?.encouragement_level) errors.push("Encouragement Level is required");
      if (!values.personality?.response_length) errors.push("Response Length is required");
      if (!values.personality?.patience_level) errors.push("Patience Level is required");
      if (!values.personality?.empathy_level) errors.push("Empathy Level is required");
      if (values.personality?.primary_traits?.length === 0) errors.push("At least one primary trait is required");
      if ((values.personality?.primary_traits?.length || 0) > 3) errors.push("You can select up to 3 primary traits");
    } else if (step === 3) {
      if (!values.specialization?.primary_domain?.trim()) errors.push("Primary Domain is required");
      if (!values.specialization?.specializations?.length) errors.push("Specializations are required");
      
      const minDiff = ["beginner", "intermediate", "advanced", "expert"].indexOf(values.specialization?.min_difficulty || "beginner");
      const maxDiff = ["beginner", "intermediate", "advanced", "expert"].indexOf(values.specialization?.max_difficulty || "expert");
      if (minDiff > maxDiff) errors.push("Minimum difficulty must be less than or equal to maximum difficulty");
      
      const hasCapability = values.specialization?.can_create_exercises || 
                          values.specialization?.can_grade_work || 
                          values.specialization?.can_create_curriculum;
      if (!hasCapability) errors.push("At least one capability must be selected");
    }

    setStepErrors(prev => ({ ...prev, [step]: errors }));
    return errors.length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (data: InsertTeacher) => {
    if (validateStep(3)) {
      onSubmit(data);
    }
  };

  const handleSaveDraft = () => {
    const data = form.getValues();
    onSaveDraft?.(data);
  };

  const isLastStep = currentStep === STEPS.length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-12">
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-between w-full max-w-2xl">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center text-center w-full">
                  <div
                    className={`rounded-full h-10 w-10 flex items-center justify-center text-sm font-medium transition-colors mb-2 ${
                      currentStep > step.id
                        ? "gradient-bg text-white"
                        : currentStep === step.id
                        ? "gradient-bg text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {currentStep > step.id ? <Check size={16} /> : step.id}
                  </div>
                  <div className="text-xs font-medium text-slate-700 whitespace-nowrap">
                    {step.title}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 whitespace-nowrap">
                    {step.description}
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div className="flex-1 h-px bg-slate-300 mx-4 mt-[-20px]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gradient flex items-center space-x-2">
                  <span className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center text-white text-sm font-bold">1</span>
                  <span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teacher Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Dr. Jane Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Professor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="avatar_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avatar URL</FormLabel>
                      <FormControl>
                        <Input 
                          type="url" 
                          placeholder="https://example.com/avatar.jpg" 
                          {...field} 
                          value={field.value ?? ""} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="system_prompt_template"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>System Prompt Template</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={4}
                          placeholder="You are {teacher_name}, {title}..."
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Step 2: Personality */}
          {currentStep === 2 && (
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gradient flex items-center space-x-2">
                  <span className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center text-white text-sm font-bold">2</span>
                  <span>Personality & Teaching Style</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="personality.teaching_style"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teaching Style *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TEACHING_STYLES.map((style) => (
                              <SelectItem key={style.value} value={style.value}>
                                {style.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="personality.formality_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Formality Level *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="formal">Formal</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="mixed">Mixed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="personality.question_frequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question Frequency *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="personality.humor_usage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Humor Usage *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select humor level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="frequent">Frequent</SelectItem>
                            <SelectItem value="occasional">Occasional</SelectItem>
                            <SelectItem value="rare">Rare</SelectItem>
                            <SelectItem value="never">Never</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="personality.encouragement_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Encouragement Level *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select encouragement level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="personality.response_length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Response Length *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select response length" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="brief">Brief</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="detailed">Detailed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="personality.patience_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patience Level *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select patience level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="personality.empathy_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Empathy Level *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select empathy level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="personality.primary_traits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Traits (max 3) *</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {PERSONALITY_TRAITS.map((trait) => (
                          <div key={trait} className="flex items-center space-x-2">
                            <Checkbox
                              id={trait}
                              checked={field.value.includes(trait)}
                              disabled={!field.value.includes(trait) && field.value.length >= 3}
                              onCheckedChange={(checked) => {
                                if (checked && field.value.length < 3) {
                                  field.onChange([...field.value, trait]);
                                } else if (!checked) {
                                  field.onChange(field.value.filter((t) => t !== trait));
                                }
                              }}
                            />
                            <Label htmlFor={trait} className="text-sm capitalize">
                              {trait}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Selected: {field.value.length}/3
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="personality.use_examples"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Use Examples</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="personality.use_analogies"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Use Analogies</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Specialization */}
          {currentStep === 3 && (
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gradient flex items-center space-x-2">
                  <span className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center text-white text-sm font-bold">3</span>
                  <span>Specialization & Capabilities</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="specialization.primary_domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Domain *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select domain" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DOMAINS.map((domain) => (
                            <SelectItem key={domain} value={domain}>
                              {domain}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="specialization.min_difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Difficulty</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DIFFICULTY_LEVELS.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specialization.max_difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Difficulty</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DIFFICULTY_LEVELS.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="specialization.specializations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specializations *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter specializations separated by commas"
                          value={field.value?.join(', ') || ''}
                          onChange={(e) => {
                            const specs = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                            field.onChange(specs);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <Label className="text-base font-medium">Capabilities (at least one required) *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                    <FormField
                      control={form.control}
                      name="specialization.can_create_exercises"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Create Exercises</FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="specialization.can_grade_work"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Grade Work</FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="specialization.can_create_curriculum"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Create Curriculum</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Adaptation Settings</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <FormField
                      control={form.control}
                      name="adaptation.adapts_to_learning_style"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Adapts to Learning Style</FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="adaptation.pace_adjustment"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Pace Adjustment</FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="adaptation.difficulty_scaling"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Difficulty Scaling</FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="adaptation.remembers_context"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Remembers Context</FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="adaptation.tracks_progress"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Tracks Progress</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Form Navigation */}
          <Card className="glass-effect">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={isLoading}
                  className="rounded-xl hover:bg-slate-50 border-slate-300"
                >
                  <Save className="mr-2" size={16} />
                  Save Draft
                </Button>

                <div className="flex space-x-3">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={isLoading}
                      className="rounded-xl hover:bg-slate-50 border-slate-300"
                    >
                      <ChevronLeft className="mr-2" size={16} />
                      Previous
                    </Button>
                  )}

                  {!isLastStep ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={isLoading}
                      className="gradient-bg text-white rounded-xl btn-shine hover:shadow-lg"
                    >
                      Next
                      <ChevronRight className="ml-2" size={16} />
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="gradient-bg text-white rounded-xl btn-shine hover:shadow-lg"
                    >
                      <Check className="mr-2" size={16} />
                      Create Teacher
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Display validation errors if any */}
              {stepErrors[currentStep] && stepErrors[currentStep].length > 0 && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="text-red-700">
                    <h3 className="font-semibold mb-2">Please fix the following errors:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {stepErrors[currentStep].map((error, index) => (
                        <li key={index} className="text-sm">{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
