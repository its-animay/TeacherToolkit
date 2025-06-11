const API_BASE_URL = import.meta.env.VITE_TUTORING_API_URL || "https://ai-tutoring-platform.replit.app";
const USER_ID = "user-123"; // In real app, get from auth context

export interface ChatSession {
  id: string;
  user_id: string;
  teacher_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
}

export interface Message {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
  timestamp: string;
  metadata: {
    teacher_id?: string;
    teacher_name?: string;
    domain?: string;
    teaching_style?: string;
    rag_enhanced?: boolean;
    sources_used?: Array<{
      title: string;
      source: string;
      score: number;
    }>;
    message_type?: string;
    difficulty_preference?: string;
    learning_style?: string;
  };
}

export interface KnowledgeBaseDoc {
  title: string;
  text: string;
  source?: string;
  domain?: string;
  sub_domains?: string[];
  difficulty_level?: "beginner" | "intermediate" | "advanced" | "expert";
  tags?: string[];
}

export interface KnowledgeCollection {
  teacher_id: string;
  document_count: number;
  exists: boolean;
}

class TutoringAPI {
  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-User-ID": USER_ID,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Network error" }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Chat endpoints
  async startChat(teacherId: string, title: string): Promise<ChatSession> {
    return this.request("/chat/start", {
      method: "POST",
      body: JSON.stringify({
        teacher_id: teacherId,
        title: title,
      }),
    });
  }

  async sendMessage(chatId: string, content: string, metadata: any = {}): Promise<Message> {
    return this.request(`/chat/${chatId}/send`, {
      method: "POST",
      body: JSON.stringify({
        content,
        metadata,
      }),
    });
  }

  async getChatHistory(chatId: string): Promise<Message[]> {
    return this.request(`/chat/${chatId}/history`);
  }

  async getUserChats(teacherId?: string): Promise<ChatSession[]> {
    const queryParam = teacherId ? `?teacher_id=${teacherId}` : "";
    return this.request(`/chat/${queryParam}`);
  }

  async rateMessage(chatId: string, messageId: string, rating: number): Promise<{ message: string; rating: number }> {
    return this.request(`/chat/${chatId}/message/${messageId}/rate`, {
      method: "POST",
      body: JSON.stringify({ rating }),
    });
  }

  async endChat(chatId: string): Promise<{ message: string }> {
    return this.request(`/chat/${chatId}/end`, {
      method: "POST",
    });
  }

  async getMessageSources(chatId: string, messageId: string) {
    return this.request(`/chat/${chatId}/message/${messageId}/sources`);
  }

  // Knowledge base endpoints
  async addDocument(teacherId: string, document: KnowledgeBaseDoc): Promise<{ success: boolean; count: number; message: string }> {
    return this.request(`/knowledge-base/document/${teacherId}`, {
      method: "POST",
      body: JSON.stringify(document),
    });
  }

  async addMultipleDocuments(teacherId: string, documents: KnowledgeBaseDoc[]): Promise<{ success: boolean; count: number; message: string }> {
    return this.request(`/knowledge-base/documents/${teacherId}`, {
      method: "POST",
      body: JSON.stringify(documents),
    });
  }

  async deleteDocument(teacherId: string, documentId: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/knowledge-base/document/${teacherId}/${documentId}`, {
      method: "DELETE",
    });
  }

  async getCollectionInfo(teacherId: string): Promise<KnowledgeCollection> {
    return this.request(`/knowledge-base/collection/${teacherId}`);
  }

  async createCollection(teacherId: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/knowledge-base/collection/${teacherId}`, {
      method: "POST",
    });
  }

  async deleteCollection(teacherId: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/knowledge-base/collection/${teacherId}`, {
      method: "DELETE",
    });
  }
}

export const tutoringAPI = new TutoringAPI();