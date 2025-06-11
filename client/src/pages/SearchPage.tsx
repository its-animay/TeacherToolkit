import { useState, useEffect } from "react";
import { useSearchTeachers, useStyles } from "@/hooks/useTeachers";
import { useTeacherContext } from "@/contexts/TeacherContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import TeacherList from "@/components/teachers/TeacherList";
import TeacherCard from "@/components/teachers/TeacherCard";
import { LoadingTable, LoadingCard } from "@/components/ui/loading";
import { Search, Filter, X, Grid, List, BookOpen, Star, Users, Zap } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { teacherApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { Teacher } from "@shared/schema";

const DOMAINS = [
  "Mathematics", "Physics", "Computer Science", "Chemistry", 
  "Biology", "Languages", "History", "Literature", "Engineering"
];

const TEACHING_STYLES = [
  { value: "socratic", label: "Socratic" },
  { value: "explanatory", label: "Explanatory" },
  { value: "practical", label: "Practical" },
  { value: "theoretical", label: "Theoretical" },
  { value: "adaptive", label: "Adaptive" },
];

const DIFFICULTY_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
];

export default function SearchPage() {
  const { viewMode, setViewMode } = useTeacherContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Search state
  const [filters, setFilters] = useState({
    query: "",
    domain: "",
    teaching_style: "",
    difficulty_level: "",
    traits: [] as string[],
    rating_min: 0,
    rating_max: 5,
    sessions_min: 0,
    sessions_max: 1000,
    page: 1,
    limit: 12,
  });

  const [activeFilters, setActiveFilters] = useState(filters);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Debounced search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setActiveFilters(filters);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [filters]);

  const { data: searchResults, isLoading } = useSearchTeachers(activeFilters);
  const { data: styles } = useStyles();

  const deleteMutation = useMutation({
    mutationFn: teacherApi.deleteTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/enhanced-teacher"] });
      queryClient.invalidateQueries({ queryKey: ["/enhanced-teacher/search", activeFilters] });
      toast({
        title: "Success",
        description: "Teacher deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete teacher",
        variant: "destructive",
      });
    },
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handleTraitToggle = (trait: string) => {
    setFilters(prev => ({
      ...prev,
      traits: prev.traits.includes(trait)
        ? prev.traits.filter(t => t !== trait)
        : [...prev.traits, trait],
      page: 1,
    }));
  };

  const clearFilters = () => {
    const resetFilters = {
      query: "",
      domain: "all",
      teaching_style: "all",
      difficulty_level: "all",
      traits: [],
      rating_min: 0,
      rating_max: 5,
      sessions_min: 0,
      sessions_max: 1000,
      page: 1,
      limit: 12,
    };
    setFilters(resetFilters);
    setActiveFilters(resetFilters);
  };

  const handleDelete = (teacher: Teacher) => {
    deleteMutation.mutate(teacher.id);
  };

  const hasActiveFilters = filters.query || (filters.domain && filters.domain !== "all") || 
    (filters.teaching_style && filters.teaching_style !== "all") || 
    (filters.difficulty_level && filters.difficulty_level !== "all") || filters.traits.length > 0 || 
    filters.rating_min > 0 || filters.rating_max < 5 ||
    filters.sessions_min > 0 || filters.sessions_max < 1000;

  const teachers = searchResults?.teachers || [];
  const pagination = searchResults?.pagination;

  return (
    <div className="p-6 space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-50 via-blue-50 to-cyan-50 rounded-3xl p-8 border border-emerald-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">Advanced Search & Filter</h1>
            <p className="text-slate-600 text-lg">
              Discover AI teachers using powerful search filters and advanced criteria
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="rounded-xl"
            >
              <Grid size={16} />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="rounded-xl"
            >
              <List size={16} />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Filter className="mr-2" size={18} />
                Filters
              </CardTitle>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X size={16} />
                  Clear
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search Query */}
            <div>
              <Label className="text-sm font-medium">Search</Label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  placeholder="Search teachers..."
                  value={filters.query}
                  onChange={(e) => handleFilterChange("query", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Domain Filter */}
            <div>
              <Label className="text-sm font-medium">Domain</Label>
              <Select value={filters.domain} onValueChange={(value) => handleFilterChange("domain", value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="All domains" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All domains</SelectItem>
                  {DOMAINS.map((domain) => (
                    <SelectItem key={domain} value={domain}>
                      {domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Teaching Style */}
            <div>
              <Label className="text-sm font-medium">Teaching Style</Label>
              <Select value={filters.teaching_style} onValueChange={(value) => handleFilterChange("teaching_style", value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Any style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any style</SelectItem>
                  {TEACHING_STYLES.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      {style.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty Level */}
            <div>
              <Label className="text-sm font-medium">Difficulty Level</Label>
              <Select value={filters.difficulty_level} onValueChange={(value) => handleFilterChange("difficulty_level", value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Any level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any level</SelectItem>
                  {DIFFICULTY_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Personality Traits */}
            <div>
              <Label className="text-sm font-medium">Personality Traits</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {styles?.personality_traits?.map((trait) => (
                  <div key={trait.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={trait.value}
                      checked={filters.traits.includes(trait.value)}
                      onCheckedChange={() => handleTraitToggle(trait.value)}
                    />
                    <Label htmlFor={trait.value} className="text-xs">
                      {trait.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Advanced Filters */}
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className="w-full justify-start p-0 h-auto"
              >
                Advanced Filters
              </Button>
              
              {isAdvancedOpen && (
                <div className="space-y-4 mt-4">
                  {/* Rating Range */}
                  <div>
                    <Label className="text-sm font-medium">
                      Rating: {filters.rating_min} - {filters.rating_max}
                    </Label>
                    <div className="mt-2 space-y-2">
                      <Slider
                        value={[filters.rating_min]}
                        onValueChange={(value) => handleFilterChange("rating_min", value[0])}
                        max={5}
                        step={0.1}
                        className="w-full"
                      />
                      <Slider
                        value={[filters.rating_max]}
                        onValueChange={(value) => handleFilterChange("rating_max", value[0])}
                        max={5}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Sessions Range */}
                  <div>
                    <Label className="text-sm font-medium">
                      Sessions: {filters.sessions_min} - {filters.sessions_max}
                    </Label>
                    <div className="mt-2 space-y-2">
                      <Slider
                        value={[filters.sessions_min]}
                        onValueChange={(value) => handleFilterChange("sessions_min", value[0])}
                        max={1000}
                        step={10}
                        className="w-full"
                      />
                      <Slider
                        value={[filters.sessions_max]}
                        onValueChange={(value) => handleFilterChange("sessions_max", value[0])}
                        max={1000}
                        step={10}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="lg:col-span-3 space-y-6">
          {/* Results Header */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <BookOpen size={16} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {isLoading ? "Searching..." : `${teachers.length} teacher${teachers.length !== 1 ? 's' : ''} found`}
                    </span>
                  </div>
                  
                  {pagination && pagination.total_pages > 1 && (
                    <div className="flex items-center space-x-2">
                      <Users size={16} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Page {pagination.page} of {pagination.total_pages}
                      </span>
                    </div>
                  )}
                </div>

                {/* Active Filters */}
                {hasActiveFilters && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Active filters:</span>
                    <div className="flex flex-wrap gap-1">
                      {filters.query && (
                        <Badge variant="secondary" className="text-xs">
                          Query: {filters.query}
                        </Badge>
                      )}
                      {filters.domain && (
                        <Badge variant="secondary" className="text-xs">
                          {filters.domain}
                        </Badge>
                      )}
                      {filters.teaching_style && (
                        <Badge variant="secondary" className="text-xs">
                          {filters.teaching_style}
                        </Badge>
                      )}
                      {filters.traits.map((trait) => (
                        <Badge key={trait} variant="secondary" className="text-xs">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Grid/List */}
          {isLoading ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <LoadingCard key={i} />
                ))}
              </div>
            ) : (
              <LoadingTable />
            )
          ) : teachers.length > 0 ? (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {teachers.map((teacher) => (
                    <TeacherCard
                      key={teacher.id}
                      teacher={teacher}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              ) : (
                <TeacherList
                  teachers={teachers}
                  onDelete={handleDelete}
                />
              )}

              {/* Pagination */}
              {pagination && pagination.total_pages > 1 && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        disabled={pagination.page <= 1}
                        onClick={() => handleFilterChange("page", pagination.page - 1)}
                      >
                        Previous
                      </Button>
                      
                      <div className="flex items-center space-x-2">
                        {[...Array(Math.min(5, pagination.total_pages))].map((_, i) => {
                          const page = i + 1;
                          return (
                            <Button
                              key={page}
                              variant={page === pagination.page ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleFilterChange("page", page)}
                            >
                              {page}
                            </Button>
                          );
                        })}
                      </div>

                      <Button
                        variant="outline"
                        disabled={pagination.page >= pagination.total_pages}
                        onClick={() => handleFilterChange("page", pagination.page + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No teachers found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or clearing some filters.
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
