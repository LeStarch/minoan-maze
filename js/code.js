FUNCTION=function(){return null;}

function evalCode()
{
	var text = "FUNCTION = function(cells) {"+document.getElementById("code-area").value+"}";
    eval(text);
}

function runCode(local)
{
    try
    {
        var tmp = FUNCTION(local);
        switch (tmp)
        {
            case "N":
            case "n":
    	        document.getElementById("errors").innerHTML = "";
                return Math.PI/2; 
            case "S":
            case "s":
                document.getElementById("errors").innerHTML = "";
                return 3*Math.PI/2;
            case "E":
            case "e":
                document.getElementById("errors").innerHTML = "";
                return 0;
            case "W":
            case "w":
                document.getElementById("errors").innerHTML = "";
                return Math.PI;
            default:
                document.getElementById("errors").innerHTML = "Must return: N, S, E, or W" + "<br />";
                break;
        }
        return null;
    }
    catch(e)
    {
        document.getElementById("errors").innerHTML = e.message + "<br />";
    }
    return null;
}
