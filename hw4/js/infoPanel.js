/** Class implementing the infoPanel view. */
class InfoPanel {
    /**
     * Creates a infoPanel Object
     */
    constructor() {
    }

    /**
     * Update the info panel to show info about the currently selected world cup
     * @param oneWorldCup the currently selected world cup
     */
    updateInfo(oneWorldCup) {

        // ******* TODO: PART III *******

        // Update the text elements in the infoBox to reflect:
        // World Cup Title, host, winner, runner_up, and all participating teams that year

        // Hint: For the list of teams, you can create an list element for each team.
        // Hint: Select the appropriate ids to update the text content.
        d3.select("#edition").text(oneWorldCup.EDITION);
        d3.select("#host").text(oneWorldCup.host);
        d3.select("#winner").text(oneWorldCup.winner);
        d3.select("#silver").text(oneWorldCup.runner_up);

        let ul = d3.select("#teams");
        let li = ul.selectAll('li').data(oneWorldCup.teams_names);
        
        let newList = li.enter()
          .append('li')
          .text(d => d);

        li.exit().remove();

        li = newList.merge(li);
        li.transition()
          .duration(2000)
          .text(d => d);
        //Set Labels

    }

    updateCountryInfo(selectedCountry, years){
        d3.select("#selected-country").text(selectedCountry);
        console.log(selectedCountry);
        console.log(years);
        let ul = d3.select("#years");
        let li = ul.selectAll('li').data(years);
        
        let newList = li.enter()
          .append('li')
          .text(d => d);

        li.exit().remove();

        li = newList.merge(li);
        li.transition()
          .duration(2000)
          .text(d => d);
    }

    listYears(countryId, fifaData){
        let years = [];
        let selectedCountry = "";
        for (var i = 0; i < fifaData.length; i++) {
            for (var j = 0; j < fifaData[i].teams_iso.length; j++) {
                if(countryId === fifaData[i].teams_iso[j]){
                    years.push(fifaData[i].year);
                    selectedCountry = fifaData[i].teams_iso[j];
                    break;
                }
            }
        }
        d3.select("#country-details").style("display", "block");
        this.updateCountryInfo(selectedCountry, years);
    }

}