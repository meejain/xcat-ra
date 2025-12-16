import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row, index) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-sidebar-card-image';
      else div.className = 'cards-sidebar-card-body';
    });

    // Make the first card (newsletter signup) clickable by wrapping in a link
    if (index === 0) {
      const cardBody = li.querySelector('.cards-sidebar-card-body');
      if (cardBody && cardBody.querySelector('a')) {
        const link = cardBody.querySelector('a');
        const href = link.href;
        const linkText = link.textContent;

        // Replace link with paragraph containing the text
        const p = document.createElement('p');
        p.textContent = linkText;
        link.replaceWith(p);

        // Wrap entire card in a link
        const wrapperLink = document.createElement('a');
        wrapperLink.href = href;
        wrapperLink.className = 'cards-sidebar-card-link';
        wrapperLink.style.cssText = 'display: block; width: 100%; height: 100%; text-decoration: none;';

        while (li.firstChild) {
          wrapperLink.appendChild(li.firstChild);
        }
        li.appendChild(wrapperLink);
      }
    }

    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.replaceChildren(ul);
}
