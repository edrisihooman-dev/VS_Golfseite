const clubList = [
  { name: "Driver", metres: 258 },
  { name: "3-Wood", metres: 228 },
  { name: "5-Wood", metres: 216 },
  { name: "4-Iron", metres: 191 },
  { name: "5-Iron", metres: 182 },
  { name: "6-Iron", metres: 172 },
  { name: "7-Iron", metres: 161 },
  { name: "8-Iron", metres: 150 },
  { name: "9-Iron", metres: 139 },
  { name: "Pitching Wedge", metres: 130 }
];

// Finds the HTML elements used by the form and tables.
const clubSelect = document.getElementById("club-select");
const tourTableBody = document.getElementById("tour-table-body");
const shotForm = document.getElementById("shot-form");
const shotDate = document.getElementById("shot-date");
const shotMetres = document.getElementById("shot-metres");
const formMessage = document.getElementById("form-message");
const shotsTableBody = document.getElementById("shots-table-body");
let storageReady = true;
const shots = loadSavedShots();

// Loads saved shots from browser storage.
function loadSavedShots() {
  try {
    const savedShots = localStorage.getItem("golfShots");
    const loadedShots = savedShots ? JSON.parse(savedShots) : [];

    if (!Array.isArray(loadedShots)) {
      throw new Error("Die gespeicherten Daten haben ein ungültiges Format.");
    }

    return loadedShots;
  } catch (error) {
    storageReady = false;
    formMessage.textContent = "Schläge konnten nicht geladen werden: " + error.message;
    return [];
  }
}

// Saves all shots in browser storage.
function saveShots() {
  try {
    localStorage.setItem("golfShots", JSON.stringify(shots));
    return true;
  } catch (error) {
    formMessage.textContent = "Schläge konnten nicht gespeichert werden: " + error.message;
    return false;
  }
}

// Creates the club options in the dropdown.
function addClubOptions() {
  for (let index = 0; index < clubList.length; index++) {
    const club = clubList[index];
    const option = document.createElement("option");
    option.textContent = club.name;
    option.value = club.name;
    clubSelect.appendChild(option);
  }
}

// Creates one table row for each club and its tour average.
function addTourTableRows() {
  for (let index = 0; index < clubList.length; index++) {
    const club = clubList[index];
    const row = document.createElement("tr");

    const clubCell = document.createElement("td");
    clubCell.textContent = club.name;

    const metresCell = document.createElement("td");
    metresCell.textContent = club.metres + " m";

    row.appendChild(clubCell);
    row.appendChild(metresCell);
    tourTableBody.appendChild(row);
  }
}

// Sets the date field to the current day.
function setTodayAsDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  shotDate.value = year + "-" + month + "-" + day;
}

// Draws all shots with the newest date at the top.
function drawShotsTable() {
  shotsTableBody.textContent = "";

  shots.sort(function (firstShot, secondShot) {
    return secondShot.date.localeCompare(firstShot.date);
  });

  for (let index = 0; index < shots.length; index++) {
    const shot = shots[index];
    const row = document.createElement("tr");

    const dateCell = document.createElement("td");
    dateCell.textContent = shot.date;

    const clubCell = document.createElement("td");
    clubCell.textContent = shot.club;

    const metresCell = document.createElement("td");
    metresCell.textContent = shot.metres + " m";

    row.appendChild(dateCell);
    row.appendChild(clubCell);
    row.appendChild(metresCell);
    shotsTableBody.appendChild(row);
  }
}

// Validates the form and saves a valid shot.
function addShot(event) {
  event.preventDefault();

  if (!storageReady) {
    return;
  }

  const metres = Number(shotMetres.value);

  if (shotMetres.value === "") {
    formMessage.textContent = "Bitte eine Entfernung eingeben.";
    return;
  }

  if (metres < 1 || metres > 350) {
    formMessage.textContent = "Die Entfernung muss zwischen 1 und 350 Metern liegen.";
    return;
  }

  shots.push({
    date: shotDate.value,
    club: clubSelect.value,
    metres: metres
  });

  if (!saveShots()) {
    shots.pop();
    return;
  }

  formMessage.textContent = "";
  shotMetres.value = "";
  drawShotsTable();
}

addClubOptions();
addTourTableRows();
setTodayAsDate();
drawShotsTable();
shotForm.addEventListener("submit", addShot);
