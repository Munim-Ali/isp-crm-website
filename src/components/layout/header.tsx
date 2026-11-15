import Link from "next/link";
import { site } from "@/config/site";
import { navigation } from "@/content/marketing";
import { Brand } from "@/components/ui/brand";
import { ButtonLink } from "@/components/ui/button-link";
import { MobileMenu } from "./mobile-menu";

export function Header() {
  const links = navigation.map((link) => ({
    href: link.href,
    label: "brandLabel" in link ? `Why ${site.name}` : link.label,
  }));
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Brand name={site.name} logo={site.logo} />
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="site-header__cta">
          <ButtonLink href="/contact">Let’s talk</ButtonLink>
        </div>
        <MobileMenu links={links} />
      </div>
    </header>
  );
}
