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
function mapUpdater(continuous, map)
{
    GRID.setMaze(map);
    if (continuous)
    {
        requestUpdate(true, false, continuous);
    }
}
/**
 * Renderer the result of the character call
 * @param characters: characters to render
 */
function charsUpdater(continuous, characters)
{
    GRID.setCharacters(characters);
    if (continuous)
    {
        requestUpdate(false, true, continuous);
    }
}
/**
 * Request updates from server
 */
function requestUpdate(map, chars, continuous)
{
    if (map)
    {
        ajaxJSON(MAP_URL, mapUpdater.bind(undefined, continuous));
    }
    if (chars)
    {
        ajaxJSON(CHARS_URL, charsUpdater.bind(undefined, continuous));
    }
}
/**
 * Entry point of the program triggered from the "onReady" event of the dom
 * document
 */
function main()
{
    GRID = new Grid("grid");
    requestUpdate(true, true, true);
}
