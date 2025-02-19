"use client";

import { useState, useEffect } from 'react';
import { User, Course } from '@/lib/types';
import { api } from '@/lib/api';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<User>>({});
  const [currentCourse, setCurrentCourse] = useState<Partial<Course>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersData, coursesData] = await Promise.all([
        api.admin.getUsers(),
        api.admin.getCourses(),
      ]);
      setUsers(usersData);
      setCourses(coursesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentUser.id) {
        await api.admin.updateUser(currentUser.id, {
          email: currentUser.email!,
          firstName: currentUser.firstName!,
          lastName: currentUser.lastName!,
          role: currentUser.role!,
        });
      } else {
        await api.admin.addUser({
          email: currentUser.email!,
          firstName: currentUser.firstName!,
          lastName: currentUser.lastName!,
          role: currentUser.role!,
        });
      }
      setIsUserModalOpen(false);
      loadData();
      setCurrentUser({});
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  };

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentCourse.id) {
        await api.admin.updateCourse(currentCourse.id, {
          name: currentCourse.name!,
        });
      } else {
        await api.admin.addCourse({
          name: currentCourse.name!,
        });
      }
      setIsCourseModalOpen(false);
      loadData();
      setCurrentCourse({});
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save course:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.admin.deleteUser(userId);
        loadData();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.admin.deleteCourse(courseId);
        loadData();
      } catch (error) {
        console.error('Failed to delete course:', error);
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Users</h2>
          <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setCurrentUser({});
                setIsEditing(false);
              }}>
                <Plus className="mr-2 h-4 w-4" /> Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit User' : 'Add New User'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUserSubmit} className="space-y-4">
                <Input
                  placeholder="First Name"
                  value={currentUser.firstName || ''}
                  onChange={(e) => setCurrentUser({ ...currentUser, firstName: e.target.value })}
                />
                <Input
                  placeholder="Last Name"
                  value={currentUser.lastName || ''}
                  onChange={(e) => setCurrentUser({ ...currentUser, lastName: e.target.value })}
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={currentUser.email || ''}
                  onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                />
                <Select
                  value={currentUser.role}
                  onValueChange={(value: 'ADMIN' | 'TEACHER' | 'STUDENT') =>
                    setCurrentUser({ ...currentUser, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="TEACHER">Teacher</SelectItem>
                    <SelectItem value="STUDENT">Student</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit" className="w-full">
                  {isEditing ? 'Update' : 'Create'} User
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setCurrentUser(user);
                        setIsEditing(true);
                        setIsUserModalOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Courses</h2>
          <Dialog open={isCourseModalOpen} onOpenChange={setIsCourseModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setCurrentCourse({});
                setIsEditing(false);
              }}>
                <Plus className="mr-2 h-4 w-4" /> Add Course
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit Course' : 'Add New Course'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCourseSubmit} className="space-y-4">
                <Input
                  placeholder="Course Name"
                  value={currentCourse.name || ''}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, name: e.target.value })}
                />
                <Button type="submit" className="w-full">
                  {isEditing ? 'Update' : 'Create'} Course
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.name}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setCurrentCourse(course);
                        setIsEditing(true);
                        setIsCourseModalOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteCourse(course.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}