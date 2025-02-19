"use client";

import { useState, useEffect } from 'react';
import { User, Mark } from '@/lib/types';
import { api } from '@/lib/api';
import { getUser } from '@/lib/auth';
import { Pencil } from 'lucide-react';
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

type StudentWithMarks = User & {
  marks: Mark[];
};

export default function TeacherDashboard() {
  const [students, setStudents] = useState<StudentWithMarks[]>([]);
  const [currentMark, setCurrentMark] = useState<Partial<Mark>>({});
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);
  const teacher = getUser();

  useEffect(() => {
    if (teacher?.id) {
      loadStudents();
    }
  }, [teacher]);

  const loadStudents = async () => {
    try {
      if (teacher?.id) {
        const studentsData = await api.teacher.getStudents('7cbd70bb-5f28-4cc4-8cbe-ef4d26af693c');
        setStudents(studentsData);
      }
    } catch (error) {
      console.error('Failed to load students:', error);
    }
  };

  const handleMarkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentMark.id) {
        await api.teacher.updateMark(currentMark.id, {
          newMarkValue: currentMark.mark!,
        });
      } else {
        await api.teacher.createMark({
          studentId: currentMark.studentId!,
          teacherId: teacher?.id!,
          courseId: currentMark.courseId!,
          markValue: currentMark.mark!,
        });
      }
      setIsMarkModalOpen(false);
      loadStudents();
      setCurrentMark({});
    } catch (error) {
      console.error('Failed to save mark:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Students</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Mark</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{`${student.firstName} ${student.lastName}`}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>
                {student.marks.map((mark) => mark.courseId).join(', ')}
              </TableCell>
              <TableCell>
                {student.marks.map((mark) => mark.mark).join(', ')}
              </TableCell>
              <TableCell>
                <Dialog open={isMarkModalOpen} onOpenChange={setIsMarkModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const existingMark = student.marks.find(
                          (m) => m.teacherId === teacher?.id
                        );
                        setCurrentMark(
                          existingMark || {
                            studentId: student.id,
                            courseId: '',
                            mark: 0,
                          }
                        );
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {currentMark.id ? 'Update Mark' : 'Add Mark'}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleMarkSubmit} className="space-y-4">
                      <Input
                        type="number"
                        placeholder="Mark"
                        min="0"
                        max="100"
                        value={currentMark.mark || ''}
                        onChange={(e) =>
                          setCurrentMark({
                            ...currentMark,
                            mark: parseFloat(e.target.value),
                          })
                        }
                      />
                      <Button type="submit" className="w-full">
                        {currentMark.id ? 'Update' : 'Add'} Mark
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}