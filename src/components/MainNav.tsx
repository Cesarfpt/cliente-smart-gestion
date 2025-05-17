
import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
}

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
  items?: NavItem[];
}

export function MainNav({ className, items, ...props }: MainNavProps) {
  const { user } = useAuth();

  // If items are provided, use them; otherwise use default navigation
  const navItems = items || [
    { title: "Inicio", href: "/" },
    ...(user ? [
      { title: "Dashboard", href: "/dashboard" },
      { title: "Chat", href: "/chatbot" },
      { title: "Estadísticas", href: "/chatstats" },
      { title: "Configuración Bot", href: "/botconfig" }
    ] : [])
  ];

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
