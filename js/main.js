/* ============================================
   Studievereniging Aperture — Main JS
   ============================================ */

// --- Content loader ---
let siteData = null;

async function loadContent() {
  const resp = await fetch('data/content.json');
  siteData = await resp.json();
  return siteData;
}

// --- Navigation ---
function buildNav(data) {
  const nav = document.querySelector('.nav-links');
  if (!nav) return;
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  nav.innerHTML = data.navigation.map(item => {
    const isActive = item.href === currentPage || (item.href === 'index.html' && (currentPage === '' || currentPage === '/'));
    return `<li><a href="${item.href}" class="${isActive ? 'active' : ''}">${item.label}</a></li>`;
  }).join('');
}

function setupMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav-links');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    const isOpen = nav.classList.contains('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });
  // Close on link click
  nav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') nav.classList.remove('open');
  });
}

// --- Footer ---
function buildFooter(data) {
  const footer = document.querySelector('.site-footer .container');
  if (!footer) return;
  footer.innerHTML = `
    <div class="footer-links">
      <a href="https://www.instagram.com/msp_aperture/" target="_blank" rel="noopener">Instagram</a>
      <a href="mailto:${data.contact.email}">${data.contact.email}</a>
    </div>
    <p>&copy; ${new Date().getFullYear()} ${data.footer.copyright} &middot; KvK ${data.footer.kvk}</p>
  `;
}

// --- Slideshow ---
function initSlideshow() {
  const container = document.querySelector('.slideshow');
  if (!container) return;
  const slides = container.querySelectorAll('.slide');
  const dots = container.querySelectorAll('.slideshow-dot');
  if (slides.length === 0) return;
  let current = 0;
  let timer;

  function goTo(i) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = i % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function next() { goTo(current + 1); }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(next, 5000);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startAuto(); });
  });

  // Pause on hover
  container.addEventListener('mouseenter', () => clearInterval(timer));
  container.addEventListener('mouseleave', startAuto);

  startAuto();
}

// --- Page-specific renderers ---

function renderHome(data) {
  // Slideshow — colorful Aperture-themed slides
  const ss = document.getElementById('homeSlideshow');
  if (ss) {
    const slideColors = [
      'linear-gradient(135deg, #D94880, #C64B99, #8B4DAB)',
      'linear-gradient(135deg, #4B5EBD, #5BC0DE, #8BC34A)',
      'linear-gradient(135deg, #E5A83B, #C96B3C, #D94880)'
    ];
    ss.innerHTML = data.home.slideshow.map((s, i) => `
      <div class="slide ${i === 0 ? 'active' : ''}">
        <div class="slide-color-bg" style="background:${slideColors[i % slideColors.length]};background-size:200% 200%;"></div>
        <div class="slide-blobs">
          <span class="slide-blob sb-1"></span>
          <span class="slide-blob sb-2"></span>
          <span class="slide-blob sb-3"></span>
        </div>
        <div class="slide-center-content">
          <h2 class="slide-big-title">${s.title}</h2>
          <p class="slide-big-subtitle">${s.subtitle}</p>
          <a href="${s.link}" class="slide-link">Explore</a>
        </div>
      </div>
    `).join('') + `
      <div class="slideshow-dots">
        ${data.home.slideshow.map((_, i) => `<button class="slideshow-dot ${i === 0 ? 'active' : ''}" aria-label="Slide ${i + 1}"></button>`).join('')}
      </div>
    `;
    initSlideshow();
  }

  // Board
  const board = document.getElementById('boardGrid');
  if (board) {
    board.innerHTML = data.board.members.map(m => `
      <div class="board-member">
        <div class="name">${m.name}</div>
        <div class="role">${m.role}</div>
      </div>
    `).join('');
  }

  const boardYear = document.getElementById('boardYear');
  if (boardYear) boardYear.textContent = data.board.year;

  // Quick links
  const ql = document.getElementById('quickLinks');
  if (ql) {
    const icons = {
      users: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      calendar: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
      'shopping-bag': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
      mail: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>'
    };
    ql.innerHTML = data.home.quickLinks.map(l => `
      <a href="${l.href}" class="quick-link">
        <div class="quick-link-icon">${icons[l.icon] || ''}</div>
        ${l.label}
      </a>
    `).join('');
  }
}

