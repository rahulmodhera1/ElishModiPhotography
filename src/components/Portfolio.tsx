"use client";

import { useCallback, useState } from "react";
import type { CategoryId } from "@/lib/work";
import { Offerings } from "./Offerings";
import { Work } from "./Work";

/**
 * Holds the one piece of state the offering cards and the portfolio grid
 * share. Keeping it here means both sections stay client leaves and the rest
 * of the page can render on the server.
 */
export function Portfolio() {
  const [filter, setFilter] = useState<CategoryId | "all">("all");

  const selectFromCard = useCallback((id: CategoryId) => {
    setFilter(id);
    /* Jump to the grid the card just filtered. Honour a reduced-motion
       preference here too: a long smooth scroll is motion like any other. */
    const target = document.getElementById("work");
    if (!target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, []);

  return (
    <>
      <Offerings onSelect={selectFromCard} />
      <Work filter={filter} onFilterChange={setFilter} />
    </>
  );
}
