import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* Next 16 narrowed the default to [75] only. The grid runs at 82 and the
       hero and lightbox at 90, so both have to be declared here.

       An unlisted quality fails silently rather than loudly: the component
       renders, and the optimizer coerces the request to the nearest value on
       this list, so a `quality` prop that is not here reads as working while
       serving something else. Anything used in a component belongs in this
       array. */
    qualities: [75, 82, 88, 90],
    /*
      WebP only, deliberately. Enabling AVIF here crushes the tonal range of
      the served image: a source averaging rgb(50,54,58) came back out of the
      AVIF encoder at rgb(18,19,20), while the WebP and JPEG paths returned it
      untouched. On a site whose entire product is dark, low-key photography,
      that is not a tradeoff worth ~15% in file size. Revisit if a future Next
      release fixes the AVIF colour handling, and re-measure before trusting it.
    */
    formats: ["image/webp"],
  },
};

export default nextConfig;
