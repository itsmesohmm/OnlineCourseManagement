export interface UserDto {
  id: string;
  name: string;
  email: string;
}

export interface CourseModuleDto {
  _id: string;
  title: string;
  description: string;
}

export interface CourseDto {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  level: string;
  duration: string;
  accent?: string;
  modules: CourseModuleDto[];
}

export interface EnrollmentDto {
  _id: string;
  courseId: CourseDto | null;
  completedModules: string[];
}

export interface UserResponse {
  user: UserDto | null;
}

export interface CourseResponse {
  course?: CourseDto;
  error?: string;
}

export interface CoursesResponse {
  courses?: CourseDto[];
  error?: string;
}

export interface EnrollmentsResponse {
  enrollments?: EnrollmentDto[];
  error?: string;
}

export interface MessageResponse {
  message?: string;
  error?: string;
}
