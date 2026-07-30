import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Portfolio } from "@/components/Portfolio";
import { PricingNote } from "@/components/PricingNote";
import { Testimonials } from "@/components/Testimonials";

/**
 * Section order, and the layout family each one uses. No family repeats, which
 * is what keeps the page from settling into a template rhythm:
 *
 *   Hero          full bleed image, type overlaid
 *   About         asymmetric split, portrait low and left
 *   Offerings     6 cell grid, image with title, description and price beneath
 *   Work          6 column editorial bed, bare images at mixed spans
 *   PricingNote   two column statement, 5/7
 *   Testimonials  single large quote, one at a time
 *   Contact       form and details, 7/5
 *
 * Offerings and Work are both image grids and sit next to each other, so they
 * are deliberately built to read differently: Offerings captions every cell
 * below the frame and keeps a steady rhythm, Work puts no type on the images
 * at all and swings between full-bleed and third-width tiles.
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Portfolio />
        <PricingNote />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
