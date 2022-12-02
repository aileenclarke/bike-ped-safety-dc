// LINE GRAPH
window.onload = function(){

    
        var lineW = 800, lineH= 375;
        var data = [
            {year:2015,location:"DC",fatal_rate:3.4},
            {year:2016,location:"DC",fatal_rate:3.6},
            {year:2017,location:"DC",fatal_rate:4.5},
            {year:2018,location:"DC",fatal_rate:4.4},
            {year:2019,location:"DC",fatal_rate:3.3},
            {year:2020,location:"DC",fatal_rate:5.2},
            {year:2021,location:"DC",fatal_rate:5.8},
            {year:2015,location:"US",fatal_rate:10.28},
            {year:2016,location:"US",fatal_rate:11.06},
            {year:2017,location:"US",fatal_rate:11.7},
            {year:2018,location:"US",fatal_rate:11.53},
            {year:2019,location:"US",fatal_rate:11.27},
            {year:2020,location:"US",fatal_rate:11.07},
            {year:2021,location:"US",fatal_rate:11.78}
        ];

        // select body element from DOM and return to var 'container'
        var lineSVG = d3.select("figure.lineGraph")
            .append("svg") //put a new svg in the body
            .attr("width", lineW)
            .attr("height", lineH)
            .style("background-color", "white");
            
            
        /*var innerRect = lineSVG.append("rect")
            .datum(400)
            .attr("width",800)
            .attr("width",400);*/

        // set top and left margin bc axes draw from the left and the top
        leftMargin = 70;
        topMargin = 30;

        //convert input data to year and array through the function
        var parseTime = d3.timeParse("%Y");
        data.forEach(function(d){
            d.year = parseTime(d.year);
        });

        
        var xExtent = d3.extent(data, d=>d.year); // returns the range of years
            //scale the time, pass to domain, and use range to draw the axis from left margin to 700 px
            xScale = d3.scaleTime().domain(xExtent).range([leftMargin, 700]); 
        
        // find the max value of fatality rate
        var yMax = d3.max(data, d=>d.fatal_rate); 
            //console.log(yMax)
            // set domain from 0 to 15 (since max value is 11). range is from 300 to the top (0)
            yScale = d3.scaleLinear().domain([0, 15]).range([300,0]);
            //console.log(yScale)
            
  
        // axis Bottom creates a horizontal axis and draws ticks/labels towards bottom
        // call this when drawing x axis below
        xAxis = d3.axisBottom()
            .scale(xScale)

        // draw x axis
        d3.select("SVG")
            .append("g")
            .attr("class","axis")
            .attr("transform","translate(0,300)") // axis is drawn from origin (0,0). use translate to move down.
            .call(xAxis)
            .append("text") //append axis label
            .attr("x",(700+70)/2) // position label centered below x axis (left margin+width)/2
            .attr("y","50") // position label below axis
            .text("Year")
 
        // axis lef creates vertical axis with ticks and numbers towards left
        // call this function from below
        yAxis = d3.axisLeft()
            .scale(yScale)
            .ticks(3) // specify number of ticks

        // draw y axis 
        d3.select("SVG")
            .append("g")
            .attr("class","axis")
            .attr("transform", 'translate(70,20)') // draw 70 px to right so room for labels and down 20 to intersect x axis
            .call(yAxis)
            .append("text") // append axis label
            .attr("transform","rotate(-90)") // rotate -90 so it writes vertically
            .attr("x","-10") //end of label should be -10 from origin 
            .attr("y", "-40") // y of label should be -40 from axis
            .attr("text-anchor","end") // tells d3 that x,y  position of text should be based on end of text
            .text("Fatalities per 100,000 Residents")
    
        // group data (nest) by location (key)
        var sumstat = d3.nest() 
            .key(d => d.location)
            .entries(data);

        //console.log(sumstat)
        //var locationName = sumstat.map(d => d.key)
        //var color = d3.scaleOrdinal().domain(locationName).range(colorbrewer.Set2[6])

        // draw paths
        d3.select("SVG")
            .selectAll(".line")
            .append("g")
            .attr("class","line")
            .data(sumstat) // use nested (grouped) data so a line will be drawn for each group
            .enter()
            .append("path") // draw lines by appending path
            .attr("d", function(d){ //attributed d defines pth to be drawn
                //console.log(d)
                return d3.line() // call d3.line to create d attrb of path following the points
                .x(d => xScale(d.year)) // set x as year
                .y(d => yScale(d.fatal_rate)).curve(d3.curveLinear) // set y as fatality rate and specify curve type
                (d.values)
            })
            .attr("fill","none")
            //.attr("stroke",d=> color(d.key))
            .attr("stroke","black")
            .attr("stroke-width",2)

        // opt. draw a circle for each point
        d3.select("SVG")
            .selectAll("circle")
            .append("g")
            .data(data) // use inteasted of sumstat bc we are not drawing one circle per group
            .enter()
            .append("circle")
            .attr("id","circleToolTip")
            .attr("r", 6) // size of circle
            .attr("cx", d => xScale(d.year)) // x coord of circle
            .attr("cy", d => yScale(d.fatal_rate)) // y coord of circle.
            .style("fill", "black")
            
        /*
        var tooltip2 = d3.select("SVG")
            .append("div")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .html("<p>I'm a tooltip written in HTML</p><img src='https://github.com/holtzy/D3-graph-gallery/blob/master/img/section/ArcSmal.png?raw=true'></img><br>Fancy<br><span style='font-size: 40px;'>Isn't it?</span>");
        
        d3.select("#circleTooltip")
            .on("mouseover", function(){return tooltip2.style("visibility", "visible");})
            .on("mousemove", function(){return tooltip2.style("top", (event.pageY-2390)+"px").style("left",(event.pageX-800)+"px");})
            .on("mouseout", function(){return tooltip2.style("visibility", "hidden");});
        */
};

