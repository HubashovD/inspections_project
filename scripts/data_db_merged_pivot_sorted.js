(function() {
    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 30, bottom: 50, left: 160 },
        width = d3.select("#data_db_merged_pivot_sorted").node().getBoundingClientRect().width - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#data_db_merged_pivot_sorted")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("data/data_db_merged_pivot_sorted.csv").then(function(data) {
        data.forEach(function(d) {
            d.status = +d.status;
            d.violation_id = +d.violation_id;
            d.rate = d.rate;
        });


        // Initialize the X axis
        var y = d3.scaleBand()
            .range([0, height])
            .padding(0.2);

        var yAxis = svg.append("g")

        // .attr("transform", "translate(0," + width + ")")

        // Initialize the Y axis
        var x = d3.scaleLinear()
            .range([0, width - 50]);

        var xAxis = svg.append("g")
            .attr("class", "myXaxis")
            .style("display", "none");

        // A function that create / update the plot for a given variable:
        // Update the X axis
        y.domain(data.map(function(d) { return d.short_bas; }))

        yAxis.call(d3.axisLeft(y))

        .selectAll("text")
            .attr("transform", "translate(-10,0)")
            .style("text-anchor", "end")




        // Update the Y axis
        x.domain([0, d3.max(data, function(d) { return d.status })]);
        xAxis.transition().duration(1000).call(d3.axisTop(x));

        // ----------------
        // Create a tooltip
        // ----------------
        var tooltip = d3.select("#data_db_merged_pivot_sorted")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "10px")

        // Three function that change the tooltip when user hover / move / leave a cell
        var showTooltip = function(d) {
            tooltip
                .transition()
                .duration(100)
                .style("opacity", 1)
            tooltip
                .html("Причина проведення: " + d.reason_bas + "<br>" + "Кількість проведених перевірок: " + "<b>" +
                    d.status + "</b>" +
                    "<br>" + "Кількість знайдених порушень: " + "<b>" + d.violation_id + "</b>" +
                    "<br>" + "Середня кількість порушень знайдених під час однієї перевірки: " + "<b>" + d.rate + "</b>")
                .style("left", (d3.mouse(this)[0] + 90) + "px")
                .style("top", (d3.mouse(this)[1]) + "px")
                .style("width", 220 + "px")
        }
        var moveTooltip = function(d) {
                tooltip
                    .style("left", (d3.mouse(this)[0] - 90) + "px")
                    .style("top", (d3.mouse(this)[1]) + "px")
                    .style("width", 220 + "px")
            }
            // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
        var hideTooltip = function(d) {
            tooltip
                .transition()
                .duration(100)
                .style("opacity", 0)
        }



        // Create the u variable
        var u = svg.selectAll("rect")
            .data(data);

        u
            .enter()
            .append("rect") // Add a new rect for each new elements
            .attr("class", "bar")
            .on("mouseover", showTooltip)
            .on("mousemove", moveTooltip)
            // .on("mouseleave", hideTooltip)
            .merge(u) // get the already existing elements as well
            .transition() // and apply changes to all of them
            .duration(1000)
            .attr("x", 0)
            .attr("y", function(d) { return y(d.short_bas); })
            .attr("height", 20)
            .attr("width", function(d) { return x(d.status); })
            .attr("fill", "#4562AB")
            .attr("rx", 6)
            .attr("ry", 6)

        // If less group in the new dataset, I delete the ones not in use anymore
        u
            .exit()
            .remove()
            .on("mouseover", showTooltip)
            .on("mousemove", moveTooltip)
            .on("mouseleave", hideTooltip)

        var label = svg.selectAll(".bar-labels")
            .data(data)

        label
            .enter()
            .append("text")
            .attr("class", "bar-labels")
            .merge(label)
            .transition() // and apply changes to all of them
            .duration(1000)
            .attr("x", function(d) { return x(d.status); })
            .attr("y", function(d) { return y(d.short_bas) + 10; })
            .text(function(d) { return d.status; });

        label
            .exit()
            .remove()

    })


})();