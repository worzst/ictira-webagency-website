/// <reference types="astro/client" />

declare function gtag(...args: unknown[]): void;

interface Window {
  dataLayer: Record<string, unknown>[];
  turnstile?: {
    reset: (widgetId?: string) => void;
    render: (container: string | HTMLElement, params: Record<string, unknown>) => string;
    remove: (widgetId: string) => void;
    getResponse: (widgetId?: string) => string;
  };
}
