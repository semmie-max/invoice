import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Briefcase,
  BarChart3,
  LineChart as LineChartIcon,
  Users,
  Settings,
  LifeBuoy,
  Bell,
  Settings2,
  Search,
  ChevronDown,
  ChevronRight,
  BookOpen,
  ShoppingBag,
  Cpu,
  CloudSun,
  DollarSign,
  Wallet,
  Pencil,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { enablePushNotifications } from './pushNotifications';
// ---------------- mock data (matches the mockup) ----------------

const nav = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Briefcase, label: "Portfolio" },
  { icon: BarChart3, label: "Analysis" },
  { icon: LineChartIcon, label: "Market" },
  { icon: Users, label: "Community" },
];

const watchlist = [
  {
  logo: `${import.meta.env.BASE_URL}spotify.png`,
  name: "Spotify",
  ticker: "Audio Streaming",
  price: "$1,770.3",
  pct: "+6.32%",
  color: "#1DB954",
},
  {
  icon: CloudSun,
  name: "Weather",
  ticker: "Today · Ado Ekiti",
  price: "28°C",
  pct: "72% Humidity",
  color: "#60A5FA",
},
  {
  icon: BookOpen,
  name: "Learnin’",
  course: "---",
  book: "Engineering Mathematics(III)",
  status: "Currently Reading",
  color: "#A78BFA",
},
  {
  icon: Pencil,
  name: "Scratchpad",
  ticker: "Got a thought? Drop it here",
  color: "#A78BFA",
},
];

const holdings = [
  {
  icon: DollarSign,
  ticker: "Cash Balance",
  value: "$4,280.50",
  change: "Available"
},
  {
  icon: ShoppingBag,
  ticker: "Unrealized P&L",
  units: 12,
  value: "$12.31",
  change: "+0.70%"
},
  {
  icon: Wallet,
  ticker: "Monthly Income",
  value: "$2,450.00",
  change: "This month"
},
  {
  icon: Cpu,
  ticker: "Total Return",
  units: 16,
  value: "$1,721.30",
  change: "+12.31 (0.7%)"
},
];

const performance = [
  { m: "Jan", v: 178 }, { m: "Feb", v: 132 }, { m: "Mar", v: 128 },
  { m: "Apr", v: 148 }, { m: "May", v: 141 }, { m: "Jun", v: 165 },
  { m: "Jul", v: 152 }, { m: "Aug", v: 148 }, { m: "Sep", v: 118 },
  { m: "Oct", v: 108 }, { m: "Nov", v: 96 },  { m: "Dec", v: 88 },
];

const ranges = ["1D", "1W", "1M", "6M", "1Y"];

