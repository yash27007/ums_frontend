export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  createdAt: string;
  updatedAt: string;
};

export type Course = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type AssignedCourse = {
  id: string;
  studentId: string;
  teacherId: string;
  courseId: string;
  createdAt: string;
  updatedAt: string;
};

export type Mark = {
  id: string;
  studentId: string;
  teacherId: string;
  courseId: string;
  mark: number;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  accessToken: string;
  user: User;
};