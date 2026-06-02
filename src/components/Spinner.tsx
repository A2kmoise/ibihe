export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div
      className={
        "inline-block h-5 w-5 animate-spin rounded-full border-2 border-border border-t-primary " +
        className
      }
      aria-label="Loading"
    />
  );
}

export function FullPageSpinner() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  );
}
