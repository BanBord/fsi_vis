// note: this is old code that creates the Continent Chart
function drawContinentChart() {
    const containerWidth = 500;
    const containerHeight = 800;

    const gap = containerWidth + 50

    const rows = [1, 4, 5, 13, 17];

    const continentColors = {
        "Asia": 'rgb(139,190,70)',
        "Americas": 'rgb(242,208,82)',
        "Oceania": 'rgb(254,109,57)',
        "Europe": 'rgb(110,82,162)',
        "Africa": 'rgb(160,170,161)'
    };

    for (let i = 0; i < 5; i++) {
        let container = $('<div></div>');
        container.addClass('continent-container');

        container.css({
            'width': containerWidth,
            'height': containerHeight,
            'position': 'absolute',
            'left': i * gap + 50,
            'top': 400
        });

        // note: the following code creates a table for each container

        if (i === 0) { // If it's the first container, create the table
            let table = $('<div></div>');
            table.addClass('table');

            let countries = rankedAndGroupedDatasets[0].Africa;

            let maxTotal = Math.max(...countries.map(country => country.Total));

            // let countryIndex = 0; 


            // note: the following code creates a table with the countries in the first container
            // for (let j = 0; j < rows.length; j++) {
            //     let row = $('<div></div>');
            //     row.addClass('row');
            //     row.css({
            //         'display': 'grid',
            //         'grid-template-columns': `repeat(${rows[j]}, 1fr)`
            //     });

            //     for (let k = 0; k < rows[j]; k++) {
            //         let cell = $('<div></div>');
            //         cell.addClass('cell');

            //         cell.mouseover(function (hover) {
            //             cell.addClass('hover')
            //             // console.log('Hover active');
            //             $('#hoverLabel').text(countries[k].Country + ', Rank: ' + countries[k].Rank)

            //             $('#hoverLabel').css({
            //                 'left': hover.pageX + 10,
            //                 'top': hover.pageY + 50
            //             });
            //         });
            //         row.append(cell);
            //         countryIndex++;
            //         // console.log(countryIndex);
            //         }
            //         table.append(row);

            // let cells = [];
            // for (let j = 0; j < rows.length; j++) {
            //     console.log(rows[j]);
            //     for (let k = 0; k < rows[j]; k++) {
            //         cells.push({ row: j, col: k });
            //     }
            // }


            // for (let i = 0; i < countries.length; i++) {
            //     let cell = cells[i];
            //     if (cell) {
            //         let country = countries[i];
            //         let row = $('<div></div>');
            //         row.addClass('row');
            //         row.css({
            //             'display': 'grid',
            //             'grid-template-columns': `repeat(${rows[cell.row]}, 1fr)`
            //         });

            //         let cellElement = $('<div></div>');
            //         cellElement.addClass('cell');
            //         cellElement.css('background-color', continentColors.Africa);
            //         let heightPercentage = (country.Total / maxTotal) * 100;
            //         cellElement.css('height', `${heightPercentage}%`);
            //         cellElement.text(country.Country);

            //         row.append(cellElement);
            //         table.append(row);
            //     }
            // }
            if (i === 0) { // If it's the first container, create the table
                let table = $('<div></div>');
                table.addClass('table');
            
                let countries = rankedAndGroupedDatasets[0].Africa;
                let maxTotal = Math.max(...countries.map(country => country.Total));
            
                let countryIndex = 0; // Counter for the current country
            
                for (let j = 0; j < rows.length; j++) { // Iterate over the rows
                    let row = $('<div></div>');
                    row.addClass('row');
                    row.css({
                        'display': 'grid',
                        'grid-template-columns': `repeat(${rows[j]}, 1fr)`
                    });
            
                    for (let k = 0; k < rows[j]; k++) { // Iterate over the cells in the current row
                        let cell = $('<div></div>');
                        cell.addClass('cell');
            
                        if (countries[countryIndex]) { // If there's a country for this cell
                            let country = countries[countryIndex];
                            cell.text(country.Country); // Add the country name to the cell
                            // ... rest of your cell setup code ...
                            countryIndex++; // Increment the country index after creating each cell
                        }
            
                        row.append(cell);
                    }
            
                    table.append(row);
                }
            

                container.append(table);
            }

            stage.append(container);
        }
    }
}

