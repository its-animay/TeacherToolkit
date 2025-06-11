import { useState } from "react";
import { AlertTriangle, RefreshCw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

interface ErrorBoundaryProps {
  error: Error;
  onRetry?: () => void;
  showApiSettings?: boolean;
}

export function ErrorBoundary({ error, onRetry, showApiSettings = true }: ErrorBoundaryProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (onRetry) {
      setIsRetrying(true);
      try {
        await onRetry();
      } finally {
        setIsRetrying(false);
      }
    }
  };

  const isApiError = error.message.includes('API Error') || error.message.includes('fetch');

  return (
    <Card className="glass-effect border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-red-600">
          <AlertTriangle className="w-5 h-5" />
          <span>Connection Error</span>
        </CardTitle>
        <CardDescription>
          {isApiError 
            ? "Unable to connect to the Enhanced Teacher API. Please check your connection settings."
            : "An unexpected error occurred while loading the data."
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-medium text-red-800 mb-2">Error Details:</h4>
          <p className="text-sm text-red-700 font-mono">{error.message}</p>
        </div>

        <div className="flex items-center space-x-3">
          {onRetry && (
            <Button 
              onClick={handleRetry}
              disabled={isRetrying}
              variant="outline"
              className="rounded-xl"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Retrying...' : 'Try Again'}
            </Button>
          )}

          {showApiSettings && isApiError && (
            <Button asChild className="rounded-xl">
              <Link href="/settings">
                <Settings className="w-4 h-4 mr-2" />
                API Settings
              </Link>
            </Button>
          )}
        </div>

        {isApiError && (
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">Common solutions:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Verify the API base URL in Settings</li>
              <li>Check if the Enhanced Teacher API is running</li>
              <li>Ensure your network connection is stable</li>
              <li>Confirm API credentials and permissions</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ApiStatusIndicatorProps {
  status: 'connected' | 'disconnected' | 'unknown';
  className?: string;
}

export function ApiStatusIndicator({ status, className = "" }: ApiStatusIndicatorProps) {
  const statusConfig = {
    connected: {
      color: "bg-green-500",
      text: "Connected",
      description: "API is responding normally"
    },
    disconnected: {
      color: "bg-red-500", 
      text: "Disconnected",
      description: "Unable to reach API"
    },
    unknown: {
      color: "bg-gray-500",
      text: "Unknown",
      description: "Connection status not tested"
    }
  };

  const config = statusConfig[status];

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${config.color}`} />
      <span className="text-sm font-medium">{config.text}</span>
    </div>
  );
}