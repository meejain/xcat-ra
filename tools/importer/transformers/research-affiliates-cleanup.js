/* global WebImporter */

/**
 * Transformer for Research Affiliates page cleanup
 * Purpose: Remove site-wide navigation, header, footer, and non-content elements
 * Applies to: All Research Affiliates pages (researchaffiliates.com)
 * Generated: 2025-12-16
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform'
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Initial cleanup - before block parsing
    // Remove navigation, region toggle, and other header elements

    WebImporter.DOMUtils.remove(element, [
      // Header and navigation - found in captured DOM
      '.ra-page-head',
      '.ra-component-navigation',
      '.ra-region-toggle',
      '.ra-nav-container',

      // Scripts and non-content elements
      'script',
      'noscript',
      'style',

      // Common utility elements
      '.ra-component-markup', // SVG/data URIs
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Final cleanup - after block parsing
    // Remove remaining unwanted elements

    WebImporter.DOMUtils.remove(element, [
      // Embedded content
      'iframe',
      'link',

      // Footer if present
      'footer',
      '.ra-page-foot',
    ]);
  }
}
