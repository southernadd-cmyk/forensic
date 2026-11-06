# Incident Response Lab

A classroom incident-response exercise that runs entirely in the browser, so it can be hosted on GitHub Pages. Students run a fictional incident in five steps: put the lifecycle in order, build a playbook with owners (avoiding the traps), make timed decisions when injects land, brief the right people, then get a scorecard that explains every deduction.

Nothing is saved or sent anywhere. Students show their score or take a screenshot; the scorecard also prints.

## Class links

On the home page, choose an incident under "For teachers" and press "Make a class link". Everyone who opens that link gets the same incident with the cards and options in the same order, so scores are comparable. The link is just `?incident=ransomware&seed=ANYTHING`, so you can also write one by hand. Incident ids are `ransomware`, `invoice` and `webshell`.

## Host on GitHub Pages

1. Put `index.html` and `scenarios.js` in a repo.
2. Settings > Pages > deploy from the main branch, root folder.

To try it locally, open the folder with any static server, for example `python3 -m http.server`.

## Editing scenarios

Everything lives in `scenarios.js`, with comments explaining the fields. Required steps carry a phase, acceptable owners and `after` rules (which step must come first, and why). Traps carry the reason shown in the debrief. Add a scenario by copying an existing block with a new id.

## Scoring (out of 100)

- Lifecycle order 10: minus 2 per phase out of place.
- Playbook 40: minus 10 per trap, 4 per missing step, 3 per step placed before something it depends on.
- Owners 10: share of required steps with an acceptable owner.
- Inject decisions 20: 10 for the best call, 5 for an acceptable one, 0 for a wrong call or running out of time (45 seconds).
- Stakeholder update 20: minus 5 for the wrong audience, each wrong line included and each right line left out.

All organisations, people and figures are invented. The UK references (UK GDPR and the ICO 72-hour rule, Report Fraud, the NCSC) are real.