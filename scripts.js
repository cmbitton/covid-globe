function displayCountryData(data) {
const results = document.querySelector('.stats-container');
results.innerHTML = '';

const casesContainer = document.createElement('div');
const casesHeader = document.createElement('h3');
const totalCases = document.createElement('p');
const newCases = document.createElement('p');
const activeCases = document.createElement('p');
const recoveredCases = document.createElement('p');
const criticalCases = document.createElement('p');

const deathsContainer = document.createElement('div');
const deathsHeader = document.createElement('h3');
const totalDeaths = document.createElement('p');
const newDeaths = document.createElement('p');

casesHeader.classList.add('cases-header');
casesHeader.textContent = 'Cases';

deathsHeader.classList.add('deaths-header');
deathsHeader.textContent = 'Deaths';

casesContainer.classList.add('cases-container');
totalCases.classList.add('total-cases');
newCases.classList.add('new-cases');
activeCases.classList.add('active-cases');
recoveredCases.classList.add('recovered-cases');
criticalCases.classList.add('critical-cases');

deathsContainer.classList.add('deaths-container');
totalDeaths.classList.add('total-deaths');
newDeaths.classList.add('new-deaths')

casesContainer.append(casesHeader);
casesContainer.append(newCases);
casesContainer.append(activeCases);
casesContainer.append(criticalCases);
casesContainer.append(recoveredCases);
casesContainer.append(totalCases);

deathsContainer.append(deathsHeader);
deathsContainer.append(newDeaths);
deathsContainer.append(totalDeaths);


results.append(casesContainer);
results.append(deathsContainer);

totalCases.innerHTML = `Total: <span class='total-case-number'>${data.cases.total.toLocaleString()}</span>`;
newCases.innerHTML = `New: <span class='new-case-number'>${data.cases.new === null ? 'null' : '+' + parseInt(data.cases.new).toLocaleString()}</span>`;
activeCases.innerHTML = `Active: <span class='active-case-number'>${data.cases.active === null ? 'null' : data.cases.active.toLocaleString()}</span>`;
criticalCases.innerHTML = `Critical: <span class='critical-case-number'>${data.cases.critical === null ? 'null' : data.cases.critical.toLocaleString()}</span>`;
recoveredCases.innerHTML = `Recovered: <span class='recovered-case-number'>${data.cases.recovered.toLocaleString()}</span>`;

newDeaths.innerHTML = `New: <span class='new-deaths-number'>${data.deaths.new === null ? 'null' : '+' + parseInt(data.deaths.new).toLocaleString()}</span>`;
totalDeaths.innerHTML = `Total: <span class='total-deaths-number'>${data.deaths.total.toLocaleString()}</span>`;
console.log(data);
}

