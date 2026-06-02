export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-5xl font-black tracking-tight md:text-6xl">About menya</h1>
      <p className="mt-6 text-lg text-muted-foreground">
        menya is a minimal blog platform for writers who care about craft. No
        algorithm games, no engagement traps — just a clean editor, sharp
        typography, and readers who show up because the writing is good.
      </p>
      <h2 className="mt-12 text-2xl font-black">What we believe</h2>
      <ul className="mt-4 space-y-3 text-muted-foreground">
        <li>— Plain language is a competitive advantage.</li>
        <li>— Slow software respects the reader.</li>
        <li>— Small, sharp publications beat large, soft ones.</li>
        <li>— The best feature is fewer features.</li>
      </ul>
      <h2 className="mt-12 text-2xl font-black">Who it's for</h2>
      <p className="mt-3 text-muted-foreground">
        Essayists, indie thinkers, builders writing in public, and anyone who
        wants a quiet place to publish without selling their attention.
      </p>
    </div>
  )
}
