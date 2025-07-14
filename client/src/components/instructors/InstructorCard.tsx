import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Brain, Mail, User, Edit, Trash2 } from "lucide-react";
import { Instructor } from "@/lib/instructor-service";

interface InstructorCardProps {
  instructor: Instructor;
  onCreateAITeacher?: (instructor: Instructor) => void;
  onEdit?: (instructor: Instructor) => void;
  onDelete?: (instructor: Instructor) => void;
  isCreatingAITeacher?: boolean;
  linkedTeacher?: any;
}

export default function InstructorCard({ 
  instructor, 
  onCreateAITeacher, 
  onEdit, 
  onDelete,
  isCreatingAITeacher = false,
  linkedTeacher
}: InstructorCardProps) {
  const initials = instructor.full_name
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase();

  return (
    <Card className="card-hover transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={instructor.avatar_url} alt={instructor.full_name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                {instructor.full_name}
              </CardTitle>
              <CardDescription className="text-sm text-gray-500 truncate">
                @{instructor.username}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Badge variant={instructor.is_active ? "default" : "secondary"}>
              {instructor.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="h-4 w-4 mr-2 text-gray-400" />
            <span className="truncate">{instructor.email}</span>
          </div>
          
          {instructor.bio && (
            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
              {instructor.bio}
            </p>
          )}
          
          {linkedTeacher && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
              <div className="flex items-center space-x-2">
                <Badge variant="default" className="bg-green-100 text-green-800">
                  AI Teacher Linked
                </Badge>
                <span className="text-sm font-medium text-green-800">
                  {linkedTeacher.name}
                </span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                Domain: {linkedTeacher.domain}
              </p>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit?.(instructor)}
                className="flex items-center space-x-1"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete?.(instructor)}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </Button>
            </div>
            
            <Button
              onClick={() => onCreateAITeacher?.(instructor)}
              disabled={isCreatingAITeacher}
              className="primary-gradient text-white hover:opacity-90 transition-opacity"
              size="sm"
            >
              {isCreatingAITeacher ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  {linkedTeacher ? "View AI Teacher" : "Create AI Teacher"}
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}