import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.nav-sections > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  if (navSections) {
    toggleAllNavSections(navSections, expanded || isDesktop.matches ? false : true);
  }
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  if (navSections) {
    const navDrops = navSections.querySelectorAll('.nav-drop');
    if (isDesktop.matches) {
      navDrops.forEach((drop) => {
        if (!drop.hasAttribute('tabindex')) {
          drop.setAttribute('tabindex', 0);
          drop.addEventListener('focus', focusNavSection);
        }
      });
    } else {
      navDrops.forEach((drop) => {
        drop.removeAttribute('tabindex');
        drop.removeEventListener('focus', focusNavSection);
      });
    }
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // Define navigation structure directly to avoid AEM server flattening nested HTML
  const navData = {
    brand: {
      href: '/home',
      logo: './images/header-logo.svg',
      alt: 'Research Affiliates'
    },
    sections: [
      {
        title: 'Insights',
        href: '/insights/publications',
        items: [
          { title: 'RA Publications', href: '/insights/publications' },
          { title: 'Journal & Working Papers', href: '/insights/journal-papers' },
          { title: 'JPM 50th Series', href: '/insights/jpm-50-tribute' },
          { title: 'Multimedia', href: '/insights/multimedia' },
          { title: 'Explore Smart Beta', href: '/insights/smart-beta' },
          { title: 'ESG Investing', href: '/insights/esg' }
        ]
      },
      {
        title: 'Solutions',
        href: '/solutions'
      },
      {
        title: 'Tools',
        href: 'https://interactive.researchaffiliates.com/asset-allocation'
      },
      {
        title: 'How to Invest',
        href: '/how-to-invest/mutual-funds-etfs',
        items: [
          { title: 'Mutual Funds & ETFs', href: '/how-to-invest/mutual-funds-etfs' },
          { title: 'Institutional, SMAs, and Commingled', href: '/how-to-invest/institutional' }
        ]
      },
      {
        title: 'Our Company',
        href: '/about-us',
        items: [
          { title: 'About Us', href: '/about-us' },
          { title: 'Our Team', href: '/about-us/our-team' },
          { title: 'Careers', href: '/about-us/careers' },
          { title: 'Technology', href: '/about-us/technology' },
          { title: 'Contact Us', href: '/about-us/contact-us' },
          { title: 'In the News', href: '/about-us/in-the-news' }
        ]
      }
    ],
    tools: [
      { title: 'Log in / Subscribe', href: '/subscribe' },
      { title: 'Search', href: '/search' }
    ]
  };

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';

  // Build brand section
  const brandP = document.createElement('p');
  brandP.className = 'nav-brand';
  const brandLink = document.createElement('a');
  brandLink.href = navData.brand.href;
  const brandImg = document.createElement('img');
  brandImg.src = navData.brand.logo;
  brandImg.alt = navData.brand.alt;
  brandLink.append(brandImg);
  brandP.append(brandLink);
  nav.append(brandP);

  // Build sections
  const sectionsUl = document.createElement('ul');
  sectionsUl.className = 'nav-sections';
  navData.sections.forEach((section) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = section.href;
    a.textContent = section.title;
    li.append(a);

    // Add dropdown items if they exist
    if (section.items && section.items.length > 0) {
      const dropdownUl = document.createElement('ul');
      section.items.forEach((item) => {
        const dropdownLi = document.createElement('li');
        const dropdownA = document.createElement('a');
        dropdownA.href = item.href;
        dropdownA.textContent = item.title;
        dropdownLi.append(dropdownA);
        dropdownUl.append(dropdownLi);
      });
      li.append(dropdownUl);
    }

    sectionsUl.append(li);
  });
  nav.append(sectionsUl);

  // Build tools section
  const toolsUl = document.createElement('ul');
  toolsUl.className = 'nav-tools';
  navData.tools.forEach((tool) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = tool.href;
    a.textContent = tool.title;
    li.append(a);
    toolsUl.append(li);
  });
  nav.append(toolsUl);

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) {
        navSection.classList.add('nav-drop');
        // Prevent link navigation on items with dropdowns
        const link = navSection.querySelector(':scope > a');
        if (link) {
          link.addEventListener('click', (e) => {
            if (isDesktop.matches) {
              e.preventDefault();
            }
          });
        }
      }

      // Use hover on desktop, click on mobile
      if (navSection.classList.contains('nav-drop')) {
        navSection.addEventListener('mouseenter', () => {
          if (isDesktop.matches) {
            toggleAllNavSections(navSections);
            navSection.setAttribute('aria-expanded', 'true');
          }
        });
        navSection.addEventListener('mouseleave', () => {
          if (isDesktop.matches) {
            navSection.setAttribute('aria-expanded', 'false');
          }
        });
      }

      navSection.addEventListener('click', () => {
        if (!isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  // Initialize all dropdown sections as collapsed
  if (navSections) {
    toggleAllNavSections(navSections, false);
  }

  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
