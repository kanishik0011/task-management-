# AbleSpace - Take Data Workflow Analysis

## 1. Purpose of the Workflow

The Take Data workflow appears to help a clinician, therapist, educator, or support staff member record measurable progress for a client/student/case during a session. The expected product outcome is structured data that can later be reviewed for progress tracking, reporting, and care planning.

![Caseload table with Take Data action highlighted](screenshots/take-data-entry-point.png)

Observed screenshot: Caseload table with a highlighted `Take Data` action in the Actions column.

## 2. Entry Point

The workflow begins from the Caseload tab. The screenshot above shows a left navigation sidebar with `Caseload` selected, a student table, search/filter controls, and a `Take Data` button in each student's Actions column.

What the user is doing: finding the correct student/client row, checking enough identifying context, and clicking `Take Data`.

What the system appears to do: starts a data-capture workflow scoped to the selected student/client.

Expected outcome: the user lands in a context-aware Take Data screen without needing to re-select the same case.

UX friction observed: the action is repeated on every row, but the row is dense. Users must be careful to click the correct `Take Data` button, especially on smaller screens or when rows look similar.

## 3. Selecting a Client, Student, or Case

The selected student/client should carry forward from the Caseload row. In the screenshot, rows include name, last name, IEP due date, eval due date, collaborators, service time, and school.

What the user is doing: using the row context to select the correct person before entering the workflow.

What the system appears to do: establishes the selected student/client as the owner of the data being recorded.

Expected outcome: every subsequent field and data point should clearly belong to the selected person/case.

UX friction: if the Take Data screen does not keep the selected student/client visible, users may worry that they are recording data for the wrong row.

## 4. Selecting Data, Goal, or Session

This step was not visible in the supplied screenshot, but it is a likely next step after choosing `Take Data`.

What the user is doing: choosing the goal, target, program, or session area where data will be captured.

What the system appears to do: filters the available recording controls based on the selected goal/session.

Expected outcome: the user sees only relevant data inputs and can move quickly into recording.

UX friction to validate during manual walkthrough: terminology should be consistent between Caseload, goal setup, and Take Data. If the same object is called by different names, new users may hesitate.

## 5. Recording Data

This screen was not visible in the supplied screenshot and should be captured during a manual walkthrough.

What the user is doing: entering observations, counts, ratings, trial results, notes, or completion states.

What the system appears to do: stores local in-progress input and prepares it for submission.

Expected outcome: data entry should be fast, touch-friendly, and resilient to accidental navigation.

UX friction to validate with screenshots: the save state should be unmistakable. If the screen has multiple controls, users need a clear active row/target and visible unsaved state.

## 6. Saving or Submitting

This screen was not visible in the supplied screenshot and should be captured during a manual walkthrough.

What the user is doing: committing the captured data at the end of the session or after a set of observations.

What the system appears to do: validates required fields, writes the data, and returns a success state.

Expected outcome: the user receives confirmation and can either continue collecting data or return to the caseload.

UX friction to validate with screenshots: failed saves need a recoverable path that preserves unsaved input.

## 7. Reviewing Captured Data

This screen was not visible in the supplied screenshot and should be captured during a manual walkthrough.

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

Problem: active student/client context may become easy to miss once the user is deep in the flow.

Why it matters: recording data against the wrong person is a serious workflow error.

Suggested improvement: keep the selected student/client visible in the page header or sticky context bar throughout Take Data.

### Improvement 3

Problem: repeated navigation between caseload, goals, and recording can slow down frequent users.

Why it matters: Take Data is likely used during time-sensitive sessions.

Suggested improvement: preserve the last selected goal/session for a case and offer a direct "continue previous session" path when appropriate.

### Improvement 4

Problem: the Caseload table is information-dense, and the `Take Data` action appears repeatedly in the same column.

Why it matters: a user may accidentally start data collection for the wrong student/client if rows are visually similar.

Suggested improvement: after clicking `Take Data`, show a clear confirmation context on the next screen, such as the selected name and school/service details in a sticky header.

## Functional Improvements

- Preserve unsaved input if the network request fails.
- Disable duplicate submits while saving.
- Make validation messages field-specific and actionable.
- Provide a clear post-save path: continue recording, review data, or return to caseload.
- Consider an offline or draft mode if users commonly collect data in unreliable network settings.

## Summary

The Take Data workflow should optimize for speed, confidence, and correctness. The most important product qualities are clear context, low-friction recording, reliable save feedback, and easy recovery when something goes wrong.

Note: this document uses the supplied Caseload screenshot for the observed entry point. Screens after the `Take Data` click should be finalized with real screenshots from a manual product walkthrough.
