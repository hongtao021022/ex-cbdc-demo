"use client";

import { useEffect, useState } from "react";

type NavigationItem = {
  label: string;
  href: string;
  sectionId: string;
};

const navigationItems: NavigationItem[] = [
  {
    label: "Scenarios",
    href: "#scenarios",
    sectionId: "scenarios",
  },
  {
    label: "Cross-border PvP",
    href: "#cross-border-pvp",
    sectionId: "cross-border-pvp",
  },
  {
    label: "Programmable Payments",
    href: "#programmable-payments",
    sectionId: "programmable-payments",
  },
  {
    label: "Regulatory Visibility",
    href: "#regulatory-visibility",
    sectionId: "regulatory-visibility",
  },
  {
    label: "Financial Stability",
    href: "#financial-stability",
    sectionId: "financial-stability",
  },
];

export default function DemoNavigation() {
  const [activeSection, setActiveSection] = useState("scenarios");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    function updateScrollProgress() {
      const scrollTop = window.scrollY;
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const nextProgress =
        documentHeight > 0
          ? Math.min((scrollTop / documentHeight) * 100, 100)
          : 0;

      setScrollProgress(nextProgress);
    }

    updateScrollProgress();

    window.addEventListener("scroll", updateScrollProgress, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
    };
  }, []);

  useEffect(() => {
    const availableSections = navigationItems
      .map((item) => document.getElementById(item.sectionId))
      .filter((section): section is HTMLElement => section !== null);

    if (availableSections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (firstEntry, secondEntry) =>
              secondEntry.intersectionRatio -
              firstEntry.intersectionRatio
          );

        const mostVisibleSection = visibleEntries[0];

        if (mostVisibleSection) {
          setActiveSection(mostVisibleSection.target.id);
        }
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0.05, 0.15, 0.3, 0.5],
      }
    );

    availableSections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <nav
      aria-label="Demo module navigation"
      className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl"
    >
      <div className="relative">
        <div
          className="absolute bottom-0 left-0 h-px bg-cyan-400 transition-[width] duration-150"
          style={{ width: `${scrollProgress}%` }}
          aria-hidden="true"
        />

        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-2.5 sm:px-10 lg:px-12">
          <button
            type="button"
            onClick={scrollToTop}
            className="flex shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-bold text-slate-300 transition hover:border-cyan-400/30 hover:bg-white/[0.08] hover:text-cyan-300"
            aria-label="Return to the top of the demo"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 15 6-6 6 6" />
            </svg>

            <span className="hidden sm:inline">Top</span>
          </button>

          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            {navigationItems.map((item, index) => {
              const isActive = activeSection === item.sectionId;

              return (
                <a
                  key={item.sectionId}
                  href={item.href}
                  aria-current={isActive ? "location" : undefined}
                  className={`group flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold transition ${
                    isActive
                      ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                      : "border-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.05] hover:text-slate-100"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                      isActive
                        ? "bg-cyan-400 text-slate-950"
                        : "bg-white/10 text-slate-400 group-hover:text-slate-200"
                    }`}
                  >
                    {index + 1}
                  </span>

                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>

          <div className="hidden shrink-0 items-center gap-2 text-xs font-semibold text-slate-500 2xl:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            4 modules ready
          </div>
        </div>
      </div>
    </nav>
  );
}
