import type { SVGProps } from 'react';

export function ImageIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="3" y="4" width="18" height="16" rx="3.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="9" cy="10" r="1.75" fill="currentColor" />
      <path
        d="m4.5 18 5-5 3.5 3.5 2.5-2.5 4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
