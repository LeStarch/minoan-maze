/**
 * Request AJAX response in JSON
 */
function ajaxJSON(url,callback)
{
    var xhttp = new XMLHttpRequest();
    //What to do on a response
    xhttp.onreadystatechange = 
        /**
         * This function handles a response.  If successful,
         * this calls the callback with the data object harvested
         * from the JSON response. Otherwise, an error is thrown.
         */
        function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                var obj = JSON.parse(this.responseText);
                callback(obj);
            }
            else if (this.readyState == 4)
            {
                throw "[ERROR] Problem requesting AJAX resource: "+this.status;
            }
        };
    xhttp.open("GET", url, true);
    xhttp.send();
} 
