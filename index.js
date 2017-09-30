
d3.json("eventData.json", function(error, data) {
	if (error) { throw error }
		let titles = data.map(event => event.title)
	console.log(titles)
	console.log(data[0]["location"]["latitude"])

	console.table(data.splice(data.length -10))
});


// Set the stage
var margin = {top: 20, right: 20, bottom: 30, left: 40},
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

var x = d3.scaleLinear()
.range([0, width]);

var y = d3.scaleLinear()
.range([height, 0]);

var color = d3.scaleOrdinal(d3.schemeCategory10);

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

	data.forEach(function(d) {
		if (d["location"]["latitude"] == NaN){
			console.log("empty one")
			d.lat = 52,3780870
			d.lng = 4,9011690
		}
  		d.lat = parseFloat(d["location"]["latitude"].replace(',', '.'));
  		d.lng = parseFloat(d["location"]["longitude"].replace(',', '.'));
	});

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
		d.lastupdated
		return color(d.lastupdated); 
	});


});





/* BAsics:
const url = "https://open.data.amsterdam.nl/Attracties.json"

d3.json(url, function(error, data) {
  	console.dir(data)
  	console.table(data)
});
*/