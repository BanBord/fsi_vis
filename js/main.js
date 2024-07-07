let stage;
let stageHeight;
let stageWidth;

let currentDatasetIndex = 0;
let currentYearIndex = 0;

let countryPropertyDivs = {};
let propertyLeftPositions = {};

let continents = ["Africa", "Americas", "Asia", "Europe", "Oceania"];

let properties = [
  "Security Apparatus",
  "Factionalized Elites",
  "Group Grievance",
  "Economy",
  "Economic Inequality",
  "Human Flight and Brain Drain",
  "State Legitimacy",
  "Public Services",
  "Human Rights",
  "Demographic Pressures",
  "Refugees and IDPs",
  "External Intervention",
];

const continentColors = {
  Asia: "#BC04BF",
  Americas: "#F2CB05",
  Oceania: "#F21616",
  Europe: "#D96236",
  Africa: "#16F28B",
};

const colorMapping = {
  "Security Apparatus": "#00009F",
  "Demographic Pressures": "#800080",
  "Economic Inequality": "#FE9800",
  "Economy": "#CC6600",
  "External Intervention": "#E365E6",
  "Factionalized Elites": "#3265CB",
  "Group Grievance": "#99CCFF",
  "Human Flight and Brain Drain": "#FFCC66",
  "Human Rights": "#99FECC",
  "State Legitimacy": "#009999",
  "Public Services": "#33CCCC",
  "Refugees and IDPs": "#CC0099",
};

const propertyGroups = {
  Cohesion: ["Security Apparatus", "Factionalized Elites", "Group Grievance"],
  Economy: ["Economy", "Economic Inequality", "Human Flight and Brain Drain"],
  Governance: ["Human Rights", "State Legitimacy", "Public Services"],
  Society: ["Demographic Pressures", "Refugees and IDPs", "External Intervention"],
};

const paddingLeft = 30;

let filteredData;

// ///////////////////////////////////////////////////////////////////////
// renderer events and button logic
// ///////////////////////////////////////////////////////////////////////

$(function () {
  $("#renderer").addClass("allChart");

  stage = $("#renderer");
  stageHeight = stage.innerHeight();
  stageWidth = stage.innerWidth();

  createDivsForChart();

  $("#sortByCohesion").click(function () {
    console.log("sort by Cohesion");
    showGroup("Cohesion");
  });

  $("#sortByEconomic").click(function () {
    console.log("sort by Economy");
    showGroup("Economy");
  });

  $("#sortByPolitical").click(function () {
    console.log("sort by Governance");
    showGroup("Governance");
  });

  $("#sortBySocial").click(function () {
    console.log("sort by Society");
    showGroup("Society");
  });

  // drawRankChart(datasets[currentDatasetIndex]);
  if ($("#renderer").hasClass("worldChart")) {
    drawRankChart(datasets[currentDatasetIndex]);
  } else if ($("#renderer").hasClass("allChart")) {
    drawPropertyCharts(datasets[currentDatasetIndex]);
  }


  // note: the following code creates a dropdown that changes the year
  for (let i = 2006; i <= 2023; i++) {
    $("#yearDropdown").append(`<option value="${i - 2006}">${i}</option>`);
  }

  $('#yearDropdown').change(function () {
    // Update currentDatasetIndex to the selected year's index
    currentDatasetIndex = parseInt($(this).val());
    currentYearIndex = parseInt($(this).val());

    console.log("Year changed to:", datasets[currentDatasetIndex][0].Year);
    console.log("Current dataset index:", currentDatasetIndex);
    console.log("Current year index:", currentYearIndex);

    if ($("#renderer").hasClass("worldChart")) {
      drawRankChart(datasets[currentDatasetIndex]);
    } else if ($("#renderer").hasClass("allChart")) {
      drawPropertyCharts(datasets[currentDatasetIndex]);
    }


  });


  $("#chartSwitchButton").click(function () {
    $(".property-rectangle").remove();
    $(".bar").remove();


    if ($("#renderer").hasClass("worldChart")) {
      $("#renderer").removeClass("worldChart").addClass("allChart");
      $('.buttonstyleB').hide();
      $('.buttonstyle').show();
      $(".year-label").hide();
      $(".country-label").hide();
      $(".rank-label").hide();
      createDivsForChart();
      drawPropertyCharts(datasets[currentDatasetIndex]);
    } else if ($("#renderer").hasClass("allChart")) {
      $("#renderer").removeClass("allChart").addClass("worldChart");
      $('.buttonstyle').hide();
      $('.buttonstyleB').show();
      drawRankChart(datasets[currentDatasetIndex]);
    }

    console.log("Chart switched");
    console.log("Current class:", $("#renderer").attr("class"));

  });

  $("#resetButton").click(function () {
    $(".property-rectangle").remove();
    $(".bar").remove();
    $(".property-label").remove();
    $(".country-label").remove();
    $(".rank-label").remove();

    if ($("#renderer").hasClass("worldChart")) {
      drawRankChart(datasets[currentDatasetIndex]);
    } else if ($("#renderer").hasClass("allChart")) {
      createDivsForChart();
      drawPropertyCharts(datasets[currentDatasetIndex]);
    }
  });

});

