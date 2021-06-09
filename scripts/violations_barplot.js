(function () {
  // create 2 data_set

  Promise.all([
    d3.csv("data/violations_barplot.csv"),
    d3.csv("data/violations_barplot.csv")
  ]).then(function (input) {

    input[0].forEach(function (d) {
      d.sphere = d.sphere.toString();
      d.index = +d.index;
    });

    input[1].forEach(function (d) {
      d.sphere = d.sphere.toString();
      d.index = +d.index;
    });

    update(input[0]);

    d3.select("#var-1").on("click", function () {
      update(input[0])
    });

    d3.select("#var-2").on("click", function () {
      update(input[1]);
    })
  });


  // set the dimensions and margins of the graph
  var margin = { top: 20, right: 30, bottom: 50, left: 100 },
    width = 500 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#violations_barplot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  // Initialize the X axis
  var y = d3.scaleBand()
    .range([0, height])
    .padding(0.2);

  var yAxis = svg.append("g")
  // .attr("transform", "translate(0," + width + ")")


  // Initialize the Y axis
  var x = d3.scaleLinear()
    .range([0, width]);

  var xAxis = svg.append("g")
    .attr("class", "myXaxis");

  // A function that create / update the plot for a given variable:
  function update(data) {

    // Update the X axis
    y.domain(data.map(function (d) { return d.sphere; }))
    yAxis.call(d3.axisLeft(y))
      .selectAll("text")
      .style("word-wrap", "break-word")
      .attr("transform", "translate(-10,0)")
      .style("text-anchor", "end")


    // Update the Y axis
    x.domain([0, d3.max(data, function (d) { return d.index })]);
    xAxis.transition().duration(1000).call(d3.axisTop(x));

    // ----------------
    // Create a tooltip
    // ----------------
    var tooltip = d3.select("#violations_barplot")
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
        .html("Орган: " + d.sphere + "<br>" + "кількість порушень на одну перевірку: " + d.index 
        +"<br>"+"Порушень: "+ d.Column+"<br>"+"Перевірок: "+d.ide)
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
      .data(data);

    u
      .enter()
      .append("rect") // Add a new rect for each new elements
      .attr("class", "bar")
      .on("mouseover", showTooltip)
      .on("mousemove", moveTooltip)
      .on("mouseleave", hideTooltip)
      .merge(u) // get the already existing elements as well
      .transition() // and apply changes to all of them
      .duration(1000)
      .attr("x", 0)
      .attr("y", function (d) { return y(d.sphere); })
      .attr("height", y.bandwidth())
      .attr("width", function (d) { return x(d.index); })
      .attr("text", d.index)
      .attr("fill", "#69b3a2")
      .text(function(d) {
        return d.index})

    // If less group in the new dataset, I delete the ones not in use anymore
    u
      .exit()
      .remove()
      .on("mouseover", showTooltip)
      .on("mousemove", moveTooltip)
      .on("mouseleave", hideTooltip)
  }



})();
