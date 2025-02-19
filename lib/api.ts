const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_PREFIX = '/api/v1';

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_URL}${API_PREFIX}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (response.status === 401) {
      const newToken = await refreshToken();
      if (newToken) {
        return fetchWithAuth(endpoint, options);
      }
      throw new Error('Authentication failed');
    }

    if (!response.ok) {
      throw new Error('API request failed');
    }

    return response.json();
  } catch (error) {
    throw error;
  }
}

async function refreshToken() {
  try {
    const response = await fetch(`${API_URL}${API_PREFIX}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.accessToken);
    return data.accessToken;
  } catch (error) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    return null;
  }
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      fetchWithAuth('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    register: (userData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      role: string;
    }) =>
      fetchWithAuth('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    refresh: refreshToken,
  },
  admin: {
    getUsers: () => fetchWithAuth('/admin/users'),
    addUser: (userData: {
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    }) =>
      fetchWithAuth('/admin/user', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    updateUser: (userId: string, userData: {
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    }) =>
      fetchWithAuth(`/admin/user/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      }),
    deleteUser: (userId: string) =>
      fetchWithAuth(`/admin/user/${userId}`, {
        method: 'DELETE',
      }),
    getCourses: () => fetchWithAuth('/admin/courses'),
    addCourse: (courseData: { name: string }) =>
      fetchWithAuth('/admin/course', {
        method: 'POST',
        body: JSON.stringify(courseData),
      }),
    updateCourse: (courseId: string, courseData: { name: string }) =>
      fetchWithAuth(`/admin/course/${courseId}`, {
        method: 'PUT',
        body: JSON.stringify(courseData),
      }),
    deleteCourse: (courseId: string) =>
      fetchWithAuth(`/admin/course/${courseId}`, {
        method: 'DELETE',
      }),
    assignStudent: (assignData: {
      studentId: string;
      teacherId: string;
      courseId: string;
    }) =>
      fetchWithAuth('/admin/assign', {
        method: 'POST',
        body: JSON.stringify(assignData),
      }),
  },
  teacher: {
    getStudents: (teacherId: string) =>
      fetchWithAuth(`/teacher/${teacherId}/students`),
    createMark: (markData: {
      studentId: string;
      teacherId: string;
      courseId: string;
      markValue: number;
    }) =>
      fetchWithAuth('/teacher/mark', {
        method: 'POST',
        body: JSON.stringify(markData),
      }),
    updateMark: (markId: string, markData: { newMarkValue: number }) =>
      fetchWithAuth(`/teacher/mark/${markId}`, {
        method: 'PUT',
        body: JSON.stringify(markData),
      }),
  },
  student: {
    getData: () => fetchWithAuth('/student/data'),
  },
};