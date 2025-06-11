import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Rating } from "@/components/ui/rating";
import { Separator } from "@/components/ui/separator";
import { Edit, MessageSquare, TrendingUp, Check, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import type { Teacher } from "@shared/schema";

interface TeacherDetailProps {
  teacher: Teacher;
  onEdit?: () => void;
  onGeneratePrompt?: () => void;
}

export default function TeacherDetail({ teacher, onEdit, onGeneratePrompt }: TeacherDetailProps) {
  const initials = teacher.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={teacher.avatar_url || ""} alt={teacher.name} />
                <AvatarFallback className="text-xl">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{teacher.name}</h1>
                <p className="text-lg text-muted-foreground">{teacher.title}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Rating value={teacher.average_rating || 0} readOnly />
                    <span className="font-medium">
                      {teacher.average_rating?.toFixed(1) || "No ratings"}
                    </span>
                  </div>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="text-sm text-muted-foreground">
                    {teacher.total_sessions} sessions
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant={teacher.is_active ? "default" : "secondary"}>
                {teacher.is_active ? "Active" : "Inactive"}
              </Badge>
              <Button 
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                asChild
              >
                <Link href={`/chat/${teacher.id}`}>
                  <MessageCircle className="mr-2" size={16} />
                  Chat with {teacher.name.split(' ')[0]}
                </Link>
              </Button>
              <Button onClick={onEdit}>
                <Edit className="mr-2" size={16} />
                Edit
              </Button>
              <Button variant="outline" onClick={onGeneratePrompt}>
                <MessageSquare className="mr-2" size={16} />
                Generate Prompt
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personality */}
        <Card>
          <CardHeader>
            <CardTitle>Personality</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Teaching Style</p>
                <p className="capitalize">{teacher.personality.teaching_style}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Formality Level</p>
                <p className="capitalize">{teacher.personality.formality_level}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Humor Usage</p>
                <p className="capitalize">{teacher.personality.humor_usage}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Patience Level</p>
                <p className="capitalize">{teacher.personality.patience_level}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Primary Traits</p>
              <div className="flex flex-wrap gap-2">
                {teacher.personality.primary_traits.map((trait) => (
                  <Badge key={trait} variant="outline" className="capitalize">
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                {teacher.personality.use_examples && <Check size={16} className="text-green-600" />}
                <span className="text-sm">Uses Examples</span>
              </div>
              <div className="flex items-center space-x-2">
                {teacher.personality.use_analogies && <Check size={16} className="text-green-600" />}
                <span className="text-sm">Uses Analogies</span>
              </div>
            </div>

            {teacher.personality.signature_phrases.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Signature Phrases</p>
                <div className="space-y-1">
                  {teacher.personality.signature_phrases.map((phrase, index) => (
                    <p key={index} className="text-sm italic text-muted-foreground">
                      "{phrase}"
                    </p>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Specialization */}
        <Card>
          <CardHeader>
            <CardTitle>Specialization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Primary Domain</p>
              <Badge variant="secondary" className="mt-1">
                {teacher.specialization.primary_domain}
              </Badge>
            </div>

            {teacher.specialization.specializations.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Specializations</p>
                <div className="flex flex-wrap gap-2">
                  {teacher.specialization.specializations.map((spec) => (
                    <Badge key={spec} variant="outline">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Difficulty Range</p>
                <p className="capitalize">
                  {teacher.specialization.min_difficulty} - {teacher.specialization.max_difficulty}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Capabilities</p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  {teacher.specialization.can_create_exercises && <Check size={16} className="text-green-600" />}
                  <span className="text-sm">Create Exercises</span>
                </div>
                <div className="flex items-center space-x-2">
                  {teacher.specialization.can_grade_work && <Check size={16} className="text-green-600" />}
                  <span className="text-sm">Grade Work</span>
                </div>
                <div className="flex items-center space-x-2">
                  {teacher.specialization.can_create_curriculum && <Check size={16} className="text-green-600" />}
                  <span className="text-sm">Create Curriculum</span>
                </div>
              </div>
            </div>

            {teacher.specialization.external_resources.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">External Resources</p>
                <div className="space-y-1">
                  {teacher.specialization.external_resources.map((resource, index) => (
                    <p key={index} className="text-sm text-muted-foreground">
                      • {resource}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Adaptation Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Adaptation Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                {teacher.adaptation.adapts_to_learning_style && <Check size={16} className="text-green-600" />}
                <span className="text-sm">Adapts to Learning Style</span>
              </div>
              <div className="flex items-center space-x-2">
                {teacher.adaptation.pace_adjustment && <Check size={16} className="text-green-600" />}
                <span className="text-sm">Pace Adjustment</span>
              </div>
              <div className="flex items-center space-x-2">
                {teacher.adaptation.difficulty_scaling && <Check size={16} className="text-green-600" />}
                <span className="text-sm">Difficulty Scaling</span>
              </div>
              <div className="flex items-center space-x-2">
                {teacher.adaptation.remembers_context && <Check size={16} className="text-green-600" />}
                <span className="text-sm">Remembers Context</span>
              </div>
              <div className="flex items-center space-x-2">
                {teacher.adaptation.tracks_progress && <Check size={16} className="text-green-600" />}
                <span className="text-sm">Tracks Progress</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{teacher.total_sessions}</p>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {teacher.average_rating?.toFixed(1) || "—"}
                </p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Created {new Date(teacher.created_at).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Last updated {new Date(teacher.updated_at).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
