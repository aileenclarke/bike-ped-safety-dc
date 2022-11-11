
window.onload = function(){

    
        var lineW = 900, lineH= 700;
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

        leftMargin = 70;
        topMargin = 30;

        var parseTime = d3.timeParse("%Y");

        data.forEach(function(d){
            d.year = parseTime(d.year);
        });

        var xExtent = d3.extent(data, d=>d.year); // returns the range of years
            xScale = d3.scaleTime().domain(xExtent).range([leftMargin, 900]);

        var yMax = d3.max(data, d=>d.fatal_rate); 
            yScale = d3.scaleLinear().domain([0, yMax+topMargin]).range([600,0]);
            
  

        xAxis = d3.axisBottom()
            .scale(xScale)

        d3.select("SVG")
            .append("g")
            .attr("class","axis")
            .attr("transform","translate(0,500)")
            .call(xAxis)
            .append("text")
            .attr("x",(900+70)/2)
            .attr("y","50")
            .text("Year")

        yAxis = d3.axisLeft()
            .scale(yScale)
            .ticks(3)

        d3.select("SVG")
            .append("g")
            .attr("class","axis")
            .attr("transform", 'translate(70,20)')
            .call(yAxis)
            .append("text")
            .attr("transform","rotate(-90)")
            .attr("x","150")
            .attr("y", "-50")
            .attr("text-anchor","end")
            .text("Fatalities per 100,000 Residents")
    
        //var sumstat = d3.group(data, d=>d.location);
        var sumstat = d3.nest() 
            .key(d => d.location)
            .entries(data);

        console.log(sumstat)
        //var locationName = sumstat.map(d => d.key)
        //var color = d3.scaleOrdinal().domain(locationName).range(colorbrewer.Set2[6])

        d3.select("SVG")
            .selectAll(".line")
            .append("g")
            .attr("class","line")
            .data(sumstat)
            .enter()
            .append("path")
            .attr("d", function(d){
                console.log(d)
                return d3.line()
                .x(d => xScale(d.year))
                .y(d => yScale(d.fatal_rate)).curve(d3.curveCardinal)
                (d.values)
            })
            .attr("fill","none")
            //.attr("stroke",d=> color(d.key))
            .attr("stroke","black")
            .attr("stroke-width",2)
    

};