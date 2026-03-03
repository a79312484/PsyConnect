'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CurrentUser {
  id: string;
  full_name: string;
  email: string;
  username: string;
}

const NAVIGATION_ITEMS = [
  { icon: Home, label: 'Dashboard', id: 'dashboard' },
  { icon: Calendar, label: 'Takvim', id: 'calendar' },
  { icon: Users, label: 'Danışanlar', id: 'clients' },
  { icon: ClipboardList, label: 'Testler & Ödev', id: 'tests' },
  { icon: Archive, label: 'Arşiv', id: 'archive' },
  { icon: BarChart3, label: 'Muhasebe', id: 'accounting' },
  { icon: Users2, label: 'Topluluk & Eşleştir', id: 'community' },
  { icon: Settings, label: 'Ayarlar', id: 'settings' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const currentUserJSON = localStorage.getItem('current_user');
    if (!currentUserJSON) {
      router.push('/auth');
      return;
    }

    try {
      const currentUser: CurrentUser = JSON.parse(currentUserJSON);
      setUser(currentUser);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to parse current_user:', error);
      router.push('/auth');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('current_user');
    router.push('/auth');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">Yükleniyor...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

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
              {user.full_name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0 hidden sm:block">
              <p className="text-sm font-medium truncate">{user.full_name}</p>
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
                Merhaba, {user.full_name.split(' ')[0]}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Hoş geldiniz! Bugün randevularınız var.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial sm:w-64">
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Ara..."
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
                      {user.full_name.charAt(0).toUpperCase()}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Profil Ayarları
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Tercihler
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Çıkış Yap
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
