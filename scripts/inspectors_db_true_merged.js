(function () {

    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 700 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#inspectors_db_true_merged")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    //Read the data
    d3.csv("data/inspectors_db_true_merged.csv").then(function (data) {

        // format the data
        data.forEach(function (d) {
            d.viol_sum = +d.viol_sum
            d.insp_count = +d.insp_count
            d.sphere = d.sphere.toString();
        });

        var allGroup = d3.map(data, function (d) { return (d.sphere) }).keys()

        // add the options to the button
        d3.select("#selectButton_2")
            .selectAll('myOptions')
            .data(allGroup)
            .enter()
            .append('option')
            .text(function (d) { return d; }) // text showed in the menu
            .attr("value", function (d) { return d; }) // corresponding value returned

        // Add X axis
        var x = d3.scaleLinear()
            .range([0, width]);

        xAxis = svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear()
            .range([height, 0]);

        yAxis = svg.append("g")
            .call(d3.axisLeft(y));

        // Add X axis label:
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", width / 2 + margin.left)
            .attr("y", height + margin.top + 20)
            .text("Кількість знеайдених порушень");

        // Y axis label:
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 20)
            .attr("x", -margin.top - height / 2 + 20)
            .text("Кількість проведених перевірок");

        function update(selectedGroup) {

            // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
            // Its opacity is set to 0: we don't see it by default.
            var tooltip = d3.select("#inspectors_db_true_merged")
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "1px")
                .style("border-radius", "5px")
                .style("padding", "10px")



            // A function that change this tooltip when the user hover a point.
            // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
            var mouseover = function (d) {
                tooltip
                    .style("opacity", 1)
            }

            var mousemove = function (d) {
                tooltip
                    .html(d.sphere + "<br>" + d.pib + "<br>" + "кількість знайдених порушень: " + d.viol_sum + "<br>" + "кількість перевірок:  " +  d.insp_count)
                    .style("left", (d3.mouse(this)[0] + 90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                    .style("top", (d3.mouse(this)[1]) + "px")
            }

            // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
            var mouseleave = function (d) {
                tooltip
                    .transition()
                    .duration(200)
                    .style("opacity", 0)
            }

            var dataFilter = data.filter(function (d) { return d.sphere == selectedGroup });

              // Update the X axis
              x.domain([0, d3.max(dataFilter,function (d) { return d.viol_sum})])
              xAxis.transition().duration(1000).call(d3.axisBottom(x))
  
              // Update the Y axis
              y.domain([0, d3.max(dataFilter, function (d) { return d.insp_count})])
              yAxis.transition().duration(1000).call(d3.axisLeft(y));

            // Add dots
            svg.append('g')
                .selectAll("dot")
                .data(dataFilter)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return x(d.viol_sum); })
                .attr("cy", function (d) { return y(d.insp_count); })
                .attr("r", 7)
                .style("fill", "#69b3a2")
                .style("opacity", 0.3)
                .style("stroke", "white")
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)



            // // Add a clipPath: everything out of this area won't be drawn.
            // var clip = svg.append("defs").append("svg:clipPath")
            //     .attr("id", "clip")
            //     .append("svg:rect")
            //     .attr("width", width)
            //     .attr("height", height)
            //     .attr("x", 0)
            //     .attr("y", 0);

            // // Add brushing
            // var brush = d3.brushX()                 // Add the brush feature using the d3.brush function
            //     .extent([[0, 0], [width, height]]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
            //     .on("end", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function

            // function updateChart(selectedGroup) {


            // // Create the scatter variable: where both the circles and the brush take place
            // var scatter = svg.append('g')
            //     .attr("clip-path", "url(#clip)")

            // scatter
            //     .selectAll("circle")
            //     .data(dataFilter)
            //     .enter()
            //     .append("circle")
            //     .attr("cx", function (d) { return x(d.viol_sum); })
            //     .attr("cy", function (d) { return y(d.insp_count); })
            //     .attr("r", 8)
            //     .style("fill", "#69b3a2")
            //     .style("opacity", 0.5)
            //     .on("mouseover", highlight)
            //     .on("mouseleave", doNotHighlight)
            //     .on("mouseleave", mousemove);

            // // Add the brushing
            // scatter
            //     .append("g")
            //     .attr("class", "brush")
            //     .call(brush);

            // // A function that set idleTimeOut to null
            // var idleTimeout
            // function idled() { idleTimeout = null; }

            // // A function that update the chart for given boundaries

            //     var dataFilter = data.filter(function (d) { return d.sphere == selectedGroup });

            //     console.log(dataFilter);

            //     extent = d3.event.selection

            //     // If no selection, back to initial coordinate. Otherwise, update X axis domain
            //     if (!extent) {
            //         if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
            //         x.domain([4, 8])
            //     } else {
            //         x.domain([x.invert(extent[0]), x.invert(extent[1])])
            //         scatter.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
            //     }

            //     // Update axis and circle position
            //     xAxis.transition().duration(1000).call(d3.axisBottom(x))
            //     scatter
            //         .selectAll("circle")
            //         .transition().duration(1000)
            //         .attr("cx", function (d) { return x(d.viol_sum); })
            //         .attr("cy", function (d) { return y(d.insp_count); })

            //     scatter
            //         .on("mouseover", highlight)
            //         .on("mouseleave", doNotHighlight)
            //         .on("mouseleave", mousemove);
            // }


            // // Highlight the specie that is hovered
            // var highlight = function (d) {
            //     tooltip
            //         .style("opacity", 1)
            // }

            // // Highlight the specie that is hovered
            // var doNotHighlight = function () {
            //     tooltip
            //         .transition()
            //         .duration(200)
            //         .style("opacity", 0)
            // }

            // var mousemove = function (d) {
            //     tooltip
            //         .html(d.viol_sum + "<br>" + d.viol_sum)
            //         .style("left", (d3.mouse(this)[0] + 90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
            //         .style("top", (d3.mouse(this)[1]) + "px")
            // }

            // // Add a tooltip div.Here I define the general feature of the tooltip: stuff that do not depend on the data point.
            // // Its opacity is set to 0: we don't see it by default.
            // var tooltip = d3.select("#inspectors_db_true_merged")
            //     .append("div")
            //     .style("opacity", 0)
            //     .attr("class", "tooltip")
            //     .style("background-color", "white")
            //     .style("border", "solid")
            //     .style("border-width", "1px")
            //     .style("border-radius", "5px")
            //     .style("padding", "10px")


        }
        d3.select("#selectButton_2").on("change", function (d) {
            // recover the option that has been chosen
            var selectedOption = d3.select(this).property("value")
            // run the updateChart function with this selected option
            update(selectedOption)
        })

    });

})();