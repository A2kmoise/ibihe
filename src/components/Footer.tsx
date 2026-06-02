import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-24 border-t-2 border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <svg className="h-7 w-7 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
              <path d="M2 2l7.586 7.586"></path>
              <circle cx="11" cy="11" r="2"></circle>
            </svg>
            <span className="text-2xl font-black tracking-tight">
              menya<span className="text-primary">.</span>
            </span>
          </div>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            A bold, minimal home for serious writing. Publish essays, share ideas,
            build a quiet audience.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wider">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-primary">Browse Blogs</Link></li>
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/register" className="hover:text-primary">Start writing</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wider">Connect</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/home" className="hover:text-primary">menya</Link></li>
            <li><a href="#" className="hover:text-primary">Twitter</a></li>
            <li><a href="#" className="hover:text-primary">GitHub</a></li>
            <li><a href="#" className="hover:text-primary">RSS</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t-2 border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} menya. All rights reserved.</span>
          <span>Made for writers.</span>
        </div>
      </div>
    </footer>
  );
}
