    // Sample array data
    d3.csv("csv/country.csv", function(d) {
        return {
            country: d.CountryName,
            year: d.Year,
            count: +d.SuicideCount,
            std_death: +d.StdDeathRate,
            deathrate: +d.DeathRatePer100K,
            employment: +d.EmploymentPopulationRatio,
            inflation: +d.InflationRate,
            gdp: +d.GDP,
            population: +d.Population,
          
        }
    })
        .then(function(data) {

    var groups = ["employment","inflation","gdp", "population"]

    d3.select("#scatButton")
        .selectAll('myOptions')
        .data(groups)
        .enter()
        .append('option')
        .text(d => d)
        .attr("value", d => d)
    // Set up the SVG container
    const svgWidth = 800;
    const svgHeight = 600;
    const margin = { top: 20, right: 50, bottom: 40, left: 75 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;
   
    const annotations = [
        {
            note: { 
                label: "November 2011",
                title: "Unemployment Rate: 8.6"
            },
            x: 245,
            y: 700,
            dy: 100,
            dx: 167,
            type: d3.annotationCalloutCircle,
        },
        ];

    const makeAnnotations = d3.annotation().annotations(annotations);

    
    var formatDecimal = d3.format(".2f");
    var formatBig = d3.format(".2s");

    const svg = d3.select("#scat-container")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);


    var tooltip = d3.select("#scat-container")
        .attr("class", "tooltip")
        .append("div")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "black")
        .style("color", "white")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("top", "2600px")
        .style("left", "600px")
        .html("<p>I'm a tooltip written in HTML</p><img src='https://github.com/holtzy/D3-graph-gallery/blob/master/img/section/ArcSmal.png?raw=true'></img><br>Fancy<br><span style='font-size: 40px;'>Isn't it?</span>");
   
    // Define X and Y scales
    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.deathrate)])
        .range([0, width]);
  
    
    const y = d3.scaleLinear()
        .domain([35, d3.max(data, d => d.employment)])
        .range([height, 0]);
    
    const lines = chart.selectAll("yGrid") 
        .data(y.ticks(8))
        .join("line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", d => y(d))
        .attr("y2", d => y(d))
        .attr("stroke", "#e0e0e0")
        .attr("stroke-width", .5)

    // Add bars
    var circles = chart.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) { return x(d.deathrate) })
        .attr("cy",  function(d) { return y(d.employment) })
        .style("stroke",function(d) { 
                if (d.country == "United States of America") {
                    return "black"
                } else {
                    return;
                }
            })
        .attr("r", 3)
        .attr("fill", 
            function(d) { 
                    return "#40E0D0"
            }
        )
        .on("mouseover", function(event, d) {
                        tooltip.style("opacity",1)
                        .style("visibility", "visible")
                        .style("left", (event.pageX) +"px")
                        .style("top",  (event.pageY) + "px")
                        .html("<p>Country: " + d.country  + "<br>Employment Popuation Ratio: " + formatDecimal(d.employment) + "</p>" )

                        console.log(d)
                        d3.select(this)
                        .attr("r",4.5)

                        
                        //filter
                        chart.selectAll("circle").style("fill", "#003f5c")
                        d3.select(this).style("fill","#40E0D0")
                    }) .on("mouseout", function(d) {
                        d3.select(this).attr("r",3.5)
                        tooltip.style("visibility", "hidden")
                        //filter
                        
                        chart.selectAll("circle").style("fill", "#40E0D0")
                        if (d.country == "United States of America") {

                            d3.select(this).style("fill", "red")
                        } 
        })

        
    // Add X and Y axes
    chart.append("g")
        .attr("class", "axis axis-x")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .call((g) => g.select(".tick:last-of-type text").clone()
            .attr("x", -40)
            .attr("y", 25)
            .attr("font-weight", "bold")
            .text("Death Rate Per 100k"))

    chart.append("g")
        .attr("class", "axis-y")
        .call(d3.axisLeft(y).ticks(10))
        .call((g) => g.select(".tick:last-of-type text").clone()
            .attr("x", 9)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text("Employment Population Ratio")
            )

    function update(selectedOption) {

        if (selectedOption == "employment") {
            y.domain([0,d3.max(data, d => d.employment)])
                
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

            circles.join("circle") 
                .transition()
                .duration(3000)
                .attr("cx", function(d) { return x(d.deathrate) })
                .attr("cy",  function(d) { return y(d.employment) })
                .attr("r", 4)  
                    
             circles.on("mouseover", function(event, d) {
                console.log("THIS HAS CHANGED")
                tooltip.style("opacity",1)
                        .style("visibility", "visible")
                        .style("left", (event.pageX) +"px")
                        .style("top",  (event.pageY) + "px")
                        .html("<p>Country: " + d.country  + "<br>Employment Popuation Ratio: " + formatDecimal(d.employment) + "</p>" )
                       
                d3.select(this)
                    .attr("r",4.5)

                    chart.selectAll("circle").style("fill", "#003f5c")

                    d3.select(this).style("fill","#40E0D0")
                    
                })  
        }

        if (selectedOption == "inflation") {
            console.log("AMONG US")
            y.domain([0,d3.max(data, d => d.inflation)])
                
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
                   
            circles.join("circle") 
                .transition()
                .duration(3000)
                .attr("cx", function(d) { return x(d.deathrate) })
                .attr("cy",  function(d) { return y(d.inflation) })
                .attr("r", 4) 

            circles.on("mouseover", function(event, d) {
                tooltip.style("opacity",1)
                .style("visibility", "visible")
                .style("left", (event.pageX) +"px")
                .style("top",  (event.pageY) + "px")
                .html("<p> Country: " + d.country  + "<br>Inflation Rate: " + formatDecimal(d.inflation) + "</p>" )
                console.log(d)
                d3.select(this)
                .attr("r",4.5)
                //filter
                chart.selectAll("circle").style("fill", "#003f5c")
                d3.select(this).style("fill","#40E0D0")
             }).on("mouseout", function(d) {
                d3.select(this).attr("r",3.5)
                    tooltip.style("visibility", "hidden")
                    .style("stroke","none")
                        //filter
                    chart.selectAll("circle").style("fill", "#40E0D0")
                })           
        }

        if (selectedOption == "gdp") {
            y.domain([0,d3.max(data, d => d.gdp)])
                
            chart.selectAll(".axis-y")
                .transition()
                .duration(3000)
                .call(d3.axisLeft(y).ticks(8).tickFormat(d3.format(".1e")))
                    
            lines.join("line")
                .data(y.ticks().slice(2))
                .transition()
                .duration(3000)
                .attr("x1", 0)
                .attr("x2", width)
                .attr("y1", d => y(d))
                .attr("y2", d => y(d))
                .attr("stroke", "#e0e0e0")
                .attr("stroke-width", .5)  

            circles.join("circle") 
                .transition()
                .duration(3000)
                .attr("cx", function(d) { return x(d.deathrate) })
                .attr("cy",  function(d) { return y(d.gdp) })
                .attr("r", 4)

                circles.on("mouseover", function(event, d) {
                    console.log("THIS HAS CHANGED")
                    tooltip.style("opacity",1)
                        .style("visibility", "visible")
                        .style("left", (event.pageX) +"px")
                        .style("top",  (event.pageY) + "px")
                        .html("<p>Country: " + d.country  + "<br>GDP: " + formatBig(d.gdp) + "</p>" )
                       
                    d3.select(this)
                        .attr("r",4.5)

                    chart.selectAll("circle").style("fill", "#003f5c")
                        d3.select(this).style("fill","#40E0D0")
                })
        }

        if (selectedOption == "population") {  
            y.domain([0,d3.max(data, d => d.population)])
                
            chart.selectAll(".axis-y")
                .transition()
                .duration(3000)
                .call(d3.axisLeft(y).ticks(8).tickFormat(d3.format(".2s")))
                    
            lines.join("line")
                .data(y.ticks())
                .transition()
                .duration(3000)
                .attr("x1", 0)
                .attr("x2", width)
                .attr("y1", d => y(d))
                .attr("y2", d => y(d))
                .attr("stroke", "#e0e0e0")
                .attr("stroke-width", .5)  

            circles.join("circle") 
                .transition()
                .duration(3000)
                .attr("cx", function(d) { return x(d.deathrate) })
                .attr("cy",  function(d) { return y(d.population)})
                .attr("r", 4)

                circles.on("mouseover", function(event, d) {
                    console.log("THIS HAS CHANGED")
                    tooltip.style("opacity",1)
                        .style("visibility", "visible")
                        .style("left", (event.pageX) +"px")
                        .style("top",  (event.pageY) + "px")
                        .html("<p>Country: " + d.country  + "<br>GDP: " + formatBig(d.population) + "</p>" )
                       
                    d3.select(this)
                        .attr("r",4.5)

                    chart.selectAll("circle").style("fill", "#003f5c")
                        d3.select(this).style("fill","#40E0D0")
                })
        }

        }

    d3.select("#scatButton").on("change", function(d) {
            // recover the option that has been chosen
            var selectedOption = d3.select(this).property("value")
            console.log(selectedOption)
            // run the updateChart function with this selected option
            update(selectedOption)
    });

      });