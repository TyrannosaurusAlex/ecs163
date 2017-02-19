// function filterHistogramData(filePath, startStation) {
//   // filter data by station name
//   d3.csv(filePath, function(error, data) {
//
//     data.forEach(function(d) {
//       d.rides = +d.rides
//       d.hour = +d.hour
//
//       // my counter
//       allRides = allRides + d.rides;
//     });
//
// }

// initial histogram container setup

var margin = {top: 10, right: 30, bottom: 60, left: 30},
    width = 1000 - margin.left - margin.right,
    height = 260 - margin.top - margin.bottom;

var x = d3.scaleBand()
  .rangeRound([0, width])
  .padding(0.1);

var y = d3.scaleLinear()
  .range([height, 0]);

var xAxis = d3.axisBottom()
  .scale(x)

var yAxis = d3.axisLeft()
  .scale(y)

var histSVGContainer = d3.select("#histogram")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

var xAxisLabel = histSVGContainer.append("text")
  .text("Rides by Hour (% Total Rides)")
  .attr("class", "histTitle")
  .style("text-anchor", "middle")
  .attr("x", width/2)
  .attr("y", 245);


function updateHistogram(filePath, currentStation) {
  var allRides = 0;

  // all data usage must occur in async d3.csv call
  d3.csv(filePath, function(error, data) {

    // filter data based on station
    var data = data.filter(function(d) { return d.station == currentStation; })

    data.forEach(function(d) {

      d.rides = +d.rides
      d.hour = +d.hour

      // count total # of rides for percentage calculation
      allRides = allRides + d.rides;
    });

    // console.log(currentStation)
    // console.log(allRides)


    // create tooltip
    // var tooltip = d3.tip()
    //   .attr("class", "d3-tip")
    //   .direction('n')
    //   .offset([-10, 0])
    //   .html(function(d) {
    //     return d.properties.start_station
    //   })

    // map hours in data to x axis
    x.domain(data.map(function(d) { return d.hour; }));
    // compute upper bound of y domain
    y.domain([0, d3.max(data, function(d) { return d.rides })]);

    // add x axis
    histSVGContainer.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // console.table(data)
    histSVGContainer.selectAll("rect")
      .data(data);

    // update old elements as needed
    histSVGContainer.attr("class", "update");

    // After merging the entered elements with the update selection, apply operations to both.
    histSVGContainer.enter().append("rect")
        .attr("class", "enter")
        .attr("class", "bar")
        .attr("width", x.bandwidth())
        .attr("x", function(d) { return x(d.hour);  })
        .attr("y", function(d) { return y(d.rides); })
        .attr("height", function(d) {return height - y(d.rides); })
        .merge(histSVGContainer)


    var formatPercent = d3.format(",.0%");
    // CRAZY BUG
    histSVGContainer.selectAll("text.labels")
        .data(data)
      .enter().append("text")
      .attr("class", "label")
      .attr("x", function(d, i) {
        return x(d.hour) + x.bandwidth() / 2;
      })
      .attr("y", function(d) {
          return y(d.rides) + 18;
      })
      .text(function(d) {
        percentRides = d.rides/allRides;
        if (percentRides > 0.012) {
          return formatPercent(percentRides);
        }
      });

    histSVGContainer.exit().remove();


  }) // end d3.csv()
} // end drawhistSVGContainerogram()
