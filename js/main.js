let stage;
let stageHeight;
let stageWidth;
let currentDatasetIndex = 0;
let currentYearIndex = 0;

let dataset = rankedAndGroupedDatasets[currentYearIndex];

let data1 = [];
let elementsPerRow1 = [];


const continentColors = {
    "Asia": '#16F28B',
    "Americas": '#F2CB05',
    "Oceania": '#F2AB27',
    "Europe": '#D96236',
    "Africa": '#8C2E26'
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

    let continentIndex = 0;
    const numberOfContinents = Object.keys(data1).length;
    console.log("numberOfContinents", numberOfContinents);
    const continentChartWidth = stageWidth / numberOfContinents;

    for (continent in data1) {
        const continentData = data1[continent];
        let posX = continentIndex * continentChartWidth;
        createTreeMap(continentData, elementsPerRow1[continentIndex], posX, 500, (continentChartWidth / 2));
        continentIndex++;
    }

    // note: the following code creates a button that changes the year
    $('#yearButton').click(function () {
        currentDatasetIndex = (currentDatasetIndex + 1) % datasets.length;
        currentYearIndex++; // Move to the next year
        if (currentYearIndex >= rankedAndGroupedDatasets.length) { // If we've gone past the last year, loop back to the first year
            currentYearIndex = 0;
        }

        data1 = drawContinentChart(rankedAndGroupedDatasets[currentYearIndex]);
        elementsPerRow1 = drawContinentChart(rankedAndGroupedDatasets[currentYearIndex]);

        $('#yearLabel').text('Year: ' + datasets[currentDatasetIndex][0].Year);
        stage.empty();

        drawWorldchart(datasets[currentDatasetIndex])
        drawContinentChart(rankedAndGroupedDatasets[currentYearIndex]);

    });
});

function drawWorldchart(datasets) {

    const barHeight = 80;
    let yPos = 150;


    // // // console.log(sortedData)

    // note: the following code sorts the data by rank
    const sortedData = datasets.sort((low, high) => low.Rank - high.Rank);
    // // // // console.log("sorted", sortedData);

    const barWidth = ((stageWidth - paddingLeft * 2) / sortedData.length / 2);

    const rankMin = gmynd.dataMin(sortedData, 'Rank')
    const rankMax = gmynd.dataMax(sortedData, 'Rank')

    // note: the following code itterates over the sorted data and creates a bar for each country
    for (let index in sortedData) {
        const { Rank, continent, Country } = sortedData[index];

        // Use the Rank value to determine the xPos
        // // console.log(index);
        let xPos = (index * barWidth * 2) + 30 + barWidth / 2;

        let bar = $('<div></div>');
        bar.addClass('bar');
        bar.data('country', Country);

        const rankPercentageA = gmynd.map(Rank, rankMin, rankMax, 20, 0)

        let colorScale = chroma.scale([continentColors[continent], 'black']).mode('lab');
        let color = colorScale(rankPercentageA / 100).hex();

        bar.css({
            'height': barHeight,
            'width': barWidth,
            'left': xPos,
            'top': yPos,
            // 'background': `linear-gradient(90deg, ${continentColors[continent]} 0%, ${continentColors[continent]} ${rankPercentage}%, ${signalColors[continent]} 100%`
            'background': color
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
            // // // // console.log('Hover active');
            // // // // console.log(Country);
        });

        bar.mouseout(function () {
            bar.removeClass('hover');
            $('#hoverLabel').text('');

        });



        stage.append(bar);
    }
}

function drawContinentChart(rankedAndGroupedDatasets) {
    let rankMax = {};
    let rankMin = {};

    for (let continent in rankedAndGroupedDatasets) {
        let ranks = rankedAndGroupedDatasets[continent].map(country => country.Rank);
        rankMax[continent] = Math.max(...ranks);
        rankMin[continent] = Math.min(...ranks);
    }

    // // console.log("A", rankMax); // Logs the maximum rank for each continent
    // // console.log("B", rankMin);

    let continents = ["Africa", "Americas", "Asia", "Europe", "Oceania"];

    // // console.log("Datenset", rankedAndGroupedDatasets)

    continents.forEach(continent => {
        let countries = rankedAndGroupedDatasets[continent];
        data1[continent] = [];

        countries.forEach((country) => {
            data1[continent].push(Math.floor(gmynd.map(country.Rank, rankMin[continent], rankMax[continent], 100, 7)))
        });
        elementsPerRow1.push(arrayalgo(countries.length));
    });

    // for (let continent in rankedAndGroupedDatasets) {
    //     elementsPerRow1.push(arrayalgo(rankedAndGroupedDatasets[continent].length));
    // }
    console.log("rankedAndGroupedDatasets", rankedAndGroupedDatasets)
    console.log("data1", data1);
    console.log("elementsPerRow1", elementsPerRow1);
    console.log("data1", data1[continents[4]]);
    console.log("elementsPerRow1", elementsPerRow1[4]);

}

function createTreeMap(data, elementsPerRow, treemapX, treemapY, treemapWidth) {
    const heightFactor = 150; // Adjusts the height of the rows
    // // console.log("inside")

    let actY = treemapY;
    let actIndex = 0;
    // // console.log("length", data[continent].length);

    elementsPerRow.forEach((count) => {
        // console.log("data", data);
        // Get the number of elements from the data array
        const elements = data.slice(actIndex, actIndex + count);
        // console.log('elements', elements);
        // Sum the elements to get the total value
        const total = elements.reduce((a, b) => a + b, 0);
        // console.log("total:", total);
        // Calculate the height of the row
        const rowHeight = (total / treemapWidth) * heightFactor;
        // console.log("rowHeight:", rowHeight);

        // Create the row
        let actX = treemapX;
        elements.forEach((value) => {
            // Calculate the width of the block
            const blockWidth = (value / total) * treemapWidth;
            // console.log("blockWidth:", blockWidth);
            
            
            const rankPercentageB = gmynd.map(value, 0, total, 100, -100);

            let colorScale = chroma.scale(['black',continentColors[continent]]).mode('lab');
            let color = colorScale(rankPercentageB / 100).hex();

            // Create the block and append it to the renderer
            const block = $("<div class='block'></div>");
            block.css({
                width: blockWidth + "px",
                height: rowHeight + "px",
                left: actX + "px",
                top: actY + "px",
                // background: `linear-gradient(90deg, ${continentColors[continent]} 0%, ${continentColors[continent]} ${rankPercentage}%, ${signalColors[continent]} 100%`
                background: color

            });
            stage.append(block);

            actX += blockWidth;
        });

        actIndex += count;
        actY += rowHeight;
    });
}
