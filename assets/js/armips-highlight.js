/*
 * Syntax highlighting for fenced armips, nessnes, and mips code blocks.
 * Runs in the browser so GitHub Pages does not need a custom Jekyll plugin.
 * armips syntax: https://github.com/Kingcom/armips/blob/master/Readme.md
 * nessnes extensions follow the examples in this site's NES posts.
 * This colors source text; it does not assemble or validate instructions.
 */
(function () {
  "use strict";

  var languages = ["armips", "nessnes", "mips"];
  var mipsRegister = /^\$?(?:zero|at|[vk][01]|a[0-3]|t[0-9]|s[0-8]|gp|sp|fp|ra|hi|lo|[rf]?(?:[12]?[0-9]|3[01]))$/i;
  var armRegister = /^(?:r(?:1[0-5]|[0-9])|sp|lr|pc|cpsr(?:_[a-z]+)?|spsr(?:_[a-z]+)?)$/i;
  var nesRegister = /^(?:a|x|y|s|sp|d|db|dbr|pb|pbr)$/i;
  var identifier = /^(?:@@?|\.)?[a-z_][\w.]*$/i;

  function appendToken(parent, value, className) {
    if (!className) {
      parent.appendChild(document.createTextNode(value));
      return;
    }
    var span = document.createElement("span");
    span.className = className;
    span.textContent = value;
    parent.appendChild(span);
  }

  function appendString(parent, value) {
    var span = document.createElement("span");
    span.className = "s";
    // Table control codes remain literal text, including their angle brackets.
    var controls = /<(?:[a-z_][a-z0-9_]*|[0-9a-f]{2})>/gi;
    var offset = 0;
    var match;
    while ((match = controls.exec(value)) !== null) {
      appendToken(span, value.slice(offset, match.index));
      appendToken(span, match[0], "si");
      offset = controls.lastIndex;
    }
    appendToken(span, value.slice(offset));
    parent.appendChild(span);
  }

  function architectureFor(directive, current) {
    if (/^\.(?:nes|snes)$/i.test(directive)) return "nes";
    if (/^\.(?:psx|ps2|psp|n64|rsp)$/i.test(directive)) return "mips";
    if (/^\.(?:gba|nds|3ds|arm(?:\.(?:big|little))?|thumb)$/i.test(directive)) return "arm";
    return current;
  }

  function isRegister(value, architecture) {
    if (architecture === "nes") return nesRegister.test(value);
    if (architecture === "mips") return mipsRegister.test(value);
    if (architecture === "arm") return armRegister.test(value);
    return mipsRegister.test(value) || armRegister.test(value);
  }

  function highlight(source, language) {
    var result = document.createDocumentFragment();
    var architecture = language === "nessnes" ? "nes" : language === "mips" ? "mips" : "auto";
    var statementStart = true;
    var continued = false;
    // Each alternative consumes a complete token. The last one preserves any
    // unrecognized character, including Korean text, without changing it.
    var tokens = /[ \t\f\v]+|\r\n|[\r\n]|;[^\r\n]*|\/\/[^\r\n]*|\/\*[\s\S]*?(?:\*\/|$)|"(?:\\[^\r\n]|[^"\\\r\n])*"?|'(?:\\[^\r\n]|[^'\\\r\n])*'?|::|0x[0-9a-f]+(?:\.[0-9a-f]+)?\b|0b[01]+\b|0o[0-7]+\b|[0-9][0-9a-f]*h\b|[01]+b\b|[0-7]+o\b|[0-9]+(?:\.[0-9]+)?(?:e[+-]?[0-9]+)?\b|\$[a-z0-9_]+|(?:@@?|\.)?[a-z_][\w.]*|[\s\S]/gi;
    var match;

    while ((match = tokens.exec(source)) !== null) {
      var value = match[0];
      var className = "";

      if (/^[ \t\f\v]+$/.test(value)) {
        appendToken(result, value);
        continue;
      }
      if (/^[\r\n]+$/.test(value)) {
        if (!continued) statementStart = true;
        continued = false;
        appendToken(result, value);
        continue;
      }
      if (/^(?:;|\/\/|\/\*)/.test(value)) {
        appendToken(result, value, "c1");
        if (/[\r\n]/.test(value)) {
          statementStart = true;
          continued = false;
        }
        continue;
      }
      if (value.charAt(0) === '"' || value.charAt(0) === "'") {
        appendString(result, value);
        statementStart = false;
        continue;
      }
      if (value === "::") {
        statementStart = true;
        className = "p";
      } else if (value === "\\") {
        continued = true;
        className = "p";
      } else if (/^[0-9]/.test(value)) {
        className = "m";
        statementStart = false;
      } else if (value.charAt(0) === "$") {
        // $a0 is a MIPS register, but a hex address in NES/SNES code.
        if (isRegister(value, architecture)) className = "nb";
        else if (/^\$[0-9a-f]+$/i.test(value)) className = "m";
        statementStart = false;
      } else if (identifier.test(value)) {
        var following = source.slice(tokens.lastIndex);
        if (/^[ \t]*:(?!:)/.test(following)) {
          className = "nl";
          statementStart = true;
        } else if (/^[ \t]+(?:equ\b|=(?!=))/i.test(following)) {
          className = "no";
          statementStart = false;
        } else if (statementStart && value.charAt(0) === ".") {
          className = "cp";
          architecture = architectureFor(value, architecture);
          statementStart = false;
        } else if (/^equ$/i.test(value)) {
          className = "cp";
          statementStart = false;
        } else if (statementStart) {
          // Instructions and user macro calls occupy the same statement slot.
          className = "k";
          statementStart = false;
        } else if (isRegister(value, architecture)) {
          className = "nb";
        } else if (/^@@?/.test(value)) {
          className = "nl";
        } else if (/^[ \t]*\(/.test(following)) {
          className = "nf";
        } else {
          className = "n";
        }
      } else if (value === ".") {
        className = "nl";
      } else if (/^[#~!%^&*+=|?<>/\-]$/.test(value)) {
        className = "o";
      } else if ("()[]{},:".indexOf(value) !== -1) {
        className = "p";
      }
      appendToken(result, value, className);
    }
    return result;
  }

  function highlightBlocks() {
    document.querySelectorAll(".page__content pre code").forEach(function (code) {
      if (code.classList.contains("armips-highlight")) return;
      var language = languages.find(function (name) {
        return code.closest(".language-" + name) || code.getAttribute("data-lang") === name;
      });
      if (!language) return;

      // Read the decoded code, then create only text nodes and token spans.
      // No assembly strings or comments are ever interpreted as HTML.
      var highlighted = highlight(code.textContent, language);
      var pre = code.closest("pre");
      if (!pre.closest("div.highlighter-rouge, figure.highlight")) {
        // Rouge leaves unknown languages as a bare <pre><code>. Restore the
        // theme's normal code box, font size, spacing, and copy-button markup.
        var wrapper = document.createElement("div");
        wrapper.className = "language-" + language + " highlighter-rouge";
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
      }
      pre.classList.add("highlight");
      code.replaceChildren(highlighted);
      code.classList.add("armips-highlight");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", highlightBlocks);
  } else {
    highlightBlocks();
  }
})();
