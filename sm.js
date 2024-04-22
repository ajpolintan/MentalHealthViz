      // Sample array data
      d3.csv("csv/disorders.csv", function(d) { 
        return {
          date: d3.timeParse("%Y")(d.Year),
          schizo: +d.Schizophrenia,
          bipolar: +d.Bipolar,
          drug: +d.Drug,
          eating: +d.Eating,
          anxiety: +d.Anxiety,
          depression: +d.Depression
        };
    }).then(function(data) {
      console.log(data[0])
  
    // Set up the SVG container
    const svgWidth = 950;
    const svgHeight = 600;
    const margin = { top: 40, right: 190, bottom: 40, left: 70 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const padding = 95;
    const yPadding = 100;
    const svg = d3.select("#sm-container")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);


    
    var tooltip = d3.select("#sm-container")
        .attr("class", "tooltip")
        .append("div")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("top", "1800px")
        .style("left", "20px")
        .html("<p>I'm a tooltip written in HTML</p><img src='https://github.com/holtzy/D3-graph-gallery/blob/master/img/section/ArcSmal.png?raw=true'></img><br>Fancy<br><span style='font-size: 40px;'>Isn't it?</span>");
    
    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

        
    const x = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.date}))
        .nice()
        .range([0, width / 3])

    const x2 = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.date}))
        .nice()
        .range([width / 3 + padding, width / 3 * 2 + padding])

    const x3 = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.date}))
        .nice()
        .range([width / 3 * 2 + padding + 60, width / 3 * 3 + padding + 60])

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.schizo)])
        .nice()
        .range([height / 3, 0])
    
    const y2 = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.bipolar)])
        .nice()
        .range([height / 3, 0])
    
    const y3 = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.drug)])
        .nice()
        .range([height / 3 * 2 + padding , height / 3 + padding])
    
    const y4 = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.anxiety)])
        .nice()
        .range([height / 3 * 2 + padding , height / 3 + padding])

    const y5 = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.depression)])
        .nice()
        .range([height / 3, 0])

    var linear = d3.scaleQuantize()
        .domain([0,4])
        .range(["#66c2a5","#8da0cb", "#fdc086",  "#e78ac3", "#a6d854" ])

    
    // Add X and Y axes
    chart.append("g")
        .attr("class", "axis axis-x")
        .attr("transform", `translate(0, ${height / 3})`)
        .call(d3.axisBottom(x).tickPadding(10).ticks(8))
       
    
    chart.append("g")
        .attr("class", "axis axis-x")
        .attr("transform", `translate(0, ${height / 3 * 2 + padding})`)
        .call(d3.axisBottom(x).tickPadding(10).ticks(7))
       

    // Add X and Y axes
    chart.append("g")
        .attr("class", "axis axis-x")
        .attr("transform", `translate(0, ${height / 3})`)
        .call(d3.axisBottom(x2).tickPadding(10).ticks(5))
  

    chart.append("g")
        .attr("class", "axis axis-x")
        .attr("transform", `translate(0, ${height / 3 * 2 + padding})`)
        .call(d3.axisBottom(x2).tickPadding(10).ticks(5))
        
    chart.append("g")
        .attr("class", "axis axis-x")
        .attr("transform", `translate(0, ${height / 3})`)
        .call(d3.axisBottom(x3).tickPadding(10).ticks(5))
       

    chart.append("g")
        .attr("class", "axis axis-y")
        .call(d3.axisLeft(y).ticks(7))
        .call((g) => g.select(".tick:last-of-type text").clone()
            .attr("x", -5)
            .attr("y", -20)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text("Value (Open)"))
    
    chart.append("g")
        .attr("class", "axis axis-y")
        .call(d3.axisLeft(y2).ticks(7))
        .attr("transform", `translate(${width / 3 + padding}, 0)`)
    
    chart.append("g")
        .attr("class", "axis axis-y")
        .call(d3.axisLeft(y3).ticks(7))
      
    chart.append("g")
        .attr("class", "axis axis-y")
        .call(d3.axisLeft(y4).ticks(7))
        .attr("transform", `translate(${width / 3 + padding}, 0)`)
        
    chart.append("g")
        .attr("class", "axis axis-y")
        .call(d3.axisLeft(y5).ticks(7))
        .attr("transform", `translate(${width / 3 * 2 + padding + 60}, 0)`)
     

    chart.append("text")
        .attr("x", (width / 3) - 150)
        .attr("y", height / 3 + 50)
        .attr("class", "textbox")
        .text("Schizo Disorders (%)")

    chart.append("text")
        .attr("x", (width / 3) + 100)
        .attr("y", height / 3 + 50)
        .attr("class", "textbox")
        .text("Bipolar Disorders (%)")

    chart.append("text")
        .attr("x", (width / 3 * 2) + 160)
        .attr("y", height / 3 + 50)
        .attr("class", "textbox")
        .text("Depression Disorders (%)")

    chart.append("text")
        .attr("x", (width / 3) / 2- + 50)
        .attr("y", height / 3 * 2 + 140)
        .attr("class", "textbox")
        .text("Drug Use Disorders (%)")

    chart.append("text")
        .attr("x", (width / 3) + 130)
        .attr("y", height / 3 * 2 + 140)
        .attr("class", "textbox")
        .text("Anxiety Disorders (%)")

    chart.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke","#66c2a5")
        .attr("stroke-width", 2)
        .attr("d", d3.line()
            .x(function(d) { return x(d.date) })
            .y(function(d) { return y(d.schizo) })
        )

    chart.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke","#8da0cb")
        .attr("stroke-width", 2)
        .attr("d", d3.line()
            .x(function(d) { return x2(d.date) })
            .y(function(d) { return y2(d.bipolar) })
        )
    
    chart.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke","#fdc086")
        .attr("stroke-width", 2)
        .attr("d", d3.line()
            .x(function(d) { return x(d.date) })
            .y(function(d) { return y3(d.drug) })
        )
    
    chart.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke","#e78ac3")
        .attr("stroke-width", 2)
        .attr("d", d3.line()
            .x(function(d) { return x2(d.date) })
            .y(function(d) { return y4(d.anxiety) })
        )

    chart.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke","#a6d854")
        .attr("stroke-width", 2)
        .attr("d", d3.line()
            .x(function(d) { return x3(d.date) })
            .y(function(d) { return y5(d.depression) })
        )

        


    chart.append('g').selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .join("circle")
            .attr("cx",function(d) { return x(d.date) })
            .attr("cy",  function(d) { return y(d.schizo) })
        .attr("r",2.4)
        .style("fill", "gray")            
        .on("mouseover", s_hover)
        .on("mouseout", exit)

        
    chart.append('g').selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .join("circle")
            .attr("cx",function(d) { return x2(d.date) })
            .attr("cy",  function(d) { return y2(d.bipolar) })
        .attr("r", 2.4)
        .style("fill", "#66c2a5")
        .style("fill", "gray")
        .on("mouseover", b_hover)
        .on("mouseout", exit)

    chart.append('g').selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .join("circle")
            .attr("cx",function(d) { return x(d.date) })
            .attr("cy",  function(d) { return y3(d.drug) })
        .attr("r", 2.4)
        .style("fill", "gray")
        .on("mouseover", dr_hover)
        .on("mouseout", exit)

        
    chart.append('g').selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .join("circle")
            .attr("cx",function(d) { return x2(d.date) })
            .attr("cy",  function(d) { return y4(d.anxiety) })
        .attr("r", 2.4)
        .style("fill", "gray")
        .on("mouseover", a_hover)
        .on("mouseout", exit)

    chart.append('g').selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .join("circle")
            .attr("cx",function(d) { return x3(d.date) })
            .attr("cy",  function(d) { return y5(d.depression) })
        .attr("r", 2.4)
        .style("fill", "gray")
        .on("mouseover", d_hover)
        .on("mouseout", exit)


   
          
    chart.append("g")
        .attr("class", "legendLinear")
        .attr("transform", `translate( ${width + 30}, ${height / 3 + 100})`)

    var legendLinear = d3.legendColor()
        .shapeWidth(20)
        .orient('vertical')
        .scale(linear)
        .title("Mental Health Disorders")
        .labels(["Schizophrenia", "Bipolar", "Drug Use", "Anxiety", "Depression"])

    chart.select(".legendLinear")
        .call(legendLinear)
    
    function s_hover(event, d) {
            d3.select(this).attr("r",2.4)
            tooltip.style("opacity",1)
                        .style("visibility", "visible")
                        .html("<p> Schizophrenia Rate: " + d.schizo)
    }

    function b_hover(event, d) {
            d3.select(this).attr("r",2.7)
            tooltip.style("opacity",1)
                        .style("visibility", "visible")
                        .html("<p> Bipolar Rate: " + d.bipolar)
    }
    
    
    function b_hover(event, d) {
            d3.select(this).attr("r",2.7)
            tooltip.style("opacity",1)
                        .style("visibility", "visible")
                        .html("<p> Bipolar Rate: " + d.bipolar)
    }

    function dr_hover(event, d) {
            d3.select(this).attr("r",2.7)
            tooltip.style("opacity",1)
                        .style("visibility", "visible")
                        .html("<p> Drug Disorder Rate: " + d.drug)
    }

    function a_hover(event, d) {
            d3.select(this).attr("r",2.7)
            tooltip.style("opacity",1)
                        .style("visibility", "visible")
                        .html("<p> Anxiety Rate: " + d.anxiety)
    }

    function d_hover(event, d) {
            d3.select(this).attr("r",2.7)
            tooltip.style("opacity",1)
                        .style("visibility", "visible")
                        .html("<p> Depression Rate: " + d.depression)
    }

    function exit() {
        d3.select(this).attr("r", 2.4)
        tooltip.style("visibility", "hidden")
            .style("stroke","none")
    }

      });