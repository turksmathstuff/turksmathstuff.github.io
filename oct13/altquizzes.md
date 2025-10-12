# Make an Alternate Versions → Markdown → DOCX Workflow

A concise, repeatable workflow to turn a PDF quiz into a clean, editable **.docx**—using Gemini and [Pandoc](https://pandoc.org/try/) or ChatGPT.

---

## What You’ll Need
- Your **PDF quiz**.
- Access to **Gemini** (or **ChatGPT**, but I used Gemini)
- Refined prompots that you're happy with.  I'll get you started.

---

## 1) Generate an Alternate Version (Same Difficulty)
Upload your original **PDF quiz** to ChatGPT.

> **💬 Prompt**  
> this is a pdf of a [subject] quiz.  can you create an alternate version that is of the same level of difficulty?  don't just arbitrarily change numbers, though!  the problems still need to make sense.

**Tips**
- More description is probably better.  I got good enough results with barebones prompts though.
- If any item feels off-level, ask for a rework of just that item.
- You can specify constraints like “keep the number of questions the same.”

---

## 2) Get a Markdown-Only Version (Ready for Pandoc)
Ask for a minimal, **no-explanations** Markdown code block you can convert to DOCX.

> **💬 Follow-up Prompt**  
> can you give me a markdown code block for the alternative quiz with:  
> no explanations; no problem descriptions, just numbers; no horizontal rule

**You should receive:** a fenced Markdown code block (```markdown … ```).  
Copy everything **inside** the code block.

---

## 3) Convert Markdown → DOCX (Online Pandoc)
1. Go to **[Pandoc](https://pandoc.org/try/)**.  
2. In the **From** dropdown, choose **Markdown**.  
3. In the **To** dropdown, choose **docx**.  
4. Paste your Markdown into the big text area.  
5. Click **Convert** (it’s very fast).  
6. Click **Download trypandoc.docx** to save the file.

---

## 4) Polish in Word (Fonts & Spacing)
- Rename the **trypandoc.docx** file.
- Open it.  
- Adjust fonts, margins, spacing, and numbering as you like.  
- Save it.

---

## Optional: Produce DOCX Directly in ChatGPT
If you prefer to skip the Pandoc step, you can have ChatGPT generate a downloadable **.docx** for you.

> **💬 Optional Prompt**  
> can you give me this as a downloadable docx? make sure bulleted lists are actually bulleted lists. no page breaks.

**Notes**
- Ask it to **preserve real bullets** (not dashes) and **avoid page breaks**.
- If you need strict formatting, Pandoc usually gives more consistent results.

---

## Troubleshooting & Tips
- **Weird spacing or line breaks?** In the Markdown stage, avoid horizontal rules and long lines of punctuation (these can convert oddly).  
- **Bullets not recognized in Word?** Ensure your Markdown uses `- ` (dash + space) or `* ` (asterisk + space) for list items—not plain dashes without a space.  



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
    var links = document.querySelectorAll('a[href^="http"]');
    var here = location.hostname;
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      if (a.hostname && a.hostname !== here) {
        a.target = "_blank";
        // security + performance: prevent tabnabbing & give new process
        var rel = (a.getAttribute("rel") || "").split(/\s+/);
        ["noopener", "noreferrer", "external"].forEach(function(x){
          if (rel.indexOf(x) === -1) rel.push(x);
        });
        a.setAttribute("rel", rel.join(" ").trim());
      }
    }
  })();
  
</script>
