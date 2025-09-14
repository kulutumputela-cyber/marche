import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import SettingsHeader from '@/components/settings/header';
import { Textarea } from '@/components/ui/textarea';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <SettingsHeader />
      <main className="flex-1 space-y-6 p-4 pt-6 md:p-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold">User Profile</h2>
            <p className="text-muted-foreground">
              Update your personal information.
            </p>
          </div>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="Admin" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="User" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="admin@ucb.ac" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us a little bit about yourself"
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button>Save</Button>
            </CardFooter>
          </Card>
        </div>

        <Separator />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold">Notifications</h2>
            <p className="text-muted-foreground">
              Manage how you receive notifications.
            </p>
          </div>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Choose which notifications to receive by email.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox id="weeklyReports" defaultChecked />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="weeklyReports"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Weekly Reports
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Receive a summary of attendance every week.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Checkbox id="anomalyAlerts" defaultChecked />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="anomalyAlerts"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Anomaly Alerts
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Get notified immediately about significant anomalies.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Checkbox id="systemUpdates" />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="systemUpdates"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    System Updates
                  </label>
                  <p className="text-sm text-muted-foreground">
                    News, updates, and promotional messages.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button>Save</Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </DashboardLayout>
  );
}
