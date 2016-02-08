
// sigma.parsers.gexf('../examples/data/g.gexf', {
//   container: 'graph-container'
// });

var s;

function generateGraph(inputId)
{
    // if there's already an instance than destroy it and recreate a new one
    if ( s != undefined )
    {
        s.kill();
    }
    var gexfString = $("#"+inputId).val();
    if ( gexfString )
    {
        var xml = document.createElement('div');
        xml.innerHTML = gexfString;

        sigma.parsers.gexf(xml, {
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


        s = sigma.instances(0);

        // Initialize the dragNodes plugin:
        var dragListener = sigma.plugins.dragNodes(s, s.renderers[0]);

        if ( s != undefined )
        {
            // extend sigma instance
            YSigma(s);
            for ( var i =0; i<s.graph.nodes().length; i++)
            {
                s.graph.nodes()[i].size = s.graph.nodes()[i].size == undefined ? 5: s.graph.nodes()[i].size;
                s.graph.nodes()[i].x = s.graph.nodes()[i].x == undefined ? Math.random()/2 : s.graph.nodes()[i].x;
                s.graph.nodes()[i].y = s.graph.nodes()[i].y == undefined ? Math.random()/2 : s.graph.nodes()[i].y;
            }
            s.refresh();
        }
        else {
            console.log("can't get sigma instance 0");
        }
    }
}


var xmlStr = '<gexf xmlns="http://www.gexf.net/1.2draft" version="1.2"><meta lastmodifieddate="2009-03-20"><creator>Gexf.net</creator><description>A hello world! file</description></meta><graph mode="static" defaultedgetype="directed"><nodes><node id="0" label="Hello" size="5" /><node id="1" label="Word" size="5"/></nodes><edges><edge id="0" source="0" target="1" /></edges></graph></gexf>'
