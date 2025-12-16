/* global WebImporter */

/**
 * Parser for cards-publications block variant
 * Base block: cards
 * Purpose: Parse publication listing items with thumbnails and metadata
 * Source: Research Affiliates homepage publications section
 * Generated: 2025-12-16
 */

export default function parse(element, { document }) {
  const cells = [];

  // Find all publication items (thumbnail containers)
  const publications = element.querySelectorAll('.ra-component-thumbnail, .thumbnail__container');

  publications.forEach((pub) => {
    // Extract image
    const imageCell = document.createElement('div');
    const img = pub.querySelector('img');
    if (img) {
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt || '';
      imageCell.appendChild(newImg);
    }

    // Extract content (title, authors, date, description)
    const contentCell = document.createElement('div');

    // Title
    const title = pub.querySelector('.thumbnail__title, h2, h3');
    if (title) {
      const h = document.createElement('strong');
      h.textContent = title.textContent.trim();
      contentCell.appendChild(h);
      contentCell.appendChild(document.createElement('br'));
      contentCell.appendChild(document.createElement('br'));
    }

    // Authors
    const authors = pub.querySelector('.thumbnail__authors');
    if (authors) {
      const authorText = document.createTextNode(authors.textContent.trim());
      contentCell.appendChild(authorText);
      contentCell.appendChild(document.createElement('br'));
    }

    // Date
    const date = pub.querySelector('.thumbnail__date');
    if (date) {
      const dateText = document.createTextNode(date.textContent.trim());
      contentCell.appendChild(dateText);
      contentCell.appendChild(document.createElement('br'));
      contentCell.appendChild(document.createElement('br'));
    }

    // Description
    const description = pub.querySelector('.thumbnail__description');
    if (description) {
      const descText = document.createTextNode(description.textContent.trim());
      contentCell.appendChild(descText);
    }

    // Only add card if it has meaningful content
    if (title || (imageCell.hasChildNodes() && contentCell.hasChildNodes())) {
      cells.push([imageCell, contentCell]);
    }
  });

  if (cells.length === 0) {
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Cards-Publications',
    cells
  });

  element.replaceWith(block);
}
