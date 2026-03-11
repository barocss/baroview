/// <reference types="vite/client" />

declare namespace JSX {
  interface IntrinsicElements {
    'baro-view': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { url?: string; urls?: string; layout?: string; columns?: string }, HTMLElement>;
    'baro-view-item': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { url?: string; title?: string }, HTMLElement>;
  }
}
