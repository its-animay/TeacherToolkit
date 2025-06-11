import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { teacherApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading";
import ChatInterface from "@/components/chat/ChatInterface";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();

  const { data: teacher, isLoading, error } = useQuery({
    queryKey: [`/enhanced-teacher/${id}`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Teacher Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The teacher you're looking for doesn't exist or may have been deleted.
            </p>
            <Button asChild>
              <Link href="/teachers">Back to Teachers</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)]">
      <ChatInterface teacher={teacher} />
    </div>
  );
}