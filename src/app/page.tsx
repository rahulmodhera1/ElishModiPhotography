import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Packages } from "@/components/Packages";
import { Portfolio } from "@/components/Portfolio";
import { Testimonials } from "@/components/Testimonials";

/**
 * Section order, and the layout family each one uses. No family repeats, which
 * is what keeps the page from settling into a template rhythm:
 *
 *   Hero          full bleed image, type overlaid
 *   About         asymmetric split, image low and left
 *   Specialties   4 cell image grid, 7/5 then 5/7
 *   Work          6 column editorial bed, mixed spans
 *   Packages      ledger rows, price left, contents right
 *   Testimonials  single large quote, one at a time
 *   Contact       form and details, 7/5
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Portfolio />
        <Packages />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
