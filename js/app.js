/*
* Author: TEJA DURGA PRAVEEN VARMA BUDDARAJU
* App: Scatter Plot
* D3 Version: d3.v5
* Date: 07-10-2018
 */

function drawGraph(xText, yText) {
	$('svg').remove();
	var margin = {top: 20, right: 100, bottom: 150, left: 40},
		width = 1000,
		height = 400 ;


	// setup x
	var xValue = (d) => d[xText],
		xScale = d3.scaleLinear().range([0, width]),
		xMap = (d) => xScale(xValue(d)),
		xAxis = d3.axisBottom(xScale).ticks(5);

	// setup y
	var yValue = (d)=> d[yText],
		yScale = d3.scaleLinear().range([height, 0]),
		yMap = (d) => yScale(yValue(d)),
		yAxis = d3.axisLeft(yScale);

	//  fill color
	var cValue = (d) => d.Region,
		color = d3.scaleOrdinal(d3.schemeCategory10);

	//  graph canvas to the body
	var svg = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//  tooltip area
	var tooltip = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);

	// load data
	d3.json("data/bea_fdi_employment.json").then(function(data) {


	  data.forEach(function(d) {
		d[yText] = +d[yText];
		d[xText] = +d[xText];
	  });


	  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
	  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

	// x-axis
	  svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis)
		.append("text")
		  .attr("class", "label")
		  .attr("x", width)
		  .attr("y", -6)
          .attr('fill', 'black')
		  .style("text-anchor", "end")
		  .text(xText);

	  // y-axis
	  svg.append("g")
		  .attr("class", "y axis")
		  .call(yAxis)
		.append("text")
		  .attr("class", "label")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 6)
          .attr('fill', 'black')
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text(yText);

	  var line = d3.line()
                .x((d) => xValue(d))
                .y((d)=> yValue(d));


	  var focus = svg.append('g').style('display', 'none');

            focus.append('line')
                .attr('id', 'focusLineX')
                .attr('class', 'focusLine');
            focus.append('line')
                .attr('id', 'focusLineY')
                .attr('class', 'focusLine');


	  // draw dots
	  svg.selectAll(".dot")
		  .data(data)
		.enter().append("circle")
		  .attr("class", "dot")
		  .attr("r", 7)
		  .attr("cx", xMap)
		  .attr("cy", yMap)
		  .style("fill", (d) => color(cValue(d)))
		  .on("mouseover", function(d) {
			  tooltip.transition()
				   .duration(200)
				   .style("opacity", .9);
			  tooltip.html(d["Region"] + "<br/>(" + xValue(d)
				+ ", " + yValue(d) + ")")
				   .style("left", (d3.event.pageX + 20) + "px")
				   .style("top", (d3.event.pageY - 28) + "px")
              d3.select(this)
              .transition()
              .duration(500)
              .attr('r',14)
              .attr('stroke-width',3)
              focus.style('display', null)
              focus.select('#focusLineX')
              .attr('x1', xScale(xValue(d))).attr('y1',yScale(yValue(d)))
              .attr('x2', 0).attr('y2', yScale(yValue(d)))
              focus.select('#focusLineY')
                       //.attr('x1', xScale(xValue(d))).attr('y1', xScale(xValue(d))) //todo
                       // .attr('x1', xScale(xValue(d))).attr('y1', yScale(yValue(d)))
                       //  .attr('x2', xScale(xValue(d))).attr('y2', yScale(yValue(d)))
		  				})
		  .on("mouseout", function(d) {
			  tooltip.transition()
				   .duration(500)
				   .style("opacity", 0)
                      d3.select(this)
                      .transition()
                      .duration(500)
                      .attr('r',7)
                      .attr('stroke-width',1)
                 focus.style('display', 'none');
		  				});

	  // draw legend
	  var legend = svg.selectAll(".legend")
		  .data(color.domain())
		  .enter().append("g")
		  .attr("class", "legend")
		  .attr("transform", (d, i) => { return "translate(" + (i) * 20 + ",100)"; })

	  // draw legend colored rectangles
	  legend.append("rect")
		  .attr("x", 3)
          .attr("y", 330)
		  .attr("width", 18)
		  .attr("height", 18)
		  .style("fill", color);

	  legend.on("mouseover", function(type) {
        d3.select(this)
        d3.selectAll(".dot")
			.filter(function(d)
			{
				if(d.Region == type)
				return d.Region == type;
			})
			.transition()
            .duration(500)
			.attr('r',14)
            .style("opacity", 1) // need this line to unhide dots
			.style("stroke", "black")})
			legend.on("mouseout", function(type)
			{
			d3.select(this)
			d3.selectAll(".dot")
			.filter(function(d) {
				if(d.Region == type)
				return d.Region == type;
			})
			.transition()
            .duration(500)
			.attr('r',7)
            .style("opacity", 1) // need this line to unhide dots
        	.style("stroke", "black")})

	  // draw legend text
	  legend.append("text")
		  .attr("x", -350)
		  .attr("y", 9)
		  .attr("dy", ".50em")
		  .style("text-anchor", "end")
          .attr('transform','rotate(-90)')
		  .text((d) => d)
	});
}

drawGraph('All_Industries_Total', 'All_Industries_Total');

function setGraph() {
	drawGraph($('#x-value').val(), $('#y-value').val());
}