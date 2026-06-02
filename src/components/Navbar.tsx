import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { isAuthenticated, user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: "Blogs", exact: false },
    { to: "/about", label: "About" },
  ];

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(q)}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b-2 border-border bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Link to="/home" className="flex items-center gap-2">
          <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
            <path d="M2 2l7.586 7.586"></path>
            <circle cx="11" cy="11" r="2"></circle>
          </svg>
          <span className="text-2xl font-black tracking-tight">
            menya<span className="text-primary">.</span>
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = l.exact ? pathname === l.to : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={
                  "px-3 py-2 text-sm font-semibold transition-colors " +
                  (active ? "text-primary" : "text-foreground hover:text-primary")
                }
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <form onSubmit={submitSearch} className="ml-auto hidden flex-1 max-w-sm md:flex">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search blogs..."
              className="h-10 w-full border-2 border-border bg-background pl-9 pr-3 text-sm font-medium outline-none focus:border-primary"
            />
          </div>
        </form>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-2 border-border font-semibold">
                  {user?.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="border-2 border-border">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/my-blogs">My Blogs</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/profile">Profile</Link>
                </DropdownMenuItem>
                {hasRole("ADMIN") && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin">Admin</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { logout(); navigate("/"); }}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost" className="font-semibold">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild className="border-2 border-border bg-primary font-semibold text-primary-foreground hover:bg-primary/90">
                <Link to="/register">Sign up</Link>
              </Button>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen((s) => !s)}
          className="ml-auto md:hidden"
          aria-label="Menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t-2 border-border bg-background px-4 py-3 md:hidden">
          <form onSubmit={submitSearch} className="mb-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search blogs..."
              className="h-10 w-full border-2 border-border px-3 text-sm"
            />
          </form>
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="py-2 font-semibold">
                {l.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link to="/dashboard/my-blogs" onClick={() => setOpen(false)} className="py-2 font-semibold">My Blogs</Link>
                <Link to="/dashboard/profile" onClick={() => setOpen(false)} className="py-2 font-semibold">Profile</Link>
                {hasRole("ADMIN") && (
                  <Link to="/admin" onClick={() => setOpen(false)} className="py-2 font-semibold">Admin</Link>
                )}
                <button
                  className="py-2 text-left font-semibold"
                  onClick={() => { logout(); setOpen(false); navigate("/"); }}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="py-2 font-semibold">Log in</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="py-2 font-semibold text-primary">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
