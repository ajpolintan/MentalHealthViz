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
    const svgWidth = 1000;
    const svgHeight = 700;
    const margin = { top: 40, right: 190, bottom: 20, left: 70 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const padding = 95;
    const yPadding = 100;
    const svg = d3.select("#sm-container")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    var formatDecimal = d3.format(".2f");
    
    var tooltip = d3.select("#sm-container")
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
        .call(d3.axisBottom(x3).tickPadding(10).ticks(4))
       

    chart.append("g")
        .attr("class", "axis axis-y")
        .call(d3.axisLeft(y).ticks(5))
    
    chart.append("g")
        .attr("class", "axis axis-y")
        .call(d3.axisLeft(y2).ticks(5))
        .attr("transform", `translate(${width / 3 + padding}, 0)`)
    
    chart.append("g")
        .attr("class", "axis axis-y")
        .call(d3.axisLeft(y3).ticks(5))
      
    chart.append("g")
        .attr("class", "axis axis-y")
        .call(d3.axisLeft(y4).ticks(5))
        .attr("transform", `translate(${width / 3 + padding}, 0)`)
        
    chart.append("g")
        .attr("class", "axis axis-y")
        .call(d3.axisLeft(y5).ticks(5))
        .attr("transform", `translate(${width / 3 * 2 + padding + 60}, 0)`)
     
    chart.selectAll("yGrid") 
        .data(y.ticks(8))
        .join("line")
        .attr("x1", 0)
        .attr("x2", width/3)
        .attr("y1", d => y(d))
        .attr("y2", d => y(d))
        .attr("stroke", "#e0e0e0")
        .attr("stroke-width", .5)
    
    chart.selectAll("yGrid") 
        .data(y2.ticks(8))
        .join("line")
        .attr("x1", width / 3 + padding)
        .attr("x2", width / 3 * 2 + padding)
        .attr("y1", d => y2(d))
        .attr("y2", d => y2(d))
        .attr("stroke", "#e0e0e0")
        .attr("stroke-width", .5)

     chart.selectAll("yGrid") 
        .data(y3.ticks(8))
        .join("line")
        .attr("x1", 0)
        .attr("x2", width / 3)
        .attr("y1", d => y3(d))
        .attr("y2", d => y3(d))
        .attr("stroke", "#e0e0e0")
        .attr("stroke-width", .5)
        

    chart.selectAll("yGrid") 
        .data(y4.ticks(8))
        .join("line")
        .attr("x1", 0)
        .attr("x2", width / 3 * 2 + padding)
        .attr("y1", d => y4(d))
        .attr("y2", d => y4(d))
        .attr("stroke", "#e0e0e0")
        .attr("stroke-width", .5)
    
    chart.selectAll("yGrid") 
        .data(y5.ticks(4))
        .join("line")
        .attr("x1", width / 3 * 2 + padding + 60)
        .attr("x2", width / 3 * 2 + padding + 290)
        .attr("y1", d => y5(d))
        .attr("y2", d => y5(d))
        .attr("stroke", "#e0e0e0")
        .attr("stroke-width", .5)
        
    chart.append("text")
        .attr("x", (width / 3) - 210)
        .attr("y", height / 3 + 50)
        .attr("class", "textbox")
        .text("Schizophrenia Disorders (%)")

    chart.append("text")
        .attr("x", (width / 3) + 150)
        .attr("y", height / 3 + 50)
        .attr("class", "textbox")
        .text("Bipolar Disorders (%)")

    chart.append("text")
        .attr("x", (width / 3 * 2) + 190)
        .attr("y", height / 3 + 50)
        .attr("class", "textbox")
        .text("Depression Disorders (%)")

    chart.append("text")
        .attr("x", (width / 3) / 2- + 70)
        .attr("y", height / 3 * 2 + 145)
        .attr("class", "textbox")
        .text("Drug Use Disorders (%)")

    chart.append("text")
        .attr("x", (width / 3) + 130)
        .attr("y", height / 3 * 2 + 144)
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
        .style("fill", "#66c2a5")            
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
        .style("fill", "#8da0cb")
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
        .style("fill", "#fdc086")
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
        .style("fill", "#e78ac3")
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
        .style("fill", "#a6d854")
        .on("mouseover", d_hover)
        .on("mouseout", exit)


   
          
    chart.append("g")
        .attr("class", "legendLinear")
        .attr("transform", `translate( ${width - 55}, ${height / 3 + 120})`)

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
                        .style("left", (event.pageX) +"px")
                        .style("top",  (event.pageY) + "px")
                        .html("<p> Schizophrenia Rate: " + formatDecimal(d.schizo))
    }

    function b_hover(event, d) {
            d3.select(this).attr("r",2.7)
            tooltip.style("opacity",1)
                        .style("visibility", "visible")
                        .style("left", (event.pageX) +"px")
                        .style("top",  (event.pageY) + "px")
                        .html("<p> Bipolar Rate: " + formalDecimal(d.bipolar))
    }
    
    
    function b_hover(event, d) {
            d3.select(this).attr("r",2.7)
            tooltip.style("opacity",1)
                        .style("visibility", "visible")
                        .style("left", (event.pageX) +"px")
                        .style("top",  (event.pageY) + "px")
                        .html("<p> Bipolar Rate: " + formatDecimal(d.bipolar))
    }

    function dr_hover(event, d) {
            d3.select(this).attr("r",2.7)
            tooltip.style("opacity",1)
                        .style("visibility", "visible")
                        .style("left", (event.pageX) +"px")
                        .style("top",  (event.pageY) + "px")
                        .html("<p> Drug Disorder Rate: " + formatDecimal(d.drug))
    }

    function a_hover(event, d) {
            d3.select(this).attr("r",2.7)
            tooltip.style("opacity",1)
                        .style("visibility", "visible")
                        .style("left", (event.pageX) +"px")
                        .style("top",  (event.pageY) + "px")
                        .html("<p> Anxiety Rate: " + formatDecimal(d.anxiety))
    }

    function d_hover(event, d) {
            d3.select(this).attr("r",2.7)
            tooltip.style("opacity",1)
                        .style("visibility", "visible")
                        .style("left", (event.pageX) +"px")
                        .style("top",  (event.pageY) + "px")
                        .html("<p> Depression Rate: " + formatDecimal(d.depression))
    }

    function exit() {
        d3.select(this).attr("r", 2.4)
        tooltip.style("visibility", "hidden")
            .style("stroke","none")
    }

      });