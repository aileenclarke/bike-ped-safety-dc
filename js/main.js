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
            .style("background-color", "rgba(0,0,0,0.2)");
            
            
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

var fatalPoints; //fatal accident point layer
var firstMap; // fatality map
var examplePoints;
var secondMap; // example map

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
    firstMap = L.map('firstMap',{
        center:[38.889484, -77.11],
        zoom: 12,
        scrollWheelZoom: false
    });

    L.tileLayer('https://api.mapbox.com/styles/v1/amclarke2/cl0g3m8oh000h14n0ok1oan43/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYW1jbGFya2UyIiwiYSI6ImNrczZtNjkwdjAwZngycW56YW56cHUxaGsifQ._Cc2V5nKC5p2zfrYqw7Aww', { 
        attribution: '&copy <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> &copy <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(firstMap);

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
                pointToLayer: pointToLayer
            }).addTo(firstMap);
            //call the style function that will style this map
            fatalPoints.setStyle(fatalStyle);
        });        
};

// style function to dynamically change point style
function fatalStyle(feature, divID){
    return {
        fillOpacity: opacityFilter(feature.properties, divID),
        fillColor: colorFilter(feature.properties, divID),
        weight: weightFilter(feature.properties, divID)/*,
        color: strokeFilter(feature.properties, divID)*/
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
        return "#ffffff"
    } else if (divID === "dcFatalities" && (props.missingCrashData === "n")) {
        return "#ffff00"
    } else if (divID === "missingFatalities" && (props.missingCrashData === "n")) {
        return "#000000"
    } else if (divID === "missingFatalities" && (props.missingCrashData === "y")){
        return "#ffff00" 
    } else {
        return "#ffffff"
    };
};


// change point stroke weight based on property 'missing'
function weightFilter(props, divID){
    if (divID === "start"){    
        return 0
    } else if (divID === "dcFatalities" && (props.missingCrashData === "n")) {
        return 1
    } else if (divID === "missingFatalities" && (props.missingCrashData === "n")) {
        return .8
    } else if (divID === "missingFatalities" && (props.missingCrashData === "y")){
        return 1 
    } else {
        return 0
    };
};


// change point stroke weight based on property 'missing'
function strokeFilter(props, divID){
    if (divID === "start"){    
        return "#ffffff"
    } else if (divID === "dcFatalities" && (props.missingCrashData === "n")) {
        return "#ffff00"
    } else if (divID === "missingFatalities" && (props.missingCrashData === "n")) {
        return "#000000"
    } else if (divID === "missingFatalities" && (props.missingCrashData === "y")){
        return "#ffff00" 
    } else {
        return "#ffffff"
    };
};

// add points to fatality map
function pointToLayer(feature, latlng){
    var options = {
        radius: 5,
        fillColor: "#FFFF00",
        color: "#000",
        weight: .5,
        opacity: 1,
        fillOpacity: 0.8,
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
        barChartPosition(item.id, item.src) 
    });
};

function barChartPosition(id, src){
    var barChartText = document.getElementById(id);
    console.log(barChartText);
    var rect = barChartText.getBoundingClientRect();
    y = rect.top;

    var topMargin = window.innerHeight/2;

    if((y-topMargin) < 0 && y > 0){
        document.querySelector("#base").src=src
    };
};

// EXAMPLE MAP

function createExampleMap(){
    secondMap = L.map('secondMap',{
        center:[38.889484, -77.11],
        zoom: 12,
        scrollWheelZoom: false
    });
    
    L.tileLayer('https://api.mapbox.com/styles/v1/amclarke2/cl0g3m8oh000h14n0ok1oan43/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYW1jbGFya2UyIiwiYSI6ImNrczZtNjkwdjAwZngycW56YW56cHUxaGsifQ._Cc2V5nKC5p2zfrYqw7Aww', { 
        attribution: '&copy <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> &copy <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(secondMap);
    
    //getExampleData();
}

function getExampleData(){
    
    fetch("data/crashes.geojson")
        .then(function(response){
            
            return response.json(); //
        })
        .then(function(json){
            //create a geojson layer and add to map
            console.log("hello");
            examplePoints = L.geoJson(json, {
                pointToLayer: pointToLayer
            }).addTo(secondMap);

        });        
};


document.addEventListener('DOMContentLoaded', createFatalityMap)
document.addEventListener('DOMContentLoaded', createExampleMap)
document.addEventListener('scroll', fatalityScroll)
//document.addEventListener('scroll', barChartScroll)