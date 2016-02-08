
/**
   * This method allows to rebuild a path, given the final node, it will iterate over parents
   * until it gets to starting state. Finally it will return the path
   * Basically, it will return the path to the goal.
   *
   * @param  {Node} the final node (goal).
   * @return {Array} the corresponding path to goal.
   */
function reconstructPath(node)
{
    // an object containing array of nodes and array of edges, the reversed path
    var reversedPath = {
        nodes: [],
        edges: []
    };
    // The final real path
    var orderedPath = {
        nodes: [],
        edges: []
    }
    var parent={}, edge={};
    if ( node )
    {
        do {
            reversedPath.nodes.push(node);
            parent = node.parent;
            if ( parent )
            {
              edge =  s.graph.getEdgeOfNodes(parent, node);
              reversedPath.edges.push(edge);
            }
            node = parent;
        } while ( node != undefined );
        // sort the path using a LIFO
        orderedPath.nodes.push(reversedPath.nodes.pop());
        orderedPath.edges.push(reversedPath.edges.pop());
        while ( !reversedPath.nodes.length == 0 )
        {
            orderedPath.nodes.push(reversedPath.nodes.pop());
        }

        while ( !reversedPath.edges.length == 0 )
        {
            orderedPath.edges.push(reversedPath.edges.pop());
        }

    }
    return orderedPath;
}

/*********************** Queuing Functions ******************************/
function enqueueAtEnd(graph, list, node)
{
  list.push(node);
}


function enqueueUsingEvaluationFunction(graph, list, node)
{
    if ( list && graph )
    {
        if ( list.length == 0)
        {
            list.push(node);
        }
        else
        {
            // check if element already exist
            if ( itNode = list.contains(node) )
            {
                // if element already exist with highter evaluation, then replace it whith the new one
                if ( graph.evaluationFunction(graph, itNode) > graph.evaluationFunction(graph, node) )
                {
                    list[list.indexOf(itNode)] = node;
                    return;
                }
            }
            // else insert in order
            if ( graph.evaluationFunction(graph, list.first()) > graph.evaluationFunction(graph, node) )
            {
                list.push_front(node);
                return;
            }
            for ( var index=0; index < list.length; index++ )
            {
                if ( graph.evaluationFunction(graph, list[index]) < graph.evaluationFunction(graph, node) )
                {
                        // if list has next
                        if ( index+1 < list.length )
                        {
                            // if next element is bigger, then insert before
                            if ( graph.evaluationFunction(graph, list[index+1]) > graph.evaluationFunction(graph, node) )
                            {
                                list.insert(index+1, node);
                                return;
                            }
                        }
                        else
                        {
                            list.push(node);
                            return;
                        }
                }
            }
        }
    }
}
/*********************** End of Queuing Functions ***********************/

/*********************** Evaluation Functions ******************************/

function evaluateByCost(graph, node)
{
    return node.cost;
}

function heuristicSLD(graph, node)
{
    if ( graph && graph.getSLDToGoal )
    {
        var n = graph.getSLDToGoal()[node.id];
        return graph.getSLDToGoal()[node.id];
    }
}

/*********************** End Evaluation  Functions ***********************/


/*********************** Search Algorithms ***************************/


/* The general Search Algorithm, based on a queuingFunction
*  returns a goal node
*/
function generalSearch(graph, queuingFunction)
{
  // The frontier initially contains the initial state
  var frontier = new YList();
  frontier.push(graph.getInitialState());
   // Initialize an empty list to store visited nodes
   var visited = new YList();
   // Loop until no element is left in the frontier or the goal has been reached
   while ( frontier.length != 0 )
   {
     console.log("Frontier : ");
     console.log(frontier);
     // take a node from the frontier
     var extractedNode = frontier.pop_front();
     // test if it's a goal state
     if ( graph.testGoal(extractedNode) )
     {
       return extractedNode;
     }

     if ( !visited.contains(extractedNode) )
     {
       // expand the extracted node and enqueue the result in the frontier based on the queuing function
       var expandedNodes = graph.expand(extractedNode);
       console.log("expanded nodes : ");
       console.log(expandedNodes);
       for ( var i=0; i< expandedNodes.length; i++)
       {
          queuingFunction(graph, frontier, expandedNodes[i]);
       }
       // mark as visited
       visited.push(extractedNode);
     }
   }
}

function bestFirstSearch(graph, evaluationFunction)
{
    graph.evaluationFunction = evaluationFunction;
    return generalSearch(graph, enqueueUsingEvaluationFunction);
}

function uniformCostSearch(graph)
{
    return bestFirstSearch(graph, evaluateByCost);
}
/*
*  Breadth First Search
*/
function breadthFirstSearch(graph)
{
  return generalSearch(graph, enqueueAtEnd);
}

/**
  * greedySearch Method, will search for a goal using Straight Line Distance (SLD) heuristic
  */
function greedySearch(graph)
{
    return bestFirstSearch(graph, heuristicSLD);
}
