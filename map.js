
        const svgWidth = 1000;
        const svgHeight = 700;
        const margin = { top: 20, right: 20, bottom: 50, left: 40 };
        const width = svgWidth - margin.left - margin.right;
        const height = svgHeight - margin.top - margin.bottom;
        // Sample array data
      
        //path generator
        var tooltip = d3.select("#map-container")
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

        var projection = d3.geoAlbersUsa()
            .translate([width/2, height/2])
            .scale([1200]);
        var path = d3.geoPath().projection(projection);
    
        //Creeating the svg element
        const svg = d3.select("#map-container")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

            
        //Creating the Chart    
        const chart = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
        
        const annotation = chart.append("text")
            .attr("x", -20)
            .attr("y", 280)
            .text("Click Me! -->");
    
        d3.csv("csv/crisis_center.csv", function(d) {
            return {
                state: d.State,
                name: d.Name,
                zip: d.Zip,
                lat: +d.Latitude,
                lon: +d.Longitude,
            };
        }).then(function(data) {
            console.log(data[5])
            d3.json("us-states.json").then(function(json) {
				
                for (var i = 0; i < data.length; i++) {
                        //state name
                        var dataState = data[i].state;

                        //unemployment rates
                        var dataRank = parseFloat(data[i].name)

                        //console.log(dataState)
                        console.log(dataRank)


                        for (var j = 0; j < json.features.length; j++) {
                            var jsonState = json.features[j].properties.name
                        //    console.log(jsonState);

                            if (dataState == jsonState) {
                            //  console.log("THIS IS HAPPENING");
                                json.features[j].properties.value = dataRank
                                break;
                            }
                        }
                }

				//Bind data and create one path per GeoJSON feature
				chart.selectAll("path")
				   .data(json.features)
				   .enter()
				   .append("path")
				   .attr("d", path)
                   .style("stroke", "gray")
                   .style("fill", function(d) {
                       var value = d.properties.value;
                      // console.log("Value: " + value)
                         return "#383838";
                   }).append("title")
                   .text(function(d) {
                    return "STATE:" + d.properties.name;
                   })
                
                d3.csv("csv/crisis_center.csv", function(d){
                    return {
                        state: d.State,
                        name: d.Name,
                        link: d.Link,
                        zip: d.Zip,
                        lat: +d.Latitude,
                        lon: +d.Longitude,
                    }
                }).then(function(data) {

                    console.log(data[0])
                    chart.selectAll("circle")
                        .data(data)
                        .enter()
                        .append("circle")
                        .attr("cx", function(d) {
                           // console.log("RANK" + d.rank + " " +  projection([d.lon,d.lat])[0])
                           console.log(d)

                            return projection([d.lon,d.lat])[0];
                        })
                        .attr("cy", function(d) {
                            return projection([d.lon,d.lat])[1];
                            console.log("HEY")

                        })
                        .attr("r", function(d) {
                            return 3.5;
                        })
                        .style("fill", "#40E0D0")
                        .style("stroke", "gray")
                        .style("opacity", 0.9)
                        .style("stroke-width", 0.25)
                        .on("mouseover", function(event, d) {
                            tooltip.style("opacity",1)
                            .style("visibility", "visible")
                            .style("left", (event.pageX) +"px")
                            .style("top",  (event.pageY) + "px")
                            .html("<p> State: " + d.state  + "<br>Name: " + d.name + "</p>" )

                            console.log(d)
                            d3.select(this)
                            .attr("r",4.5)
                            .style("stroke","black")

                            //filter
                            chart.selectAll("circle").style("fill", "#9ecae1")
                            d3.select(this).style("fill","#40E0D0")
                        }) .on("mouseout", function(d) {
                            d3.select(this).attr("r",3.5)
                            tooltip.style("visibility", "hidden")
                            //filter
                            chart.selectAll("circle").style("fill", "#40E0D0")

                        })
                        .on("click", function(event, d) { window.open(d.link)});
                }); 
			});
        });
