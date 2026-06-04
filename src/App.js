import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import "./App.css";

// ── EmailJS Config — apni values daalo ───────────────────────────────────────
const EMAILJS_SERVICE_ID      = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const EMAILJS_OWNER_TEMPLATE  = process.env.REACT_APP_EMAILJS_OWNER_TEMPLATE;
const EMAILJS_SENDER_TEMPLATE = process.env.REACT_APP_EMAILJS_SENDER_TEMPLATE;
const EMAILJS_PUBLIC_KEY      = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

const NAV_LINKS = ["About", "Skills", "Projects", "Education", "Certifications", "Contact"];

const SKILLS = {
  "Languages":    ["Java (Java 8)"],
  "Frameworks":   ["Spring", "Spring Boot", "Spring MVC", "JUnit"],
  "Technologies": ["Servlets", "JSP", "JDBC", "REST APIs"],
  "Database":     ["MySQL"],
  "Tools":        ["Git", "GitHub", "IntelliJ IDEA", "VS Code", "Eclipse", "Maven"],
  "DevOps":       ["Docker", "AWS (EC2)"],
  "Core":         ["DSA", "OOP", "Backend Development", "SDLC", "Web Application"],
};

const PROJECTS = [
  {
    title: "Secure Personal Vault",
    stack: ["React", "Spring Boot", "Spring Security", "JWT", "MySQL"],
    link: "http://13.50.22.80/",
    points: [
      "Full-stack vault with per-user data isolation for files and notes.",
      "JWT authentication with BCrypt hashing, token expiry, and request-level authorization.",
      "RESTful APIs with clean layered architecture (Controller, Service, Repository).",
      "Normalized MySQL schema with JPA/Hibernate; deployed on AWS EC2 via Docker Compose.",
    ],
  },
  {
    title: "Educational Institute System",
    stack: ["Java Servlets", "JSP", "MySQL", "HTML/CSS", "JavaScript"],
    link: null,
    points: [
      "Full-stack web app for managing records and academic data using MVC pattern.",
      "Backend CRUD services with Java Servlets, input validation, and error handling.",
      "Role-based access control (RBAC) for students and faculty with session management.",
      "Collaborated with 2 teammates using sprint-based delivery and code reviews.",
    ],
  },
];

const CERTS = [
  { title: "Programming in Java",       issuer: "Softwaves Technologies", detail: "Core Java, OOP, exception handling, collections, multithreading." },
  { title: "Database Management Systems", issuer: "IIT Kharagpur",         detail: "Database design, SQL optimization, transaction management, normalization." },
];

