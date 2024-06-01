let mergedData;
let dataPerYear = {};
mergedData = gmynd.mergeData(countryData, continentCountry, "Country", "name");

gmynd.deletePropsInData(mergedData, ["name"]); 

gmynd.sortData(mergedData, ["continent"])

gmynd.convertPropToNumber(mergedData, "Total");
// note: following code checks each value for "Year" element inside the mergedData array and creates a new array for every ne year (06-23) with the year as key and the countries as value

mergedData.forEach((country) => { 
    const year = country.Year;

    if (!dataPerYear[year]) {
        dataPerYear[year] = [];
    }

    dataPerYear[year].push(country);
});
// console.log(mergedData);
// console.log(dataPerYear);
// note: following code creates a new array for each year 

const data2006 = dataPerYear[2006];
const data2007 = dataPerYear[2007];
const data2008 = dataPerYear[2008];
const data2009 = dataPerYear[2009];
const data2010 = dataPerYear[2010];
const data2011 = dataPerYear[2011];
const data2012 = dataPerYear[2012];
const data2013 = dataPerYear[2013];
const data2014 = dataPerYear[2014];
const data2015 = dataPerYear[2015];
const data2016 = dataPerYear[2016];
const data2017 = dataPerYear[2017];
const data2018 = dataPerYear[2018];
const data2019 = dataPerYear[2019];
const data2020 = dataPerYear[2020];
const data2021 = dataPerYear[2021];
const data2022 = dataPerYear[2022];
const data2023 = dataPerYear[2023];

// note: following code creates an array with all the years

let datasets = [data2006, data2007, data2008, data2009, data2010, data2011, data2012, data2013, data2014, data2015, data2016, data2017, data2018, data2019, data2020, data2021, data2022, data2023];
console.log("datasets", datasets);

let rankedAndGroupedDatasets = datasets.map(dataset => {
    // Sort the countries in the dataset based on the Rank property
    let sortedDataset = dataset.sort((low, high) => low.Rank - high.Rank);

    // Group the countries by continent
    let groupedDataset = {
        "Asia": sortedDataset.filter(country => country.continent === "Asia"),
        "Americas": sortedDataset.filter(country => country.continent === "Americas"),
        "Oceania": sortedDataset.filter(country => country.continent === "Oceania"),
        "Europe": sortedDataset.filter(country => country.continent === "Europe"),
        "Africa": sortedDataset.filter(country => country.continent === "Africa")
    };

    return groupedDataset;
});




