import React from "react";

export function IconCyberSecurity({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Outer Hex Shield */}
      <path d="M12 2L20 6V13C20 18.5 12 22 12 22C12 22 4 18.5 4 13V6L12 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="miter" strokeLinecap="square" />
      {/* Inner Core Node */}
      <rect x="10" y="10" width="4" height="4" fill="currentColor" opacity="0.8" />
      {/* Circuit lines */}
      <path d="M12 6V10M8 11.5H10M14 11.5H16M12 14V17" stroke="currentColor" strokeWidth="1" opacity="0.6" />
    </svg>
  );
}

export function IconPenetration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Isometric Cube base */}
      <path d="M12 4.5L18.5 8V15.5L12 19L5.5 15.5V8L12 4.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="miter" strokeLinecap="square" />
      <path d="M5.5 8L12 11.5L18.5 8M12 19V11.5" stroke="currentColor" strokeWidth="1.2" opacity="0.5" strokeLinejoin="miter" strokeLinecap="square" />
      {/* Breach vector / targeting */}
      <path d="M12 2V4.5M22 11.5H18.5M2 11.5H5.5M12 19V21.5" stroke="currentColor" strokeWidth="1" strokeDasharray="1 2" />
      <circle cx="12" cy="11.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function IconWebDev({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Code brackets */}
      <path d="M7 8L3 12L7 16" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="miter" strokeLinecap="square" />
      <path d="M17 8L21 12L17 16" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="miter" strokeLinecap="square" />
      {/* Connecting nodes structure */}
      <path d="M10 5L14 19" stroke="currentColor" strokeWidth="1" opacity="0.6" strokeLinejoin="miter" strokeLinecap="square" />
      <circle cx="10.5" cy="4.5" r="1.5" fill="currentColor" opacity="0.8" />
      <circle cx="13.5" cy="19.5" r="1.5" fill="currentColor" opacity="0.8" />
      <path d="M11.5 11L14.5 13" stroke="currentColor" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

export function IconProgramming({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Terminal Outline */}
      <rect x="3" y="4" width="18" height="16" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="miter" strokeLinecap="square" />
      {/* Logic flow / Execution lines */}
      <path d="M6 8L9 11L6 14" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="miter" strokeLinecap="square" />
      <path d="M10 14H14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
      <circle cx="17" cy="14" r="1" fill="currentColor" opacity="0.8" />
      <path d="M3 8H1M23 8H21" stroke="currentColor" strokeWidth="1" opacity="0.5" strokeDasharray="1 2" />
    </svg>
  );
}

export function IconAI({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Central Core */}
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
      {/* Neural Nodes */}
      <circle cx="6" cy="7" r="1.5" stroke="currentColor" strokeWidth="1" />
      <circle cx="18" cy="7" r="1.5" stroke="currentColor" strokeWidth="1" />
      <circle cx="6" cy="17" r="1.5" stroke="currentColor" strokeWidth="1" />
      <circle cx="18" cy="17" r="1.5" stroke="currentColor" strokeWidth="1" />
      {/* Network Connections */}
      <path d="M7 8L10.5 10.5M17 8L13.5 10.5M7 16L10.5 13.5M17 16L13.5 13.5M6 8.5V15.5M18 8.5V15.5" stroke="currentColor" strokeWidth="1" opacity="0.6" strokeLinecap="square" />
    </svg>
  );
}

export function IconCloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Geometric Cloud / Distributed Nodes */}
      <path d="M7 15H17C18.6569 15 20 13.6569 20 12C20 10.3431 18.6569 9 17 9H16.5C16.5 6 14 4 11 4C8.75 4 6.88 5.4 6.2 7.3C4.4 7.3 3 8.7 3 10.5C3 12.433 4.567 14 6.5 14H7" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="miter" strokeLinecap="square" />
      {/* Downlink / Deployment lines */}
      <path d="M9 15V19M12 15V20M15 15V18" stroke="currentColor" strokeWidth="1" opacity="0.7" strokeDasharray="2 2" strokeLinecap="square" />
      <rect x="8.5" y="19" width="1" height="1" fill="currentColor" />
      <rect x="11.5" y="20" width="1" height="1" fill="currentColor" />
      <rect x="14.5" y="18" width="1" height="1" fill="currentColor" />
    </svg>
  );
}