// GLOBAL VARIABLES

var fatalPoints; // fatal accident point layer
var fatalityMap; // fatality map

var examplePoints; // fatal accident point layer
var exampleMap; // example map

var interactiveMap; // interactive map
var missingCrashPoints = L.geoJson(); // fatalities missing from dc crash reports
var includedCrashPoints = L.geoJson(); // fatalities included in dc crash reports
var dcWards = L.geoJson(); // dc ward polygon layer
var dcHIN = L.geoJson(); // dc high injury network line layer
var bikeLanes = L.geoJson(); // dc bike lanes line layer


// MAP OF FATALITIES 

// function to make things to react to scrolling
function fatalityScroll(){
        document.querySelectorAll('.fatal-points').forEach(function(div){
        //get element and element's property 'top'
            var rect = div.getBoundingClientRect();
            y = rect.top;
            
        //set the top margin as a ratio of innerHeight
        var topMargin = window.innerHeight/2;

        //call setStyle when top of element is halfway up innerHeight
        if ((y-topMargin) < 0 && y > 0){  
            fatalPoints.setStyle(function(feature){
                return fatalStyle(feature, div.id)
            });
        };                              
    });
};

function createFatalityMap(){
    fatalityMap = L.map('fatalityMap',{
        center:[38.889484, -77.11],
        zoom: 12,
        scrollWheelZoom: false
    });

    L.tileLayer('https://api.mapbox.com/styles/v1/amclarke2/clb41skpq000814kyotn3s90q/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYW1jbGFya2UyIiwiYSI6ImNrczZtNjkwdjAwZngycW56YW56cHUxaGsifQ._Cc2V5nKC5p2zfrYqw7Aww', { 
        attribution: '&copy <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> &copy <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(fatalityMap);

    getData();
}
 
// retrieve fatality point layer
function getData(){
    fetch("data/crashes.geojson")
        .then(function(response){
            return response.json(); //
        })
        .then(function(json){
            //create a geojson layer and add to map
            fatalPoints = L.geoJson(json, {
                pointToLayer: pointToLayer1
            }).addTo(fatalityMap);
            //call the style function that will style this map
            fatalPoints.setStyle(fatalStyle);
        });        
};

// style function to dynamically change point style
function fatalStyle(feature, divID){
    return {
        fillOpacity: opacityFilter(feature.properties, divID),
        fillColor: colorFilter(feature.properties, divID),
        weight: weightFilter(feature.properties, divID),
        color: strokeFilter(feature.properties, divID)
    };
};


// change point opacity based on property 'missing'
function opacityFilter(props, divID){
    //console.log(divID);
    if (divID === "start"){    
        return 0
    } else if (divID === "dcFatalities" && (props.missingCrashData === "n")) {
        return 1
    } else if (divID === "missingFatalities" && (props.missingCrashData === "n")) {
        return .5
    } else if (divID === "missingFatalities" && (props.missingCrashData === "y")){
        return 1 
    } else {
        return 0
    };
};


// change point color based on property 'missing'
function colorFilter(props, divID){
    if (divID === "start"){    
        return "#ead794"
    } else if (divID === "dcFatalities" && (props.missingCrashData === "n")) {
        return "#ead794"
    } else if (divID === "missingFatalities" && (props.missingCrashData === "n")) {
        return "#ead794"
    } else if (divID === "missingFatalities" && (props.missingCrashData === "y")){
        return "#ee9b00" 
    } else {
        return "#ead794"
    };
};


// change point stroke weight based on property 'missing'
function weightFilter(props, divID){
    if (divID === "start"){    
        return 0
    } else if (divID === "dcFatalities" && (props.missingCrashData === "n")) {
        return 1
    } else if (divID === "missingFatalities" && (props.missingCrashData === "n")) {
        return .5
    } else if (divID === "missingFatalities" && (props.missingCrashData === "y")){
        return 1 
    } else {
        return 0
    };
};


// change point stroke color based on property 'missing'
function strokeFilter(props, divID){
    if (divID === "start"){    
        return "#d8b957"
    } else if (divID === "dcFatalities" && (props.missingCrashData === "n")) {
        return "#d8b957"
    } else if (divID === "missingFatalities" && (props.missingCrashData === "n")) {
        return "#d8b957"
    } else if (divID === "missingFatalities" && (props.missingCrashData === "y")){
        return "#bd6f1d" 
    } else {
        return "#d8b957"
    };
};

// add points to fatality map
function pointToLayer1(feature, latlng){
    var options = {
        radius: 5,
        fillColor: "#FFFF00",
        color: "#000",
        weight: .5,
        opacity: 1,
        fillOpacity: 1,
        className:'point'
    };

    var layer = L.circleMarker(latlng, options);
    return layer; 
};

// BAR CHART FADE
// create array containing bar chart images
var barChartImages = [
    {id:"barChart1", src:"img/chart1.png"},
    {id:"barChart2", src:"img/chart2.png"}
];

/*
function barChartScroll(){
    
    document.querySelectorAll('.bar-chart').forEach(function(id){
    //get element and element's property 'top'
        console.log(id);
        var rect = id.getBoundingClientRect();
        y = rect.top;
        
    //set the top margin as a ratio of innerHeight
    var topMargin = window.innerHeight/2;
   
    //call setStyle when top of element is halfway up innerHeight
    if ((y-topMargin) < 0 && y > 0){  
        document.querySelector("#base").src=src;
    };                              
});
};
*/

// trigger image switch on scroll
function barChartScroll(){
    barChartImages.forEach(function(item){   
        barChartPosition(item.id, item.src); 
    });
};

function barChartPosition(id, src){
    var barChartText = document.getElementById(id);
    var rect = barChartText.getBoundingClientRect(id);
    y = rect.top;

    var topMargin = window.innerHeight/2;

    if((y-topMargin) < 0 && y > 0){
        document.querySelector("#base").src=src
    };
};

// EXAMPLE MAP

function createExampleMap(){
    exampleMap = L.map('exampleMap',{
        center:[38.889484, -77.11],
        zoom: 12,
        scrollWheelZoom: false
    });
    
    L.tileLayer('https://api.mapbox.com/styles/v1/amclarke2/clb41skpq000814kyotn3s90q/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYW1jbGFya2UyIiwiYSI6ImNrczZtNjkwdjAwZngycW56YW56cHUxaGsifQ._Cc2V5nKC5p2zfrYqw7Aww', { 
        attribution: '&copy <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> &copy <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(exampleMap);
    
    getExampleData();
}

function getExampleData(){ 
    fetch("data/includedCrashes.geojson")
        .then(function(response){
            return response.json(); //
        })
        .then(function(json){
            //create a geojson layer and add to map
            includedCrashPoints = L.geoJson(json, {
                onEachFeature:function(feature, layer){
                    var includedCrashPoints = createIncludedPopupContent(feature);
                    layer.bindPopup(includedCrashPoints)
                },
                pointToLayer: pointToLayerIncluded
            }).addTo(exampleMap);
            //examplePoints.setStyle(exampleStyle);
        });
    fetch("data/missingCrashes.geojson")
        .then(function(response){
            return response.json(); //
        })
        .then(function(json){
            //create a geojson layer and add to map
            missingCrashPoints = L.geoJson(json, {
                onEachFeature:function(feature, layer){
                    var missingPopupContent = createMissingPopupContent(feature);
                    layer.bindPopup(missingPopupContent)
                },
                pointToLayer: pointToLayerMissing
            }).addTo(exampleMap);
            //examplePoints.setStyle(exampleStyle);
        });        
};

/*
function exampleStyle(feature){
    return {
        fillColor: exampleColorFilter(feature.properties),
        color: exampleStrokeFilter(feature.properties)
    };
};

// change point color based on property 'missing'
function exampleColorFilter(props){
    if (props.missingCrashData === "n"){    
        return "#ead794"
    } else {
        return "#ee9b00"
    };
};

// change point stroke weight based on property 'missing'
function exampleStrokeFilter(props){
    if (props.missingCrashData === "n"){    
        return "#d8b957"
    } else {
        return "#bd6f1d"
    };
};
*/

var fly = [
    {
        id: "example0",
        location: [38.889484, -77.11],
        zoom: 12
    },
    {
        id: "example1",
        location: [38.83604110351087, -76.99579140014306],
        zoom: 15
    }, 
    {
        id: "example2",
        location: [38.88147148920925, -76.93301621616287],
        zoom: 14.5
    },
    {
        id:"example3",
        location: [38.9265607809075, -76.99369603295193],
        zoom: 14.5
    }
];

function exampleScroll(){
    fly.forEach(function(item){
        examplePosition(item.id, item.location, item.zoom)
    });
};

function examplePosition(id, location, zoom){
    // get element and element's property 'top'
    var block1 = document.getElementById(id);
    var rect = block1.getBoundingClientRect();
    y = rect.top;

    // set the top margin as a ratio of innerHeight
    var topMargin = window.innerHeight / 2;

    // call flyTo when top of element is halfway up innerHeight
    if ((y-topMargin) < 0 && y > 0){
        exampleMap.flyTo(location, zoom, {
            animate: true,
            duration: 2 // in seconds
        });
    };
}

// add points to fatality map
function pointToLayer2(feature, latlng){
    var options = {
        radius: 5,
        fillColor: "#FFFF00",
        color: "#000",
        weight: .5,
        opacity: 1,
        fillOpacity: 1,
        className:'point'
    };

    var layer = L.circleMarker(latlng, options);

    var popupContent = "<p><b>name:</b> " + feature.properties.name + "</p>";
    layer.bindPopup(popupContent);

    return layer; 
};

// INTERACTIVE MAP

function createInteractiveMap(){
    interactiveMap = L.map('interactiveMap',{
        center:[38.8985, -77.0319],
        zoom: 11.5,
        //scrollWheelZoom: false,
    });
    
    L.tileLayer('https://api.mapbox.com/styles/v1/amclarke2/clb41skpq000814kyotn3s90q/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYW1jbGFya2UyIiwiYSI6ImNrczZtNjkwdjAwZngycW56YW56cHUxaGsifQ._Cc2V5nKC5p2zfrYqw7Aww', { 
        attribution: '&copy <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> &copy <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(interactiveMap);

    var layerControl = L.control.layers().addTo(interactiveMap);
    getInteractiveData(layerControl);

    
    //interactiveMap.options.layers = [missingCrashPoints,dcWards,dcHIN,bikeLanes]
    
    /*var overlays = {
        'Fatalities': missingCrashPoints,
        'Wards': dcWards,
        'High Incident Network': dcHIN,
        'Bike Lanes': bikeLanes
    };*/

   
    //layerControl.addOverlayLayer(overlays);
    
    
}

function getInteractiveData(layerControl){ 
    fetch("data/dcWards.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            dcWards = L.geoJson(json, {
                style:function(feature){
                    return {
                        color: "#94d2bd",
                        weight: 1.5,
                    }
                }
            }).addTo(interactiveMap);
            layerControl.addOverlay(dcWards, "Wards");
        });
    fetch("data/dcHIN.geojson")
        .then(function(response){
            return response.json();
        })      
        .then(function(json){
            dcHIN = L.geoJson(json, {
                style:function(feature){
                    return {
                        color: hinStroke(feature.properties),
                        weight: 1
                    }
                }
            }).addTo(interactiveMap);
            layerControl.addOverlay(dcHIN, "High Injury Network");

        });
    fetch("data/bikeLanes.geojson")
        .then(function(response){
            return response.json();
        })      
        .then(function(json){
            bikeLanes= L.geoJson(json, {
                onEachFeature:function(feature, layer){
                    var bikeLanePopup = createBikeLanePopup(feature);
                    layer.bindPopup(bikeLanes)
                },
                style:function(feature){
                    return {
                        color:"white",
                        weight: 1
                        //stroke:laneStroke(feature.properties)
                    }
                }
            }).addTo(interactiveMap);
            layerControl.addOverlay(bikeLanes, "Bike Lanes");

        });
    fetch("data/includedCrashes.geojson")
        .then(function(response){
            return response.json(); //
        })
        .then(function(json){
            //create a Leaflet GeoJSON layer and add it to the map
            includedCrashPoints = L.geoJson(json,{
                //pop ups
                onEachFeature:function(feature, layer){
                    var includedCrashPoints = createIncludedPopupContent(feature);
                    layer.bindPopup(includedCrashPoints)
                },
                //convert from points to layers
                pointToLayer: pointToLayerIncluded
            }).addTo(interactiveMap);
            layerControl.addOverlay(missingCrashPoints, "Fatal Accidents included in DC Crash Data"); 

        });
    fetch("data/missingCrashes.geojson")
        .then(function(response){
            return response.json(); //
        })
        .then(function(json){
            //create a Leaflet GeoJSON layer and add it to the map
            missingCrashPoints = L.geoJson(json,{
                //pop ups
                onEachFeature:function(feature, layer){
                    var missingPopupContent = createMissingPopupContent(feature);
                    layer.bindPopup(missingPopupContent)
                },
                //convert from points to layers
                pointToLayer: pointToLayerMissing
            }).addTo(interactiveMap);
            layerControl.addOverlay(missingCrashPoints, "Fatal Accidents missing from DC Crash Data"); 
        });
};

function hinStroke(props){
    if (props.Tier_1 === 1){    
        return "#e63946"
    } else if (props.Tier_2 === 1){
        return "#e63946"
    } else if (props.Tier_3 === 1){
        return "#e63946"
    } else {
        return "#e63946"
    };
};

function createBikeLanePopup(feature){
    var bikeLanePopup = "<p><b>Conventional Bike Lane:</b> " + feature.properties.BIKELANE_2 + 
    "</p><p><b>Dual Protected Bike Lane:</b> " + feature.properties.BIKELANE_D + 
    "</p><p><b>Dual Buffered Bike Lane:</b> " + feature.properties.BIKELANE_3 +
    "</p><p><b>Protected Bike Lane:</b> " + feature.properties.BIKELANE_4 +
    "</p><p><b>Buffered Bike Lane:</b> " + feature.properties.BIKELANE_B +
    "</p><p><b>Road:</b> " + feature.properties.ROUTENAME
    return bikeLanePopup 
};

function createMissingPopupContent(feature){
        var missingCrashPoints = "<p><b>Victim Name:</b> " + feature.properties.name + 
        "</p><p><b>Victim Type:</b> " + feature.properties.vic_type + 
        "</p><p><b>Victim Age:</b> " + feature.properties.vic_age +
        "</p><p><b>Total Victims:</b> " + feature.properties.vic_tot +
        "</p><p><b>Date:</b> " + feature.properties.date +
        "</p><p><b>Ward:</b> " + feature.properties.WARD +
        "</p><p><b>Included in city crash data:</b> " + "No" +
        "</p><p><b>Notes:</b> " + feature.properties.notes
        return missingCrashPoints 
};

function createIncludedPopupContent(feature){
        var includedCrashPoints = 
        "</p><p><b>Pedestrian Fatalities:</b> " + feature.properties.FATAL_PEDE +
        "</p><p><b>Bicyclist Fatalities:</b> " + feature.properties.FATAL_BICY +
        "</p><p><b>Driver Fatalities:</b> " + feature.properties.FATAL_DRIV +
        "</p><p><b>Passenger Fatalities:</b> " + feature.properties.FATALPASSE +
        "</p><p><b>Date:</b> " + feature.properties.FROMDATE +
        "</p><p><b>Ward:</b> " + feature.properties.WARD_1
        return includedCrashPoints 
};

function pointToLayerMissing(feature, latlng){
    var options = {
        radius: 5,
        fillColor: "#ee9b00",
        color: "#bd6f1d",
        weight: .5,
        opacity: 1,
        fillOpacity: 1,
        className:'point'
    };

    var layer = L.circleMarker(latlng, options);
    return layer; 
};

function pointToLayerIncluded(feature, latlng){
    var options = {
        radius: 5,
        fillColor: "#ead794",
        color: "#d8b957",
        weight: .5,
        opacity: 1,
        fillOpacity: 1,
        className:'point'
    };

    var layer = L.circleMarker(latlng, options);
    return layer; 
};

document.addEventListener('DOMContentLoaded', createFatalityMap)
document.addEventListener('DOMContentLoaded', createExampleMap)
document.addEventListener('DOMContentLoaded', createInteractiveMap)
document.addEventListener('scroll', fatalityScroll)
document.addEventListener('scroll', exampleScroll)
document.addEventListener('scroll', barChartScroll)