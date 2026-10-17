import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";

import hero from "@/assets/star-wars-logo.png";
import droids from "@/assets/sw-image22.jpeg.asset.json";
import poster from "@/assets/sw-image26.jpeg.asset.json";
import t1 from "@/assets/sw-image43.jpeg.asset.json";
import t2 from "@/assets/sw-image38.jpeg.asset.json";
import t3 from "@/assets/sw-image42.jpeg.asset.json";
import kylo from "@/assets/sw-image49.jpeg.asset.json";
import lego from "@/assets/sw-image65.jpeg.asset.json";
import reviews from "@/assets/sw-image82.jpeg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Star Wars Film Launch — Super Fan Frenzy" },
      { name: "description", content: "An awareness campaign for Disney's upcoming Star Wars film, powered by super fans." },
      { property: "og:title", content: "Star Wars Film Launch — Super Fan Frenzy" },
      { property: "og:description", content: "Three phases to mobilize Star Warriors around the film's release." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e?.isIntersecting && el.classList.add("in"), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    let raf = 0;
    let warp = 0.4;
    const stars = Array.from({ length: 1800 }, () => ({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() }));
    const resize = () => { c.width = innerWidth; c.height = innerHeight; };
    resize();
    addEventListener("resize", resize);
    const onScroll = () => { warp = 0.4 + Math.min(scrollY / 300, 6); };
    addEventListener("scroll", onScroll);
    const color = getComputedStyle(document.documentElement).getPropertyValue("--foreground");
    const tick = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = color;
      const cx = c.width / 2, cy = c.height / 2;
      for (const s of stars) {
        s.z -= 0.002 * warp;
        if (s.z <= 0.01) { s.z = 1; s.x = Math.random() * 2 - 1; s.y = Math.random() * 2 - 1; }
        const px = cx + (s.x / s.z) * cx, py = cy + (s.y / s.z) * cy;
        const r = (1 - s.z) * 2.4;
        ctx.globalAlpha = Math.min(1, (1 - s.z) * 1.3);
        ctx.fillRect(px, py, r, r * (1 + warp));
      }
      warp += (0.4 - warp) * 0.02;
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", resize); removeEventListener("scroll", onScroll); };
  }, []);
  return <canvas ref={ref} className="pointer-events-none fixed inset-0 -z-10" />;
}

const Kicker = ({ children }: { children: ReactNode }) => (
  <p className="font-display text-xs uppercase tracking-[0.4em] text-primary">{children}</p>
);
const H2 = ({ children }: { children: ReactNode }) => (
  <h2 className="font-display text-4xl font-bold uppercase leading-tight md:text-6xl">{children}</h2>
);

