# Guide: "Mail-to-Doc" Gmail Add-on

This guide walks you through the entire process of creating a personal Gmail add-on from scratch. This tool allows you to save any email to a specific Google Doc, automatically removing repetitive footer text (not working...). You can choose from previously used documents or create new ones on the fly, right from your Gmail sidebar.

## How It Works
When you open an email, this add-on will appear in the right-hand sidebar.
- **On first use:** It will show one button: "Save to a New Doc...".
- **Creating a new doc:** It will ask you to name a new Google Doc, create it in your Drive, and save the current email to it.
- **Subsequent uses:** It will remember every doc you've created and show a button for each one, allowing you to quickly save related emails to the same place.

---

## Part 1: Creating the Apps Script Project

First, we need to create a new project in Google's scripting environment.

1.  Open a new browser tab and go to **https://script.new**.
2.  This will immediately create and open a new, untitled Google Apps Script project. You can give it a name at the top left, for example, "Save Email Add-on".

---

## Part 2: Configuring the Project (The "Manifest" File)

The `appsscript.json` file, also known as the manifest, tells Google what your project is, what permissions it needs, and how it should behave inside Gmail.

1.  In the left sidebar of the Apps Script editor, click the **Project Settings** icon (it looks like a gear ⚙️).
2.  In the settings page, find the section called "General" and check the boxes that say **Enable Chrome V8 runtime** and **Show "appsscript.json" manifest file in editor**.
3.  Return to the **Editor** view by clicking the code icon (`</>`) in the left sidebar. You will now see a new file named `appsscript.json`.
4.  Click on the `appsscript.json` file to open it.
5.  Delete all of the default content in that file and **copy/paste the entire block of code below** into it.

```json
{
  "timeZone": "America/New_York",
  "dependencies": {},
  "oauthScopes": [
    "https://www.googleapis.com/auth/script.container.ui",
    "https://www.googleapis.com/auth/gmail.addons.execute",
    "https://www.googleapis.com/auth/gmail.addons.current.message.readonly",
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/documents",
    "https://www.googleapis.com/auth/drive.file"
  ],
  "addOns": {
    "common": {
      "name": "Save Email to Google Doc (MD)",
      "logoUrl": "https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_document_x16.png"
    },
    "gmail": {
      "contextualTriggers": [
        {
          "unconditional": {},
          "onTriggerFunction": "buildAddOn"
        }
      ],
      "homepageTrigger": {
        "runFunction": "buildAddOn"
      }
    }
  },
  "runtimeVersion": "V8"
}
```

---

## Part 3: Adding the Script Code

This is the main logic for the add-on. It handles creating the buttons, reading the email, and saving the content to a Google Doc.

1.  In the editor, click on the file named `Code.gs`.
2.  Delete all of the default placeholder code (`function myFunction() { ... }`).
3.  **Copy and paste the entire script below** into the `Code.gs` file.

