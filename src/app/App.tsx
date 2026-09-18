import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Code2,
  FileCode2,
  GitBranch,
  Plus,
  Play,
  UsersRound,
} from "lucide-react";

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

const templates = [
  {
    id: "html",
    name: "HTML/CSS/JS",
    description: "Best for the first simple website or landing page.",
  },
  {
    id: "react",
    name: "React",
    description: "Best for a modern interactive web app.",
  },
  {
    id: "node",
    name: "Node.js",
    description: "Best for backend APIs and server logic.",
  },
  {
    id: "python",
    name: "Python",
    description: "Best for scripts, data tools, and automation.",
  },
];

type TemplateId = (typeof templates)[number]["id"];

type Project = {
  id: string;
  name: string;
  templateName: string;
  status: string;
};

const starterProject: Project = {
  id: "starter-workspace",
  name: "Starter workspace",
  templateName: "React",
  status: "Ready",
};

const projectsStorageKey = "collab-dev-projects";

export function App() {
  const [projectName, setProjectName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("react");
  const [projects, setProjects] = useState<Project[]>(() => {
    const savedProjects = window.localStorage.getItem(projectsStorageKey);

    if (!savedProjects) {
      return [starterProject];
    }

    try {
      const parsedProjects = JSON.parse(savedProjects) as Project[];
      return parsedProjects.length > 0 ? parsedProjects : [starterProject];
    } catch {
      return [starterProject];
    }
  });
  const [activeProjectId, setActiveProjectId] = useState("starter-workspace");

  const selectedTemplateLabel = useMemo(() => {
    return templates.find((template) => template.id === selectedTemplate)?.name ?? "React";
  }, [selectedTemplate]);

  const activeProject =
    projects.find((project) => project.id === activeProjectId) ?? projects[0];

  useEffect(() => {
    window.localStorage.setItem(projectsStorageKey, JSON.stringify(projects));
  }, [projects]);

  function createProject() {
    const cleanName = projectName.trim();

    if (!cleanName) {
      return;
    }

    const newProject: Project = {
      id: crypto.randomUUID(),
      name: cleanName,
      templateName: selectedTemplateLabel,
      status: "Ready",
    };

    setProjects((currentProjects) => [
      newProject,
      ...currentProjects,
    ]);
    setActiveProjectId(newProject.id);
    setProjectName("");
  }

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
          <button className="primary-button" type="button" onClick={createProject}>
            <Plus size={18} aria-hidden="true" />
            Create project
          </button>
          <button className="secondary-button" type="button">
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

        <section className="builder-grid" id="projects">
          <form
            className="create-panel"
            onSubmit={(event) => {
              event.preventDefault();
              createProject();
            }}
          >
            <div className="panel-header">
              <h2>Create project</h2>
              <span>Step 1</span>
            </div>

            <label className="field-label" htmlFor="project-name">
              Project name
            </label>
            <input
              id="project-name"
              className="text-input"
              placeholder="Example: Team portfolio"
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
            />

            <div className="template-heading">Choose a starter</div>
            <div className="template-list">
              {templates.map((template) => (
                <button
                  className={
                    template.id === selectedTemplate ? "template-card selected" : "template-card"
                  }
                  key={template.id}
                  type="button"
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <FileCode2 size={18} aria-hidden="true" />
                  <span>
                    <strong>{template.name}</strong>
                    <small>{template.description}</small>
                  </span>
                </button>
              ))}
            </div>

            <button className="primary-button full-width" type="submit">
              <Plus size={18} aria-hidden="true" />
              Create project
            </button>
          </form>

          <section className="projects-panel" aria-label="Projects">
            <div className="panel-header">
              <h2>Projects</h2>
              <span>{projects.length} total</span>
            </div>

            <div className="project-list">
              {projects.map((project) => (
                <button
                  className={
                    project.id === activeProject?.id ? "project-card active-project" : "project-card"
                  }
                  key={project.id}
                  type="button"
                  onClick={() => setActiveProjectId(project.id)}
                >
                  <div>
                    <h3>{project.name}</h3>
                    <p>{project.templateName}</p>
                  </div>
                  <span className="status-pill">
                    {project.id === activeProject?.id ? "Selected" : project.status}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}

