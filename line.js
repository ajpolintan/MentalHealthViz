d3.csv("csv/suicide_range.csv", function(d) { 
    return {
      date: d3.timeParse("%Y")(d.Year),
      year: d.Year,
      sex: d.Sex,
      count: +d.SuicideCount,
      age_rate: +d.StdDeathRate,
      rate: +d.DeathRatePer100K,
      code: d.CountryCode,
      country: d.CountryName,

    };
}).then(function(data) {
  console.log(data[0])
  const sex = d3.group(data, d => d.sex)
  const male = sex.get("Male")
  const female = sex.get("Female")

  console.log(male[1])
// Set up the SVG container
const svgWidth = 800;
const svgHeight = 300;
const margin = { top: 20, right: 90, bottom: 40, left: 65 };
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

var groups = ["count","crude_deathrate","agestd_rate"]

d3.select("#selectButton")
    .selectAll('myOptions')
    .data(groups)
    .enter()
    .append('option')
    .text(d => d)
    .attr("value", d => d)


var tooltip = d3.select("#line-container")
    .attr("class", "tooltip")
    .append("div")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "black")
    .style("color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .html("<p>I'm a tooltip written in HTML</p><img src='https://github.com/holtzy/D3-graph-gallery/blob/master/img/section/ArcSmal.png?raw=true'></img><br>Fancy<br><span style='font-size: 40px;'>Isn't it?</span>");

    const annotations = [
{
    note: { 
        label: "November 2011",
        title: "Unemployment Rate: 8.6"
    },
    x: 848,
    y: 290,
    dy: 100,
    dx: -167,
    type: d3.annotationCalloutCircle,
},
];

const makeAnnotations = d3.annotation().annotations(annotations);

const svg = d3.select("#line-container")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

const chart = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);


const x = d3.scaleTime()
    .domain(d3.extent(data, function(d) { return d.date}))
    .nice()
    .range([0, width])

const y = d3.scaleLinear()
    .domain([0, d3.max(male, d => d.count)])
    .nice()
    .range([height, 0])

//Gridlines
const lines = chart.selectAll("yGrid") 
    .data(y.ticks(8))
    .join("line")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", d => y(d))
    .attr("y2", d => y(d))
    .attr("stroke", "#e0e0e0")
    .attr("stroke-width", .5)


// Add X and Y axes
chart.append("g")
    .attr("class", "axis-x")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")))
    .call((g) => g.select(".tick:last-of-type text").clone()
        .attr("x", 0)
        .attr("y", 25)
        .attr("font-weight", "bold")
        .text(""))

var yAxis = d3.axisLeft().scale(y)

chart.append("g")
    .attr("class", "axis-y")
    .call(d3.axisLeft(y).ticks(5))
    .call((g) => g.select(".tick:last-of-type text").clone()
        .attr("x", 9)
        .attr("text-anchor", "start")
        .attr("font-weight", "")
        .text("Male Suicide Count"))

var paths = chart.append("path")
    .datum(male)
    .attr("fill", "none")
    .attr("stroke","#36454F")
    .attr("stroke-width", 2)
    .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.count) })
    )

