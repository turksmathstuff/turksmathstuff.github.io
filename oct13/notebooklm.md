# NotebookLM: Let's actually do something

---
I find it frustrating that people talk about NotebookLM but never show one working well.  Let's see what we can do.

---
## 1) Create a Notebook
1. Open [**NotebookLM**](https://notebooklm.google/).
2. Click **Create new notebook** and give it a name.

---

## 2) Add Sources (from Google Drive)
1. In your new notebook, go to **Sources** and click **Add**.
2. Choose **Google Drive** → select your **Google Doc(s)/Slide(s)** → **Add**.
   - You can also add PDFs, URLs, or YouTube later if you like.

> **Note on supported sources:** Google Docs and Slides, PDFs, web URLs, and YouTube are supported.  
> Google Sheets are **NOT** currently supported.  You _can_ copy/paste into a Google Doc though.
> You can have a maximum of 50 sources.  But they can be LONG, so combine things.

---

## 3) Chat with Your Sources (Ask Questions)
Use the **Chat** panel to ask questions grounded in your added sources. Patterns that work well:

- **Direct questions**
  - “Who sends the most emails?”
  - “Can you give me information about class meetings?”

- **Compare/contrast**
  - “Compare the strategies in Doc A vs Doc B and list pros/cons.”
  - “Where do my two sources disagree? Cite the lines/sections.”

- **Extract & transform**
  - “Turn the section on ‘Chain Rule’ into a 5-item checklist.”
  - “Pull all definitions and create a glossary with short examples.”

- **Plan & create artifacts**
  - “Create a 15-minute lesson outline based on these two docs.”
  - “Draft 5 practice questions and provide concise solutions.”

**Tips**
- Reference sources by name (“From ‘AP Calc Notes 05’…”) to keep answers tightly grounded.
- Ask for **citations** or **section references** when you need traceability.
- You can turn sources on and off with the checkboxes.

---

## 4) Make a Mind Map (Studio)
1. With your sources added, open the notebook.
2. In **Chat**, click the **Mind Map** chip.
3. The generated mind map appears as a new note in **Studio**. You can edit, regenerate, or export it.

---

## 5) Keep Sources in Sync (when your Drive files change)
If you update a linked Google Doc/Slide (e.g., via your add-on), refresh it in NotebookLM:

1. Open the notebook and go to **Sources**.
2. Click the specific source (Doc/Slide) to open its viewer.
3. If changes are detected, click **Sync with Google Drive** (or the visible sync button) to pull the latest version.

**Notes**
- The sync control appears only when NotebookLM detects a newer version in Drive.
- If you don’t see a sync button, close/reopen the source viewer or the notebook to refresh.

---

## Troubleshooting
- **Can’t find a Drive file:** Confirm you’re signed in with the account that owns/has access to the file.
- **Sync button not appearing:** Ensure the Drive file actually changed (has new edits), then re-open the source viewer.

---



<script>
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
