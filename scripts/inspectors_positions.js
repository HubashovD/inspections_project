(function () {


    // set the dimensions and margins of the graph
    var margin = { top: 30, right: 30, bottom: 70, left: 60 },
        width = 700 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#inspectors_positions")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // create 2 data_set
    d3.csv("data/inspectors_positions.csv").then(function (data) {
        // List of groups (here I have one group per column)

        // format the data
        data.forEach(function (d) {
            d.ide = +d.ide
        });

        var allGroup = d3.map(data, function (d) { return (d.sphere) }).keys()

        // add the options to the button
        d3.select("#selectButton_1")
            .selectAll('myOptions')
            .data(allGroup)
            .enter()
            .append('option')
            .text(function (d) { return d; }) // text showed in the menu
            .attr("value", function (d) { return d; }) // corresponding value returned

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

        // A function that update the chart
        function update(selectedGroup) {

            var dataFilter = data.filter(function (d) { return d.sphere == selectedGroup });


            // var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
            //     .key(function (d) { return d.sphere; })
            //     .entries(dataFilter);


            // Update the X axis
            x.domain(dataFilter.map(function (d) { return d.clear_position; }))
            xAxis.call(d3.axisBottom(x))

            // Update the Y axis
            y.domain([0, d3.max(dataFilter, function (d) { return d.ide })]);
            yAxis.transition().duration(1000).call(d3.axisLeft(y));



            // ----------------
            // Create a tooltip
            // ----------------
            var tooltip = d3.select("#inspectors_positions")
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
                    .html("Range: " + d.clear_position + "<br>" + "Value: " + d.ide)
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
                .data(dataFilter)

            u
                .enter()
                .append("rect") // Add a new rect for each new elements
                .on("mouseover", showTooltip)
                .on("mousemove", moveTooltip)
                .on("mouseleave", hideTooltip)
                .merge(u) // get the already existing elements as well
                .transition() // and apply changes to all of them
                .duration(1000)
                .attr("x", function (d) { return x(d.clear_position); })
                .attr("y", function (d) { return y(d.ide); })
                .attr("width", x.bandwidth())
                .attr("height", function (d) { return height - y(d.ide); })
                .attr("fill", "#69b3a2")

            // If less group in the new dataset, I delete the ones not in use anymore
            u
                .exit()
                .remove()
        }

        // Initialize the plot with the first dataset
        d3.select("#selectButton_1").on("change", function (d) {
            // recover the option that has been chosen
            var selectedOption = d3.select(this).property("value")
            // run the updateChart function with this selected option
            update(selectedOption)
        })

    });

})();
