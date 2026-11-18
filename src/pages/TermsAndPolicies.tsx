import { Link } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { ArrowLeft, Home, ShieldCheck, FileText, Lock, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function TermsAndPoliciesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-12 md:py-16">
        {/* Navigation Bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm" className="rounded-full text-xs font-bold gap-1.5">
              <Link to="/">
                <ArrowLeft className="h-3.5 w-3.5" />
                Return to Landing
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="rounded-full text-xs font-bold gap-1.5">
              <Link to="/home">
                <Home className="h-3.5 w-3.5" />
                Go to Home
              </Link>
            </Button>
          </div>
          <span className="text-xs text-muted-foreground font-semibold">
            Last updated: November 2026
          </span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <ShieldCheck className="h-4 w-4" />
            Legal & Transparency
          </div>
          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
            Terms of Service & Privacy Policy
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Clear, honest terms written for writers and readers. No dark patterns, no selling your personal data.
          </p>
        </div>

        {/* Quick jump navigation */}
        <div className="mb-12 flex flex-wrap gap-2">
          <a
            href="#terms"
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold shadow-sm transition-colors hover:border-primary hover:text-primary"
          >
            <FileText className="h-4 w-4 text-primary" />
            Jump to Terms of Service
          </a>
          <a
            href="#privacy"
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold shadow-sm transition-colors hover:border-primary hover:text-primary"
          >
            <Lock className="h-4 w-4 text-primary" />
            Jump to Privacy Policy
          </a>
        </div>

        {/* Terms of Service Section */}
        <section id="terms" className="scroll-mt-24 space-y-8 border-b-2 border-border pb-16">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black">
              1
            </div>
            <h2 className="text-3xl font-black tracking-tight">Terms of Service</h2>
          </div>

          <div className="space-y-6 text-base leading-relaxed text-muted-foreground">
            <div>
              <h3 className="text-xl font-bold text-foreground">1. Acceptance of Terms</h3>
              <p className="mt-2">
                By creating an account, publishing content, or interacting with menya, you agree to these Terms of Service. If you do not agree with any part of these terms, you should not access or use our platform.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground">2. Ownership & Intellectual Property</h3>
              <p className="mt-2">
                <strong>You own all content you write and publish on menya.</strong> We claim no copyright or exclusive ownership over your essays, articles, or ideas. By publishing on menya, you grant us a non-exclusive, worldwide license to host, display, and distribute your content across our platform to readers.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground">3. User Conduct & Content Standards</h3>
              <p className="mt-2">
                menya is built for thoughtful discussion and craftsmanship. You agree not to publish:
              </p>
              <ul className="mt-3 list-inside list-disc space-y-1.5 pl-2">
                <li>Defamatory, fraudulent, harassing, or hate speech.</li>
                <li>Malicious code, spyware, or phishing attempts.</li>
                <li>Copyrighted material that you do not have legal authorization to use.</li>
                <li>Automated mass spam or commercial scam offerings.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground">4. Account Security & Responsibilities</h3>
              <p className="mt-2">
                You are responsible for keeping your login credentials confidential. Notify us immediately if you suspect any unauthorized access to your account.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground">5. Termination & Content Removal</h3>
              <p className="mt-2">
                You may delete your account or any of your blog posts at any time. We reserve the right to suspend or terminate accounts that violate these terms or compromise platform safety.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy Policy Section */}
        <section id="privacy" className="scroll-mt-24 space-y-8 pt-16">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black">
              2
            </div>
            <h2 className="text-3xl font-black tracking-tight">Privacy Policy</h2>
          </div>

          <div className="space-y-6 text-base leading-relaxed text-muted-foreground">
            <div>
              <h3 className="text-xl font-bold text-foreground">1. Information We Collect</h3>
              <p className="mt-2">
                We only collect data necessary to provide a high-quality publishing and reading experience:
              </p>
              <ul className="mt-3 list-inside list-disc space-y-1.5 pl-2">
                <li><strong>Account details:</strong> Name, email address, and encrypted credentials when you register.</li>
                <li><strong>Content & Drafts:</strong> Articles, draft text, tags, and images you upload to the editor.</li>
                <li><strong>Usage metrics:</strong> Aggregate page views and basic interaction counts (no invasive third-party ad trackers).</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground">2. How We Use Your Information</h3>
              <p className="mt-2">
                Your data is strictly used to authenticate your access, deliver your published stories to your readers, and allow you to manage your author profile. <strong>We do not sell your personal information or content to advertisers or data brokers.</strong>
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground">3. Security & Data Protection</h3>
              <p className="mt-2">
                We employ standard encryption protocols (HTTPS/TLS) and secure credential hashing to safeguard your account against unauthorized disclosure or tampering.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground">4. Your Rights</h3>
              <p className="mt-2">
                You have the full right to access your personal information, modify your profile details, export your content, or request complete account deletion at any time by contacting our support.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground">5. Contact</h3>
              <p className="mt-2">
                If you have any questions regarding these terms or your privacy, reach out to us at <code className="rounded bg-muted px-2 py-0.5 font-semibold text-foreground">support@menya.com</code>.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom Navigation Box */}
        <div className="mt-16 rounded-2xl border-2 border-border bg-card p-8 shadow-modern">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-black">Ready to begin writing?</h3>
              <p className="text-sm text-muted-foreground">Create your author profile or return to browsing top stories.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" className="rounded-xl font-bold">
                <Link to="/">Browse Stories</Link>
              </Button>
              <Button asChild className="rounded-xl bg-primary font-bold text-primary-foreground shadow-modern">
                <Link to="/register">Create Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
