"use client";

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StudentData = {
  courses: Array<{
    id: string;
    name: string;
    teacher: {
      firstName: string;
      lastName: string;
    };
    mark: number;
  }>;
};

export default function StudentDashboard() {
  const [studentData, setStudentData] = useState<StudentData | null>(null);

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = async () => {
    try {
      const data = await api.student.getData();
      setStudentData(data);
    } catch (error) {
      console.error('Failed to load student data:', error);
    }
  };

  if (!studentData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>My Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Mark</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentData.courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.name}</TableCell>
                  <TableCell>{`${course.teacher.firstName} ${course.teacher.lastName}`}</TableCell>
                  <TableCell>{course.mark}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}