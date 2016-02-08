var i, s, N = 10, E = 50;
var g = {
      nodes: [],
      edges: []
  },


// Generate a random graph:
/*
for (i = 0; i < N; i++)
  g.nodes.push({
    id: 'n' + i,
    label: 'Node ' + i,
    x: Math.random(),
    y: Math.random(),
    size: Math.random(),
    color: '#666'
  });*/
/*
for (i = 0; i < E; i++)
  g.edges.push({
    id: 'e' + i,
    label: 'Edge ' + i,
    source: 'n' + (Math.random() * N | 0),
    target: 'n' + (Math.random() * N | 0),
    size: 3,
    color: '#ccc',
    type: 'curve',
    head: 'arrow'

  });*/

nS = new YNode(undefined, 'S', 6);
nA = new YNode(undefined, 'A', 6);
nG = new YNode(undefined, 'G', 6);
nC = new YNode(undefined, 'C', 6);
nB = new YNode(undefined, 'B', 6);
nD = new YNode(undefined, 'D', 6);

nSA = new YEdge(nS.id, nA.id, 1);
nSG = new YEdge(nS.id, nG.id, 12);
nAB = new YEdge(nA.id, nB.id, 3);
nAC = new YEdge(nA.id, nC.id, 1);
nBD = new YEdge(nB.id, nD.id, 3);
nCG = new YEdge(nC.id, nG.id, 2);
nCD = new YEdge(nC.id, nD.id, 1);
nDG = new YEdge(nD.id, nG.id, 3);

g.nodes.push(nS);
g.nodes.push(nA);
g.nodes.push(nG);
g.nodes.push(nC);
g.nodes.push(nB);
g.nodes.push(nD);

g.edges.push(nSA);
g.edges.push(nSG);
g.edges.push(nAB);
g.edges.push(nAC);
g.edges.push(nBD);
g.edges.push(nCG);
g.edges.push(nCD);
g.edges.push(nDG);



// Instantiate sigma:
s = new sigma({
  graph: g,
  renderer: {
    container: document.getElementById('graph-container'),
    type: 'canvas'
  },
  settings: {
    //edgeLabelSize: 'proportional',
    defaultNodeColor : defaultNodeColor,
    defaultEdgeColor : defaultEdgeColor,
    minEdgeSize: 0.5,
    maxEdgeSize: 2,
    enableEdgeHovering: true,
    edgeHoverColor: 'blue',
    defaultEdgeHoverColor: '#000',
    edgeHoverSizeRatio: 1,
    edgeHoverExtremities: true,
  }
});

YSigma(s);



// Initialize the dragNodes plugin:
var dragListener = sigma.plugins.dragNodes(s, s.renderers[0]);

//initEventHandlers(s);

// var goal = breadthFirstSearch(s.graph);

function logPath(node)
{
  var nodes = [];
    if ( node )
    {
        do {
            nodes.push(node);
            //node =  s.graph.getNodeById(node.parent);
            node =  node.parent;
        } while ( node != undefined );
        var path = "";
        path += nodes.pop().label;
        while ( !nodes.length == 0 )
        {
            path += " -> ";
            path += nodes.pop().label;
        }
        console.log(path);
    }
}

function insertSLDToGoal(graph, object)
{
    graph.sldToGoal.push(object);
}

function runSearch()
{
    if ( s.graph.getInitialState() && s.graph.getGoalState() )
    {
        // initial variable to calcuate execution time
        var t0 = performance.now();
        var goal = breadthFirstSearch(s.graph);
        var executionTime = performance.now() - t0;
        // if there is a solution, then show it
        if ( goal )
        {
            var path = reconstructPath(goal);
            s.ui.highLightPath(path, "red", false);
            //updateValue("costVal", goal.cost);
            //updateValue("execTimeVal", executionTime+" ms");
        }
        // No solution
        else {
            alert("No possible solution!");
        }
    }
}

// logPath(goal);
// var path = reconstructPath(goal);
// goal = uniformCostSearch(s.graph);
// path = reconstructPath(goal);
// highLightPath(s, path, "red");

// prologue to use greedySearch
// nid: SLDToGoal
var SLDmap = {};
SLDmap[nS.id] = 110;
SLDmap[nA.id] = 350;
SLDmap[nB.id] = 220;
SLDmap[nD.id] = 50;
SLDmap[nC.id] = 200;
SLDmap[nG.id] = 0;
s.graph.setSLDToGoal(SLDmap);
