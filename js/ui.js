
defaultEdgeColor = "#666",
defaultNodeColor = "#666";

function highLightNode(sigmaObject, node, color)
{
    if ( sigmaObject instanceof sigma )
    {
        // Unfortunately, coloring node will cause outneighbour edges to be colored as well
        // so we will force outneighbour edges to be recolored with their default colors
        sigmaObject.graph.getNodeById(node.id).color = color;
        //restore outneighbour edges color
        outEdges = sigmaObject.graph.outNeighbourEdges(node);
        for ( var i=0; i<outEdges.length; i++)
        {
            outEdges[i].color = defaultEdgeColor;
        }
        sigmaObject.refresh();
    }
    else {
        console.log("only sigma object are allowed");
    }
}

function highLightEdge(sigmaObject, edge, color)
{
    if ( sigmaObject instanceof sigma )
    {
        sigmaObject.graph.getEdgeById(edge.id).color = color;
        sigmaObject.refresh();
    }
    else {
        console.log("only sigma object are allowed");
    }
}

function highLightPath(sigmaObject, path, color)
{
    if ( sigmaObject instanceof sigma )
    {
        for ( node of path.nodes)
        {
            highLightNode(sigmaObject, node, color);
        }
        for ( edge of path.edges )
        {
            highLightEdge(sigmaObject, edge, color);
        }
    }
    else {
        console.log("only sigma object are allowed");
    }
}

function clearAllColors(sigmaObject)
{
    if ( sigmaObject instanceof sigma )
    {
        for ( node of sigmaObject.graph.nodes() )
        {
            node.color = defaultNodeColor;
        }

        for ( edge of sigmaObject.graph.edges() )
        {
            edge.color = defaultEdgeColor;
        }
        sigmaObject.refresh();
    }
    else {
        console.log("only sigma object are allowed");
    }
}

function placeMarker(sigmaObject, node, color)
{
    if ( node )
    {
        node.size += 3;
        highLightNode(sigmaObject, node, color);
        sigmaObject.refresh();
    }
}

function removeMarker(sigmaObject, node)
{
    if ( node )
    {
        node.size -= 3;
        highLightNode(sigmaObject, node, defaultNodeColor);
    }
}

function updateValue(idContainer, val)
{
    document.getElementById(idContainer).innerHTML = val;
}

function clearStates(sigmaObject)
{
    updateValue("goalStateVal", "N/A");
    updateValue("initStateVal", "N/A");
    removeMarker(sigmaObject, sigmaObject.graph.getInitialState());
    removeMarker(sigmaObject, sigmaObject.graph.getGoalState());
    sigmaObject.graph.clearStates();
    sigmaObject.refresh();
}

function clearAll(sigmaObject)
{
    clearStates(sigmaObject);
    clearAllColors(sigmaObject);
    updateValue("costVal", 0);
}