// ///////////////////////////////////////////////////////////////////////
// hover logic for property rectangles with tooltip
// ///////////////////////////////////////////////////////////////////////

$("#renderer").on("mouseenter", ".property-rectangle", function (event) {
  const countryName = $(this).data("country");
  const propertyName = $(this).data("property");
  // Assuming you have this data attribute
  let actualValue;
  datasets[currentDatasetIndex].forEach(data => {
    if (data.Country === countryName) {
      actualValue = data[propertyName];
    }
  });

  $("#tooltip").text(`${countryName}, ${propertyName}: ${actualValue}`)
    .css({ top: event.pageY + 5 + "px", left: event.pageX + 5 + "px" })
    .show();
}).on("mouseleave", ".property-rectangle", function () {
  $("#tooltip").hide();
}).on("mousemove", ".property-rectangle", function (event) {
  $("#tooltip").css({ top: event.pageY + 5 + "px", left: event.pageX + 5 + "px" });
});


// ///////////////////////////////////////////////////////////////////////
// function for creating a bar chart for each country in second screen
// ///////////////////////////////////////////////////////////////////////

function drawRankChart() {
  // console.log("datasets", dataPerYear);

  // const dataPerYearArray = Object.entries(dataPerYear)
  const dataPerYearArray = Object.entries(dataPerYear).filter(([yearKey, _]) => yearKey !== "2006");
  const yearWidth = stageWidth / dataPerYearArray.length;


  dataPerYearArray.forEach(([yearKey, yearData], index) => {
    // console.log(index, yearKey, yearData)

    yearData.sort((a, b) => a.Rank - b.Rank);

    const xPos = yearWidth * index;


    yearData.forEach((country) => {
      const { Rank, continent, Country } = country;
      // YPos für Country
      const barHeight = ((stageHeight - 400) - paddingLeft * 2) / yearData.length / 2;
      const yPos = (Rank * barHeight * 2 + paddingLeft + barHeight / 2) + 150;

      let bar = $("<div></div>");
      bar.addClass("bar");
      bar.data("country", Country);
      bar.data("rank", Rank);
      bar.data("continent", continent);

      bar.css({
        height: barHeight,
        width: yearWidth - 50, // Adjust width as needed
        left: xPos + 10, // Add some padding
        top: yPos,
        background: continentColors[continent],
      });

      bar.click(function () {
        const selectedCountry = $(this).data("country");

        $(".rank-label").remove();

        // Initialize a variable to track the maximum top position of the bars
        let minTopPosition = stageHeight;

        $(".bar").each(function () {
          const currentTop = $(this).position().top;
          if (currentTop < minTopPosition) {
            minTopPosition = currentTop; // Update minTopPosition with the smallest value
          }

          if ($(this).data("country") === selectedCountry) {
            $(this).css({
              background: $(this).data("color"),
              opacity: 1
            });
          } else {
            $(this).css({
              background: 'gray',
              opacity: 0.5
            });
          }
        });

        const labelTopPosition = minTopPosition - 20;

        $(".country-label").remove();

        // Create and append the country name label
        const countryLabel = $("<div class='country-label'>" + selectedCountry + "</div>").css({
          position: 'absolute',
          top: labelTopPosition - 50 + "px", // Adjust so it's below the rank labels
          left: 10 + "px",
          color: 'white' // Position at the top left of the chart area
        });

        $("#renderer").append(countryLabel);
        console.log("selectedCountry", selectedCountry);

        // Create and append labels for all bars with the selected country
        $(".bar").each(function () {
          if ($(this).data("country") === selectedCountry) {
            const rank = $(this).data("rank"); // Retrieve the Rank value

            const label = $("<div class='rank-label'>" + "Rank " + "#" + rank + "</div>").css({
              position: 'absolute',
              top: (labelTopPosition) + "px", // Use the calculated position
              left: $(this).position().left + "px",
              width: $(this).width() + "px",
              // Ensure the label is above other elements
            });
            console.log("label", label);

            $(this).parent().append(label);
          }
        });
      });

      stage.append(bar);
    });

    let yearLabel = $("<div class='year-label'>" + yearKey + "</div>").css({
      position: 'absolute',
      top: stageHeight - 70 + "px", // Position the year label at the bottom
      left: (xPos) + 10, // Align with the year's column
      width: yearWidth + "px",
      textAlign: 'left',
      color: 'white'
    });

    stage.append(yearLabel);

  });

}


// ///////////////////////////////////////////////////////////////////////
// function for filtering the bars for the continents
// ///////////////////////////////////////////////////////////////////////

function filterContinent(continent) {
  console.log("filterContinent");
  $(".bar").each(function () {
    const barContinent = $(this).data("continent");
    // console.log("barContinent", barContinent);

    if (continent === "showAll" || barContinent === continent) {
      console.log("barContinent", barContinent);
      const originalColor = continentColors[barContinent];
      $(this).css({
        background: originalColor,
        opacity: 1,
      });
    } else {
      $(this).css({
        background: "gray",
        opacity: 0.5,
      });
    }
  });
}

