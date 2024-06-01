let stage;
let stageHeight;
let stageWidth;
let currentDatasetIndex = 0;
let currentYearIndex = 0;

let dataset = rankedAndGroupedDatasets[currentYearIndex];

const data1 = [];
const elementsPerRow1 = [];


const continentColors = {
    "Asia": '#FAD236',
    "Americas": '#155B20',
    "Oceania": '#BD271A',
    "Europe": '#2F98AD',
    "Africa": '#661B7A'
};

const signalColors = {
    "Asia": '#FEF6D7',
    "Americas": '#B9CEBC',
    "Oceania": '#EBBEBA',
    "Europe": '#C1E0E6',
    "Africa": '#D1BBD7'
};

const paddingLeft = 30;

$(function () {
    stage = $('#renderer')
    stageHeight = stage.innerHeight();
    stageWidth = stage.innerWidth();
    drawWorldchart(datasets[currentDatasetIndex]);
    drawContinentChart(rankedAndGroupedDatasets[currentYearIndex]);
    createTreeMap(data1, elementsPerRow1, 400, 100, 200);
    // drawContinentChart(rankedAndGroupedDatasets);

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

        drawContinentChart(rankedAndGroupedDatasets[currentYearIndex]);

    });
});

function drawWorldchart(datasets) {

    const barHeight = 80;
    let yPos = 150;


    // // console.log(sortedData)

    // note: the following code sorts the data by rank
    const sortedData = datasets.sort((low, high) => low.Rank - high.Rank);
    // // // console.log("sorted", sortedData);

    const barWidth = ((stageWidth - paddingLeft * 2) / sortedData.length / 2);

    const rankMin = gmynd.dataMin(sortedData, 'Rank')
    const rankMax = gmynd.dataMax(sortedData, 'Rank')

    // console.log("rankMin", rankMin)
    // console.log("rankMax", rankMax)

    const maxRank = sortedData.length;



    // note: the following code itterates over the sorted data and creates a bar for each country
    for (let index in sortedData) {
        const { Rank, continent, Country } = sortedData[index];

        // Use the Rank value to determine the xPos
        // console.log(index);
        let xPos = (index * barWidth * 2) + 30 + barWidth / 2;

        let bar = $('<div></div>');
        bar.addClass('bar');
        bar.data('country', Country);

        const rankPercentage = gmynd.map(Rank, rankMin, rankMax, 95, 5)


        bar.css({
            'height': barHeight,
            'width': barWidth,
            'left': xPos,
            'top': yPos,
            'background': `linear-gradient(90deg, ${continentColors[continent]} 0%, ${continentColors[continent]} ${rankPercentage}%, ${signalColors[continent]} 100%`
        });


        // map the gradinet to the bar
        // note: the following code checks if there is a matching country in the drawWorldChart function 
        bar.hover(
            function () {
                let country = $(this).data('country');
                $('.bar, .cell').not(this).filter(function () {
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
            // // // console.log('Hover active');
            // // // console.log(Country);
        });

        bar.mouseout(function () {
            bar.removeClass('hover');
            $('#hoverLabel').text('');

        });



        stage.append(bar);
    }
}

function drawContinentChart(rankedAndGroupedDatasets) {

    createTreeMap(data1, elementsPerRow1, 400, 100, 200);

    let rankMax = {};
    let rankMin = {};

    for (let continent in rankedAndGroupedDatasets) {
        let ranks = rankedAndGroupedDatasets[continent].map(country => country.Rank);
        rankMax[continent] = Math.max(...ranks);
        rankMin[continent] = Math.min(...ranks);
    }

    console.log("A", rankMax); // Logs the maximum rank for each continent
    console.log("B", rankMin);

    let continents = ["Africa", "Americas", "Asia", "Europe", "Oceania"];

    console.log("Datenset", rankedAndGroupedDatasets)

    continents.forEach(continent => {
        let countries = rankedAndGroupedDatasets[continent];
        data1[continent] = [];

        countries.forEach((country) => {
            data1[continent].push(Math.floor(gmynd.map(country.Rank, rankMin[continent], rankMax[continent], 100, 7)))
        });
    });

    for (let continent in rankedAndGroupedDatasets) {
        elementsPerRow1.push(arrayalgo(rankedAndGroupedDatasets[continent].length));
    }

    console.log("Data", data1)
    console.log("Elements", elementsPerRow1)


    // const paddingContainer = 20;

    // const containerWidth = (stageWidth - paddingLeft * 2 - paddingContainer * 5) / 5 + paddingContainer / 5 - 1;
    // const containerHeight = 600;
    // let gap = containerWidth;
    // let i = 0;

    // let dataset = rankedAndGroupedDatasets;

    // rankedAndGroupedDatasets[countries].forEach((continent, index) => {
    //     data1.push(Math.floor(gmynd.map(continent.Rank, 1, 118, 100, 7)))
    //     // für 1 und 118 die maxiamle wert und minimale werte variablen festlegen, die automatisch die werte von rank variablen auslesen
    // })

    // Schleife durch rankedAndGroupedDatasets
    // umformen für Rangwert von Hartmut
    // const data1 = [100, 80, 70, 40, 30, 25, 25, 17, 14, 12, 8, 6, 5];


    // const elementsPerRow1 = [1, 2, 4, 6];
    // createTreeMap(data1, elementsPerRow1, 100, 100, 150);




    // for (let continent in dataset) { // note: this iterates over the continents in the current dataset
    //     let countries = dataset[continent];

    //     const rankMin = gmynd.dataMin(countries, 'Rank')
    //     const rankMax = gmynd.dataMax(countries, 'Rank')


    //     let container = $('<div></div>');

    //     container.css({ 'width': containerWidth, 'height': containerHeight, 'left': 30 + (i * gap + i * paddingContainer), 'top': 400 });
    //     container.addClass('container');
    //     i++;
    //     // // // console.log(dataset,countries)
    //     let rows = arrayalgo(countries.length);

    //     let table = $('<div></div>');
    //     table.addClass('table');
    //     table.css({ 'width': '100%', 'height': '100%' });


    //     let countryIndex = 0;
    //     for (let j = 0; j < rows.length; j++) {

    //         let maxTotal = Math.max(...countries.map(country => country.Total));

    //         // // // console.log(countryIndex)// Iterate over the rows

    //         let row = $('<div></div>');
    //         row.addClass('row');
    //         row.css({ 'display': 'grid', 'grid-template-columns': `repeat(${rows[j]}, 1fr)` });

    //         for (let k = 0; k < rows[j]; k++) { // Iterate over the cells in the current row
    //             let cell = $('<div></div>');
    //             cell.addClass('cell');

    //             cell.css('min-height', '20px');

    //             if (countries[countryIndex]) { // If there's a country for this cell
    //                 let country = countries[countryIndex];
    //                 // cell.text(country.Country, "Rank", country.Rank);
    //                 cell.data('country', country.Country);

    //                 // // console.log(country.Rank)
    //                 // // console.log("length", countries.length)	

    //                 const rankPercentage = gmynd.map(country.Rank, rankMin, rankMax, 95, 1.5)
    //                 cell.css('background', `linear-gradient(180deg, ${continentColors[continent]} 0%, ${continentColors[continent]} ${rankPercentage}%, ${signalColors[continent]} 100%`);

    //                 // let rankPercentage = ((country.Rank - countries.length) / country.Rank ) * 100;
    //                 // cell.css('background', `linear-gradient(to bottom, ${continentColors[continent]} ${rankPercentage}%, ${signalColors[continent]} ${100 - rankPercentage}%`);

    //                 // let heightPercentage = (country.Total / maxTotal) * 100;
    //                 // cell.css('height', `${heightPercentage}%`);

    //                 cell.attr('data-rank', country.Rank)

    //                 countryIndex++;

    //                 cell.mouseover(function (hover) {
    //                     cell.addClass('hover')
    //                     $('#hoverLabel').text(country.Country)
    //                     $('#hoverLabel').css({
    //                         'left': hover.pageX + 50,
    //                         'top': hover.pageY + 50,
    //                         'font-size': '20px'
    //                     });
    //                 });

    //                 cell.mouseout(function () {
    //                     cell.removeClass('hover');
    //                     $('#hoverLabel').text('');
    //                 });
    //             }
    //             // note: the following code checks if there is a matching country in the drawWorldChart function 
    //             cell.hover(
    //                 function () {
    //                     let country = $(this).data('country');
    //                     $('.bar, .cell').not(this).filter(function () {
    //                         return $(this).data('country') !== country;
    //                     }).css('opacity', 0.2);
    //                 },
    //                 function () {
    //                     $('.bar, .cell').css('opacity', 1);
    //                 }
    //             );



    //             row.append(cell);
    //         }

    //         table.append(row);
    //     }

    //     container.append(table);
    //     stage.append(container);
    // }
}

function createTreeMap(data, elementsPerRow, treemapX, treemapY, treemapWidth) {
    const heightFactor = 70; // Adjusts the height of the rows
    console.log("inside")

    let actIndex = 0;
    let actY = treemapY;
    console.log(data)

    elementsPerRow.forEach((count) => {
        console.log("data", data);
        // Get the number of elements from the data array
        const elements = data.slice(actIndex, actIndex + count);
        console.log('elements', elements);
        // Sum the elements to get the total value
        const total = elements.reduce((a, b) => a + b, 0);
        console.log("total:", total);
        // Calculate the height of the row
        const rowHeight = (total / treemapWidth) * heightFactor;
        console.log("rowHeight:", rowHeight);

        // Create the row
        let actX = treemapX;
        elements.forEach((value) => {
            // Calculate the width of the block
            const blockWidth = (value / total) * treemapWidth;
            console.log("blockWidth:", blockWidth);

            // Create the block and append it to the renderer
            const block = $("<div class='block'></div>");
            block.css({
                width: blockWidth + "px",
                height: rowHeight + "px",
                left: actX + "px",
                top: actY + "px",
            });
            renderer.append(block);

            actX += blockWidth;
        });

        actIndex += count;
        actY += rowHeight;
    }); 7
}
