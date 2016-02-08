
function Debugger(container)
{
    this.container = container;
    this.initialStateContainer = "initStateVal";
    this.goalStateContainer = "goalStateVal";

    this.log = function(idContainer, value) {
        document.getElementById(idContainer).innerHTML = value;
    }

}

var _debugger = new Debugger();