$(document).ready(function () {
  $("button[data-continent]").click(function () {
    console.log("button clicked");
    const continent = $(this).data("continent");
    console.log("continent", continent);
    filterContinent(continent);
  });
});

// ///////////////////////////////////////////////////////////////////////
// function for creating a divs for each property for each country that can be used for all function of allchart
// ///////////////////////////////////////////////////////////////////////

let valueRect;

function createDivsForChart() {
  console.log(countryData.length);

  $("#renderer").addClass("allChart");

  let countryDataGrouped = gmynd.groupData(countryData, "Country");
  countryPropertyDivs = {};
  for (let country in countryDataGrouped) {
    if (countryDataGrouped[country].length == 18) {
      countryPropertyDivs[country] = {};
    } else {
      // delete all entries with this country name from countryData
      countryData = countryData.filter(function (ele) {
        return ele.Country != country;
      });
    }
  }
  console.log(countryData.length);
  console.log("countryPropertyDivs", countryPropertyDivs);

  // loop over the countries
  for (let country in countryPropertyDivs) {
    // continentCountry.forEach((country) => {
    // console.log(country);

    countryPropertyDivs[country] = {};

    // create container div
    let container = $("<div></div>");
    container.data("country", country);
    container.addClass("container-rectangle");
    countryPropertyDivs[country].container = container;
    $("#renderer").append(container);

    // create 12 divs for each country for each property
    properties.forEach((property) => {
      let div = $("<div></div>");
      div.addClass("property-rectangle");
      div.data("country", country);
      div.data("property", property);

      countryPropertyDivs[country][property] = div;

      div.css({
        position: "absolute",
        width: "50px",
        height: "5px",
        background: colorMapping[property],
      });


      // Append the country div to the body
      container.append(div);
      // console.log("div", div);
    });
  }
}

// ///////////////////////////////////////////////////////////////////////
// function for creating the allchart 
// ///////////////////////////////////////////////////////////////////////

function drawPropertyCharts(dataset) {

  let heightIndex = 0;
  dataset.forEach((data) => {
    const containerRect = countryPropertyDivs[data.Country].container;

    // let countryDiv = $("<div></div>");
    const recHeight = Math.floor((stageHeight - 100 * 2) / dataset.length / 2);
    // ((stageWidth - paddingLeft * 2) / sortedData.length / 2);
    const yPos = heightIndex * recHeight * 2 + 100 + recHeight / stageHeight;
    // (index * barWidth * 2) + 30 + barWidth / 2;

    containerRect.css({
      left: 30 + "px",
      top: yPos + 130 + "px",
    });

    let xPos = 0;

    // Iterate over each property of the data object
    properties.forEach((prop) => {
      if (countryPropertyDivs[data.Country]) {
        let valueRect = countryPropertyDivs[data.Country][prop];
        // console.log("b", valueRect);

        const value = data[prop];
        const recWidth = value * 15 + "px";

        // Set the width of the valueRect based on the property value
        valueRect.css({
          width: recWidth,
          height: recHeight + "px",
          left: xPos + "px",
          //top: yPos + "px",
        });

        valueRect.data("xPos", xPos);


        // Update the x position for the next valueRect
        xPos += parseInt(recWidth);
      }
    });

    heightIndex++;
  });
}

// ///////////////////////////////////////////////////////////////////////
// function for sorting allchart for groups of properties
// ///////////////////////////////////////////////////////////////////////

function showGroup(groupName) {
  const propertiesToShow = propertyGroups[groupName];
  const propertyPositions = {};
  propertiesToShow.forEach((property, index) => {
    propertyPositions[property] = index * ((stageWidth / propertiesToShow.length) / 2);
  });

  for (const countryName in countryPropertyDivs) {
    properties.forEach((property) => {
      let rectangle = countryPropertyDivs[countryName][property];
      if (propertiesToShow.includes(property)) {
        let xPos = propertyPositions[property] + paddingLeft;
        propertyLeftPositions[property] = xPos;

        rectangle.css({
          left: xPos + "px",
          transition: "left 0.5s ease-out",
          display: "block",
        });
      } else {
        rectangle.css({
          display: "none",
        });
      }
    });
  }
}

// ///////////////////////////////////////////////////////////////////////
// function for sorting allchart for sorting for one property
// ///////////////////////////////////////////////////////////////////////

function sortByProperty(property) {
  $("renderer").addClass("allChart");
  console.log(`Sorting by ${property}`);


  // let sortedData = datasets[currentDatasetIndex].sort((a, b) => b[property] - a[property]);
  let sortedData = [...datasets[currentDatasetIndex]].sort((a, b) => b[property] - a[property]);

  drawPropertyCharts(sortedData);
  console.log("sortedData", sortedData);
}

$(document).ready(function () {
  $("button[data-property]").click(function () {
    let property = $(this).data("property");
    sortByProperty(property);
  });
});
