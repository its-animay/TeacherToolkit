import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teacherApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading";
import TeacherDetail from "@/components/teachers/TeacherDetail";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";

export default function TeacherDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [promptDialogOpen, setPromptDialogOpen] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: teacher, isLoading, error } = useQuery({
    queryKey: [`/enhanced-teacher/${id}`],
    enabled: !!id,
  });

  const generatePromptMutation = useMutation({
    mutationFn: () => teacherApi.generatePrompt(id!),
    onSuccess: (data) => {
      setGeneratedPrompt(data.system_prompt);
      setPromptDialogOpen(true);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate system prompt",
        variant: "destructive",
      });
    },
  });

  const handleEdit = () => {
    setLocation(`/create?edit=${id}`);
  };

  const handleGeneratePrompt = () => {
    generatePromptMutation.mutate();
  };

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
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/teachers">
            <ArrowLeft size={20} />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Teacher Details</h1>
          <p className="text-muted-foreground">View and manage teacher profile</p>
        </div>
      </div>

      {/* Teacher Detail Component */}
      <TeacherDetail
        teacher={teacher}
        onEdit={handleEdit}
        onGeneratePrompt={handleGeneratePrompt}
      />

      {/* Generated Prompt Dialog */}
      <Dialog open={promptDialogOpen} onOpenChange={setPromptDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <MessageSquare className="mr-2" size={20} />
              Generated System Prompt
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                System Prompt for {teacher.name}
              </label>
              <Textarea
                value={generatedPrompt}
                readOnly
                rows={10}
                className="mt-2 font-mono text-sm"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(generatedPrompt);
                  toast({
                    title: "Copied",
                    description: "System prompt copied to clipboard",
                  });
                }}
              >
                Copy to Clipboard
              </Button>
              <Button onClick={() => setPromptDialogOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
