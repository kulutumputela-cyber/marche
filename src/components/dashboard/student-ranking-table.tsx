import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { students } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, ArrowUp } from 'lucide-react';

export default function StudentRankingTable() {
  const mostAssiduous = [...students]
    .sort((a, b) => b.attendance - a.attendance)
    .slice(0, 5);
  const mostAbsent = [...students]
    .sort((a, b) => b.absences - a.absences)
    .slice(0, 5);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUp className="h-5 w-5 text-green-500" />
            Most Assiduous Students
          </CardTitle>
          <CardDescription>
            Top 5 students with the highest attendance rate.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Promotion</TableHead>
                <TableHead className="text-right">Attendance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mostAssiduous.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{student.promotion}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {student.attendance}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowDown className="h-5 w-5 text-red-500" />
            Most Absent Students
          </CardTitle>
          <CardDescription>
            Top 5 students with the most absences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Promotion</TableHead>
                <TableHead className="text-right">Absences</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mostAbsent.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{student.promotion}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {student.absences}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
