// Sample array data
d3.csv("csv/suicide_rates.csv", function(d) { 
    return {
        generation: d.Generation, 
        count: +d.SuicideCount, 
        age: d.AgeGroup, 
        year: d.Year,
        country: d.CountryName,
        sex: d.Sex, 
    };
}).then(function(data) {  
    // Set up the SVG container
    const svgWidth = 1000;
    const svgHeight = 400;
    const margin = { top: 20, right: 20, bottom: 50, left: 70 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    //Create the Chart
    const svg = d3.select("#histo-container")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    //Group data based off gender
    const gender = d3.group(data, d => d.sex)
    const male = gender.get("Male")
    const female = gender.get("Female")

    //Get the first year and group data based off year
    const theYear = d3.group(data, d => d.year)
    const beginYear = theYear.get("2011")

    //Create tooltips
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
    //referenced https://d3-graph-gallery.com/graph/density_filter.html
    //Map years into a new set. Referenced from website above ^
    let years = Array.from(new Set(data.map(d => d.year)))
 
    // Define X and Y scales
    const x = d3.scaleBand()
        .domain(data.map(d => d.age))
        .range([0, width])
        .padding(0.1);
        
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .nice()
        .range([height, 0]);

    //Create gridlines
    const lines = chart.selectAll("yGrid") 
        .data(y.ticks().slice(1))
        .join("line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", d => y(d))
        .attr("y2", d => y(d))
        .attr("stroke", "#e0e0e0")
        .attr("stroke-width", .5)

   
    //Create the slider
    const sliderRange = d3
        .sliderBottom()
        .min(d3.min(data, d => d.year))
        .max(d3.max(data, d => d.year))
        .step(1)
        .width(500)
        .ticks(8)
        .tickFormat(d3.format('.0f'))
        .default(d3.min(data, d => d.year), d3.max(data, d => d.year))
        .fill('#008080')

    //Append the slider
    const groupSlider = d3
        .select('#slider-range')
        .append('text')
        .append('svg')
        .attr('width', 630)
        .attr('height', 100)
        .append('g')
        .attr('transform', 'translate(90,30)')

    //Create a custom tick
    d3.selectAll('.tick')
        .classed('custom-tick', true);

    //Call the slider into the chart
    groupSlider.call(sliderRange)


    // Add X and Y axes
    chart.append("g")
        .attr("class", "axis axis-x")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .call((g) => g.select(".tick:last-of-type text").clone()
            .attr("x", 50)
            .attr("y", 25)
            .attr("font-weight", "bold")
            .text("Age Range"))



    chart.append("g")
        .attr("class", "axis axis-y")
        .call(d3.axisLeft(y).ticks(5))
        .call((g) => g.select(".tick:last-of-type text").clone()
            .attr("x", -100)
            .attr("y", -60)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .attr("transform", "rotate(-90)")
            .text("Suicide Count")
        )

    //Create the histogram/bar chart
    var bar = chart.selectAll(".bar")
        .data(beginYear)
        .enter()
        .append("rect")
        .attr("class", "bar")  
        .style("fill", "#40E0D0")
        .attr("x", d => x(d.age))
        .attr("y", d => y(d.count))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.count))
        .on("mouseover", function(event, d) {
            //Create tooltip
            tooltip.style("opacity",1)
                .style("visibility", "visible")
                .style("left", (event.pageX + 45) + "px")
                .style("top",  (event.pageY - 100) + "px")
                .html("<p> Count: " + d.count  + "<br>Year: " + d.year + "</p>" )
            
            //Highlight hover
            chart.selectAll(".bar")
                .style("fill", "#003f5c")

            //Brush other data out
            d3.select(this)
                .style("fill", "#40E0D0")
                .style("stroke","black")
            })
                
        .on("mouseout", function(event, d) { 
            //Return to normal values
            tooltip.style("visibility", "hidden")
                .style("stroke","none")
            chart.selectAll(".bar")
                .style("fill", "#40E0D0")

            d3.select(this)
                .style("fill", "#40E0D0")
                .style("stroke","none")

        })
      

        //Function use for slider functionality
        sliderRange.on('onchange', value => {
            //Filter data based off year
            var dataFilter = data.filter(function(d) { return d.year==Math.floor(value) })
            
            //Join rectangle and transform histogram/bar chart
            var u = chart.selectAll("rect")
                .data(dataFilter);

            u.join("rect")
                .transition()
                .duration(500)
                .attr("x", d => x(d.age))
                .attr("y", d => y(d.count))
                .attr("width", x.bandwidth())
                .attr("height", d => height - y(d.count))
                .style("fill", "#40E0D0")   
        })
      });