am5.ready(function () {

    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new("chartdiv");


    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
        am5themes_Animated.new(root)
    ]);


    // Create the map chart
    // https://www.amcharts.com/docs/v5/charts/map-chart/
    var chart = root.container.children.push(am5map.MapChart.new(root, {
        panX: "rotateX",
        panY: "rotateY",
        maxPanOut: 0,
        projection: am5map.geoOrthographic(),
        paddingBottom: 100,
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 50
    }));
    //calculate location for reset map buton
    const buttonXcor = () => {
        const globe = document.querySelector('#chartdiv');
        return globe.offsetWidth < 700 ? globe.offsetWidth - 115 : globe.offsetWidth - 120
    }

    const buttonYcor = () => {
        const globe = document.querySelector('#chartdiv');
        return globe.offsetWidth < 700 ? globe.offsetHeight - 50 : globe.offsetHeight - 60
    }


    //button to reset map
    let button = chart.children.push(am5.Button.new(root, {
        x: buttonXcor(),
        y: buttonYcor(),
        paddingTop: 2,
        paddingRight: 4,
        paddingBottom: 2,
        paddingLeft: 4,
        position: 'absolute',
        label: am5.Label.new(root, {
          text: "Reset Map"
        })
      }));

      button.get("background").setAll({
        fillOpacity: 0.8
      });

      button.events.on("click", function() {
        chart.goHome();
      });

    //run gohome on load to reset display and resolve padding issue
    window.addEventListener('load', () => {
        //need settimeout function to allow map to show after page reload for some reason
        setTimeout(() => {
            chart.goHome();
        }, 0);
    });

    //run gohome on screensize change to recenter map
    window.addEventListener('resize', () => {
        setTimeout(() => {
            chart.goHome();
            button.set('x', buttonXcor());
            button.set('y', buttonYcor());
        }, 0);
    });

    // Create main polygon series for countries
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
    var polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ['US']
    }));

    polygonSeries.mapPolygons.template.setAll({
        tooltipText: "{name}",
        toggleKey: "active",
        strokeWidth: 2,
        interactive: true
    });
    if (window.innerWidth > 700) {
        polygonSeries.mapPolygons.template.states.create("hover", {
            fill: am5.color(0xFF8C42)
        });
    }

    polygonSeries.mapPolygons.template.states.create("active", {
        fill: am5.color(0xFF8C42)
    });

    // US Series
    // Create main polygon series for countries
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
    var polygonSeriesUS = chart.series.push(am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_usaLow
    }));

    polygonSeriesUS.mapPolygons.template.setAll({
        tooltipText: "{name}",
        toggleKey: "active",
        strokeWidth: 2,
        interactive: true
    });

    if (window.innerWidth > 700) {
        polygonSeriesUS.mapPolygons.template.states.create("hover", {
            fill: am5.color(0xFF8C42)
        });
    }

    polygonSeriesUS.mapPolygons.template.states.create("active", {
        fill: am5.color(0xFF8C42)
    });




    // Create series for background fill
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/#Background_polygon
    var backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
    backgroundSeries.mapPolygons.template.setAll({
        fill: root.interfaceColors.get("alternativeBackground"),
        fillOpacity: 0.1,
        strokeOpacity: 0
    });
    backgroundSeries.data.push({
        geometry: am5map.getGeoRectangle(90, 180, -90, -180)
    });


    // Set up events
    var previousPolygon;

    polygonSeries.mapPolygons.template.on("active", function (active, target) {
        if (previousPolygon && previousPolygon != target) {
            previousPolygon.set("active", false);
        }
        if (target.get("active")) {
            selectCountry(target.dataItem.get("id"));
        }
        previousPolygon = target;
    });

    function selectCountry(id) {
        var dataItem = polygonSeries.getDataItemById(id);
        var target = dataItem.get("mapPolygon");
        if (target) {
            var centroid = target.geoCentroid();
            if (centroid) {
                chart.animate({ key: "rotationX", to: -centroid.longitude, duration: 1500, easing: am5.ease.inOut(am5.ease.cubic) });
                chart.animate({ key: "rotationY", to: -centroid.latitude, duration: 1500, easing: am5.ease.inOut(am5.ease.cubic) });
            }
        }
    }

    //set up click event to display country name (custom script)
    const results = document.querySelector('.results-container');
    const resultHeader = results.querySelector('h2')
    polygonSeries.mapPolygons.template.events.on('click', function () {
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'aa46c0285emshc2e3dc0cac56061p159b49jsn22a03f2fdb16',
                'X-RapidAPI-Host': 'covid-193.p.rapidapi.com'
            }
        };
        const selectedCountry = document.querySelector('div[role="tooltip"]');
        if (selectedCountry) {
            resultHeader.textContent = selectedCountry.textContent;
        }
        const formatedCountryName = selectedCountry.textContent.split(' ').join('-');
        //get country data from API
        fetch(`https://covid-193.p.rapidapi.com/statistics?country=${formatedCountryName}`, options)
            .then(response => response.json())
            .then(response => {
                console.log(response);
                displayCountryData(response.response[0])
            })
            .catch(err => console.error(err));

    })
    // end of custom script

    // Set up events for US

    //set up click event for US (custom script)

    polygonSeriesUS.mapPolygons.template.events.on('click', function () {
        const selectedCountry = document.querySelector('div[role="tooltip"]');
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'aa46c0285emshc2e3dc0cac56061p159b49jsn22a03f2fdb16',
                'X-RapidAPI-Host': 'covid-19-statistics.p.rapidapi.com'
            }
        };
        if (selectedCountry) {
            resultHeader.textContent = selectedCountry.textContent;
        }

        fetch(`https://covid-19-statistics.p.rapidapi.com/reports?q=${selectedCountry.textContent}`, options)
            .then(response => response.json())
            .then(response => {
                //checks to make sure state name matches
                for (const res of response.data) {
                    if (res.region.province === resultHeader.textContent) {
                        console.log(res);
                    }
                }
                console.log(response.data)
            })
            .catch(err => console.error(err));
    })
    // end of custom script
    polygonSeriesUS.mapPolygons.template.on("active", function (active, target) {
        if (previousPolygon && previousPolygon != target) {
            previousPolygon.set("active", false);
        }
        if (target.get("active")) {
            selectState(target.dataItem.get("id"));
        }
        previousPolygon = target;
    });

    function selectState(id) {
        var dataItem = polygonSeriesUS.getDataItemById(id);
        var target = dataItem.get("mapPolygon");
        if (target) {
            var centroid = target.geoCentroid();
            if (centroid) {
                chart.animate({ key: "rotationX", to: -centroid.longitude, duration: 1500, easing: am5.ease.inOut(am5.ease.cubic) });
                chart.animate({ key: "rotationY", to: -centroid.latitude, duration: 1500, easing: am5.ease.inOut(am5.ease.cubic) });
            }
        }
    }


    // Uncomment this to pre-center the globe on a country when it loads
    //polygonSeries.events.on("datavalidated", function() {
    //  selectCountry("AU");
    //});


    // Make stuff animate on load
    chart.appear(1000, 100);

}); // end am5.ready()
