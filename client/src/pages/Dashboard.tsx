import { useTeachers } from "@/hooks/useTeachers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingCard, LoadingSpinner } from "@/components/ui/loading";
import { Presentation, Star, Users, TrendingUp, Plus, Upload, Wand2, BarChart3 } from "lucide-react";
import { Link } from "wouter";
import TeacherCard from "@/components/teachers/TeacherCard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { teacherApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { data: teachers, isLoading } = useTeachers();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createDefaultsMutation = useMutation({
    mutationFn: teacherApi.createDefaults,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/enhanced-teacher"] });
      toast({
        title: "Success",
        description: `Created ${data.count} default teachers`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create default teachers",
        variant: "destructive",
      });
    },
  });

  const handleCreateDefaults = () => {
    createDefaultsMutation.mutate();
  };

  // Calculate stats
  const stats = {
    totalTeachers: teachers?.length || 0,
    activeTeachers: teachers?.filter(t => t.is_active).length || 0,
    averageRating: teachers?.length 
      ? (teachers.reduce((sum, t) => sum + (t.average_rating || 0), 0) / teachers.length).toFixed(1)
      : "0.0",
    totalSessions: teachers?.reduce((sum, t) => sum + t.total_sessions, 0) || 0,
  };

  // Recent teachers (last 5)
  const recentTeachers = teachers?.slice(0, 5) || [];

  // Domain distribution
  const domainCounts = teachers?.reduce((acc, teacher) => {
    const domain = teacher.specialization.primary_domain;
    acc[domain] = (acc[domain] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const topDomains = Object.entries(domainCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6);

  return (
    <div className="p-6 space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-8 border border-blue-100">
        <h1 className="text-4xl font-bold text-gradient mb-2">AI Teacher Dashboard</h1>
        <p className="text-slate-600 text-lg">
          Manage your AI teachers and monitor performance metrics
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-hover glass-effect">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Teachers</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalTeachers}</p>
              </div>
              <div className="w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center shadow-lg">
                <Presentation className="text-white" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">+12%</span>
              <span className="text-muted-foreground ml-2">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover glass-effect">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Sessions</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalSessions}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="text-white" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">+8%</span>
              <span className="text-muted-foreground ml-2">from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover glass-effect">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                <p className="text-3xl font-bold text-foreground">{stats.averageRating}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Star className="text-white" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(parseFloat(stats.averageRating))
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover glass-effect">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Teachers</p>
                <p className="text-3xl font-bold text-foreground">{stats.activeTeachers}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="text-white" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-muted-foreground bg-slate-100 px-2 py-1 rounded-full">
                {stats.totalTeachers > 0 
                  ? `${((stats.activeTeachers / stats.totalTeachers) * 100).toFixed(1)}% active rate`
                  : "No teachers yet"
                }
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gradient">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Button
              asChild
              className="flex items-center justify-center space-x-4 p-8 h-auto border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 hover:border-primary/50 text-primary hover:text-primary transition-all duration-300 btn-shine rounded-2xl"
              variant="outline"
            >
              <Link href="/create">
                <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center shadow-lg">
                  <Plus size={24} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-lg">Create New Teacher</p>
                  <p className="text-sm text-muted-foreground">Add AI teacher profile</p>
                </div>
              </Link>
            </Button>

            <Button
              className="flex items-center justify-center space-x-4 p-8 h-auto border-2 border-dashed border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-150 hover:border-blue-400 text-blue-700 hover:text-blue-800 transition-all duration-300 btn-shine rounded-2xl"
              variant="outline"
              onClick={() => toast({ title: "Coming Soon", description: "Bulk import feature will be available soon." })}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Upload size={24} className="text-white" />
              </div>
              <div className="text-left">
                <p className="font-bold text-lg">Bulk Import</p>
                <p className="text-sm text-blue-600">Import multiple teachers</p>
              </div>
            </Button>

            <Button
              className="flex items-center justify-center space-x-4 p-8 h-auto border-2 border-dashed border-green-300 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-150 hover:border-green-400 text-green-700 hover:text-green-800 transition-all duration-300 btn-shine rounded-2xl"
              variant="outline"
              onClick={handleCreateDefaults}
              disabled={createDefaultsMutation.isPending}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                {createDefaultsMutation.isPending ? (
                  <LoadingSpinner size="sm" className="text-white" />
                ) : (
                  <Wand2 size={24} className="text-white" />
                )}
              </div>
              <div className="text-left">
                <p className="font-bold text-lg">Generate Defaults</p>
                <p className="text-sm text-green-600">Create sample teachers</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Teachers */}
        <Card className="glass-effect">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-gradient">Recent Teachers</CardTitle>
              <Button variant="ghost" asChild className="hover:bg-primary/10 text-primary">
                <Link href="/teachers">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <LoadingCard key={i} />
                ))}
              </div>
            ) : recentTeachers.length > 0 ? (
              <div className="space-y-4">
                {recentTeachers.map((teacher) => (
                  <div key={teacher.id} className="flex items-center space-x-4 p-4 border border-slate-200 rounded-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 hover:shadow-md">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/30 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="font-bold text-primary text-lg">
                        {teacher.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-foreground text-lg">{teacher.name}</p>
                      <p className="text-sm text-muted-foreground font-medium">
                        {teacher.specialization.primary_domain} • {teacher.title}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 text-sm bg-yellow-50 px-3 py-2 rounded-full">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{teacher.average_rating?.toFixed(1) || "—"}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="text-white" size={24} />
                </div>
                <p className="text-muted-foreground mb-4 text-lg">No teachers found</p>
                <Button asChild className="gradient-bg text-white btn-shine">
                  <Link href="/create">Create Your First Teacher</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Domain Distribution */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gradient">Domain Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-20 bg-muted rounded-2xl skeleton" />
                ))}
              </div>
            ) : topDomains.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {topDomains.map(([domain, count]) => (
                  <div key={domain} className="text-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 hover:shadow-md border border-slate-200">
                    <div className="w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <span className="text-white font-bold text-lg">
                        {domain.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <p className="font-bold text-foreground text-sm">{domain}</p>
                    <p className="text-xs text-muted-foreground bg-slate-100 px-2 py-1 rounded-full mt-1 inline-block">
                      {count} teacher{count !== 1 ? 's' : ''}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <BarChart3 className="text-white" size={24} />
                </div>
                <p className="text-muted-foreground text-lg">No domains to display</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
