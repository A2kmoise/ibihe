export default function DashboardLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="relative flex flex-col items-center gap-8">
        {/* Animated rings container */}
        <div className="relative h-32 w-32">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary border-r-primary/50" style={{ animationDuration: '1.5s' }}></div>

          {/* Middle counter-rotating ring */}
          <div className="absolute inset-2 animate-spin rounded-full border-4 border-transparent border-b-emerald-500 border-l-emerald-500/50" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>

          {/* Inner pulsing ring */}
          <div className="absolute inset-4 animate-pulse rounded-full border-4 border-primary/20"></div>

          {/* Center logo with scale animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse">
              <svg
                className="h-12 w-12 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                <path d="M2 2l7.586 7.586"></path>
                <circle cx="11" cy="11" r="2"></circle>
              </svg>
            </div>
          </div>

          {/* Orbiting dots */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
            <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-primary"></div>
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s', animationDelay: '1s' }}>
            <div className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-emerald-500"></div>
          </div>
        </div>

      </div>
    </div>
  )
}
