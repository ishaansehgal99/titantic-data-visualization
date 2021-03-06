
// Using jQuery, read our data and call visualize(...) only once the page is
// ready:
$(function() {
  d3.csv("titanic-dataset.csv").then(function(data) {
    // Write the data to the console for debugging:
    console.log(data);

    // Call our visualize function:
    // drawGraph(data);
    visualize(data);

    function changeDisplay() {
      var displayRadioValue = $("input[name='options']:checked").val();
      if (displayRadioValue === "chart") {
        console.log("Clearing Graph");
        clearGraph();
        visualize(data);
      } else {
        var graphRadioValue = $("input[name='graph-data']:checked").val();
        clearChart();
        drawGraph(data, graphRadioValue);
      }
    }

    $("input[name='options']").on("change", changeDisplay);

    function changeGraph() {
      var graphRadioValue = $("input[name='graph-data']:checked").val();
      var displayRadioValue = $("input[name='options']:checked").val();
      if (displayRadioValue === "graph") {
        clearGraph();
        drawGraph(data, graphRadioValue);
      }
    }

    $("input[name='graph-data']").on("change", changeGraph);
  });
});

var clearGraph = function() { d3.select("#graph").selectAll("*").remove(); }

var clearChart = function() { d3.select("#chart").selectAll("svg").remove(); }

