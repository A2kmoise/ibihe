import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from './components/ui/sonner'
import { Footer } from './components/Footer'
import { useAuth } from './lib/auth-context'

// Pages
import HomePage from './pages/Home'
import MainPage from './pages/Landing'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import AboutPage from './pages/About'
import BlogDetailPage from './pages/BlogDetail'
import CategoryPage from './pages/Category'
import TagPage from './pages/Tag'
import ForgotPasswordPage from './pages/ForgotPassword'

// Dashboard
import DashboardLayout from './pages/dashboard/Layout'
import DashboardHome from './pages/dashboard/Home'
import MyBlogs from './pages/dashboard/MyBlogs'
import NewBlog from './pages/dashboard/NewBlog'
import EditBlog from './pages/dashboard/EditBlog'
import Profile from './pages/dashboard/Profile'

// Admin
import AdminLayout from './pages/admin/Layout'
import AdminDashboard from './pages/admin/Dashboard'
import AdminAuthors from './pages/admin/Authors'
import AdminBlogs from './pages/admin/Blogs'

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

// Admin Route wrapper
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { hasRole, loading } = useAuth()

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!hasRole('ADMIN')) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export default function App() {
  const location = useLocation()
  const hideFooter = ['/login', '/register'].includes(location.pathname) ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/dashboard')

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<MainPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blogs/:slug" element={<BlogDetailPage />} />
          <Route path="/categories/:slug" element={<CategoryPage />} />
          <Route path="/tags/:tag" element={<TagPage />} />

          {/* Author Dashboard routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<DashboardHome />} />
            <Route path="my-blogs" element={<MyBlogs />} />
            <Route path="blogs/new" element={<NewBlog />} />
            <Route path="blogs/:id/edit" element={<EditBlog />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<ProtectedRoute><AdminRoute><AdminLayout /></AdminRoute></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="authors" element={<AdminAuthors />} />
            <Route path="blogs" element={<AdminBlogs />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
      <Toaster />
    </div>
  )
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-black text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-bold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-flex items-center justify-center border-2 border-border bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  )
}
