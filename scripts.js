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
        projection: am5map.geoOrthographic(),
        paddingBottom: 0,
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0
    }));


    // Create main polygon series for countries
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
    var polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ['US']
    }));

    polygonSeries.mapPolygons.template.setAll({
        tooltipText: "{name}",
        toggleKey: "active",
        interactive: true
    });

    polygonSeries.mapPolygons.template.states.create("hover", {
        fill: am5.color(0xFF8C42)
    });

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
        interactive: true
    });


    polygonSeriesUS.mapPolygons.template.states.create("hover", {
        fill: am5.color(0xFF8C42)
    });

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

        fetch(`https://covid-193.p.rapidapi.com/statistics?country=${selectedCountry.textContent}`, options)
        .then(response => response.json())
        .then(response => console.log(response))
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
                    if (res.region.province === selectedCountry.textContent) {
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
