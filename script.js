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

// Finds the HTML elements used for club selection and tour values.
const clubSelect = document.getElementById("club-select");
const tourTableBody = document.getElementById("tour-table-body");

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

addClubOptions();
addTourTableRows();
