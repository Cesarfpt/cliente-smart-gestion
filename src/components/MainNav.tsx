
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

// Interfaz para los elementos de navegación
interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
}

// Props para el componente de navegación
interface MainNavProps {
  items?: NavItem[];
}

// Componente principal de navegación
export function MainNav({ items }: MainNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex gap-6 md:gap-10">
      <Link to="/" className="flex items-center space-x-2">
        <span className="hidden sm:inline-block font-bold text-xl">
          WhatsGest
        </span>
      </Link>
      
      {/* Navegación para pantallas grandes */}
      <nav className="hidden md:flex gap-6">
        {items?.map(
          (item, index) =>
            item.href && (
              <Link
                key={index}
                to={item.href}
                className={cn(
                  "flex items-center text-lg font-medium transition-colors hover:text-primary",
                  item.disabled && "cursor-not-allowed opacity-80"
                )}
              >
                {item.title}
              </Link>
            )
        )}
      </nav>
      
      {/* Menú móvil */}
      <Button
        className="md:hidden"
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Abrir menú</span>
      </Button>
      
      {/* Menú desplegable para móviles */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background border-b z-50 md:hidden">
          <nav className="flex flex-col p-4 gap-4">
            {items?.map(
              (item, index) =>
                item.href && (
                  <Link
                    key={index}
                    to={item.href}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-primary",
                      item.disabled && "cursor-not-allowed opacity-80"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.title}
                  </Link>
                )
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
