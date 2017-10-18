    /**
     * Loads in the table information from fifa-matches.json 
     */
d3.json('data/fifa-matches.json',function(error,data){

    /**
     * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
     *
     */
    d3.csv("data/fifa-tree.csv", function (error, csvData) {

        //Create a unique "id" field for each game
        csvData.forEach(function (d, i) {
            d.id = d.Team + d.Opponent + i;
        });

        //Create Tree Object
        // let tree = new Tree();
        // tree.createTree(csvData);

        // //Create Table Object and pass in reference to tree object (for hover linking)
        // let table = new Table(data,tree);

        // table.createTable();
        // table.updateTable();
    });
});



// // // ********************** HACKER VERSION ***************************
// /**
//  * Loads in fifa-matches.csv file, aggregates the data into the correct format,
//  * then calls the appropriate functions to create and populate the table.
//  *
//  */
 d3.csv("data/fifa-matches.csv", function (error, matchesCSV) {

    let rank = {
           "Winner": 7,
           "Runner-Up": 6,
           "Third Place": 5,
           "Fourth Place": 4,
           "Semi Finals": 3,
           "Quarter Finals": 2,
           "Round of Sixteen": 1,
           "Group": 0
       };

//     /**
//      * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
//      *
//      */
    let teamData = d3.nest()
                     .key(d => d.Team)
                     .rollup(function (leaves) {
                        let obj = {};
                        obj["Goals Made"] = d3.sum(leaves,function(l){
                                    return parseInt(l["Goals Made"]);
                                });
                        obj["Goals Conceded"] = d3.sum(leaves,function(l){
                                    return parseInt(l["Goals Conceded"]);
                                });
                        obj["Delta Goals"] = obj["Goals Made"] - obj["Goals Conceded"];
                        obj.Wins = d3.sum(leaves,function(l){
                                    return parseInt(l.Wins);
                                });
                        obj.Losses = d3.sum(leaves,function(l){
                                    return parseInt(l.Losses);
                                });
                        obj.TotalGames = leaves.length;
                        obj.Result = {"label": leaves[0].Result, "ranking":rank[leaves[0].Result]};
                        obj.type = "aggregate";
                        obj.games = d3.nest()
                                      .key(d => d.Opponent)
                                      .rollup(function(games){
                                        let leaf = games[0];
                                        let game = {};
                                        game["Goals Made"] = parseInt(leaf["Goals Made"]);
                                        game["Goals Conceded"] = parseInt(leaf["Goals Conceded"]);
                                        game["Delta Goals"] = game["Goals Made"] - game["Goals Conceded"]; 
                                        game.Wins = [];
                                        game.Losses = [];
                                        game.Opponent = leaf.Team;
                                        game.Result = {"label": leaf.Result, "ranking": rank[leaf.Result]};
                                        if(obj.Result.ranking < rank[leaf.Result]){
                                            obj.Result = game.Result;
                                        }
                                        game.type = "game";
                                        return game;
                                      })
                                      .entries(leaves);
                        return obj;
                     })
                     .entries(matchesCSV);
     d3.csv("data/fifa-tree.csv", function (error, treeCSV) {

//     // ******* TODO: PART I *******
        //Create a unique "id" field for each game
        treeCSV.forEach(function (d, i) {
            d.id = d.Team + d.Opponent + i;
        });

        //Create Tree Object
        let tree = new Tree();
        tree.createTree(treeCSV);

        //Create Table Object and pass in reference to tree object (for hover linking)
        let table = new Table(teamData,tree);

        table.createTable();
        table.updateTable();
        

     });

 });
// // ********************** END HACKER VERSION ***************************