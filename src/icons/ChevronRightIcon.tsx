import type { SVGProps } from 'react';

export function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M9 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
