'use strict';

(() => {
  const designs = {
    original: { color: '#111513', description: 'Original · The charcoal and green portfolio you liked.' },
    briefing: { color: '#fcfcfa', description: 'Leadership Brief · A calm, portrait-led profile with current work first. Reference: Dan Guido.', source: 'https://illusivedan.com/', person: 'Dan Guido' },
    index: { color: '#080b0b', description: 'Protocol Index · A compact introduction and direct links to the work. Reference: Georgios Konstantopoulos.', source: 'https://gakonst.com/', person: 'Georgios Konstantopoulos' },
    dispatch: { color: '#17242e', description: 'Open Dispatch · Security writing leads; projects and experience follow. Reference: Ben Balter.', source: 'https://ben.balter.com/', person: 'Ben Balter' },
    ledger: { color: '#f3f1e9', description: 'Research Ledger · A masthead, research columns, and a project directory. Reference: Anders Brownworth.', source: 'https://andersbrownworth.com/', person: 'Anders Brownworth' },
    atlas: { color: '#31484a', description: 'Personal Atlas · A personal archive on a chart-like backdrop. Reference: Moxie Marlinspike.', source: 'https://moxie.org/', person: 'Moxie Marlinspike' },
    mission: { color: '#101721', description: 'Mission Control · A working console: choose a workspace from the sidebar.' },
    fieldnotes: { color: '#f4f0e6', description: 'Field Notes · An open notebook of projects, observations, and research.' },
    exhibition: { color: '#201a23', description: 'Exhibition · A gallery of work, with each project given its own stage.' }
  };
  const root = document.documentElement;
  const valid = value => Object.prototype.hasOwnProperty.call(designs, value);
  const requested = new URLSearchParams(location.search).get('design');
  const previewEnabled = valid(requested);
  let selected = previewEnabled ? requested : 'briefing';
  root.dataset.design = selected;
  document.querySelector('meta[name="theme-color"]').content = designs[selected].color;

  document.addEventListener('DOMContentLoaded', () => {
    const main = document.getElementById('main');
    // Move the actual sections, retaining their content, IDs, and event listeners.
    // Restoring these nodes restores the Original composition exactly.
    const sections = Array.from(main.children);
    const section = selector => sections.find(node => node.matches(selector));
    const bar = document.querySelector('.design-bar');
    const showButton = document.querySelector('.design-show');
    const picker = bar.querySelector('.design-select');
    const designOrder = Array.from(picker.options).map(option => option.value);
    const reference = bar.querySelector('.design-reference');
    const description = bar.querySelector('.design-description');
    const create = html => {
      const template = document.createElement('template');
      template.innerHTML = html;
      return template.content.firstElementChild;
    };
    const navLinks = `
      <a href="#top">Introduction</a><a href="#work">Selected work</a>
      <a href="#career">The path so far</a><a href="#expertise">Technical depth</a>
      <a href="#open-source">Open source</a><a href="#writing">Writing & citations</a>
      <a href="#about">Background</a><a href="#contact">Get in touch</a>`;
    const career = section('.career-section');
    const originalCareerId = career.id;
    let missionPanels = [];
    let missionLinks = [];
    const routes = { top: 'overview', work: 'projects', expertise: 'capabilities', 'open-source': 'code', writing: 'research', career: 'record', about: 'record', contact: 'contact' };

    const setMissionPanel = (hash, focus = false) => {
      const key = hash.replace('#', '');
      const route = Object.prototype.hasOwnProperty.call(routes, key) ? routes[key] : 'overview';
      missionPanels.forEach(panel => { panel.hidden = panel.dataset.workspace !== route; });
      missionLinks.forEach(link => {
        if (routes[link.hash.slice(1)] === route) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
      const active = missionPanels.find(panel => !panel.hidden);
      const label = missionLinks.find(link => routes[link.hash.slice(1)] === route);
      main.querySelector('.mission-breadcrumb').textContent = Array.from(label.childNodes).filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent).join('').trim();
      if (focus) {
        active.focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    };

    const renderPeer = () => {
      const pages = create(`<div class="peer-site peer-${selected}"></div>`);
      const simpleNav = `<a href="#work">Work</a><a href="#writing">Writing</a><a href="#open-source">Code</a><a href="#about">About</a><a href="resume.html">Résumé</a>`;
      const identity = `<a href="#top">Alex Sherbuck</a>`;
      const tail = (host, nodes) => host.append(...nodes);
      if (selected === 'briefing') {
        pages.append(create(`<header class="peer-header">${identity}<nav aria-label="Leadership profile navigation">${simpleNav}</nav></header>`));
        const intro = create('<div class="brief-intro"><p class="peer-kicker">Engineering leadership · Washington, DC</p><h1>Alex Sherbuck</h1></div>');
        intro.append(section('#top'));
        pages.append(intro, section('.impact-strip'));
        pages.append(create('<div class="brief-current"><span class="peer-kicker">Current focus</span><p>Leading projects at the U.S. Department of the Treasury.<br>Hands-on engineering, from architecture to delivery.</p></div>'));
        tail(pages, [section('#work'), section('#writing'), career, section('#expertise'), section('#open-source'), section('#about'), section('#contact')]);
      }
      if (selected === 'index') {
        pages.append(create(`<header class="index-header"><h1>Alex Sherbuck</h1><p>Engineering leader. Protocol engineer. Builder.</p><nav aria-label="Protocol index navigation">${simpleNav}</nav></header>`));
        pages.append(section('#top'));
        pages.append(create(`<ul class="index-links">
          <li>Currently leading projects at <a href="#work">U.S. Treasury</a> in Washington, DC.</li>
          <li>Previously built protocols at <a href="#work">Magic Eden</a>, developer tools at <a href="#open-source">ConsenSys</a>, and platforms at <a href="#career">UNICEF</a>.</li>
          <li>My <a href="#writing">Ethereum honeypot research</a> is cited in USENIX Security papers and ConsenSys materials.</li>
          <li>Explore my <a href="https://github.com/tenthirtyone">public code</a> or <a href="resume.html">read the full résumé</a>.</li>
        </ul>`));
        tail(pages, [section('#open-source'), section('#writing'), section('#work'), career, section('#expertise'), section('#about'), section('.impact-strip'), section('#contact')]);
      }
      if (selected === 'dispatch') {
        pages.append(create(`<header class="peer-header"><div class="dispatch-identity"><img src="img/profile-treasury.png" alt="" width="40" height="40">${identity}</div><nav aria-label="Dispatch navigation">${simpleNav}</nav></header>`));
        pages.append(create('<div class="dispatch-intro"><p class="peer-kicker">Engineering in public</p><h1>I build systems.<br><em>I share what I learn.</em></h1><p>Alex Sherbuck · Engineering lead at U.S. Treasury, Washington, DC.<br>AI platforms, blockchain protocols, and research from the work.</p></div>'));
        const reading = create('<section class="dispatch-reading" aria-labelledby="dispatch-reading-title"><h2 id="dispatch-reading-title">Start with the ideas</h2><div class="dispatch-grid"></div></section>');
        const articles = [section('#writing').querySelector('.featured-writing'), ...section('#writing').querySelectorAll('.more-writing>a')];
        articles.forEach((article, index) => {
          const sourceLink = article.matches('a') ? article : article.querySelector('h3 a');
          const card = document.createElement('a');
          card.className = 'dispatch-story';
          card.href = sourceLink.href;
          const date = document.createElement('span');
          date.className = 'peer-kicker';
          date.textContent = article.querySelector('.tag,.mono').textContent;
          const title = document.createElement('h3');
          title.textContent = article.querySelector('h3').textContent;
          const note = document.createElement('p');
          note.textContent = ['A deceptive Ethereum contract, a hidden trap, and the difference between source and behavior.', 'An exploration of unexpected ways Ether can enter a smart contract.', 'A look at the special privileges held by blockchain miners.'][index];
          const action = document.createElement('span');
          action.className = 'dispatch-read';
          action.textContent = 'Read on Medium';
          card.append(date, title, note, action);
          reading.querySelector('.dispatch-grid').append(card);
        });
        pages.append(reading);
        const profile = create('<div class="dispatch-profile"><h2>Behind the writing</h2></div>');
        profile.append(section('#top'));
        pages.append(profile);
        tail(pages, [section('#writing'), section('#work'), section('#open-source'), section('#expertise'), career, section('#about'), section('.impact-strip'), section('#contact')]);
      }
      if (selected === 'ledger') {
        pages.append(create(`<header class="ledger-masthead"><div><span>Engineering & research</span><span>Washington, DC</span></div><h1>Alex Sherbuck</h1><nav aria-label="Research ledger navigation">${simpleNav}</nav></header>`));
        const lead = create(`<div class="ledger-lead"><div class="ledger-profile"><p class="ledger-deck">Systems built. Knowledge shared.</p></div><aside class="ledger-directory"><h2>Find me</h2><a href="https://github.com/tenthirtyone"><span>GitHub</span>tenthirtyone</a><a href="https://medium.com/@alexsherbuck"><span>Medium</span>alexsherbuck</a><a href="https://www.linkedin.com/in/alexsherbuck/"><span>LinkedIn</span>Alex Sherbuck</a><h2>In this edition</h2><a href="#work">Public platforms & protocols</a><a href="#writing">Security writing & citations</a><a href="#open-source">Open-source projects</a><a href="#career">A decade of building</a></aside></div>`);
        lead.querySelector('.ledger-profile').append(section('#top'));
        pages.append(lead);
        tail(pages, [section('.impact-strip'), section('#writing'), section('#open-source'), section('#work'), career, section('#expertise'), section('#about'), section('#contact')]);
      }
      if (selected === 'atlas') {
        pages.append(create(`<header class="atlas-header"><a class="atlas-monogram" href="#top" aria-label="Alex Sherbuck home">AS</a><nav aria-label="Personal archive navigation"><a href="#top">About</a><a href="#work">Work</a><a href="#writing">Writing</a><a href="#open-source">Code</a><a href="#contact">Contact</a></nav></header>`));
        const paper = create('<div class="atlas-paper"><div class="atlas-title"><p class="peer-kicker">Alex Sherbuck · A personal collection</p><h1>About the builder.</h1></div></div>');
        paper.append(section('#top'));
        tail(paper, [section('#about'), section('#work'), section('#writing'), section('#open-source'), career, section('#expertise'), section('.impact-strip'), section('#contact')]);
        pages.append(paper);
      }
      main.replaceChildren(pages);
    };

    const render = () => {
      sections.forEach(node => { node.hidden = false; });
      main.replaceChildren(...sections);
      if (originalCareerId) career.id = originalCareerId;
      else career.removeAttribute('id');
      missionPanels = [];
      missionLinks = [];
      if (selected === 'original') return;
      career.id = 'career';
      if (designs[selected].source) { renderPeer(); return; }

      if (selected === 'mission') {
        const shell = create(`<div class="mission-shell">
          <aside class="mission-sidebar">
            <a class="mission-brand" href="#top"><span class="mission-emblem" aria-hidden="true">as.</span><span>Alex Sherbuck<small>Engineering portfolio</small></span></a>
            <p class="console-label">Workspaces</p>
            <nav class="mission-nav" aria-label="Portfolio workspaces">
              <a href="#top"><span aria-hidden="true">◫</span>Overview</a>
              <a href="#work"><span aria-hidden="true">▤</span>Projects</a>
              <a href="#expertise"><span aria-hidden="true">⌘</span>Capabilities</a>
              <a href="#open-source"><span aria-hidden="true">{ }</span>Source code</a>
              <a href="#writing"><span aria-hidden="true">≡</span>Research</a>
              <a href="#career"><span aria-hidden="true">◷</span>Career & background</a>
              <a href="#contact"><span aria-hidden="true">@</span>Contact</a>
            </nav>
            <div class="mission-assignment"><p class="console-label">Current assignment</p><strong>U.S. Treasury</strong><span>Engineering leadership<br>Washington, DC</span><a href="resume.html">Open résumé</a></div>
          </aside>
          <div class="mission-workspace">
            <header class="mission-toolbar"><span>PORTFOLIO / <strong class="mission-breadcrumb">Overview</strong></span><span>Alex Sherbuck · Washington, DC</span></header>
            <div class="mission-panels"></div>
          </div>
        </div>`);
        const panelHost = shell.querySelector('.mission-panels');
        const groups = {
          overview: [section('#top'), section('.impact-strip')],
          projects: [section('#work')], capabilities: [section('#expertise')],
          code: [section('#open-source')], research: [section('#writing')],
          record: [career, section('#about')], contact: [section('#contact')]
        };
        Object.entries(groups).forEach(([key, nodes]) => {
          const panel = create(`<div class="mission-panel" data-workspace="${key}" tabindex="-1"></div>`);
          if (key === 'overview') panel.append(create('<div class="mission-intro"><p class="console-label">Engineering / leadership / delivery</p><h1>Alex Sherbuck</h1><p>From complex requirements to working systems.</p></div>'));
          panel.append(...nodes);
          if (key === 'overview') {
            panel.append(create(`<div class="mission-launchpad">
              <a href="#work"><span class="console-label">Project portfolio</span><strong>Systems in the field</strong><span>Treasury, Magic Eden, UNICEF, and developer infrastructure.</span><b>Explore projects</b></a>
              <a href="#writing"><span class="console-label">Research archive</span><strong>Follow the evidence</strong><span>Ethereum security writing, cited by USENIX research and ConsenSys.</span><b>Open research</b></a>
            </div>`));
          }
          panelHost.append(panel);
        });
        main.replaceChildren(shell);
        missionPanels = Array.from(shell.querySelectorAll('.mission-panel'));
        missionLinks = Array.from(shell.querySelectorAll('.mission-nav a'));
        setMissionPanel(location.hash);
      }

      if (selected === 'fieldnotes') {
        const notebook = create(`<div class="field-notebook">
          <aside class="field-index"><a class="field-signature" href="#top">Alex<br> Sherbuck<span>Engineer & builder</span></a><p class="field-label">In this notebook</p><nav aria-label="Notebook contents">${navLinks}</nav><a class="field-resume" href="resume.html">Read my résumé</a></aside>
          <div class="field-pages"><header class="field-running-head"><span>Working notes · Alex Sherbuck</span><span>Washington, DC</span></header>
            <div class="field-cover"><p class="field-label">A personal record of things built & lessons shared</p><h1>Notes from<br><em>the work.</em></h1><div class="field-cover-content"></div></div>
            <div class="field-entries"></div>
          </div>
        </div>`);
        notebook.querySelector('.field-cover-content').append(section('#top'));
        notebook.querySelector('.field-entries').append(...sections.filter(node => node !== section('#top')));
        main.replaceChildren(notebook);
      }

      if (selected === 'exhibition') {
        const gallery = create(`<div class="exhibition-gallery">
          <header class="exhibition-header"><a href="#top">AS / Selected works</a><nav aria-label="Gallery navigation"><a href="#work">The work</a><a href="#writing">The ideas</a><a href="#contact">Say hello</a></nav></header>
          <div class="exhibition-cover"><div class="exhibition-title"><p>Engineering as a practice.</p><h1>Alex<br><span>Sherbuck</span></h1><div class="exhibition-disciplines">Public infrastructure<br>Protocol engineering<br>Ideas into systems</div></div><div class="exhibition-introduction"></div></div>
          <div class="exhibition-ribbon" aria-hidden="true">Systems. People. Possibilities.</div>
          <div class="exhibition-works"></div>
          <div class="exhibition-archive"><div class="exhibition-archive-title"><p class="eyebrow">Behind the work</p><h2>The practice.</h2></div></div>
        </div>`);
        gallery.querySelector('.exhibition-introduction').append(section('#top'));
        gallery.querySelector('.exhibition-works').append(section('#work'), section('.impact-strip'));
        gallery.querySelector('.exhibition-archive').append(section('#writing'), section('#expertise'), section('#open-source'), career, section('#about'), section('#contact'));
        main.replaceChildren(gallery);
      }
    };

    main.addEventListener('click', event => {
      const link = event.target.closest('a[href^="#"]');
      if (selected !== 'original' && selected !== 'mission' && link?.hash === '#top') {
        event.preventDefault();
        history.pushState(null, '', '#top');
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
      if (selected !== 'mission') return;
      if (!link || !routes[link.hash.slice(1)]) return;
      event.preventDefault();
      history.pushState(null, '', link.hash);
      setMissionPanel(link.hash, true);
    });
    window.addEventListener('hashchange', () => {
      if (selected === 'mission') setMissionPanel(location.hash, true);
    });
    const updateControls = () => {
      picker.value = selected;
      reference.hidden = !designs[selected].source;
      if (designs[selected].source) {
        reference.href = designs[selected].source;
        reference.textContent = `Reference: ${designs[selected].person}`;
      }
      description.textContent = designs[selected].description;
    };
    const measureBar = () => root.style.setProperty('--design-bar-height', `${bar.getBoundingClientRect().height + 32}px`);
    const applyDesign = choice => {
      selected = choice;
      root.dataset.design = selected;
      document.querySelector('meta[name="theme-color"]').content = designs[selected].color;
      const url = new URL(location.href);
      url.searchParams.set('design', selected);
      url.hash = 'top';
      history.replaceState(null, '', url);
      render();
      updateControls();
      window.scrollTo({ top: 0, behavior: 'instant' });
      measureBar();
    };
    picker.addEventListener('change', () => applyDesign(picker.value));
    const step = direction => applyDesign(designOrder[(designOrder.indexOf(selected) + direction + designOrder.length) % designOrder.length]);
    bar.querySelector('.design-previous').addEventListener('click', () => step(-1));
    bar.querySelector('.design-next').addEventListener('click', () => step(1));
    bar.querySelector('.design-hide').addEventListener('click', () => {
      bar.hidden = true;
      showButton.hidden = false;
      root.style.setProperty('--design-bar-height', '80px');
      showButton.focus({ preventScroll: true });
    });
    showButton.addEventListener('click', () => {
      showButton.hidden = true;
      bar.hidden = false;
      measureBar();
      picker.focus({ preventScroll: true });
    });
    render();
    updateControls();
    if (previewEnabled) {
      root.classList.add('design-preview-enabled');
      bar.hidden = false;
      measureBar();
    }
    if (selected !== 'mission' && location.hash && location.hash !== '#top') {
      const target = document.getElementById(location.hash.slice(1));
      if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: 'instant' }));
    }
    if ('ResizeObserver' in window) new ResizeObserver(() => { if (!bar.hidden) measureBar(); }).observe(bar);
  });
})();
