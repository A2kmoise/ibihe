import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen, Users, Shield, Zap } from 'lucide-react'
import { Navbar } from '@/components/Navbar'

export default function HomePage() {
  return (
    <div>
      {/* Use main Navbar component with login/signup buttons */}
      <Navbar />

      {/* Hero Section */}
      <section className="border-b-2 border-border bg-gradient-to-b from-background to-accent">
        <div className="mx-auto max-w-7xl px-4 py-20 md:py-32 mt-8">
          <div className="text-center">
            <div className="mb-6 inline-block border-2 border-border bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary-foreground">
              Welcome to menya
            </div>
            <h1 className="text-5xl font-black leading-tight tracking-tight md:text-7xl lg:text-8xl">
              Write. Publish. <br />
              <span className="text-primary">Be Heard.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              A modern blogging platform for writers who care about craft. Share your stories,
              build your audience, and connect with readers who matter.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="h-12 border-2 border-border bg-primary px-8 text-base font-bold text-primary-foreground hover:bg-primary/90">
                <Link to="/register">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 border-2 border-border px-8 text-base font-bold">
                <Link to="/">Browse Blogs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What is menya */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-black md:text-4xl">What is menya?</h2>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
            menya is a clean, modern platform designed for serious writers. We believe in the power of
            words and provide the tools you need to share your ideas with the world. No distractions,
            no complexity—just pure writing and reading.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="border-y-2 border-border bg-muted">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <h2 className="mb-12 text-center text-3xl font-black md:text-4xl">Why Choose menya?</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="border-2 border-border bg-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center border-2 border-border bg-primary text-primary-foreground">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-black">Easy Writing</h3>
              <p className="text-sm text-muted-foreground">
                Clean, distraction-free editor with rich formatting options for your content.
              </p>
            </div>

            <div className="border-2 border-border bg-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center border-2 border-border bg-primary text-primary-foreground">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-black">Grow Audience</h3>
              <p className="text-sm text-muted-foreground">
                Connect with readers who appreciate quality content and thoughtful writing.
              </p>
            </div>

            <div className="border-2 border-border bg-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center border-2 border-border bg-primary text-primary-foreground">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-black">Full Control</h3>
              <p className="text-sm text-muted-foreground">
                Your content, your rules. Manage, edit, and publish on your own terms.
              </p>
            </div>

            <div className="border-2 border-border bg-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center border-2 border-border bg-primary text-primary-foreground">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-black">Fast & Simple</h3>
              <p className="text-sm text-muted-foreground">
                No clutter, no complexity. Just a fast platform that gets out of your way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="mb-12 text-center text-3xl font-black md:text-4xl">How It Works</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center border-2 border-border bg-primary text-2xl font-black text-primary-foreground">
              1
            </div>
            <h3 className="mb-2 text-xl font-black">Create Account</h3>
            <p className="text-sm text-muted-foreground">
              Sign up for free in seconds. No credit card required.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center border-2 border-border bg-primary text-2xl font-black text-primary-foreground">
              2
            </div>
            <h3 className="mb-2 text-xl font-black">Write Your Blog</h3>
            <p className="text-sm text-muted-foreground">
              Use our powerful editor to craft your perfect post.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center border-2 border-border bg-primary text-2xl font-black text-primary-foreground">
              3
            </div>
            <h3 className="mb-2 text-xl font-black">Publish & Share</h3>
            <p className="text-sm text-muted-foreground">
              Hit publish and share your work with the world instantly.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-y-2 border-border bg-muted">
        <div className="mx-auto max-w-4xl px-4 py-20">
          <h2 className="mb-12 text-center text-3xl font-black md:text-4xl">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="border-2 border-border bg-card p-6">
              <h3 className="mb-2 text-lg font-black">Is ibihe free to use?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! ibihe is completely free for writers. Create an account and start publishing immediately.
              </p>
            </div>

            <div className="border-2 border-border bg-card p-6">
              <h3 className="mb-2 text-lg font-black">Who can read my blogs?</h3>
              <p className="text-sm text-muted-foreground">
                Your published blogs are visible to everyone who visits ibihe. Build your audience organically.
              </p>
            </div>

            <div className="border-2 border-border bg-card p-6">
              <h3 className="mb-2 text-lg font-black">Can I customize my blog's appearance?</h3>
              <p className="text-sm text-muted-foreground">
                Your posts are styled with our clean, readable design that focuses on your content.
              </p>
            </div>

            <div className="border-2 border-border bg-card p-6">
              <h3 className="mb-2 text-lg font-black">How do I get started?</h3>
              <p className="text-sm text-muted-foreground">
                Simply create an account, complete your profile, and start writing. Your first post can be published in minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="border-2 border-border bg-primary p-12 text-center text-primary-foreground md:p-16">
          <h2 className="text-3xl font-black md:text-5xl">Ready to Start Writing?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg opacity-90">
            Join hundreds of writers sharing their stories on menya. Create your account today and publish your first post.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild variant="outline" size="lg" className="h-12 border-2 border-primary-foreground bg-background px-8 text-base font-bold text-foreground hover:bg-background/90">
              <Link to="/register">Create Account</Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="h-12 border-2 border-primary-foreground px-8 text-base font-bold text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
