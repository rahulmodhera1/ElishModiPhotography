import { InstagramLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { nav, site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-rule-soft py-14 sm:py-16">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <p className="font-display text-[1.5rem] leading-none text-paper">
              {site.wordmark}
            </p>
            <p className="mt-4 max-w-[34ch] text-[0.9375rem] leading-relaxed text-paper-dim">
              Portrait, family, and newborn photography based in Toronto, Ontario.
            </p>
          </div>

          {/*
            The padding on these links is the tap target, not decoration.

            Set as text alone they were 16px tall, which is a fifth of a
            fingertip and under even the 24px WCAG minimum, in the part of the
            page most likely to be reached one-handed. Padding takes them to
            32px and the list gap comes down to match, so the block occupies
            roughly the space it did before and the links are hittable.
          */}
          <nav aria-label="Footer" className="lg:col-span-3">
            <ul className="space-y-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="inline-block py-2 text-[0.75rem] uppercase tracking-[0.2em] text-paper-dim transition-colors duration-200 hover:text-paper"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-1 lg:col-span-4">
            <a
              href={`mailto:${site.email}`}
              className="block py-1.5 text-[0.9375rem] text-paper-dim transition-colors duration-200 hover:text-paper"
            >
              {site.email}
            </a>
            <a
              href={`tel:${site.phoneHref}`}
              className="block py-1.5 text-[0.9375rem] text-paper-dim transition-colors duration-200 hover:text-paper"
            >
              {site.phone}
            </a>
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 py-1.5 text-[0.9375rem] text-paper-dim transition-colors duration-200 hover:text-paper"
            >
              <InstagramLogoIcon size={17} weight="light" />
              {site.instagramHandle}
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-rule-soft pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-paper-faint">
            &copy; {year} {site.name}. All photographs are the property of the
            photographer.
          </p>
          <p className="text-xs text-paper-faint">{site.city}, Canada</p>
        </div>
      </div>
    </footer>
  );
}
