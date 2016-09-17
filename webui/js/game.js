//Run setup once the window content is loaded
window.addEventListener('DOMContentLoaded',bootstrap);
//Constants
X_SCALE=3;
Y_SCALE=3;
Z_SCALE=3;
MAGNITUDE=0.1;
P_HEIGHT = 2;
P_DIA = 1;
WALL_TEXTURE_COUNT = 1;
GROUND_TEXTURE_COUNT = 1;
LOCAL_SIZE = 3;


/**
 * Bootstrap needed information, like JSON map data
 */
function bootstrap()
{
    setup(MAP.map);
}
/**
 * Setup the canvas and engine elements
 */
function setup(map)
{
    var canvas = document.getElementById("viewport");
    var engine = new BABYLON.Engine(canvas,true);
    //Resize the canvas on window size change
    window.addEventListener('resize',
        function() {
            engine.resize();
        }
    );
    var map = new Map(map);
    var player = new Player();
    
    //Setup scene
    var scene = new BABYLON.Scene(engine);
    map.renderSetup(scene);
    player.renderSetup(scene);

    //Enter the render-loop
    engine.runRenderLoop(
        function()
        {
        	player.animationLoop(map);
            scene.render();
        }
    );
    
}