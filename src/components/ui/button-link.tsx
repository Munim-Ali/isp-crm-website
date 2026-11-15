import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "./icon";

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "light" | "text";
  arrow?: boolean;
  className?: string;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  arrow = true,
  className = "",
}: ButtonLinkProps) {
  return (
    <Link href={href} className={`button button--${variant} ${className}`}>
      {children}
      {arrow && <Icon name="arrow" size={17} />}
    </Link>
  );
}
