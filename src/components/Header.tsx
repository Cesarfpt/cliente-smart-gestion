
import { UserButton } from "@/components/UserButton";
import { MainNav } from "@/components/MainNav";
import { MobileNav } from "@/components/MobileNav";
import { ThemeToggle } from "@/components/ThemeToggle";

// Definimos la estructura de los elementos de navegación
const navItems = [
  {
    title: "Inicio",
    href: "/",
  },
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Clientes",
    href: "/clientes",
  },
  {
    title: "Vendedores",
    href: "/vendedores",
  },
  {
    title: "Pedidos",
    href: "/pedidos",
  },
];

// Componente de encabezado
export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <MainNav items={navItems} />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserButton />
        </div>
      </div>
    </header>
  );
}
