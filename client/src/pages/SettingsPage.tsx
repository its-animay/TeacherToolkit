import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle, Settings, ExternalLink, Zap } from "lucide-react";
import { teacherApi } from "@/lib/api";

export default function SettingsPage() {
  const [apiUrl, setApiUrl] = useState(() => 
    localStorage.getItem('enhanced_teacher_api_url') || import.meta.env.VITE_API_BASE_URL || ''
  );
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const handleSaveApiUrl = () => {
    localStorage.setItem('enhanced_teacher_api_url', apiUrl);
    toast({
      title: "Settings Saved",
      description: "API base URL has been updated successfully",
    });
  };

  const testApiConnection = async () => {
    if (!apiUrl) {
      toast({
        title: "Error",
        description: "Please enter an API base URL first",
        variant: "destructive",
      });
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus('idle');

    try {
      // Test connection by fetching styles (lightweight endpoint)
      await teacherApi.getStyles();
      setConnectionStatus('success');
      toast({
        title: "Connection Successful",
        description: "Successfully connected to Enhanced Teacher API",
      });
    } catch (error: any) {
      setConnectionStatus('error');
      toast({
        title: "Connection Failed",
        description: error.message || "Unable to connect to the API. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const createDefaultTeachers = async () => {
    try {
      const result = await teacherApi.createDefaults();
      toast({
        title: "Success",
        description: `Created ${result.count} default teachers`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create default teachers",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-8 border border-blue-100">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">API Settings</h1>
            <p className="text-slate-600 text-lg">
              Configure your Enhanced Teacher API connection and manage system preferences
            </p>
          </div>
        </div>
      </div>

      {/* API Configuration */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ExternalLink className="w-5 h-5" />
            <span>Enhanced Teacher API Configuration</span>
          </CardTitle>
          <CardDescription>
            Set up your connection to the Enhanced Teacher API service for real-time AI teacher management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="api-url">API Base URL</Label>
            <Input
              id="api-url"
              type="url"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://api.example.com"
              className="rounded-xl"
            />
            <p className="text-sm text-muted-foreground">
              Enter the base URL for your Enhanced Teacher API instance
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button 
              onClick={handleSaveApiUrl}
              className="gradient-bg text-white rounded-xl btn-shine"
            >
              Save Configuration
            </Button>
            
            <Button 
              onClick={testApiConnection}
              disabled={isTestingConnection || !apiUrl}
              variant="outline"
              className="rounded-xl"
            >
              {isTestingConnection ? "Testing..." : "Test Connection"}
            </Button>

            {connectionStatus === 'success' && (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Connected
              </Badge>
            )}

            {connectionStatus === 'error' && (
              <Badge variant="destructive">
                <AlertCircle className="w-3 h-3 mr-1" />
                Failed
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Quick Actions</span>
          </CardTitle>
          <CardDescription>
            Helpful actions to get started with your Enhanced Teacher API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
            <div>
              <h4 className="font-medium">Create Default Teachers</h4>
              <p className="text-sm text-muted-foreground">
                Populate your system with pre-configured AI teachers
              </p>
            </div>
            <Button 
              onClick={createDefaultTeachers}
              variant="outline"
              className="rounded-xl"
            >
              Create Defaults
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
            <div>
              <h4 className="font-medium">View API Documentation</h4>
              <p className="text-sm text-muted-foreground">
                Access the Enhanced Teacher API documentation
              </p>
            </div>
            <Button 
              variant="outline"
              className="rounded-xl"
              asChild
            >
              <a href={`${apiUrl}/docs`} target="_blank" rel="noopener noreferrer">
                View Docs
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Environment Info */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Environment Information</CardTitle>
          <CardDescription>
            Current configuration and environment details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-slate-700">Environment API URL</p>
              <p className="text-muted-foreground font-mono">
                {import.meta.env.VITE_API_BASE_URL || 'Not set'}
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-700">Stored API URL</p>
              <p className="text-muted-foreground font-mono">
                {localStorage.getItem('enhanced_teacher_api_url') || 'Not set'}
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-700">Active URL</p>
              <p className="text-muted-foreground font-mono">
                {apiUrl || 'Not configured'}
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-700">Connection Status</p>
              <p className={`font-medium ${
                connectionStatus === 'success' ? 'text-green-600' : 
                connectionStatus === 'error' ? 'text-red-600' : 
                'text-slate-500'
              }`}>
                {connectionStatus === 'success' ? 'Connected' : 
                 connectionStatus === 'error' ? 'Disconnected' : 
                 'Not tested'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}