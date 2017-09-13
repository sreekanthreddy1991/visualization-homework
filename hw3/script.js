/**
 * Makes the first bar chart appear as a staircase.
 *
 * Note: use only the DOM API, not D3!
 */
function staircase() {
    // ****** TODO: PART II ******
    let barChartA = document.getElementById("barChartA");
    let childNodes = barChartA.childNodes;
    let rectElements = [];
    let heightArray = [];
    let updatedChildNodes = {};
    let position = 0;
    for (var i in childNodes) {
        if(childNodes[i].nodeType === 1){
            rectElements.push(childNodes[i]);
            heightArray.push(childNodes[i].attributes.height.value);
            updatedChildNodes[position] = childNodes[i];
            position++;
        }
    }
    childNodes = updatedChildNodes;
    heightArray.sort(sortNumber);
    for (var i in childNodes) {
        if(childNodes[i].nodeType === 1){
            if(heightArray[i]!==undefined){
                childNodes[i].setAttribute("height", heightArray[i]);
            }
        }
    }   
}

function sortNumber(a, b) {
    return parseInt(a) - parseInt(b);
}

/**
 * Render the visualizations
 * @param error
 * @param data
 */
function update(error, data) {
    if (error !== null) {
        alert('Could not load the dataset!');
    } else {
        // D3 loads all CSV data as strings;
        // while Javascript is pretty smart
        // about interpreting strings as
        // numbers when you do things like
        // multiplication, it will still
        // treat them as strings where it makes
        // sense (e.g. adding strings will
        // concatenate them, not add the values
        // together, or comparing strings
        // will do string comparison, not
        // numeric comparison).

        // We need to explicitly convert values
        // to numbers so that comparisons work
        // when we call d3.max()

        for (let d of data) {
            d.a = +d.a;
            d.b = +d.b;
        }
    }

    // Set up the scales
    let aScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.a)])
        .range([0, 150]);
    let bScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.b)])
        .range([0, 150]);
    let iScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([0, 220]);


    // ****** TODO: PART III (you will also edit in PART V) ******

    // TODO: Select and update the 'a' bar chart bars
    let barChartA = d3.select("#barChartA");

    let barsA = barChartA.selectAll("rect").data(data);

    // handle the enter to add new bars for extra data
    let newBarsA = barsA.enter()
                        .append("rect")
                        .attr("x", function(d,i){
                            return iScale(i+1);
                        })
                        .attr("y", 0)
                        .attr("width", 20)
                        .attr("height", function(d,i){
                            return aScale(d.a);
                        })
                        .style("fill", "steelblue"); 

    // handle exit selection to remove extra bars, in case of random subset
    barsA.exit()
         .attr("opacity", 1)
         .transition()
         .duration(1000)
         .attr("opacity", 0)
         .remove();

    //Need to merge the new rectangles with the original rectangles
    barsA = newBarsA.merge(barsA);

    //Apply transitions to new selection containing all rectangles
    barsA.transition()
         .duration(1000)
         .attr("x", function(d,i){
            return iScale(i+1);
         })
         .attr("y", 0)
         .attr("width", 20)
         .attr("height", function(d,i){
            return aScale(d.a);
         });

    // TODO: Select and update the 'b' bar chart bars
    let barChartB = d3.select("#barChartB");

    let barsB = barChartB.selectAll("rect").data(data);

    // handle the enter to add new bars for extra data
    let newBarsB = barsB.enter()
                        .append("rect")
                        .attr("x", function(d,i){
                            return iScale(i+1);
                        })
                        .attr("y", 0)
                        .attr("width", 20)
                        .attr("height", function(d,i){
                            return aScale(d.b);
                        })
                        .style("fill", "steelblue"); 

    // handle exit selection to remove extra bars, in case of random subset
    barsB.exit()
         .attr("opacity", 1)
         .transition()
         .duration(1000)
         .attr("opacity", 0)
         .remove();

    //Need to merge the new rectangles with the original rectangles
    barsB = newBarsB.merge(barsB);

    //Apply transitions to new selection containing all rectangles
    barsB.transition()
         .duration(1000)
         .attr("x", function(d,i){
            return iScale(i+1);
         })
         .attr("y", 0)
         .attr("width", 20)
         .attr("height", function(d,i){
            return aScale(d.b);
         });
    

    // TODO: Select and update the 'a' line chart path using this line generator

    let aLineGenerator = d3.line()
        .x((d, i) => iScale(i))
        .y((d) => aScale(d.a));

    let lineA = d3.select("#lineChartA");
    lineA.select("path")
         .transition()
         .duration(1000)
         .attr("d", aLineGenerator(data));    

    // TODO: Select and update the 'b' line chart path (create your own generator)

    let bLineGenerator = d3.line()
        .x((d, i) => iScale(i))
        .y((d) => bScale(d.b));

    let lineB = d3.select("#lineChartB");
    lineB.select("path")
         .transition()
         .duration(1000)
         .attr("d", bLineGenerator(data));

    // TODO: Select and update the 'a' area chart path using this area generator
    let aAreaGenerator = d3.area()
        .x((d, i) => iScale(i))
        .y0(0)
        .y1(d => aScale(d.a));

    let areaA = d3.select("#areaChartA");
    areaA.select("path")
         .transition()
         .duration(1000)
         .attr("d", aAreaGenerator(data));  

    // TODO: Select and update the 'b' area chart path (create your own generator)

    let bAreaGenerator = d3.area()
        .x((d, i) => iScale(i))
        .y0(0)
        .y1(d => bScale(d.b));

    let areaB = d3.select("#areaChartB");
    areaB.select("path")
         .transition()
         .duration(1000)
         .attr("d", bAreaGenerator(data)); 

    // TODO: Select and update the scatterplot points
    let scatterplot = d3.select("#scatterplot");

    let circles = scatterplot.selectAll("circle").data(data);

    // handle the enter to add new circles for extra data
    let newCircles = circles.enter()
                        .append("circle")
                        .attr("cx", function(d,i){
                            return aScale(d.a+10);
                        })
                        .attr("cy", function(d,i){
                            return bScale(d.b+10);
                        })
                        .attr("r", 5)
                        .style("fill", "steelblue")
                        .on("click", function(d){
                            console.log(d.a, d.b);
                        })
                        .append("svg:title")
                        .text(function(d, i){return "["+d.a+","+d.b+"]"});; 

    // handle exit selection to remove extra circles, in case of random subset
    circles.exit()
         .attr("opacity", 1)
         .transition()
         .duration(1000)
         .attr("opacity", 0)
         .remove();

    //Need to merge the new circles with the original circles
    circles = newCircles.merge(circles);

    //Apply transitions to new selection containing all circles
    circles.transition()
         .duration(1000)
         .attr("cx", function(d,i){
            return aScale(d.a);
         })
         .attr("cy", function(d,i){
            return bScale(d.b);
         })
         .attr("r", 5);

    circles.on("click", function(d, i){
        let coords = d3.mouse(this);
        console.log(d.a +", "+ d.b);
    })

    // let titles = scatterplot.selectAll("title").data(data);
    // titles.enter().append("title").attr("x", function(d,i){
    //         return aScale(d.a);
    //      }).attr("y", function(d,i){
    //         return bScale(d.b);
    //      }).text(function(d, i){return "["+d.a+","+d.b+"]"});
        

    // ****** TODO: PART IV ******
    // add events on bars to change colors on mouse over
    var barCharts = document.getElementsByClassName("barChart");
    for (var i = 0; i < barCharts.length; i++) {
        barCharts[i].addEventListener('mouseover', mouseoverBars, false);
        barCharts[i].addEventListener('mouseout', mouseoutBars, false);
    }

    circles.on("mouseover", function(d, i){
        let coords = d3.mouse(this);
        circles.append("title").text(d.a + ", "+ d.b);
    });

    circles.on("mouseout", function(){
        circles.selectAll("title").remove();
    })

    barsA.on("mouseover", function(d, i){
        barsA.append("title").text(d.a);
    });

    barsA.on("mouseout", function(d, i){
        barsA.selectAll("title").remove();
    });

    barsB.on("mouseover", function(d, i){
        barsB.append("title").text(d.b);
    });

    barsB.on("mouseout", function(d, i){
        barsB.selectAll("title").remove();
    });

}

/**
 * Load the file indicated by the select menu
 */
function changeData() {
    let dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        randomSubset();
    }
    else {
        d3.csv('data/' + dataFile + '.csv', update);
    }
}

/**
 *   Load the file indicated by the select menu, and then slice out a random chunk before passing the data to update()
 */
function randomSubset() {
    let dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        d3.csv('data/' + dataFile + '.csv', function (error, data) {
            let subset = [];
            for (let d of data) {
                if (Math.random() > 0.5) {
                    subset.push(d);
                }
            }
            update(error, subset);
        });
    }
    else {
        changeData();
    }
}

var mouseoverBars = function(event) {
    event.target.style.fill = "green";
};

var mouseoutBars = function(event) {
    event.target.style.fill = "steelblue";
};
