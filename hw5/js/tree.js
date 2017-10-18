/** Class implementing the tree view. */
class Tree {
    /**
     * Creates a Tree Object
     */
    constructor() {
        
    }

    /**
     * Creates a node/edge structure and renders a tree layout based on the input data
     *
     * @param treeData an array of objects that contain parent/child information.
     */
    createTree(treeData) {

        // ******* TODO: PART VI *******
        this.treeData = treeData;

        //Create a tree and give it a size() of 800 by 300. 
        let treeMap = d3.tree()
                     .size([800, 30]);
        let margin = 70;

        //Create a root for the tree using d3.stratify(); 
        treeData.forEach(function(d) {
            d.name = d.id;
        });
        let treeJson = d3.stratify()
                         .id(function(d) { 
                            return d.id; 
                        })
                         .parentId(function(d) { 
                            if(treeData[d.ParentGame]===undefined){
                                return null;
                            }
                            return treeData[d.ParentGame].id;
                        })(treeData);
        

        let root = d3.hierarchy(treeJson, function(d) { return d.children; });

        let data = treeMap(root);

        
        //Add nodes and links to the tree. 
        let nodes = data.descendants(),
            links = data.descendants().slice(1);
        nodes.forEach(function(d){ d.y = d.depth * 180});
        let node = d3.select('#tree').selectAll('g')
                      .data(nodes, function(d) {
                        return d.id;
                    });

        let nodeEnter = node.enter()
                            .append('g')
                            .attr('class', function(d){
                                return d.data.data.Wins === "1" ? "winner" : "loser";
                            })
                            .classed('node', true);
        nodeEnter.append('circle')
                 .attr('r', 5);
        // Add labels for the nodes
        nodeEnter.append('text')
                 .attr("dy", ".35em")
                 .attr("x", function(d) {
                    return d.children || d._children ? -13 : 13;
                 })
                 .attr("text-anchor", function(d) {
                    return d.children || d._children ? "end" : "start";
                 })
                 .text(function(d) { 
                    return d.data.data.Team; 
                 })
                 .attr("class", function(d){
                    return d.data.data.Team+d.data.data.Opponent;
                 });

        // UPDATE
        node = nodeEnter.merge(node);
        node.transition()
            .attr("transform", function(d) { 
                let depth =   d.y/2+margin;
                let width = d.x;
                return "translate(" + depth + "," + width + ")";
            });
        node.select('circle.node')
            .attr('r', 10);

        // Update the links...
        let link = d3.select("#tree").selectAll('path.link')
                      .data(links, function(d) { return d.id; });

        // Enter any new links at the parent's previous position.
        let linkEnter = link.enter().insert('path', "g")
                            .attr("class", function(d){
                                return d.data.data.Team+d.data.data.Opponent;
                            })
                            .classed("link", true);

        // UPDATE
        let linkUpdate = linkEnter.merge(link);

        // Transition back to the parent element position
        linkUpdate.transition()
                  .attr('d', function(d){ return diagonal(d, d.parent) });


        function diagonal(s, d) {

            let path = `M ${s.y/2+margin} ${s.x}
            C ${(s.y/2+margin + d.y/2+margin) / 2} ${s.x},
              ${(s.y/2+margin + d.y/2+margin) / 2} ${d.x},
              ${d.y/2+margin} ${d.x}`

            return path;
        }
       
    };

    /**
     * Updates the highlighting in the tree based on the selected team.
     * Highlights the appropriate team nodes and labels.
     *
     * @param row a string specifying which team was selected in the table.
     */
    updateTree(row) {
        // ******* TODO: PART VII *******
        this.clearTree();
        let team = row.key;
        let opponent = row.value.Opponent;
        let self = this;
        if(row.value.type === "game"){
            self.highlLightLinkWithClass(team+opponent);
            self.highlLightLinkWithClass(opponent+team);
            self.highLightLabelWithClass(team+opponent);
            self.highLightLabelWithClass(opponent+team);
        } else {
            this.treeData.forEach(function(game){
                if(game.Team === team){
                    if(game.Wins === "1"){
                        self.highlLightLinkWithClass(team+game.Opponent);
                    }
                    self.highLightLabelWithClass(team+game.Opponent);
                }
            })
        }
    
    }

    /**
     * Removes all highlighting from the tree.
     */
    clearTree() {
        // ******* TODO: PART VII *******

        // You only need two lines of code for this! No loops! 
        d3.selectAll(".link").classed("selected", false);
        d3.selectAll(".node text").classed("selectedLabel", false);
    }

    highlLightLinkWithClass(identifier){
        d3.selectAll("path."+identifier).classed("selected", true);
    }
    highLightLabelWithClass(identifier){
        d3.select(".node text."+identifier).classed("selectedLabel", true);
    }
}
