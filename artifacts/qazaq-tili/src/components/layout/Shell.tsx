import { Link, useLocation } from "wouter"
import { useTheme } from "@/components/theme-provider"
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Trophy,
  Medal,
  User,
  Settings,
  Menu,
  Moon,
  Sun,
  X,
  BookText
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useGetDashboardSummary } from "@workspace/api-client-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Shell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation()
  const { theme, setTheme } = useTheme()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { data: userSummary } = useGetDashboardSummary()

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: GraduationCap, label: "Courses", href: "/courses" },
    { icon: BookOpen, label: "Vocabulary", href: "/vocabulary" },
    { icon: BookText, label: "Grammar", href: "/grammar" },
    { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
    { icon: Medal, label: "Achievements", href: "/achievements" },
    { icon: User, label: "Profile", href: "/profile" },
  ]

  return (
    <div className="flex min-h-[100dvh] w-full flex-col lg:flex-row bg-background">
      {/* Mobile Navbar */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="font-display font-bold">Қ</span>
          </div>
          <span className="font-display font-bold text-lg">Қазақ Тілі</span>
        </Link>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="rounded-md p-2 hover:bg-muted"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card transition-transform duration-300 lg:static lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 lg:justify-start lg:gap-3">
          <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileOpen(false)}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_0_15px_rgba(0,176,199,0.4)]">
              <span className="font-display font-bold">Қ</span>
            </div>
            <span className="font-display font-bold text-xl tracking-tight">Қазақ Тілі</span>
          </Link>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden rounded-md p-2 hover:bg-muted"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 py-4">
          <div className="flex items-center gap-3 rounded-xl border bg-background/50 p-3 shadow-sm">
            <Avatar>
              <AvatarFallback className="bg-primary/20 text-primary font-bold">A</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Alikhan</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500"></span> Level {userSummary?.level || 1}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-2">
          {navItems.map((item) => {
            const isActive = location.startsWith(item.href) && item.href !== "/" || (item.href === "/" && location === "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon size={18} className={cn(isActive && "text-primary")} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full flex flex-col min-h-0 overflow-hidden">
        {children}
      </main>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </div>
  )
}
