import React from 'react';
import {Slot} from '@radix-ui/react-slot';
import {cva, type VariantProps} from 'class-variance-authority';

import {cn} from '../../utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-muted hover:text-accent-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        sidebar: 'hover:bg-accent hover:text-accent-foreground',
        secondarySidebar: 'bg-accent hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-8 px-4 py-1 rounded-lg',
        sm: 'h-8 rounded-md px-2',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-10 w-10',
        smIcon: 'h-6 w-6',
        sidebar: 'h-8 px-4 pl-2 rounded-lg gap-x-2 justify-start',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean; // Added loading prop
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({className, variant, size, asChild = false, loading = false, ...props}, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({variant, size, className}), loading ? 'relative' : '')}
        ref={ref}
        {...props}
        disabled={props.disabled || loading} // Disable button when loading
      >
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="spinner" />{' '}
          </div>
        )}
        {props.children}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export {Button, buttonVariants};
