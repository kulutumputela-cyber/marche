'use client';

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { presenceData } from '@/lib/data';
import {
  ChartTooltipContent,
  ChartTooltip,
  ChartContainer,
} from '@/components/ui/chart';

export default function PresenceOverviewChart() {
  const chartData = presenceData.byFaculty.map((item) => ({
    name: item.faculty.split(' ').slice(0, 2).join(' '), // Shorten name for chart
    Taux: item.attendanceRate,
    Absences: item.absences,
  }));

  const chartConfig = {
    Taux: {
      label: 'Attendance Rate',
      color: 'hsl(var(--primary))',
    },
    Absences: {
      label: 'Absences',
      color: 'hsl(var(--destructive))',
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            content={<ChartTooltipContent />}
            cursor={{ fill: 'hsl(var(--muted))' }}
          />
          <Legend />
          <Bar
            dataKey="Taux"
            fill="var(--color-Taux)"
            radius={[4, 4, 0, 0]}
            name="Attendance Rate"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}