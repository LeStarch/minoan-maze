FUNCTION=function(){return null;}

function evalCode()
{
	var text = "FUNCTION = function(cell) {"+document.getElementById("code-area").value+"}";
    eval(text);
}

function runCode(local)
{
    try
    {
        var tmp = FUNCTION(local);
    	document.getElementById("errors").innerHTML = "";
        return tmp;
    }
    catch(e)
    {
        document.getElementById("errors").innerHTML = e.message + "<br />";
    }
    return null;
}