export default function App() {
  const [active, setActive]     = useState("About");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [typed, setTyped]       = useState("");
  const [visible, setVisible]   = useState({});
  const sectionRefs             = useRef({});

  // Contact form
  const [form, setForm]           = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState(null); // null | "loading" | "success" | "error"
  const [formError, setFormError]   = useState("");

  // Typewriter
  const roles = ["Backend Developer", "Java Engineer", "Spring Boot Dev", "API Architect"];
  const [roleIdx, setRoleIdx]   = useState(0);
  const [charIdx, setCharIdx]   = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = roles[roleIdx];
    let t;
    if (!deleting && charIdx < current.length)       t = setTimeout(() => setCharIdx(c => c + 1), 80);
    else if (!deleting && charIdx === current.length) t = setTimeout(() => setDeleting(true), 1800);
    else if (deleting && charIdx > 0)                 t = setTimeout(() => setCharIdx(c => c - 1), 45);
    else { setDeleting(false); setRoleIdx(i => (i + 1) % roles.length); }
    return () => clearTimeout(t);
  }, [charIdx, deleting, roleIdx]);

  useEffect(() => { setTyped(roles[roleIdx].slice(0, charIdx)); }, [charIdx, roleIdx]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          setActive(e.target.dataset.section);
          setVisible(v => ({ ...v, [e.target.dataset.section]: true }));
        }
      }),
      { threshold: 0.2 }
    );
    NAV_LINKS.forEach(sec => { const el = sectionRefs.current[sec]; if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const scrollTo   = (id) => { sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" }); setMenuOpen(false); };
  const sectionRef = (name) => (el) => { sectionRefs.current[name] = el; };

  // ── Resume download — public folder se ───────────────────────────────────
  const handleResumeDownload = () => {
    const link = document.createElement("a");
    link.href = "/Vidhan_Tayade_Resume.pdf";
    link.download = "Vidhan_Tayade_Resume.pdf";
    link.click();
  };

  // ── Contact form ─────────────────────────────────────────────────────────
  const handleFormChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFormSubmit = async () => {
    const { name, email, message } = form;
    if (!name.trim() || !email.trim() || !message.trim()) { setFormError("All fields are required."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))        { setFormError("Please enter a valid email."); return; }

    setFormError("");
    setFormStatus("loading");

    const templateParams = {
      from_name:  name,
      from_email: email,
      message:    message,
      to_email:   "vidhantayade505@gmail.com",
    };

    try {
      // Send notification to you
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_OWNER_TEMPLATE, templateParams, EMAILJS_PUBLIC_KEY);
      // Send acknowledgement to sender
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_SENDER_TEMPLATE, templateParams, EMAILJS_PUBLIC_KEY);

      setFormStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("EmailJS error:", err);
      setFormStatus("error");
    }
  };

  return (
    <div className="app">
      <div className="grid-bg" />
      <div className="noise" />

      {/* ── NAV ── */}
      <nav className={`nav${scrolled ? " nav--scrolled" : ""}`}>
        <div className="nav__logo" onClick={() => scrollTo("About")}>
          <span className="nav__logo-bracket">&lt;</span>VT<span className="nav__logo-bracket">/&gt;</span>
        </div>
        <div className={`nav__links${menuOpen ? " nav__links--open" : ""}`}>
          {NAV_LINKS.map(l => (
            <button key={l} className={`nav__link${active === l ? " nav__link--active" : ""}`} onClick={() => scrollTo(l)}>{l}</button>
          ))}
          <button className="btn btn--resume-nav" onClick={handleResumeDownload}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Resume
          </button>
        </div>
        <button className="nav__burger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* ── HERO ── */}
      <section className={`hero section${visible["About"] ? " visible" : ""}`} ref={sectionRef("About")} data-section="About">
        <div className="hero__content">
          <div className="hero__tag">// backend engineer</div>
          <h1 className="hero__name">Vidhan<br /><span className="hero__name-accent">Tayade</span></h1>
          <div className="hero__role">
            <span className="hero__typed">{typed}</span>
            <span className="hero__cursor">|</span>
          </div>
          <p className="hero__bio">
            Proactive CS undergraduate specialising in backend systems, Java-based applications,
            and secure server-side architecture. Building logic-driven products that scale.
          </p>
          <div className="hero__cta">
            <button className="btn btn--primary"   onClick={() => scrollTo("Projects")}>View Projects</button>
            <button className="btn btn--ghost"     onClick={() => scrollTo("Contact")}>Get in Touch</button>
            <button className="btn btn--download"  onClick={handleResumeDownload}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download Resume
            </button>
          </div>
          <div className="hero__links">
            <a href="mailto:vidhantayade505@gmail.com" className="hero__icon-link" title="Email">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </a>
            <a href="https://linkedin.com/in/vidhan-tayade-1859622a0/" target="_blank" rel="noreferrer" className="hero__icon-link" title="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href="https://github.com/Vidhan-Tayade" target="_blank" rel="noreferrer" className="hero__icon-link" title="GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            </a>
          </div>
        </div>
        <div className="hero__visual">
          <div className="hero__card">
            <div className="hero__card-line"><span className="code-key">class</span> <span className="code-class">Developer</span> {"{"}</div>
            <div className="hero__card-line indent"><span className="code-key">String</span> name = <span className="code-str">"Vidhan Tayade"</span>;</div>
            <div className="hero__card-line indent"><span className="code-key">String</span> location = <span className="code-str">"Indore, M.P."</span>;</div>
            <div className="hero__card-line indent"><span className="code-key">String[]</span> stack = {"{"}</div>
            <div className="hero__card-line indent2"><span className="code-str">"Spring Boot"</span>, <span className="code-str">"MySQL"</span>,</div>
            <div className="hero__card-line indent2"><span className="code-str">"Docker"</span>, <span className="code-str">"AWS EC2"</span></div>
            <div className="hero__card-line indent">{"}"} ;</div>
            <div className="hero__card-line indent"><span className="code-key">double</span> cgpa = <span className="code-num">7.40</span>;</div>
            <div className="hero__card-line">{"}"}</div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section className={`skills section${visible["Skills"] ? " visible" : ""}`} ref={sectionRef("Skills")} data-section="Skills">
        <div className="container">
          <h2 className="section-title"><span className="accent">02.</span> Technical Skills</h2>
          <div className="skills__grid">
            {Object.entries(SKILLS).map(([cat, items]) => (
              <div className="skill-card" key={cat}>
                <div className="skill-card__cat">{cat}</div>
                <div className="skill-card__tags">{items.map(t => <span className="tag" key={t}>{t}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section className={`projects section${visible["Projects"] ? " visible" : ""}`} ref={sectionRef("Projects")} data-section="Projects">
        <div className="container">
          <h2 className="section-title"><span className="accent">03.</span> Projects</h2>
          <div className="projects__list">
            {PROJECTS.map((p, i) => (
              <div className="project-card" key={p.title}>
                <div className="project-card__header">
                  <span className="project-card__num">0{i + 1}</span>
                  <h3 className="project-card__title">{p.title}</h3>
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noreferrer" className="project-card__link">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      Live
                    </a>
                  )}
                </div>
                <div className="project-card__stack">{p.stack.map(s => <span className="tag tag--accent" key={s}>{s}</span>)}</div>
                <ul className="project-card__points">{p.points.map((pt, j) => <li key={j}>{pt}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDUCATION ── */}
      <section className={`education section${visible["Education"] ? " visible" : ""}`} ref={sectionRef("Education")} data-section="Education">
        <div className="container">
          <h2 className="section-title"><span className="accent">04.</span> Education</h2>
          <div className="timeline">
            <div className="timeline__item">
              <div className="timeline__dot" />
              <div className="timeline__body">
                <div className="timeline__period">2022 – 2026</div>
                <h3 className="timeline__title">B.Tech — Computer Science & Engineering</h3>
                <div className="timeline__inst">Shri Vaishnav Vidyapeeth Vishwavidyalaya, Indore</div>
                <div className="timeline__grade">CGPA: <strong>7.40 / 10</strong></div>
              </div>
            </div>
            <div className="timeline__item">
              <div className="timeline__dot" />
              <div className="timeline__body">
                <div className="timeline__period">2020 – 2022</div>
                <h3 className="timeline__title">Higher Secondary Certificate</h3>
                <div className="timeline__inst">Takshshila Higher Secondary School, Indore</div>
                <div className="timeline__grade">Class XII: <strong>77.4%%</strong> &nbsp;|&nbsp; Class X: <strong>88.7%%</strong></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS ── */}
      <section className={`certs section${visible["Certifications"] ? " visible" : ""}`} ref={sectionRef("Certifications")} data-section="Certifications">
        <div className="container">
          <h2 className="section-title"><span className="accent">05.</span> Certifications</h2>
          <div className="certs__grid">
            {CERTS.map(c => (
              <div className="cert-card" key={c.title}>
                <div className="cert-card__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
                </div>
                <h3 className="cert-card__title">{c.title}</h3>
                <div className="cert-card__issuer">{c.issuer}</div>
                <p className="cert-card__detail">{c.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className={`contact section${visible["Contact"] ? " visible" : ""}`} ref={sectionRef("Contact")} data-section="Contact">
        <div className="container">
          <h2 className="section-title"><span className="accent">06.</span> Contact</h2>
          <p className="contact__sub">Currently open to backend / Java developer roles and internships.</p>

          <div className="contact__layout">
            {/* Info cards */}
            <div className="contact__info">
              <a href="mailto:vidhantayade505@gmail.com" className="contact-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <span>vidhantayade505@gmail.com</span>
              </a>
              <a href="tel:+919340691358" className="contact-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.07 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span>+91-9340691358</span>
              </a>
              <a href="https://linkedin.com/in/vidhan-tayade-1859622a0/" target="_blank" rel="noreferrer" className="contact-card">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
                <span>linkedin.com/in/vidhan-tayade</span>
              </a>
              <a href="https://github.com/Vidhan-Tayade" target="_blank" rel="noreferrer" className="contact-card">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                <span>github.com/Vidhan-Tayade</span>
              </a>
              <button className="contact-card contact-card--download" onClick={handleResumeDownload}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                <span>Download Resume</span>
              </button>
            </div>

            {/* Contact Form */}
            <div className="contact__form-box">
              <div className="form-header">
                <span className="code-key">emailjs.send</span>
                <span className="form-header__url">// direct to inbox</span>
              </div>

              {formStatus === "success" ? (
                <div className="form-success">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="40" height="40"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                  <p>Message sent! I'll get back to you soon.</p>
                  <button className="btn btn--ghost" style={{marginTop:"1rem"}} onClick={() => setFormStatus(null)}>Send another</button>
                </div>
              ) : (
                <>
                  <div className="form-field">
                    <label className="form-label">name</label>
                    <input className="form-input" type="text" name="name" placeholder="Your full name"
                      value={form.name} onChange={handleFormChange} disabled={formStatus === "loading"} />
                  </div>
                  <div className="form-field">
                    <label className="form-label">email</label>
                    <input className="form-input" type="email" name="email" placeholder="your@email.com"
                      value={form.email} onChange={handleFormChange} disabled={formStatus === "loading"} />
                  </div>
                  <div className="form-field">
                    <label className="form-label">message</label>
                    <textarea className="form-input form-textarea" name="message" placeholder="What's on your mind?"
                      value={form.message} onChange={handleFormChange} disabled={formStatus === "loading"} rows={5} />
                  </div>
                  {formError && <div className="form-error">{formError}</div>}
                  {formStatus === "error" && (
                    <div className="form-error">Something went wrong. Email me directly at vidhantayade505@gmail.com</div>
                  )}
                  <button
                    className={`btn btn--primary btn--send${formStatus === "loading" ? " btn--loading" : ""}`}
                    onClick={handleFormSubmit}
                    disabled={formStatus === "loading"}
                  >
                    {formStatus === "loading" ? (
                      <><span className="spinner" /> Sending…</>
                    ) : (
                      <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Message</>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <span className="nav__logo-bracket">&lt;</span>VT<span className="nav__logo-bracket">/&gt;</span>
        &nbsp;— Designed & Built by Vidhan Tayade · {new Date().getFullYear()}
      </footer>
    </div>
  );
}