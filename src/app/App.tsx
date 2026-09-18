import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Code2,
  FileCode2,
  GitBranch,
  Mail,
  MessageSquare,
  Plus,
  Play,
  ShieldCheck,
  UserPlus,
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

type TeamMember = {
  id: string;
  email: string;
  role: "Owner" | "Editor" | "Reviewer";
  status: "Active" | "Invited";
};

type WorkspaceFile = {
  name: string;
  language: string;
  content: string;
};

type ChangeRequest = {
  id: string;
  title: string;
  status: "Needs review" | "Approved";
};

type Project = {
  id: string;
  name: string;
  templateName: string;
  status: string;
  members: TeamMember[];
  files: WorkspaceFile[];
  changes: ChangeRequest[];
};

function starterFilesFor(templateName: string): WorkspaceFile[] {
  if (templateName === "HTML/CSS/JS") {
    return [
      {
        name: "index.html",
        language: "HTML",
        content: "<main>\n  <h1>My new project</h1>\n  <p>Start building here.</p>\n</main>\n",
      },
      { name: "styles.css", language: "CSS", content: "body {\n  font-family: system-ui;\n}\n" },
      { name: "script.js", language: "JavaScript", content: "console.log('Ready to build');\n" },
    ];
  }

  if (templateName === "Node.js") {
    return [
      {
        name: "server.js",
        language: "JavaScript",
        content: "console.log('Your Node.js project is ready.');\n",
      },
    ];
  }

  if (templateName === "Python") {
    return [
      {
        name: "main.py",
        language: "Python",
        content: "print('Your Python project is ready.')\n",
      },
    ];
  }

  return [
    {
      name: "App.tsx",
      language: "TypeScript",
      content:
        "export default function App() {\n  return <h1>My collaborative project</h1>;\n}\n",
    },
    { name: "styles.css", language: "CSS", content: "h1 {\n  color: #2454d6;\n}\n" },
  ];
}

const starterProject: Project = {
  id: "starter-workspace",
  name: "Starter workspace",
  templateName: "React",
  status: "Ready",
  members: [
    {
      id: "project-owner",
      email: "You",
      role: "Owner",
      status: "Active",
    },
  ],
  files: starterFilesFor("React"),
  changes: [],
};

const projectsStorageKey = "collab-dev-projects";

