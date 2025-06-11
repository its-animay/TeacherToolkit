import { useQuery } from "@tanstack/react-query";
import { teacherApi } from "@/lib/api";

export function useTeachers() {
  return useQuery({
    queryKey: ["enhanced-teachers"],
    queryFn: teacherApi.getTeachers,
    retry: false,
    throwOnError: false,
  });
}

export function useTeacher(id: string) {
  return useQuery({
    queryKey: ["enhanced-teacher", id],
    queryFn: () => teacherApi.getTeacher(id),
    enabled: !!id,
    retry: false,
    throwOnError: false,
  });
}

export function useSearchTeachers(filters: Record<string, any>) {
  return useQuery({
    queryKey: ["enhanced-teacher-search", filters],
    queryFn: () => teacherApi.searchTeachers(filters),
    enabled: Object.keys(filters).some(key => filters[key] !== undefined && filters[key] !== null && filters[key] !== ''),
    retry: false,
    throwOnError: false,
  });
}

export function useTeachersByDomain(domain: string) {
  return useQuery({
    queryKey: ["enhanced-teacher-domain", domain],
    queryFn: () => teacherApi.getTeachersByDomain(domain),
    enabled: !!domain,
    retry: false,
    throwOnError: false,
  });
}

export function useStyles() {
  return useQuery({
    queryKey: ["enhanced-teacher-styles"],
    queryFn: teacherApi.getStyles,
    retry: false,
    throwOnError: false,
  });
}
