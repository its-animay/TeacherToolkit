import { Star, Eye, Edit, Trash2, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Rating } from "@/components/ui/rating";
import type { Teacher } from "@shared/schema";
import { Link } from "wouter";

interface TeacherCardProps {
  teacher: Teacher;
  onEdit?: (teacher: Teacher) => void;
  onDelete?: (teacher: Teacher) => void;
  onView?: (teacher: Teacher) => void;
}

export default function TeacherCard({ teacher, onEdit, onDelete, onView }: TeacherCardProps) {
  const initials = teacher.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="card-hover glass-effect">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-14 w-14 ring-2 ring-primary/20 shadow-lg">
            <AvatarImage src={teacher.avatar_url || ""} alt={teacher.name} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-foreground truncate">{teacher.name}</h3>
            <p className="text-sm text-muted-foreground font-medium">{teacher.title}</p>
          </div>
          <Badge variant="secondary" className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200">
            {teacher.specialization.primary_domain}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Rating value={teacher.average_rating || 0} readOnly size="sm" />
              <span className="text-sm text-muted-foreground">
                {teacher.average_rating?.toFixed(1) || "No ratings"}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {teacher.total_sessions} sessions
            </span>
          </div>

          <div className="flex flex-wrap gap-1">
            {teacher.personality.primary_traits.slice(0, 3).map((trait) => (
              <Badge key={trait} variant="outline" className="text-xs">
                {trait}
              </Badge>
            ))}
            {teacher.personality.primary_traits.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{teacher.personality.primary_traits.length - 3} more
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Badge variant={teacher.is_active ? "default" : "secondary"}>
              {teacher.is_active ? "Active" : "Inactive"}
            </Badge>
            
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-200"
              >
                <Link href={`/chat/${teacher.id}`}>
                  <MessageSquare size={16} />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onView?.(teacher)}
                asChild
                className="hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200"
              >
                <Link href={`/teachers/${teacher.id}`}>
                  <Eye size={16} />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit?.(teacher)}
                className="hover:bg-amber-50 hover:text-amber-700 rounded-lg transition-all duration-200"
              >
                <Edit size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete?.(teacher)}
                className="text-destructive hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
