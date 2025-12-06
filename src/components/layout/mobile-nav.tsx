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
  Menu,
  X,
  GraduationCap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MobileNavProps {
  role: 'student' | 'teacher' | 'company' | 'admin';
}

const navItemsByRole: Record<MobileNavProps['role'], NavItem[]> = {
  student: [
    { href: '/schueler', label: 'Home', icon: Home },
    { href: '/schueler/praktikum', label: 'Praktikum', icon: FileText },
    { href: '/schueler/berichte', label: 'Berichte', icon: FileText },
    { href: '/schueler/einstellungen', label: 'Mehr', icon: Settings },
  ],
  teacher: [
    { href: '/lehrer', label: 'Home', icon: Home },
    { href: '/lehrer/schueler', label: 'Schüler', icon: Users },
    { href: '/lehrer/betriebe', label: 'Betriebe', icon: Building2 },
    { href: '/lehrer/besuche', label: 'Besuche', icon: Calendar },
  ],
  company: [
    { href: '/betrieb', label: 'Home', icon: Home },
    { href: '/betrieb/praktikanten', label: 'Praktikanten', icon: Users },
    { href: '/betrieb/einstellungen', label: 'Mehr', icon: Settings },
  ],
  admin: [
    { href: '/admin', label: 'Home', icon: Home },
    { href: '/admin/schulen', label: 'Schulen', icon: GraduationCap },
    { href: '/admin/benutzer', label: 'Benutzer', icon: Users },
    { href: '/admin/betriebe', label: 'Betriebe', icon: Building2 },
  ],
};

export function MobileNav({ role }: MobileNavProps) {
  const pathname = usePathname();
  const navItems = navItemsByRole[role];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background-subtle md:hidden">
      <ul className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-foreground-muted hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

interface MobileHeaderProps {
  title?: string;
  showMenu?: boolean;
  onMenuClick?: () => void;
}

export function MobileHeader({ title = 'Praktikum', showMenu, onMenuClick }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-border bg-background-subtle px-4 md:hidden">
      {showMenu && (
        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground-muted hover:bg-background-muted hover:text-foreground transition-colors"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menü öffnen</span>
        </button>
      )}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
          P
        </div>
        <span className="font-display font-semibold text-foreground">{title}</span>
      </div>
    </header>
  );
}
