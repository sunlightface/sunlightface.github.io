(function () {
  "use strict";

  function markBoldParagraphs() {
    document.querySelectorAll(".page__content p").forEach(function (paragraph) {
      // Inspect text nodes too: a paragraph containing both normal text and
      // a single <strong> element must keep its normal paragraph spacing.
      var content = Array.from(paragraph.childNodes).filter(function (node) {
        return node.nodeType !== Node.COMMENT_NODE &&
          !(node.nodeType === Node.TEXT_NODE && node.textContent.trim() === "");
      });
      var boldOnly = content.length > 0 && content.every(function (node) {
        return node.nodeType === Node.ELEMENT_NODE && node.matches("strong, b");
      });
      paragraph.classList.toggle("paragraph--bold-only", boldOnly);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", markBoldParagraphs);
  } else {
    markBoldParagraphs();
  }
})();