function Stat({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (t: number) => { const p = Math.min((t - t0) / 1400, 1); setN(Math.round(value * p)); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [value]);
  return (
    <div ref={ref} className="border-l-2 border-primary pl-6">
      <div className="font-display text-6xl font-black text-primary glow-primary">{n}%</div>
      <p className="mt-2 max-w-xs text-muted-foreground">{label}</p>
    </div>
  );
}

const phases = [
  {
    n: "I", name: "Drop the Trailer", tag: "Trailer Release", title: "Twitch Watch Party 🍿", img: kylo.url,
    body: [
      "We'll invite fans across the world to a live watch party where they can experience reactions from their fave streamers in real time.",
      "The event will also include pre-show gaming experiences and trivia segments. In each head to head battle, fans will have a chance to win exclusive tickets for our irl film premiere.",
    ],
    creators: ["Nia D (@starwarstheoryl)", "Anna Mello (@thatstarwarsgirl)"],
  },
  {
    n: "II", name: "Build Buzz", tag: "Experiential", title: "Airbnb Lego Museum 🖼️", img: lego.url,
    body: [
      "We'll work with Lego, Airbnb, and a selection of prop artists from the show to create an experiential homage to the franchise with a special focus on its latest film.",
      "The museum will feature Lego replicas of real film props, interactive AR experiences, and Lego building workshops with the pros.",
      "Before opening, fans show off their own Star Wars Lego art for a chance to be featured in an exhibit — plus live tours from creators like Serena Neel.",
    ],
    creators: ["Ethan The Artisan (@ethan.the.artisan)", "Serena Neel (@serenaneel)"],
  },
  {
    n: "III", name: "Keep 'em Talking", tag: "Post Release", title: "Editorial Fan Reviews ✍️", img: reviews.url,
    body: [
      "Fans can also be the best critics. To keep people talking after release, we'll invite fans to write reviews on Letterboxd and share them on social.",
      "Popular IG and TT movie reviewers kick off with their takes, then invite audiences to stitch, duet, remix, or reply with green screen videos.",
      "Winners visit Galaxy's Edge with the cast and get their review featured in a well-known entertainment publication.",
    ],
    creators: ["Pop The Bounty Hunter (@popthebountycollector)"],
  },
];

function Phases() {
  const [active, setActive] = useState(0);
  const p = phases[active]!;
  return (
    <section id="phases" className="px-6 py-32 md:px-16">
      <Reveal className="mb-12 text-center"><Kicker>The Rollout</Kicker><H2>Three Phases</H2></Reveal>
      <div className="mx-auto mb-12 flex max-w-3xl items-center justify-between">
        {phases.map((ph, i) => (
          <button key={ph.n} onClick={() => setActive(i)} className="group flex flex-1 flex-col items-center gap-3">
            <span className={`h-1 w-full rounded-full transition-all ${i <= active ? "bg-saber saber-glow" : "bg-muted"}`} />
            <span className={`font-display text-sm uppercase tracking-widest transition-colors ${i === active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}>
              Phase {ph.n}: {ph.name}
            </span>
          </button>
        ))}
      </div>
      <div key={active} className="mx-auto grid max-w-6xl items-center gap-10 animate-in fade-in slide-in-from-bottom-6 duration-700 md:grid-cols-2">
        <img src={p.img} alt={p.title} className="aspect-[4/5] w-full rounded object-cover" />
        <div className="space-y-5">
          <Kicker>{p.tag}</Kicker>
          <h3 className="font-display text-3xl font-bold uppercase md:text-4xl">{p.title}</h3>
          {p.body.map((b) => <p key={b} className="text-muted-foreground">{b}</p>)}
          <div className="flex flex-wrap gap-2 pt-2">
            {p.creators.map((c) => <span key={c} className="rounded-full border border-primary/40 px-4 py-1 text-sm text-primary">{c}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}

function Index() {
  return (
    <main className="relative overflow-x-hidden">
      <Starfield />

      <section className="relative flex h-screen flex-col items-center justify-center text-center">
        <div className="absolute left-1/2 top-6 z-10 -translate-x-1/2 px-4">
          <div className="flex flex-col items-center gap-1.5 rounded-full border border-primary/60 bg-background/50 px-7 py-2.5 backdrop-blur-sm">
            <p className="font-display text-sm tracking-[0.35em] text-primary">FILM LAUNCH</p>
            <p className="text-[10px] tracking-[0.45em] text-muted-foreground">AWARENESS CAMPAIGN</p>
          </div>
        </div>
        <img
          src={hero}
          alt="Star Wars"
          className="relative w-full max-w-4xl object-contain drop-shadow-[0_0_28px_rgba(255,232,31,0.3)]"
        />
        <a href="#brief" aria-label="Scroll to engage" className="group absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3">
          <div className="flex items-end gap-[5px]" aria-hidden="true">
            {Array.from({ length: 16 }).map((_, i) => (
              <span
                key={i}
                className="animate-seg h-3 w-[6px] skew-x-[-14deg] bg-primary"
                style={{ animationDelay: `${(i % 8) * 0.14 + Math.floor(i / 8) * 0.03}s` }}
              />
            ))}
          </div>
          <p className="font-display text-sm tracking-[0.35em] text-primary">
            <span className="group-hover:glow-primary">SCROLL TO ENGAGE</span>
          </p>
          <span className="animate-game-blink text-xs text-primary" aria-hidden="true" style={{ animationDelay: '0.5s' }}>▼</span>
        </a>
      </section>

      <section className="relative h-[80vh] overflow-hidden [perspective:400px]">
        <div className="animate-crawl absolute inset-x-0 mx-auto max-w-2xl text-center font-display text-2xl font-bold leading-relaxed text-primary md:text-4xl">
          <p className="mb-8">Episode I</p>
          <p className="mb-8 text-5xl">SUPER FAN FRENZY</p>
          <p>These days niche culture is en vogue and super fans set the tone. To promote the expansion of the world's biggest franchise, we will mobilize the Star Warriors and create a groundswell around the film's release…</p>
        </div>
      </section>

      <section id="brief" className="grid min-h-screen items-center gap-10 px-6 md:grid-cols-2 md:px-16">
        <Reveal><img src={droids.url} alt="R2-D2 and C-3PO" className="w-full rounded" /></Reveal>
        <Reveal className="space-y-6">
          <Kicker>01 — The Brief</Kicker>
          <p className="text-3xl leading-snug md:text-4xl">Drive awareness and excitement around the release of Disney's upcoming <span className="text-primary">Star Wars</span> movie.</p>
        </Reveal>
      </section>

      <section className="px-6 py-32 md:px-16">
        <Reveal className="mb-16 max-w-2xl space-y-6">
          <Kicker>02 — Cultural Context</Kicker>
          <H2>Fandoms Rule</H2>
          <p className="text-lg text-muted-foreground">These days niche culture is en vogue and super fans set the tone. At its core fandom is about enjoying your thing, with people who love it as much as you do.</p>
        </Reveal>
        <div className="grid gap-12 md:grid-cols-3">
          <Stat value={80} label="of people say fandoms bring them joy." />
          <Stat value={50} label="of fans say they think about or engage in their community every day." />
          <Stat value={61} label="introduce non-fanatics in their lives to their obsession." />
        </div>
        <p className="mt-10 text-xs text-muted-foreground">Source: Kearney Consumer Institute</p>
      </section>

      <section className="grid min-h-screen items-center gap-10 px-6 md:grid-cols-2 md:px-16">
        <Reveal><img src={poster.url} alt="Star Wars poster" className="mx-auto max-h-[85vh] rounded" /></Reveal>
        <Reveal className="space-y-6">
          <H2>Super Fans<br /><span className="text-primary">Show Up!!</span></H2>
          <p className="text-lg text-muted-foreground">Super fans invest in the things they love with their time, money, platforms, and social capital.</p>
          <p className="font-display text-xl">If you build it, they will show up and show out.</p>
        </Reveal>
      </section>

      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <Reveal className="space-y-6">
          <p className="text-2xl text-muted-foreground md:text-3xl">So to promote the expansion of the world's</p>
          <p className="font-display text-5xl font-black uppercase text-primary glow-primary md:text-8xl">Biggest Franchise</p>
          <p className="font-display text-2xl tracking-[0.3em]">WE'LL CREATE A…</p>
        </Reveal>
      </section>

      <section className="grid gap-16 px-6 py-32 md:grid-cols-2 md:px-16">
        <Reveal className="space-y-6">
          <H2>Super Fan <span className="text-saber">Frenzy!</span></H2>
          <p className="text-lg">Activating the longest-standing, most engaged, and unapologetically obsessed fans with immersive <em>url</em> and <em>irl</em> experiences.</p>
          <Kicker>In a nutshell</Kicker>
          <p className="text-muted-foreground">We'll lean full <em className="font-bold text-primary">force</em> into mobilizing current Star Warriors, in order to penetrate culture and create a groundswell around the film's release. Because when Star Wars fans get excited, everyone else has no choice but to get aboard the mothership.</p>
        </Reveal>
        <div className="relative space-y-12 border-l-2 border-saber pl-10">
          {[["Launch with a bang 🚀", t1.url], ["Start some buzz", t2.url], ["Keep 'em talking", t3.url]].map(([l, src]) => (
            <Reveal key={l} className="relative">
              <span className="absolute -left-[49px] top-2 h-4 w-4 rounded-full bg-saber saber-glow" />
              <p className="mb-3 font-display text-sm uppercase tracking-widest">{l}</p>
              <img src={src} alt={l} className="w-full max-w-sm rounded transition-transform duration-500 hover:scale-105" />
            </Reveal>
          ))}
        </div>
      </section>

      <Phases />



      <footer className="py-24 text-center">
        <p className="font-display text-3xl font-bold uppercase text-primary glow-primary">May the fans be with you.</p>
        <a href="#" className="mt-6 inline-block text-sm tracking-widest text-muted-foreground hover:text-primary">BACK TO HYPERSPACE ↑</a>
      </footer>
    </main>
  );
}
