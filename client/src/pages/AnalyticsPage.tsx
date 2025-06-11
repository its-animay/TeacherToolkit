import { useTeachers } from "@/hooks/useTeachers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingCard } from "@/components/ui/loading";
import { TrendingUp, Users, Star, Activity, BarChart3, PieChart, Calendar, Target } from "lucide-react";

export default function AnalyticsPage() {
  const { data: teachers, isLoading } = useTeachers();

  if (isLoading) {
    return (
      <div className="p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Analytics calculations
  const totalTeachers = teachers?.length || 0;
  const activeTeachers = teachers?.filter(t => t.is_active).length || 0;
  const totalSessions = teachers?.reduce((sum, t) => sum + t.total_sessions, 0) || 0;
  const averageRating = teachers?.length 
    ? (teachers.reduce((sum, t) => sum + (t.average_rating || 0), 0) / teachers.length)
    : 0;

  // Domain analytics
  const domainStats = teachers?.reduce((acc, teacher) => {
    const domain = teacher.specialization.primary_domain;
    if (!acc[domain]) {
      acc[domain] = {
        count: 0,
        totalSessions: 0,
        totalRating: 0,
        activeCount: 0
      };
    }
    acc[domain].count++;
    acc[domain].totalSessions += teacher.total_sessions;
    acc[domain].totalRating += teacher.average_rating || 0;
    if (teacher.is_active) acc[domain].activeCount++;
    return acc;
  }, {} as Record<string, any>) || {};

  const topDomains = Object.entries(domainStats)
    .map(([domain, stats]) => ({
      domain,
      ...stats,
      avgRating: stats.count > 0 ? (stats.totalRating / stats.count).toFixed(1) : "0.0"
    }))
    .sort((a, b) => b.totalSessions - a.totalSessions)
    .slice(0, 6);

  // Teaching style distribution
  const styleStats = teachers?.reduce((acc, teacher) => {
    const style = teacher.personality.teaching_style;
    acc[style] = (acc[style] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="p-6 space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 rounded-3xl p-8 border border-purple-100">
        <h1 className="text-4xl font-bold text-gradient mb-2">Analytics Dashboard</h1>
        <p className="text-slate-600 text-lg">
          Comprehensive insights into your AI teacher performance and usage
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-hover glass-effect">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Teachers</p>
                <p className="text-3xl font-bold text-foreground">{totalTeachers}</p>
              </div>
              <div className="w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="text-white" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                {activeTeachers} active
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover glass-effect">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
                <p className="text-3xl font-bold text-foreground">{totalSessions}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Activity className="text-white" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">
                {totalTeachers > 0 ? (totalSessions / totalTeachers).toFixed(1) : 0} avg per teacher
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover glass-effect">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                <p className="text-3xl font-bold text-foreground">{averageRating.toFixed(1)}</p>
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
                      i < Math.floor(averageRating)
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
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-3xl font-bold text-foreground">
                  {totalTeachers > 0 ? ((activeTeachers / totalTeachers) * 100).toFixed(0) : 0}%
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Target className="text-white" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                Active teacher ratio
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Domain Performance */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gradient flex items-center space-x-2">
              <BarChart3 size={24} />
              <span>Domain Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topDomains.map(({ domain, count, totalSessions, avgRating, activeCount }) => (
                <div key={domain} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
                  <div>
                    <h3 className="font-bold text-foreground">{domain}</h3>
                    <p className="text-sm text-muted-foreground">
                      {count} teachers • {activeCount} active
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                        {totalSessions} sessions
                      </Badge>
                      <Badge variant="secondary" className="bg-yellow-50 text-yellow-700">
                        ★ {avgRating}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Teaching Styles */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gradient flex items-center space-x-2">
              <PieChart size={24} />
              <span>Teaching Styles</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(styleStats)
                .sort(([,a], [,b]) => b - a)
                .map(([style, count]) => (
                  <div key={style} className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-sm">
                          {style.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground capitalize">{style}</h3>
                        <p className="text-sm text-muted-foreground">Teaching approach</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {count} teachers
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {totalTeachers > 0 ? ((count / totalTeachers) * 100).toFixed(1) : 0}%
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Trends */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gradient flex items-center space-x-2">
            <Calendar size={24} />
            <span>Usage Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <TrendingUp className="text-white" size={24} />
              </div>
              <h3 className="font-bold text-lg text-foreground">Growth Rate</h3>
              <p className="text-2xl font-bold text-green-600 mt-2">+15%</p>
              <p className="text-sm text-muted-foreground">Monthly teacher creation</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Activity className="text-white" size={24} />
              </div>
              <h3 className="font-bold text-lg text-foreground">Engagement</h3>
              <p className="text-2xl font-bold text-blue-600 mt-2">87%</p>
              <p className="text-sm text-muted-foreground">Active participation rate</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl border border-purple-200">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Star className="text-white" size={24} />
              </div>
              <h3 className="font-bold text-lg text-foreground">Satisfaction</h3>
              <p className="text-2xl font-bold text-purple-600 mt-2">4.{Math.floor(averageRating * 10) % 10}</p>
              <p className="text-sm text-muted-foreground">Average user rating</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}