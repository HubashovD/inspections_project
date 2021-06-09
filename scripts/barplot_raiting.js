(function () {


  // set the dimensions and margins of the graph
  var margin = { top: 30, right: 30, bottom: 70, left: 60 },
    width = 700 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#barplot_raiting")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  // create 2 data_set
  d3.csv("data/subjects_bd_merged_pivot_3.csv").then(function (data) {
    // List of groups (here I have one group per column)


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



    // Update the X axis
    x.domain(data.map(function (d) { return d.is_planned; }))
    xAxis.call(d3.axisBottom(x))

    // Update the Y axis
    y.domain([0, d3.max(data, function (d) { return d.ide })]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));


    // ----------------
    // Create a tooltip
    // ----------------
    var tooltip = d3.select("#barplot_raiting")
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
        .html("Range: " + d.is_planned + "<br>" + "Value: " + d.ide)
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
      .enter()
      .append("rect") // Add a new rect for each new elements
      .on("mouseover", showTooltip)
      .on("mousemove", moveTooltip)
      .on("mouseleave", hideTooltip)
      .attr("x", function (d) { return x(d.is_planned); })
      .attr("y", function (d) { return y(d.ide); })
      .attr("width",50)
      .attr("height", function (d) { return height - y(d.ide); })
      .attr("fill", "#69b3a2")

    var labels = svg.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("x", function (d) { return x(d.is_planned); })
    .attr("y", function (d) { return y(d.ide); })
    .text(function (d){  console.log(d); return d.ide; })

    
   // ----------------
            // Create a tooltip
            // ----------------
            var tooltip = d3.select("#barplot_raiting")
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
  });

})();
