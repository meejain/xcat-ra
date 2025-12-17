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

    // For the first card (newsletter signup), just ensure proper text structure
    if (index === 0) {
      const cardBody = li.querySelector('.cards-sidebar-card-body');
      if (cardBody && !cardBody.querySelector('p')) {
        // Wrap text content in a paragraph if not already wrapped
        const text = cardBody.textContent.trim();
        if (text) {
          const p = document.createElement('p');
          p.textContent = text;
          cardBody.innerHTML = '';
          cardBody.appendChild(p);
        }
      }
    }

    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.replaceChildren(ul);
}
