import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { blogPosts, volunteers, events, contacts } from '@/lib/data';
import { Users, Newspaper, Calendar, Mail } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    {
      title: 'Total Volunteers',
      value: volunteers.length,
      icon: Users,
    },
    {
      title: 'Blog Posts',
      value: blogPosts.length,
      icon: Newspaper,
    },
    {
      title: 'Upcoming Events',
      value: events.filter(e => new Date(e.date) > new Date()).length,
      icon: Calendar,
    },
    {
      title: 'New Contacts',
      value: contacts.length,
      icon: Mail,
    },
  ];

  return (
    <AppLayout>
      <main className="p-4 md:p-6 animate-fade-in-up">
        <PageHeader
          title="Dashboard"
          description="Welcome back, here's a summary of your organization's activity."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card 
              key={stat.title} 
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="mt-6 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Recent activity feed will be displayed here.</p>
          </CardContent>
        </Card>
      </main>
    </AppLayout>
  );
}
