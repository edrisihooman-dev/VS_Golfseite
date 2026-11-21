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
const chartFilter = document.getElementById("chart-filter");
const distanceChart = document.getElementById("distance-chart");
let storageReady = true;
let selectedChartClub = "Driver";
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
  drawDistanceChart();
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

// Creates the club buttons used to filter the chart.
function addChartFilterButtons() {
  for (let index = 0; index < clubList.length; index++) {
    const button = document.createElement("button");
    button.textContent = clubList[index].name;
    button.addEventListener("click", function () {
      selectedChartClub = clubList[index].name;
      setActiveChartButton();
      drawDistanceChart();
    });
    chartFilter.appendChild(button);
  }

  setActiveChartButton();
}

// Marks the selected club button as active.
function setActiveChartButton() {
  const buttons = chartFilter.getElementsByTagName("button");

  for (let index = 0; index < buttons.length; index++) {
    if (buttons[index].textContent === selectedChartClub) {
      buttons[index].classList.add("active");
    } else {
      buttons[index].classList.remove("active");
    }
  }
}

// Finds the filtered shots and sorts them from oldest to newest.
function getChartShots() {
  const chartShots = [];

  for (let index = 0; index < shots.length; index++) {
    const shot = shots[index];
    const matchesClub = shot.club === selectedChartClub;

    if (matchesClub) {
      chartShots.push(shot);
    }
  }

  chartShots.sort(function (firstShot, secondShot) {
    return firstShot.date.localeCompare(secondShot.date);
  });
  return chartShots;
}

// Draws a simple line chart of shot distances.
function drawDistanceChart() {
  const canvasContext = distanceChart.getContext("2d");
  const chartShots = getChartShots();
  canvasContext.clearRect(0, 0, distanceChart.width, distanceChart.height);

  const leftSpace = 50;
  const rightSpace = 20;
  const topSpace = 20;
  const bottomSpace = 40;
  const chartWidth = distanceChart.width - leftSpace - rightSpace;
  const chartHeight = distanceChart.height - topSpace - bottomSpace;

  if (chartShots.length === 0) {
    canvasContext.fillText("Keine Schläge für diesen Filter.", leftSpace, topSpace + 20);
    return;
  }

  let minimumDistance = chartShots[0].metres;
  let maximumDistance = chartShots[0].metres;

  for (let index = 0; index < chartShots.length; index++) {
    const metres = chartShots[index].metres;
    minimumDistance = Math.min(minimumDistance, metres);
    maximumDistance = Math.max(maximumDistance, metres);
  }

  if (minimumDistance === maximumDistance) {
    minimumDistance = minimumDistance - 10;
    maximumDistance = maximumDistance + 10;
  }

  canvasContext.beginPath();
  canvasContext.strokeStyle = "#16733a";
  canvasContext.lineWidth = 3;

  for (let index = 0; index < chartShots.length; index++) {
    const metres = chartShots[index].metres;
    const x = leftSpace +
      (index / Math.max(chartShots.length - 1, 1)) * chartWidth;
    const y = topSpace + chartHeight -
      ((metres - minimumDistance) /
      (maximumDistance - minimumDistance)) * chartHeight;

    if (index === 0) {
      canvasContext.moveTo(x, y);
    } else {
      canvasContext.lineTo(x, y);
    }
  }

  canvasContext.stroke();
  drawChartPoints(canvasContext, chartShots, leftSpace, topSpace,
    chartWidth, chartHeight, minimumDistance, maximumDistance);
}

// Draws each chart point and its date label.
function drawChartPoints(canvasContext, chartShots, leftSpace, topSpace,
  chartWidth, chartHeight, minimumDistance, maximumDistance) {
  canvasContext.fillStyle = "#16733a";
  canvasContext.textAlign = "center";

  for (let index = 0; index < chartShots.length; index++) {
    const metres = chartShots[index].metres;
    const x = leftSpace +
      (index / Math.max(chartShots.length - 1, 1)) * chartWidth;
    const y = topSpace + chartHeight -
      ((metres - minimumDistance) /
      (maximumDistance - minimumDistance)) * chartHeight;

    canvasContext.fillStyle = "#16733a";
    canvasContext.beginPath();
    canvasContext.arc(x, y, 5, 0, 2 * Math.PI);
    canvasContext.fill();
    canvasContext.fillStyle = "#1f2933";
    canvasContext.fillText(metres + " m", x, y - 10);
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
  drawDistanceChart();
}

addClubOptions();
setTodayAsDate();
drawShotsTable();
drawClubResultsTable();
addChartFilterButtons();
drawDistanceChart();
shotForm.addEventListener("submit", addShot);
