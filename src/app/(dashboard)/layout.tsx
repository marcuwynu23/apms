"use client";

import SearchDialog from '@/components/SearchDialog';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import {
  ChevronRight,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  Users,
  Wrench
} from 'lucide-react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [signOutConfirmOpen, setSignOutConfirmOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/assets', label: 'Assets', icon: Package },
    { href: '/assignments', label: 'Assignments', icon: Users },
    { href: '/maintenance', label: 'Maintenance', icon: Wrench },
    { href: '/reports', label: 'Reports', icon: FileText },
  ];

  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    return paths.map((path, index) => ({
      label: path.charAt(0).toUpperCase() + path.slice(1),
      href: '/' + paths.slice(0, index + 1).join('/'),
    }));
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <>
      <div className="flex min-h-screen bg-background">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-56' : 'w-0'} bg-sidebar border-r border-border transition-all duration-200 flex-shrink-0 hidden md:block`}>
          <div className="h-full flex flex-col">
            {/* Logo */}
            <div className="h-14 px-4 flex items-center border-b border-border">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-zinc-900 flex items-center justify-center">
                  <Package size={16} className="text-white" />
                </div>
                <span className="font-semibold text-foreground tracking-tight">APMS</span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${
                      isActive
                        ? 'bg-zinc-100 text-zinc-900 font-medium'
                        : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                    }`}
                  >
                    <item.icon size={16} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Section */}
            <div className="p-3 border-t border-border">
              <div className="flex items-center gap-2 px-3 py-2">
                <div className="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center text-xs font-semibold text-white">
                  {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{session?.user?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
                </div>
                <button 
                  onClick={() => setSignOutConfirmOpen(true)}
                  className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-14 border-b border-border bg-white flex items-center justify-between px-4 sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-secondary rounded md:hidden"
              >
                <Menu size={18} />
              </button>

              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-sm">
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
                  APMS
                </Link>
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.href} className="flex items-center gap-2">
                    <ChevronRight size={14} className="text-muted-foreground" />
                    <Link
                      href={crumb.href}
                      className={index === breadcrumbs.length - 1 ? 'font-medium text-foreground' : 'text-muted-foreground hover:text-foreground'}
                    >
                      {crumb.label}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 border border-border rounded hover:bg-secondary transition-colors text-sm text-muted-foreground"
            >
              <Search size={16} />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-secondary rounded text-xs border">
                ⌘K
              </kbd>
            </button>
          </header>

          {/* Page Content */}
          <div className="flex-1 p-6 overflow-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Search Dialog */}
      <SearchDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Sign Out Confirmation */}
      <ConfirmationDialog
        isOpen={signOutConfirmOpen}
        onClose={() => setSignOutConfirmOpen(false)}
        onConfirm={async () => {
          await signOut({ callbackUrl: '/' });
        }}
        title="Sign Out"
        description="Are you sure you want to sign out of your account?"
        confirmText="Sign Out"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Global Keyboard Shortcut */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('keydown', (e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent('open-search'));
              }
            });
            window.addEventListener('open-search', () => {
              const event = new MouseEvent('click', { bubbles: true });
              document.querySelector('[data-search-trigger]')?.dispatchEvent(event);
            });
          `,
        }}
      />
    </>
  );
}
