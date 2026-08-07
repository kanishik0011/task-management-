# AbleSpace - Take Data Workflow Analysis

## 1. Purpose of the Workflow

The Take Data workflow appears to help a clinician, therapist, educator, or support staff member record measurable progress for a client/student/case during a session. The expected product outcome is structured data that can later be reviewed for progress tracking, reporting, and care planning.

> Screenshot: add `docs/screenshots/take-data-entry-point.png`

## 2. Entry Point

The workflow begins from the Caseload tab, where the user looks for the client/student/case that needs data collection.

What the user is doing: locating the relevant caseload item and choosing the Take Data action.

What the system appears to do: routes the user from caseload management into a data capture flow scoped to the selected person/case.

Expected outcome: the user lands in a context-aware Take Data screen without needing to re-select the same case.

UX friction to validate with screenshots: if the Take Data action is visually similar to lower-priority actions, users may need extra scanning time.

## 3. Selecting a Client, Student, or Case

> Screenshot: add `docs/screenshots/take-data-client-selection.png`

What the user is doing: confirming or selecting the person/case for the session.

What the system appears to do: establishes the scope for available goals, targets, and existing data.

Expected outcome: every subsequent field and data point should clearly belong to the selected person/case.

UX friction to validate with screenshots: the active selection should remain visible throughout the flow so users do not worry about recording data against the wrong case.

## 4. Selecting Data, Goal, or Session

> Screenshot: add `docs/screenshots/take-data-goal-selection.png`

What the user is doing: choosing the goal, target, program, or session area where data will be captured.

What the system appears to do: filters the available recording controls based on the selected goal/session.

Expected outcome: the user sees only relevant data inputs and can move quickly into recording.

UX friction to validate with screenshots: terminology should be consistent between Caseload, goal setup, and Take Data. If the same object is called by different names, new users may hesitate.

## 5. Recording Data

> Screenshot: add `docs/screenshots/take-data-recording.png`

What the user is doing: entering observations, counts, ratings, trial results, notes, or completion states.

What the system appears to do: stores local in-progress input and prepares it for submission.

Expected outcome: data entry should be fast, touch-friendly, and resilient to accidental navigation.

UX friction to validate with screenshots: the save state should be unmistakable. If the screen has multiple controls, users need a clear active row/target and visible unsaved state.

## 6. Saving or Submitting

> Screenshot: add `docs/screenshots/take-data-save-submit.png`

What the user is doing: committing the captured data at the end of the session or after a set of observations.

What the system appears to do: validates required fields, writes the data, and returns a success state.

Expected outcome: the user receives confirmation and can either continue collecting data or return to the caseload.

UX friction to validate with screenshots: failed saves need a recoverable path that preserves unsaved input.

## 7. Reviewing Captured Data

> Screenshot: add `docs/screenshots/take-data-review.png`

What the user is doing: checking that the saved values were captured correctly.

What the system appears to do: displays the new data in a summary, history, chart, or session record.

Expected outcome: the user can trust that data has been recorded and can correct mistakes if needed.

UX friction to validate with screenshots: if review is on a different page, the product should show a clear bridge from saving to review.

## UX/UI Observations

### Improvement 1

Problem: save status can be a high-risk ambiguity in data capture workflows.

Why it matters: users may be recording live session information and cannot afford to lose entries.

Suggested improvement: show a persistent saved/unsaved indicator with a last-saved timestamp after successful submission.

### Improvement 2

Problem: active client/case context may become easy to miss once the user is deep in the flow.

Why it matters: recording data against the wrong person is a serious workflow error.

Suggested improvement: keep the selected client/case visible in the page header or sticky context bar throughout Take Data.

### Improvement 3

Problem: repeated navigation between caseload, goals, and recording can slow down frequent users.

Why it matters: Take Data is likely used during time-sensitive sessions.

Suggested improvement: preserve the last selected goal/session for a case and offer a direct "continue previous session" path when appropriate.

## Functional Improvements

- Preserve unsaved input if the network request fails.
- Disable duplicate submits while saving.
- Make validation messages field-specific and actionable.
- Provide a clear post-save path: continue recording, review data, or return to caseload.
- Consider an offline or draft mode if users commonly collect data in unreliable network settings.

## Summary

The Take Data workflow should optimize for speed, confidence, and correctness. The most important product qualities are clear context, low-friction recording, reliable save feedback, and easy recovery when something goes wrong.

Note: this document is structured for screenshot-backed analysis. The current coding environment could not inspect the AbleSpace workflow directly, so screenshots and observations should be finalized after manual product walkthrough.
