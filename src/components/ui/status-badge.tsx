import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const statusBadgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      status: {
        success: 'bg-success-bg text-success-text',
        warning: 'bg-warning-bg text-warning-text',
        error: 'bg-error-bg text-error-text',
        info: 'bg-info-bg text-info-text',
        neutral: 'bg-background-muted text-foreground-muted',
      },
    },
    defaultVariants: {
      status: 'neutral',
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  showDot?: boolean;
}

export function StatusBadge({
  className,
  status,
  showDot = true,
  children,
  ...props
}: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ status }), className)} {...props}>
      {showDot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            status === 'success' && 'bg-success-text',
            status === 'warning' && 'bg-warning-text',
            status === 'error' && 'bg-error-text',
            status === 'info' && 'bg-info-text',
            status === 'neutral' && 'bg-foreground-subtle'
          )}
        />
      )}
      {children}
    </span>
  );
}
