// @TODO: YOUR CODE HERE!
let svgWidth = 960;
let svgHeight = 620;

let margin = {
    top: 20,
    right: 40,
    bottom: 200, 
    left:100
};
// Chart height and width
 let width = svgWidth - margin.left - margin.right;
 let height = svgHeight - margin.top - margin.bottom;

 let chart = d3
 .select('#scatter')
 .append("div")
 ,classed("chart", true);