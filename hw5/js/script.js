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
        let tree = new Tree();
        tree.createTree(csvData);

        //Create Table Object and pass in reference to tree object (for hover linking)
        let table = new Table(data,tree);

        table.createTable();
        table.updateTable();
    });
});



// // // ********************** HACKER VERSION ***************************
// /**
//  * Loads in fifa-matches.csv file, aggregates the data into the correct format,
//  * then calls the appropriate functions to create and populate the table.
//  *
//  */
 d3.csv("data/fifa-matches.csv", function (error, matchesCSV) {

//     /**
//      * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
//      *
//      */
    console.log(matchesCSV);
    teamData = d3.nest()
                     .key(d => d.Team)
                     .rollup(function(leaves){
                        console.log(leaves.length);
                     })
                     .entries(matchesCSV);
     d3.csv("data/fifa-tree.csv", function (error, treeCSV) {

//     // ******* TODO: PART I *******
        //Create a unique "id" field for each game
        console.log(treeCSV);
        treeCSV.forEach(function (d, i) {
            d.id = d.Team + d.Opponent + i;
        });

        //Create Tree Object
        let tree = new Tree();
        tree.createTree(treeCSV);
        

     });

 });
// // ********************** END HACKER VERSION ***************************
