<style>
.callout {
  border-left: 6px solid #2da44e;
  background: #f0fff4;
  padding: .9rem 1rem;
  margin: 1rem 0;
  border-radius: .5rem;
}
.callout .title {
  font-weight: 700;
  margin-bottom: .35rem;
}
</style>


# Gemini Overview

Talk to it like a normal person who’s just really good at tons of things.

- At the bottom of each response you’ll see: **Redo**, **Share & Export**, **Copy**, **More**  
  - **Share & Export** can go straight to Google Docs or Gmail drafts.  
  - **Copy** is what I use the most by far.

<div class="callout">
  <div class="title">💡 Pro tip</div>
  Never forget that the AI will help you improve your prompt if you just ask!
</div>

---

## For Teachers

### 1) Let it help you with your inbox
Ask Gemini to scan your inbox and sort messages by how quick they are to handle.

> **💬 Prompt**

 ```text
 can you help me prioritize the emails in my inbox from easiest to deal with to hardest?
 ```

### 2) Find nearly-empty files in Drive
Great for spring-cleaning your Google Drive. It can also return links.

> **💬 Prompt**

 ```text
 can you look through my google drive and tell me how many files are basically empty?
 please list them with links if possible.
 ```

 **Note:** You may be asked to grant read access to Gmail/Drive the first time.

---

### 3) Have It Build a Webpage for Your Lesson

Ask for a single-file, modern page with HTML/CSS/JS/MathJax and built-in practice.

> **💬 Prompt**

 ```text
 I have to teach about asymptotes of rational functions tomorrow and I'd like to have a detailed,
modern looking webpage to use that will generate questions for my students to answer.
the questions should give a rational function (in factored form) and ask for asymptotes
(vertical, horizontal, and slant), removable discontinuities, and zeros.
Please use html5, javascript, css, mathjax, and any other tools you think will give the best result.
I'd like it all in one single file.
 ```

---

## For Students (and Lifelong Learners)

### Ask it to quiz you
Have Gemini generate targeted practice—interactive if possible.

> **💬 Prompt**

 ```text
 can you give me 10 problems on finding antiderivatives that require either long division or completing the square?
i'd like them to be at an ap calculus level.
 ```

> **💬 Prompt**

 ```text
 i need to practice for a geometry quiz on congruent triangles. it's honors level. can you give me some quiz questions?
 ```

### Ask for flashcards
Great for quick review sets.

> **💬 Prompt**

 ```text
 can you give me some interactive flashcards for the topic of segments in circles?
 ```

---

## Just for Fun

- You can **edit images** (add/remove objects, stylize, etc.). It’s hit-or-miss but often impressive.

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
