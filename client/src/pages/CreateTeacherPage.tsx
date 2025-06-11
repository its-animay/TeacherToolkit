import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { teacherApi } from "@/lib/api";
import { useTeacher } from "@/hooks/useTeachers";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading";
import TeacherForm from "@/components/teachers/TeacherForm";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import type { InsertTeacher } from "@shared/schema";

export default function CreateTeacherPage() {
  const [location, setLocation] = useLocation();
  const editId = new URLSearchParams(location.split('?')[1] || '').get("edit");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: existingTeacher, isLoading: isLoadingTeacher } = useTeacher(editId || "");

  const createMutation = useMutation({
    mutationFn: teacherApi.createTeacher,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/enhanced-teacher"] });
      toast({
        title: "Success",
        description: "Teacher created successfully",
      });
      setLocation(`/teachers/${data.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create teacher",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertTeacher> }) =>
      teacherApi.updateTeacher(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/enhanced-teacher"] });
      queryClient.invalidateQueries({ queryKey: [`/enhanced-teacher/${data.id}`] });
      toast({
        title: "Success",
        description: "Teacher updated successfully",
      });
      setLocation(`/teachers/${data.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update teacher",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: InsertTeacher) => {
    if (editId && existingTeacher) {
      updateMutation.mutate({ id: editId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleSaveDraft = (data: Partial<InsertTeacher>) => {
    // Store draft in localStorage
    localStorage.setItem("teacher-draft", JSON.stringify(data));
    toast({
      title: "Draft Saved",
      description: "Your teacher profile has been saved as a draft",
    });
  };

  // Load draft from localStorage on mount
  useEffect(() => {
    if (!editId) {
      const draft = localStorage.getItem("teacher-draft");
      if (draft) {
        try {
          const draftData = JSON.parse(draft);
          // You could set this as initial data for the form
          console.log("Draft loaded:", draftData);
        } catch (error) {
          console.error("Failed to parse draft:", error);
        }
      }
    }
  }, [editId]);

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const isEdit = !!editId;

  if (isEdit && isLoadingTeacher) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isEdit && !existingTeacher) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Teacher Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The teacher you're trying to edit doesn't exist or may have been deleted.
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
    <div className="p-6 space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 rounded-3xl p-8 border border-violet-100">
        <div className="flex items-center space-x-6">
          <Button variant="ghost" size="icon" asChild className="rounded-xl hover:bg-white/60">
            <Link href="/teachers">
              <ArrowLeft size={24} />
            </Link>
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">
              {isEdit ? "Edit AI Teacher" : "Create New AI Teacher"}
            </h1>
            <p className="text-slate-600 text-lg">
              {isEdit
                ? "Update and refine your AI teacher's profile and capabilities"
                : "Design a new AI teacher with custom personality and specialized knowledge"
              }
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <TeacherForm
        initialData={existingTeacher || undefined}
        onSubmit={handleSubmit}
        onSaveDraft={handleSaveDraft}
        isLoading={isLoading}
      />
    </div>
  );
}
