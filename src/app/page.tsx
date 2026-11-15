'use client'

import DotField from "@/components/dotfield";
import Scramble from "@/components/scramble";
import Clock from "@/components/clock";
import DecodeText from "@/components/decode-text";

type Link = { label: string; href: string };
type Project = {
  name: string;
  year: string;
  blurb: string;
  links: Link[];
};

const PROJECTS: Project[] = [
  {
    name: "dvara",
    year: "2025",
    blurb: "bloom-filter url threat screening. 3m urls in 5.14mb, 0.1% fpr, 145k q/s.",
    links: [
      { label: "github", href: "https://github.com/dhruv-0512/dvara" },
      { label: "live", href: "http://13.61.0.125:8000/" },
      { label: "pypi", href: "https://pypi.org/project/dvara/" },
    ],
  },
  {
    name: "querymind",
    year: "2025",
    blurb: "english → sql over your data. rag-grounded gemini 2.5, kafka, per-user schemas.",
    links: [
      { label: "github", href: "https://github.com/dhruv-0512/QueryMind" },
      { label: "demo", href: "https://query-mind-brown.vercel.app/" },
    ],
  },
  {
    name: "fluxgate",
    year: "2025",
    blurb: "distributed rate limiting. 4 algorithms, atomic redis lua. 4k rps @ 12ms p50.",
    links: [{ label: "github", href: "https://github.com/dhruv-0512/fluxgate" }],
  },
  {
    name: "lostping",
    year: "2025",
    blurb: "ais vessel anomaly detection. 7.3m pings, 4,621 ships, ~3 min. spoofing flagged.",
    links: [{ label: "github", href: "https://github.com/dhruv-0512/lostping" }],
  },
  {
    name: "sybilgat",
    year: "2024",
    blurb: "graph attention net for social bot detection. 97.12% acc, attention p < 1e-5.",
    links: [{ label: "github", href: "https://github.com/dhruv-0512/SybilGAT" }],
  },
  {
    name: "exoplanet retrieval",
    year: "2024",
    blurb: "ml retrieval of 5 gas abundances from jwst spectra. under review @ springer nature.",
    links: [
      { label: "github", href: "https://github.com/dhruv-0512/Exoplanet-Atmospheric-Retrieval" },
      { label: "paper", href: "/paper.pdf" },
    ],
  },
  {
    name: "amcnetv5",
    year: "2024",
    blurb: "1d cnn + cbam for radio modulation. 11 types, 93.06% high-snr, 1.26m params.",
    links: [{ label: "github", href: "https://github.com/dhruv-0512/AMC-Automatic-Modulation-Classification-" }],
  },
  {
    name: "rag-doc-qa",
    year: "2024",
    blurb: "offline pdf qa. local llms via ollama, chromadb, fully private.",
    links: [{ label: "github", href: "https://github.com/dhruv-0512/rag-doc-qa" }],
  },
  {
    name: "real-time ids",
    year: "2024",
    blurb: "bilstm + live tshark packet capture. 99.16% acc, 0.83% fpr.",
    links: [{ label: "github", href: "https://github.com/harshithhraya/real-time-intrusion-detection-system" }],
  },
  {
    name: "jot",
    year: "2024",
    blurb: "terminal clipboard manager. text + image, fuzzy search, sqlite.",
    links: [
      { label: "github", href: "https://github.com/dhruv-0512/jot" },
      { label: "pypi", href: "https://pypi.org/project/jot-history/" },
    ],
  },
  {
    name: "waitpal",
    year: "2024",
    blurb: "passive powershell companion. witty one-liners while commands run.",
    links: [
      { label: "github", href: "https://github.com/dhruv-0512/waitpal" },
      { label: "pypi", href: "https://pypi.org/project/waitpal/" },
    ],
  },
];

const STACK = [
  "c", "c++", "python", "java", "javascript",
  "fastapi", "express", "react",
  "tensorflow", "pytorch",
  "redis", "postgres", "mysql", "mongo",
  "docker", "kubernetes", "aws",
  "git", "linux", "shell",
  "dsa", "os", "dbms", "networks", "oop",
  "ml", "distributed systems",
];

const NAV = [
  { label: "about", href: "#about" },
  { label: "now", href: "#now" },
  { label: "work", href: "#work" },
  { label: "stack", href: "#stack" },
  { label: "contact", href: "#contact" },
];

const TOP_LINKS: Link[] = [
  { label: "email", href: "mailto:dhruvh0530@gmail.com" },
  { label: "github", href: "https://github.com/dhruv-0512" },
  { label: "linkedin", href: "https://www.linkedin.com/in/dhruv-trivedi-3005d/" },
  { label: "résumé", href: "/dhruv.pdf" },
];

function SectionLabel({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="text-[11px] tracking-[0.2em] text-neutral-400 mt-16 mb-4 scroll-mt-8"
    >
      {children}
    </h2>
  );
}

