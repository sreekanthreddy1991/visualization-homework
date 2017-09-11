/** Class representing a Tree. */
class Tree {
	/**
	 * Creates a Tree Object
	 * parentNode, children, parentName,level,position
	 * @param {json[]} json - array of json object with name and parent fields
	 */
	constructor(json) {
		this.nodeList = [];
		var nodeObj;
		for(var i=0; i<json.length; i++) {
			nodeObj = json[i];
			let node = new Node(json[i].name, json[i].parent);
			this.nodeList.push(node);
		}
	}

	/**
	 * Function that builds a tree from a list of nodes with parent refs
	 */
	buildTree() {
		var rootNode;
		for (var i = 0; i < this.nodeList.length; i++){
			var currentNode = this.nodeList[i];
			if(currentNode.parentName === "root"){
				rootNode = currentNode;
			}
			for (var j = 0; j < this.nodeList.length;  j++) {
				if(currentNode.name === this.nodeList[j].parentName) {
					currentNode.addChild(this.nodeList[j]);
				}
				if(currentNode.parentName === this.nodeList[j].name){
					currentNode.parentNode = this.nodeList[j];
				}
			}
		}
		this.positionMap = {};
		this.assignLevel(rootNode, 0);
		this.positionMap[rootNode.level] = 0;
		this.assignPosition(rootNode, 0);

	//Assign Positions and Levels by making calls to assignPosition() and assignLevel()
	}

	/**
	 * Recursive function that assign positions to each node
	 */
	assignPosition(node, position) {
		node.position = position;
		for (var i = 0; i < node.children.length; i++) {
			if(this.positionMap.hasOwnProperty(node.children[i].level)){
				position = this.positionMap[node.children[i].level] + 1;
			} else {
				position = this.positionMap[node.level];
			}
			this.positionMap[node.children[i].level] = position;
			this.assignPosition(node.children[i], position);
		}
	}

	/**
	 * Recursive function that assign levels to each node
	 */
	assignLevel(node, level) {
		node.level = level;
		for (var i = 0; i < node.children.length; i++) {
			this.assignLevel(node.children[i], level+1);
		}
	}

	/**
	 * Function that renders the tree
	 */
	renderTree() {
		d3.select("body")
		  .append("svg")
		  .attr("width", 1200)
		  .attr("height", 1200);
		var svgElement = d3.select("svg");
		svgElement.selectAll("line").data(this.nodeList).enter()
				  .append("line")
				  .attr("x1", function(node, i){return (node.level+1)*100})
				  .attr("y1", function(node, i){return (node.position+1)*75})
				  .attr("x2", function(node, i){
				   	return node.parentNode ? (node.parentNode.level+1)*100 : (node.level+1)*100 ;
				  })
				  .attr("y2", function(node, i){
				   	return node.parentNode ? (node.parentNode.position+1)*75 : (node.position+1)*75 ;
				  });

		svgElement.selectAll("circle").data(this.nodeList).enter()
				  .append("circle")
				  .attr("cx", function(node, i){return (node.level+1)*100})
				  .attr("cy", function(node, i){return (node.position+1)*75})
				  .attr("r", 30);

		svgElement.selectAll("text").data(this.nodeList).enter()
				  .append("text")
				  .attr("class", "label")
				  .attr("dx", function(node, i){return (node.level+1)*100})
				  .attr("dy", function(node, i){return (node.position+1)*75})
				  .text(function(node, i){return node.name});
		
	}
		
}