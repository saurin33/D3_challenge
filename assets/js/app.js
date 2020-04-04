// @TODO: YOUR CODE HERE!
let svgWidth = 960;
let svgHeight = 620;

let margin = {
  top: 20,
  right: 40,
  bottom: 200,
  left: 100,
};
// Chart height and width
let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

let chart = d3.select("#scatter").append("div").classed("chart", true);

// append an svg element

let svg = chart.append("svg").attr("width", svgWidth).attr("height", svgHeight);

// svg group
let chartGroup = svg.append("g").attr(
  "transform",
  `translate(${margin.left},
  ${margin.top})`
);
// parameters:
let chosenXAxis = "poverty";
let chosenYAxis = "healthcare";

function xScale(censusData, chosenXAxis) {
  let xLinearScale = d3
    .scaleLinear()
    .domain([
      d3.min(censusData, (d) => d[chosenXAxis]) * 0.8,
      d3.max(censusData, (d) => d[chosenXAxis]) * 1.2,
    ])
    .range([0, width]);

  return xLinearScale;
}
function yscale(censusData, chosenYAxis) {
  let yLinearScale = d3
    .scaleLinear()
    .domain([
      d3.min(censusData, (d) => d[chosenXAxis]) * 0.8,
      d3.max(censusData, (d) => d[chosenXAxis]) * 1.2,
    ])
    .range([height, 0]);
  return yLinearScale;
}

function renderXAxis(newXScale, XAxis) {
  let bottomAxis = d3.axisBottom(newXScale);

  XAxis.transition().duration(2000).call(bottomAxis);

  return XAxis;
}
function renderYAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition().duration(2000).call(leftAxis);

  return yAxis;
}
function renderCircles(
  circlesGroup,
  newXScale,
  chosenXAxis,
  newYScale,
  chosenYAxis
) {
  circlesGroup
    .transition()
    .duration(2000)
    .attr("cx", (data) => newXScale(data[chosenXAxis]))
    .attr("cy", (data) => newYScale(data[chosenYAxis]));

  return circlesGroup;
}
function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  textGroup
    .transition()
    .duration(2000)
    .attr("x", (d) => newXScale(d[chosenXAxis]))
    .attr("y", (d) => newYScale(d[chosenYAxis]));

  return textGroup;
}
//function to stylize x-axis values for tooltips
function styleX(value, chosenXAxis) {
  //style based on variable
  //poverty
  if (chosenXAxis === "poverty") {
    return `${value}%`;
  }
  //household income
  else if (chosenXAxis === "income") {
    return `${value}`;
  } else {
    return `${value}`;
  }
}
//funtion for updating circles group
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  //poverty
  if (chosenXAxis === "poverty") {
    var xLabel = "Poverty:";
  }
  //income
  else if (chosenXAxis === "income") {
    var xLabel = "Median Income:";
  }
  //age
  else {
    var xLabel = "Age:";
  }
  //healthcare
  if (chosenYAxis === "healthcare") {
    var yLabel = "No Healthcare:";
  } else if (chosenYAxis === "obesity") {
    var yLabel = "Obesity:";
  }
  //smoking
  else {
    var yLabel = "Smokers:";
  }
  //create tooltip
  var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([-8, 0])
    .html(function (d) {
      return `${
        d.state
      }<br>${xLabel} ${styleX(d[chosenXAxis], chosenXAxis)}<br>${yLabel} ${d[chosenYAxis]}%`;
    });
  circlesGroup.call(toolTip);
  circlesGroup.on("mouseover", toolTip.show).on("mouseout", toolTip.hide);

  return circlesGroup;
}
d3.csv("./assets/data/data.csv").then(function(censusData) {
  console.log(censusData);

  //Parse data
  censusData.forEach(function(data) {
    data.obesity = +data.obesity;
    data.income = +data.income;
    data.smokes = +data.smokes;
    data.age = +data.age;
    data.healthcare = +data.healthcare;
    data.poverty = +data.poverty;
  });
  //create linear scales
  var xLinearScale = xScale(censusData, chosenXAxis);
  var yLinearScale = yScale(censusData, chosenYAxis);

  //create x axis
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);
  //append X
  var xAxis = chartGroup
    .append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  //append Y
  var yAxis = chartGroup
    .append("g")
    .classed("y-axis", true)
    //.attr
    .call(leftAxis);

  //append Circles
  var circlesGroup = chartGroup
    .selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .classed("stateCircle", true)
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 14)
    .attr("opacity", ".5");

  //append Initial Text
  var textGroup = chartGroup
    .selectAll(".stateText")
    .data(censusData)
    .enter()
    .append("text")
    .classed("stateText", true)
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .attr("dy", 3)
    .attr("font-size", "10px")
    .text(function(d) {
      return d.abbr;
    });
