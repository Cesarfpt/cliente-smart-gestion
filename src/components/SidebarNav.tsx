
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Interfaz para los elementos de la barra lateral
interface SidebarNavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

// Props para el componente de barra lateral
interface SidebarNavProps {
  items: SidebarNavItem[];
  className?: string;
}

// Componente de barra lateral
export function SidebarNav({ items, className }: SidebarNavProps) {
  const location = useLocation();

  return (
    <nav className={cn("flex flex-col gap-2", className)}>
      {items.map((item) => (
        <Link key={item.href} to={item.href}>
          <Button
            variant={
              location.pathname === item.href ? "default" : "ghost"
            }
            className={cn(
              "w-full justify-start",
              location.pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "hover:bg-transparent hover:text-primary",
              item.disabled && "opacity-60 pointer-events-none"
            )}
            disabled={item.disabled}
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            {item.title}
          </Button>
        </Link>
      ))}
    </nav>
  );
}