```javascript
// ====== CONFIG ======
// This script is now fully dynamic. No pre-configuration is needed.
const PROP_SAVED_DOCS = 'SAVED_DOCS_LIST_V2'; // Key to store our list of docs.
const PROP_STORE = PropertiesService.getUserProperties();

// NEW: Add the exact text of the footer/warning you want to remove.
const FOOTER_TEXT_TO_REMOVE = "CONFIDENTIALITY NOTICE: This email and any attachments may contain confidential information ...";


// ====== Helper Functions for Managing Doc List ======

// Gets the list of saved documents (ID and Name) from Properties.
function getSavedDocs_() {
  const jsonString = PROP_STORE.getProperty(PROP_SAVED_DOCS);
  if (!jsonString) return {};
  return JSON.parse(jsonString);
}

// Adds or updates a document in our saved list.
function addDocToSavedList_(docId, docName) {
  const docs = getSavedDocs_();
  docs[docId] = docName;
  PROP_STORE.setProperty(PROP_SAVED_DOCS, JSON.stringify(docs));
}

// NEW: Remove a document from our saved list.
function removeDocFromSavedList_(docId) {
  const docs = getSavedDocs_();
  if (docs && docs[docId]) {
    delete docs[docId];
    PROP_STORE.setProperty(PROP_SAVED_DOCS, JSON.stringify(docs));
    return true;
  }
  return false;
}


// ====== Gmail Add-on UI Builder Functions ======

// This is the main function that builds the first card the user sees.
function buildAddOn(e) {
  const card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle("Save Email to Doc"));

  const section = CardService.newCardSection()
    .addWidget(CardService.newTextParagraph().setText("Choose a destination:"));

  const savedDocs = getSavedDocs_();
  const messageId = e.gmail && e.gmail.messageId ? e.gmail.messageId : "";

  // Create a button for each previously used document.
  for (const docId in savedDocs) {
    const docName = savedDocs[docId];
    const button = CardService.newTextButton()
      .setText(`Save to "${docName}"`)
      .setOnClickAction(CardService.newAction()
        .setFunctionName("handleSaveToExisting_")
        .setParameters({ messageId: messageId, docId: docId })
      );
    section.addWidget(button);
  }

  // Row of action buttons
  const createNewBtn = CardService.newTextButton()
    .setText("Save to a New Doc...")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("buildCreateNewDocCard_")
      .setParameters({ messageId: messageId })
    )
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED);

  // NEW: Manage saved docs button
  const manageBtn = CardService.newTextButton()
    .setText("Manage saved docs")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("buildManageDocsCard_")
      .setParameters({ messageId: messageId })
    );

  const actionRow = CardService.newButtonSet()
    .addButton(createNewBtn)
    .addButton(manageBtn);

  section.addWidget(actionRow);

  card.addSection(section);
  return card.build();
}

// This function builds the SECOND card, which asks the user for a new file name.
function buildCreateNewDocCard_(e) {
  const messageId = e.parameters.messageId;

  const card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle("Create New Document"));

  const section = CardService.newCardSection()
    .addWidget(CardService.newTextParagraph().setText("Enter the name for the new Google Doc:"))
    .addWidget(CardService.newTextInput()
      .setFieldName("new_doc_name")
      .setTitle("Document Name")
    );

  const createBtn = CardService.newTextButton()
    .setText("Create and Save")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("handleCreateAndSave_")
      .setParameters({ messageId: messageId })
    )
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED);

  const backBtn = CardService.newTextButton()
    .setText("Back")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("returnToMain_")
      .setParameters({ messageId: messageId })
    );

  section.addWidget(CardService.newButtonSet().addButton(createBtn).addButton(backBtn));

  card.addSection(section);
  return CardService.newNavigation().pushCard(card.build());
}

// NEW: Build the Manage Saved Docs card (for removing entries)
function buildManageDocsCard_(e) {
  const messageId = (e.parameters && e.parameters.messageId) || (e.gmail && e.gmail.messageId) || "";
  const docs = getSavedDocs_();

  const card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle("Manage Saved Docs"));

  const section = CardService.newCardSection();

  if (Object.keys(docs).length === 0) {
    section.addWidget(CardService.newTextParagraph().setText("No saved docs yet."));
  } else {
    for (const docId in docs) {
      const docName = docs[docId];

      // Show the doc name
      const row = CardService.newKeyValue()
        .setContent(docName);

      // Remove button for this doc
      const removeBtn = CardService.newTextButton()
        .setText("Remove")
        .setOnClickAction(CardService.newAction()
          .setFunctionName("handleRemoveDoc_")
          .setParameters({ messageId: messageId, docId: docId })
        )
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED);

      section
        .addWidget(row)
        .addWidget(CardService.newButtonSet().addButton(removeBtn));
    }
  }

  // Back to main
  const backBtn = CardService.newTextButton()
    .setText("Back")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("returnToMain_")
      .setParameters({ messageId: messageId })
    );

  section.addWidget(CardService.newButtonSet().addButton(backBtn));

  card.addSection(section);
  return CardService.newNavigation().pushCard(card.build());
}


// ====== Action Handler Functions ======

// Triggered when clicking a button for an EXISTING doc.
function handleSaveToExisting_(e) {
  const messageId = e.parameters.messageId;
  const docId = e.parameters.docId;

  if (!docId) return notify_("Error: Document ID was missing.");

  try {
    const doc = DocumentApp.openById(docId);
    appendEmailToDoc_(messageId, doc);
    return notify_(`Saved to Doc: ${doc.getName()}`);
  } catch (err) {
    return notify_("Error: Could not open document. It may have been deleted. " + err);
  }
}

// Triggered when clicking "Create and Save" on the second screen.
function handleCreateAndSave_(e) {
  const messageId = e.parameters.messageId;
  const newDocName = e.formInput.new_doc_name;

  if (!newDocName) return notify_("Error: Document name cannot be empty.");

  try {
    const doc = DocumentApp.create(newDocName);
    addDocToSavedList_(doc.getId(), doc.getName()); // Save this new doc for future use.
    appendEmailToDoc_(messageId, doc);
    return notify_(`Saved to new Doc: ${doc.getName()}`);
  } catch (err) {
    return notify_("Error: " + err);
  }
}

// NEW: Handle removal of a saved doc entry; refresh the Manage card.
function handleRemoveDoc_(e) {
  const messageId = e.parameters.messageId || "";
  const docId = e.parameters.docId;

  if (!docId) {
    return notify_("Error: Document ID missing.");
  }

  const removed = removeDocFromSavedList_(docId);
  const msg = removed ? "Removed from saved docs." : "That doc wasn't in the list.";

  // Rebuild the Manage card so the change is visible immediately.
  const manageNav = buildManageDocsCard_({ parameters: { messageId } });
  // The above already returns a Navigation with pushCard; we want to update instead.
  // Rebuild the card object directly to update in place:
  const card = _buildManageDocsCardStandalone_(messageId);
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().updateCard(card))
    .setNotification(CardService.newNotification().setText(msg))
    .build();
}

// Helper to build the Manage card as a single Card for updateCard()
function _buildManageDocsCardStandalone_(messageId) {
  const docs = getSavedDocs_();

  const card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle("Manage Saved Docs"));

  const section = CardService.newCardSection();

  if (Object.keys(docs).length === 0) {
    section.addWidget(CardService.newTextParagraph().setText("No saved docs yet."));
  } else {
    for (const docId in docs) {
      const docName = docs[docId];
      const row = CardService.newKeyValue().setContent(docName);

      const removeBtn = CardService.newTextButton()
        .setText("Remove")
        .setOnClickAction(CardService.newAction()
          .setFunctionName("handleRemoveDoc_")
          .setParameters({ messageId: messageId, docId: docId })
        )
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED);

      section
        .addWidget(row)
        .addWidget(CardService.newButtonSet().addButton(removeBtn));
    }
  }

  const backBtn = CardService.newTextButton()
    .setText("Back")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("returnToMain_")
      .setParameters({ messageId: messageId })
    );

  section.addWidget(CardService.newButtonSet().addButton(backBtn));
  card.addSection(section);
  return card.build();
}

// NEW: Return to main card (rebuilds with the current messageId)
function returnToMain_(e) {
  const messageId = e.parameters && e.parameters.messageId ? e.parameters.messageId : "";
  const mainCard = buildAddOn({ gmail: { messageId } });
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().updateCard(mainCard))
    .build();
}


// ====== Core: Append Email to Doc ======

function appendEmailToDoc_(messageId, doc) {
  if (!messageId) {
    throw new Error("No message ID found. Open an email first.");
  }
  const msg = GmailApp.getMessageById(messageId);
  const subject = msg.getSubject();
  const from = msg.getFrom();
  const date = msg.getDate();
  const html = msg.getBody();

  // Clean the footer from the HTML before converting.
  const cleanedHtml = html.replace(
    FOOTER_TEXT_TO_REMOVE,
    "Confidentiality notice: The information contained in this message (email and any attachments) is intended only for the designated recipient(s). Any review, dissemination, distribution, copying or other use of this message is prohibited by anyone other than the designated recipient. If you have received this message in error, notify the sender immediately and delete the original message from your e-mail system and/or computer database."
  );
  const md = htmlToMarkdown(cleanedHtml);

  const body = doc.getBody();
  body.appendParagraph(`# ${subject}`).setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph(`From: ${from}`);
  body.appendParagraph(`Date: ${date}`);
  body.appendParagraph(""); // spacer
  body.appendParagraph(md);
  body.appendHorizontalRule();
  doc.saveAndClose();
}


