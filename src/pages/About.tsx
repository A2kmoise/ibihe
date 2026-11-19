import { Link } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Home, Compass, Feather, Users, ArrowRight } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-12 md:py-16">
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            Our Mission
          </div>
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            A quiet home for serious writing.
          </h1>
          <p className="mt-4 text-xl leading-relaxed text-muted-foreground">
            menya is a minimal publication platform built for writers who care about craft. No algorithmic tricks, no clickbait engagement traps — just a sharp editor, beautiful typography, and readers who show up for good words.
          </p>
        </div>

        {/* What We Believe */}
        <section className="mt-16">
          <h2 className="flex items-center gap-2 text-2xl font-black">
            <Feather className="h-6 w-6 text-primary" />
            What we believe
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border-2 border-border bg-card p-6 shadow-modern">
              <h3 className="font-black text-lg">Plain language is an advantage</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Complexity is often hiding a lack of clarity. We celebrate direct, truthful writing that gets straight to the heart of the matter.
              </p>
            </div>

            <div className="rounded-2xl border-2 border-border bg-card p-6 shadow-modern">
              <h3 className="font-black text-lg">Slow software respects the reader</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We reject infinite addictive doomscrolling. We design calm spaces where reading an essay feels as deliberate as opening a good book.
              </p>
            </div>

            <div className="rounded-2xl border-2 border-border bg-card p-6 shadow-modern">
              <h3 className="font-black text-lg">Small & sharp beats big & soft</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                A tight community of dedicated thinkers and creators creates far more lasting value than a noisy social media feed.
              </p>
            </div>

            <div className="rounded-2xl border-2 border-border bg-card p-6 shadow-modern">
              <h3 className="font-black text-lg">The best feature is fewer features</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Everything you need to write and publish, nothing you don't. No popups, spam walls, or notification badges begging for your attention.
              </p>
            </div>
          </div>
        </section>

        {/* Who It's For */}
        <section className="mt-16 rounded-2xl border-2 border-border bg-gradient-to-br from-primary/10 via-background to-card p-8 md:p-10 shadow-modern">
          <h2 className="flex items-center gap-2 text-2xl font-black">
            <Users className="h-6 w-6 text-primary" />
            Who it's for
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Essayists, independent researchers, builders writing in public, journalists, and anyone looking for a clean, dignified space to publish ideas without selling out their attention.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold">
            <span className="rounded-full border border-border bg-background px-3 py-1">Tech Builders</span>
            <span className="rounded-full border border-border bg-background px-3 py-1">Cultural Critics</span>
            <span className="rounded-full border border-border bg-background px-3 py-1">Indie Hackers</span>
            <span className="rounded-full border border-border bg-background px-3 py-1">Storytellers</span>
            <span className="rounded-full border border-border bg-background px-3 py-1">Deep Thinkers</span>
          </div>
        </section>

        {/* Action Navigation Cards (Bottom of Page) */}
        <section className="mt-16 border-t-2 border-border pt-12">
          <h2 className="text-xl font-black">Where would you like to go next?</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {/* Return to Landing */}
            <Link
              to="/"
              className="group flex flex-col justify-between rounded-2xl border-2 border-border bg-card p-6 shadow-modern transition-all hover:scale-[1.02] hover:border-primary hover:shadow-modern-lg"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Compass className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-black group-hover:text-primary transition-colors">
                  Return to Landing
                </h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  Browse featured blogs, trending stories, and discovery carousel on the main platform.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-primary">
                Go to Landing <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Go to Home */}
            <Link
              to="/home"
              className="group flex flex-col justify-between rounded-2xl border-2 border-border bg-card p-6 shadow-modern transition-all hover:scale-[1.02] hover:border-primary hover:shadow-modern-lg"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Home className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-black group-hover:text-primary transition-colors">
                  Go to Home
                </h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  Visit the menya introduction overview, core benefits, and platform showcase.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-primary">
                Visit Home <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Start Writing */}
            <Link
              to="/register"
              className="group flex flex-col justify-between rounded-2xl border-2 border-border bg-card p-6 shadow-modern transition-all hover:scale-[1.02] hover:border-primary hover:shadow-modern-lg"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Feather className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-black group-hover:text-primary transition-colors">
                  Start Writing
                </h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  Join our writers, create your account, and publish your first article today.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-primary">
                Get Started <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
