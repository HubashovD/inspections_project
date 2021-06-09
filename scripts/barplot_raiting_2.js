(function () {

    // set the dimensions and margins of the graph
    var margin = { top: 30, right: 1, bottom: 70, left: 1 },
        width = d3.select("#barplot_raiting_2").node().getBoundingClientRect().width - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#barplot_raiting_2")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // create 2 data_set

    var data1 = [
        { group: "планова", value: 13040 },
        { group: "позапланова", value: 63719 }
    ];

    var data2 = [
        { group: "планова", value: 197204 },
        { group: "позапланова", value: 585700 }
    ];

    var data3 = [
        { group: "планова", value: 15.12},
        { group: "позапланова", value: 9.19 }
    ];


    d3.select("#var-3").on("click", function () {
        update(data1);
    });

    d3.select("#var-4").on("click", function () {
        update(data2);
    });

    d3.select("#var-5").on("click", function () {
        update(data3);
    });



    // Initialize the X axis
    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.2);
    var xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")

    // Initialize the Y axis
    var y = d3.scaleLinear()
        .range([height, 0]);

    var yAxis = svg.append("g")
        .attr("class", "myYaxis")
        .style("display", "none")


    function update(data) {
        // Update the X axis
        x.domain(data.map(function (d) { return d.group; }))
        xAxis.call(d3.axisBottom(x))

        // Update the Y axis
        y.domain([0, d3.max(data, function (d) { return d.value })]);
        yAxis.transition().duration(1000).call(d3.axisLeft(y));


        // ----------------
        // Create a tooltip
        // ----------------
        var tooltip = d3.select("#barplot_raiting_2")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "10px")

        // Three function that change the tooltip when user hover / move / leave a cell
        var showTooltip = function (d) {
            tooltip
                .transition()
                .duration(100)
                .style("opacity", 1)
            tooltip
                .html(d.group + "<br>" +  d.value)
                .style("left", (d3.mouse(this)[0] + 90) + "px")
                .style("top", (d3.mouse(this)[1]) + "px")
        }
        var moveTooltip = function (d) {
            tooltip
                .style("left", (d3.mouse(this)[0] + 90) + "px")
                .style("top", (d3.mouse(this)[1]) + "px")
        }
        // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
        var hideTooltip = function (d) {
            tooltip
                .transition()
                .duration(100)
                .style("opacity", 0)
        }

        // Create the u variable
        var u = svg.selectAll("rect")
            .data(data)

        
        u
            .enter()
            .append("rect") // Add a new rect for each new elements
            .on("mouseover", showTooltip)
            .on("mousemove", moveTooltip)
            .on("mouseleave", hideTooltip)
            .merge(u) // get the already existing elements as well
            .transition() // and apply changes to all of them
            .duration(1000)
            .attr("x", function (d) { return x(d.group); })
            .attr("y", function (d) { return y(d.value); })
            .attr("width", x.bandwidth())
            .attr("height", function (d) { return height - y(d.value); })
            .attr("fill", "#2171b5")
            .attr("rx", 6)
            .attr("ry", 6)

        // If less group in the new dataset, I delete the ones not in use anymore
        u
            .exit()
            .remove()


        var label = svg.selectAll(".bar-labels")
            .data(data)

        label
            .enter()
            .append("text")
            .attr("class", "bar-labels")
            .merge(label)
            .transition() // and apply changes to all of them
            .duration(1000)
            .attr("x", function (d) { return x(d.group);})
            .attr("y", function (d) { return y(d.value);})
            .text(function (d){return d.value;});
        
        label
            .exit()
            .remove()

        
        
};

 // Initialize the plot with the first dataset
 update(data1)

})();
