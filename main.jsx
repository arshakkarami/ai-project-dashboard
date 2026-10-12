import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bot,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Filter,
  LayoutDashboard,
  ListChecks,
  Search,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import "./styles.css";

const projects = [
  {
    id: 1,
    name: "Churn Predictor",
    owner: "Growth",
    health: "On track",
    priority: "High",
    progress: 78,
    due: "Oct 24",
    budget: "$18.4k",
    risk: 18,
    impact: 92,
    tasks: 34,
    done: 27,
    aiSummary:
      "Retention model is stable. Biggest unlock is finishing the billing-event feature pipeline.",
  },
  {
    id: 2,
    name: "Support Copilot",
    owner: "Customer Ops",
    health: "At risk",
    priority: "High",
    progress: 52,
    due: "Nov 02",
    budget: "$26.1k",
    risk: 64,
    impact: 88,
    tasks: 41,
    done: 21,
    aiSummary:
      "Retrieval quality improved, but escalation rules still need testing before the pilot.",
  },
  {
    id: 3,
    name: "Demand Forecast",
    owner: "Finance",
    health: "On track",
    priority: "Medium",
    progress: 66,
    due: "Nov 11",
    budget: "$14.8k",
    risk: 28,
    impact: 74,
    tasks: 29,
    done: 19,
    aiSummary:
      "Forecast error is trending down. Next review should compare category-level seasonality.",
  },
  {
    id: 4,
    name: "Hiring Screen",
    owner: "People",
    health: "Needs review",
    priority: "Low",
    progress: 39,
    due: "Nov 18",
    budget: "$9.7k",
    risk: 46,
    impact: 61,
    tasks: 18,
    done: 7,
    aiSummary:
      "Bias review is pending. Candidate feedback should be added before expanding usage.",
  },
  {
    id: 5,
    name: "Inventory Optimizer",
    owner: "Operations",
    health: "On track",
    priority: "Medium",
    progress: 83,
    due: "Oct 29",
    budget: "$21.3k",
    risk: 22,
    impact: 81,
    tasks: 37,
    done: 31,
    aiSummary:
      "Optimization run is healthy. Warehouse constraints are the final integration item.",
  },
];

const timeline = [
  { label: "Mon", value: 42 },
  { label: "Tue", value: 57 },
  { label: "Wed", value: 49 },
  { label: "Thu", value: 71 },
  { label: "Fri", value: 64 },
  { label: "Sat", value: 82 },
  { label: "Sun", value: 76 },
];

