import { useState } from "react";
import { useTeachers } from "@/hooks/useTeachers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { teacherApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import TeacherList from "@/components/teachers/TeacherList";
import TeacherCard from "@/components/teachers/TeacherCard";
import { LoadingTable, LoadingCard } from "@/components/ui/loading";
import { Search, Plus, Grid, List, Filter } from "lucide-react";
import { Link } from "wouter";
import type { Teacher } from "@shared/schema";

export default function TeachersPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [filterDomain, setFilterDomain] = useState("");
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);

  const { data: teachers, isLoading, error } = useTeachers();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: teacherApi.deleteTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/enhanced-teacher"] });
      toast({
        title: "Success",
        description: "Teacher deleted successfully",
      });
      setTeacherToDelete(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete teacher",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (teacher: Teacher) => {
    setTeacherToDelete(teacher);
  };

  const confirmDelete = () => {
    if (teacherToDelete) {
      deleteMutation.mutate(teacherToDelete.id);
    }
  };

  // Filter and sort teachers
  const filteredTeachers = teachers?.filter((teacher) => {
    const matchesSearch = searchQuery === "" || 
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.specialization.primary_domain.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDomain = filterDomain === "" || filterDomain === "all" || 
      teacher.specialization.primary_domain === filterDomain;

    return matchesSearch && matchesDomain;
  }).sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "rating":
        return (b.average_rating || 0) - (a.average_rating || 0);
      case "sessions":
        return b.total_sessions - a.total_sessions;
      case "created_at":
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  }) || [];

  // Get unique domains for filter
  const domains = Array.from(new Set(teachers?.map(t => t.specialization.primary_domain) || []));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">All Teachers</h1>
          <p className="text-muted-foreground">
            Manage your AI teacher profiles
          </p>
        </div>
        <Button asChild>
          <Link href="/create">
            <Plus className="mr-2" size={16} />
            Create Teacher
          </Link>
        </Button>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  placeholder="Search teachers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterDomain} onValueChange={setFilterDomain}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All domains" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All domains</SelectItem>
                  {domains.map((domain) => (
                    <SelectItem key={domain} value={domain}>
                      {domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Recently created</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="sessions">Sessions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid size={16} />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Loading..." : `${filteredTeachers.length} teacher${filteredTeachers.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {error ? (
          <Card className="glass-effect border-red-200">
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Teachers</h3>
                  <p className="text-red-600 mb-4">
                    Could not connect to the Enhanced Teacher API. Please check your API configuration.
                  </p>
                  <div className="flex space-x-3 justify-center">
                    <Button 
                      onClick={() => queryClient.invalidateQueries({ queryKey: ["/enhanced-teacher"] })}
                      variant="outline"
                      className="rounded-xl"
                    >
                      Try Again
                    </Button>
                    <Button asChild className="rounded-xl">
                      <Link href="/settings">API Settings</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : isLoading ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <LoadingCard key={i} />
              ))}
            </div>
          ) : (
            <LoadingTable />
          )
        ) : filteredTeachers.length === 0 ? (
          <Card className="glass-effect">
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                  <Plus className="w-8 h-8 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">No Teachers Found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || filterDomain !== "" && filterDomain !== "all" 
                      ? "No teachers match your current filters. Try adjusting your search criteria."
                      : "Get started by creating your first AI teacher."
                    }
                  </p>
                  <Button asChild>
                    <Link href="/create">Create Your First Teacher</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map((teacher) => (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <TeacherList
            teachers={filteredTeachers}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={teacherToDelete !== null} onOpenChange={() => setTeacherToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Teacher</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{teacherToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
