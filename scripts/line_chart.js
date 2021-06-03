(function () {
    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 700 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#line_chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var parseTime = d3.timeParse("%Y-%m");

    //Read the data
    d3.csv("data/line_chart.csv").then(function (data) {

        // format the data
        data.forEach(function (d) {
            d.date_start = parseTime(d.date_start);
            d.ide = +d.ide
        });


        // List of groups (here I have one group per column)
        var allGroup = d3.map(data, function (d) { return (d.sphere) }).keys()

        // add the options to the button
        d3.select("#selectButton")
            .selectAll('myOptions')
            .data(allGroup)
            .enter()
            .append('option')
            .text(function (d) { return d; }) // text showed in the menu
            .attr("value", function (d) { return d; }) // corresponding value returned by the button

        // A color scale: one color for each group
        var myColor = d3.scaleOrdinal()
            .domain(allGroup)
            .range(d3.schemeSet2);

        // Add X axis --> it is a date format
        var x = d3.scaleTime()
            .domain(d3.extent(data, function (d) { return d.date_start; }))
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(7));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) { return +d.ide; })])
            .range([height, 0]);
        svg.append("g")
            .attr("class", "myYaxis")
            .call(d3.axisLeft(y));



        // Initialize line with first group of the list
        var line = svg
            .append('g')
            .append("path")
            .datum(data.filter(function (d) { return d.sphere == allGroup[0] }))
            .attr("d", d3.line()
                .x(function (d) { return x(d.date_start) })
                .y(function (d) { return y(+d.ide) })
            )
            .attr("stroke", function (d) { return myColor("valueA") })
            .style("stroke-width", 4)
            .style("fill", "none")

        // A function that update the chart
        function update(selectedGroup) {

            // Create new data with the selection?
            var dataFilter = data.filter(function (d) { return d.sphere == selectedGroup })

            var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
            .key(function(d) { return d.status;})
            .entries(data);
        
        console.log(sumstat)


            // create the Y axis
            y.domain([0, d3.max(dataFilter, function (d) { return d.ide })]);
            svg.selectAll(".myYaxis")
                .transition()
                .duration(500)
                .call(d3.axisLeft(y));


            // Give these new data to update line
            line
                .datum(dataFilter)
                .transition()
                .duration(500)
                .attr("d", d3.line()
                    .x(function (d) { return x(d.date_start) })
                    .y(function (d) { return y(+d.ide) })
                )
                .attr("stroke", function (d) { return myColor(selectedGroup) })
        }

        // When the button is changed, run the updateChart function
        d3.select("#selectButton").on("change", function (d) {
            // recover the option that has been chosen
            var selectedOption = d3.select(this).property("value")
            // run the updateChart function with this selected option
            update(selectedOption)

        })

    })
})();