const URL =
    "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json",
  TITLE = "Monthly Global Land-Surface Temperature",
  SUBTITLE = "1753 - 2015",
  INFO =
    "Temperatures are in Celsius and are relative to the Jan 1951-Dec 1980 average. Estimated Jan 1951-Dec 1980 absolute temperature ℃: 8.66 +/- 0.07",
  margin = { top: 115, right: 50, bottom: 100, left: 90 },
  width = 950 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom,
  colorScheme = d3.schemeSpectral[8],
  f = d3.format(".2f");

var chart = d3
  .select("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([0, height - height / 12]);
var c = d3.scaleLinear().range([0, 1]);

function tooltip(d, xPos, yPos) {
  console.log(d);
  const svg = document.getElementsByTagName("svg")[0].getBoundingClientRect(),
    left = event.clientX,
    top = svg.top + margin.top + yPos - 60,
    date = '<p class="date">' + parseMonth(d.month) + " " + d.year + "</p>",
    t = f(d.variance + 8.66),
    temp = "<p>Average Temperature: " + t + "℃</p>",
    variance = "<p>Variance from Average: " + f(d.variance) + "℃</p>";
  d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("left", left + "px")
    .style("top", top + "px")
    .html(date + temp + variance);
}

function dataParse(d) {
  const data = d.monthlyVariance,
    baseTemp = d.baseTemperature,
    minYear = d3.min(data, data => data.year),
    maxYear = d3.max(data, data => data.year),
    minMonth = d3.min(data, data => data.month),
    maxMonth = d3.max(data, data => data.month),
    minVar = d3.min(data, data => data.variance),
    maxVar = d3.max(data, data => data.variance),
    w = width / (maxYear - minYear),
    h = height / 12;
  //x domain is years, y scale is months
  //fill scale is color

  x.domain([minYear, maxYear]);
  y.domain([minMonth, maxMonth]);
  c.domain([maxVar, minVar]);

  var rects = chart
    .selectAll("rect")
    .attr("class", "rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", data => x(data.year))
    .attr("y", data => y(data.month))
    .attr("width", w)
    .attr("height", h)
    .attr("fill", data => d3.interpolateSpectral(c(data.variance)))
    .on("mouseenter", handleMouseover)
    .on("mouseout", handleMouseout);

  //axes

  var xAxis = d3.axisBottom(x).tickFormat(t => t.toString());
  var yAxis = d3.axisLeft(y).tickFormat(parseMonth);

  chart
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  chart
    .append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(5," + h / 2 + ")")
    .call(yAxis)
    .select(".domain")
    .remove();

  chart
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -60)
    .attr("x", height / -2)
    .attr("dy", "1em")
    .text("Month");

  chart
    .append("text")
    .attr("y", height + 35)
    .attr("x", width / 2)
    .text("Year");

  //title
  chart
    .append("text")
    .attr("y", -0.65 * margin.top)
    .attr("x", width / 2)
    .attr("font-size", "1.5em")
    .attr("text-anchor", "middle")
    .text(TITLE);

  chart
    .append("text")
    .attr("y", -0.4 * margin.top)
    .attr("x", width / 2)
    .attr("font-size", "1.25em")
    .attr("text-anchor", "middle")
    .text(SUBTITLE);

  chart
    .append("text")
    .attr("y", -0.18 * margin.top)
    .attr("x", width / 2)
    .attr("font-size", "0.75em")
    .attr("text-anchor", "middle")
    .text(INFO);

  //legend
  var svg = d3.select("svg");
  let xPos = margin.left + width - h * colorScheme.length,
    yPos = height + margin.top + 0.5 * h,
    t = (maxVar - minVar) / colorScheme.length,
    temp = minVar + 8.66;
  for (let i = colorScheme.length - 1; i > -1; i--) {
    svg
      .append("rect")
      .attr("x", xPos)
      .attr("y", yPos + h)
      .attr("height", h)
      .attr("width", h)
      .attr("fill", colorScheme[i]);

    console.log(temp);
    svg
      .append("text")
      .attr("x", xPos)
      .attr("y", yPos + 2 * h + 12)
      .attr("font-size", "0.5em")
      .text(">" + f(temp) + "℃");

    xPos += h;
    temp += t;
  }
  svg.append("text")
    .attr("x", xPos-colorScheme.length*h-5)
    .attr("y", yPos+1.5*h)
    .attr("text-anchor", "end")
    .attr("alignment-baseline", "middle")
    .attr("font-size", "0.75em")
    .text("Temperatures")
}

d3.json(URL, dataParse);

function handleMouseover(d) {
  d3.select(this).attr("stroke", "white");
  const xPosition = x(d.year),
    yPosition = y(d.month);
  tooltip(d, xPosition, yPosition);
}

function handleMouseout(d) {
  d3.select(this).attr("stroke", null);
  d3.select(".tooltip").remove();
}

function parseMonth(x) {
  const arr = [
    "null",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  return arr[x];
}