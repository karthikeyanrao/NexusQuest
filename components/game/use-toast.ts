import { useCallback } from 'react';

// Example implementation of a toast system
interface ToastOptions {
  title: string;
  description?: string;
  variant?: 'info' | 'success' | 'error' | 'warning' | 'destructive';
}

export function useToast() {
  const toast = useCallback((options: ToastOptions) => {
    const { title, description, variant = 'info' } = options;

    // Use console for logging (replace this with an actual toast library)
    console.log(`[${variant.toUpperCase()}] ${title}`);
    if (description) {
      console.log(description);
    }

    // If you're using a UI library like `react-hot-toast`, you could replace the console log:
    // Example:
    // import { toast } from 'react-hot-toast';
    // toast(`${title}: ${description}`, { type: variant });
  }, []);

  return { toast };
}
