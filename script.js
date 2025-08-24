(function () {
  const data = window.__RESUME_DATA__;

  // Brand & Hero
  document.getElementById("brand-initials").textContent = data.basics.initials || "ZZ";
  document.getElementById("brand-name").textContent = data.basics.name || "ชื่อ-นามสกุล";
  document.getElementById("site-title").textContent = `เรซูเม่ • ${data.basics.name || "ชื่อ-นามสกุล"}`;
  document.getElementById("full-name").textContent = data.basics.name || "ชื่อ-นามสกุล";
  document.getElementById("footer-name").textContent = data.basics.name || "ชื่อ-นามสกุล";
  document.getElementById("headline").textContent = data.basics.headline || "";
  document.getElementById("summary").textContent = data.basics.summary || "";
  document.getElementById("avatar").src = data.basics.avatar || "assets/avatar.svg";
  const btnDownload = document.getElementById("btn-download");
  if (data.basics.pdf && data.basics.pdf !== "#") {
    btnDownload.href = data.basics.pdf;
  } else {
    btnDownload.style.display = "none";
  }

  // Year & updated
  document.getElementById("year").textContent = new Date().getFullYear().toString();
  const lastUpdated = new Date(document.lastModified);
  document.getElementById("last-updated").textContent = lastUpdated.toLocaleDateString("th-TH");

  // Skills
  const skillsEl = document.getElementById("skills-container");
  skillsEl.innerHTML = "";
  data.skills.forEach(s => {
    const pill = document.createElement("div");
    pill.className = "skill-pill";
    pill.innerHTML = `
      <span class="name">${s.name}</span>
      <div class="bar"><span style="width:${Math.min(Math.max(s.levelPct,0),100)}%"></span></div>
      <span class="level">${s.levelPct}%</span>
    `;
    skillsEl.appendChild(pill);
  });

  // Experience
  const expEl = document.getElementById("experience-timeline");
  expEl.innerHTML = "";
  data.experience.forEach(e => {
    const item = document.createElement("div");
    item.className = "item";
    const bullets = (e.bullets || []).map(b => `<li>${b}</li>`).join("");
    item.innerHTML = `
      <div class="row">
        <div class="role">${e.role}</div>
        <div class="period">${e.period}</div>
      </div>
      <div class="company">${e.company}</div>
      <ul>${bullets}</ul>
    `;
    expEl.appendChild(item);
  });

  // Activities
  const actEl = document.getElementById("activities-grid");
  actEl.innerHTML = "";
  data.activities.forEach(a => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${a.title}</h3>
      <p>${a.desc}</p>
      ${a.url ? `<p><a href="${a.url}" target="_blank" rel="noopener">${a.linkText || "ดูเพิ่มเติม"}</a></p>` : ""}
    `;
    actEl.appendChild(card);
  });

  // Certificates
  const certEl = document.getElementById("certificates-grid");
  certEl.innerHTML = "";
  data.certificates.forEach(c => {
    const card = document.createElement("div");
    card.className = "card";
    const dateThai = c.date ? new Date(c.date + "-01").toLocaleDateString("th-TH", { year:"numeric", month:"short" }) : "";
    card.innerHTML = `
      <h3>${c.name}</h3>
      <p>ผู้ออกให้: <strong>${c.issuer}</strong></p>
      <p>${dateThai}</p>
      ${c.url ? `<p><a href="${c.url}" target="_blank" rel="noopener">ดูใบประกาศ</a></p>` : ""}
    `;
    certEl.appendChild(card);
  });

  // Contacts
  const contactEl = document.getElementById("contact-list");
  contactEl.innerHTML = "";
  (data.basics.contacts || []).forEach(ct => {
    const li = document.createElement("li");
    li.className = "contact-item";
    li.innerHTML = `
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm8 7 8-5H4l8 5zm0 2L4 8v10h16V8l-8 5z"/>
      </svg>
      <div>
        <div style="font-weight:600">${ct.type}</div>
        ${ct.url ? `<a href="${ct.url}" target="_blank" rel="noopener">${ct.value}</a>` : `<span>${ct.value}</span>`}
      </div>
    `;
    contactEl.appendChild(li);
  });

  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.getElementById("nav-links");
  toggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  navLinks.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      navLinks.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  // Active section highlighting (robust: pick highest intersection ratio)
  const links = Array.from(document.querySelectorAll('.nav-links a'));
  const sections = links.map(a => document.getElementById(a.getAttribute('data-section'))).filter(Boolean);

  function setActiveById(id) {
    links.forEach(a => a.classList.toggle('active', a.getAttribute('data-section') === id));
  }

  // Set active on click immediately to avoid 1-item shift while scrolling
  links.forEach(a => {
    a.addEventListener('click', () => setActiveById(a.getAttribute('data-section')));
  });

  const io = new IntersectionObserver((entries) => {
    // pick the entry with the largest intersection ratio that is intersecting
    let best = null;
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!best || entry.intersectionRatio > best.intersectionRatio) best = entry;
      }
    });
    if (best) setActiveById(best.target.id);
  }, {
    // Make the top 40% of viewport count, so we don't flip too early
    root: null,
    rootMargin: "0px 0px -40% 0px",
    threshold: [0.2, 0.4, 0.6, 0.8]
  });

  sections.forEach(sec => io.observe(sec));
})();