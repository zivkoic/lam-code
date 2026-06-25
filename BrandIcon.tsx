import React from "react";

export type BrandIconName =
  | "pdf"
  | "xls"
  | "doc"
  | "mail"
  | "id"
  | "bank"
  | "shield"
  | "cloud"
  | "key"
  | "user"
  | "policy"
  | "teams"
  | "sharepoint"
  | "powerauto"
  | "outlook"
  | "gmail"
  | "drive"
  | "onedrive";

type Props = { name: BrandIconName; size?: number; className?: string };

/* Small branded-style file/app tile icons. Inspired by real product chips
   so each card reads at a glance: red PDF, green Excel, blue Word, etc. */
export function BrandIcon({ name, size = 22, className = "" }: Props) {
  const s = size;
  const r = s * 0.18;
  const wrap = (bg: string, content: React.ReactNode, stroke?: string) => (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
    >
      <rect
        x="1"
        y="1"
        width="22"
        height="22"
        rx={r}
        ry={r}
        fill={bg}
        stroke={stroke ?? "rgba(0,0,0,0.06)"}
        strokeWidth="0.5"
      />
      {content}
    </svg>
  );

  switch (name) {
    case "pdf":
      return wrap(
        "#E2342D",
        <text
          x="12"
          y="15.6"
          textAnchor="middle"
          fontSize="7.4"
          fontWeight="800"
          fill="#fff"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="-0.3"
        >
          PDF
        </text>,
      );
    case "xls":
      return wrap(
        "#1E7B40",
        <text
          x="12"
          y="16"
          textAnchor="middle"
          fontSize="11"
          fontWeight="800"
          fill="#fff"
          fontFamily="system-ui, sans-serif"
        >
          X
        </text>,
      );
    case "doc":
      return wrap(
        "#1F5FB3",
        <text
          x="12"
          y="16"
          textAnchor="middle"
          fontSize="11"
          fontWeight="800"
          fill="#fff"
          fontFamily="system-ui, sans-serif"
        >
          W
        </text>,
      );
    case "policy":
      return wrap(
        "#3478C7",
        <>
          <rect x="6" y="6" width="12" height="2" rx="0.6" fill="#fff" />
          <rect x="6" y="10" width="12" height="2" rx="0.6" fill="#fff" opacity="0.85" />
          <rect x="6" y="14" width="9" height="2" rx="0.6" fill="#fff" opacity="0.7" />
        </>,
      );
    case "mail":
    case "gmail":
      return wrap(
        "#ffffff",
        <>
          <path
            d="M3 7.5l9 6 9-6"
            fill="none"
            stroke="#EA4335"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <path
            d="M3 7.5v10a1 1 0 001 1h16a1 1 0 001-1v-10"
            fill="none"
            stroke="#34A853"
            strokeWidth="1.8"
          />
          <path d="M3 7.5L7 5h10l4 2.5" fill="none" stroke="#FBBC04" strokeWidth="1.8" />
        </>,
        "rgba(0,0,0,0.08)",
      );
    case "outlook":
      return wrap(
        "#0E61BE",
        <>
          <rect x="5" y="8" width="9" height="9" rx="1.2" fill="#fff" />
          <text
            x="9.5"
            y="14.4"
            textAnchor="middle"
            fontSize="6.4"
            fontWeight="800"
            fill="#0E61BE"
            fontFamily="system-ui, sans-serif"
          >
            O
          </text>
          <rect x="14.5" y="9" width="5" height="7" rx="0.5" fill="#56A0E0" />
        </>,
      );
    case "id":
    case "user":
      return wrap(
        "#3B82F6",
        <>
          <circle cx="12" cy="10" r="2.6" fill="#fff" />
          <path
            d="M6.5 18c1.4-2.6 3.6-3.6 5.5-3.6S16.1 15.4 17.5 18"
            fill="none"
            stroke="#fff"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </>,
      );
    case "bank":
      return wrap(
        "#7C3AED",
        <>
          <path d="M4 11l8-5 8 5" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinejoin="round" />
          <path d="M6 11v7M10 11v7M14 11v7M18 11v7" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M4 19h16" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
        </>,
      );
    case "shield":
      return wrap(
        "#E2342D",
        <path
          d="M12 5l6 2v5c0 3.5-2.5 5.8-6 6.5-3.5-.7-6-3-6-6.5V7z"
          fill="#fff"
        />,
      );
    case "key":
      return wrap(
        "#F59E0B",
        <>
          <circle cx="9" cy="14" r="2.6" fill="none" stroke="#fff" strokeWidth="1.8" />
          <path
            d="M10.8 12.2L19 4M16 7l2 2M14 9l1.5 1.5"
            stroke="#fff"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
        </>,
      );
    case "cloud":
      return wrap(
        "#0EA5E9",
        <path
          d="M7 17a3.5 3.5 0 11.6-6.95A5 5 0 0118 13a2.5 2.5 0 01-.8 4.85H7z"
          fill="#fff"
        />,
      );
    case "drive":
      return wrap(
        "#ffffff",
        <>
          <path d="M9 4l-6 11h6l3-5.5z" fill="#FBBC04" />
          <path d="M9 4h6l6 11h-6z" fill="#34A853" />
          <path d="M3 15l3 5h12l-3-5z" fill="#1A73E8" />
        </>,
        "rgba(0,0,0,0.08)",
      );
    case "onedrive":
      return wrap(
        "#ffffff",
        <path
          d="M6 16a3 3 0 010-6 4 4 0 017.6-1.5A3.5 3.5 0 0118.5 16z"
          fill="#0078D4"
        />,
        "rgba(0,0,0,0.08)",
      );
    case "teams":
      return wrap(
        "#4B53BC",
        <>
          <rect x="10" y="6.5" width="9" height="11" rx="1.4" fill="#fff" />
          <text
            x="14.5"
            y="14.6"
            textAnchor="middle"
            fontSize="8"
            fontWeight="800"
            fill="#4B53BC"
            fontFamily="system-ui, sans-serif"
          >
            T
          </text>
          <circle cx="7" cy="9.5" r="2.2" fill="#fff" />
          <rect x="4.5" y="11" width="5" height="5" rx="0.8" fill="#fff" />
        </>,
      );
    case "sharepoint":
      return wrap(
        "#036C70",
        <>
          <circle cx="9" cy="11" r="3.6" fill="#fff" />
          <circle cx="14.5" cy="14.5" r="2.6" fill="#fff" opacity="0.85" />
          <circle cx="16.5" cy="9.5" r="1.8" fill="#fff" opacity="0.7" />
        </>,
      );
    case "powerauto":
      return wrap(
        "#0066FF",
        <path
          d="M13 4l-7 11h4l-1 5 7-11h-4z"
          fill="#fff"
        />,
      );
    default:
      return wrap("#9CA3AF", null);
  }
}
