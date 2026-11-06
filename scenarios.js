// Incident Response Lab scenarios.
// Everything here is fictional. Edit freely: the game reads this file at load.
//
// actions: required steps have a phase (0-4) and an owner (or list of acceptable owners).
//   after: [[actionId, reason]] means this step must come later in the playbook than actionId.
// traps: actions that should never be in the playbook, with the reason shown in the debrief.
// injects: decisions made against a clock. score 10 = best, 5 = acceptable, 0 = wrong.
// update: the stakeholder message. Pick the right audience and the right lines.

window.PHASES = ["Identify", "Contain", "Eradicate", "Recover", "Lessons learned"];

window.OWNERS = {
  lead: "Incident lead",
  infra: "IT infrastructure",
  forensics: "Forensics",
  identity: "Identity and access",
  web: "Web team",
  finance: "Finance",
  dpo: "Data protection officer",
  comms: "Communications",
  slt: "Senior leadership"
};

window.SCENARIOS = [
  {
    id: "ransomware",
    title: "Ransomware on the student records server",
    short: "Ransomware",
    clockStart: "02:10",
    brief:
      "At 02:10 on a Tuesday the overnight backup job fails with thousands of errors. Files on FS-STUDENT have been renamed with a .lockd extension and a ransom note sits in every folder. The server holds student records, including learning support and safeguarding notes. Backups go to a NAS on the same network; there is also a weekly offline copy.",
    goal:
      "Stop the spread, keep the evidence, remove the attacker and the way in, then rebuild. Restore only into a clean environment, and get the data protection officer involved early.",
    actions: [
      { id: "r1", text: "Confirm the alert is genuine and log the time you became aware", phase: 0, owner: ["lead"] },
      { id: "r2", text: "Disconnect FS-STUDENT from the network but leave it powered on", phase: 1, owner: ["infra"],
        after: [["r1", "Confirm what you are dealing with before you act on it."]] },
      { id: "r3", text: "Capture a memory dump and a full disk image of the server", phase: 1, owner: ["forensics"],
        after: [["r2", "Isolate first, so the attacker cannot keep working while you image."]] },
      { id: "r4", text: "Tell the data protection officer that personal data is involved", phase: 0, owner: ["dpo", "lead"],
        after: [["r1", "The DPO needs the time you became aware, so log it first."]] },
      { id: "r5", text: "Work out how the attacker got in, from VPN, login and endpoint logs", phase: 2, owner: ["forensics"],
        after: [["r3", "Investigate from the preserved evidence, not the live system."]] },
      { id: "r6", text: "Disable the compromised account and reset every privileged password", phase: 2, owner: ["identity"],
        after: [["r5", "Find every account the attacker used before you reset, or you miss one."]] },
      { id: "r7", text: "Rebuild the server from a clean build and restore data from a copy checked as clean", phase: 3, owner: ["infra"],
        after: [["r3", "Rebuilding wipes the disk. Image it first."],
                ["r6", "Restoring before credentials are reset puts data back into the attacker's hands."]] },
      { id: "r8", text: "Report to the ICO within 72 hours if people are at risk", phase: 3, owner: ["dpo"],
        after: [["r4", "The DPO has to be told before they can make the report."]] },
      { id: "r9", text: "Report the crime to Report Fraud and the NCSC", phase: 3, owner: ["lead"] },
      { id: "r10", text: "Run a lessons-learned review and fix the backup design", phase: 4, owner: ["lead"],
        after: [["r7", "Review once service is back, when you know the full story."]] }
    ],
    traps: [
      { id: "t1", text: "Wipe and reinstall the server straight away to get files back fast",
        why: "Wiping destroys the evidence and leaves the way in open, so the attacker can simply return." },
      { id: "t2", text: "Pay the ransom to get the decryption key quickly",
        why: "Payment is not a playbook step. It guarantees nothing, may fund sanctioned groups, and is a leadership decision taken with legal advice and the police." },
      { id: "t3", text: "Restore everything from the NAS backup first thing",
        why: "The NAS is on the same network and may be encrypted or infected, and the domain is still compromised." },
      { id: "t4", text: "Email all staff and students to say no data was taken",
        why: "Nobody knows that yet. A statement you have to take back destroys trust." },
      { id: "t5", text: "Switch the server off at the wall",
        why: "Pulling power loses everything in memory, which can include keys and attacker tools. Isolate it instead." }
    ],
    injects: [
      {
        time: "04:30",
        text: "The backup NAS has been encrypted too. The principal phones and asks whether the college should just pay.",
        options: [
          { text: "Pay now, before the price goes up", score: 0,
            why: "Paying under pressure skips legal advice and police involvement, and you may still get nothing back." },
          { text: "Keep rebuilding from last week's offline copy, and take the ransom question to leadership with legal advice and the police", score: 10,
            why: "Recovery continues while the people who own the decision make it properly." },
          { text: "Stop all rebuild work until leadership has decided", score: 5,
            why: "Escalating is right, but pausing recovery costs time you do not need to lose." }
        ]
      },
      {
        time: "09:15",
        text: "A local reporter emails: someone has posted what look like student records on a leak site. You have not confirmed any data left the network.",
        options: [
          { text: "Reply that no data was taken", score: 0,
            why: "You do not know that, and the leak site suggests otherwise." },
          { text: "Send a holding statement: you are aware of an incident, are investigating with the police and the ICO, and will contact anyone affected", score: 10,
            why: "Accurate, calm, and commits only to what you will actually do." },
          { text: "Say no comment", score: 5,
            why: "Safe, but it leaves the story to the leak site." }
        ]
      }
    ],
    update: {
      audiences: [
        { text: "Students and parents whose records were on the server", correct: true },
        { text: "Everyone on the college mailing list", correct: false },
        { text: "The local newspaper", correct: false }
      ],
      lines: [
        { text: "What happened and what information was involved, as far as we know so far", correct: true },
        { text: "What we are doing about it, and that we have reported it to the police and the ICO", correct: true },
        { text: "What to watch for, such as scam emails using their details, and who to contact", correct: true },
        { text: "The attack was highly sophisticated and could not have been prevented", correct: false },
        { text: "No information has been taken", correct: false },
        { text: "The technical detail of how the attacker got in", correct: false }
      ]
    }
  },

  {
    id: "invoice",
    title: "Invoice fraud through the finance mailbox",
    short: "Invoice fraud",
    clockStart: "10:05",
    brief:
      "At 10:05 a supplier phones to ask why their £38,400 invoice is overdue. Finance paid it yesterday, to new bank details sent by email from what looked like the supplier. The finance manager's mailbox has a rule nobody created: it forwards anything mentioning 'invoice' to an outside address and hides the original.",
    goal:
      "Move fast on the money, lock the attacker out, keep the evidence, and warn the people the attacker could target next.",
    actions: [
      { id: "r1", text: "Confirm the payment, the new bank details and when the change request arrived", phase: 0, owner: ["finance"] },
      { id: "r2", text: "Call the bank's fraud team to try to recall or freeze the payment", phase: 1, owner: ["finance"],
        after: [["r1", "The bank will need the payment details, so pull them together first."]] },
      { id: "r3", text: "Reset the finance manager's password, sign out all sessions and re-register MFA", phase: 1, owner: ["identity"] },
      { id: "r4", text: "Export the mailbox audit log and the inbox rules", phase: 1, owner: ["forensics"] },
      { id: "r5", text: "Remove the forwarding rule and any app permissions the attacker added", phase: 2, owner: ["identity"],
        after: [["r4", "Export the rule and the logs before deleting anything, or the evidence goes with it."],
                ["r3", "Lock the attacker out first, or they can put the rule straight back."]] },
      { id: "r6", text: "Work out which emails were read or forwarded out of the mailbox", phase: 2, owner: ["forensics"],
        after: [["r4", "You need the exported audit log to answer this."]] },
      { id: "r7", text: "Tell the data protection officer: the mailbox holds staff and supplier personal data", phase: 0, owner: ["dpo", "lead"] },
      { id: "r8", text: "Report the fraud to Report Fraud and get a crime reference number", phase: 3, owner: ["lead", "finance"] },
      { id: "r9", text: "Warn suppliers and staff about fake bank-detail change requests", phase: 3, owner: ["comms"],
        after: [["r6", "Know which suppliers were exposed so the warning reaches the right people."]] },
      { id: "r10", text: "Make phone call-backs to a number on file mandatory for any bank-detail change", phase: 4, owner: ["finance"],
        after: [["r2", "Deal with the live loss before changing the process."]] }
    ],
    traps: [
      { id: "t1", text: "Reply to the fraudster's email and ask for the money back",
        why: "It tips the attacker off and wastes the time the bank needs for a recall." },
      { id: "t2", text: "Wait until tomorrow in case the supplier is mistaken",
        why: "The chance of recalling a payment drops by the hour." },
      { id: "t3", text: "Pay the real supplier again today using the details in their latest email",
        why: "The latest email may be from the attacker too. Confirm by phone using a number you already hold." },
      { id: "t4", text: "Tell the supplier their information is definitely safe",
        why: "You have not yet worked out what was read." }
    ],
    injects: [
      {
        time: "11:20",
        text: "The bank's fraud team says they will try a recall but want a crime reference number.",
        options: [
          { text: "Report to Report Fraud now and pass the reference straight to the bank", score: 10,
            why: "This is exactly what the reference is for, and speed matters." },
          { text: "Ask the bank to start without one and report later", score: 5,
            why: "The bank may start, but you are slowing your own recall." },
          { text: "Wait until the investigation is finished before reporting", score: 0,
            why: "By then the money will be long gone." }
        ]
      },
      {
        time: "12:40",
        text: "The audit log shows the attacker also sent a 'shared invoice' link from the finance mailbox to 40 colleagues this morning. Three people clicked it.",
        options: [
          { text: "Pull the email from every inbox, block the link, and reset the three people who clicked", score: 10,
            why: "It removes the bait and closes the accounts most likely to be compromised next." },
          { text: "Email staff telling them to ignore it", score: 5,
            why: "Helpful, but the clicks have already happened and those accounts may be exposed." },
          { text: "Leave it, since it only went to internal staff", score: 0,
            why: "Internal phishing from a trusted mailbox is how one compromise becomes several." }
        ]
      }
    ],
    update: {
      audiences: [
        { text: "Every supplier we pay", correct: true },
        { text: "Only the supplier who was not paid", correct: false },
        { text: "A public post on social media", correct: false }
      ],
      lines: [
        { text: "Our finance mailbox was accessed without permission and emails may have been sent in our name", correct: true },
        { text: "We will never change bank details by email alone, and will always confirm by phone", correct: true },
        { text: "If you have had an unusual request from us, call our finance team on the number you already have", correct: true },
        { text: "Please reply with your bank details so we can check our records", correct: false },
        { text: "There is nothing to worry about", correct: false },
        { text: "This happened because a member of our finance team made a mistake", correct: false }
      ]
    }
  },

  {
    id: "webshell",
    title: "Web shell on the public website",
    short: "Web shell",
    clockStart: "07:45",
    brief:
      "At 07:45 the web host's malware scan flags an unfamiliar PHP file in the uploads folder of the college's public website. There was an unusual spike in outbound traffic at 03:00. The site's database also stores course enquiries: applicants' names, email addresses and phone numbers.",
    goal:
      "Preserve the evidence, close off the shell, find every way in and every backdoor, then put a clean, patched site back up. Treat the enquiry data as possibly exposed until you know otherwise.",
    actions: [
      { id: "r1", text: "Confirm the file is a web shell and find when it was created", phase: 0, owner: ["forensics", "web"] },
      { id: "r2", text: "Snapshot the server and copy the web and database logs somewhere safe", phase: 0, owner: ["forensics"],
        after: [["r1", "Confirm what you have before collecting evidence about it."]] },
      { id: "r3", text: "Take the site offline with a maintenance page and block the shell's path", phase: 1, owner: ["web"],
        after: [["r2", "Snapshot first, so taking the site down does not change the evidence."]] },
      { id: "r4", text: "Tell the data protection officer that applicant data may be exposed", phase: 0, owner: ["dpo", "lead"] },
      { id: "r5", text: "Find the way in, such as an upload form accepting .php files, and patch it", phase: 2, owner: ["web"],
        after: [["r2", "Investigate from the snapshot and logs you preserved."]] },
      { id: "r6", text: "Search for other web shells and any admin accounts nobody recognises", phase: 2, owner: ["forensics"],
        after: [["r2", "Search the preserved copy so nothing is lost while you look."]] },
      { id: "r7", text: "Change the database password and every website admin password", phase: 2, owner: ["web", "identity"],
        after: [["r6", "Remove any backdoor accounts first, or the attacker keeps a way back in."]] },
      { id: "r8", text: "Redeploy the site from clean source code with the fix applied", phase: 3, owner: ["web"],
        after: [["r5", "Redeploying before the patch reopens the same hole."],
                ["r6", "Make sure you know every backdoor before declaring the site clean."],
                ["r7", "New site, old passwords is not a clean site."]] },
      { id: "r9", text: "Decide with the DPO whether to report to the ICO within 72 hours", phase: 3, owner: ["dpo"],
        after: [["r4", "The DPO has to be told before they can decide."]] },
      { id: "r10", text: "Review: check upload file types and stop scripts running in the uploads folder", phase: 4, owner: ["web"],
        after: [["r8", "Review once the clean site is live."]] }
    ],
    traps: [
      { id: "t1", text: "Delete the PHP file and carry on as normal",
        why: "The evidence goes, the way in stays open, and there are often more shells." },
      { id: "t2", text: "Restore last night's backup over the live site",
        why: "The backup may include the shell, and the vulnerability is still there." },
      { id: "t3", text: "Leave it to the web host to sort out",
        why: "The college is the data controller. The host can help, but the responsibility stays with you." },
      { id: "t4", text: "Email the site admin password to an outside developer so they can help",
        why: "You would be sharing a credential that may already be compromised, in plain text." }
    ],
    injects: [
      {
        time: "09:10",
        text: "The database log shows a 2.1 GB export at 03:04, matching the traffic spike.",
        options: [
          { text: "Treat it as a likely breach: the DPO starts the ICO assessment now and the logs are preserved", score: 10,
            why: "The 72-hour clock runs from when you became aware, not from when you are certain." },
          { text: "Work out exactly which tables were exported, then tell the DPO", score: 5,
            why: "Useful detail, but the DPO should be working in parallel, not waiting." },
          { text: "Assume it was only images and carry on", score: 0,
            why: "Nothing supports that assumption, and the database holds personal data." }
        ]
      },
      {
        time: "10:30",
        text: "A second web shell turns up in a theme folder. It was created three weeks ago.",
        options: [
          { text: "Delete it too and continue", score: 0,
            why: "The attacker has been in for three weeks. Deleting files one at a time will not find everything." },
          { text: "Rebuild from clean source, but only check logs since last night", score: 5,
            why: "The rebuild is right, but the investigation window now has to cover three weeks." },
          { text: "Treat the whole server as untrusted, rebuild from clean source and review three weeks of logs", score: 10,
            why: "The scope of the incident just changed, and the response changes with it." }
        ]
      }
    ],
    update: {
      audiences: [
        { text: "People who sent a course enquiry through the website", correct: true },
        { text: "All current students", correct: false },
        { text: "The college's social media followers", correct: false }
      ],
      lines: [
        { text: "Our website was accessed without permission and your enquiry details may have been copied", correct: true },
        { text: "Which details were involved: name, email address and phone number", correct: true },
        { text: "Be wary of unexpected messages claiming to be from us, and who to contact with questions", correct: true },
        { text: "Please change your college password", correct: false },
        { text: "We are confident nobody will misuse your information", correct: false },
        { text: "The name of the security flaw so you can check other sites", correct: false }
      ]
    }
  }
];