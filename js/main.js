let stage;
let stageHeight;
let stageWidth;
let currentDatasetIndex = 0;
let currentYearIndex = 0;
drawContinentChart(rankedAndGroupedDatasets);

console.log("hallo! ich bin main.js");

$(function () {
    stage = $('#renderer')
    stageHeight = stage.innerHeight();
    stageWidth = stage.innerWidth();
    drawWorldchart(datasets[currentDatasetIndex]);

    // drawContinentChart();
    // note: the following code creates a button that changes the year
    $('#yearButton').click(function () {
        currentDatasetIndex = (currentDatasetIndex + 1) % datasets.length;

    });
    $('#yearLabel').text('Year: ' + datasets[currentDatasetIndex][0].Year);

    stage.empty();

    drawWorldchart(datasets[currentDatasetIndex]);
});



function drawWorldchart(datasets) {

    const barHeight = 80;
    let yPos = 150;
    // note: the following code sorts the data by rank
    const sortedData = datasets.sort((low, high) => low.Rank - high.Rank);
    // console.log("sorted", sortedData);

    const barWidth = 2800 / (sortedData.length * 2);

    // console.log("length", sortedData.length)

    // console.log("barWidth", barWidth);

    const continentColors = {
        "Asia": 'rgb(139,190,70)',
        "Americas": 'rgb(242,208,82)',
        "Oceania": 'rgb(254,109,57)',
        "Europe": 'rgb(110,82,162)',
        "Africa": 'rgb(160,170,161)'
    };

    // note: the following code itterates over the sorted data and creates a bar for each country
    for (let index in sortedData) {
        const { Rank, continent, Country } = sortedData[index];
        // console.log(`Rank: ${Rank}`);

        // console.log(`Continent: ${continent}, Color: ${continentColors[continent]}`);
        // Use the Rank value to determine the xPos
        let xPos = (index * barWidth) + 50;

        let bar = $('<div></div>');
        bar.addClass('bar');

        bar.css({
            'height': barHeight,
            'width': barWidth,
            'left': xPos,
            'top': yPos,
            'background-color': continentColors[continent]
        });

        bar.hover(
            function () {
                $('.bar').not(this).css('opacity', 0.2);
            },
            function () {
                $('.bar').css('opacity', 1);
            }
        );


        bar.mouseover(function (hover) {
            bar.addClass('hover')
            $('#hoverLabel').text(Country + ', Rank: ' + Rank)

            $('#hoverLabel').css({
                'left': hover.pageX + 10,
                'top': hover.pageY + 50
            });

            // console.log('Hover active');
            // console.log(Country);
        });

        bar.mouseout(function () {
            bar.removeClass('hover');
            $('#hoverLabel').text('');
        });



        stage.append(bar);
    }
}


// function drawContinentChart() {
//     const containerWidth = 500;
//     const containerHeight = 800;

//     const gap = containerWidth + 50

//     for (let i = 0; i < 5; i++) {
//         let container = $('<div></div>');
//         container.addClass('continent-container');

//         container.css({
//             'width': containerWidth,
//             'height': containerHeight,
//             'position': 'absolute',
//             'left': i * gap + 50,
//             'top': 400
//         });

//         stage.append(container);
//     }
// }


console.log("außerhalb");
function drawContinentChart(rankedAndGroupedDatasets) {
    let dataset = rankedAndGroupedDatasets[currentYearIndex];

    const continentColors = {
        "Asia": 'rgb(139,190,70)',
        "Americas": 'rgb(242,208,82)',
        "Oceania": 'rgb(254,109,57)',
        "Europe": 'rgb(110,82,162)',
        "Africa": 'rgb(160,170,161)'
    };

    for (let year in rankedAndGroupedDatasets) { // Iterate over the years
        let dataset = rankedAndGroupedDatasets[year];
        console.log("innerhalb");
        for (let continent in dataset) { // Iterate over the continents in the current dataset
            let countries = dataset[continent];
            let rows = arrayalgo(countries.length);
            // Apply arrayalgo to the current continent array

            let container = $('<div></div>');
            container.addClass('container');

            let table = $('<div></div>');
            table.addClass('table');
            table.css({ 'width': '100%', 'height': '100%' });

            let countryIndex = 0;
            let maxTotal = Math.max(...countries.map(country => country.Total));

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
                        cell.css('background-color', continentColors[continent]);
                        let heightPercentage = (country.Total / maxTotal) * 100;
                        cell.css('height', `${heightPercentage}%`);
                        countryIndex++;
                    }

                    row.append(cell);
                }

                table.append(row);
            }

            container.append(table);
            stage.append(container);
        }
    }
}
