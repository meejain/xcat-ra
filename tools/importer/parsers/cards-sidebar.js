/* global WebImporter */

/**
 * Parser for cards-sidebar block variant
 * Base block: cards
 * Purpose: Parse compact sidebar items with small images and text
 * Source: Research Affiliates homepage sidebar section
 * Generated: 2025-12-16
 */

export default function parse(element, { document }) {
  const cells = [];

  // Find all card containers (multiple patterns possible)
  const cardContainers = element.querySelectorAll('.ra-component-container, .ra-component-image');

  cardContainers.forEach((container) => {
    // Extract image
    const imageCell = document.createElement('div');
    const img = container.querySelector('img');
    if (img) {
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt || '';
      imageCell.appendChild(newImg);
    }

    // Extract text content
    const contentCell = document.createElement('div');

    // Heading (could be in various elements)
    const heading = container.querySelector('.font-whitney-semibold-italic, .font-whitney-semibold, h2, h3, strong');
    if (heading) {
      const h = document.createElement('strong');
      h.textContent = heading.textContent.trim();
      contentCell.appendChild(h);
      contentCell.appendChild(document.createElement('br'));
      contentCell.appendChild(document.createElement('br'));
    }

    // Description/body text
    const textElements = container.querySelectorAll('.font-whitney-medium, p');
    textElements.forEach((text) => {
      if (text !== heading && text.textContent.trim()) {
        const p = document.createTextNode(text.textContent.trim());
        contentCell.appendChild(p);
        contentCell.appendChild(document.createElement('br'));
      }
    });

    // Check for links
    const link = container.querySelector('a');
    if (link && link.href && link.textContent.trim()) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent.includes('http') ? 'Learn more' : link.textContent.trim();
      contentCell.appendChild(document.createElement('br'));
      contentCell.appendChild(a);
    }

    // Only add card if it has content
    if (imageCell.hasChildNodes() || contentCell.hasChildNodes()) {
      cells.push([imageCell, contentCell]);
    }
  });

  if (cells.length === 0) {
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Cards-Sidebar',
    cells
  });

  element.replaceWith(block);
}