function renderCommittees(data) {
  const grid = document.getElementById('committeesGrid');
  if (!grid) return;
  const committees = data.committees.list.filter(c => c.type === 'committee');
  const clubs = data.committees.list.filter(c => c.type === 'club');

  // Description
  const intro = document.getElementById('committeesIntro');
  if (intro) {
    intro.innerHTML = `
      <p>${data.committees.intro.committeesDescription}</p>
      <p class="mt-2">${data.committees.intro.clubsDescription}</p>
      <p class="mt-2"><strong>${data.committees.intro.callToAction}</strong></p>
    `;
  }

  function cardHTML(item) {
    const tag = item.type === 'committee'
      ? '<span class="card-tag committee">Committee</span>'
      : '<span class="card-tag club">Club</span>';
    const links = [];
    if (item.instagram) links.push(`<a href="${item.instagram}" target="_blank" rel="noopener">Instagram</a>`);
    if (item.signupLink) links.push(`<a href="${item.signupLink}" target="_blank" rel="noopener" class="btn" style="margin-top:0.5rem;display:inline-block;">Sign up</a>`);
    return `
      <div class="card">
        ${tag}
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        ${item.president ? `<p class="mt-1" style="font-size:0.8rem;color:var(--clr-text-muted);">President: ${item.president}</p>` : ''}
        ${links.length ? `<div class="mt-1">${links.join(' ')}</div>` : ''}
      </div>
    `;
  }

  grid.innerHTML =
    '<h2 class="section-title mb-2">Committees</h2>' +
    '<div class="card-grid mb-3">' + committees.map(cardHTML).join('') + '</div>' +
    '<h2 class="section-title mb-2 mt-4">Clubs</h2>' +
    '<div class="card-grid">' + clubs.map(cardHTML).join('') + '</div>';
}

