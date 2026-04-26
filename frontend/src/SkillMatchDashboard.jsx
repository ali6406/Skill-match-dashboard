import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList,
  RadialBarChart, RadialBar, Legend
} from "recharts";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const USERS = [
  { id: 1, name: "Alex Rivera",  initials: "AR", color: "#6366f1" },
  { id: 2, name: "Jordan Lee",   initials: "JL", color: "#10b981" },
  { id: 3, name: "Sam Chen",     initials: "SC", color: "#f59e0b" },
  { id: 4, name: "Maya Patel",   initials: "MP", color: "#ec4899" },
  { id: 5, name: "Chris Wu",     initials: "CW", color: "#3b82f6" },
];

const USER_SKILLS = [
  { userId: 1, name: "Alex Rivera",  skill: "React",           level: "Expert",       pct: 95 },
  { userId: 1, name: "Alex Rivera",  skill: "TypeScript",      level: "Advanced",     pct: 82 },
  { userId: 1, name: "Alex Rivera",  skill: "Node.js",         level: "Intermediate", pct: 65 },
  { userId: 1, name: "Alex Rivera",  skill: "Python",          level: "Beginner",     pct: 35 },
  { userId: 2, name: "Jordan Lee",   skill: "Python",          level: "Expert",       pct: 92 },
  { userId: 2, name: "Jordan Lee",   skill: "Machine Learning",level: "Advanced",     pct: 80 },
  { userId: 2, name: "Jordan Lee",   skill: "SQL",             level: "Advanced",     pct: 78 },
  { userId: 2, name: "Jordan Lee",   skill: "TensorFlow",      level: "Intermediate", pct: 60 },
  { userId: 3, name: "Sam Chen",     skill: "UI/UX Design",    level: "Expert",       pct: 97 },
  { userId: 3, name: "Sam Chen",     skill: "Figma",           level: "Expert",       pct: 94 },
  { userId: 3, name: "Sam Chen",     skill: "React",           level: "Intermediate", pct: 58 },
  { userId: 4, name: "Maya Patel",   skill: "AWS",             level: "Advanced",     pct: 85 },
  { userId: 4, name: "Maya Patel",   skill: "DevOps",          level: "Advanced",     pct: 80 },
  { userId: 4, name: "Maya Patel",   skill: "Kubernetes",      level: "Intermediate", pct: 67 },
  { userId: 5, name: "Chris Wu",     skill: "SQL",             level: "Expert",       pct: 90 },
  { userId: 5, name: "Chris Wu",     skill: "Data Analysis",   level: "Advanced",     pct: 83 },
  { userId: 5, name: "Chris Wu",     skill: "Tableau",         level: "Intermediate", pct: 62 },
];

const MATCH_BY_USER = {
  1: [
    { title: "Senior Frontend Engineer", pct: 94 },
    { title: "React Tech Lead",          pct: 91 },
    { title: "Full Stack Developer",     pct: 78 },
    { title: "Product Engineer",         pct: 65 },
    { title: "DevOps Engineer",          pct: 28 },
  ],
  2: [
    { title: "ML Engineer",             pct: 96 },
    { title: "AI Research Lead",        pct: 82 },
    { title: "Data Scientist",          pct: 88 },
    { title: "Python Backend Dev",      pct: 74 },
    { title: "Senior Frontend Engineer",pct: 20 },
  ],
  3: [
    { title: "Senior Product Designer", pct: 98 },
    { title: "UX Lead",                 pct: 92 },
    { title: "Product Engineer",        pct: 55 },
    { title: "Full Stack Developer",    pct: 32 },
  ],
  4: [
    { title: "DevOps Engineer",         pct: 95 },
    { title: "Cloud Architect",         pct: 89 },
    { title: "Site Reliability Eng.",   pct: 84 },
    { title: "Backend Developer",       pct: 42 },
  ],
  5: [
    { title: "Data Analyst",            pct: 97 },
    { title: "Business Intelligence",   pct: 85 },
    { title: "Data Scientist",          pct: 68 },
    { title: "ML Engineer",             pct: 38 },
  ],
};

