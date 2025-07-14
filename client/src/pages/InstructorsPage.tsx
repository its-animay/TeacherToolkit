import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Filter, Users, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { instructorService, Instructor, CreateInstructorData } from "@/lib/instructor-service";
import { teacherApi } from "@/lib/api";
import { InsertTeacher } from "@/shared/schema";
import InstructorCard from "@/components/instructors/InstructorCard";
import CreateInstructorModal from "@/components/instructors/CreateInstructorModal";

export default function InstructorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [creatingAITeacher, setCreatingAITeacher] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: instructorsData, isLoading, error, refetch } = useQuery({
    queryKey: ['instructors'],
    queryFn: () => instructorService.getInstructors({
      skip: 0,
      limit: 50,
      sort_by: 'created_at',
      sort_dir: 'desc'
    }),
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const createInstructorMutation = useMutation({
    mutationFn: (data: CreateInstructorData) => instructorService.createInstructor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
      toast({
        title: "Success",
        description: "Instructor created successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create instructor",
        variant: "destructive",
      });
    },
  });

  const createAITeacherMutation = useMutation({
    mutationFn: (data: InsertTeacher) => teacherApi.createTeacher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast({
        title: "Success",
        description: "AI Teacher created successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create AI teacher",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setCreatingAITeacher(null);
    },
  });

  const handleCreateAITeacher = async (instructor: Instructor) => {
    setCreatingAITeacher(instructor.id);
    
    const aiTeacherData: InsertTeacher = {
      name: instructor.full_name,
      domain: "General Education",
      teaching_style: "Interactive and engaging",
      personality_traits: ["Knowledgeable", "Patient", "Encouraging"],
      expertise_areas: ["Teaching", "Education", "Student Engagement"],
      bio: instructor.bio || `AI Teacher created from instructor ${instructor.full_name}`,
      avatar_url: instructor.avatar_url || "",
      email: instructor.email,
      background: `Instructor profile: ${instructor.full_name}`,
      preferred_language: "English",
      difficulty_level: "intermediate",
      max_session_length: 60,
      response_time: "fast",
      availability: "24/7",
      session_count: 0,
      average_rating: 0,
      total_ratings: 0,
      is_active: true,
    };

    createAITeacherMutation.mutate(aiTeacherData);
  };

  const handleDeleteInstructor = async (instructor: Instructor) => {
    if (confirm(`Are you sure you want to delete ${instructor.full_name}?`)) {
      try {
        await instructorService.deleteInstructor(instructor.id);
        queryClient.invalidateQueries({ queryKey: ['instructors'] });
        toast({
          title: "Success",
          description: "Instructor deleted successfully!",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete instructor",
          variant: "destructive",
        });
      }
    }
  };

  const filteredInstructors = instructorsData?.instructors.filter(instructor =>
    instructor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.username.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Instructor Management</h1>
            <p className="text-gray-600 mt-2">Manage instructors and create AI teachers</p>
          </div>
        </div>
        
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-700">
              <div className="flex-1">
                <h3 className="font-semibold">Connection Error</h3>
                <p className="text-sm">Unable to connect to the instructor API. Please check your connection and try again.</p>
                <p className="text-xs mt-1 text-red-600">Error: {error.message}</p>
              </div>
              <Button
                onClick={() => refetch()}
                variant="outline"
                size="sm"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Instructor Management</h1>
          <p className="text-gray-600 mt-2">Manage instructors and create AI teachers from their profiles</p>
        </div>
        <CreateInstructorModal
          onSubmit={createInstructorMutation.mutateAsync}
          isLoading={createInstructorMutation.isPending}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Instructors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{instructorsData?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {instructorsData?.instructors.filter(i => i.is_active).length || 0} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Instructors</CardTitle>
            <Badge variant="default" className="text-xs">Live</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {instructorsData?.instructors.filter(i => i.is_active).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready to create AI teachers
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Instructors</CardTitle>
            <Badge variant="secondary" className="text-xs">Offline</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-500">
              {instructorsData?.instructors.filter(i => !i.is_active).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Needs activation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search instructors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Instructors Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredInstructors.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No instructors found</h3>
            <p className="text-gray-600 text-center mb-6">
              {searchTerm ? 'No instructors match your search criteria.' : 'Get started by creating your first instructor.'}
            </p>
            <CreateInstructorModal
              onSubmit={createInstructorMutation.mutateAsync}
              isLoading={createInstructorMutation.isPending}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstructors.map((instructor) => (
            <InstructorCard
              key={instructor.id}
              instructor={instructor}
              onCreateAITeacher={handleCreateAITeacher}
              onDelete={handleDeleteInstructor}
              isCreatingAITeacher={creatingAITeacher === instructor.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}