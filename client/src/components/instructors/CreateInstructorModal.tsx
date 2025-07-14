import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Loader2, User } from "lucide-react";
import { CreateInstructorData } from "@/lib/instructor-service";
import { useToast } from "@/hooks/use-toast";

const createInstructorSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  phone_number: z.string().optional(),
  avatar_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  bio: z.string().optional(),
});

type CreateInstructorForm = z.infer<typeof createInstructorSchema>;

interface CreateInstructorModalProps {
  onSubmit: (data: CreateInstructorData) => Promise<void>;
  isLoading?: boolean;
}

export default function CreateInstructorModal({ onSubmit, isLoading }: CreateInstructorModalProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<CreateInstructorForm>({
    resolver: zodResolver(createInstructorSchema),
    defaultValues: {
      email: "",
      password: "",
      full_name: "",
      username: "",
      phone_number: "",
      avatar_url: "",
      bio: "",
    },
  });

  const handleSubmit = async (data: CreateInstructorForm) => {
    try {
      await onSubmit(data);
      setOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Instructor created successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create instructor",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="primary-gradient text-white hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4 mr-2" />
          Create Instructor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Create New Instructor</span>
          </DialogTitle>
          <DialogDescription>
            Add a new instructor to your platform. They'll be able to create AI teachers.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                placeholder="Dr. Sarah Johnson"
                {...form.register("full_name")}
                className="input-glow"
              />
              {form.formState.errors.full_name && (
                <p className="text-sm text-red-600">{form.formState.errors.full_name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                placeholder="sarahjohnson"
                {...form.register("username")}
                className="input-glow"
              />
              {form.formState.errors.username && (
                <p className="text-sm text-red-600">{form.formState.errors.username.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="instructor@example.com"
              {...form.register("email")}
              className="input-glow"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...form.register("password")}
              className="input-glow"
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-600">{form.formState.errors.password.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input
              id="phone_number"
              placeholder="+1 (555) 123-4567"
              {...form.register("phone_number")}
              className="input-glow"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="avatar_url">Avatar URL</Label>
            <Input
              id="avatar_url"
              placeholder="https://example.com/avatar.jpg"
              {...form.register("avatar_url")}
              className="input-glow"
            />
            {form.formState.errors.avatar_url && (
              <p className="text-sm text-red-600">{form.formState.errors.avatar_url.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="AI and ML expert with 10+ years of experience..."
              {...form.register("bio")}
              className="input-glow min-h-[100px]"
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="primary-gradient text-white hover:opacity-90 transition-opacity"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Instructor
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}