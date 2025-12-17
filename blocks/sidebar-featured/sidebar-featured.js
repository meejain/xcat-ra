import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (row) {
    const imageDiv = row.querySelector(':scope > div:first-child');
    const contentDiv = row.querySelector(':scope > div:last-child');

    if (imageDiv && contentDiv) {
      // Create clickable banner
      const link = contentDiv.querySelector('a');
      if (link) {
        const href = link.href;

        // Wrap entire block in link
        const wrapperLink = document.createElement('a');
        wrapperLink.href = href;
        wrapperLink.className = 'sidebar-featured-link';

        // Move image to wrapper
        const picture = imageDiv.querySelector('picture');
        if (picture) {
          wrapperLink.appendChild(picture);
        }

        // Clear and rebuild block
        block.textContent = '';
        block.appendChild(wrapperLink);
      }
    }
  }

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });
}
