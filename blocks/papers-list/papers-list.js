export default function decorate(block) {
  const rows = [...block.children];
  const ul = document.createElement('ul');

  rows.forEach((row, index) => {
    if (index === 0) {
      // First row is the heading
      const heading = document.createElement('h3');
      heading.textContent = row.textContent.trim();
      heading.className = 'papers-list-heading';
      block.insertBefore(heading, block.firstChild);
      row.remove();
    } else {
      // Regular paper items
      const li = document.createElement('li');
      const content = row.querySelector('div');
      if (content) {
        li.innerHTML = content.innerHTML;
      }
      ul.appendChild(li);
      row.remove();
    }
  });

  block.appendChild(ul);
}
