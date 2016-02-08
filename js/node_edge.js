/*
   This file requires utils.js
*/


function YNode(id, label, size)
{
  this.id = id == undefined ? generateID() : id;
  this.label = label;
  this.x = Math.random()/2;
  this.y = Math.random()/2;
  this.size = size;
  this.parent = undefined;
  this.cost = 0;
  this.depth = 0;

  // operator==() overload
  this.equals = function(node) {
    return this.id == node.id;
  }

  this.clone = function() {
      cloneNode = new YNode(this.label);
      cloneNode.id = this.id;
      cloneNode.x = this.x;
      cloneNode.y = this.y;
      cloneNode.size = this.size;
      cloneNode.cost = this.cost;
      cloneNode.depth = this.depth;
      return cloneNode;
  }
}

/**
  * This static function will take a node instance which is not fully initialized
  * and initialize it by setting it's size, x and y
  */
YNode.prototype.prepareNode = function(nodeIns, size)
{
    nodeIns.size    = size;
    nodeIns.x       = Math.random()/2;
    nodeIns.y       = Math.random()/2;
}




/******************* YEdge class *************************/

// construct a connected edge
function YEdge(id, source, target, weight)
{
  this.id = id == undefined ? generateID() : id;
  this.source = source;
  this.target = target;
  if ( typeof(weight) != "number" )
  {
     weight = parseInt(weight);
  }
  this.weight = weight || 1;
  this.type = 'arrow';
  this.label = this.weight.toString();
  this.size = 6;
}
