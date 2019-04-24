
// Using jQuery, read our data and call visualize(...) only once the page is
// ready:
$(function() {
  d3.csv("titanic-dataset.csv").then(function(data) {
    // Write the data to the console for debugging:
    console.log(data);

    // Call our visualize function:
    visualize(data);
  });
});

var visualize = function(data) {
  // Boilerplate:
  var margin = {top : 50, right : 50, bottom : 50, left : 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var svg = d3.select("#chart")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .style("width", width + margin.left + margin.right)
                .style("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                      "translate(" + margin.left + "," + margin.top + ")");

  // Visualization Code:
  var deckFreq = new Map();
  data.forEach(function(d) {
    var currentDeck = d["deck"];
    if (!deckFreq.hasOwnProperty(currentDeck))
      deckFreq[currentDeck] = 0;
    deckFreq[currentDeck]++;
  });

  console.log(deckFreq);

  var deckFreqCount = new Map();
  for (var i in deckFreq)
    deckFreqCount[i] = deckFreq[i];


  var deckScale =
      d3.scalePoint()
          .domain(data.map(function(entry) { return entry['deck']; }))
          .rangeRound([ 0, height / 8 ])
          .padding(0.1);



  svg.selectAll("deck")
      .data(data)
      .enter()
      .filter(function(d) { return d["deck"] != "" })
      .append("circle")
      .attr("fill", "red")
      .attr("r", 2)
      .attr("cy", function(d, i) { return deckScale(d["deck"]); })
      .attr("cx", function(d, i) {

        // d3.scaleLinear()
        // .domain(0, deckFreq[d["deck"]])
        // .range([0, width - 50]);
        var res = d3.scaleLinear()
        .domain([0, deckFreq[d["deck"]]-1])
        .range([0, width - 20]);

        var resCount = res( deckFreq[d["deck"]] - deckFreqCount[d["deck"]]  );
        deckFreqCount[d["deck"]]--;
        return resCount;
      });




  var survivedAgeRange = new Map();
  var deadAgeRange = new Map();










  // var yScale = d3.scaleLinear().domain([0, 2000]).range([height, 0]);
  //
  // var yAxisLeftVariable = d3.axisLeft().scale(yScale);
  // var yAxisRightVariable = d3.axisRight().scale(yScale);
  //
  // svg.append("g")
  //   .attr("class", "y axis")
  //   .call(yAxisLeftVariable);
  //
  // svg.append("g")
  //   .attr("class", "y axis")
  //   .call(yAxisRightVariable);
  //
  // svg.selectAll("Fall")
  //    .data(data)
  //    .enter()
  //    .append("line")
};
