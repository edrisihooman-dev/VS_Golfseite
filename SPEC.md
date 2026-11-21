# Spec: Golf Drive Tracker

## Goal (one or two sentences)
A single-page website where I write down how far I hit the golf ball after practice.
I can see my average, my best shot and a chart, so I know if I get better with training.
Data is saved in the browser.
I can also compare myself with tour average yardages.

## Users
Just me, on a laptop browser.

## Features (numbered, so prompts can refer to them)
F0. Add Golfclubs with their average yardage for tour player. these are the stats:
(Driver 258 m
3-Wood 228 m
5-Wood 216 m
4-Iron 191 m
5-Iron 182 m
6-Iron 172 m
7-Iron 161 m
8-Iron 150 m
9-Iron 139 m
Pitching Wedge 130 m)

F1. Add a shot with a form: date, club (dropdown), distance in metres.
F2. Show all saved shots in a table, newest on top.
F3. creat a button to delet the shot if wanted by the user.
F4. Save shots in localStorage so they survive a page reload.
F5. Show average distance and best shot with every club if asked by user.
F6. Club filter: buttons :
(Driver
3-Wood 
5-Wood  
4-Iron 
5-Iron 
6-Iron 
7-Iron 
8-Iron 
9-Iron 
Pitching Wedge)(not needed)
Clicking one shows only shots with that club in the table, average, best and chart.
F7. Simple line chart: average distance , drawn on a canvas.
F8: button for comparing my lengh with tour pro. (not needed)
F9: creat these as well, a Date and time square, and weather conditions.


## Acceptance criteria (how I know a feature works)
- F1: Empty distance cannot be submitted. Distance must be between 1 and 350. After adding, the distance field is cleared. Date is today by default.
- F2: The newest date is at the top of the table.
- F3: After clicking delete, the shot is gone from the table and stays gone after reload.
- F4: After reload, all shots are still there.
- F5: With shots 150, 160 and 170 the average shows 160 m and the best shows 170 m.
- F6: When I click "Driver", only Driver shots are shown and the average and best change.
- F7: With shots on 3 different days, the chart shows a line with 3 points. The line goes up if I got better.

## Out of scope (do NOT build)
- No login, no server, no database
- No frameworks or libraries (no React, no jQuery, no Bootstrap, no Chart.js)
- No file upload or download
- No yards, only metres
- No animations beyond simple CSS transitions
- No mobile app

## Look & feel
Simple and readable. Form on the left, results on the right (on small screens: one column).
Green as the one accent colour.
