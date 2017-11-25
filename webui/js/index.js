/**
 * Entry point and script start for the
 *
 */


var MAP_URL = "http://127.0.0.1:5000/maze";
var CHARS_URL = "http://127.0.0.1:5000/characters";
var GRID = null;
/**
 * Renderer the result of the map call
 * @param map: map to render
 */
function mapUpdater(map)
{
    GRID.setMaze(map);
}
/**
 * Renderer the result of the character call
 * @param characters: characters to render
 */
function charsUpdater(characters)
{
    GRID.setCharacters(characters);
}
/**
 * Request updates from server
 */
function requestUpdate()
{
    ajaxJSON(MAP_URL, mapUpdater);
    ajaxJSON(CHARS_URL, charsUpdater);
}
/**
 * Entry point of the program triggered from the "onReady" event of the dom
 * document
 */
function main()
{
    GRID = new Grid("grid");
    setInterval(requestUpdate, 200);
    requestUpdate();
}
