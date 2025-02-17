(function() {

    // set the dimensions and margins of the graph
    var margin = { top: 30, right: 30, bottom: 70, left: 160 },
        width = d3.select("#inspectors_count").node().getBoundingClientRect().width - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#inspectors_count")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Parse the Data
    d3.csv("data/regions_pib_pivoted.csv").then(function(data) {

        // List of subgroups = header of the csv files = soil condition here
        var subgroups = data.columns.slice(1)

        // List of groups = species here = value of the first column called group -> I show them on the X axis
        var groups = d3.map(data, function(d) { return (d.regions) }).keys()


        // Add X axis
        var y = d3.scaleBand()
            .domain(groups)
            .range([0, height])
            .padding([0.2])
        svg.append("g")
            .attr("transform", "translate(-10,0)")
            .call(d3.axisLeft(y).tickSizeOuter(0))
            .selectAll("text")
            .attr("transform", "translate(-10,0)")
            .style("text-anchor", "end")

        // Add Y axis
        var x = d3.scaleLinear()
            .domain([0, 550])
            .range([0, width]);
        svg.append("g")
            .call(d3.axisTop(x));

        // color palette = one color per subgroup
        var color = d3.scaleOrdinal()
            .domain(subgroups)
            .range([
                "#f7fbff",
                "#deebf7",
                "#c6dbef",
                "#9ecae1",
                "#6baed6",
                "#4292c6",
                "#2171b5",
                "#08519c",
                "#08306b",
                "#002c6e",
                "#260085",
                "#04006e"
            ])

        //stack the data? --> stack per subgroup
        var stackedData = d3.stack()
            .keys(subgroups)
            (data)




        // ----------------
        // Create a tooltip
        // ----------------
        var tooltip = d3.select("#inspectors_count")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "10px")

        // Three function that change the tooltip when user hover / move / leave a cell
        var mouseover = function(d) {
            var subgroupName = d3.select(this.parentNode).datum().key;
            var subgroupValue = d.data[subgroupName];
            tooltip
                .style("opacity", 1)
                .html(subgroupName + "<br>" + "<b>" + "Інспекторів: " + Math.round(subgroupValue) + "</b>")
                .style("left", (d3.mouse(this)[0]) + "px")
                .style("top", (d3.mouse(this)[1] - 50) + "px")

        }
        var mousemove = function(d) {
            tooltip
                .style("left", (d3.mouse(this)[0]) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                .style("top", (d3.mouse(this)[1] - 50) + "px")
            console.log(this)
        }
        var mouseleave = function(d) {
            tooltip
                .style("opacity", 0)
        }

        // Show the bars
        svg.append("g")
            .selectAll("g")
            // Enter in the stack data = loop key per key = group per group
            .data(stackedData)
            .enter().append("g")
            .attr("fill", function(d) { return color(d.key); })
            .selectAll("rect")
            // enter a second time = loop subgroup per subgroup to add all rectangles
            .data(function(d) { return d; })
            .enter().append("rect")
            .attr("x", function(d) { return x(d[0]); })
            .attr("y", function(d) { return y(d.data.regions); })
            .attr("height", 20)
            .attr("width", function(d) { return x(d[1]) - x(d[0]); })
            .attr("rx", 6)
            .attr("ry", 6)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)


    })

})();