// ====== Notification and Markdown Conversion (Unchanged) ======

function notify_(text) {
  const card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle("Status"))
    .addSection(CardService.newCardSection().addWidget(CardService.newTextParagraph().setText(text)))
    .build();
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().updateCard(card))
    .build();
}

function htmlToMarkdown(html) {
  if (!html) return "";
  let md = html;
  md = md.replace(/<br>/g, '\n');
  md = md.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (m, p1) => "\n```\n" + decodeHTMLEntities_(stripOuterTags_(p1)) + "\n```\n");
  md = md.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (m, p1) => "`" + decodeHTMLEntities_(stripOuterTags_(p1)) + "`");
  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (m, p1) => "\n# " + innerText_(p1) + "\n");
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (m, p1) => "\n## " + innerText_(p1) + "\n");
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (m, p1) => "\n### " + innerText_(p1) + "\n");
  md = md.replace(/<(b|strong)[^>]*>([\s\S]*?)<\/\1>/gi, (m, p1, p2) => `**${innerText_(p2)}**`);
  md = md.replace(/<(i|em)[^>]*>([\s\S]*?)<\/\1>/gi, (m, p1, p2) => `*${innerText_(p2)}*`);
  md = md.replace(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (m, href, text) => `[${innerText_(text)}](${href})`);
  md = md.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (m, p1) => `- ${innerText_(p1)}\n`);
  md = md.replace(/<\/(ul|ol)>/gi, "\n");
  md = md.replace(/<(ul|ol)[^>]*>/gi, "\n");
  md = md.replace(/<br\s*\/?>/gi, "\n");
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (m, p1) => `\n${innerText_(p1)}\n`);
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (m, p1) => "\n" + innerText_(p1).split(/\n/).map(s => s ? `> ${s}` : ">").join("\n") + "\n");
  md = md.replace(/<\/?[^>]+>/g, "");
  md = md.replace(/\n{3,}/g, "\n\n");
  return md.trim();
}

