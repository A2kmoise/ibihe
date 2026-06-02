import { Link, useLocation } from "react-router-dom";

const items = [
  { to: "/admin", label: "Overview", exact: true },
  { to: "/admin/authors", label: "Authors" },
  { to: "/admin/blogs", label: "Blogs" },
];

export function AdminNav() {
  const location = useLocation();
  const pathname = location.pathname;
  return (
    <nav className="mb-8 flex gap-2 border-b-2 border-border">
      {items.map((i) => {
        const active = i.exact ? pathname === i.to : pathname.startsWith(i.to);
        return (
          <Link
            key={i.to}
            to={i.to}
            className={
              "border-b-4 px-4 py-3 text-sm font-bold uppercase tracking-wider transition-colors " +
              (active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")
            }
          >
            {i.label}
          </Link>
        );
      })}
    </nav>
  );
}
