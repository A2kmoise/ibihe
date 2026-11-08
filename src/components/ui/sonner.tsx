import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      richColors={false}
      toastOptions={{
        classNames: {
          toast:
            "group toast flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 shadow-lg font-medium text-sm transition-all duration-300",
          description: "text-xs opacity-90",
          actionButton: "rounded-lg px-3 py-1.5 text-xs font-bold shadow-sm transition-colors",
          cancelButton: "rounded-lg px-3 py-1.5 text-xs font-medium bg-muted text-muted-foreground",
          success:
            "group-[.toaster]:bg-emerald-50 dark:group-[.toaster]:bg-emerald-950/80 group-[.toaster]:text-emerald-950 dark:group-[.toaster]:text-emerald-100 group-[.toaster]:border-emerald-500/40 dark:group-[.toaster]:border-emerald-500/50 shadow-emerald-500/10 [&_[data-icon]]:text-emerald-600 dark:[&_[data-icon]]:text-emerald-400",
          error:
            "group-[.toaster]:bg-rose-50 dark:group-[.toaster]:bg-rose-950/80 group-[.toaster]:text-rose-950 dark:group-[.toaster]:text-rose-100 group-[.toaster]:border-rose-500/40 dark:group-[.toaster]:border-rose-500/50 shadow-rose-500/10 [&_[data-icon]]:text-rose-600 dark:[&_[data-icon]]:text-rose-400",
          warning:
            "group-[.toaster]:bg-amber-50 dark:group-[.toaster]:bg-amber-950/80 group-[.toaster]:text-amber-950 dark:group-[.toaster]:text-amber-100 group-[.toaster]:border-amber-500/40 dark:group-[.toaster]:border-amber-500/50 shadow-amber-500/10 [&_[data-icon]]:text-amber-600 dark:[&_[data-icon]]:text-amber-400",
          info:
            "group-[.toaster]:bg-sky-50 dark:group-[.toaster]:bg-sky-950/80 group-[.toaster]:text-sky-950 dark:group-[.toaster]:text-sky-100 group-[.toaster]:border-sky-500/40 dark:group-[.toaster]:border-sky-500/50 shadow-sky-500/10 [&_[data-icon]]:text-sky-600 dark:[&_[data-icon]]:text-sky-400",
          default:
            "group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