var drawGraph =
    function(data, type) {
  var margin = {top : 50, right : 100, bottom : 50, left : 50},
      width = 1000 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select("#graph")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                      "translate(" + margin.left + "," + margin.top + ")");

  // Legend
  svg.append("rect")
    .attr("x", 850)
    .attr("y", 20)
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", "#1a1a1d");

  svg.append("text")
    .attr("x", 880)
    .attr("y", 36)
    .text("Survived");

  svg.append("rect")
    .attr("x", 850)
    .attr("y", 50)
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", "#c3073f");

  svg.append("text")
    .attr("x", 880)
    .attr("y", 66)
    .text("Died");

  if (type == "age") {
    // set the ranges
    var x = d3.scaleBand().range([ 0, width ]).padding(0.1);
    var y = d3.scaleLinear().range([ height, 0 ]);

    var survivedAgeRange = new Map();
    var deadAgeRange = new Map();

    data.forEach(function(d) {
      if (d["age"] != "") {
        var startAge = (d["age"] - (d["age"] % 5));
        var endAge = startAge + 5;
        var ageRange = startAge + "-" + endAge;

        if (d["survived"] == 0) {
          if (!deadAgeRange.hasOwnProperty(ageRange)) {
            deadAgeRange[ageRange] = 0;
          }
          deadAgeRange[ageRange]++;
        }

        else if (d["survived"] == 1) {
          if (!survivedAgeRange.hasOwnProperty(ageRange)) {
            survivedAgeRange[ageRange] = 0;
          }
          survivedAgeRange[ageRange]++;
        }
      }
    });

    let keys = [
      "0-5", "5-10", "10-15", "15-20", "20-25", "25-30", "30-35", "35-40",
      "40-45", "45-50", "50-55", "55-60", "60-65", "65-70", "70-75", "80-85"
    ];

    // Scale the range of the data in the domains
    x.domain(keys);
    y.domain([ 0, d3.max(keys, function(d) { return deadAgeRange[d]; }) ]);

    svg.append("text")      // text label for the x axis
        .attr("x", width / 2 )
        .attr("y",  height + margin.bottom - 10 )
        .style("text-anchor", "middle")
        .text("Age Group");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2) - 20)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("# People");

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(keys)
        .enter()
        .append("rect")
        .attr("class", "survived")
        .attr("x", function(d) { return x(d); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(survivedAgeRange[d]); })
        .attr("height",
              function(d) { return height - y(survivedAgeRange[d]); });

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g").call(d3.axisLeft(y));

    svg.selectAll(".bar")
        .data(keys)
        .enter()
        .append("rect")
        .attr("class", "died")
        .attr("x", function(d) { return x(d); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(deadAgeRange[d]); })
        .attr("height", function(d) { return height - y(deadAgeRange[d]); });

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g").call(d3.axisLeft(y));
  }

  if (type == "gender") {
    // set the ranges
    var x = d3.scaleBand().range([ 0, width ]).padding(0.1);
    var y = d3.scaleLinear().range([ height, 0 ]);

    var survivedGender = new Map();
    var deadGender = new Map();

    data.forEach(function(d) {
      var gender = d["sex"];
      if (d["survived"] == 0) {
        if (!deadGender.hasOwnProperty(gender)) {
          deadGender[gender] = 0;
        }
        deadGender[gender]++;
      }

      else if (d["survived"] == 1) {
        if (!survivedGender.hasOwnProperty(gender)) {
          survivedGender[gender] = 0;
        }
        survivedGender[gender]++;
      }
    });

    console.log(survivedGender);
    console.log(deadGender);

    let keys = [ "male", "female" ];

    // Scale the range of the data in the domains
    x.domain(keys);
    y.domain([ 0, d3.max(keys, function(d) { return deadGender[d]; }) ]);


    svg.append("text")      // text label for the x axis
        .attr("x", width / 2 )
        .attr("y",  height + margin.bottom - 10 )
        .style("text-anchor", "middle")
        .text("Gender");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2) - 20)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("# People");

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(keys)
        .enter()
        .append("rect")
        .attr("class", "survived")
        .attr("x", function(d) { return x(d); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(survivedGender[d]); })
        .attr("height", function(d) { return height - y(survivedGender[d]); });

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g").call(d3.axisLeft(y));

    svg.selectAll(".bar")
        .data(keys)
        .enter()
        .append("rect")
        .attr("class", "died")
        .attr("x", function(d) { return x(d); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(deadGender[d]); })
        .attr("height", function(d) { return height - y(deadGender[d]); });

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g").call(d3.axisLeft(y));
  }

  if (type == "family") {

    // set the ranges
    var x = d3.scaleBand().range([ 0, width ]).padding(0.1);
    var y = d3.scaleLinear().range([ height, 0 ]);

    var familySizeSurvived = new Map();
    var familySizeDied = new Map();

    data.forEach(function(d) {
      var famSize = parseInt(d["sibsp"]) + parseInt(d["parch"]);
      if (d["survived"] == 0) {
        if (!familySizeDied.hasOwnProperty(famSize)) {
          familySizeDied[famSize] = 0;
        }
        familySizeDied[famSize]++;
      }

      else if (d["survived"] == 1) {
        if (!familySizeSurvived.hasOwnProperty(famSize)) {
          familySizeSurvived[famSize] = 0;
        }
        familySizeSurvived[famSize]++;
      }
    });

    let keys = [ "0", "1", "2", "3", "4", "5", "6", "7", "10" ];

    // Scale the range of the data in the domains
    x.domain(keys);
    y.domain([ 0, d3.max(keys, function(d) { return familySizeDied[d]; }) ]);

    svg.append("text")      // text label for the x axis
        .attr("x", width / 2 )
        .attr("y",  height + margin.bottom - 10 )
        .style("text-anchor", "middle")
        .text("Family Size");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2) - 20)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("# People");

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(keys)
        .enter()
        .append("rect")
        .attr("class", "survived")
        .attr("x", function(d) { return x(d); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(familySizeSurvived[d]); })
        .attr("height",
              function(d) { return height - y(familySizeSurvived[d]); });

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g").call(d3.axisLeft(y));

    svg.selectAll(".bar")
        .data(keys)
        .enter()
        .append("rect")
        .attr("class", "died")
        .attr("x", function(d) { return x(d); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(familySizeDied[d]); })
        .attr("height", function(d) { return height - y(familySizeDied[d]); });

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g").call(d3.axisLeft(y));
  }

  if (type == "class") {
    // set the ranges
    var x = d3.scaleBand().range([ 0, width ]).padding(0.1);
    var y = d3.scaleLinear().range([ height, 0 ]);

    var classSurvived = new Map();
    var classDied = new Map();

    data.forEach(function(d) {
      var pclass = d["pclass"];
      if (d["survived"] == 0) {
        if (!classDied.hasOwnProperty(pclass)) {
          classDied[pclass] = 0;
        }
        classDied[pclass]++;
      }

      else if (d["survived"] == 1) {
        if (!classSurvived.hasOwnProperty(pclass)) {
          classSurvived[pclass] = 0;
        }
        classSurvived[pclass]++;
      }
    });

    let keys = [ "1", "2", "3" ];

    // Scale the range of the data in the domains
    x.domain(keys);
    y.domain([ 0, d3.max(keys, function(d) { return classDied[d]; }) ]);

    svg.append("text")      // text label for the x axis
        .attr("x", width / 2 )
        .attr("y",  height + margin.bottom - 10 )
        .style("text-anchor", "middle")
        .text("Class");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2) - 20)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("# People");

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(keys)
        .enter()
        .append("rect")
        .attr("class", "survived")
        .attr("x", function(d) { return x(d); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(classSurvived[d]); })
        .attr("height", function(d) { return height - y(classSurvived[d]); });

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g").call(d3.axisLeft(y));

    svg.selectAll(".bar")
        .data(keys)
        .enter()
        .append("rect")
        .attr("class", "died")
        .attr("x", function(d) { return x(d); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(classDied[d]); })
        .attr("height", function(d) { return height - y(classDied[d]); });

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g").call(d3.axisLeft(y));
  }
}

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

  const capitalize = (s) => { return s.charAt(0).toUpperCase() + s.slice(1) }

  var tip = d3.tip().attr('class', 'd3-tip').html(function(d) {
    var survived = (d['survived'] === "0") ? "Died" : "Survived";
    return d['name'] + "<br>" + d['age'] + " yrs - " + capitalize(d['sex']) +
           " - " + survived;
  });
  svg.call(tip);

  var deckFreq = new Map();
  data.forEach(function(d) {
    var currentDeck = d["deck"];
    if (currentDeck != "") {
      if (!deckFreq.hasOwnProperty(currentDeck))
        deckFreq[currentDeck] = 0;
      deckFreq[currentDeck]++;
    }
  });

  var deckFreqCount = new Map();
  for (var i in deckFreq)
    deckFreqCount[i] = deckFreq[i];

  // var deckSurvivedCount = new Map();
  // for (var i in deckFreq) {
  //   deckSurvivedCount[i] = 0;
  // }
  //
  // var deckDiedCount = new Map();
  // for (var i in deckFreq) {
  //   deckDiedCount[i] = 0;
  // }

  // var survivedScale =
  //     d3.scaleLinear().domain([ 0, 200 ]).range([ 0, width / 2 ]);
  //
  // var diedScale =
  //     d3.scaleLinear().domain([ 0, 200 ]).range([ width, width / 2 ]);

  var deckScale =
      d3.scalePoint()
          .domain(data.map(function(entry) { return entry['deck']; }))
          .rangeRound([ 0, height / 6 ])
          .padding(0.1);

  svg.selectAll("deck")
      .data(data)
      .enter()
      .filter(function(d) { return d["deck"] != "" })
      .append("circle")
      .attr("fill",
            function(d, i) {
              if (d["sex"] === "female") {
                return "red";
              } else {
                return "blue";
              }
            })
      .attr("r", 3)
      .attr("cy", function(d, i) { return deckScale(d["deck"]); })
      .attr("cx",
            function(d, i) {
              d3.scaleLinear()
              .domain(0, deckFreq[d["deck"]])
              .range([0, width - 20]);
              var res = d3.scaleLinear()
              .domain([0, deckFreq[d["deck"]]-1])
              .range([0, width - 20]);

              var resCount = res( deckFreq[d["deck"]] - deckFreqCount[d["deck"]]  );
               deckFreqCount[d["deck"]]--;
               return resCount;


              // if (d["survived"] === "0") {
              //   var res = diedScale(deckDiedCount[d["deck"]]);
              //   deckDiedCount[d["deck"]] += 4;
              //   return res;
              // } else {
              //   var res = survivedScale(deckSurvivedCount[d["deck"]]);
              //   deckSurvivedCount[d["deck"]] += 4;
              //   return res;
              // }
            })
      .on("mouseover",
          function(d) {
            tip.direction('n');
            tip.show(d, this);
          })
      .on("mouseout", function(d) { tip.hide(d, this); });

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