function renderEvents(data) {
  const list = document.getElementById('eventsList');
  if (!list) return;

  if (data.events.upcoming.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <p>No upcoming events right now.</p>
        <span class="hint">Follow us on <a href="${data.contact.socials.instagram}" target="_blank" rel="noopener">Instagram</a> or join our WhatsApp for announcements!</span>
      </div>
    `;
  } else {
    list.innerHTML = data.events.upcoming.map(ev => {
      const d = new Date(ev.date);
      const month = d.toLocaleString('en', { month: 'short' }).toUpperCase();
      const day = d.getDate();
      return `
        <div class="event-card">
          <div class="event-date-box">
            <span class="month">${month}</span>
            <span class="day">${day}</span>
          </div>
          <div class="event-info">
            <h3>${ev.title}</h3>
            <div class="event-meta">${ev.time ? ev.time + ' · ' : ''}${ev.location || ''} ${ev.organiser ? '· ' + ev.organiser : ''}</div>
            <p>${ev.description}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  // Traditions
  const traditions = document.getElementById('traditionsGrid');
  if (traditions && data.events.traditions) {
    const iconMap = {
      moon: '\u{1F319}', party: '\u{1F389}', rocket: '\u{1F680}',
      handshake: '\u{1F91D}', book: '\u{1F4DA}', pizza: '\u{1F355}'
    };
    traditions.innerHTML = data.events.traditions.map(t => `
      <div class="tradition-card">
        <div class="tradition-icon">${iconMap[t.icon] || ''}</div>
        <div>
          <h3>${t.name}</h3>
          <p>${t.description}</p>
        </div>
      </div>
    `).join('');
  }
}

function renderChronicle(data) {
  const grid = document.getElementById('chronicleGrid');
  if (!grid) return;
  grid.innerHTML = data.chronicle.issues.map(issue => `
    <div class="chronicle-card">
      <div class="chronicle-cover placeholder-img">${issue.title}</div>
      <div class="card-body">
        <h3>${issue.title}</h3>
        <div class="date">${issue.date}</div>
        <p>${issue.description}</p>
        <a href="${issue.pdf}" class="btn btn-outline" download>Download PDF</a>
      </div>
    </div>
  `).join('');
}

function renderMerch(data) {
  const list = document.getElementById('merchList');
  if (!list) return;
  list.innerHTML = data.merch.items.map(item => `
    <div class="merch-item">
      <div class="merch-images">
        ${item.images.map(img => `<div class="placeholder-img" style="aspect-ratio:1;border-radius:var(--radius);">${item.name}</div>`).join('')}
      </div>
      <div class="merch-details">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        ${item.price ? `<div class="merch-price">${item.price}</div>` : ''}
        <span class="merch-status ${item.available ? 'available' : 'unavailable'}">
          ${item.available ? 'Available now' : 'Not available'}
        </span>
        <p class="mt-1" style="font-size:0.85rem;">${item.nextSale}</p>
        ${item.available && item.orderLink ? `<a href="${item.orderLink}" class="btn mt-2" target="_blank" rel="noopener">Order now</a>` : ''}
      </div>
    </div>
  `).join('');

  const howTo = document.getElementById('merchHowTo');
  if (howTo) {
    howTo.innerHTML = `<h3>How to Order</h3><p>${data.merch.howToOrder}</p>`;
  }

  const desc = document.getElementById('merchDesc');
  if (desc) desc.textContent = data.merch.description;
}

function renderContact(data) {
  const addr = document.getElementById('contactAddress');
  if (addr) {
    const a = data.contact.address;
    addr.innerHTML = `
      <p>${a.line1}<br>${a.line2}<br>${a.line3}<br>${a.country}</p>
    `;
  }

  const hours = document.getElementById('officeHours');
  if (hours && data.contact.officeHours) {
    hours.textContent = data.contact.officeHours;
  }

  const email = document.getElementById('contactEmail');
  if (email) {
    email.innerHTML = `<a href="mailto:${data.contact.email}">${data.contact.email}</a>`;
  }

  const socials = document.getElementById('contactSocials');
  if (socials) {
    const links = [];
    if (data.contact.socials.instagram) links.push(`<a href="${data.contact.socials.instagram}" target="_blank" rel="noopener" class="social-link">Instagram</a>`);
    if (data.contact.socials.linktree) links.push(`<a href="${data.contact.socials.linktree}" target="_blank" rel="noopener" class="social-link">Linktree</a>`);
    socials.innerHTML = links.join('');
  }

  // Contact form (mailto fallback — works without a server)
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('[name="name"]').value;
      const email = form.querySelector('[name="email"]').value;
      const msg = form.querySelector('[name="message"]').value;
      const subject = encodeURIComponent(`Website contact from ${name}`);
      const body = encodeURIComponent(`From: ${name} (${email})\n\n${msg}`);
      window.location.href = `mailto:${data.contact.email}?subject=${subject}&body=${body}`;
    });
  }
}

function renderAbout(data) {
  // Facts
  const facts = document.getElementById('aboutFacts');
  if (facts) {
    facts.innerHTML = data.about.what.facts.map(f => `<li>${f}</li>`).join('');
  }

  // Get Involved
  const involve = document.getElementById('involveGrid');
  if (involve) {
    involve.innerHTML = data.about.getInvolved.options.map(o => `
      <div class="involve-card">
        <h3>${o.title}</h3>
        <p>${o.description}</p>
      </div>
    `).join('');
  }

  // Timeline
  const timeline = document.getElementById('historyTimeline');
  if (timeline) {
    timeline.innerHTML = data.about.history.timeline.map(t => `
      <div class="timeline-item">
        <div class="timeline-year">${t.year}</div>
        <p>${t.text}</p>
      </div>
    `).join('');
  }

  // Past boards
  const boards = document.getElementById('pastBoards');
  if (boards) {
    boards.innerHTML = data.about.pastBoards.map(b => `
      <div class="past-board">
        <span class="year">${b.year}</span>
        <span class="members">${b.members}</span>
      </div>
    `).join('');
  }
}

// --- Init ---
document.addEventListener('DOMContentLoaded', async () => {
  const data = await loadContent();
  buildNav(data);
  buildFooter(data);
  setupMobileNav();

  // Page-specific rendering
  const page = document.body.dataset.page;
  switch (page) {
    case 'home': renderHome(data); break;
    case 'about': renderAbout(data); break;
    case 'committees': renderCommittees(data); break;
    case 'events': renderEvents(data); break;
    case 'chronicle': renderChronicle(data); break;
    case 'merch': renderMerch(data); break;
    case 'contact': renderContact(data); break;
  }
});
