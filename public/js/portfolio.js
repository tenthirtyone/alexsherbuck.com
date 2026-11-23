'use strict';

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
if (menuButton && navigation) {
  document.documentElement.classList.add('menu-enabled');
  menuButton.hidden = false;
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.lastElementChild.textContent = '+';
    navigation.classList.remove('is-open');
  };
  menuButton.addEventListener('click', () => {
    const opening = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(opening));
    menuButton.lastElementChild.textContent = opening ? '−' : '+';
    navigation.classList.toggle('is-open', opening);
  });
  navigation.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });
  window.matchMedia('(max-width: 700px)').addEventListener('change', closeMenu);
}

const tabList = document.querySelector('.expertise-tabs');
if (tabList) {
  const tabs = Array.from(tabList.querySelectorAll('[role="tab"]'));
  const selectTab = selected => {
    tabs.forEach(tab => {
      const active = tab === selected;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      const panel = document.getElementById(tab.getAttribute('aria-controls'));
      panel.hidden = !active;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tab.id);
      panel.tabIndex = 0;
    });
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      selectTab(tabs[next]);
      tabs[next].focus();
    });
  });
  selectTab(tabs[0]);
  document.documentElement.classList.add('tabs-enabled');
  tabList.hidden = false;
}

if ('IntersectionObserver' in window) {
  const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
  observer.observe(document.getElementById('top'));
  navLinks.forEach(link => {
    const section = document.querySelector(link.hash);
    if (section) observer.observe(section);
  });
}

const copyButton = document.getElementById('copy-email');
if (copyButton && navigator.clipboard && window.isSecureContext) {
  copyButton.hidden = false;
  const feedback = document.querySelector('.copy-feedback');
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('alexsherbuck@gmail.com');
      feedback.textContent = 'Email address copied.';
    } catch {
      feedback.textContent = 'Couldn’t copy. Select the email address above, or open it in your mail app.';
    }
  });
}
