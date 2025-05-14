
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

// Interfaz para los elementos de navegación
interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
}

// Props para el componente de navegación móvil
interface MobileNavProps {
  items?: NavItem[];
}

// Componente de navegación móvil
export function MobileNav({ items }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="sm" className="px-0 text-base" onClick={() => setOpen(!open)}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      
      {open && (
        <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden">
          <div className="relative z-20 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
            <nav className="grid grid-flow-row auto-rows-max text-sm">
              {items?.map(
                (item, index) =>
                  !item.disabled && (
                    <Link
                      key={index}
                      to={item.href}
                      className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
                      onClick={() => setOpen(false)}
                    >
                      {item.title}
                    </Link>
                  )
              )}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
