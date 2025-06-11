import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTeacherSchema, type InsertTeacher } from "@shared/schema";
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

  const form = useForm<InsertTeacher>({
    resolver: zodResolver(insertTeacherSchema),
    defaultValues: {
      name: "",
      title: "",
      avatar_url: "",
      system_prompt_template: "You are {teacher_name}, {title}.\n\n{personality}\n\n{domain}\n\nYour teaching approach is {teaching_style} and you specialize in {specializations}.",
      personality: {
        primary_traits: [],
        teaching_style: "explanatory",
        formality_level: "casual",
        question_frequency: "medium",
        encouragement_level: "high",
        response_length: "moderate",
        use_examples: true,
        use_analogies: true,
        patience_level: "high",
        humor_usage: "occasional",
        signature_phrases: [],
        empathy_level: "high"
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

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (data: InsertTeacher) => {
    onSubmit(data);
  };

  const handleSaveDraft = () => {
    const data = form.getValues();
    onSaveDraft?.(data);
  };

  const isLastStep = currentStep === STEPS.length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          <div className="flex items-center w-full max-w-md">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center text-center relative">
                  <div
                    className={`rounded-full h-8 w-8 flex items-center justify-center text-sm font-medium transition-colors ${
                      currentStep > step.id
                        ? "bg-primary text-primary-foreground"
                        : currentStep === step.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.id ? <Check size={16} /> : step.id}
                  </div>
                  <div className="absolute top-10 text-center mt-2 w-32 text-xs font-medium">
                    {step.title}
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div className="flex-auto border-t-2 mx-4 border-muted" />
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
                        <Input type="url" placeholder="https://example.com/avatar.jpg" {...field} />
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
                        <FormLabel>Teaching Style</FormLabel>
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
                        <FormLabel>Formality Level</FormLabel>
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
                        <FormLabel>Question Frequency</FormLabel>
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
                        <FormLabel>Humor Usage</FormLabel>
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
                </div>

                <FormField
                  control={form.control}
                  name="personality.primary_traits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Traits</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {PERSONALITY_TRAITS.map((trait) => (
                          <div key={trait} className="flex items-center space-x-2">
                            <Checkbox
                              id={trait}
                              checked={field.value.includes(trait)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, trait]);
                                } else {
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

                <div>
                  <Label className="text-base font-medium">Capabilities</Label>
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
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
