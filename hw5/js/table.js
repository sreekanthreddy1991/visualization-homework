/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData, treeObject) {

        //Maintain reference to the tree Object; 
        this.tree = treeObject; 

        // Create list of all elements that will populate the table
        // Initially, the tableElements will be identical to the teamData
        this.tableElements = teamData.slice(); // 

        ///** Store all match data for the 2014 Fifa cup */
        this.teamData = teamData;

        //Default values for the Table Headers
        this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

        /** To be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 70,
            "height": 20,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

        /** Set variables for commonly accessed data columns*/
        this.goalsMadeHeader = 'Goals Made';
        this.goalsConcededHeader = 'Goals Conceded';

        /** Setup the scales*/
        this.goalScale = null; 

        /** Used for games/wins/losses*/
        this.gameScale = null; 

        /**Color scales*/
        /**For aggregate columns  Use colors '#ece2f0', '#016450' for the range.*/
        this.aggregateColorScale = null; 

        /**For goal Column. Use colors '#cb181d', '#034e7b'  for the range.*/
        this.goalColorScale = null; 
    }


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
    createTable() {

        // ******* TODO: PART II *******

        //Update Scale Domains
        let maxGoalRange = 0;
        let maxGamesRange = 0;
        let goalsMadeText = this.goalsMadeHeader;
        let goalsConcededText = this.goalsConcededHeader;
        this.teamData.forEach(function(team){
            let maxGoals = team.value[goalsMadeText] > team.value[goalsConcededText] ? team.value[goalsMadeText] : team.value[goalsConcededText];
            if(maxGoals > maxGoalRange){
                maxGoalRange = maxGoals;
            }
            let maxGames = team.value["TotalGames"];
            if(maxGames > maxGamesRange){
                maxGamesRange = maxGames;
            }
        })
        this.goalScale = d3.scaleLinear()
                       .domain([0, maxGoalRange])
                       .range([this.cell.buffer, 2*this.cell.width]); 

        /** Used for games/wins/losses*/
        this.gameScale = d3.scaleLinear()
                       .domain([0, maxGamesRange])
                       .range([this.cell.buffer, this.cell.width-this.cell.buffer]);; 

        /**Color scales*/
        /**For aggregate columns  Use colors '#ece2f0', '#016450' for the range.*/
        this.aggregateColorScale = d3.scaleLinear()
                                     .domain([0, maxGamesRange])
                                     .range(["#ece2f0","#016450"]); 

        /**For goal Column. Use colors '#cb181d', '#034e7b'  for the range.*/
        this.goalColorScale = d3.scaleLinear()
                                .domain([0, maxGoalRange])
                                .range(["#cb181d","#034e7b"]);

        // Create the x axes for the goalScale.
        let xAxis = d3.axisBottom().scale(this.goalScale);

        //add GoalAxis to header of col 1.
        let xAxisElement = d3.select("#goalHeader")
                             .append("svg")
                             .style("height", this.cell.height)
                             .style("width", 2*(this.cell.width+this.cell.buffer))
                             .call(xAxis)
                             .attr("transform", "scale(1, -1)");
        xAxisElement.selectAll("text") 
                             .style("text-anchor", "end")
                             .attr("dx", "0.3em")
                             .attr("dy", "0.4em")
                             .attr("transform", "scale(1,-1) translate(0, -22)");

        // ******* TODO: PART V *******

        // Set sorting callback for clicking on headers

        // Clicking on headers should also trigger collapseList() and updateTable(). 

       
    }


    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable() {
        // ******* TODO: PART III *******
        //Create table rows
        let that = this;
        let dimentions = this.cell;
        let goalsMadeText = this.goalsMadeHeader;
        let goalsConcededText = this.goalsConcededHeader;
        let deltaGoalsText = "Delta Goals";
        let goalScale = this.goalScale;
        let gameScale = this.gameScale;
        let goalColorScale = this.goalColorScale;
        let aggregateColorScale = this.aggregateColorScale;
        let table = d3.select("#matchTable tbody");
        let tableRows = table.selectAll("tr").data(this.tableElements);
        let newTableRows = tableRows.enter()
                 .append("tr");
        tableRows.exit().remove();
        tableRows = tableRows.merge(newTableRows);

        //Append th elements for the Team Names
        let th = tableRows.selectAll("th").data(function(d, i){
            let result = [];
            result.push({name:d.key, type: d.value.type, index: i});
            return result;
        });
        let newTh = th.enter()
                 .append("th");
        th = newTh.merge(th);
        th.text(function(d){
                if(d.type === "game"){
                    return "x"+d.name;
                }
                return d.name;
                })
          .attr("class", function(d){
            return d.type === "game" ? "game" : "aggregate";
          }).on("click", function(d, i){
            that.updateList(d.index);
                 });

        //Append td elements for the remaining columns. 
        //Data for each cell is of the type: {'type':<'game' or 'aggregate'>, 'value':<[array of 1 or two elements]>}
        let tds = tableRows.selectAll("td").data(function(d){
            let result = [];
            result.push({type: d.value.type, vis: "goals", value: {made: parseInt(d.value[goalsMadeText]), conceded: parseInt(d.value[goalsConcededText]), delta: parseInt(d.value[goalsMadeText])-parseInt(d.value[goalsConcededText])}});
            result.push({type: d.value.type, vis: "text", value: d.value.Result.label});
            result.push({type: d.value.type, vis: "bar", value: parseInt(d.value.Wins)});
            result.push({type: d.value.type, vis: "bar", value: parseInt(d.value.Losses)});
            result.push({type: d.value.type, vis: "bar", value: parseInt(d.value.TotalGames)});
            console.log(result[0].value.delta);
            return result;
        });
        let newTds = tds.enter().append("td");
        tds = tds.merge(newTds);
        
        //Add scores as title property to appear on hover

        //Populate cells (do one type of cell at a time )
        let goalTds = tds.filter(function (d) {
            return d.vis == 'goals'
        });

        //let goalSvg = goalTds.selectAll("svg").data(d => d);
        let goalSvg = goalTds.selectAll("svg").data(function(d){
            return d3.select(this).data();
        });
        goalSvg = goalSvg.enter().append("svg").merge(goalSvg);


        goalSvg.style("height", this.cell.height)
               .style("width", 2*this.cell.width+this.cell.buffer);
        
        //Create diagrams in the goals column
        let goalRect = goalSvg.selectAll("rect").data(function(d){
            return d3.select(this).data();
        })
        goalRect.enter().append("rect").merge(goalRect).classed("goalBar", true)
               .attr("x", function(d){
                let val = d.value.made > d.value.conceded ? goalScale(d.value.conceded) : goalScale(d.value.made);;
                if(d.type==="game"){
                    return val;;
                }
                return val; 
               })
               .attr("y", function(d){
                if(d.type==="game"){
                    return 8;
                }
                return 5;
               })
               .attr("height", function(d){
                if(d.type==="game"){
                    return 4;
                }
                return 10;
               })
               .attr("width", function(d){
                if(d.value.delta === 0){
                    return 0;
                }
                let width = goalScale(Math.abs(d.value.delta))-that.cell.buffer;
                if(d.type==="game"){
                    return width-10;
                }
                return width;
               })
               .style("fill", function(d){
                return d.value.delta > 0 ? "blue" : "red";
               });
        let goalWinCircle = goalSvg.selectAll(".goalMade").data(function(d){
          return d3.select(this).data();  
        })
        goalWinCircle.enter().append("circle").merge(goalWinCircle)
               .attr("cx", function(d){
                return goalScale(d.value.made)-5;
               })
               .attr("cy", 10)
               .classed("goalCircle", true)
               .classed("goalMade", true)
               .style("fill", function(d){
                if(d.type==="game"){
                    return "none";
                }
                return "blue";
               })
               .style("stroke", function(d){
                return "blue";
               });
        let goalLostCircle = goalSvg.selectAll(".goalConceded").data(function(d){
          return d3.select(this).data();  
        })
        goalLostCircle.enter().append("circle").merge(goalLostCircle)
               .attr("cx", function(d){
                return goalScale(d.value.conceded)-5;
               })
               .attr("cy", 10)
               .classed("goalCircle", true)
               .classed("goalConceded", true)
               .style("fill", function(d){
                if(d.value.delta == 0){
                    //Set the color of all games that tied to light gray
                    return "grey";
                }
                if(d.type==="game"){
                    return "none";
                }
                return "red";
               })
               .style("stroke", function(d){
                if(d.value.delta == 0){
                    //Set the color of all games that tied to light gray
                    return "grey";
                }
                return "red";
               });


        let resultTds = tds.filter(function (d) {
            return d.vis == 'text'
        });

        let resultSvg = resultTds.selectAll("svg").data(function(d){
                                                            return d3.select(this).data();
                                                        });
        resultSvg = resultSvg.enter().append("svg").merge(resultSvg);
        resultSvg.style("height", this.cell.height)
                 .style("width", 2*this.cell.width);
        let resultText = resultSvg.selectAll("text").data(function(d){
                                                            return d3.select(this).data();
                                                        });
        resultText = resultText.enter().append("text").merge(resultText);
        resultText.attr("y", 15)
                  .text(d => d.value);

        let gamesTds = tds.filter(function (d) {
            return d.vis == 'bar'
        });

        let gamesSvg = gamesTds.selectAll("svg").data(function(d){
                                                            return d3.select(this).data();
                                                        });
        gamesSvg = gamesSvg.enter().append("svg").merge(gamesSvg);
        gamesSvg.style("height", this.cell.height)
               .style("width", this.cell.width)
               .attr("transform", "translate(-5,0)");
        
        let gamesGroup = gamesSvg.selectAll("g").data(function(d){
                                                            return d3.select(this).data();
                                                        });
        gamesGroup = gamesGroup.enter().append("g").merge(gamesGroup);
        let gamesRect = gamesGroup.selectAll("rect")
                                  .data(function(d){
                                    return d3.select(this).data();
                                  });
        gamesRect = gamesRect.enter().append("rect").merge(gamesRect);

        gamesRect.attr("x", 0)
               .attr("y", 5)
               .attr("height", 20)
               .attr("width", function(d){
                if(d.type === "game"){
                    return 0;
                }
                return gameScale(d.value);
               })
               .style("fill", function(d){
                return aggregateColorScale(d.value);
               });
        let gamesText = gamesGroup.selectAll("text")
                                  .data(function(d){
                                    return d3.select(this).data();
                                  });
        gamesText = gamesText.enter().append("text").merge(gamesText);

        gamesText
                .attr("x", function(d){
                if(d.type === "game"){
                    return;
                }
                return gameScale(d.value)-10;
               })
                .attr("y", 17)
                .text(d => d.type==="game"? "": d.value)
                .style("fill", "white");
    };

    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
    updateList(i) {
        // ******* TODO: PART IV *******
        let team = this.tableElements[i];
        let nextTeam = this.tableElements[i+1];
        if(nextTeam!==undefined && nextTeam.value.type === "game"){
            this.collapseList();
            return;
        }
        //Only update list for aggregate clicks, not game clicks
        if(team.type === "game"){
            return;
        }
        let teamData = this.tableElements.slice();
        let games = team.value.games;
        this.tableElements = [];
        Array.prototype.push.apply(this.tableElements, teamData.slice(0, i+1));
        Array.prototype.push.apply(this.tableElements, games);
        Array.prototype.push.apply(this.tableElements, teamData.slice(i+1));
        this.updateTable();


        
    }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {
        
        // ******* TODO: PART IV *******
        this.tableElements = this.teamData;
        this.updateTable();

    }


}
