let stage;
let stageHeight;
let stageWidth;
let currentDatasetIndex = 0;
let currentYearIndex = 0;

let dataset = rankedAndGroupedDatasets[currentYearIndex];



const continentColors = {
    "Asia": '#E4C2F2',
    "Americas": '#4A2B8C',
    "Oceania": '#C4D929',
    "Europe": '#F2CF1D',
    "Africa": '#F28322'
};


console.log("hallo! ich bin main.js");

$(function () {
    stage = $('#renderer')
    stageHeight = stage.innerHeight();
    stageWidth = stage.innerWidth();
    drawWorldchart(datasets[currentDatasetIndex]);
    // drawContinentChart(rankedAndGroupedDatasets);

    // drawContinentChart();
    // note: the following code creates a button that changes the year
    $('#yearButton').click(function () {
        currentDatasetIndex = (currentDatasetIndex + 1) % datasets.length;

        $('#yearLabel').text('Year: ' + datasets[currentDatasetIndex][0].Year);

        stage.empty();

        drawWorldchart(datasets[currentDatasetIndex])

        currentYearIndex++; // Move to the next year
        if (currentYearIndex >= rankedAndGroupedDatasets.length) { // If we've gone past the last year, loop back to the first year
            currentYearIndex = 0;
        }
        // console.log("currentYearIndex", currentYearIndex)
        // Call the function that uses the dataset here, for example:
        drawContinentChart(rankedAndGroupedDatasets[currentYearIndex]);

    });


});

function drawWorldchart(datasets) {

    const barHeight = 80;
    let yPos = 150;
    // note: the following code sorts the data by rank
    const sortedData = datasets.sort((low, high) => low.Rank - high.Rank);
    // console.log("sorted", sortedData);

    const barWidth = 2800 / (sortedData.length * 2);

    // note: the following code itterates over the sorted data and creates a bar for each country
    for (let index in sortedData) {
        const { Rank, continent, Country } = sortedData[index];
        // console.log(`Rank: ${Rank}`);

        // console.log(`Continent: ${continent}, Color: ${continentColors[continent]}`);
        // Use the Rank value to determine the xPos
        let xPos = (index * barWidth) + 50;

        let bar = $('<div></div>');
        bar.addClass('bar');
        bar.data('country', Country);

        bar.css({
            'height': barHeight,
            'width': barWidth,
            'left': xPos,
            'top': yPos,
            'background-color': continentColors[continent]
        });

        // bar.hover(
        //     function () {
        //         $('.bar').not(this).css('opacity', 0.2);
        //     },
        //     function () {
        //         $('.bar').css('opacity', 1);
        //     }
        // );
        bar.hover(
            function () {
                let country = $(this).data('country');
                $('.bar, .cell').not(this).filter(function() {
                    return $(this).data('country') !== country;
                }).css('opacity', 0.2);
            },
            function () {
                $('.bar, .cell').css('opacity', 1);
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

function drawContinentChart(rankedAndGroupedDatasets) {
    const containerWidth = 500;
    const containerHeight = 800;
    let gap = containerWidth + 50;
    let i = 0;

    // note: doppelt gemoppelte schleife continer class hier / Raus bauen rein bauen

    let dataset = rankedAndGroupedDatasets;



    for (let continent in dataset) { // note: this iterates over the continents in the current dataset
        let countries = dataset[continent];


        let container = $('<div></div>');

        // container.css({ 'width': containerWidth, 'height': containerHeight, 'left': 150 + (i * gap), 'top': 400 });
        container.css({ 'width': containerWidth, 'height': containerHeight, 'left': 150 + (i * gap), 'top': 400, 'display': 'flex', 'justify-content': 'center', 'align-items': 'center' });
        i++;
        container.addClass('container');
        // console.log(dataset,countries)
        let rows = arrayalgo(countries.length);

        let table = $('<div></div>');
        table.addClass('table');
        table.css({ 'width': '100%', 'height': '100%' });



        let countryIndex = 0;
        for (let j = 0; j < rows.length; j++) {

            let maxTotal = Math.max(...countries.map(country => country.Total));

            console.log(countryIndex)// Iterate over the rows

            let row = $('<div></div>');
            row.addClass('row');
            row.css({ 'display': 'grid', 'grid-template-columns': `repeat(${rows[j]}, 1fr)` });

            for (let k = 0; k < rows[j]; k++) { // Iterate over the cells in the current row
                let cell = $('<div></div>');
                cell.addClass('cell');

                if (countries[countryIndex]) { // If there's a country for this cell
                    let country = countries[countryIndex];
                    cell.text(country.Country);
                    cell.data('country', country.Country);


                    cell.css('background-color', continentColors[continent]);

                    let heightPercentage = (country.Total / maxTotal) * 100;
                    cell.css('height', `${heightPercentage}%`);

                    countryIndex++;

                    cell.mouseover(function (hover) {
                        cell.addClass('hover')
                        $('#hoverLabel').text(country.Country)
                        $('#hoverLabel').css({
                            'left': hover.pageX + 10,
                            'top': hover.pageY + 50
                        });
                    });

                    cell.mouseout(function () {
                        cell.removeClass('hover');
                        $('#hoverLabel').text('');
                    });
                }

                cell.hover(
                    function () {
                        let country = $(this).data('country');
                        $('.bar, .cell').not(this).filter(function() {
                            return $(this).data('country') !== country;
                        }).css('opacity', 0.2);
                    },
                    function () {
                        $('.bar, .cell').css('opacity', 1);
                    }
                );



                row.append(cell);
            }

            table.append(row);
        }

        container.append(table);

        stage.append(container);

    }
}

