//I'm using this global variable in case I want to expose any part of the data
// To the global scope so I can debug it in the browser console on the go
var glob;



// We'll use the code below to examine and experiment with the data
// This code works with a subset of the data (using splice) which causes it to
// run faster and makes the print outs easier to read.
// If one of the tests works, we simply copy the logic to the main code below it
d3.json("eventData.json", function(error, data) {
	if (error) { throw error }
	//Make a selection of the data
	glob = data[0]
	//data.splice(500)	//First x elements
	//If you turn the forEach into a map you can chain the sort after it
	// By using dot notation :)
	data.forEach((d) => {
		let subcats = d["types"][0]["catid"].split(".")
		d.code = subcats[0] + subcats[1] + "," + subcats[2]
	})
	data.sort(function(x, y){
	  	return d3.ascending(x.code, y.code);
	})
	data.forEach((d) => {
		if (d.code == "22,19"){
			//console.log(d)
		}
		console.log(d["title"], d.code)
	})
	//console.table(data)


});

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
	"22,12" : "(Stads)Stranden",
	"22,16" : "Forten",
	"22,18" : "Bossen",
	"22,19" : "Willekeurig?",
	"22,3" : "Bezoekers centra",
	"22,4" : "Gallerieën",
	"22,6" : "Buitenplaatsen",
	"22,7" : "Kerken",
	"22,8" : "Molens",
	"22,9" : "Monumenten",
}

// This chart is based off of: https://bl.ocks.org/mbostock/3887118
// Set the stage
var margin = {top: 20, right: 20, bottom: 30, left: 40},
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

var x = d3.scaleLinear()
.range([0, width]);

var y = d3.scaleLinear()
.range([height, 0]);

//var color = d3.scaleOrdinal(["orange","grey","black"]);
var color = d3.scaleOrdinal(d3.schemeCategory20)

var xAxis = d3.axisBottom(x)

var yAxis = d3.axisLeft(y)

var svg = d3.select("body").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("eventData.json", function(error, data) {
	//turn on the next line if you want to work with a small data test set
	//data = data.splice(data.length - 10)
	if (error) throw error;
	//Let's rewrite the data a bit to more usable notation
	//First we write the latlng info directly to the root of the object
	data.forEach(function(d) {
		if (d["location"]["latitude"] == NaN){
			console.log("empty one")
			d.lat = 52,3780870
			d.lng = 4,9011690
		}
  		d.lat = parseFloat(d["location"]["latitude"].replace(',', '.'));
  		d.lng = parseFloat(d["location"]["longitude"].replace(',', '.'));
  		//Next, we'll write our own version of categories to the root of the object
  		let subcats = d["types"][0]["catid"].split(".")
		d.code = subcats[0] + subcats[1] + "," + subcats[2]

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
		return color(d.code)
		//Here's a piece of code that colors each event based on when it was last updated
		/*
		//Credit for date calculation goes to https://stackoverflow.com/a/3224854/5440366 
		let now = new Date()
		let then = new Date(d.lastupdated)
		let deltaTime = Math.abs(now.getTime() - then.getTime());
		let deltaYEars = Math.round(deltaTime / (1000 * 3600 * 24 * 365.25));
		//console.log(deltaYEars, color(deltaYEars))
		deltaYEars = deltaYEars > 2 ? 2 : deltaYEars
		return color(deltaYEars); 
		*/

	});


});





/* BAsics:
const url = "https://open.data.amsterdam.nl/Attracties.json"

d3.json(url, function(error, data) {
  	console.dir(data)
  	console.table(data)
});
*/