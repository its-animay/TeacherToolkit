import { createContext, useContext, useState, ReactNode } from "react";
import type { Teacher } from "@shared/schema";

interface TeacherContextType {
  selectedTeacher: Teacher | null;
  setSelectedTeacher: (teacher: Teacher | null) => void;
  searchFilters: Record<string, any>;
  setSearchFilters: (filters: Record<string, any>) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

const TeacherContext = createContext<TeacherContextType | undefined>(undefined);

interface TeacherProviderProps {
  children: ReactNode;
}

export function TeacherProvider({ children }: TeacherProviderProps) {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [searchFilters, setSearchFilters] = useState<Record<string, any>>({});
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const value = {
    selectedTeacher,
    setSelectedTeacher,
    searchFilters,
    setSearchFilters,
    viewMode,
    setViewMode,
  };

  return (
    <TeacherContext.Provider value={value}>
      {children}
    </TeacherContext.Provider>
  );
}

export function useTeacherContext() {
  const context = useContext(TeacherContext);
  if (context === undefined) {
    throw new Error("useTeacherContext must be used within a TeacherProvider");
  }
  return context;
}
