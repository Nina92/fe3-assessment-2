
/* Gebaseerd op Mike Bostock's Grouped Bar Chart https://bl.ocks.org/mbostock/3887051 */

var svg = d3.select("svg")
var margin = {top: 20, right: 20, bottom: 30, left: 60}
var width = +svg.attr("width") - margin.left - margin.right
var height = +svg.attr("height") - margin.top - margin.bottom
var g = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// var x0 in de originele code
var x = d3.scaleBand()
  .rangeRound([7, 960])
  .paddingInner(0.1);

// var x1 in de originele code
var bar = d3.scaleBand()
  .padding(0.15);

var y = d3.scaleLinear()
  .rangeRound([height, 0]);

// var z in de originele code
var color = d3.scaleOrdinal()
  .range(["#C2024F", "#04BBBF", "#D2D945", "#FCB13F", "#FF7030"]);

d3.text("data.csv").get(onload);

function onload(error, doc) {

  if (error) throw error;

  // Hier wordt de index van het begin van de header opgeslagen in een variabele
  var startOfHeaderIndex = doc.indexOf('"Onderwerpen";"Jonger dan 20 jaar"');

  // Hier wordt de index van het begin van de subheader opgeslagen in een variabele. Deze subheader wil ik weg hebben omdat het een vreemde regel is die ik niet gebruik ("Perioden";"aantal";"aantal";"aantal";"aantal";"aantal")
  var startOfSubHeaderIndex = doc.indexOf('"Perioden"');

  // Hier wordt de index van het eind van de subheader opgeslagen in een variabele
  var endOfSubHeaderIndex = doc.indexOf('\n', startOfSubHeaderIndex);

  // Hier wordt de inhoud van startOfSubHeaderIndex tot endOfSubHeaderIndex opgeslagen in een variabele (dit is een string)
  var subHeader = doc.substring(startOfSubHeaderIndex, endOfSubHeaderIndex);

  // Hier wordt de index  van het begin van de footer opgeslagen in een variabele
  var startOfFooterIndex = doc.indexOf("Centraal Bureau voor de Statistiek") - 3;

  // Hier wordt de string die tussen startOfHeaderIndex en startOfFooterIndex zit opgeslagen in doc zodat ik alleen de benodigde data inclusief header overhoud. trim() haalt de whitespace aan beide kanten weg.
  doc = doc.substring(startOfHeaderIndex, startOfFooterIndex).trim();

  // Hier wordt de subheader weggehaald
  doc = doc.replace(subHeader + '\n', '');

  // Hier worden alle dubbele aanhalingstekens weggehaald
  doc = doc.replace(/"/g, '');

  // Hier worden alle semicolons vervangen door komma's. Nu zijn de waarden door komma's gescheiden zoals bij een CSV bestand.
  doc = doc.replace(/;/g, ',');

  // Hier wordt het woord "Onderwerpen" vervangen door het woord "Jaar" (de naam van de eerste kolom)
  doc = doc.replace('Onderwerpen', 'Jaar');

  // Hier parse ik de inhoud van doc zodat de string met gecleande data wordt omgezet in een array met objecten. De cijfers over het aantal inwoners zet ik om naar numbers.
  var data = d3.csvParse(doc, function(d) {
    return {
      Jaar: d.Jaar,
      ['Jonger dan 20 jaar']: +(d['Jonger dan 20 jaar']),
      ['20 tot 40 jaar']: +(d['20 tot 40 jaar']),
      ['40 tot 65 jaar']: +(d['40 tot 65 jaar']),
      ['65 tot 80 jaar']: +(d['65 tot 80 jaar']),
      ['80 jaar of ouder']: +(d['80 jaar of ouder'])
    }
  });

  var keys = data.columns.slice(1);

  console.log(keys);

  x.domain(data.map(function(d) { return d.Jaar; }));

  bar.domain(keys)
    .rangeRound([0, x.bandwidth()]);

  y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })])
    .nice();

  g.append("g")
    .selectAll("g")
    .data(data)
    .enter().append("g")
      .attr("transform", function(d) { return "translate(" + x(d.Jaar) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("x", function(d) { return bar(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", bar.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) { return color(d.key); });

  g.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  g.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
      .attr("x", 7)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("text-anchor", "start")
      .text("Aantal inwoners");

  var legend = g.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
    .attr("x", width - 19)
    .attr("width", 19)
    .attr("height", 19)
    .attr("fill", color);

  legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9.5)
    .attr("dy", "0.32em")
    .text(function(d) { return d; });
}