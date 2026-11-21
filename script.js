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
const shotForm = document.getElementById("shot-form");
const shotDate = document.getElementById("shot-date");
const shotMetres = document.getElementById("shot-metres");
const formMessage = document.getElementById("form-message");
const shotsTableBody = document.getElementById("shots-table-body");
const clubResultsTableBody = document.getElementById("club-results-table-body");
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

// Draws tour average, my average and best shot for every golf club.
function drawClubResultsTable() {
  clubResultsTableBody.textContent = "";

  for (let clubIndex = 0; clubIndex < clubList.length; clubIndex++) {
    const club = clubList[clubIndex];
    let totalMetres = 0;
    let shotCount = 0;
    let bestMetres = 0;

    for (let shotIndex = 0; shotIndex < shots.length; shotIndex++) {
      const shot = shots[shotIndex];

      if (shot.club === club.name) {
        totalMetres = totalMetres + shot.metres;
        shotCount = shotCount + 1;

        if (shot.metres > bestMetres) {
          bestMetres = shot.metres;
        }
      }
    }

    const row = document.createElement("tr");
    const clubCell = document.createElement("td");
    const tourAverageCell = document.createElement("td");
    const myAverageCell = document.createElement("td");
    const bestCell = document.createElement("td");

    clubCell.textContent = club.name;
    tourAverageCell.textContent = club.metres + " m";

    if (shotCount === 0) {
      myAverageCell.textContent = "-";
      bestCell.textContent = "-";
    } else {
      const averageMetres = Math.round(totalMetres / shotCount);
      myAverageCell.textContent = averageMetres + " m";
      bestCell.textContent = bestMetres + " m";
    }

    row.appendChild(clubCell);
    row.appendChild(tourAverageCell);
    row.appendChild(myAverageCell);
    row.appendChild(bestCell);
    clubResultsTableBody.appendChild(row);
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

    const actionCell = document.createElement("td");
    const actionButtons = document.createElement("div");
    actionButtons.className = "action-buttons";

    const favouriteButton = document.createElement("button");
    favouriteButton.textContent = shot.favourite ? "Favorit entfernen" : "Favorit";
    favouriteButton.className = shot.favourite ? "favourite-button active" : "favourite-button";
    favouriteButton.addEventListener("click", function () {
      toggleFavourite(index);
    });
    actionButtons.appendChild(favouriteButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Löschen";
    deleteButton.className = "delete-button";
    deleteButton.addEventListener("click", function () {
      deleteShot(index);
    });
    actionButtons.appendChild(deleteButton);
    actionCell.appendChild(actionButtons);

    row.appendChild(dateCell);
    row.appendChild(clubCell);
    row.appendChild(metresCell);
    row.appendChild(actionCell);
    shotsTableBody.appendChild(row);
  }
}

// Removes one shot and updates browser storage and the table.
function deleteShot(index) {
  const deletedShot = shots[index];
  shots.splice(index, 1);

  if (!saveShots()) {
    shots.splice(index, 0, deletedShot);
    return;
  }

  formMessage.textContent = "";
  drawShotsTable();
  drawClubResultsTable();
}

// Changes whether one shot is marked as a favourite.
function toggleFavourite(index) {
  const shot = shots[index];
  const previousValue = shot.favourite;
  shot.favourite = !previousValue;

  if (!saveShots()) {
    shot.favourite = previousValue;
    return;
  }

  formMessage.textContent = "";
  drawShotsTable();
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
    metres: metres,
    favourite: false
  });

  if (!saveShots()) {
    shots.pop();
    return;
  }

  formMessage.textContent = "";
  shotMetres.value = "";
  drawShotsTable();
  drawClubResultsTable();
}

addClubOptions();
setTodayAsDate();
drawShotsTable();
drawClubResultsTable();
shotForm.addEventListener("submit", addShot);
