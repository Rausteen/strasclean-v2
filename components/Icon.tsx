import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

const base = (props: IconProps) => ({
  width: props.size ?? 20,
  height: props.size ?? 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...props,
});

export const WhatsAppIcon = (p: IconProps) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M19.05 4.91A10 10 0 0 0 4.31 18.6L3 22l3.5-1.27A10 10 0 1 0 19.05 4.9Zm-7.05 15.2a8.13 8.13 0 0 1-4.15-1.13l-.3-.18-2.07.75.75-2-.2-.32A8.14 8.14 0 1 1 12 20.1Zm4.7-6.1c-.26-.13-1.52-.75-1.76-.83-.24-.09-.4-.13-.58.13-.17.26-.66.83-.81 1-.15.17-.3.19-.56.07-.26-.13-1.1-.4-2.1-1.3a7.94 7.94 0 0 1-1.46-1.81c-.15-.26-.02-.4.11-.53.11-.11.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.58-1.39-.79-1.9-.21-.5-.42-.43-.58-.44h-.49a.95.95 0 0 0-.69.32c-.24.26-.92.9-.92 2.2 0 1.3.94 2.55 1.07 2.72.13.17 1.85 2.83 4.5 3.97.63.27 1.12.43 1.5.55.63.2 1.2.17 1.66.1.5-.07 1.52-.62 1.74-1.22.21-.6.21-1.11.15-1.22-.06-.11-.24-.17-.5-.3Z" />
  </svg>
);

export const PhoneIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
  </svg>
);

export const MapPinIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const SparklesIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
  </svg>
);

export const ClockIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const ShieldIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const HomeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5 10v10h14V10" />
  </svg>
);

export const CarIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 13l2-5a3 3 0 0 1 2.8-2h8.4A3 3 0 0 1 19 8l2 5" />
    <path d="M3 13h18v5H3z" />
    <circle cx="7" cy="18" r="1.5" />
    <circle cx="17" cy="18" r="1.5" />
  </svg>
);

export const CheckIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m5 12 5 5L20 7" />
  </svg>
);

export const StarIcon = (p: IconProps) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M12 2.5l2.95 5.98 6.6.96-4.78 4.66 1.13 6.58L12 17.77 6.1 20.68l1.13-6.58L2.45 9.44l6.6-.96L12 2.5Z" />
  </svg>
);

export const ChevronDownIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export const BoltIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
  </svg>
);

export const PawIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="5.5" cy="11" r="1.7" />
    <circle cx="9" cy="6.5" r="1.7" />
    <circle cx="15" cy="6.5" r="1.7" />
    <circle cx="18.5" cy="11" r="1.7" />
    <path d="M8 17.5c0-2.5 2-4 4-4s4 1.5 4 4c0 2-1.8 3-4 3s-4-1-4-3Z" />
  </svg>
);

export const SprayIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9 7h6v9a3 3 0 0 1-3 3 3 3 0 0 1-3-3V7Z" />
    <path d="M10 7V4h4v3" />
    <path d="M16 5h2M16 8h2M19 4h1M19 9h1" />
  </svg>
);

export const MenuIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const CloseIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
