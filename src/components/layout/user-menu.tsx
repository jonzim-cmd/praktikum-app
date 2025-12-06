'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserMenuProps {
  user: {
    firstName: string;
    lastName: string;
    role: string;
  };
  onLogout: () => void;
}

const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  school_admin: 'Schul-Admin',
  teacher: 'Lehrkraft',
  student: 'Schüler',
  company_user: 'Betrieb',
};

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-background-muted"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
          {initials}
        </div>
        <div className="hidden sm:block text-left">
          <p className="font-medium text-foreground">{user.firstName} {user.lastName}</p>
          <p className="text-xs text-foreground-muted">{roleLabels[user.role] || user.role}</p>
        </div>
        <ChevronDown className={cn('h-4 w-4 text-foreground-muted transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-border bg-background-subtle shadow-lg animate-[scaleIn_0.2s_ease-out]">
          <div className="p-2">
            <div className="px-3 py-2 border-b border-border mb-2">
              <p className="font-medium text-foreground">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-foreground-muted">{roleLabels[user.role] || user.role}</p>
            </div>
            <Link
              href="/einstellungen"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground-muted hover:bg-background-muted hover:text-foreground transition-colors"
            >
              <Settings className="h-4 w-4" />
              Einstellungen
            </Link>
            <button
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground-muted hover:bg-background-muted hover:text-foreground transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Abmelden
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