const APPLICATIONS = [
  { title: "Senior Frontend Engineer", total: 24 },
  { title: "ML Engineer",              total: 31 },
  { title: "Senior Product Designer",  total: 18 },
  { title: "DevOps Engineer",          total: 27 },
  { title: "Data Analyst",             total: 22 },
  { title: "Full Stack Developer",     total: 35 },
  { title: "Cloud Architect",          total: 14 },
  { title: "React Tech Lead",          total: 19 },
];

const SKILL_DEMAND = [
  { skill: "React",           count: 45 },
  { skill: "Python",          count: 42 },
  { skill: "SQL",             count: 38 },
  { skill: "TypeScript",      count: 34 },
  { skill: "AWS",             count: 30 },
  { skill: "Node.js",         count: 28 },
  { skill: "Machine Learning",count: 26 },
  { skill: "DevOps",          count: 22 },
  { skill: "Kubernetes",      count: 18 },
  { skill: "Figma",           count: 14 },
];

const ACCEPTED_APPS = [
  { name: "Alex Rivera", initials: "AR", color: "#6366f1", title: "React Tech Lead",          status: "Accepted" },
  { name: "Jordan Lee",  initials: "JL", color: "#10b981", title: "ML Engineer",               status: "Accepted" },
  { name: "Sam Chen",    initials: "SC", color: "#f59e0b", title: "Senior Product Designer",   status: "Accepted" },
  { name: "Maya Patel",  initials: "MP", color: "#ec4899", title: "Cloud Architect",           status: "Accepted" },
  { name: "Chris Wu",    initials: "CW", color: "#3b82f6", title: "Data Analyst",              status: "Accepted" },
  { name: "Alex Rivera", initials: "AR", color: "#6366f1", title: "Senior Frontend Engineer",  status: "Pending"  },
  { name: "Jordan Lee",  initials: "JL", color: "#10b981", title: "Data Scientist",            status: "Pending"  },
  { name: "Sam Chen",    initials: "SC", color: "#f59e0b", title: "UX Lead",                   status: "Rejected" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const profColor = (pct) => {
  if (pct >= 85) return "#10b981";
  if (pct >= 65) return "#6366f1";
  if (pct >= 40) return "#f59e0b";
  return "#ec4899";
};

const matchColor = (pct) => {
  if (pct >= 80) return "#10b981";
  if (pct >= 55) return "#6366f1";
  return "#f59e0b";
};

const BAR_COLORS = [
  "#6366f1","#818cf8","#8b5cf6","#a78bfa",
  "#6366f1","#7c3aed","#4f46e5","#4338ca",
];

// ─── STYLES ──────────────────────────────────────────────────────────────────

const css = {
  app: {
    display: "flex",
    minHeight: "100vh",
    background: "#080b14",
    fontFamily: "'DM Sans', 'Nunito', system-ui, sans-serif",
    color: "#e2e8f0",
  },

  /* Sidebar */
  sidebar: {
    width: 240,
    minWidth: 240,
    background: "linear-gradient(180deg,#0d1120 0%,#080b14 100%)",
    borderRight: "1px solid rgba(99,102,241,.12)",
    display: "flex",
    flexDirection: "column",
    position: "sticky",
    top: 0,
    height: "100vh",
    overflow: "hidden",
  },
  logo: {
    padding: "28px 24px 20px",
    borderBottom: "1px solid rgba(99,102,241,.1)",
  },
  logoMark: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "linear-gradient(135deg,#6366f1,#a855f7)",
    fontSize: 18,
    marginBottom: 10,
  },
  logoTitle: {
    fontSize: 16,
    fontWeight: 700,
    background: "linear-gradient(135deg,#818cf8,#c084fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "-0.3px",
  },
  logoSub: {
    fontSize: 11,
    color: "#4b5563",
    marginTop: 2,
    letterSpacing: "0.04em",
  },
  nav: { padding: "20px 14px", flex: 1 },
  navSection: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "#374151",
    textTransform: "uppercase",
    padding: "0 8px",
    marginBottom: 8,
  },
  navItemBase: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 12px",
    borderRadius: 10,
    cursor: "pointer",
    marginBottom: 2,
    fontSize: 13.5,
    color: "#64748b",
    transition: "all .2s",
    position: "relative",
    userSelect: "none",
  },
  navItemActive: {
    background: "linear-gradient(135deg,rgba(99,102,241,.18),rgba(168,85,247,.1))",
    color: "#a5b4fc",
    fontWeight: 600,
  },
  navAccent: {
    position: "absolute",
    left: 0,
    top: "50%",
    transform: "translateY(-50%)",
    width: 3,
    height: "55%",
    background: "linear-gradient(180deg,#818cf8,#c084fc)",
    borderRadius: "0 2px 2px 0",
  },
  sidebarFooter: {
    padding: "16px 24px",
    borderTop: "1px solid rgba(255,255,255,.04)",
    fontSize: 11,
    color: "#374151",
  },

  /* Main */
  main: { flex: 1, overflow: "auto", background: "#080b14" },
  topbar: {
    padding: "24px 32px 0",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  pageTitle: { fontSize: 22, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.3px" },
  pageSub: { fontSize: 13, color: "#475569", marginTop: 4 },
  content: { padding: "20px 32px 48px" },

  /* Search */
  searchWrap: { position: "relative" },
  searchInput: {
    background: "rgba(255,255,255,.04)",
    border: "1px solid rgba(99,102,241,.18)",
    borderRadius: 10,
    padding: "8px 14px 8px 36px",
    color: "#e2e8f0",
    fontSize: 13,
    width: 230,
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color .2s, background .2s",
  },
  searchIcon: {
    position: "absolute",
    left: 11,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#475569",
    fontSize: 15,
    pointerEvents: "none",
  },

  /* Cards */
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: 14,
    marginBottom: 24,
  },
  statCard: {
    background: "linear-gradient(135deg,rgba(255,255,255,.04),rgba(255,255,255,.02))",
    border: "1px solid rgba(255,255,255,.07)",
    borderRadius: 16,
    padding: "20px 22px",
    position: "relative",
    overflow: "hidden",
    cursor: "default",
    transition: "transform .2s, border-color .2s",
  },
  card: {
    background: "linear-gradient(135deg,rgba(255,255,255,.04),rgba(255,255,255,.02))",
    border: "1px solid rgba(255,255,255,.07)",
    borderRadius: 16,
    padding: "20px 22px",
    transition: "border-color .2s",
  },

  /* Section header */
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 14, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.01em" },

  select: {
    background: "rgba(255,255,255,.05)",
    border: "1px solid rgba(99,102,241,.2)",
    borderRadius: 8,
    padding: "6px 12px",
    color: "#e2e8f0",
    fontSize: 12,
    cursor: "pointer",
    outline: "none",
    fontFamily: "inherit",
  },

  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },

  /* Skill row */
  skillRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "11px 0",
    borderBottom: "1px solid rgba(255,255,255,.04)",
  },

  /* Opportunity card */
  oppCard: {
    background: "linear-gradient(135deg,rgba(255,255,255,.04),rgba(255,255,255,.015))",
    border: "1px solid rgba(255,255,255,.07)",
    borderRadius: 12,
    padding: "14px 18px",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    gap: 16,
    cursor: "default",
    transition: "border-color .2s, transform .2s",
  },

  /* Badge */
  badge: { display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 },

  /* Avatar */
  avatar: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 700,
    flexShrink: 0,
  },

  filterBar: { display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" },
  filterBtn: {
    padding: "5px 14px",
    borderRadius: 20,
    fontSize: 12,
    cursor: "pointer",
    border: "1px solid rgba(255,255,255,.08)",
    background: "transparent",
    color: "#64748b",
    transition: "all .2s",
    fontFamily: "inherit",
  },
  filterBtnActive: {
    background: "rgba(99,102,241,.18)",
    color: "#a5b4fc",
    borderColor: "rgba(99,102,241,.35)",
  },
};

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "dashboard",    icon: "⬡", label: "Dashboard"     },
  { id: "skills",       icon: "◎", label: "Skills"        },
  { id: "opportunities",icon: "◈", label: "Opportunities" },
  { id: "analytics",   icon: "▦", label: "Analytics"     },
  { id: "applications",icon: "✦", label: "Applications"  },
];

