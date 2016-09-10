//Run setup once the window content is loaded
window.addEventListener('DOMContentLoaded',bootstrap);
//Resize the canvas on window size change
window.addEventListener('resize',
    function() {
        engine.resize();
    }
);

X_SCALE=10
Y_SCALE=10
Z_SCALE=10

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
    
    var scene = constructScene(engine,map);
    scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
    //Camera representing the player view
    var vector = new BABYLON.Vector3(0, 5, -10);
    var camera = new BABYLON.FreeCamera("player",vector,scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, false);
    camera.applyGravity = true;
    scene.collisionsEnabled = true;
    camera.checkCollisions = true;

    scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    scene.fogDensity = 0.05;
    var torch = new BABYLON.PointLight("torch", vector, scene);
    torch.diffuse = new BABYLON.Color3(1, 1, 1);
    torch.specular = new BABYLON.Color3(1, 1, 1);
    torch.range = X_SCALE * 2;
    //Enter the render-loop
    engine.runRenderLoop(
        function()
        {
            torch.position.x = camera.position.x;
            torch.position.y = camera.position.y;
            torch.position.z = camera.position.z;
            scene.render();
        }
    );
    
}
/**
 * Sets up the scene based on the map, canvas, and the engine passed in.
 */
function constructScene(engine,map)
{
    var i = 0;
    var j = 0;
    var scene = new BABYLON.Scene(engine);
    var light = new BABYLON.HemisphericLight('sun', new BABYLON.Vector3(0,1,0), scene);
    light.diffuse = new BABYLON.Color3(0.25, 0.10, 0.10);
    //light.specular = new BABYLON.Color3(1, 1, 1);

    var ground = BABYLON.Mesh.CreateGround('tera', X_SCALE*map.length, Y_SCALE*map[0].length, map.length, scene);
    
    //Setup materials
    var wallMaterial = new BABYLON.StandardMaterial("wall", scene);
    wallMaterial.diffuseTexture = new BABYLON.Texture("textures/flowers.png", scene); 

    var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("textures/sand.png", scene);
    groundMaterial.diffuseTexture.uScale = X_SCALE*map.length;
    groundMaterial.diffuseTexture.vScale = Y_SCALE*map[0].length;
    ground.material = groundMaterial;
    ground.checkCollisions = true;
    for (var i = 0; i < map.length; i++)
    {
        for (var j = 0; j < map[0].length; j++)
        {
            if (map[i][j].type.name == "wall")
            {
                var box = BABYLON.Mesh.CreateBox("box-"+i+"-"+j, X_SCALE, scene);
                box.position.x = (i*X_SCALE)-(map.length*X_SCALE)/2+X_SCALE/2;
                box.position.y = Z_SCALE/2;
                box.position.z = (j*Y_SCALE)-(map[0].length*Y_SCALE+1)/2+Y_SCALE/2;
                box.material = wallMaterial;
                box.checkCollisions = true;
            }
        }
    }
 
    return scene; 
}
