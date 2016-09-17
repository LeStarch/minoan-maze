FUNCTION=null;
//function(){};

function codeHarvester()
{
    var text = "FUNCTION = function(cell) {"+document.getElementById("code-area").value+"}";
    try
    {
        eval(text);
        var tmp = FUNCTION();
        document.getElementById("errors").innerHTML = "";
        return tmp;
    }
    catch(e)
    {
        document.getElementById("errors").innerHTML = e.message + "<br />";
    }
    return null;
}
