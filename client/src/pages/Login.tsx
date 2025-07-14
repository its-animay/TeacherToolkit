import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2, Mail, Lock, Bot } from "lucide-react";
import { loginSchema } from "@/lib/schema";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser, clearUser } from "@/store/userSlice";
import { saveUserToStorage, removeUserFromStorage } from "@/lib/auth";
import UserService from "@/lib/api-service";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, navigate] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    if (isLoading) return;
    setIsLoading(true);
  
    const data = new URLSearchParams();
    data.append("username", values.email);
    data.append("password", values.password);
    data.append("grant_type", "password");
    data.append("client_id", import.meta.env.VITE_CLIENT_ID || "default");
  
    try {
      const response = await UserService.login(data);
  
      if (!response?.access_token) {
        throw new Error("Access token not returned by login.");
      }
  
      saveUserToStorage({
        access_token: response.access_token,
        token_type: response.token_type,
        expires_in: response.expires_in,
      });
  
      toast({
        title: "Login Successful",
        description: "You're now logged in!",
      });
  
      try {
        const userProfile = await UserService.getProfile();
        dispatch(setUser(userProfile));
        navigate("/dashboard");
      } catch (profileErr: any) {
        console.error("Failed to fetch user profile:", profileErr);
        toast({
          title: "Profile Error",
          description: "Logged in, but failed to load user data.",
          variant: "destructive",
        });
      }
  
    } catch (loginErr: any) {
      console.error("Login failed:", loginErr);
      removeUserFromStorage();
      dispatch(clearUser());
  
      toast({
        title: "Login Failed",
        description: loginErr?.response?.data?.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (user) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="glass-card rounded-3xl overflow-hidden transition-all duration-500 p-8 sm:p-10">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-background/50 animate-float">
              <div className="w-16 h-16 rounded-full primary-gradient flex items-center justify-center">
                <Bot className="text-white h-8 w-8" />
              </div>
            </div>
          </div>
        
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-1">Welcome Back</h1>
          <p className="text-center text-muted-foreground mb-8">Log in to continue your AI journey.</p>
        
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                          placeholder="your.email@example.com" 
                          className="pl-10 pr-4 py-6 rounded-xl bg-input/70 border" 
                          disabled={isLoading}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          className="pl-10 pr-10 py-6 rounded-xl bg-input/70 border" 
                          disabled={isLoading}
                          {...field}
                        />
                        <button 
                          type="button" 
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full primary-gradient text-white py-6 rounded-xl font-semibold" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}