import { CheckCircle2, Code2, GitBranch, Play, UsersRound } from "lucide-react";

const mvpSteps = [
  "Create",
  "Invite",
  "Build",
  "Collaborate",
  "Change",
  "Review",
  "Approve",
  "Run",
];

export function App() {
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <Code2 size={24} aria-hidden="true" />
          <span>Collab Dev</span>
        </div>

        <nav className="nav-list" aria-label="Main navigation">
          <a className="nav-item active" href="#workspace">
            Workspace
          </a>
          <a className="nav-item" href="#projects">
            Projects
          </a>
          <a className="nav-item" href="#team">
            Team
          </a>
          <a className="nav-item" href="#reviews">
            Reviews
          </a>
        </nav>
      </aside>

      <section className="workspace" id="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">MVP foundation</p>
            <h1>Team workspace</h1>
          </div>
          <button className="primary-button" type="button">
            <Play size={18} aria-hidden="true" />
            Run
          </button>
        </header>

        <section className="status-grid" aria-label="Foundation status">
          <article className="status-card">
            <CheckCircle2 size={20} aria-hidden="true" />
            <div>
              <h2>Web app shell</h2>
              <p>Ready for auth, projects, editor, and team presence.</p>
            </div>
          </article>
          <article className="status-card">
            <UsersRound size={20} aria-hidden="true" />
            <div>
              <h2>Collaboration path</h2>
              <p>Designed around inviting people and working together live.</p>
            </div>
          </article>
          <article className="status-card">
            <GitBranch size={20} aria-hidden="true" />
            <div>
              <h2>Change flow</h2>
              <p>Review and approval will sit above Git without exposing Git first.</p>
            </div>
          </article>
        </section>

        <section className="project-panel" aria-label="MVP flow">
          <div className="panel-header">
            <h2>First product loop</h2>
            <span>Foundation only</span>
          </div>
          <ol className="step-list">
            {mvpSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      </section>
    </main>
  );
}

