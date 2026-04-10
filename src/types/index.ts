// ===== Types for Atyef =====

export type UserRole = "LEARNER" | "TEACHER" | "ADMIN";

export type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type CourseStyle =
  | "CLASSICAL"
  | "JAZZ"
  | "ROCK"
  | "POP"
  | "BLUES"
  | "METAL"
  | "FOLK"
  | "REGGAE"
  | "LATIN"
  | "ELECTRONIC"
  | "ORIENTAL"
  | "OTHER";

export type SubscriptionPlan = "BASIC" | "VIP" | "PREMIUM_PLUS";

export type SubscriptionStatus =
  | "ACTIVE"
  | "CANCELLED"
  | "PAST_DUE"
  | "TRIALING"
  | "INCOMPLETE";

export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: NavItem[];
}

export interface InstrumentData {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  courseCount?: number;
}

export interface CourseCardData {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl: string | null;
  level: CourseLevel;
  style: CourseStyle;
  duration: number;
  lessonCount: number;
  teacher: {
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
  };
  instrument: {
    name: string;
    slug: string;
    color: string | null;
  };
  progress?: number;
  enrolled?: boolean;
}

export interface LessonData {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  duration: number;
  sortOrder: number;
  isFree: boolean;
  completed?: boolean;
  watchedSeconds?: number;
  resources: {
    id: string;
    title: string;
    type: string;
    fileUrl: string;
  }[];
}

export interface DashboardStats {
  totalCourses: number;
  completedLessons: number;
  totalWatchTime: number;
  currentStreak: number;
}

export interface TeacherStats {
  totalStudents: number;
  totalCourses: number;
  totalViews: number;
  totalRevenue: number;
}

export interface AdminStats {
  totalUsers: number;
  totalLearners: number;
  totalTeachers: number;
  activeSubscriptions: number;
  totalCourses: number;
  totalRevenue: number;
  retentionRate: number;
}
