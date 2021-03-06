var node1 = new Node(0,0,20,1);
var node2 = new Node(0,0,20,2);

node1.addNeighbor(node2);
console.log(node1.hasNeighbor(node2)); // true

node1.removeNeighbor(node2);
console.log(node1.hasNeighbor(node2)); // false













function RectGraph(rows, columns){

	Graph.call(this);

	// distances by which nodes are placed
	var xDist = 100/(rows + 1);
	var yDist = 100/(columns + 1);
	var dist = Math.min(xDist, yDist);
	var xStart = dist;
	var yStart = dist;
	var radius = dist/3;
	
	var count = 0;
	for(i=0; i<rows; i++){
		for(j=0; j<columns; j++){
			this.nodes.push(new Node(xStart + i*xDist, yStart + j*yDist, radius, count));
			count++;
		}
	}
	
	
	
	this.addNeighborsByDistance(dist + 1);
}
function Graph(){
	this.nodes = [];
	this.players = [];
	this.turnIndex = 0; // used to keep track of game
	this.splodeList = [];
	this.inProgress = false;
	
	this.start = function(){
		this.inProgress = true;
	};
	
	this.end = function(){
		this.inProgress = false;
	};
	
	//TEST
	this.addPlayer = function(newPlayer){
		var index = this.players.indexOf(newPlayer);
		console.log(index);
		if(index == -1){
			this.players.push(newPlayer);
		}
	};
	//TEST
	this.removePlayer = function(toRemove){
		var index = this.players.indexOf(toRemove);
		if(index > -1){
			this.players.splice(index, 1);
		}
	};
	
	/**
		Checks if the game has a winner yet
	**/
	this.getWinner = function(){
		var tempPlayer = this.nodes[0].player;
		if(tempPlayer == null)
			return -1; 
		
		for(var i=1; i<this.players.length; i++){
			var tempNode = this.nodes[i];
			if(tempNode.player != tempPlayer)
				return -1;
		}
		console.log("Player: " + tempPlayer);
		return this.players.indexOf(tempPlayer);
	};
	
	this.getNodeByID = function(id) {
		for(i=0;i<this.nodes.length;i++){
			var node = this.nodes[i];
			if(node.id==id) {
				return node;
			}
		}
	}
	

	
	this.makeMove = function(x, y){
		//console.log("" + x + y);
		// check nodes for intersection
		for(i=0; i< this.nodes.length; i++){
			var node = this.nodes[i];
			// node intersects
			//debugger;
			if(node.contains(x,y)){
					if(	node.player == this.players[this.turnIndex] ||
						node.player == null){
							node.dotCount++;
							node.player = this.players[this.turnIndex];
							this.splodeList.push(node);
							this.updateNode();
							this.turnIndex = (this.turnIndex + 1)%this.players.length;
					}
			}
				
		}
	};
	
	this.updateNode = function (){
		var node = this.splodeList.shift();
		//console.log("node: " + node);
		//console.log("neigh: " + node.neighbors);
		if(node.dotCount > node.neighbors.length){
			var neighInc = 0;
			
			while(node.dotCount > node.neighbors.length){
				node.dotCount = node.dotCount - node.neighbors.length;
				neighInc++;
			}
			
			console.log("start");
			
			console.log(node.neighbors.length);
			for(j=0; j<node.neighbors.length; j++){
				console.log(j);
				var neigh = this.getNodeByID(node.neighbors[j]);
				console.log(j);
				neigh.dotCount = neigh.dotCount + neighInc;
				neigh.player = node.player;
				this.splodeList.push(neigh);
			}
			
			console.log("end");
			console.log(this.getWinner());
			console.log("");
		}


	};
	
	/**
	 * Goes through a graph's nodes and connects any nodes within dist of each other
	 * note: distance is between  nodes' centers 
	 */
	this.addNeighborsByDistance = function(distance){
		// double loop through nodes
		for(i=0; i<this.nodes.length; i++){
			for(j=0; j<this.nodes.length; j++){
				if( j != i) {
					var node1 = this.nodes[i];
					var node2 = this.nodes[j];
					var dx = (this.nodes[i].x - this.nodes[j].x);
					var dy = (this.nodes[i].y - this.nodes[j].y);
					
					if(Math.sqrt(dx*dx + dy*dy) <= distance){
						this.nodes[i].addNeighbor(this.nodes[j]);
						//Console.log(this.nodes[i].x, + ", "  + this.nodes[i
					}
				}
			}
		}
	};
	

}


/** 
 * Nodes should be able to have a list of neighbors, check if a node is one of 
 * their neighbors, add a neighbor, and remove a neighbor. It should also
 * keep track of how many dots are currently in the Node as well as which 
 * User is occupying the Node.
 */
function Node(x,y,radius, id){
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.id = id;
	this.dotCount  = 0;
	this.neighbors = [];
	this.player = null;


	
	this.contains = function(x, y){
		var dx = this.x - x;
		var dy = this.y - y;
		if(Math.sqrt(dx*dx + dy*dy) < this.radius)
			return true;
		return false;
	}
	
	//TEST
	this.addNeighbor = function(node) {
		if(node!=null){
			if(!node.equals(this)){
				if(!this.hasNeighbor(node)) {
					this.neighbors.push(node.id);
				}
				if(!node.hasNeighbor(this)) {
					node.neighbors.push(this.id);
				}
			}
		}
	};
	//TEST
	this.removeNeighbor = function(node) {
		if(node!=null){
			if(this.hasNeighbor(node)) {
				this.neighbors.splice(this.neighbors.indexOf(node.id),1);
			}
			if(node.hasNeighbor(this)) {
				node.neighbors.splice(node.neighbors.indexOf(this.id),1);
			}
		}
	};
	//TEST
	this.hasNeighbor = function(node) {
		if(node!=null) {
			for(var i=0;i<this.neighbors.length;i++){
				if(this.neighbors[i] == node.id) {
					return true;
				}
			}
		}
		return false;
	};
	
	this.equals = function(node) {
		if(node!=null) {
			if(this.id==node.id) {
				return true;
			}
		}
		return false;
	};

	this.toString = function() {
		//document.write("("+this.x+","+this.y+") ");
	};
}

function Player(color, id){
	this.color = color;
	this.id = id;
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