function Sidebar({ page, setPage }) {
  return (
    <div style={css.sidebar}>
      <div style={css.logo}>
        <div style={css.logoMark}>⬡</div>
        <div style={css.logoTitle}>SkillMatch</div>
        <div style={css.logoSub}>Talent Intelligence Platform</div>
      </div>
      <div style={css.nav}>
        <div style={css.navSection}>Navigation</div>
        {NAV_ITEMS.map((n) => {
          const active = page === n.id;
          return (
            <div
              key={n.id}
              style={{ ...css.navItemBase, ...(active ? css.navItemActive : {}) }}
              onClick={() => setPage(n.id)}
              onMouseEnter={(e) => {
                if (!active) { e.currentTarget.style.background = "rgba(99,102,241,.08)"; e.currentTarget.style.color = "#94a3b8"; }
              }}
              onMouseLeave={(e) => {
                if (!active) { e.currentTarget.style.background = ""; e.currentTarget.style.color = "#64748b"; }
              }}
            >
              {active && <div style={css.navAccent} />}
              <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>{n.icon}</span>
              <span>{n.label}</span>
            </div>
          );
        })}
      </div>
      <div style={css.sidebarFooter}>v1.0 · Demo Build</div>
    </div>
  );
}

function Avatar({ initials, color, size = 34 }) {
  return (
    <div style={{ ...css.avatar, width: size, height: size, background: color + "22", color, fontSize: size * 0.33 }}>
      {initials}
    </div>
  );
}

