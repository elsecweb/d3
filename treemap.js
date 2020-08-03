// actual visualization!
var el_id = 'chart';
        var obj = document.getElementById(el_id);
        var divWidth = obj.offsetWidth;
        var margin = {top: 30, right: 0, bottom: 20, left: 0},
            width = divWidth,
            height = 3000 - margin.top - margin.bottom,
            formatNumber = d3.format(","),
            transitioning;

        // sets x and y scale to determine size of boxes
        var x = d3.scaleLinear()
            .domain([0, width])
            .range([0, width]);
        var y = d3.scaleLinear()
            .domain([0, height])
            .range([0, height]);
        var treemap = d3.treemap()
                .size([width, height])
                .paddingInner(0)
                .round(false);
        var svg = d3.select('#'+el_id).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.bottom + margin.top)
            .style("margin-left", -margin.left + "px")
            .style("margin.right", -margin.right + "px")
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .style("shape-rendering", "crispEdges");
        var grandparent = svg.append("g")
                .attr("class", "grandparent");
            grandparent.append("rect")
                .attr("y", -margin.top)
                .attr("width", width)
                .attr("height", margin.top)
                .attr("fill", '#cae7b9');//change this ugly colour please
            grandparent.append("text")
                .attr("x", 6)
                .attr("y", 6 - margin.top)
                .attr("dy", ".75em");
        d3.json("data/hugoawards.json", function(data) { //the data in all its "glory"
            var root = d3.hierarchy(data);
            console.log(root);
            treemap(root
                .sum(function (d) {
                    return +d.total;
                })
                .sort(function (a, b) {
                    return b.height - a.height || b.total - a.total
                })
            );
            display(root);
            function display(d) {
                // write text into grandparent and activate click's handler
                grandparent
                    .datum(d.parent)
                    .on("click", transition)
                    .select("text")
                    .text(name(d));
                    //.text(age(d)); adding stuff here seems to break the viz, and yes, i remove the ";" above. also tried adding , age(d) in the field above.

                // grandparent color
                grandparent
                    .datum(d.parent)
                    .select("rect")
                    .attr("fill", function () {
                        return '#cae7b9'//change
                    });
                var g1 = svg.insert("g", ".grandparent")
                    .datum(d)
                    .attr("class", "depth");
                var g = g1.selectAll("g")
                    .data(d.children)
                    .enter().
                    append("g");

                // add class and click handler to all g's with kiddos
                g.filter(function (d) {
                    return d.children;
                })
                    .classed("children", true)
                    .on("click", transition);
                g.selectAll(".child")
                    .data(function (d) {
                        return d.children || [d];
                    })
                    .enter().append("rect")
                    .attr("class", "child")
                    .call(rect);

                // add title to parents
                g.append("rect")
                    .attr("class", "parent")
                    .call(rect)
                    .append("title")
                    .text(function (d){
                        return d.data.name
                        return d.data.age; //seems to ignore this
                    });

                // adding a foreign object instead of a text object = text wrapping
                g.append("foreignObject")
                    .call(rect)
                    .attr("class", "foreignobj")
                    .append("xhtml:div")
                    .attr("dy", ".75em")
                    .html(function (d) {
                        return '' +
                            '<p class="title"> ' + d.data.name + '</p>' +
                            '<p>' + 'Total Wins: ' + d.data.total + '</p>' +
                            '<p>' + 'Category Wins: ' + d.data.categories + '</p>' +
                            '<p>' + 'Ceremony Date: ' + d.data.ceremony + '</p>' +
                            '<p>' + 'Age at First Win: ' + d.data.age + '</p>'
                        ;
                    })
                    .attr("class", "textdiv"); //textdiv class allows css styling
                function transition(d) {
                    if (transitioning || !d) return;
                    transitioning = true;
                    var g2 = display(d),
                        t1 = g1.transition().duration(650),
                        t2 = g2.transition().duration(650);

                    // update the domain only after entering new elements
                    x.domain([d.x0, d.x1]);
                    y.domain([d.y0, d.y1]);

                    // enable anti-aliasing during the transition
                    svg.style("shape-rendering", null);

                    // draw child nodes on top of parent nodes
                    svg.selectAll(".depth").sort(function (a, b) {
                        return a.depth - b.depth;
                    });

                    // fade-in entering text
                    g2.selectAll("text").style("fill-opacity", 0);
                    g2.selectAll("foreignObject div").style("display", "none");

                    // transition to the new view
                    t1.selectAll("text").call(text).style("fill-opacity", 0);
                    t2.selectAll("text").call(text).style("fill-opacity", 1);
                    t1.selectAll("rect").call(rect);
                    t2.selectAll("rect").call(rect);

                    // foreign object
                    t1.selectAll(".textdiv").style("display", "none");
                    t1.selectAll(".foreignobj").call(foreign);
                    t2.selectAll(".textdiv").style("display", "block");
                    t2.selectAll(".foreignobj").call(foreign);

                    // remove the old node when the transition is finished
                    t1.on("end.remove", function(){
                        this.remove();
                        transitioning = false;
                    });
                }
                return g;
            }
            function text(text) {
                text.attr("x", function (d) {
                    return x(d.x) + 6;
                })
                    .attr("y", function (d) {
                        return y(d.y) + 6;
                    });
            }
            function rect(rect) {
                rect
                    .attr("x", function (d) {
                        return x(d.x0);
                    })
                    .attr("y", function (d) {
                        return y(d.y0);
                    })
                    .attr("width", function (d) {
                        return x(d.x1) - x(d.x0);
                    })
                    .attr("height", function (d) {
                        return y(d.y1) - y(d.y0);
                    })
                    .attr("fill", function (d) {
                        return '#cae7b9';//change
                    });
            }
            function foreign(foreign) {
                foreign
                    .attr("x", function (d) {
                        return x(d.x0);
                    })
                    .attr("y", function (d) {
                        return y(d.y0);
                    })
                    .attr("width", function (d) {
                        return x(d.x1) - x(d.x0);
                    })
                    .attr("height", function (d) {
                        return y(d.y1) - y(d.y0);
                    });
            }
            function name(d) {
                return breadcrumbs(d) +
                    (d.parent
                    ? " -  Click here to zoom out" //visible text at the top
                    : " - Click inside rectangle to zoom in"); //visible text at the top
            }
            function breadcrumbs(d) {
                var res = "";
                var sep = " > ";
                d.ancestors().reverse().forEach(function(i){
                    res += i.data.name + sep;
                });
                return res
                    .split(sep)
                    .filter(function(i){
                        return i!== "";
                    })
                    .join(sep);
            }
        })
