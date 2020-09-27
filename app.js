"use strict";
!(function() {
  function analytics(action) {
    var label =
      1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "null";
    window.dataLayer.push({
      event: "Interactive",
      category: "Interactive",
      action: action,
      label: label
    });
  }


  function app() {

    if (/Edge/.test(navigator.userAgent)) {
      var X = navigator.userAgent;
      var Y = "Edge/"
      var Z = Number(X.slice(X.indexOf(Y) + Y.length));
      if(Z < 18){
        var title = document.getElementById("title");
       title.innerHTML = "This interactive requires an up-to-date version of Microsoft Edge. Make sure you have the latest version installed or use another modern browser (i.e. Firefox, Chrome, Safari, or Opera).";
       title.style.color = "red";
      }

}

    //userAgent in IE7 WinXP returns: Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; .NET CLR 2.0.50727)
  //userAgent in IE11 Win7 returns: Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko

  if (navigator.userAgent.indexOf('MSIE') != -1)
   var detectIEregexp = /MSIE (\d+\.\d+);/ //test for MSIE x.x
  else // if no "MSIE" string in userAgent
   var detectIEregexp = /Trident.*rv[ :]*(\d+\.\d+)/ //test for rv:x.x or rv x.x where Trident string exists

  if (detectIEregexp.test(navigator.userAgent)){ //if some form of IE
    var title = document.getElementById("title");
   title.innerHTML = "This interactive requires a modern browser (Firefox, Chrome, Safari, Opera, or Edge)";
   title.style.color = "red";
  }
  else{
  }

    function currencyFormat(num) {
  return '$' + num.toFixed().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

d3.selection.prototype.moveToFront = function() {
      return this.each(function(){
        this.parentNode.appendChild(this);
      });
    };

    var filter = 1;
    var selection = "summer_all_all"
    var prev_selection = ""

/*
    function change_filter(){
      var analytics_label = "category"
      if(filter == 1){
          variable = 0;
          analytics_label = "category"
          labels = ["Private 4-year", "Public 4-year", "2-year", "For-Profit", "All"]
          keys = ["Private 4-yr", "Public 4-yr", "2-yr", "For-Profit", "All"]
          colors = ["#053769", "#65a4e5", "#ffa626", "#ff5e1a", "#000000"]
        } else if(filter == 2){
          variable = 1;
          analytics_label = "selectivity_tier"
          labels = ["Highly Selective 4-year", "Selective 4-year", "Nonselective 4-year", "Two-year", "For-profit", "All"]
          keys = ["Highly Sel 4-yr", "Sel 4-yr", "Nonsel 4-yr", "2-yr", "For-Profit", "All"]
          colors = ["#053769", "#65a4e5", "#ffa626", "#ff5e1a", "#0EBE9E", "#000000"]
        }else{
          variable = 2;
          analytics_label = "size"
          labels = ["Small", "Medium", "Large", "Very Large", "All"]
          keys = ["Small", "Medium", "Large", "Very Large", "All"]
          colors = ["#053769", "#65a4e5", "#ffa626", "#ff5e1a", "#000000"]
        }
        analytics('dropdown_menu', analytics_label);
        d3.selectAll("#graph_points").remove();
        build_legend(keys, colors, labels);
        add_dots();
    }
*/


    //Initial graph setup

    var margin = {top: 30, right: 20, bottom: 30, left: 50},
        width = 400 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var colors = ["#007363", "#00add0", "#6e2585", "#69be28"];
    var genders_short = ["all", "fem", "male"];
    var genders_long = ["All Genders", "Female", "Male"];
    var races_short = ["all", "black", "hisp", "white"];
    var races_long = ["All Races", "Black", "Hispanic", "White"];
    var suffix1 = "all";
    var suffix2 = "all";
    var graphLabel1 = "All genders, all races, summer"
    var graphLabel2 = "Use the dropdown menus to explore subgroups"
    var season = "summer"
    var season_long = "Summer"
    var startup = true
    var temp_keys = ["key1", "key2", "key3", "key4"]
    var const_keys = ["idleshare_all_all", "onlyschoolshare_all_all", "onlyworkshare_all_all",  "bothshare_all_all"]
    // append the svg object to the body of the page
    var svg1 = d3.select(".graph1")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("y", "400")
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    var svg2 = d3.select(".graph2")
                .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                .append("g")
                  .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");

    create_graph();

    function hover(){


    }
    function changeIt(){
      startup = false;

      //get rid of everything
      d3.selectAll("#graphLabel1, #graphLabel2").remove()
      //d3.selectAll("#yaxis").remove()
      //d3.selectAll("#xaxis").remove()
        var time_form = document.getElementById("time_frame")
        var time_form_val;
        for(var i=0; i<time_form.length; i++){
            if(time_form[i].checked){
              time_form_val = time_form[i].id;}}
      var gender = document.getElementById("gender").value;
      var race = document.getElementById("race").value;

        if(time_form_val == "summer"){
          season = "summer"
          season_long = "Summer"
          graphLabel1 = "All genders, all races, summer"
          }else{
            season = "ay"
            season_long = "Academic Year"
          graphLabel1 = "All genders, all races, academic year"
          };

        suffix1 = genders_short[gender]
        suffix2 = races_short[race]
        graphLabel2 = genders_long[gender]+", "+races_long[race]+", "+season_long

          //create_graph();
          update_graph();
                }

    function update_graph(){
      var suffix_comb = suffix1 + "_" + suffix2;
      selection = suffix_comb+"_"+season

      d3.csv("sandchart_data.csv", function(data) {
        var keys1 = data.columns.slice(1).filter(function(d){
          return d.includes("all_all_"+season)
        })
        var keys2 = data.columns.slice(1).filter(function(d){
          return d.includes(selection)
        })

        var stackedData1 = d3.stack()
          .keys(keys1)
          (data)
          var stackedData2 = d3.stack()
            .keys(keys2)
            (data)
          var x = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return d.year; }))
            .range([ 0, width ]);
            var y = d3.scaleLinear()
              .domain([0, 100])
              .range([ height, 0 ]);
          var area = d3.area()
           .x(function(d) { return x(d.data.year); })
           .y0(function(d) { return y(d[0]*100); })
           .y1(function(d) { return y(d[1]*100); })
           svg1.append("text")
               .attr("text-anchor", "middle")
               .attr("x", 170)
               .attr("y", -10 )
               .text(graphLabel1)
               .attr("id", "graphLabel1")
               .classed("bold", true)
               .classed("caps", true)

               svg2.append("text")
                   .attr("text-anchor", "middle")
                   .attr("x", 170)
                   .attr("y", -10 )
                   .text(graphLabel2)
                   .attr("id", "graphLabel1")
                   .classed("bold", true)
                   .classed("caps", true)

        d3.selectAll("#layer_1")
        .data(stackedData1)
        .transition()
        .duration(2000)
        .attr("d", area)

        d3.selectAll("#layer_2")
        .data(stackedData2)
        .transition()
        .duration(2000)
        .attr("d", area)
      })

    }

    var dataTime = d3.select("#time_frame")
          dataTime.on("change", changeIt)

    var dataGender = d3.select("#gender")
          dataGender.on("change", changeIt)

    var dataRace = d3.select("#race")
          dataRace.on("change", changeIt)
    // Parse the Data

    function create_graph(){
      d3.csv("sandchart_data.csv", function(data) {

        var suffix_comb = suffix1 + "_" + suffix2;
        selection = suffix_comb+"_"+season

        //////////
        // GENERAL //
        //////////

        // List of groups = header of the csv files
        var keys1 = data.columns.slice(1).filter(function(d){
          return d.includes("all_all_"+season)
        })
        var keys2 = data.columns.slice(1).filter(function(d){
          return d.includes(selection)
        })

        // color palette
        var color = d3.scaleOrdinal()
          .domain(keys1)
          .range(colors);

        //stack the data?
        var stackedData1 = d3.stack()
          .keys(keys1)
          (data)

          var stackedData2 = d3.stack()
            .keys(keys2)
            (data)

      var legend_labels = ["Neither labor force participant nor enrolled in school", "Enrolled in school and not participating in labor force",
                            "Labor force participant and enrolled in school", "Labor force participant and not enrolled in school"]

      var circle_x = [125, 500, 125, 500]
      var circle_y = [15, 15, 45, 45]
        //////////
        // AXIS //
        //////////
        var parseTime = d3.timeParse("%Y");
        data.forEach(function(d) {
          d.year = parseTime(d.year);
        });
        // Add X axis
        var x = d3.scaleTime()
          .domain(d3.extent(data, function(d) { return d.year; }))
          .range([ 0, width ]);
        var xAxis1 = svg1.append("g")
          .attr("id", "xaxis")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0))

          var xAxis2 = svg2.append("g")
            .attr("id", "xaxis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0))




        // Add Y axis label:

        svg1.append("text")
            .attr("text-anchor", "middle")
            .attr("x", 170)
            .attr("y", -10 )
            .text(graphLabel1)
            .attr("id", "graphLabel1")
            .classed("bold", true)
            .classed("caps", true)

            svg1.append("text")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .attr("x", -135)
                .attr("y", -35 )
                .text("Percent")
                .attr("id", "axislabel")
                .classed("bold", true)


            svg2.append("text")
            .attr("text-anchor", "middle")
                .attr("x", 170)
                .attr("y", -10 )
                .text(graphLabel2)
                .attr("id", "graphLabel2")

                svg2.append("text")
                    .attr("text-anchor", "end")
                    .attr("transform", "rotate(-90)")
                    .attr("x", -135)
                    .attr("y", -35 )
                    .text("Percent")
                    .attr("id", "axislabel")
                    .classed("bold", true)



        // Add Y axis
        var y = d3.scaleLinear()
          .domain([0, 100])
          .range([ height, 0 ]);
        svg1.append("g")
          .attr("id", "yaxis")
          .call(d3.axisLeft(y).ticks(5).tickSizeOuter(0))

        svg2.append("g")
            .attr("id", "yaxis")
            .call(d3.axisLeft(y).ticks(5).tickSizeOuter(0))


        //////////
        // BRUSHING AND CHART //
        //////////

        // Add a clipPath: everything out of this area won't be drawn.
        var clip1 = svg1.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", width )
            .attr("height", height )
            .attr("x", 0)
            .attr("y", 0);

            var clip2 = svg2.append("defs").append("svg:clipPath")
                .attr("id", "clip")
                .append("svg:rect")
                .attr("width", width )
                .attr("height", height )
                .attr("x", 0)
                .attr("y", 0);
/*
        // Add brushing
        var brush = d3.brushX()                 // Add the brush feature using the d3.brush function
            .extent( [ [0,0], [width,height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
            .on("end", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
*/
        // Create the scatter variable: where both the circles and the brush take place
        var areaChart1 = svg1.append('g')
          .attr("clip-path", "url(#clip)")


          var areaChart2 = svg2.append('g')
            .attr("clip-path", "url(#clip)")



        // Area generator
        var area = d3.area()
         .x(function(d) { return x(d.data.year); })
         .y0(function(d) { return y(d[0]*100); })
         .y1(function(d) { return y(d[1]*100); })

         
        // Show the areas
    areaChart1
           .selectAll("mylayers")
           .data(stackedData1)
           .enter()
           .append("path")
             .attr("class", function(d, i) {
               return "myArea " + d.key })
             .attr("id", "layer_1")
             .style("fill", function(d) { return color(d.key); })
             .attr("d", area)

            // Show the areas
            areaChart2
              .selectAll("mylayers")
              .data(stackedData2)
              .enter()
              .append("path")
                .attr("class", function(d, i) {
                  temp_keys[i] = d.key;
                  return "myArea " + d.key })
                .attr("id", "layer_2")
                .style("fill", function(d) { return color(d.key); })
                .attr("d", area)




        var idleTimeout
        function idled() { idleTimeout = null; }


          //////////
          // HIGHLIGHT GROUP //
          //////////

          // What to do when one group is hovered
          var highlight = function(d, i){

            // reduce opacity of all groups
            d3.selectAll(".myArea").style("opacity", .1)
            // expect the one that is hovered
            d3.selectAll("."+d+", ."+temp_keys[i]+", ."+const_keys[i]).style("opacity", 1)
          }

          // And when it is not hovered anymore
          var noHighlight = function(d){
            d3.selectAll(".myArea").style("opacity", 1)
          }



          //////////
          // LEGEND //
          //////////
          build_legend();


          function build_legend() {
            d3.selectAll(".legend").remove();

            var legend_svg = d3
              .select(".legend-container")
              .append("svg")
              .attr("width", 950)
              .attr("height", 60)
              .attr("x", "50%")
              .classed("legend", true);

              var size = 20
              legend_svg.selectAll("myrect")
                .data(keys1)
                .enter()
                .append("circle")
                  .attr("id", "legend_square")
                  .attr("cy", function(d,i){
                    return circle_y[i]})
                  .attr("cx", function(d,i){
                    return circle_x[i]})
                  .attr("r", 8)
                  .attr("height", size)
                  .style("fill", function(d){ return color(d)})
                  .on("mouseover", highlight)
                  .on("mouseleave", noHighlight)

                  legend_svg.selectAll("mylabels")
                    .data(legend_labels)
                    .enter()
                    .append("text")
                      .attr("id", "legend_text")
                      .attr("y", function(d,i){
                        return circle_y[i]})
                      .attr("x",  function(d,i){
                        return circle_x[i] + 12}) // 100 is where the first dot appears. 25 is the distance between dots
                      .text(function(d){ return d})
                      .attr("text-anchor", "left")
                      .style("alignment-baseline", "middle")
                      .on("mouseover", highlight)
                      .on("mouseleave", noHighlight)


          }
          return area;
      })
    }



  }

  document.addEventListener(
    "readystatechange",
    function() {
      "interactive" === document.readyState && app(),
        "complete" === document.readyState;
    },
    !1
  );
})();