export default function Home() {
  return (
    <>
      <DotField />

      <div className="min-h-screen flex flex-col">
        <main
          className="w-full max-w-[600px] mx-auto px-6 pt-20 pb-10 fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          {/* ── nav ─────────────────────────────────────────── */}
          <nav className="text-[12px] text-neutral-400 mb-20 flex gap-4">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="link-u hover:text-neutral-900 transition-colors">
                {n.label}
              </a>
            ))}
          </nav>

          {/* ── intro ───────────────────────────────────────── */}
          <header className="mb-12">
            <h1 className="text-[26px] sm:text-[34px] leading-none font-medium tracking-tight text-neutral-900">
              <Scramble text="dhruv trivedi" />
              <span className="cursor" aria-hidden="true" />
            </h1>
            <p className="mt-3 text-[14px] text-neutral-500">
              backend &amp; ml · bangalore
            </p>
            <p className="mt-5 text-[14px] text-neutral-600 leading-relaxed max-w-[440px]">
              building backend systems, distributed infra, and applied ml.
              mostly reading, building, and falling down rabbit holes trying to
              understand how things actually work.
            </p>
            <div className="mt-6 text-[12px] text-neutral-500 flex flex-wrap gap-x-4 gap-y-1">
              {TOP_LINKS.map((l) => (
                <a key={l.href} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="link-u hover:text-neutral-900 transition-colors">
                  {l.label}
                </a>
              ))}
            </div>
          </header>

          {/* ── about ───────────────────────────────────────── */}
          <section>
            <SectionLabel id="about">about</SectionLabel>
            <p className="text-[14px] text-neutral-600 leading-relaxed">
              undergrad at b.m.s. college of engineering, bangalore — information
              science &amp; engineering, graduating 2027.
            </p>
            <p className="text-[14px] text-neutral-600 leading-relaxed mt-3">
              i like the quiet craft of figuring things out from first principles,
              writing clean software, and tinkering with ideas until they work.
            </p>
          </section>

          {/* ── now ─────────────────────────────────────────── */}
          <section>
            <SectionLabel id="now">now</SectionLabel>
            <p className="text-[14px] text-neutral-600 leading-relaxed">
              <span className="text-neutral-900">sde intern</span> @ profinch solutions
              <span className="text-neutral-400"> · jul 2026 → sep 2026</span>
            </p>
            <p className="text-[13px] text-neutral-500 leading-relaxed mt-2">
              backend work, performance, clean execution.
            </p>
          </section>

          {/* ── work ────────────────────────────────────────── */}
          <section>
            <SectionLabel id="work">work</SectionLabel>
            <div className="divide-y divide-neutral-200">
              {PROJECTS.map((p) => (
                <div
                  key={p.name}
                  className="proj-row py-4 text-neutral-500"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="marker text-neutral-900 text-[12px] select-none">{"›"}</span>
                    <span className="text-[14px] text-neutral-900">{p.name}</span>
                    <span className="text-[11px] text-neutral-400 ml-auto tabular-nums">
                      {p.year}
                    </span>
                  </div>
                  <p className="text-[13px] text-neutral-600 leading-relaxed mt-1.5 pl-5">
                    {p.blurb}
                  </p>
                  <div className="text-[11px] text-neutral-400 mt-2 pl-5 flex flex-wrap gap-x-3 gap-y-0.5">
                    {p.links.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        target={l.href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="link-u hover:text-neutral-900 transition-colors"
                      >
                        {l.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── stack ───────────────────────────────────────── */}
          <section>
            <SectionLabel id="stack">stack</SectionLabel>
            <p className="text-[13px] text-neutral-500 leading-[1.9]">
              {STACK.map((s, i) => (
                <span key={s}>
                  <span className="text-neutral-700">{s}</span>
                  {i < STACK.length - 1 && <span className="text-neutral-300"> · </span>}
                </span>
              ))}
            </p>
          </section>

          {/* ── contact ─────────────────────────────────────── */}
          <section>
            <SectionLabel id="contact">contact</SectionLabel>
            <div className="flex flex-col sm:flex-row gap-8 sm:gap-10">
              {/* links */}
              <div className="text-[14px] text-neutral-700 leading-[1.9] sm:flex-1">
                <div>
                  <a href="mailto:dhruvh0530@gmail.com" className="link-u hover:text-neutral-900 transition-colors">dhruvh0530@gmail.com</a>
                </div>
                <div>
                  <a href="https://github.com/dhruv-0512" target="_blank" rel="noopener noreferrer" className="link-u hover:text-neutral-900 transition-colors">github.com/dhruv-0512</a>
                </div>
                <div>
                  <a href="https://www.linkedin.com/in/dhruv-trivedi-3005d/" target="_blank" rel="noopener noreferrer" className="link-u hover:text-neutral-900 transition-colors">linkedin.com/in/dhruv-trivedi-3005d</a>
                </div>
                <div>
                  <a href="/dhruv.pdf" target="_blank" rel="noopener noreferrer" className="link-u hover:text-neutral-900 transition-colors">résumé.pdf</a>
                </div>
              </div>

              {/* quote — sits beside the links, decodes itself on a loop */}
              <div className="sm:flex-1 sm:border-l sm:border-neutral-200 sm:pl-10 border-t border-neutral-200 pt-6 sm:pt-0">
                <DecodeText
                  text={"“we used to look up at the sky and wonder at our place in the stars.”"}
                  className="text-[13px] text-neutral-400 italic leading-relaxed"
                />
              </div>
            </div>
          </section>
        </main>

        {/* ── footer ─────────────────────────────────────────── */}
        <footer className="mt-auto">
          <div className="w-full max-w-[600px] mx-auto px-6 py-8 text-[11px] text-neutral-400 flex flex-wrap items-center justify-between gap-y-2">
            <span>© 2026 dhruv trivedi</span>
            <span className="tabular-nums"><Clock /></span>
            <span>probably... probably not</span>
          </div>
        </footer>
      </div>
    </>
  );
}
