import React from "react";

type Props = { name: string; className?: string; size?: number };

export function Icon({ name, className = "", size = 14 }: Props) {
  const s = size;
  const common = {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };
  switch (name) {
    case "pdf":
    case "doc":
      return (
        <svg {...common}>
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5" />
          <path d="M9 13h6M9 17h4" />
        </svg>
      );
    case "xls":
      return (
        <svg {...common}>
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5" />
          <path d="M9 13l5 5M14 13l-5 5" />
        </svg>
      );
    case "id":
    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="9" r="3" />
          <path d="M5 20c1.5-3 4-4 7-4s5.5 1 7 4" />
        </svg>
      );
    case "bank":
      return (
        <svg {...common}>
          <path d="M3 10l9-6 9 6" />
          <path d="M5 10v8M9 10v8M15 10v8M19 10v8" />
          <path d="M3 20h18" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 7l9 6 9-6" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
        </svg>
      );
    case "key":
      return (
        <svg {...common}>
          <circle cx="8" cy="15" r="3" />
          <path d="M10.5 13L20 4M16 8l3 3M14 10l2 2" />
        </svg>
      );
    case "cloud":
      return (
        <svg {...common}>
          <path d="M7 18a4 4 0 1 1 .7-7.9A6 6 0 0 1 19 13a3 3 0 0 1-1 5.8H7z" />
        </svg>
      );
    case "flag":
      return (
        <svg {...common}>
          <path d="M5 21V4M5 4h11l-2 3 2 3H5" />
        </svg>
      );
    case "send":
      return (
        <svg {...common}>
          <path d="M21 3L3 11l7 2 2 7z" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common}>
          <path d="M4 20h16" />
          <path d="M6 16V10M11 16V6M16 16v-4" />
        </svg>
      );
    case "alert":
      return (
        <svg {...common}>
          <path d="M12 3l10 18H2z" />
          <path d="M12 10v5M12 18v.5" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12l3 3 5-6" />
        </svg>
      );
    case "bag":
      return (
        <svg {...common}>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M8 7V5a4 4 0 0 1 8 0v2" />
        </svg>
      );
    case "scale":
      return (
        <svg {...common}>
          <path d="M12 3v18M5 9h14" />
          <path d="M3 13l2-4 2 4M17 13l2-4 2 4" />
        </svg>
      );
    case "demo":
      return (
        <svg {...common}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );
    case "spark":
      return (
        <svg {...common}>
          <path d="M12 3l1.8 4.6L18 9.5l-4.2 1.9L12 16l-1.8-4.6L6 9.5l4.2-1.9z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}