export default function DashboardClone() {
  const [tab, setTab] = useState("Market");
const [watchFilter, setWatchFilter] = useState("Most Viewed");
const [range, setRange] = useState("1Y");
const [activeIndex, setActiveIndex] = useState(5);
  const [showBalance, setShowBalance] = useState(true);
  const navigate = useNavigate();

  const [nowPlaying, setNowPlaying] = useState(null);

  useEffect(() => {
    const LASTFM_API_KEY = "248965a0017aa3f8ee2ab5f4440785e8";
    const LASTFM_USER = "Rv3my";

    async function fetchNowPlaying() {
      try {
        const res = await fetch(
          `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USER}&api_key=${LASTFM_API_KEY}&format=json&limit=1`
        );
        const data = await res.json();
        const track = data?.recenttracks?.track?.[0];
        if (track) {
          setNowPlaying({
            name: track.name,
            artist: track.artist?.["#text"] || "",
            playing: track["@attr"]?.nowplaying === "true",
            image: track.image?.[2]?.["#text"] || null,
          });
        }
      } catch (err) {
        console.error("Last.fm fetch failed:", err);
      }
    }

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 20000);
    return () => clearInterval(interval);
  }, []);
  

  const maxV = 200;
  const topMarginPct = 8;
  const bottomMarginPct = 14;
  const plotHPct = 100 - topMarginPct - bottomMarginPct;

  const point = performance[activeIndex];
  const leftPct = (activeIndex / (performance.length - 1)) * 100;
  const topPct = topMarginPct + (1 - point.v / maxV) * plotHPct;
  const pctChange = (((point.v - performance[0].v) / performance[0].v) * 100).toFixed(2);

  return (
    <div
      className="h-screen w-full overflow-hidden text-white"
      style={{ background: "#08080a", fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
    >
      <div className="mx-auto flex h-full max-w-[1500px]">
        {/* ---------------- Sidebar ---------------- */}
        <aside className="hidden h-full w-[260px] shrink-0 flex-col justify-between border-r border-white/[0.06] px-5 py-6 md:flex">
          <div>
            <div className="mb-10 flex items-center gap-2.5 px-1">
              <div className="grid h-8 w-8 place-items-center rounded-lg border border-white/20 text-[15px] font-bold">
                H
              </div>
              <span className="text-[16px] font-semibold tracking-tight">remomhe.</span>
            </div>

            <nav className="space-y-1.5">
              {nav.map((item) => (
                <button
                  key={item.label}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-[14px] transition-colors ${
                    item.active
                      ? "bg-gradient-to-r from-white to-white/80 font-medium text-black shadow-lg shadow-black/20"
                      : "text-white/45 hover:bg-white/5 hover:text-white/80"
                  }`}
                >
                  <item.icon size={18} strokeWidth={1.8} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="space-y-1.5">
            <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-[14px] text-white/45 hover:bg-white/5 hover:text-white/80">
              <Settings size={18} strokeWidth={1.8} /> Settings
            </button>
            <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-[14px] text-white/45 hover:bg-white/5 hover:text-white/80">
              <LifeBuoy size={18} strokeWidth={1.8} /> Support
            </button>
          </div>
        </aside>

        {/* ---------------- Main ---------------- */}
        <main className="flex h-full min-h-0 flex-1 flex-col overflow-y-auto px-6 py-5 sm:px-8">
          {/* header */}
          <div className="mb-5 shrink-0 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-[28px] font-semibold tracking-tight">
                Welcome, <span className="text-white">remomhe.</span>
              </h1>
              <p className="mt-1 text-[13px] text-white/40">Work hard, bill smart, get paid.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
  onClick={() => enablePushNotifications()}
  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/60 hover:text-white"
>
  <Bell size={16} />
</button>
              <button className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/60 hover:text-white">
                <Settings2 size={16} />
              </button>
              <div className="flex items-center gap-2.5 pl-1">
                <img src={`${import.meta.env.BASE_URL}avatar.jpg`} alt="Profile" className="h-10 w-10 rounded-full object-cover" />
                <div className="hidden sm:block">
                  <div className="text-[13px] font-medium leading-tight">remomhe.</div>
                  <div className="text-[11px] leading-tight text-white/40">aremomheremy@gmail.com</div>
                </div>
              </div>
            </div>
          </div>

          {/* tabs + search */}
          <div className="mb-4 shrink-0 flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2 rounded-full border border-white/[0.06] p-1.5">
              {["Market", "Wallet", "Tools"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`rounded-full px-5 py-2 text-[13px] font-medium transition-colors ${
                    tab === t
                      ? "bg-gradient-to-r from-white to-white/80 text-black"
                      : "text-white/50 hover:text-white/80"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/[0.08] px-4 py-2.5 text-[13px] text-white/35">
              <Search size={14} />
              Ask remy anything
            </div>
          </div>

          {/* grid row + chart, stacked, no longer squeezed to fit viewport */}
          <div className="flex flex-col gap-4">
          {/* grid: total/promo | watchlist | portfolio */}
          <div className="shrink-0 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.05fr_1.1fr]">
            {/* left column */}
            <div className="space-y-5">
              <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-[#14101a] p-6">
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full opacity-40 blur-3xl"
                  style={{ background: "radial-gradient(circle, #ffffff, transparent 70%)" }}
                />
                <div className="relative mb-8 flex items-center justify-between">
  <span className="text-[15px] text-white/60">My Haul</span>

  <div className="flex items-center gap-2">
    {/* Eye toggle */}
    <button
      onClick={() => setShowBalance(!showBalance)}
      className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-white/50 transition hover:bg-white/5 hover:text-white"
      aria-label={showBalance ? "Hide balance" : "Show balance"}
    >
      {showBalance ? (
        /* Eye open */
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      ) : (
        /* Eye closed */
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 3l18 18" />
          <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
          <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c6 0 9.5 6 9.5 6a17 17 0 0 1-3.2 3.8" />
          <path d="M6.2 6.2C3.8 7.8 2.5 10 2.5 10s3.5 6 9.5 6c1.3 0 2.5-.3 3.6-.7" />
        </svg>
      )}
    </button>

    {/* Time period */}
    <button className="flex items-center gap-1 rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/60">
      6M <ChevronDown size={12} />
    </button>
  </div>
</div>
<div className="relative text-[34px] font-semibold tracking-tight"> 
  {showBalance ? "₦ 1,000.11" : "₦ ••••••"} 
</div>
</div>

              <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-[#100c14] px-6 py-8 text-center">
                <div
                  className="pointer-events-none absolute bottom-0 left-1/2 h-40 w-64 -translate-x-1/2 rounded-full opacity-30 blur-3xl"
                  style={{ background: "radial-gradient(ellipse, #ffffff, transparent 70%)" }}
                />
                <h3 className="relative text-[19px] font-semibold">Bill ’Em</h3>
                <p className="relative mx-auto mt-2 max-w-[240px] text-[13px] leading-relaxed text-white/45">
                  You are doing the work. Now send the bill. Let the payment roll in.
                </p>
                <button
  onClick={() => navigate("/create-invoice")}
  className="relative mt-5 rounded-full bg-gradient-to-r from-white to-white/80 px-6 py-2.5 text-[13px] font-medium text-black"
>
  Create Invoice
</button>
              </div>
            </div>

            {/* watchlist column */}
            <div className="rounded-3xl border border-white/[0.06] bg-[#100c14] p-6">
              <h3 className="mb-4 text-[19px] font-semibold">Watchlist</h3>
              <div className="mb-5 flex gap-2">
                {["Most Viewed", "Gain", "Lose"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setWatchFilter(f)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                      watchFilter === f
                        ? "bg-gradient-to-r from-white to-white/80 text-black"
                        : "border border-white/10 text-white/45 hover:text-white/70"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="space-y-1">
                {watchlist.map((s) => {
                  const isSpotify = s.name === "Spotify";
                  return (
                  <div key={s.name} className="flex items-center justify-between rounded-xl px-1.5 py-3 hover:bg-white/[0.03]">
                    <div className="flex items-center gap-3">
                      <div
                        className="grid h-9 w-9 place-items-center rounded-full overflow-hidden"
                        style={{ background: `${s.color}22` }}
                      >
                        {s.logo ? (
                          <img src={s.logo} alt={s.name} className="h-4 w-4 object-contain" />
                        ) : (
                          <s.icon size={16} color={s.color} strokeWidth={2} />
                        )}
                      </div>
                      <div>
  <div className="text-[14px] font-medium">
    {isSpotify ? (nowPlaying?.name || "Loading…") : s.name}
  </div>

  <div className="text-[11px] text-white/35">
    {isSpotify
      ? (nowPlaying?.artist || "Spotify")
      : s.name === "Learnin’"
        ? s.course
        : s.ticker}
  </div>

  {s.name === "Learnin’" && (
    <div className="text-[11px] text-purple-300">
      {s.book}
    </div>
  )}
</div>
                    </div>
                    <div className="text-right">
                      {isSpotify ? (
                        <div className="text-[11px] font-medium text-emerald-400">
                          {nowPlaying ? (nowPlaying.playing ? "● Sound Check" : "Last played") : ""}
                        </div>
                      ) : (
                        <>
                          <div className="text-[14px] font-medium tabular-nums">{s.price}</div>
                          <div className="text-[11px] font-medium text-emerald-400">{s.pct}</div>
                        </>
                      )}
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>

            {/* portfolio column */}
            <div className="rounded-3xl border border-white/[0.06] bg-[#100c14] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[19px] font-semibold">My Portfolio</h3>
                <div className="flex items-center gap-2">
                  <button className="rounded-full border border-white/10 px-3.5 py-1.5 text-xs text-white/60 hover:text-white">
                    breakdown
                  </button>
                  <button className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-white/60">
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {holdings.map((h) => (
                  <div key={h.ticker} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <div className="text-[16px] font-semibold tabular-nums">{h.value}</div>
                    <div className="mt-0.5 text-[11px] font-medium text-emerald-400">{h.change}</div>
                    <div className="mt-4 flex items-center gap-2">
                      <h.icon size={16} strokeWidth={1.8} className="text-white/70" />
                      <span className="text-[13px] font-medium">{h.ticker}</span>
                    </div>
                    {h.units && (
  <div className="mt-1 text-[11px] text-white/40">
    Units <span className="font-medium text-white/70">{h.units}</span>
  </div>
)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* performance chart */}
          <div className="mb-6 flex flex-col rounded-3xl border border-white/[0.06] bg-[#100c14] p-5">
            <div className="mb-2 shrink-0 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-[19px] font-semibold">Portfolio Performance</h3>
              <div className="flex gap-1.5 rounded-full border border-white/[0.06] p-1">
                {ranges.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                      range === r
                        ? "bg-gradient-to-r from-white to-white/80 text-black"
                        : "text-white/40 hover:text-white/70"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div
              className="relative w-full"
              style={{ height: 380 }}
              onMouseLeave={() => setActiveIndex(5)}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={performance}
                  margin={{ top: 10, right: 14, left: 0, bottom: 0 }}
                  onMouseMove={(state) => {
                    if (state && state.isTooltipActive && state.activeTooltipIndex != null) {
                      setActiveIndex(state.activeTooltipIndex);
                    }
                  }}
                >
                  <defs>
                    <linearGradient id="perfFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#c084fc" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#c084fc" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#ffffff0a" vertical={false} />
                  <XAxis
                    dataKey="m"
                    stroke="#ffffff40"
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis
                    domain={[0, maxV]}
                    ticks={[10, 50, 100, 150, 200]}
                    stroke="#ffffff40"
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}k`}
                  />
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="#c084fc"
                    strokeWidth={2.5}
                    fill="url(#perfFill)"
                    dot={false}
                    activeDot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>

              {/* dashed guide line + dot + floating annotation, mirrors the mockup's callout */}
              <div
                className="pointer-events-none absolute w-px border-l border-dashed border-white/25"
                style={{ left: `${leftPct}%`, top: `${topPct}%`, bottom: `${bottomMarginPct}%` }}
              />
              <div
                className="pointer-events-none absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#100c14] bg-fuchsia-400 shadow-[0_0_0_5px_rgba(192,132,252,0.25)]"
                style={{ left: `${leftPct}%`, top: `${topPct}%` }}
              />
              <div
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-[calc(100%+14px)] whitespace-nowrap rounded-xl border border-white/10 bg-[#1a1620] px-3.5 py-2.5 shadow-2xl"
                style={{ left: `${leftPct}%`, top: `${topPct}%` }}
              >
                <div className="text-[11px] text-white/45">1st {point.m} 2025</div>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-[15px] font-semibold tabular-nums">
                    $ {(point.v * 100).toLocaleString()}
                  </span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                      pctChange >= 0 ? "text-emerald-400 bg-emerald-400/10" : "text-rose-400 bg-rose-400/10"
                    }`}                  >
                    {pctChange >= 0 ? "+" : ""}
                    {pctChange}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          </div>
        </main>
      </div>
    </div>
  );
}