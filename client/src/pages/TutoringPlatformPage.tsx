import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Send, 
  MessageSquare, 
  Plus, 
  Clock, 
  BookOpen, 
  Brain, 
  ChevronRight,
  Upload,
  Play,
  StopCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Rating } from "@/components/ui/rating";
import { LoadingSpinner } from "@/components/ui/loading";
import { tutoringAPI, type ChatSession, type Message, type KnowledgeBaseDoc } from "@/lib/tutoring-api";
import { useTeachers } from "@/hooks/useTeachers";

interface Teacher {
  id: string;
  name: string;
  domain: string;
  teaching_style: string;
  personality_traits: string[];
  expertise_areas: string[];
}

const USER_ID = "user-123"; // In real app, get from auth context

export default function TutoringPlatformPage() {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [currentChat, setCurrentChat] = useState<ChatSession | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [chatTitle, setChatTitle] = useState("");
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [showKnowledgeDialog, setShowKnowledgeDialog] = useState(false);
  const [messagePreferences, setMessagePreferences] = useState({
    difficulty: "beginner",
    learningStyle: "visual",
    messageType: "question"
  });
  const [knowledgeDoc, setKnowledgeDoc] = useState<KnowledgeBaseDoc>({
    title: "",
    text: "",
    source: "",
    domain: "",
    difficulty_level: "beginner",
    tags: []
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get teachers from Enhanced Teacher API
  const { data: enhancedTeachers = [] } = useTeachers();

  // Queries using tutoring API
  const { data: chatSessions = [], isLoading: chatsLoading } = useQuery({
    queryKey: ["tutoring-chats"],
    queryFn: () => tutoringAPI.getUserChats(),
    enabled: true
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["tutoring-messages", currentChat?.id],
    queryFn: () => tutoringAPI.getChatHistory(currentChat!.id),
    enabled: !!currentChat?.id
  });

  const { data: knowledgeInfo } = useQuery({
    queryKey: ["knowledge-collection", selectedTeacher?.id],
    queryFn: () => tutoringAPI.getCollectionInfo(selectedTeacher!.id),
    enabled: !!selectedTeacher?.id
  });

  // Mutations
  const startChatMutation = useMutation({
    mutationFn: (data: { teacher_id: string; title: string }) =>
      tutoringAPI.startChat(data.teacher_id, data.title),
    onSuccess: (newChat) => {
      setCurrentChat(newChat);
      setShowNewChatDialog(false);
      setChatTitle("");
      queryClient.invalidateQueries({ queryKey: ["tutoring-chats"] });
      toast({
        title: "Chat Started",
        description: "New chat session created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: (data: { content: string; metadata: any }) =>
      tutoringAPI.sendMessage(currentChat!.id, data.content, data.metadata),
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: ["tutoring-messages", currentChat?.id] });
      queryClient.invalidateQueries({ queryKey: ["tutoring-chats"] });
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const rateMessageMutation = useMutation({
    mutationFn: (data: { messageId: string; rating: number }) =>
      tutoringAPI.rateMessage(currentChat!.id, data.messageId, data.rating),
    onSuccess: () => {
      toast({
        title: "Rating submitted",
        description: "Thank you for your feedback!",
      });
    },
  });

  const endChatMutation = useMutation({
    mutationFn: () => tutoringAPI.endChat(currentChat!.id),
    onSuccess: () => {
      setCurrentChat(null);
      queryClient.invalidateQueries({ queryKey: ["tutoring-chats"] });
      toast({
        title: "Chat ended",
        description: "Chat session has been ended",
      });
    },
  });

  const addDocumentMutation = useMutation({
    mutationFn: (data: KnowledgeBaseDoc) =>
      tutoringAPI.addDocument(selectedTeacher!.id, data),
    onSuccess: (result) => {
      setShowKnowledgeDialog(false);
      setKnowledgeDoc({
        title: "",
        text: "",
        source: "",
        domain: "",
        difficulty_level: "beginner",
        tags: []
      });
      queryClient.invalidateQueries({ queryKey: ["knowledge-collection", selectedTeacher?.id] });
      toast({
        title: "Document added",
        description: `Successfully added ${result.count} document chunks`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error adding document",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChat) return;

    sendMessageMutation.mutate({
      content: newMessage,
      metadata: {
        message_type: messagePreferences.messageType,
        difficulty_preference: messagePreferences.difficulty,
        learning_style: messagePreferences.learningStyle,
      },
    });
  };

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher || !chatTitle.trim()) return;

    startChatMutation.mutate({
      teacher_id: selectedTeacher.id,
      title: chatTitle,
    });
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!knowledgeDoc.title || !knowledgeDoc.text) return;

    addDocumentMutation.mutate(knowledgeDoc);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            AI Tutoring Platform
          </h1>
          <p className="text-slate-600">
            Engage with AI teachers powered by advanced RAG technology
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          {/* Teachers Sidebar */}
          <div className="col-span-3">
            <Card className="h-full glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Teachers
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100%-80px)]">
                  <div className="p-4 space-y-3">
                    {enhancedTeachers.length === 0 ? (
                      <div className="text-center text-slate-500 text-sm p-4">
                        <AlertCircle className="h-6 w-6 mx-auto mb-2" />
                        <p>No teachers available</p>
                        <p className="text-xs mt-1">Create teachers first in the Enhanced Teacher API</p>
                      </div>
                    ) : (
                      enhancedTeachers.map((teacher: any) => (
                        <div
                          key={teacher.id}
                          className={`p-3 rounded-lg cursor-pointer transition-all border ${
                            selectedTeacher?.id === teacher.id
                              ? "bg-primary/10 border-primary"
                              : "hover:bg-slate-50 border-transparent"
                          }`}
                          onClick={() => setSelectedTeacher({
                            id: teacher.id,
                            name: teacher.name,
                            domain: teacher.domain,
                            teaching_style: teacher.teaching_style,
                            personality_traits: teacher.personality_traits || [],
                            expertise_areas: teacher.expertise_areas || []
                          })}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="gradient-bg text-white text-xs">
                                {teacher.name.split(" ").map((n: string) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{teacher.name}</p>
                              <p className="text-xs text-slate-500">{teacher.domain}</p>
                            </div>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {(teacher.expertise_areas || []).slice(0, 2).map((area: string) => (
                              <Badge key={area} variant="secondary" className="text-xs">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Chat Sessions */}
          <div className="col-span-3">
            <Card className="h-full glass-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Chat Sessions
                </CardTitle>
                <Dialog open={showNewChatDialog} onOpenChange={setShowNewChatDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" disabled={!selectedTeacher}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Start New Chat</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleStartChat} className="space-y-4">
                      <div>
                        <Label>Teacher</Label>
                        <p className="text-sm text-slate-600">
                          {selectedTeacher?.name} - {selectedTeacher?.domain}
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="title">Chat Title</Label>
                        <Input
                          id="title"
                          value={chatTitle}
                          onChange={(e) => setChatTitle(e.target.value)}
                          placeholder="Enter chat title..."
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full gradient-bg"
                        disabled={startChatMutation.isPending}
                      >
                        {startChatMutation.isPending ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Start Chat
                          </>
                        )}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100%-80px)]">
                  <div className="p-4 space-y-3">
                    {chatsLoading ? (
                      <div className="flex justify-center p-4">
                        <LoadingSpinner />
                      </div>
                    ) : chatSessions.length === 0 ? (
                      <p className="text-center text-slate-500 text-sm">
                        No chat sessions yet
                      </p>
                    ) : (
                      chatSessions.map((chat: ChatSession) => (
                        <div
                          key={chat.id}
                          className={`p-3 rounded-lg cursor-pointer transition-all border ${
                            currentChat?.id === chat.id
                              ? "bg-primary/10 border-primary"
                              : "hover:bg-slate-50 border-transparent"
                          }`}
                          onClick={() => setCurrentChat(chat)}
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm truncate">{chat.title}</h4>
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                            <Clock className="h-3 w-3" />
                            {formatTimestamp(chat.updated_at)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="col-span-6">
            <Card className="h-full glass-card flex flex-col">
              {currentChat ? (
                <>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{currentChat.title}</CardTitle>
                      <p className="text-sm text-slate-500">
                        {enhancedTeachers.find((t: any) => t.id === currentChat.teacher_id)?.name || "Unknown Teacher"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog open={showKnowledgeDialog} onOpenChange={setShowKnowledgeDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Add Knowledge
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Add to Knowledge Base</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleAddDocument} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="doc-title">Title</Label>
                                <Input
                                  id="doc-title"
                                  value={knowledgeDoc.title}
                                  onChange={(e) => setKnowledgeDoc({...knowledgeDoc, title: e.target.value})}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="doc-source">Source</Label>
                                <Input
                                  id="doc-source"
                                  value={knowledgeDoc.source}
                                  onChange={(e) => setKnowledgeDoc({...knowledgeDoc, source: e.target.value})}
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="doc-text">Content</Label>
                              <Textarea
                                id="doc-text"
                                value={knowledgeDoc.text}
                                onChange={(e) => setKnowledgeDoc({...knowledgeDoc, text: e.target.value})}
                                rows={6}
                                required
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="doc-domain">Domain</Label>
                                <Input
                                  id="doc-domain"
                                  value={knowledgeDoc.domain}
                                  onChange={(e) => setKnowledgeDoc({...knowledgeDoc, domain: e.target.value})}
                                />
                              </div>
                              <div>
                                <Label htmlFor="doc-difficulty">Difficulty</Label>
                                <Select
                                  value={knowledgeDoc.difficulty_level}
                                  onValueChange={(value: any) => setKnowledgeDoc({...knowledgeDoc, difficulty_level: value})}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="beginner">Beginner</SelectItem>
                                    <SelectItem value="intermediate">Intermediate</SelectItem>
                                    <SelectItem value="advanced">Advanced</SelectItem>
                                    <SelectItem value="expert">Expert</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <Button 
                              type="submit" 
                              className="w-full gradient-bg"
                              disabled={addDocumentMutation.isPending}
                            >
                              {addDocumentMutation.isPending ? (
                                <LoadingSpinner size="sm" />
                              ) : (
                                "Add Document"
                              )}
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => endChatMutation.mutate()}
                        disabled={endChatMutation.isPending}
                      >
                        <StopCircle className="h-4 w-4 mr-2" />
                        End Chat
                      </Button>
                    </div>
                  </CardHeader>
                  <Separator />
                  <CardContent className="flex-1 flex flex-col p-0">
                    <ScrollArea className="flex-1 px-4 py-2">
                      {messagesLoading ? (
                        <div className="flex justify-center p-4">
                          <LoadingSpinner />
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {messages
                            .filter((msg: Message) => msg.role !== "system")
                            .map((message: Message) => (
                              <div
                                key={message.id}
                                className={`flex ${
                                  message.role === "user" ? "justify-end" : "justify-start"
                                }`}
                              >
                                <div
                                  className={`max-w-[80%] rounded-lg p-3 ${
                                    message.role === "user"
                                      ? "gradient-bg text-white"
                                      : "bg-slate-100 text-slate-900"
                                  }`}
                                >
                                  <div className="whitespace-pre-wrap">{message.content}</div>
                                  
                                  {message.role === "assistant" && message.metadata.rag_enhanced && (
                                    <div className="mt-2 pt-2 border-t border-slate-200">
                                      <div className="flex items-center gap-2 text-xs text-slate-600 mb-1">
                                        <BookOpen className="h-3 w-3" />
                                        RAG Enhanced Response
                                      </div>
                                      {message.metadata.sources_used && (
                                        <div className="space-y-1">
                                          {message.metadata.sources_used.map((source, idx) => (
                                            <div key={idx} className="text-xs text-slate-500">
                                              • {source.title} (Score: {source.score.toFixed(2)})
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  
                                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/50">
                                    <span className="text-xs opacity-70">
                                      {formatTimestamp(message.timestamp)}
                                    </span>
                                    {message.role === "assistant" && (
                                      <Rating
                                        value={0}
                                        onChange={(rating) => 
                                          rateMessageMutation.mutate({ messageId: message.id, rating })
                                        }
                                        size="sm"
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          <div ref={messagesEndRef} />
                        </div>
                      )}
                    </ScrollArea>
                    
                    {/* Message Input */}
                    <div className="p-4 border-t">
                      <form onSubmit={handleSendMessage} className="space-y-3">
                        <div className="flex gap-2 text-xs">
                          <Select
                            value={messagePreferences.difficulty}
                            onValueChange={(value) => setMessagePreferences({...messagePreferences, difficulty: value})}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Select
                            value={messagePreferences.learningStyle}
                            onValueChange={(value) => setMessagePreferences({...messagePreferences, learningStyle: value})}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="visual">Visual</SelectItem>
                              <SelectItem value="auditory">Auditory</SelectItem>
                              <SelectItem value="kinesthetic">Kinesthetic</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex gap-2">
                          <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Ask your AI teacher anything..."
                            className="flex-1"
                          />
                          <Button 
                            type="submit" 
                            className="gradient-bg"
                            disabled={sendMessageMutation.isPending || !newMessage.trim()}
                          >
                            {sendMessageMutation.isPending ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">
                      Select a teacher and start chatting
                    </h3>
                    <p className="text-slate-500">
                      Choose an AI teacher from the sidebar to begin your learning journey
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>

        {/* Knowledge Base Info */}
        {selectedTeacher && knowledgeInfo && (
          <div className="mt-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Knowledge Base - {selectedTeacher.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {knowledgeInfo.document_count}
                      </div>
                      <div className="text-sm text-slate-500">Documents</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {knowledgeInfo.exists ? "Active" : "Inactive"}
                      </div>
                      <div className="text-sm text-slate-500">Status</div>
                    </div>
                  </div>
                  <Badge variant={knowledgeInfo.exists ? "default" : "secondary"}>
                    {knowledgeInfo.exists ? "Collection Ready" : "No Collection"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}