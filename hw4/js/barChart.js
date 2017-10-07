/** Class implementing the bar chart view. */
class BarChart {

    /**
     * Create a bar chart instance and pass the other views in.
     * @param worldMap
     * @param infoPanel
     * @param allData
     */
    constructor(worldMap, infoPanel, allData) {
        this.worldMap = worldMap;
        this.infoPanel = infoPanel;
        this.allData = allData;
    }

    /**
     * Render and update the bar chart based on the selection of the data type in the drop-down box
     */
    updateBarChart(selectedDimension) {



        // ******* TODO: PART I *******


        // Create the x and y scales; make
        // sure to leave room for the axes
        let height = 400;
        let width = 500;
        let padding = 55;
        let data = this.allData;
        let map = this.worldMap;
        let infoSection = this.infoPanel;
        let minYear = d3.min(this.allData, d => parseInt(d.YEAR));
        let maxYear = d3.max(this.allData, d => parseInt(d.YEAR));
        let xScale = d3.scaleLinear()
                       .domain([0, this.allData.length-1])
                       .range([10, width-padding-10]);

        let yScaleKey = selectedDimension;
        let yMax = d3.max(this.allData, d => parseInt(d[yScaleKey]));
        let yMin = d3.min(this.allData, d => parseInt(d[yScaleKey]));
        let yScale = d3.scaleLinear()
                       .domain([0, yMax])
                       .range([height-padding, 0]);

        // Create colorScale

        let colorScale = d3.scaleLinear()
                // notice the three interpolation points
                .domain([yMin, yMax])
                // each color matches to an interpolation point
                .range(["steelblue","#000080"]);

        // Create the axes (hint: use #xAxis and #yAxis)
        let xAxis = d3.axisBottom(xScale).tickFormat(function(d){
            return data[data.length-1-d].YEAR;
        }).ticks(20);
        d3.select("#xAxis")
          .attr("transform", "translate("+padding+"," + (height-padding) + ")")
          .call(xAxis)
          .selectAll("text")
          .attr("dx", "-2em")
        .attr("dy", "-.3em")
        .attr("transform", "rotate(-90)");

        d3.select("#xAxis")
        .append("path")
        .attr("d", "M 0 0 L 10.5 0");

        d3.select("#xAxis")
        .append("path")
        .attr("d", "M 435.5 0 L 455 0");

        let yAxis = d3.axisLeft(yScale);
        d3.select("#yAxis")
          .attr("transform", "translate("+53+"," + 0 + ")")
          .transition()
          .duration(2000)
          .call(yAxis);

        // Create the bars (hint: use #bars)
        let bars = d3.select("#bars")
                     .attr("transform", "translate("+45+"," + 0 + ")")
                     .selectAll("rect")
                     .data(this.allData);

        let newBars = bars.enter().append("rect")
         .attr("x", function(d,i){
            return xScale(data.length-1-i);
         })
         .attr("y", function(d,i){
            return yScale(d[yScaleKey]);
         })
         .attr("width", 20)
         .attr("height", function(d,i){
            return height-padding-yScale(d[yScaleKey]);
         }).style("fill", function(d, i){
            return colorScale(d[yScaleKey]);
         });

         bars = newBars.merge(bars);

         bars.transition()
             .duration(2000)
             .attr("x", function(d,i){
                return xScale(data.length-1-i);
             })
             .attr("y", function(d,i){
                return yScale(d[yScaleKey]);
             })
             .attr("width", 20)
             .attr("height", function(d,i){
                return height-padding-yScale(d[yScaleKey]);
             })
             .style("fill", function(d){
                return colorScale(d[yScaleKey]);
             });




        // ******* TODO: PART II *******

        // Implement how the bars respond to click events
        // Color the selected bar to indicate is has been selected.
        // Make sure only the selected bar has this new color.
        bars.on("click", function(d, i){
            bars.classed("selected", false);
            d3.select(this).classed("selected", true);
            map.updateMap(d);
            infoSection.updateInfo(d);
        });

        // Call the necessary update functions for when a user clicks on a bar.
        // Note: think about what you want to update when a different bar is selected.


    }

    /**
     *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
     *
     *  There are 4 attributes that can be selected:
     *  goals, matches, attendance and teams.
     */
    chooseData() {
        // ******* TODO: PART I *******
        //Changed the selected data when a user selects a different
        // menu item from the drop down.

    }
}