for (let i = 0; i < rankedAndGroupedDatasets.length; i++) {
    let year = rankedAndGroupedDatasets[i].year;
    let dataset = rankedAndGroupedDatasets[i].data;
    const containerWidth = 500;
    const containerHeight = 800;

    const gap = containerWidth + 50

    const continentColors = {
        "Asia": 'rgb(139,190,70)',
        "Americas": 'rgb(242,208,82)',
        "Oceania": 'rgb(254,109,57)',
        "Europe": 'rgb(110,82,162)',
        "Africa": 'rgb(160,170,161)'
    };

    for (let i = 0; i < years.length; i++) {
        let year = years[i];
        let dataset = rankedAndGroupedDatasets[year];
        console.log("dataset", dataset);

        for (let continent in dataset) { // Iterate over the continents in the current dataset
            let countries = dataset[continent];
            let rows = arrayalgo(countries.length); // Apply arrayalgo to the current continent array

            let container = $('<div></div>');
            container.addClass('container');

            let table = $('<div></div>');
            table.addClass('table');
            table.css({ 'width': '100%', 'height': '100%' });

            let countryIndex = 0;
            let maxTotal = Math.max(...countries.map(country => country.Total));

            // // note: the following code creates a table for each container

            // if (i === 0) { // If it's the first container, create the table
            //     let table = $('<div></div>');
            //     table.addClass('table');

            //     let countries = rankedAndGroupedDatasets[0].Africa;

            //     if (i === 0) { // If it's the first container, create the table
            //         let table = $('<div></div>');
            //         table.addClass('table');

            //         let countries = rankedAndGroupedDatasets[0].Africa;
            //         let maxTotal = Math.max(...countries.map(country => country.Total));

            //         let countryIndex = 0; // Counter for the current country

            for (let j = 0; j < rows.length; j++) { // Iterate over the rows
                let row = $('<div></div>');
                row.addClass('row');
                row.css({ 'display': 'grid', 'grid-template-columns': `repeat(${rows[j]}, 1fr)` });

                for (let k = 0; k < rows[j]; k++) { // Iterate over the cells in the current row
                    let cell = $('<div></div>');
                    cell.addClass('cell');

                    if (countries[countryIndex]) { // If there's a country for this cell
                        let country = countries[countryIndex];
                        cell.text(country.Country);
                        cell.css('background-color', continentColors[continent]); // Add the country name to the cell
                        let heightPercentage = (country.Total / maxTotal) * 100;
                        cell.css('height', `${heightPercentage}%`);
                        countryIndex++;

                        cell.mouseover(function (hover) {
                            cell.addClass('hover')
                            $('#hoverLabel').text(countries[k].Country + ', Rank: ' + countries[k].Rank)

                            $('#hoverLabel').css({
                                'left': hover.pageX + 10,
                                'top': hover.pageY + 50,
                                'font-color': 'black'
                            });// Set the cell height based on the country's total value
                        });
                        // Increment the country index after creating each cell
                    }

                    row.append(cell);
                }

                table.append(row);
            }


            container.append(table);
        }

        stage.append(container);
    }
}

// for (let year in dataPerYear) {
//     let dataset = dataPerYear[year];

//     // Sort the countries in the dataset based on the Rank property
//     let sortedDataset = dataset.sort((low, high) => low.Rank - high.Rank);

//     // Group the countries by continent
//     let groupedDataset = {
//         "Asia": sortedDataset.filter(country => country.continent === "Asia"),
//         "Americas": sortedDataset.filter(country => country.continent === "Americas"),
//         "Oceania": sortedDataset.filter(country => country.continent === "Oceania"),
//         "Europe": sortedDataset.filter(country => country.continent === "Europe"),
//         "Africa": sortedDataset.filter(country => country.continent === "Africa")
//     };

//     rankedAndGroupedDatasets[year] = groupedDataset;
// }
