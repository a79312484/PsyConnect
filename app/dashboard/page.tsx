'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  Users,
  ClipboardList,
  BarChart3,
  MoreVertical,
  Video,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { useToast } from '@/hooks/use-toast';

interface Appointment {
  id: string;
  clientName: string;
  date: string;
  time: string;
  type: 'online' | 'face-to-face';
  notes?: string;
  psychologist_username: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export default function DashboardPage() {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load appointments from localStorage
    const appointmentsJSON = localStorage.getItem('mock_appointments');
    if (appointmentsJSON) {
      try {
        const loadedAppointments: Appointment[] = JSON.parse(appointmentsJSON);
        setAppointments(loadedAppointments);
      } catch (error) {
        console.error('Failed to parse appointments:', error);
        setAppointments([]);
      }
    }
    setIsLoading(false);
  }, []);

  const handleApproveAppointment = (appointmentId: string) => {
    const appointmentsJSON = localStorage.getItem('mock_appointments');
    const allAppointments: Appointment[] = appointmentsJSON
      ? JSON.parse(appointmentsJSON)
      : [];

    const updatedAppointments = allAppointments.map((apt) =>
      apt.id === appointmentId ? { ...apt, status: 'approved' as const } : apt
    );

    localStorage.setItem('mock_appointments', JSON.stringify(updatedAppointments));
    setAppointments(updatedAppointments);

    toast({
      title: 'Başarılı',
      description: 'Randevu onaylandı.',
    });
  };

  const handleRejectAppointment = (appointmentId: string) => {
    const appointmentsJSON = localStorage.getItem('mock_appointments');
    const allAppointments: Appointment[] = appointmentsJSON
      ? JSON.parse(appointmentsJSON)
      : [];

    const updatedAppointments = allAppointments.map((apt) =>
      apt.id === appointmentId ? { ...apt, status: 'rejected' as const } : apt
    );

    localStorage.setItem('mock_appointments', JSON.stringify(updatedAppointments));
    setAppointments(updatedAppointments);

    toast({
      title: 'Başarılı',
      description: 'Randevu reddedildi.',
      variant: 'destructive',
    });
  };

  // Refresh appointments from localStorage
  const refreshAppointments = () => {
    const appointmentsJSON = localStorage.getItem('mock_appointments');
    if (appointmentsJSON) {
      try {
        const loadedAppointments: Appointment[] = JSON.parse(appointmentsJSON);
        setAppointments(loadedAppointments);
      } catch (error) {
        console.error('Failed to parse appointments:', error);
      }
    }
  };

  // Auto-refresh every 5 seconds to catch updates from other tabs
  useEffect(() => {
    const interval = setInterval(refreshAppointments, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      label: "Bugün's Randevuları",
      value: appointments.length.toString(),
      icon: Calendar,
      color: 'bg-emerald-50',
    },
    {
      label: 'Aktif Danışanlar',
      value: '28',
      icon: Users,
      color: 'bg-blue-50',
    },
    {
      label: 'Beklemede Test Sonuçları',
      value: '2',
      icon: ClipboardList,
      color: 'bg-amber-50',
    },
    {
      label: 'Aylık Gelir',
      value: '₺24.500',
      icon: BarChart3,
      color: 'bg-rose-50',
    },
  ];

  if (isLoading) {
    return <div className="p-6">Yükleniyor...</div>;
  }

  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="p-6 rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {stat.value}
                  </p>
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
            <h2 className="text-lg font-bold text-foreground">
              Yaklaşan Randevular
            </h2>
            <Button variant="outline" className="rounded-lg">
              Tümünü Görüntüle
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {appointments.length > 0 ? (
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="font-semibold text-foreground">
                    Danışan Adı
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Tarih
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Saat
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Türü
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Durum
                  </TableHead>
                  <TableHead className="text-right font-semibold text-foreground">
                    İşlem
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow
                    key={appointment.id}
                    className="border-border hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-medium text-foreground">
                      {appointment.clientName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {appointment.date}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {appointment.time}
                    </TableCell>
                    <TableCell>
                    <Badge
                      variant={
                        appointment.type === 'online' ? 'default' : 'secondary'
                      }
                      className={`rounded-full ${
                        appointment.type === 'online'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {appointment.type === 'online'
                        ? 'Online'
                        : 'Yüz Yüze'}
                    </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`rounded-full ${
                          appointment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : appointment.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {appointment.status === 'pending'
                          ? 'Bekliyor'
                          : appointment.status === 'approved'
                          ? 'Onaylandı'
                          : 'Reddedildi'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {appointment.status === 'pending' ? (
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white rounded-lg"
                            onClick={() => handleApproveAppointment(appointment.id)}
                          >
                            Onayla
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="rounded-lg"
                            onClick={() => handleRejectAppointment(appointment.id)}
                          >
                            Reddet
                          </Button>
                        </div>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Video className="w-4 h-4 mr-2" />
                              {appointment.type === 'online'
                                ? 'Toplantıya Katıl'
                                : 'Profili Görüntüle'}
                            </DropdownMenuItem>
                            <DropdownMenuItem>Notları Görüntüle</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              Yeniden Planla
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">
                Henüz randevu yoktur.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
