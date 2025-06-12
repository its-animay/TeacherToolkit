import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Volume2, 
  VolumeX,
  Waves,
  Brain,
  MessageCircle,
  Zap,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTeachers } from "@/hooks/useTeachers";

// ElevenLabs Conversation import
import { Conversation } from "@elevenlabs/client";

interface VoiceAgent {
  id: string;
  name: string;
  domain: string;
  description: string;
  agentId: string;
}

// Hardcoded agents for demo - in production this would come from API
const VOICE_AGENTS: VoiceAgent[] = [
  {
    id: "1",
    name: "AI Teacher Assistant",
    domain: "General Education",
    description: "Your personal AI tutor ready to help with any subject",
    agentId: "agent_01jxfp3s2fefq9cb27j6dw7mp0"
  }
];

type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";
type AgentMode = "idle" | "listening" | "thinking" | "speaking";

export default function VoiceChatPage() {
  const [selectedAgent, setSelectedAgent] = useState<VoiceAgent>(VOICE_AGENTS[0]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected");
  const [agentMode, setAgentMode] = useState<AgentMode>("idle");
  const [isRecording, setIsRecording] = useState(false);
  const [conversationLog, setConversationLog] = useState<Array<{
    timestamp: string;
    type: "user" | "agent" | "system";
    content: string;
  }>>([]);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const conversationRef = useRef<any>(null);
  const { toast } = useToast();
  const { data: teachers = [] } = useTeachers();

  // Request microphone permission
  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access to start voice conversation",
        variant: "destructive",
      });
      return false;
    }
  };

  // Start conversation
  const startConversation = async () => {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) return;

    setConnectionStatus("connecting");
    addToConversationLog("system", "Connecting to AI teacher...");

    try {
      conversationRef.current = await Conversation.startSession({
        agentId: selectedAgent.agentId,
        authorization: import.meta.env.VITE_ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY,
        onConnect: () => {
          setConnectionStatus("connected");
          setAgentMode("listening");
          addToConversationLog("system", "Connected! Start speaking to your AI teacher.");
          toast({
            title: "Connected",
            description: "You can now talk to your AI teacher",
          });
        },
        onDisconnect: () => {
          setConnectionStatus("disconnected");
          setAgentMode("idle");
          setIsRecording(false);
          addToConversationLog("system", "Conversation ended");
        },
        onError: (error) => {
          console.error("Conversation error:", error);
          setConnectionStatus("error");
          setAgentMode("idle");
          const errorMessage = typeof error === 'string' ? error : (error as any)?.message || "Connection failed";
          addToConversationLog("system", `Error: ${errorMessage}`);
          toast({
            title: "Connection Error",
            description: "Failed to connect to AI teacher. Please try again.",
            variant: "destructive",
          });
        },
        onModeChange: (mode) => {
          console.log("Mode changed:", mode);
          if (mode.mode === "speaking") {
            setAgentMode("speaking");
            setIsRecording(false);
          } else if (mode.mode === "listening") {
            setAgentMode("listening");
            setIsRecording(true);
          }
        },
        onMessage: (message) => {
          console.log("Message received:", message);
          if (typeof message === 'object' && message !== null) {
            if ('source' in message && message.source === 'ai') {
              addToConversationLog("agent", message.message || "AI teacher responded");
            } else if ('source' in message && message.source === 'user') {
              addToConversationLog("user", message.message || "You spoke");
            }
          }
        }
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
      setConnectionStatus("error");
      toast({
        title: "Connection Failed",
        description: "Unable to start conversation. Please check your connection.",
        variant: "destructive",
      });
    }
  };

  // Stop conversation
  const stopConversation = () => {
    if (conversationRef.current) {
      conversationRef.current.endSession();
      conversationRef.current = null;
    }
    setConnectionStatus("disconnected");
    setAgentMode("idle");
    setIsRecording(false);
    addToConversationLog("system", "Conversation ended by user");
  };

  // Add message to conversation log
  const addToConversationLog = (type: "user" | "agent" | "system", content: string) => {
    setConversationLog(prev => [...prev, {
      timestamp: new Date().toLocaleTimeString(),
      type,
      content
    }]);
  };

  // Simulate audio level for visual feedback
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
    } else {
      setAudioLevel(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected": return "bg-green-500";
      case "connecting": return "bg-yellow-500";
      case "error": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getAgentModeIcon = () => {
    switch (agentMode) {
      case "listening": return <Mic className="h-5 w-5 text-green-500" />;
      case "speaking": return <Volume2 className="h-5 w-5 text-blue-500" />;
      case "thinking": return <Brain className="h-5 w-5 text-purple-500" />;
      default: return <MicOff className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date().toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Voice Chat with AI Teachers
          </h1>
          <p className="text-slate-600">
            Have real-time voice conversations with your AI tutors
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Agent Selection Sidebar */}
          <div className="col-span-3">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Teachers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {VOICE_AGENTS.map((agent) => (
                  <div
                    key={agent.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all border ${
                      selectedAgent.id === agent.id
                        ? "bg-primary/10 border-primary"
                        : "hover:bg-slate-50 border-transparent"
                    }`}
                    onClick={() => setSelectedAgent(agent)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="gradient-bg text-white">
                          {agent.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{agent.name}</p>
                        <p className="text-xs text-slate-500">{agent.domain}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">{agent.description}</p>
                  </div>
                ))}

                {/* Show available teachers from Enhanced Teacher API */}
                {teachers.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="text-sm font-medium text-slate-700 mb-2">Available Teachers</div>
                    {teachers.slice(0, 3).map((teacher: any) => (
                      <div
                        key={teacher.id}
                        className="p-2 rounded-lg bg-slate-50 border border-slate-200"
                      >
                        <p className="font-medium text-xs">{teacher.name}</p>
                        <p className="text-xs text-slate-500">{teacher.domain}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          Text Chat Only
                        </Badge>
                      </div>
                    ))}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Voice Chat Interface */}
          <div className="col-span-6">
            <Card className="glass-card h-[600px] flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Talk to {selectedAgent.name}
                    </CardTitle>
                    <p className="text-sm text-slate-500">{selectedAgent.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
                    <span className="text-sm capitalize">{connectionStatus}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                {/* Visual Audio Feedback */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="relative">
                    {/* Central Avatar */}
                    <Avatar className="h-32 w-32 mb-6">
                      <AvatarFallback className="gradient-bg text-white text-2xl">
                        {selectedAgent.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>

                    {/* Audio Visualization */}
                    {(isRecording || agentMode === "speaking") && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className={`absolute rounded-full border-2 ${
                                agentMode === "speaking" ? "border-blue-400" : "border-green-400"
                              } animate-ping`}
                              style={{
                                width: `${140 + i * 20}px`,
                                height: `${140 + i * 20}px`,
                                left: `${-10 - i * 10}px`,
                                top: `${-10 - i * 10}px`,
                                animationDelay: `${i * 0.2}s`,
                                opacity: Math.max(0.1, audioLevel / 100 - i * 0.2)
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Display */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {getAgentModeIcon()}
                    <span className="font-medium capitalize">
                      {agentMode === "listening" ? "Listening..." : 
                       agentMode === "speaking" ? "Speaking..." :
                       agentMode === "thinking" ? "Thinking..." : "Ready"}
                    </span>
                  </div>
                  {isRecording && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-100"
                        style={{ width: `${audioLevel}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Control Buttons */}
                <div className="flex justify-center gap-4">
                  {connectionStatus === "connected" ? (
                    <Button
                      onClick={stopConversation}
                      variant="destructive"
                      className="px-8 py-3 text-lg"
                    >
                      <PhoneOff className="h-5 w-5 mr-2" />
                      End Conversation
                    </Button>
                  ) : (
                    <Button
                      onClick={startConversation}
                      className="gradient-bg px-8 py-3 text-lg"
                      disabled={connectionStatus === "connecting"}
                    >
                      {connectionStatus === "connecting" ? (
                        <>
                          <Waves className="h-5 w-5 mr-2 animate-pulse" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Phone className="h-5 w-5 mr-2" />
                          {connectionStatus === "error" ? "Retry Connection" : "Start Conversation"}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conversation Log */}
          <div className="col-span-3">
            <Card className="glass-card h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Conversation Log
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full px-4">
                  <div className="space-y-3 pb-4">
                    {conversationLog.length === 0 ? (
                      <div className="text-center text-slate-500 text-sm p-4">
                        <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Conversation log will appear here</p>
                      </div>
                    ) : (
                      conversationLog.map((entry, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="capitalize font-medium">{entry.type}</span>
                            <span>{entry.timestamp}</span>
                          </div>
                          <div className={`p-2 rounded text-sm ${
                            entry.type === "user" 
                              ? "bg-blue-50 text-blue-900 ml-4" 
                              : entry.type === "agent"
                              ? "bg-green-50 text-green-900 mr-4"
                              : "bg-gray-50 text-gray-700 text-center"
                          }`}>
                            {entry.content}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Voice Chat Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <Mic className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Clear Speech</p>
                    <p className="text-slate-600">Speak clearly and at normal pace for best results</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Volume2 className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Listen Carefully</p>
                    <p className="text-slate-600">Wait for the AI to finish speaking before responding</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Brain className="h-4 w-4 text-purple-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Natural Conversation</p>
                    <p className="text-slate-600">Ask questions and engage naturally with your AI teacher</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}