function innerText_(html) {
  if (!html) return "";
  let s = html.replace(/<\/?[^>]+>/g, "");
  return decodeHTMLEntities_(s).replace(/\s+\n/g, '\n').replace(/\n\s+/g, '\n').trim();
}

function decodeHTMLEntities_(text) {
  if (!text) return "";
  const map = { '&amp;':'&', '&lt;':'<', '&gt;':'>', '&quot;':'"', '&#39':"'", '&#39;':"'" };
  return text.replace(/&(amp|lt|gt|quot|#39);/g, (m) => map[m] || m);
}

function stripOuterTags_(s) {
  return s.replace(/^<[^>]+>/,'').replace(/<[^>]+>$/,'');
}
```

---

## Part 4: Final Configuration and Deployment

We have one crucial customization and two final settings to check before deploying.

### 1. **(Required) Customize the Footer Text to Remove**
### NOTE: This part does NOT currently work...but give it a shot anyway.
In the `Code.gs` file, find this line near the top:
```javascript
const FOOTER_TEXT_TO_REMOVE = "CONFIDENTIALITY NOTICE: This email and any attachments may contain confidential information ...";
```

You **must** replace the text inside the quotation marks with the actual footer from your school emails. It needs to be an **exact match** for the script to find and remove it. A good tip is to copy the first sentence or two of the footer and paste it in.

### 2. Save Your Project
Click the **Save project** icon (the floppy disk 💾) in the top menu bar to save all your changes.

### 3. Deploy for Personal Use
Now we will install the add-on privately to your own Google account.

1.  At the top right of the editor, click the blue **Deploy** button and select **Test deployments**.
2.  A new window will appear. Click the **Install** button, and then **Done**.
3.  **The First Time Only:** The script will need your permission to run.
    *   A "Authorization Required" window will pop up. Click **Review Permissions**.
    *   Choose your Google account.
    *   You will see a "Google hasn’t verified this app" screen. This is normal for personal scripts. Click **Advanced**, then click **Go to [Your Project Name] (unsafe)**.
    *   Review the permissions it needs (to read emails and manage docs) and click **Allow**.

---

## Part 5: How to Use Your New Add-on

Your add-on is now live in your Gmail account!

1.  Go to your **Gmail** inbox (https://gmail.com) and **do a full browser refresh** (Ctrl+R or Cmd+R).
2.  Open any email message.
3.  Look for your add-on's icon in the right-hand sidebar. It's a small blue document icon. Click it to open the add-on.

### Your First Use:
The first time you open the add-on, it will look simple:
- It will display a single button: **"Save to a New Doc..."**

Click this button. You will be taken to a new screen where you can type in a name for your first document (e.g., "Weekly Updates"). Click **Create and Save**. The add-on will create that document in your Google Drive and save the current email to it.

### All Future Uses:
The next time you open an email and click the add-on, it will remember your choice! You will now see two buttons:
- `Save to "Weekly Updates"`
- `Save to a New Doc...`

You can now quickly save another email to your existing document or create a different one (e.g., "Admin Memos"). The list will grow automatically as you create more destination documents.

### Potential Developments:
- The whole point is to create a database for [NotebookLM](https://notebooklm.google/)
- It _might_ be possible to make this automatic.  I asked the AI (Gemini Pro) and it was ready to get started.  I just didn't want to get into it at the moment.



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

