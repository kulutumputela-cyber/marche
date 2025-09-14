'use client';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const data = [
  { name: 'Sci & Tech', value: 12, fill: 'hsl(var(--chart-1))' },
  { name: 'Econ & Mgmt', value: 25, fill: 'hsl(var(--chart-2))' },
  { name: 'Law & Politics', value: 8, fill: 'hsl(var(--chart-3))' },
  { name: 'Medicine', value: 5, fill: 'hsl(var(--chart-4))' },
  { name: 'Social Sci', value: 15, fill: 'hsl(var(--chart-5))' },
];

const chartConfig = {
  value: {
    label: 'Tardiness',
  },
  'Sci & Tech': {
    label: 'Sci & Tech',
    color: 'hsl(var(--chart-1))',
  },
  'Econ & Mgmt': {
    label: 'Econ & Mgmt',
    color: 'hsl(var(--chart-2))',
  },
  'Law & Politics': {
    label: 'Law & Politics',
    color: 'hsl(var(--chart-3))',
  },
  Medicine: {
    label: 'Medicine',
    color: 'hsl(var(--chart-4))',
  },
  'Social Sci': {
    label: 'Social Sci',
    color: 'hsl(var(--chart-5))',
  },
};

export default function TardinessByFacultyChart() {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-[250px]"
    >
      <ResponsiveContainer>
        <PieChart>
          <Tooltip content={<ChartTooltipContent />} />
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
