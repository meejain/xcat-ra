export default function decorate(block) {
  const rows = [...block.children];
  const ul = document.createElement('ul');

  rows.forEach((row, index) => {
    if (index === 0) {
      // First row is the heading
      const heading = document.createElement('h3');
      heading.textContent = row.textContent.trim();
      heading.className = 'news-list-heading';
      block.insertBefore(heading, block.firstChild);
      row.remove();
    } else {
      // Regular news items
      const li = document.createElement('li');
      const content = row.querySelector('div');
      if (content) {
        // Parse the content to wrap the date in a span
        const html = content.innerHTML;
        const parts = html.split('<br>');
        if (parts.length === 3) {
          // Structure: source<br>title<br>date
          li.innerHTML = `${parts[0]}<br>${parts[1]}<br><span class="news-date">${parts[2]}</span>`;
        } else {
          li.innerHTML = html;
        }
      }
      ul.appendChild(li);
      row.remove();
    }
  });

  block.appendChild(ul);
}