export function App() {
  const [projectName, setProjectName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("react");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamMember["role"]>("Editor");
  const [inviteMessage, setInviteMessage] = useState("");
  const [activeFileName, setActiveFileName] = useState("App.tsx");
  const [changeTitle, setChangeTitle] = useState("");
  const [changeMessage, setChangeMessage] = useState("");
  const [projects, setProjects] = useState<Project[]>(() => {
    const savedProjects = window.localStorage.getItem(projectsStorageKey);

    if (!savedProjects) {
      return [starterProject];
    }

    try {
      const parsedProjects = JSON.parse(savedProjects) as Project[];
      return parsedProjects.length > 0
        ? parsedProjects.map((project) => ({
            ...project,
            members: project.members ?? [],
            files: project.files ?? starterFilesFor(project.templateName),
            changes: project.changes ?? [],
          }))
        : [starterProject];
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
  const activeFile = activeProject?.files.find((file) => file.name === activeFileName) ??
    activeProject?.files[0];

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
      members: [
        {
          id: crypto.randomUUID(),
          email: "You",
          role: "Owner",
          status: "Active",
        },
      ],
      files: starterFilesFor(selectedTemplateLabel),
      changes: [],
    };

    setProjects((currentProjects) => [
      newProject,
      ...currentProjects,
    ]);
    setActiveProjectId(newProject.id);
    setActiveFileName(newProject.files[0].name);
    setProjectName("");
  }

  function selectProject(project: Project) {
    setActiveProjectId(project.id);
    setActiveFileName(project.files[0]?.name ?? "");
    setInviteMessage("");
  }

  function updateActiveFile(content: string) {
    if (!activeProject || !activeFile) {
      return;
    }

    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === activeProject.id
          ? {
              ...project,
              files: project.files.map((file) =>
                file.name === activeFile.name ? { ...file, content } : file,
              ),
            }
          : project,
      ),
    );
  }

  function requestReview() {
    const cleanTitle = changeTitle.trim();

    if (!activeProject || !cleanTitle) {
      setChangeMessage("Give this change a short title first.");
      return;
    }

    const newChange: ChangeRequest = {
      id: crypto.randomUUID(),
      title: cleanTitle,
      status: "Needs review",
    };

    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === activeProject.id
          ? { ...project, changes: [newChange, ...project.changes] }
          : project,
      ),
    );
    setChangeTitle("");
    setChangeMessage("Review request created.");
  }

  function approveChange(changeId: string) {
    if (!activeProject) {
      return;
    }

    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === activeProject.id
          ? {
              ...project,
              changes: project.changes.map((change) =>
                change.id === changeId ? { ...change, status: "Approved" } : change,
              ),
            }
          : project,
      ),
    );
    setChangeMessage("Change approved locally.");
  }

  function inviteMember() {
    const cleanEmail = inviteEmail.trim().toLowerCase();

    if (!activeProject || !/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setInviteMessage("Enter a valid teammate email address first.");
      return;
    }

    if (activeProject.members.some((member) => member.email.toLowerCase() === cleanEmail)) {
      setInviteMessage("That teammate is already in this project.");
      return;
    }

    const newMember: TeamMember = {
      id: crypto.randomUUID(),
      email: cleanEmail,
      role: inviteRole,
      status: "Invited",
    };

    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === activeProject.id
          ? { ...project, members: [...project.members, newMember] }
          : project,
      ),
    );
    setInviteEmail("");
    setInviteMessage(`Invite prepared for ${cleanEmail}.`);
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
                  onClick={() => selectProject(project)}
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

        <section className="review-panel" id="reviews" aria-label="Change review">
          <div className="panel-header">
            <div>
              <h2>Change review</h2>
              <p className="panel-subtitle">
                Turn an edit into a clear request for your team to review.
              </p>
            </div>
            <span>{activeProject?.changes.length ?? 0} changes</span>
          </div>

          <form
            className="review-form"
            onSubmit={(event) => {
              event.preventDefault();
              requestReview();
            }}
          >
            <input
              aria-label="Change title"
              className="text-input"
              placeholder="Example: Update the home page heading"
              value={changeTitle}
              onChange={(event) => setChangeTitle(event.target.value)}
            />
            <button className="secondary-button" type="submit">
              <MessageSquare size={18} aria-hidden="true" />
              Request review
            </button>
          </form>

          {changeMessage && <p className="invite-message">{changeMessage}</p>}

          <div className="change-list">
            {activeProject?.changes.length ? (
              activeProject.changes.map((change) => (
                <article className="change-card" key={change.id}>
                  <div>
                    <h3>{change.title}</h3>
                    <p>{change.status}</p>
                  </div>
                  {change.status === "Needs review" ? (
                    <button
                      className="approve-button"
                      type="button"
                      onClick={() => approveChange(change.id)}
                    >
                      <ShieldCheck size={17} aria-hidden="true" />
                      Approve
                    </button>
                  ) : (
                    <span className="status-pill">Approved</span>
                  )}
                </article>
              ))
            ) : (
              <p className="empty-message">No changes are waiting for review yet.</p>
            )}
          </div>
          <p className="helper-text">
            Review requests are local for now. Later, the backend will attach each request to real
            code changes, comments, permissions, and a protected Git history.
          </p>
        </section>

        <section className="workspace-panel" aria-label="Project workspace">
          <div className="panel-header">
            <div>
              <h2>Build workspace</h2>
              <p className="panel-subtitle">
                {activeProject ? `${activeProject.name} · saved in this browser` : "Choose a project first"}
              </p>
            </div>
            <span>{activeFile?.language ?? "No file"}</span>
          </div>

          <div className="file-tabs" aria-label="Project files">
            {activeProject?.files.map((file) => (
              <button
                className={file.name === activeFile?.name ? "file-tab active-file" : "file-tab"}
                key={file.name}
                type="button"
                onClick={() => setActiveFileName(file.name)}
              >
                <FileCode2 size={16} aria-hidden="true" />
                {file.name}
              </button>
            ))}
          </div>

          <textarea
            aria-label="Code editor"
            className="code-editor"
            spellCheck="false"
            value={activeFile?.content ?? ""}
            onChange={(event) => updateActiveFile(event.target.value)}
          />
          <p className="helper-text">
            Your edits save automatically in this browser. A professional code editor, real file
            storage, and shared live editing come after authentication and backend foundations.
          </p>
        </section>

        <section className="team-panel" id="team" aria-label="Invite teammates">
          <div className="panel-header">
            <div>
              <h2>Invite teammates</h2>
              <p className="panel-subtitle">
                {activeProject ? `For ${activeProject.name}` : "Choose a project first"}
              </p>
            </div>
            <span>{activeProject?.members.length ?? 0} people</span>
          </div>

          <form
            className="invite-form"
            onSubmit={(event) => {
              event.preventDefault();
              inviteMember();
            }}
          >
            <input
              aria-label="Teammate email"
              className="text-input"
              placeholder="teammate@example.com"
              type="email"
              value={inviteEmail}
              onChange={(event) => setInviteEmail(event.target.value)}
            />
            <select
              aria-label="Teammate role"
              className="role-select"
              value={inviteRole}
              onChange={(event) => setInviteRole(event.target.value as TeamMember["role"])}
            >
              <option>Editor</option>
              <option>Reviewer</option>
            </select>
            <button className="primary-button" type="submit">
              <UserPlus size={18} aria-hidden="true" />
              Invite
            </button>
          </form>

          {inviteMessage && <p className="invite-message">{inviteMessage}</p>}

          <div className="member-list">
            {activeProject?.members.map((member) => (
              <article className="member-card" key={member.id}>
                <Mail size={18} aria-hidden="true" />
                <div>
                  <h3>{member.email}</h3>
                  <p>{member.role}</p>
                </div>
                <span className={member.status === "Active" ? "status-pill" : "status-pill invited"}>
                  {member.status}
                </span>
              </article>
            ))}
          </div>
          <p className="helper-text">
            This is a safe local prototype: invitations are saved in this browser, but no email is
            sent until we connect authentication and the backend.
          </p>
        </section>
      </section>
    </main>
  );
}

