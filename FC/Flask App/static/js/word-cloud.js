// var tags = [{"key": "Cat", "value": 26}, 
// {"key": "fish", "value": 19}, 
// {"key": "things", "value": 18}, 
// {"key": "look", "value": 16}, {"key": "two", "value": 15},
//  {"key": "like", "value": 14}, {"key": "hat", "value": 14}]; 

function buildCloud(t){
    
    var vis_zero = d3.select("#vis");
    var svg_zero = vis_zero.select("svg").remove();

    d3.json("/getkeys/" + t, function(keys){
        tags  = keys;

        var fill = d3.scale.category20b();

        //var w = window.innerWidth,
                //h = window.innerHeight;
                var w = 500,
                h = 500;
        var max,
                fontSize;

        var layout = d3.layout.cloud()
                .timeInterval(Infinity)
                .size([w, h])        
                //.size([500, 500])
                .fontSize(function(d) {
                    return fontSize(+d.value);
                })
                .text(function(d) {
                    return d.key;
                })
                .on("end", draw);

        var svg = d3.select("#vis").append("svg")
                .attr("width", w)
                .attr("height", h);

        var vis = svg.append("g").attr("transform", "translate(" + [w >> 1, h >> 1] + ")");

        update();


        d3.select("#selTrend")
        .on("change", function(d) { optionChanged();});

       

        //if(window.attachEvent) {
            //window.attachEvent('onresize', update);
        //}
        //else if(window.addEventListener) {
            //window.addEventListener('resize', update);
        //}

        function draw(data, bounds) {
            var w = 700,
                h = 500;

            svg.attr("width", w).attr("height", h);

            scale = bounds ? Math.min(
                    w / Math.abs(bounds[1].x - w / 2),
                    w / Math.abs(bounds[0].x - w / 2),
                    h / Math.abs(bounds[1].y - h / 2),
                    h / Math.abs(bounds[0].y - h / 2)) / 2 : 1;

            var text = vis.selectAll("text")
                    .data(data, function(d) {
                        return d.text.toLowerCase();
                    });
            text.transition()
                    .duration(1000)
                    .attr("transform", function(d) {
                        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                    })
                    .style("font-size", function(d) {
                        return d.size + "px";
                    });
            text.enter().append("text")
                    .attr("text-anchor", "middle")
                    .attr("transform", function(d) {
                        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                    })
                    .style("font-size", function(d) {
                        return d.size + "px";
                    })
                    .style("opacity", 1e-6)
                    .transition()
                    .duration(1000)
                    .style("opacity", 1);
            text.style("font-family", function(d) {
                return d.font;
            })
                    .style("fill", function(d) {
                        return fill(d.text.toLowerCase());
                    })
                    .text(function(d) {
                        return d.text;
                    });

            vis.transition().attr("transform", "translate(" + [w >> 1, h >> 1] + ")scale(" + scale + ")");
        }

        function update(){

                layout.font('impact').spiral('archimedean');
                fontSize = d3.scale['sqrt']().range([10, 100]);
                if (tags.length){
                    fontSize.domain([+tags[tags.length - 1].value || 1, +tags[0].value]);
                }
                layout.stop().words(tags).start();
            
        }
    })
}


function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selTrend");
  
    // Use the list of sample names to populate the select options

    selector
          .append("option")
          .text("0")
          .property("value", 0);
    selector.append("option")
          .text("1")
          .property("value", 1);
    buildCloud(0);
};

function optionChanged() {
    // Fetch new data each time a new sample is selected
    selectValue = d3.select('#selTrend').property('value')
    buildCloud(selectValue);
  }

init();