function App() {
  const [query, setQuery] = useState("");
  const [healthFilter, setHealthFilter] = useState("All");
  const [selectedId, setSelectedId] = useState(projects[0].id);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = `${project.name} ${project.owner}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesHealth =
        healthFilter === "All" || project.health === healthFilter;
      return matchesSearch && matchesHealth;
    });
  }, [query, healthFilter]);

  const selectedProject =
    projects.find((project) => project.id === selectedId) ?? projects[0];

  const stats = useMemo(() => {
    const active = filteredProjects.length;
    const avgProgress = Math.round(
      filteredProjects.reduce((sum, project) => sum + project.progress, 0) /
        Math.max(active, 1),
    );
    const totalImpact = filteredProjects.reduce(
      (sum, project) => sum + project.impact,
      0,
    );
    const riskCount = filteredProjects.filter(
      (project) => project.health !== "On track",
    ).length;
    return { active, avgProgress, totalImpact, riskCount };
  }, [filteredProjects]);

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Bot size={22} />
          </div>
          <div>
            <strong>CommandIQ</strong>
            <span>AI delivery desk</span>
          </div>
        </div>

        <nav className="nav-list" aria-label="Main navigation">
          <button className="nav-item active" title="Dashboard">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>
          <button className="nav-item" title="Roadmap">
            <Target size={18} />
            <span>Roadmap</span>
          </button>
          <button className="nav-item" title="Tasks">
            <ListChecks size={18} />
            <span>Tasks</span>
          </button>
          <button className="nav-item" title="Team">
            <Users size={18} />
            <span>Team</span>
          </button>
        </nav>

        <div className="sidebar-panel">
          <Sparkles size={18} />
          <strong>AI brief</strong>
          <p>
            Two initiatives need attention. Support Copilot has the highest
            delivery risk and the strongest customer impact.
          </p>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Portfolio overview</p>
            <h1>AI Project Manager Dashboard</h1>
          </div>
          <button className="primary-action">
            <Sparkles size={18} />
            Generate sprint brief
          </button>
        </header>

        <section className="controls" aria-label="Project filters">
          <label className="search-box">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search project or team"
            />
          </label>
          <div className="segmented">
            {["All", "On track", "At risk", "Needs review"].map((item) => (
              <button
                key={item}
                className={healthFilter === item ? "selected" : ""}
                onClick={() => setHealthFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="metrics-grid" aria-label="Portfolio metrics">
          <Metric
            icon={<Activity size={20} />}
            label="Active projects"
            value={stats.active}
            detail="Filtered portfolio"
          />
          <Metric
            icon={<CheckCircle2 size={20} />}
            label="Average progress"
            value={`${stats.avgProgress}%`}
            detail="Across visible work"
          />
          <Metric
            icon={<ArrowUpRight size={20} />}
            label="Impact score"
            value={stats.totalImpact}
            detail="Projected value"
          />
          <Metric
            icon={<AlertTriangle size={20} />}
            label="Needs attention"
            value={stats.riskCount}
            detail="Risk or review"
          />
        </section>

        <section className="main-grid">
          <div className="project-table">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Delivery board</p>
                <h2>Project health</h2>
              </div>
              <Filter size={18} />
            </div>

            <div className="table-list">
              {filteredProjects.map((project) => (
                <button
                  className={`project-row ${
                    selectedProject.id === project.id ? "active-row" : ""
                  }`}
                  key={project.id}
                  onClick={() => setSelectedId(project.id)}
                >
                  <span className={`status-dot ${statusClass(project.health)}`} />
                  <span className="project-name">
                    <strong>{project.name}</strong>
                    <small>{project.owner}</small>
                  </span>
                  <span className="priority">{project.priority}</span>
                  <span className="progress-track">
                    <span style={{ width: `${project.progress}%` }} />
                  </span>
                  <span className="progress-number">{project.progress}%</span>
                </button>
              ))}
            </div>
          </div>

          <aside className="detail-panel">
            <div className="section-heading compact">
              <div>
                <p className="eyebrow">Selected project</p>
                <h2>{selectedProject.name}</h2>
              </div>
              <span className={`health-pill ${statusClass(selectedProject.health)}`}>
                {selectedProject.health}
              </span>
            </div>

            <p className="summary">{selectedProject.aiSummary}</p>

            <div className="detail-stats">
              <MiniStat
                icon={<CalendarDays size={17} />}
                label="Due"
                value={selectedProject.due}
              />
              <MiniStat
                icon={<Clock3 size={17} />}
                label="Tasks"
                value={`${selectedProject.done}/${selectedProject.tasks}`}
              />
              <MiniStat
                icon={<Target size={17} />}
                label="Budget"
                value={selectedProject.budget}
              />
            </div>

            <div className="risk-meter">
              <div>
                <span>Delivery risk</span>
                <strong>{selectedProject.risk}%</strong>
              </div>
              <div className="risk-track">
                <span style={{ width: `${selectedProject.risk}%` }} />
              </div>
            </div>

            <div className="chart-card">
              <div className="section-heading compact">
                <div>
                  <p className="eyebrow">Velocity</p>
                  <h2>Weekly output</h2>
                </div>
              </div>
              <div className="bar-chart" aria-label="Weekly output chart">
                {timeline.map((item) => (
                  <div className="bar-column" key={item.label}>
                    <span style={{ height: `${item.value}%` }} />
                    <small>{item.label}</small>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}

function Metric({ icon, label, value, detail }) {
  return (
    <article className="metric-card">
      <div className="metric-icon">{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

function MiniStat({ icon, label, value }) {
  return (
    <div className="mini-stat">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function statusClass(status) {
  if (status === "On track") return "good";
  if (status === "At risk") return "warning";
  return "review";
}

createRoot(document.getElementById("root")).render(<App />);
