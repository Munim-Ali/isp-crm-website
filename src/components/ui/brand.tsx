import Link from "next/link";
import Image from "next/image";

export function Brand({
  name,
  logo = "",
  light = false,
}: {
  name: string;
  logo?: string;
  light?: boolean;
}) {
  return (
    <Link
      href="/"
      className={`brand${light ? " brand--light" : ""}`}
      aria-label={`${name} home`}
    >
      {logo ? (
        <Image
          src={logo}
          alt=""
          width={34}
          height={34}
          className="brand__custom-logo"
        />
      ) : (
        <span className="brand__mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M6 16V8a2 2 0 0 1 4 0v8a2 2 0 0 0 4 0V8a2 2 0 0 1 4 0v8"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              d="M3 12h18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      )}
      <span>
        {name.toLowerCase()}
        <span className="brand__dot">.</span>
      </span>
    </Link>
  );
}
