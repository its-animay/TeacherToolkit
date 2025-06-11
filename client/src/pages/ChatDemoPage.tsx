import { useTeachers } from "@/hooks/useTeachers";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users } from "lucide-react";
import { Link } from "wouter";

export default function ChatDemoPage() {
  const { data: teachers, isLoading } = useTeachers();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Card className="w-96">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <LoadingSpinner size="lg" />
              <p className="text-muted-foreground">Loading teachers...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeTeachers = teachers?.filter(t => t.is_active) || [];

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 rounded-3xl p-8 border border-purple-100">
        <h1 className="text-4xl font-bold text-gradient mb-2">Chat Demo</h1>
        <p className="text-slate-600 text-lg">
          Select an AI teacher to start a conversation and test their personalities
        </p>
      </div>

      {activeTeachers.length === 0 ? (
        <Card className="glass-effect">
          <CardContent className="text-center py-16">
            <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Users className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No Active Teachers</h3>
            <p className="text-muted-foreground mb-6">
              Create some AI teachers to start chatting with them.
            </p>
            <Button asChild className="gradient-bg text-white btn-shine">
              <Link href="/create">Create Your First Teacher</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTeachers.map((teacher) => (
            <Card key={teacher.id} className="card-hover glass-effect">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/30 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="font-bold text-primary text-lg">
                      {teacher.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-foreground">{teacher.name}</h3>
                    <p className="text-sm text-muted-foreground">{teacher.title}</p>
                    <p className="text-xs text-primary capitalize">{teacher.specialization.primary_domain}</p>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  Specialized in {teacher.specialization.primary_domain} with a {teacher.personality.teaching_style} teaching approach.
                </p>

                <Button asChild className="w-full gradient-bg text-white btn-shine">
                  <Link href={`/chat/${teacher.id}`}>
                    <MessageCircle className="mr-2" size={16} />
                    Chat with {teacher.name.split(' ')[0]}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}