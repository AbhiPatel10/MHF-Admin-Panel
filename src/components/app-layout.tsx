'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  HandHeart,
  LayoutDashboard,
  LogOut,
  Mail,
  Users,
  Calendar,
  Newspaper,
  ChevronUp,
  FolderKanban,
  Images,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/blog', icon: Newspaper, label: 'Blog' },
  { href: '/volunteers', icon: Users, label: 'Volunteers' },
  { href: '/team-members', icon: Users, label: 'Team Members' },
  { href: '/events', icon: Calendar, label: 'Events' },
  { href: '/gallery', icon: Images, label: 'Gallery' },
  { href: '/categories', icon: FolderKanban, label: 'Categories' },
  { href: '/contacts', icon: Mail, label: 'Contacts' },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/');
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Button
            variant="ghost"
            className="h-12 w-full justify-start gap-3 px-2"
            asChild
          >
            <Link href="/dashboard">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                <HandHeart className="size-6" />
              </div>
              <div>
                <span className="block text-base font-semibold text-foreground">
                  MHF Admin Panel
                </span>
              </div>
            </Link>
          </Button>
        </SidebarHeader>

        <SidebarContent className="p-2">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    variant="default"
                    size="lg"
                    isActive={pathname.startsWith(item.href)}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <SidebarSeparator className="my-2" />
          <SidebarMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-16 w-full justify-start gap-3 px-3"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src="https://picsum.photos/seed/admin/40/40"
                      alt="Admin"
                    />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <span className="text-left">
                    <div className="font-medium text-foreground">Admin</div>
                    <div className="text-sm text-foreground/70">
                      Global Administrator
                    </div>
                  </span>
                  <ChevronUp className="ml-auto h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="w-64"
              >
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleLogout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <main className="flex-1">{children}</main>
    </SidebarProvider>
  );
}
