let countryDataGrouped = gmynd.groupData(countryData, "Country");
for (let country in countryDataGrouped) {
  if (countryDataGrouped[country].length < 18) {
    // console.log("deleted data for ", country);
    // delete all entries with this country name from countryData
    countryData = countryData.filter(function (ele) {
      return ele.Country != country;
    });
  }
}

let mergedData;
let dataPerYear = {};

mergedData = gmynd.mergeData(countryData, continentCountry, "Country", "name");

gmynd.deletePropsInData(mergedData, ["name"]);

gmynd.sortData(mergedData, ["continent"]);

function convertPropsToNumber(data, props) {
  props.forEach((prop) => {
    gmynd.convertPropToNumber(data, prop);
  });
}

// Usage
const props = [
  "Total",
  "Security Apparatus",
  "Demographic Pressures",
  "Economic Inequality",
  "Economy",
  "External Intervention",
  "Factionalized Elites",
  "Group Grievance",
  "Human Flight and Brain Drain",
  "Human Rights",
  "State Legitimacy",
  "Public Services",
  "Refugees and IDPs",
];
convertPropsToNumber(mergedData, props);
// note: following code checks each value for "Year" element inside the mergedData array and creates a new array for every ne year (06-23) with the year as key and the countries as value

mergedData.forEach((country) => {
  const year = country.Year;

  if (!dataPerYear[year]) {
    dataPerYear[year] = [];
  }

  dataPerYear[year].push(country);
});
// // console.log(mergedData);
// // console.log(dataPerYear);
// note: following code creates a new array for each year

let datasets = [];
for (let i = 2006; i <= 2023; i++) {
   const d = dataPerYear[i];
    datasets.push(d);
}

console.log("datasets", datasets);

let rankedAndGroupedDatasets = datasets.map((dataset) => {
  // Sort the countries in the dataset based on the Rank property
  let sortedDataset = dataset.sort((low, high) => low.Rank - high.Rank);

  // Group the countries by continent
  let groupedDataset = {
    Asia: sortedDataset.filter((country) => country.continent === "Asia"),
    Americas: sortedDataset.filter((country) => country.continent === "Americas"),
    Oceania: sortedDataset.filter((country) => country.continent === "Oceania"),
    Europe: sortedDataset.filter((country) => country.continent === "Europe"),
    Africa: sortedDataset.filter((country) => country.continent === "Africa"),
  };

  return groupedDataset;
});
