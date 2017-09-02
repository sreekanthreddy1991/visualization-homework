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
				if(currentNode.parentName === this.nodeList[j].name) {
					currentNode.parentNode = this.nodeList[j];
				}
				if(currentNode.name === this.nodeList[j].parentName) {
					currentNode.children.push(this.nodeList[j]);
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
				position = this.positionMap[node.children[i].level - 1];
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
		this.nodeList.forEach(function(node){
			var svgElement = d3.select("svg");
			for (var i = 0; i < node.children.length; i++) {
				svgElement.append("line")
					  .attr("x1", (node.level+1)*100)
					  .attr("y1", (node.position+1)*75)
					  .attr("x2", (node.children[i].level+1)*100)
					  .attr("y2", (node.children[i].position+1)*75) 
			}
			svgElement.append("circle")
					  .attr("cx", (node.level+1)*100)
					  .attr("cy", (node.position+1)*75)
					  .attr("r", 30)
			svgElement.append("text")
					  .attr("class", "label")
					  .attr("dx", (node.level+1)*100)
					  .attr("dy", (node.position+1)*75)
					  .text(node.name)	
		})
	}
		
}