import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { students, faculties } from '@/lib/data';
import ReportsHeader from '@/components/reports/header';
import AttendanceByDepartmentChart from '@/components/reports/attendance-by-department-chart';
import TardinessByFacultyChart from '@/components/reports/tardiness-by-faculty-chart';

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <ReportsHeader />
      <main className="flex-1 space-y-6 p-4 pt-6 md:p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Rate by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <AttendanceByDepartmentChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Tardiness Rate by Faculty</CardTitle>
            </CardHeader>
            <CardContent>
              <TardinessByFacultyChart />
            </CardContent>
          </Card>
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Faculty Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {faculties.map((faculty) => (
                  <li
                    key={faculty.id}
                    className="flex items-center justify-between"
                  >
                    <span>{faculty.name}</span>
                    <Badge variant="secondary">85%</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Detailed Student Report</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Faculty</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Promotion</TableHead>
                  <TableHead className="text-right">Attendance</TableHead>
                  <TableHead className="text-right">Absences</TableHead>
                  <TableHead className="text-right">Tardiness</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.name}
                    </TableCell>
                    <TableCell>{student.faculty}</TableCell>
                    <TableCell>{student.department}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{student.promotion}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {student.attendance}%
                    </TableCell>
                    <TableCell className="text-right">
                      {student.absences}
                    </TableCell>
                    <TableCell className="text-right">
                      {student.tardiness}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </DashboardLayout>
  );
}
