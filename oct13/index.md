# Welcome to the October 13 PD 👋

We’ve got the morning to get to know AI—and maybe even each other—a little better!

We’ll work through the links below **in order, together**. I’ll leave this page on my site (kind of hidden, so keep the link!) for a while… maybe forever?

<hr />

## Jump in

- [Alternate Versions of Quizzes](/oct13/altquizzes)
- [A Gmail Add-On](/oct13/mail-to-doc)
- [Using NotebookLM](/oct13/notebooklm)

---





<style>
/* Show a copy button on hover for code blocks */
pre {
  position: relative;
}
.copy-btn {
  position: absolute;
  top: .5rem;
  right: .5rem;
  padding: .25rem .5rem;
  font-size: .8rem;
  border: 1px solid #ccc;
  border-radius: .35rem;
  background: #f6f8fa;
  cursor: pointer;
  opacity: 0;
  transition: opacity .15s ease-in-out, background .15s;
}
pre:hover .copy-btn { opacity: 1; }
.copy-btn:active { background: #e9ecef; }
.copy-btn.copied {
  background: #d1e7dd;
  border-color: #badbcc;
}
</style>

<script>
(function () {
  function addCopyButtons() {
    document.querySelectorAll('pre > code').forEach(function (codeBlock) {
      const pre = codeBlock.parentNode;
      if (pre.querySelector('.copy-btn')) return; // avoid duplicates

      const button = document.createElement('button');
      button.className = 'copy-btn';
      button.type = 'button';
      button.setAttribute('aria-label', 'Copy code to clipboard');
      button.textContent = 'Copy';

      button.addEventListener('click', async function () {
        const text = codeBlock.innerText; // preserves newlines
        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
          } else {
            // Fallback for older browsers
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.top = '-9999px';
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
          }
          const old = button.textContent;
          button.textContent = 'Copied!';
          button.classList.add('copied');
          setTimeout(() => { button.textContent = old; button.classList.remove('copied'); }, 1500);
        } catch (e) {
          console.error('Copy failed', e);
          button.textContent = 'Error';
          setTimeout(() => (button.textContent = 'Copy'), 1500);
        }
      });

      pre.appendChild(button);
    });
  }

  // Run on load (and again after client-side nav if your theme uses it)
  document.addEventListener('DOMContentLoaded', addCopyButtons);
})();

    (function () {
    // Select all <a> tags on the page
    var links = document.querySelectorAll("a");

    // Loop through every link
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      
      // Set the target to "_blank" unconditionally
      a.target = "_blank";
      
      // Add "noopener" and "noreferrer" for security
      var rel = (a.getAttribute("rel") || "").split(/\s+/);
      ["noopener", "noreferrer"].forEach(function(x){
        if (rel.indexOf(x) === -1) rel.push(x);
      });
      a.setAttribute("rel", rel.join(" ").trim());
    }
  })();
  
</script>
