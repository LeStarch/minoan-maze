/**
 * This class represents the player. It holds all attributes of the player
 * as well as the camera and other items.
 */
function Player()
{
	var _self = this;
	_self.x = 1.5;
	_self.y = 0.5;
	
	_self.renderSetup =
		/**
		 * Setup the player's portion of the scene
		 * @param scene - scene to render to
		 */
		function(scene)
		{
			_self.model = BABYLON.Mesh.CreateCylinder("player-form", P_HEIGHT, P_DIA, P_DIA,8,1,scene);
		    //Location of the player and camera
		    var vector = new BABYLON.Vector3(X_SCALE*_self.x, P_HEIGHT/2, Y_SCALE*_self.y);
	
		    //Camera that reprsents a player
		    _self.camera = new BABYLON.FreeCamera("player",new BABYLON.Vector3(0,vector.y+P_HEIGHT*0.4375,0),scene);
		    _self.model.applyGravity = true;
		    _self.model.checkCollisions = true;
	
		    //Light/Torch for the player
		    var torch = new BABYLON.PointLight("torch", vector, scene);
		    torch.diffuse = new BABYLON.Color3(1, 1, 1);
		    torch.specular = new BABYLON.Color3(1, 1, 1);
		    torch.range = P_DIA * 5;
	
		    //Camera and torch bound to vector
		    torch.position = vector;
		};
		
	_self.animationLoop =
		/**
		 * What to do with the player in the animation loop
		 * @param map - map used to calcualte certain parameters
		 */
		function(map)
		{
			var local = map.getLocalGrid(Math.floor(_self.x),Math.floor(_self.y));
		    var theta = codeHarvester();
		    if (theta != null)
		    {
		        var movement = new BABYLON.Vector3(-MAGNITUDE*Math.sin(theta), 0, MAGNITUDE*Math.cos(theta));
		        _self.model.moveWithCollisions(movement);
		    }
		    _self.camera.position.x = _self.model.position.x;
		    _self.camera.position.z = _self.model.position.z;
		    _self.x = _self.model.position.x/X_SCALE;
		    _self.y = _self.model.position.y/Y_SCALE;
		};
}