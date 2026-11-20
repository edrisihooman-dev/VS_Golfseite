# Cheat list: Copilot prompts for the Golf Drive Tracker

How to use it:
1. Start a **new Copilot chat** for every step.
2. Copy the prompt, paste it, read what Copilot changes.
3. Test it in the browser (keep the console open with F12).
4. If it works: commit in VS Code, tick the step off in PROGRESS.md.
5. If Copilot fails 3 times: undo, new chat, write the prompt more clearly.

---

## Step 1: HTML skeleton
```
Context: #file:SPEC.md #file:PROGRESS.md
Task: Step 1 – HTML skeleton for F1 and F2 (layout only).
Details:
- A form with: date input, club dropdown (Driver, 7-Iron, Wedge), number input for metres, "Add" button.
- An empty table with the columns Date, Club, Metres.
- An empty area for "Average" and "Best".
- An empty <canvas> for the chart later.
Constraints: Only create index.html. No JavaScript yet. Link style.css and script.js.
Done when: I open index.html and see the form, the empty table and the empty areas.
```

## Step 2: Basic CSS
```
Context: #file:SPEC.md #file:PROGRESS.md
Task: Step 2 – basic layout from "Look & feel" in SPEC.md.
Details:
- Form on the left, results on the right. On small screens one column.
- Readable font, green as the only accent colour (button, table header).
Constraints: Only change style.css.
Done when: the page looks tidy and the form is on the left.
```

## Step 3: Add a shot
```
Context: #file:SPEC.md #file:PROGRESS.md
Task: Step 3 – F1 and F2: clicking "Add" shows the shot in the table.
Details:
- Keep the shots in an array (see "Decisions & notes" in PROGRESS.md).
- After each add, draw the whole table again, newest date on top.
- No saving yet, only in memory.
Constraints: Only change script.js.
Done when: I add 2 shots and both appear in the table, newest on top.
```

## Step 4: Check the form
```
Context: #file:SPEC.md #file:PROGRESS.md
Task: Step 4 – acceptance criteria of F1.
Details:
- Date field shows today when the page opens.
- Empty distance or a distance outside 1–350 is not added. Show a short message instead.
- After adding, clear the distance field.
Constraints: Only change script.js (and index.html only if a place for the message is needed).
Done when: an empty distance or 500 is not added, a correct shot is added and the field is empty again.
```

## Step 5: Save in the browser
```
Context: #file:SPEC.md #file:PROGRESS.md
Task: Step 5 – F4: save shots in localStorage.
Details:
- Save the array every time a shot is added. Key: "golfShots".
- Load it when the page starts and show the table.
Constraints: Only change script.js.
Done when: I add 2 shots, reload the page, and both are still there.
```

## Step 6: Delete a shot
```
Context: #file:SPEC.md #file:PROGRESS.md
Task: Step 6 – F3: delete button per shot.
Details:
- Each table row gets a small "Delete" button.
- Clicking it removes this shot, saves again and redraws the table.
Constraints: Only change script.js (and style.css for the button look).
Done when: I delete a shot, reload, and it is still gone.
```

## Step 7: Average and best
```
Context: #file:SPEC.md #file:PROGRESS.md
Task: Step 7 – F5: show average and best shot.
Details:
- Average = all metres added up, divided by the number of shots. Round to whole metres.
- Best = the biggest distance.
- Update both after every add and delete. If there are no shots, show "–".
Constraints: Only change script.js.
Done when: with 150, 160 and 170 I see "Average: 160 m" and "Best: 170 m".
```

## Step 8: Club filter
```
Context: #file:SPEC.md #file:PROGRESS.md
Task: Step 8 – F6: club filter buttons.
Details:
- Buttons: All, Driver, 7-Iron, Wedge. The chosen button is highlighted.
- Table, average and best only use the shots of the chosen club.
Constraints: Change index.html, script.js and style.css only as needed.
Done when: I click "Driver" and only Driver shots are shown, and average and best change.
```

## Step 9: Chart
```
Context: #file:SPEC.md #file:PROGRESS.md
Task: Step 9 – F7: line chart on the canvas.
Details:
- One point per practice day = the average distance of that day.
- Connect the points with a line, oldest day on the left.
- Write the day under each point. Use the chosen club filter.
- No chart library, only canvas drawing.
Constraints: Only change script.js.
Done when: with shots on 3 different days I see a line with 3 points.
```

---

## Useful extra prompts
- **Don't understand the code:** `Don't change any files. Explain line by line what renderTable() does.`
- **Something is broken:** `When I click Add, nothing happens. The console shows: [paste error]. Expected: the shot appears in the table. Explain the cause before changing code.`
- **Unsure about a step:** `Don't write code yet. Describe in 3–5 sentences how you would do Step 9.`
- **Too complicated:** `Rewrite this in the simplest way a beginner can read.`
