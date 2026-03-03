'use client';

import { useState } from 'react';
import {
  Home,
  Calendar,
  Users,
  ClipboardList,
  Archive,
  BarChart3,
  Users2,
  Settings,
  Bell,
  Search,
  LogOut,
  MoreVertical,
  Video,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const NAVIGATION_ITEMS = [
  { icon: Home, label: 'Dashboard', id: 'dashboard' },
  { icon: Calendar, label: 'Calendar', id: 'calendar' },
  { icon: Users, label: 'Clients', id: 'clients' },
  { icon: ClipboardList, label: 'Tests & Homework', id: 'tests' },
  { icon: Archive, label: 'Archive', id: 'archive' },
  { icon: BarChart3, label: 'Accounting', id: 'accounting' },
  { icon: Users2, label: 'Community & Match', id: 'community' },
  { icon: Settings, label: 'Settings', id: 'settings' },
];

const MOCK_APPOINTMENTS = [
  {
    id: 1,
    clientName: 'Ayşe Kaya',
    time: '10:00',
    type: 'online',
    date: 'Today',
  },
  {
    id: 2,
    clientName: 'Mehmet Demir',
    time: '11:30',
    type: 'face-to-face',
    date: 'Today',
  },
  {
    id: 3,
    clientName: 'Zeynep Yıldız',
    time: '14:00',
    type: 'online',
    date: 'Today',
  },
  {
    id: 4,
    clientName: 'Can Özer',
    time: '15:30',
    type: 'face-to-face',
    date: 'Today',
  },
];

export function PsychologistDashboard() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [user] = useState({
    name: 'Uzm. Psk. Ahmet Yılmaz',
    email: 'ahmet@psychology.com',
    avatar: '👤',
  });

  const stats = [
    { label: 'Today\'s Appointments', value: '4', icon: Calendar, color: 'bg-emerald-50' },
    { label: 'Active Clients', value: '28', icon: Users, color: 'bg-blue-50' },
    { label: 'Pending Test Results', value: '2', icon: ClipboardList, color: 'bg-amber-50' },
    { label: 'Monthly Revenue', value: '₺24.500', icon: BarChart3, color: 'bg-rose-50' },
  ];

  return (
    <div className="flex h-screen flex-col md:flex-row bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-primary text-primary-foreground flex flex-col border-b md:border-r border-sidebar-border">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-foreground rounded-lg flex items-center justify-center font-bold text-primary">
              AP
            </div>
            <div className="hidden md:block">
              <h2 className="font-semibold text-sm">Psychology</h2>
              <p className="text-xs opacity-75">Practice Hub</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {NAVIGATION_ITEMS.map(({ icon: Icon, label, id }) => (
            <button
              key={id}
              onClick={() => setActiveNav(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeNav === id
                  ? 'bg-primary-foreground text-primary'
                  : 'text-primary-foreground hover:bg-primary-foreground/10'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium hidden sm:inline">{label}</span>
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-primary-foreground/10">
            <div className="w-8 h-8 bg-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold text-primary">
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0 hidden sm:block">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs opacity-75 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-background sticky top-0 z-40 px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Merhaba, {user.name.split(' ').slice(-1)[0]}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Hoş geldiniz! Bugün {MOCK_APPOINTMENTS.length} randevunuz var.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial sm:w-64">
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-10 bg-muted border-0 placeholder:text-muted-foreground"
                />
              </div>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full"></span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                      {user.avatar}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Preferences
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="p-6 rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Appointments Table */}
          <Card className="rounded-2xl border-0 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">Yaklaşan Randevular</h2>
                <Button variant="outline" className="rounded-lg">
                  View All
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="font-semibold text-foreground">Client Name</TableHead>
                    <TableHead className="font-semibold text-foreground">Time</TableHead>
                    <TableHead className="font-semibold text-foreground">Type</TableHead>
                    <TableHead className="text-right font-semibold text-foreground">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_APPOINTMENTS.map((appointment) => (
                    <TableRow key={appointment.id} className="border-border hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium text-foreground">{appointment.clientName}</TableCell>
                      <TableCell className="text-muted-foreground">{appointment.time}</TableCell>
                      <TableCell>
                        <Badge
                          variant={appointment.type === 'online' ? 'default' : 'secondary'}
                          className={`rounded-full ${
                            appointment.type === 'online'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {appointment.type === 'online' ? 'Online' : 'Face-to-Face'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Video className="w-4 h-4 mr-2" />
                              {appointment.type === 'online' ? 'Join Meeting' : 'View Profile'}
                            </DropdownMenuItem>
                            <DropdownMenuItem>View Notes</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Reschedule</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
