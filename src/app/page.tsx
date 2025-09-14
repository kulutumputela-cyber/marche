import DashboardLayout from '@/components/dashboard/dashboard-layout';
import DashboardHeader from '@/components/dashboard/header';
import Filters from '@/components/dashboard/filters';
import StatsCards from '@/components/dashboard/stats-cards';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PresenceOverviewChart from '@/components/dashboard/presence-overview-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StudentRankingTable from '@/components/dashboard/student-ranking-table';
import ComparativeAnalysis from '@/components/dashboard/comparative-analysis';
import { Separator } from '@/components/ui/separator';
import InsightIdentification from '@/components/dashboard/insight-identification';

export default function Home() {
  return (
    <DashboardLayout>
      <DashboardHeader />
      <main className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Filters />
        <Separator />
        <StatsCards />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Presence Overview by Faculty</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <PresenceOverviewChart />
            </CardContent>
          </Card>
          <div className="col-span-4 lg:col-span-3">
            <InsightIdentification />
          </div>
        </div>
        <Tabs defaultValue="ranking">
          <TabsList>
            <TabsTrigger value="ranking">Student Rankings</TabsTrigger>
            <TabsTrigger value="comparison">Comparative Analysis</TabsTrigger>
          </TabsList>
          <TabsContent value="ranking">
            <StudentRankingTable />
          </TabsContent>
          <TabsContent value="comparison">
            <ComparativeAnalysis />
          </TabsContent>
        </Tabs>
      </main>
    </DashboardLayout>
  );
}
