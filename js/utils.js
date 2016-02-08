  // function generateID()
  //             {
  //                 var d = new Date().getTime();
  //
  //                 var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c)
  //                 {
  //                     var r = (d + Math.random() * 16) % 16 | 0; // jshint ignore:line
  //                     d = Math.floor(d / 16); // jshint ignore:line
  //                     return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16); // jshint ignore:line
  //                 });
  //
  //                 return uuid;
  //             }

var _DEBUG_ = true;

function generateID()
{
    var d = new Date().getTime();
    var uuid = 'nxxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c)
    {
      var r = (d + Math.random() * 16) % 16 | 0; // jshint ignore:line
      d = Math.floor(d / 16); // jshint ignore:line
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16); // jshint ignore:line
    });
    return uuid;
}

/**
  *  The following method takes an array of objects and creates a new array containing the newly reformatted objects.
  *
  */

function reformatMap(array)
{
    return array.map(function(obj){
        var rObj = {};
        rObj[obj.nid] = obj.value;
        return rObj;
    });
}

function YList()
{

    this.replace = function replace(index, object) {
        if ( index < 0 || index >= this.length)
        {
            return false;
        }
        this[index] = object;
        return true;
    };

    this.contains = function contains(object) {
        for( var i=0; i<this.length; i++)
        {
            if ( this[i].equals(object) )
            {
                return this[i];
            }
        }
    }

    this.first = function first()
    {
        return this[0];
    }

    this.last = function last()
    {
        return this[this.length-1];
    }

    this.insert = function(index, object)
    {
        if ( index < 0 || index >= this.length)
        {
            return false;
        }
        this.splice(index, 0, object);
        return true;
    }

    this.pop_front = function pop_front()
    {
        var elt = this[0];
        this.splice(0, 1);
        return elt;
    }

    this.push_front = function push_front(object)
    {
        return this.insert(0, object);
    }
}

YList.prototype = Object.create(Array.prototype);
YList.prototype.constructor = YList();
