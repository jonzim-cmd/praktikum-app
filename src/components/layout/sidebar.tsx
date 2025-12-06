'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  Building2,
  FileText,
  Calendar,
  Settings,
  ChevronLeft,
  GraduationCap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarProps {
  role: 'student' | 'teacher' | 'company' | 'admin';
}

const navItemsByRole: Record<SidebarProps['role'], NavItem[]> = {
  student: [
    { href: '/schueler', label: 'Dashboard', icon: Home },
    { href: '/schueler/praktikum', label: 'Mein Praktikum', icon: FileText },
    { href: '/schueler/berichte', label: 'Berichte', icon: FileText },
    { href: '/schueler/einstellungen', label: 'Einstellungen', icon: Settings },
  ],
  teacher: [
    { href: '/lehrer', label: 'Dashboard', icon: Home },
    { href: '/lehrer/schueler', label: 'Meine Schüler', icon: Users },
    { href: '/lehrer/betriebe', label: 'Betriebe', icon: Building2 },
    { href: '/lehrer/besuche', label: 'Besuche', icon: Calendar },
    { href: '/lehrer/einstellungen', label: 'Einstellungen', icon: Settings },
  ],
  company: [
    { href: '/betrieb', label: 'Dashboard', icon: Home },
    { href: '/betrieb/praktikanten', label: 'Praktikanten', icon: Users },
    { href: '/betrieb/einstellungen', label: 'Einstellungen', icon: Settings },
  ],
  admin: [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/schulen', label: 'Schulen', icon: GraduationCap },
    { href: '/admin/benutzer', label: 'Benutzer', icon: Users },
    { href: '/admin/betriebe', label: 'Betriebe', icon: Building2 },
    { href: '/admin/einstellungen', label: 'Einstellungen', icon: Settings },
  ],
};

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navItems = navItemsByRole[role];

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col h-screen bg-background-subtle border-r border-border transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            P
          </div>
          {!isCollapsed && (
            <span className="font-display font-semibold text-foreground">
              Praktikum
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground-muted hover:bg-background-muted hover:text-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-border p-2">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground-muted hover:bg-background-muted hover:text-foreground transition-colors"
        >
          <ChevronLeft
            className={cn('h-5 w-5 transition-transform', isCollapsed && 'rotate-180')}
          />
        </button>
      </div>
    </aside>
  );
}
