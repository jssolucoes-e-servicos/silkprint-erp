'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  Kanban, 
  Package, 
  ShoppingCart, 
  Wallet, 
  CreditCard,
  Users, 
  UserCircle, 
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  Boxes,
  BarChart3
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

const sidebarItems = [
  { name: 'Painel Geral', icon: LayoutDashboard, href: '/' },
  { name: 'Orçamentos', icon: FileText, href: '/orcamentos' },
  { name: 'Produção', icon: Kanban, href: '/producao' },
  { name: 'Produtos', icon: Boxes, href: '/produtos' },
  { name: 'Estoque', icon: Package, href: '/estoque' },
  { name: 'Compras', icon: ShoppingCart, href: '/compras' },
  { name: 'Financeiro', icon: Wallet, href: '/financeiro' },
  { name: 'Contas a Pagar', icon: CreditCard, href: '/financeiro/pagar' },
  { name: 'Contas a Receber', icon: Wallet, href: '/financeiro/receber' },
  { name: 'Leads', icon: Users, href: '/leads' },
  { name: 'Clientes', icon: UserCircle, href: '/clientes' },
  { name: 'Colaboradores', icon: Users, href: '/colaboradores' },
  { name: 'Relatórios', icon: BarChart3, href: '/relatorios' },
  { name: 'Minha Conta', icon: Settings, href: '/conta' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-muted/40 md:block w-64 shrink-0">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px]">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="bg-primary text-primary-foreground p-1 rounded">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <span className="text-xl tracking-tight">GraphERP</span>
          </Link>
        </div>
        <ScrollArea className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 py-4">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                  pathname === item.href 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="mt-auto p-4">
          <Separator className="mb-4" />
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  )
}

export function MobileSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="outline" size="icon" className="md:hidden" />}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4">
            <Link href="/" className="flex items-center gap-2 font-semibold" onClick={() => setOpen(false)}>
              <LayoutDashboard className="h-6 w-6" />
              <span>GraphERP</span>
            </Link>
          </div>
          <ScrollArea className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium py-4">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    pathname === item.href 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}
