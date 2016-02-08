/*
 *   Extend default sigma class
 */


function YSigma(obj)
{

    var self = obj;

    self.graph.getNodeById = function(nodeId) {
      for(var node of this.nodes())
      {
        if ( node.id == nodeId )
        {
          return node;
        }
      }
    };


    self.graph.getEdgeById = function(edgeId) {
      for(var edge of this.edges())
      {
        if ( edge.id == edgeId )
        {
          return edge;
        }
      }
    };

    self.graph.expand = function(node){
      var neighbours = new YList();
      for ( var edge of this.edges() )
      {
        if ( edge.source == node.id )
        {
          adjNode = this.getNodeById(edge.target).clone();
          // set the parent
          //adjNode.parent = node.id;
          adjNode.parent = node;
          // calcuate cost
          adjNode.cost = node.cost + edge.weight;
          neighbours.push(adjNode);
        }
      }
      return neighbours;
    };

    self.graph.outNeighbourEdges = function(node){
      // array of edges
      var neighbours = new YList();
      for ( var edge of this.edges() )
      {
        if ( edge.source == node.id )
        {
          neighbours.push(edge);
        }
      }
      return neighbours;
    };


    self.graph.testGoal =function(node){
      if ( node != undefined && this.getGoalState() != undefined )
      {
        return this.getGoalState().equals(node);
      }
    };

    /**
       * This method will get the edge that connects source node to target node,
       * the order of arguments matters, beacause the edge returned corresponds to the direction
       * indicated in the arguments.
       * For example, getEdgeOfNodes(nodeSource, nodeTarget) will not return the same edge as
       * getEdgeOfNodes(nodeTarget, nodeSource)
       *
       * @param  {Node} The source node.
       * @return {Node} The target node.
       */
    self.graph.getEdgeOfNodes = function(nodeSource, nodeTarget)
    {
      for ( var edge of this.edges() )
      {
        if ( edge.source == nodeSource.id && edge.target == nodeTarget.id )
        {
          return edge;
        }
      }
    };

    /**
      * Setters and getters
      */

    self.graph.setSLDToGoal = function(SLDMap)
    {
       this.sldToGoal = SLDMap;
    };


    self.graph.getSLDToGoal = function(SLDMap)
    {
       return this.sldToGoal;
    };


    self.graph.setGoalState = function(goal)
    {
        this.goal = goal;
        // emit signal
        self.dispatchEvent("goalStateChanged", goal != undefined ? goal.label: "N/A");
    };

    self.graph.getGoalState = function()
    {
       return this.goal;
    };

    self.graph.getInitialState = function()
    {
       return this.initialState;
    };

    self.graph.setInitialState = function(state)
    {
       this.initialState = state;
       // emit signal
       self.dispatchEvent("initialStateChanged", state != undefined ? state.label: "N/A");
    };

    self.graph.setExecutionTime = function(state)
    {
       this.initialState = state;
       // emit signal
       self.dispatchEvent("initialStateChanged", state != undefined ? state.label: "N/A");
    };



    self.graph.clearStates = function()
    {
        this.setInitialState(undefined);
        this.setGoalState(undefined);
    };

    /*=============================================================================*
     *                              UI and Events
     *
     *=============================================================================*/

     self.ui = {};

     // UI views id
     self.ui.initialStateView               = "initStateVal";
     self.ui.goalStateView                  = "goalStateVal";
     self.ui.execTimeView                   = "execTimeVal";
     self.ui.costView                       = "costVal";
     self.ui.currentSearchAlgorithmView     = "currentSearchAlgorithmName"
     self.ui.currentQueuingFunctionView     = "currentQueuingFunctionName";
     self.ui.currentEvaluationFunctionView  = "currentEvaluationFunctionName";


     self.ui.startNodeColor        = "#3498db"
     self.ui.goalNodeColor         = "#e74c3c";

     self.ui.defaultEdgeColor = "#666",
     self.ui.defaultNodeColor = "#666";


     self.ui.highLightNode = function(node, color)
     {
         // Unfortunately, coloring node will cause outneighbour edges to be colored as well
         // so we will force outneighbour edges to be recolored with their default colors
         self.graph.getNodeById(node.id).color = color;
         //restore outneighbour edges color
         outEdges = self.graph.outNeighbourEdges(node);
         for ( var i=0; i<outEdges.length; i++)
         {
             outEdges[i].color = defaultEdgeColor;
         }
         self.refresh();
     }

     self.ui.highLightEdge = function(edge, color)
     {
         self.graph.getEdgeById(edge.id).color = color;
         self.refresh();
     }

     /**
       *  This method will take a path, and highlight all nodes and edges contained in it.
       *  However, passing extremeties as false, will prevent highligthing extremeties ( Start and End nodes)
       *  to prevent overriding markers
       *  @param {Array} path
       *  @param {Color} color
       *  @param {boolean} extremeties
       */
     self.ui.highLightPath = function(path, color, extremeties)
     {
         var p = {};
         // if we dont want to highlight start and end of path
         if ( !extremeties )
         {
             // make a copy of array nodes of path
             p.nodes = path.nodes.slice();
             // remove end
             p.nodes.pop();
             // remove start
             p.nodes.splice(0, 1);
         }
         // else highlight all the whole path, so we wont modify the path
         else {
             p = path;
         }
         for ( node of p.nodes )
         {
             this.highLightNode(node, color);
         }
         for ( edge of path.edges )
         {
             this.highLightEdge(edge, color);
         }
     }



     self.ui.clearAllColors = function()
     {
         for ( node of self.graph.nodes() )
         {
             node.color = defaultNodeColor;
         }

         for ( edge of self.graph.edges() )
         {
             edge.color = defaultEdgeColor;
         }
         self.refresh();
     }

     /**
       *   this methode places a marker in a node
       */
     self.ui.placeMarker = function(node, color) {
         if ( node )
         {
             node.size += 3;
             this.highLightNode(node, color);
             self.refresh();
         }
     }

     self.ui.removeMarker = function(node)
     {
         if ( node )
         {
             node.size -= 3;
             this.highLightNode(node, self.ui.defaultNodeColor);
         }
     }

     /**
       *  Update a given view with a value
       *  @param {id} html id of container
       *  @param {HTML} content
       */
     self.ui.updateView = function(idContainer, val)
     {
         document.getElementById(idContainer).innerHTML = val;
     }

     self.ui.clearStates = function() {
         this.updateView(this.goalStateView, "N/A");
         this.updateView(this.initialStateView, "N/A");
         this.updateView(this.execTimeView, 0.0);
         this.updateView(this.costView, 0);
         this.removeMarker(self.graph.getInitialState());
         this.removeMarker(self.graph.getGoalState());
         self.graph.clearStates();
         self.refresh();
     }

     self.ui.clearAll = function()
     {
         this.clearStates();
         this.clearAllColors();
     }

     self.bind("doubleClickNode", function(event){
         var clickedNode = event.data.node;
         if ( !self.graph.getInitialState() )
         {
             self.graph.setInitialState(clickedNode);
             self.ui.placeMarker(clickedNode, self.ui.startNodeColor);
         }
         else if ( !self.graph.getGoalState() ) {
             self.graph.setGoalState(clickedNode);
             self.ui.placeMarker(clickedNode, self.ui.goalNodeColor);
         }
         else {
             console.log("Initial and Goal states are already set!");
         }
     });

     self.bind("initialStateChanged", function(event) {
         self.ui.updateView(self.ui.initialStateView, event.data);
     });

     self.bind("goalStateChanged", function(event) {
         self.ui.updateView(self.ui.goalStateView, event.data);
     });

     self.bind("execTimeChanged", function(event) {
         self.ui.updateView(self.ui.execTimeView, event.data);
     });

     self.bind("costChanged", function(event) {
         self.ui.updateView(self.ui.costView, event.data);
     });

     /*=============================================================================*
      *                              Algorithms
      *
      *=============================================================================*/

      self.algorithm = {}

      self.algorithm.currentSearchAlgorithmName = undefined;

      // All available search algorithms
      self.algorithm.searchs = [
          {
              id: 0,
              name: "Breadth First Search",
              funct: "breadthFirstSearch"
          },
          {
              id: 1,
              name: "Greedy Search",
              funct: "greedySearch"
          },
          {
              id: 2,
              name: "Uniform Cost Search",
              funct: "greedySearch"
          }

      ];

      self.algorithm.queuingFunctions = [
          {
              id: 0,
              name: "Enqueue at end",
              funct: "enqueueAtEnd"
          },
          {
              id: 1,
              name: "Enqueue at front",
              funct: "enqueueAtFront"
          },
          {
              id: 2,
              name: "Enqueue using evaluation function",
              funct:  "enqueueUsingEvaluationFunction"
          }
      ];

      self.algorithm.evaluationFunctions =[
          {
              id:  0,
              name: "Evaluate by cost",
              funct: "evaluateByCost"
          },
          {
              id:  1,
              name: "Heuristic Straight line distance (SLD)",
              funct: "heuristicSLD"
          }
      ];

      /**
        *  this function will set the current evalution function and it's name, by passing
        *  an object {name: "name of function", funct: function}
        *  @param {Object} and object containg the name of function and the function
        */

      self.graph.setEvaluationFunction = function(evalAlgoId) {
          var algo = findAlgorithm(self.algorithm.evaluationFunctions, evalAlgoId);
          this.evaluationFunction = eval(algo.funct);
          self.algorithm.evaluationFunctionName = algorithm;
          // emit signal
          self.dispatchEvent("evaluationFunctionChanged", algorithm.name)
      };

      /**
        *  this function will set the current queuing function and it's name, by passing
        *  an object {name: "name of function", funct: function}
        *  @param {Object} and object containg the name of function and the function
        */
      self.graph.setQueuingFunction = function(queAlgoId) {
          var algo = findAlgorithm(self.algorithm.queuingFunctions, queAlgoId);
          this.queuingFunction = eval(algo.funct);
          self.algorithm.queuingFunctionName = algo.name;
          // emit signal
          self.dispatchEvent("queuingFunctionChanged", algo.name)
      };

      self.graph.setSearchAlgorithm = function(searchalgoId) {
          var algo = findAlgorithm(self.algorithm.searchs, searchalgoId);
          // set graph search algprithm
          this.searchAlgorithm = eval(algo.funct);
          // set arlgoithm name
          self.algorithm.currentSearchAlgorithmName = algo.name;
          //emit signal
          self.dispatchEvent("searchAlgorithmChanged", algo.name);
          // set corresponding queuing function and evaluation function
          switch ( algo.id )
          {
              // Breadth First Search
              case 0:
                this.setQueuingFunction(0);
                break;
              // Greedy Search
              case 1:
                this.setQueuingFunction(2);
                this.setEvaluationFunction(1);
                break;
              // Uniform Cost Search
              case 2:
                this.setQueuingFunction(2);
                this.setEvaluationFunction(0);
              default:
                // code
          }
      }

      /**
        *   This function will look for an algorithm in an algorithm array by id
        *   and return it
        *   @param {Array} array of algorithm objects (example {id: 2, name: "A search Algorithm", funct: "searchFunc"}
        *   @param {Int} id of the algorithm
        *   @return {Object} an Algorithm
        */
      function findAlgorithm(algoArray, id)
      {
          for ( var i=0; i<algoArray.length; i++)
          {
              if (algoArray[i].id == id )
              {
                  return algoArray[i];
              }
          }
      }

      self.runSearch = function runSearch()
      {
          if ( self.graph.getInitialState() && self.graph.getGoalState() )
          {
              // initial variable to calcuate execution time
              var t0 = performance.now();
              // apply current search algorithm
              var goal = self.graph.searchAlgorithm(self.graph);
              var executionTime = performance.now() - t0;
              // if there is a solution, then show it
              if ( goal )
              {
                  var path = reconstructPath(goal);
                  self.ui.highLightPath(path, "red", false);
                  self.ui.updateView(self.ui.costView, goal.cost);
                  self.ui.updateView(self.ui.execTimeView, executionTime+" ms");
              }
              // No solution
              else {
                  alert("No possible solution!");
              }
          }
          else {
              alert("Please select start and end by double clicking on a node!");
          }
      }

      self.bind("evaluationFunctionChanged", function(event){
          self.ui.updateView(self.ui.currentEvaluationFunctionView, event.data);
      });

      self.bind("queuingFunctionChanged", function(event){
          self.ui.updateView(self.ui.currentQueuingFunctionView, event.data);
      });


      self.bind("searchAlgorithmChanged", function(event){
          self.ui.updateView(self.ui.currentSearchAlgorithmView, event.data);
      });


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
          graph.setEvaluationFunction(0);
          return bestFirstSearch(graph, evaluateByCost);
      }
      /*
      *  Breadth First Search
      */
      function breadthFirstSearch(graph)
      {
          graph.setQueuingFunction(0);
          return generalSearch(graph, enqueueAtEnd);
      }

      /**
        * greedySearch Method, will search for a goal using Straight Line Distance (SLD) heuristic
        */
      function greedySearch(graph)
      {
          graph.setEvaluationFunction(1);
          return bestFirstSearch(graph, heuristicSLD);
      }

      // init
      self.graph.setSearchAlgorithm(0);

      return self;
}
