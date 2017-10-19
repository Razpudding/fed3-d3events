/* jslint browser:true, devel:true, eqeq:true, plusplus:true, sloppy:true, vars: true, white:true, esversion:6, asi:true*/
//I'm using this global variable in case I want to expose any part of the data
// To the global scope so I can debug it in the browser console on the go
var glob;

// Set the stage
var margin = {top: 20, right: 20, bottom: 30, left: 40}
var width = 960 - margin.left - margin.right
var height = 500 - margin.top - margin.bottom
var previewPicWidth = 400

//These are the categories I've estimated are in the data
const types = {
	"21,1" : "Activiteiten",
	"21,11" : "Zwembaden",
	"21,2" : "Wellness",
	//"21,3" : "Casinos",
	//"21,4" : "Dierentuinen",
	"21,5" : "Boererijen",
	"21,6" : "Musea",
	"21,7" : "Recreatie gebieden",
	"21,8" : "Rondvaarten",
	"22,1" : "verzameling, openbare kunst",
	"22,10" : "Natuur",
	"22,11" : "Parken",
	"22,12" : "Stranden",
	"22,16" : "Forten",
	"22,18" : "Bossen",
	"22,19" : "Willekeurig?",
	"22,3" : "Bezoekers centra",
	"22,4" : "Gallerieën",
	"22,6" : "Buitenplaatsen",
	"22,7" : "Kerken",
	"22,8" : "Molens",
	"22,9" : "Monumenten"
}

//Let's call drawScatterPlot actually draw the scatterplot
drawScatterPlot()

function drawScatterPlot(){
	var x = d3.scaleLinear()
	.range([0, width]);
	var y = d3.scaleLinear()
	.range([height, 0]);
	//var color = d3.scaleOrdinal(["orange","grey","black"]);
	var color = d3.scaleOrdinal(d3.schemeCategory20)
	var xAxis = d3.axisBottom(x)
	var yAxis = d3.axisLeft(y)
	
	var svg = d3.select("body").append("svg")
	.attr("width", width + margin.left + margin.right + previewPicWidth)
	.attr("height", height + margin.top + margin.bottom)
	//This element will hold our preview images when a user mouses over a circle
	var image = svg.append("svg:image")
		.attr("width", 400)
		.attr("height", 400)
		.attr("x", width + margin.left)
	//I'm overwriting the reference to svg here because I need it to refer to the
	// transformed group instead. Probably a nicer way to do this
	svg = svg	
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var toolTip = d3.select("body").append("div").attr("class", "toolTip");
	
	// Let's draw the actual chart
	// This chart is based off of: https://bl.ocks.org/mbostock/3887118
	d3.json("eventData.json", function(error, data) {
		//turn on the next line if you want to work with a small data test set
		//data = data.splice(data.length - 10)
		if (error) throw error;
		//Let's rewrite the data a bit to more usable notation
		//First we write the latlng info directly to the root of the object
		data.forEach(function(d) {
			if (isNaN(parseFloat(d["location"]["latitude"]))){
				console.log("empty one")	
				d.lat = 52,3780870
				d.lng = 4,9011690
			}
			d.lat = parseFloat(d["location"]["latitude"].replace(',', '.'));
			d.lng = parseFloat(d["location"]["longitude"].replace(',', '.'));
	  		let subcats = d["types"][0]["catid"].split(".")
	  		d.type = types[subcats[0] + subcats[1] + "," + subcats[2]] || types["22.19"]
	  	});

		// Now that the data has been reformatted to our liking we can calculate the domains
		// For our axes
		x.domain(d3.extent(data, function(d) { return d.lng; }));
		y.domain(d3.extent(data, function(d) { return d.lat; }));
		
		svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.append("text")
		.attr("class", "label")
		.attr("x", width)
		.attr("y", -6)
		.style("text-anchor", "end")
		.text("Sepal Width (cm)");

		svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Sepal Length (cm)")

		svg.selectAll(".dot")
		.data(data)
		.enter().append("circle")
		.attr("class", "dot")
		.attr("r", 3.5)
		.attr("cx", function(d) { return x(d.lng); })
		.attr("cy", function(d) { return y(d.lat); })
		.style("fill", function(d) {
			//Let's color the circles based on the type of event
			return color(d.type)
		})
		//This line adds a mouseover event that changes the preview image to one corresponding
		// to the right event
		.on('mouseover', function(d) { 
			glob = toolTip
			//console.log(d["title"]); 
			toolTip
				.text(d.title)
				.style("left", d3.event.pageX - 70 +"px")
				.style("top", d3.event.pageY - 40 +"px")
			changePreview(d["media"][0]["url"])
		})

		// TODO: Made a start with zooming behavior but need to get the axes to play along as well
		// 	Here's an example of how that's done: http://blockbuilder.org/EfratVil/d956f19f2e56a05c31fb6583beccfda7
		//	The way I'd do it myself is to recalculate the domain based on which values are within the range
		d3.select('body').call(d3.zoom().scaleExtent([1/3, 3]).on('zoom', onzoom));
		function onzoom() {
		  svg.selectAll(".dot").attr('transform', d3.event.transform);
		  x.domain(d3.extent(data, function(d) { console.log(d); return d.lng; }));
		}

		var legend = svg.selectAll(".legend")
		.data(color.domain())
		.enter().append("g")
		.attr("class", "legend")
		.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
		.on('mouseenter', function(d) { update(d)})
		.on('mouseout', showAll)

		legend.append("rect")
		.attr("x", width - 18)
		.attr("width", 18)
		.attr("height", 18)
		.style("fill", color);

		legend.append("text")
		.attr("x", width - 24)
		.attr("y", 9)
		.attr("dy", ".35em")
		.style("text-anchor", "end")
		.text(function(d) { return d; })

		function update(category){
			d3.selectAll('circle')
			.attr('r', 15)
			.classed("hide", function(d) { return d.type !== category})
			.transition()
				.duration(1500)
				.ease(d3.easeBounce)
				.attr('r', 3.5)
		}

		function showAll(){
			d3.selectAll('circle')
			.classed("hide", false)
			.attr("r", 3.5)
		}

		function highlightCat(category){
			console.log(category)
		}

		//A function that allows us to dynamically change the source of the preview image
		function changePreview(source){
			//console.log(source)
			image.attr("xlink:href", source)
		}
	});
}