var circles = chart.selectAll("circle")
    .data(male)
    .enter()
    .append("circle")
    .attr("cx", function(d) { return x(d.date) })
    .attr("cy",  function(d) { return y(d.count) })
    .attr("r", 4)
    .style("fill", "#40E0D0")
    .on("mouseover", function(event, d) {
                    console.log(event.pageX)
                    tooltip.style("opacity",1)
                        .style("visibility", "visible")
                        .style("left", (event.pageX) +"px")
                        .style("top",  (event.pageY) + "px")
                        .html("<p> Count: " + d.count  + "<br>Year: " + d.year + "</p>" )
                    
                    console.log(d)
                   
                    d3.select(this).attr("r",4.5)
                    //filter
                    chart.selectAll("circle").style("fill", "#9ecae1")
                    d3.select(this).style("fill","#40E0D0")
                }) .on("mouseout", function(d) {
                    d3.select(this).attr("r",3.5)
                    tooltip.style("visibility", "hidden")
                    .style("stroke","none")
                    //filter
                    chart.selectAll("circle").style("fill", "#40E0D0")
    })           


    function update(selectedOption) {
        if (selectedOption == "crude_deathrate") {
            y.domain([0,d3.max(data, d => d.rate)])
            
            chart.selectAll(".axis-y")
                .transition()
                .duration(3000)
                .call(d3.axisLeft(y).ticks(8))
            
            lines.join("line")
                .data(y.ticks().slice(3))
                .transition()
                .duration(3000)
                .attr("x1", 0)
                .attr("x2", width)
                .attr("y1", d => y(d))
                .attr("y2", d => y(d))
                .attr("stroke", "#e0e0e0")
                .attr("stroke-width", .5)    

            paths.join("path")
                .transition()
                .duration(3000)
                .attr("d", d3.line()
                .x(function(d) { return x(d.date) })
                .y(function(d) { return y(d.rate) })
            )

            circles.join("circle") 
                .transition()
                .duration(3000)
                .attr("cx", function(d) { return x(d.date) })
                .attr("cy",  function(d) { return y(d.rate) })
                .attr("r", 4)  
                
            circles.on("mouseover", function(event, d) {
                    console.log("THIS HAS CHANGED")
                    tooltip.style("opacity",1)
                        .style("visibility", "visible")
                        .style("left", (event.pageX) +"px")
                        .style("top",  (event.pageY) + "px")
                        .html("<p>Rate: " + d.rate  + "<br>Year: " + d.year + "</p>" )
                   
                    d3.select(this)
                        .attr("r",4.5)

                        chart.selectAll("circle").style("fill", "#9ecae1")
                        d3.select(this).style("fill","#40E0D0")
            })  
        }

        if (selectedOption == "count") {
            console.log("AMONG US")
            y.domain([0,d3.max(data, d => d.count)])
            
            chart.selectAll(".axis-y")
                .transition()
                .duration(3000)
                .call(d3.axisLeft(y).ticks(8)) 

            lines.join("line")
                .data(y.ticks().slice())
                .transition()
                .duration(3000)
                .attr("x1", 0)
                .attr("x2", width)
                .attr("y1", d => y(d))
                .attr("y2", d => y(d))
                .attr("stroke", "#e0e0e0")
                .attr("stroke-width", .5)   

            paths.join("path")
                .transition()
                .duration(3000)
                .attr("d", d3.line()
                .x(function(d) { return x(d.date) })
                .y(function(d) { return y(d.count) })
            )

            circles.join("circle") 
                .transition()
                .duration(3000)
                .attr("cx", function(d) { return x(d.date) })
                .attr("cy",  function(d) { return y(d.count) })
                .attr("r", 4) 

            circles.on("mouseover", function(event, d) {
                    tooltip.style("opacity",1)
                    .style("visibility", "visible")
                    .style("left", (event.pageX) +"px")
                    .style("top",  (event.pageY) + "px")
                    .html("<p> Count: " + d.count  + "<br>Year: " + d.year + "</p>" )
                    console.log(d)
                    d3.select(this)
                    .attr("r",4.5)
                    //filter
                    chart.selectAll("circle").style("fill", "#9ecae1")
                    d3.select(this).style("fill","#40E0D0")
                }) .on("mouseout", function(d) {
                    d3.select(this).attr("r",3.5)
                    tooltip.style("visibility", "hidden")
                    .style("stroke","none")
                    //filter
                    chart.selectAll("circle").style("fill", "#40E0D0")
                })      
                     
        }

        if (selectedOption == "agestd_rate") {
            console.log("AMONG US")
            y.domain([0,d3.max(data, d => d.age_rate)])
            
            chart.selectAll(".axis-y")
                .transition()
                .duration(3000)
                .call(d3.axisLeft(y).ticks(8))
                
            lines.join("line")
                .data(y.ticks().slice(3))
                .transition()
                .duration(3000)
                .attr("x1", 0)
                .attr("x2", width)
                .attr("y1", d => y(d))
                .attr("y2", d => y(d))
                .attr("stroke", "#e0e0e0")
                .attr("stroke-width", .5) 

            paths.join("path")
                .transition()
                .duration(3000)
                .attr("d", d3.line()
                .x(function(d) { return x(d.date) })
                .y(function(d) { return y(d.age_rate) })
            )

            circles.join("circle") 
                .transition()
                .duration(3000)
                .attr("cx", function(d) { return x(d.date) })
                .attr("cy",  function(d) { return y(d.age_rate) })
                .attr("r", 4)

                circles.on("mouseover", function(event, d) {
                    console.log("THIS HAS CHANGED")
                    tooltip.style("opacity",1)
                        .style("visibility", "visible")
                        .style("left", (event.pageX) +"px")
                        .style("top",  (event.pageY) + "px")
                        .html("<p>Rate: " + d.age_rate  + "<br>Year: " + d.year + "</p>" )
                   
                    d3.select(this)
                        .attr("r",4.5)

                    chart.selectAll("circle").style("fill", "#9ecae1")
                        d3.select(this).style("fill","#40E0D0")
            })
        }
    }


    d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        console.log(selectedOption)
        // run the updateChart function with this selected option
        update(selectedOption)
    });


  

})