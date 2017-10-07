/** Class implementing the map view. */
class Map {
    /**
     * Creates a Map Object
     */
    constructor(infoPanel) {
        this.infoPanel = infoPanel;
        this.projection = d3.geoConicConformal().scale(150).translate([400, 350]);

    }

    /**
     * Function that clears the map
     */
    clearMap() {

        // ******* TODO: PART V*******
        // Clear the map of any colors/markers; You can do this with inline styling or by
        // defining a class style in styles.css

        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for hosts/teams/winners, you can use
        // d3 selection and .classed to set these classes on and off here.
        d3.select("#map")
          .selectAll("path")
          .classed("host", false)
          .classed("gold", false)
          .classed("silver", false)
          .classed("team", false);
        d3.select("#points")
          .selectAll("circle")
          .remove();

    }

    /**
     * Update Map with info for a specific FIFA World Cup
     * @param wordcupData the data for one specific world cup
     */
    updateMap(worldcupData) {

        //Clear any previous selections;
        this.clearMap();

        // ******* TODO: PART V *******

        // Add a marker for the winner and runner up to the map.

        // Hint: remember we have a conveniently labeled class called .winner
        // as well as a .silver. These have styling attributes for the two
        // markers.


        // Select the host country and change it's color accordingly.
        let map = d3.select("#map");
        d3.select("#"+worldcupData.host_country_code)
          .classed("host", true);

        // Iterate through all participating teams and change their color as well.
        for(let i=0; i<worldcupData.teams_names.length; i++){
            // if(worldcupData.winner === worldcupData.teams_names[i]){
            //    d3.select("#"+worldcupData.teams_iso[i])
            //      .classed("gold", true);
            //     return;
            // }
            // if(worldcupData.runner_up === worldcupData.teams_names[i]){
            //    d3.select("#"+worldcupData.teams_iso[i])
            //      .classed("silver", true);
            //     return;
            // }
            d3.select("#"+worldcupData.teams_iso[i])
                 .classed("team", true);
        }

        // We strongly suggest using CSS classes to style the selected countries.


        // Add a marker for gold/silver medalists
        let projection = this.projection;
        let points = d3.select("#points");
        points.append("circle")
              .classed("gold", "true")
              .attr("r",10)
              .attr("transform", function(d,) {return "translate(" + projection(worldcupData.win_pos) + ")";});
        points.append("circle")
              .classed("silver", "true")
              .attr("r",10)
              .attr("transform", function(d,) {return "translate(" + projection(worldcupData.ru_pos) + ")";});
    }

    /**
     * Renders the actual map
     * @param the json data with the shape of all countries
     */
    drawMap(world) {

        //(note that projection is a class member
        // updateMap() will need it to add the winner/runner_up markers.)

        // ******* TODO: PART IV *******
        let infoSection = this.infoPanel;
        let geoPath = d3.geoPath().projection(this.projection);
        d3.select("#map")
          .selectAll("path")
          .data(topojson.feature(world, world.objects.countries).features)
          .enter()
          .append('path')
          .classed("countries", true)
          .attr("id", d => d.id)
          .attr("d", geoPath)
          .on("click", function(d){
            infoSection.listYears(d.id, barChart.allData);
        });

        var graticule = d3.geoGraticule();

        d3.select("#map").append("path")
        .datum(graticule)
        .attr("class", "grat")
        .attr("d", geoPath);

        // Draw the background (country outlines; hint: use #map)
        // Make sure and add gridlines to the map

        // Hint: assign an id to each country path to make it easier to select afterwards
        // we suggest you use the variable in the data element's .id field to set the id

        // Make sure and give your paths the appropriate class (see the .css selectors at
        // the top of the provided html file)

    }


}
