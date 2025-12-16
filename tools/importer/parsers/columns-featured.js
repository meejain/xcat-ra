/* global WebImporter */

/**
 * Parser for columns-featured block variant
 * Base block: columns
 * Purpose: Parse 2-column featured article layout (image left, content right)
 * Source: Research Affiliates homepage featured publication section
 * Generated: 2025-12-16
 */

export default function parse(element, { document }) {
  const cells = [];

  // Extract image
  const imageCell = document.createElement('div');
  const img = element.querySelector('img');
  if (img) {
    const newImg = document.createElement('img');
    newImg.src = img.src;
    newImg.alt = img.alt || '';
    imageCell.appendChild(newImg);
  }

  // Extract content (title, author, date, description)
  const contentCell = document.createElement('div');

  // Title (h2 or heading)
  const title = element.querySelector('.thumbnail__title, h2');
  if (title) {
    const h = document.createElement('strong');
    h.textContent = title.textContent.trim();
    contentCell.appendChild(h);
    contentCell.appendChild(document.createElement('br'));
    contentCell.appendChild(document.createElement('br'));
  }

  // Author
  const author = element.querySelector('.thumbnail__authors');
  if (author) {
    const authorText = document.createTextNode(author.textContent.trim());
    contentCell.appendChild(authorText);
    contentCell.appendChild(document.createElement('br'));
  }

  // Date
  const date = element.querySelector('.thumbnail__date');
  if (date) {
    const dateText = document.createTextNode(date.textContent.trim());
    contentCell.appendChild(dateText);
    contentCell.appendChild(document.createElement('br'));
    contentCell.appendChild(document.createElement('br'));
  }

  // Description
  const description = element.querySelector('.thumbnail__description');
  if (description) {
    const descText = document.createTextNode(description.textContent.trim());
    contentCell.appendChild(descText);
  }

  // Build 2-column row: [image] | [content]
  cells.push([imageCell, contentCell]);

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Columns-Featured',
    cells
  });

  element.replaceWith(block);
}
