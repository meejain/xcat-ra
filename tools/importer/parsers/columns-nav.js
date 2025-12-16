/* global WebImporter */

/**
 * Parser for columns-nav block variant
 * Base block: columns
 * Purpose: Parse 4-column navigation grid with labels and descriptions
 * Source: Research Affiliates homepage hero section
 * Generated: 2025-12-16
 */

export default function parse(element, { document }) {
  const cells = [];

  // Extract all column items
  const columns = element.querySelectorAll('.ra-grid-col-1');

  if (columns.length === 0) {
    return;
  }

  // Build single row with all columns
  const row = [];
  columns.forEach((column) => {
    const cell = document.createElement('div');

    // Extract heading (bold label)
    const heading = column.querySelector('.font-whitney-bold');
    if (heading) {
      const h = document.createElement('strong');
      h.textContent = heading.textContent.trim();
      cell.appendChild(h);
      cell.appendChild(document.createElement('br'));
      cell.appendChild(document.createElement('br'));
    }

    // Extract description text
    const description = column.querySelector('.font-whitney-book');
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      cell.appendChild(p);
    }

    // Preserve link if present
    const link = column.querySelector('a');
    if (link && link.href) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = cell.textContent;
      cell.innerHTML = '';
      cell.appendChild(a);
    }

    row.push(cell);
  });

  cells.push(row);

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Columns-Nav',
    cells
  });

  element.replaceWith(block);
}
