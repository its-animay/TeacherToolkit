import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Send, Bot, User, Sparkles, Brain, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Teacher } from "@shared/schema";

interface Message {
  id: string;
  content: string;
  sender: "user" | "teacher";
  timestamp: Date;
}

interface ChatInterfaceProps {
  teacher: Teacher;
  onClose?: () => void;
}

// Simulated responses based on teacher personality
const generateTeacherResponse = (teacher: Teacher, userMessage: string): string => {
  const { personality, specialization } = teacher;
  
  // Simple response generation based on personality traits
  const responses = {
    greeting: [
      `Hello! I'm ${teacher.name}, your ${specialization.primary_domain} teacher. How can I help you learn today?`,
      `Welcome! I'm excited to explore ${specialization.primary_domain} with you. What would you like to discuss?`,
      `Hi there! Ready to dive into some fascinating ${specialization.primary_domain} concepts?`
    ],
    encouraging: [
      "That's a great question! Let me help you understand this better.",
      "Excellent thinking! You're on the right track.",
      "I love your curiosity! Let's explore this together."
    ],
    analytical: [
      "Let's break this down step by step to understand the underlying principles.",
      "This is an interesting problem that requires careful analysis.",
      "Let me walk you through the logical framework behind this concept."
    ],
    humorous: [
      "Great question! You know, this reminds me of a funny story...",
      "Ah, the classic confusion! Don't worry, even Einstein probably scratched his head at this once.",
      "This concept can be tricky, but think of it like..."
    ],
    patient: [
      "Take your time with this. It's perfectly normal to find this challenging at first.",
      "No worries at all! Let's go through this slowly, one piece at a time.",
      "Everyone learns at their own pace. Let me explain this in a different way."
    ]
  };

  // Determine response type based on message content and personality
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
  }
  
  // Select response style based on primary traits
  let responsePool = responses.encouraging;
  
  if (personality.primary_traits.includes('analytical')) {
    responsePool = responses.analytical;
  } else if (personality.primary_traits.includes('humorous')) {
    responsePool = responses.humorous;
  } else if (personality.primary_traits.includes('patient')) {
    responsePool = responses.patient;
  }
  
  let baseResponse = responsePool[Math.floor(Math.random() * responsePool.length)];
  
  // Add domain-specific context
  if (lowerMessage.includes('explain') || lowerMessage.includes('how') || lowerMessage.includes('what')) {
    baseResponse += ` In ${specialization.primary_domain}, this concept is fundamental because it helps us understand the core principles that govern how things work.`;
  }
  
  // Add signature phrases if available
  if (personality.signature_phrases.length > 0) {
    const randomPhrase = personality.signature_phrases[Math.floor(Math.random() * personality.signature_phrases.length)];
    baseResponse += ` Remember: "${randomPhrase}"`;
  }
  
  return baseResponse;
};

export default function ChatInterface({ teacher, onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: `Hello! I'm ${teacher.name}, your ${teacher.specialization.primary_domain} teacher. I'm here to help you learn and explore. What would you like to discuss today?`,
      sender: "teacher",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const teacherResponse = generateTeacherResponse(teacher, inputValue);
      const teacherMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: teacherResponse,
        sender: "teacher",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, teacherMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const teacherInitials = teacher.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Chat Header */}
      <Card className="rounded-none border-x-0 border-t-0 shadow-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                <AvatarImage src={teacher.avatar_url || ""} alt={teacher.name} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold">
                  {teacherInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <span>{teacher.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    <Bot className="w-3 h-3 mr-1" />
                    AI Teacher
                  </Badge>
                </CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {teacher.specialization.primary_domain}
                  </Badge>
                  <Badge variant="outline" className="text-xs capitalize">
                    {teacher.personality.teaching_style}
                  </Badge>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                    Online
                  </div>
                </div>
              </div>
            </div>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                ✕
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex items-start space-x-3",
              message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
            )}
          >
            <Avatar className="h-8 w-8 mt-1">
              {message.sender === "teacher" ? (
                <>
                  <AvatarImage src={teacher.avatar_url || ""} alt={teacher.name} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xs">
                    {teacherInitials}
                  </AvatarFallback>
                </>
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs">
                  <User className="w-4 h-4" />
                </AvatarFallback>
              )}
            </Avatar>
            
            <div
              className={cn(
                "max-w-[70%] rounded-2xl px-4 py-3 shadow-sm",
                message.sender === "teacher"
                  ? "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  : "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground"
              )}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              <div className="flex items-center justify-between mt-2">
                <span className={cn(
                  "text-xs",
                  message.sender === "teacher" ? "text-muted-foreground" : "text-primary-foreground/70"
                )}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {message.sender === "teacher" && (
                  <Brain className="w-3 h-3 text-primary/60" />
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-start space-x-3">
            <Avatar className="h-8 w-8 mt-1">
              <AvatarImage src={teacher.avatar_url || ""} alt={teacher.name} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xs">
                {teacherInitials}
              </AvatarFallback>
            </Avatar>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-muted-foreground ml-2">
                  {teacher.name} is typing...
                </span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <Card className="rounded-none border-x-0 border-b-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask ${teacher.name} anything about ${teacher.specialization.primary_domain}...`}
                className="pr-12 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary/20"
                disabled={isTyping}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Sparkles className="w-4 h-4 text-primary/60" />
              </div>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md"
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Quick Suggestions */}
          <div className="flex flex-wrap gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              className="text-xs bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
              onClick={() => setInputValue("Can you explain the basics?")}
              disabled={isTyping}
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              Explain basics
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
              onClick={() => setInputValue("Give me an example")}
              disabled={isTyping}
            >
              <Brain className="w-3 h-3 mr-1" />
              Show example
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
              onClick={() => setInputValue("How does this work?")}
              disabled={isTyping}
            >
              <Sparkles className="w-3 h-3 mr-1" />
              How it works
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}