function ProgressBar({ pct, color, height = 5 }) {
  return (
    <div style={{ height, background: "rgba(255,255,255,.08)", borderRadius: height, overflow: "hidden", flex: 1 }}>
      <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${color},${color}99)`, borderRadius: height, transition: "width .6s ease" }} />
    </div>
  );
}

function Badge({ status }) {
  const cfg = {
    Accepted: { bg: "rgba(16,185,129,.12)", color: "#10b981", border: "rgba(16,185,129,.22)", icon: "✓" },
    Pending:  { bg: "rgba(245,158,11,.10)", color: "#f59e0b", border: "rgba(245,158,11,.22)", icon: "⏳" },
    Rejected: { bg: "rgba(239,68,68,.10)",  color: "#ef4444", border: "rgba(239,68,68,.22)",  icon: "✗" },
  }[status] || {};
  return (
    <span style={{ ...css.badge, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
      {cfg.icon} {status}
    </span>
  );
}

function StatCard({ icon, value, label, change, accent }) {
  return (
    <div
      style={css.statCard}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = "rgba(99,102,241,.3)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "rgba(255,255,255,.07)"; }}
    >
      <div style={{ position: "absolute", top: -16, right: -16, width: 72, height: 72, borderRadius: "50%", background: accent, opacity: 0.1 }} />
      <div style={{ fontSize: 22, marginBottom: 12, color: accent }}>{icon}</div>
      <div style={{ fontSize: 30, fontWeight: 700, color: "#f1f5f9", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>{label}</div>
      <div style={{ fontSize: 11, color: "#10b981", marginTop: 4 }}>{change}</div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label, unit = "" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1e2035", border: "1px solid rgba(99,102,241,.3)", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#e2e8f0" }}>
      <div style={{ color: "#94a3b8", marginBottom: 4 }}>{label || payload[0]?.payload?.skill || payload[0]?.payload?.title}</div>
      <div style={{ fontWeight: 600, color: "#a5b4fc" }}>{payload[0]?.value}{unit}</div>
    </div>
  );
};

// ─── PAGES ───────────────────────────────────────────────────────────────────

function DashboardPage() {
  const user = USERS[0];
  const topMatches = MATCH_BY_USER[1].slice(0, 4);
  const accepted = ACCEPTED_APPS.filter((a) => a.status === "Accepted");

  return (
    <div>
      <div style={css.statsGrid}>
        <StatCard icon="◈" value="5"  label="Total Users"        change="+2 this week"   accent="#6366f1" />
        <StatCard icon="◉" value="8"  label="Open Opportunities" change="+3 active"       accent="#10b981" />
        <StatCard icon="◎" value="17" label="Skills Tracked"     change="10 in demand"    accent="#f59e0b" />
        <StatCard icon="✦" value="5"  label="Accepted"           change="62% success"     accent="#ec4899" />
      </div>

      <div style={css.twoCol}>
        {/* Top matches */}
        <div>
          <div style={css.sectionHeader}>
            <span style={css.sectionTitle}>Top Matches — Alex Rivera</span>
          </div>
          {topMatches.map((o, i) => (
            <div
              key={i}
              style={css.oppCard}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,.3)"; e.currentTarget.style.transform = "translateX(3px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,.07)"; e.currentTarget.style.transform = ""; }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "#f1f5f9", marginBottom: 8 }}>{o.title}</div>
                <ProgressBar pct={o.pct} color={matchColor(o.pct)} />
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: matchColor(o.pct), minWidth: 50, textAlign: "right" }}>{o.pct}%</div>
            </div>
          ))}
        </div>

        {/* Accepted */}
        <div>
          <div style={css.sectionHeader}>
            <span style={css.sectionTitle}>Recently Accepted</span>
          </div>
          <div style={css.card}>
            {accepted.map((a, i) => (
              <div key={i} style={{ ...css.skillRow, ...(i === accepted.length - 1 ? { borderBottom: "none" } : {}) }}>
                <Avatar initials={a.initials} color={a.color} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "#f1f5f9" }}>{a.name}</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{a.title}</div>
                </div>
                <Badge status="Accepted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SkillsPage({ search }) {
  const [filter, setFilter] = useState("All");
  const levels = ["All", "Expert", "Advanced", "Intermediate", "Beginner"];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return USER_SKILLS.filter(
      (s) =>
        (filter === "All" || s.level === filter) &&
        (s.skill.toLowerCase().includes(q) || s.name.toLowerCase().includes(q))
    );
  }, [search, filter]);

  return (
    <div>
      <div style={css.filterBar}>
        {levels.map((l) => (
          <button
            key={l}
            style={{ ...css.filterBtn, ...(filter === l ? css.filterBtnActive : {}) }}
            onClick={() => setFilter(l)}
          >
            {l}
          </button>
        ))}
      </div>
      <div style={css.card}>
        {filtered.length === 0 && <div style={{ color: "#4b5563", fontSize: 13, textAlign: "center", padding: 20 }}>No skills found.</div>}
        {filtered.map((s, i) => {
          const user = USERS.find((u) => u.id === s.userId);
          return (
            <div key={i} style={{ ...css.skillRow, ...(i === filtered.length - 1 ? { borderBottom: "none" } : {}) }}>
              <Avatar initials={user?.initials} color={user?.color} size={30} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{s.name}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{s.skill}</div>
              </div>
              <ProgressBar pct={s.pct} color={profColor(s.pct)} height={5} />
              <div style={{ fontSize: 11, color: profColor(s.pct), width: 80, textAlign: "right", flexShrink: 0 }}>{s.level}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OpportunitiesPage({ search }) {
  const [userId, setUserId] = useState(1);
  const [sort, setSort] = useState("desc");

  const opps = useMemo(() => {
    const q = search.toLowerCase();
    return [...(MATCH_BY_USER[userId] || [])]
      .filter((o) => o.title.toLowerCase().includes(q))
      .sort((a, b) => sort === "desc" ? b.pct - a.pct : a.pct - b.pct);
  }, [userId, sort, search]);

  return (
    <div>
      <div style={css.sectionHeader}>
        <span style={css.sectionTitle}>Opportunity match for selected user</span>
        <div style={{ display: "flex", gap: 8 }}>
          <select style={css.select} value={userId} onChange={(e) => setUserId(+e.target.value)}>
            {USERS.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
          <select style={css.select} value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="desc">Highest first</option>
            <option value="asc">Lowest first</option>
          </select>
        </div>
      </div>

      {opps.length === 0 && <div style={{ color: "#4b5563", fontSize: 13, textAlign: "center", padding: 24 }}>No opportunities found.</div>}
      {opps.map((o, i) => (
        <div
          key={i}
          style={css.oppCard}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,.3)"; e.currentTarget.style.transform = "translateX(3px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,.07)"; e.currentTarget.style.transform = ""; }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: matchColor(o.pct) + "18",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              color: matchColor(o.pct),
              flexShrink: 0,
            }}
          >
            {o.pct}%
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9", marginBottom: 8 }}>{o.title}</div>
            <ProgressBar pct={o.pct} color={matchColor(o.pct)} />
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: matchColor(o.pct), minWidth: 54, textAlign: "right" }}>{o.pct}<span style={{ fontSize: 13 }}>%</span></div>
        </div>
      ))}
    </div>
  );
}

function AnalyticsPage() {
  return (
    <div>
      <div style={css.sectionHeader}>
        <span style={css.sectionTitle}>Skill Demand — sorted by count</span>
      </div>
      <div style={{ ...css.card, marginBottom: 20 }}>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SKILL_DEMAND} layout="vertical" margin={{ top: 4, right: 48, left: 8, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#475569", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,.06)" }} tickLine={false} />
              <YAxis type="category" dataKey="skill" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} width={118} />
              <Tooltip content={<CustomTooltip unit=" roles" />} cursor={{ fill: "rgba(99,102,241,.06)" }} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {SKILL_DEMAND.map((_, idx) => (
                  <Cell key={idx} fill={`hsl(${235 + idx * 5},${72 - idx}%,${64 - idx}%)`} />
                ))}
                <LabelList dataKey="count" position="right" style={{ fill: "#64748b", fontSize: 11 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={css.sectionHeader}>
        <span style={css.sectionTitle}>Applications per Opportunity</span>
      </div>
      <div style={css.card}>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={APPLICATIONS} margin={{ top: 4, right: 16, left: -10, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" vertical={false} />
              <XAxis dataKey="title" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} interval={0} angle={-30} textAnchor="end" height={80} />
              <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip unit=" applicants" />} cursor={{ fill: "rgba(99,102,241,.06)" }} />
              <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                {APPLICATIONS.map((_, idx) => (
                  <Cell key={idx} fill={BAR_COLORS[idx % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function ApplicationsPage({ search }) {
  const [filter, setFilter] = useState("All");
  const statuses = ["All", "Accepted", "Pending", "Rejected"];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return ACCEPTED_APPS.filter(
      (a) =>
        (filter === "All" || a.status === filter) &&
        (a.name.toLowerCase().includes(q) || a.title.toLowerCase().includes(q))
    );
  }, [filter, search]);

  return (
    <div>
      <div style={css.filterBar}>
        {statuses.map((s) => (
          <button
            key={s}
            style={{ ...css.filterBtn, ...(filter === s ? css.filterBtnActive : {}) }}
            onClick={() => setFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>
      <div style={css.card}>
        {filtered.length === 0 && <div style={{ color: "#4b5563", fontSize: 13, textAlign: "center", padding: 20 }}>No applications found.</div>}
        {filtered.map((a, i) => (
          <div key={i} style={{ ...css.skillRow, ...(i === filtered.length - 1 ? { borderBottom: "none" } : {}) }}>
            <Avatar initials={a.initials} color={a.color} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "#f1f5f9" }}>{a.name}</div>
              <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>{a.title}</div>
            </div>
            <Badge status={a.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

const PAGE_META = {
  dashboard:     { title: "Dashboard",     sub: "Overview of your talent intelligence platform" },
  skills:        { title: "Skills",        sub: "Browse and filter user skill profiles"         },
  opportunities: { title: "Opportunities", sub: "Match users to open roles by compatibility"    },
  analytics:     { title: "Analytics",     sub: "Skill demand trends and application volumes"   },
  applications:  { title: "Applications",  sub: "Track and filter all application statuses"     },
};

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [search, setSearch] = useState("");
  const meta = PAGE_META[page];

  return (
    <div style={css.app}>
      <Sidebar page={page} setPage={setPage} />
      <div style={css.main}>
        <div style={css.topbar}>
          <div>
            <div style={css.pageTitle}>{meta.title}</div>
            <div style={css.pageSub}>{meta.sub}</div>
          </div>
          <div style={css.searchWrap}>
            <span style={css.searchIcon}>⌕</span>
            <input
              style={css.searchInput}
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={(e) => { e.target.style.borderColor = "rgba(99,102,241,.5)"; e.target.style.background = "rgba(99,102,241,.06)"; }}
              onBlur={(e)  => { e.target.style.borderColor = "rgba(99,102,241,.18)"; e.target.style.background = "rgba(255,255,255,.04)"; }}
            />
          </div>
        </div>

        <div style={css.content}>
          {page === "dashboard"     && <DashboardPage />}
          {page === "skills"        && <SkillsPage search={search} />}
          {page === "opportunities" && <OpportunitiesPage search={search} />}
          {page === "analytics"     && <AnalyticsPage />}
          {page === "applications"  && <ApplicationsPage search={search} />}
        </div>
      </div>
    </div>
  );
}
