/**
 * Constructor for the map object. The map object contains the maze data structure (a list of a list of tiles)
 * and several utility functions.
 * @param maze - object from Maze data structure
 */
function Map(maze)
{
	//In JavaScript "this" changes based on context
	//Thus we create an unambiguous _self
	var _self = this;
	_self.maze = maze;

	_self.textures = {ground:[],wall:[]};

	_self.getLocalGrid =
		/**
		 * Get the local 3x3 grid surrounding the given x,y coordinates
		 * @param x - x coordinate
		 * @param y - y coordinate
		 * @return list of list (3x3) of tiles
		 */
		function (x,y)
		{
			var ret = [];
			for (var i = 0; i < LOCAL_SIZE; i++)
			{
				ret.push([]);
				for (var j = 0; j < LOCAL_SIZE; j++)
				{
					ret[i][j] = _self.getTile(i-Math.floor(LOCAL_SIZE/2)+x,j-Math.floor(LOCAL_SIZE/2)+y)
				}
			}
			return ret;
		};
	_self.getTile =
		/**
		 * Get a tile at the coordinate x,y
		 * @param x - x coordinate
		 * @param y - y coordinate
		 * @return tile object
		 */
		function(x,y)
		{
			//Return fill tiles if outsize actual data
			if (x < 0 || x >= _self.maze[0].length || y < 0 || y >= _self.maze.length)
			{
				return {"type":{"name":"moat"}};
			}
			return _self.maze[y][x];
		};
	_self.getFullMaze =
		/**
		 * Get the full maze
		 * @return full maze
		 */
		function()
		{
			return _self.maze;
		};
	_self.renderSetup =
		/**
		 * Render the map into the supplied scene
		 * @param scene - scene to add the map into
		 */
		function(scene)
		{
			_self.setupTexture(scene);
			//The sun is a mass of incandescent...
			var light = new BABYLON.HemisphericLight('sun', new BABYLON.Vector3(0,1,0), scene);
			light.diffuse = new BABYLON.Color3(0.25, 0.10, 0.10);
			//light.specular = new BABYLON.Color3(1, 1, 1);

		    
		    for (var i = 0; i < _self.maze.length; i++)
		    {
		        for (var j = 0; j < _self.maze[0].length; j++)
		        {
		        	//Path holds ground
		        	if (_self.maze[j][i].type.name == "path")
		        	{	
			        	//Setup ground for this tile
					    var ground = BABYLON.Mesh.CreateGround('tera-'+i+"-"+j, X_SCALE, Y_SCALE, 1, scene);
					    ground.position.x = (i*X_SCALE)+X_SCALE/2;
					    ground.position.z = -((j*Y_SCALE)+Y_SCALE/2);
					    ground.material = _self.getRandomMaterial("ground");
					    ground.checkCollisions = true;
		        	}
		        	else if (_self.maze[j][i].type.name == "wall")
		        	{
					    var box = BABYLON.Mesh.CreateBox("box-"+i+"-"+j, X_SCALE, scene);
			        	box.position.x = (i*X_SCALE)+X_SCALE/2;
		                box.position.y = Z_SCALE/2;
		                box.position.z = -((j*Y_SCALE)+Y_SCALE/2);
		                box.material = _self.getRandomMaterial("wall");
		                box.checkCollisions = true;
		            }
		        }
		    }
		    //Setup fog
		    scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
		    scene.fogDensity = 0.05;
		    //Misc
		    scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
		    scene.collisionsEnabled = true;
		};
	_self.setupTexture =
		/**
		 * Setup the textures object to contain several textures to choose from
		 * for each type.
		 */
		function(scene)
		{
			//Loop through all possible textures for ground
			for (var i = 0; i < GROUND_TEXTURE_COUNT; i++)
			{
				_self.textures.ground.push(new BABYLON.StandardMaterial("ground-"+i,scene));
				_self.textures.ground[i].diffuseTexture = new BABYLON.Texture("textures/sand-"+i+".png", scene); 
			}
			//Now the wall textures
			for (var i = 0; i < WALL_TEXTURE_COUNT; i++)
			{
				_self.textures.wall.push(new BABYLON.StandardMaterial("wall-"+i,scene));
				_self.textures.wall[i].diffuseTexture = new BABYLON.Texture("textures/flowers-"+i+".png", scene); 
			}
		};
	_self.getRandomMaterial = 
		/**
		 * Get a random texture from the set of textures for that type
		 * @param name - name of texture group
		 * @return material holding texture
		 */
		function(name)
		{
			var index = Math.floor(_self.textures[name].length*Math.random());
			return _self.textures[name][index];
		};
}
