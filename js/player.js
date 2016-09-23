/**
 * This class represents the player. It holds all attributes of the player
 * as well as the camera and other items.
 */
function Player()
{
	var _self = this;
	_self.x = 1.5;//0.5;
	_self.y = 0.5;//1.5;
        _self.dest = [_self.x,_self.y];
 	_self.dir = 3.0*Math.PI/2.0;
        _self.theta = null;
	_self.grid = new Grid("grid");
	
	_self.renderSetup =
		/**
		 * Setup the player's portion of the scene
		 * @param scene - scene to render to
		 */
		function(scene)
		{
			var vector = new BABYLON.Vector3(X_SCALE*_self.x, P_HEIGHT/2, -Y_SCALE*_self.y);
			_self.model = BABYLON.Mesh.CreateCylinder("player-form", P_HEIGHT, P_DIA, P_DIA,8,1,scene);
			
			_self.model.ellipsoid = new BABYLON.Vector3(P_DIA/2, P_HEIGHT, P_DIA/2);
			_self.model.ellipsoidOffset = new BABYLON.Vector3(0, P_HEIGHT, 0);
		    _self.model.applyGravity = true;
		    _self.model.checkCollisions = true;
		    _self.model.position = vector;
		    //Location of the player and camera
		    
	
		    //Camera that reprsents a player
		    _self.camera = new BABYLON.FreeCamera("player",new BABYLON.Vector3(vector.x,vector.y+P_HEIGHT*0.4375,vector.z),scene);
	
		    //Light/Torch for the player
		    var torch = new BABYLON.PointLight("torch", vector, scene);
		    torch.diffuse = new BABYLON.Color3(1, 1, 1);
		    torch.specular = new BABYLON.Color3(1, 1, 1);
		    torch.range = P_DIA * 2;
	
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
			_self.grid.render(local,_self.x,_self.y,_self.dir);
                    if (_self.fuzzyCheck())
                    {
		        _self.theta = runCode(local);
                        if (_self.theta != null)
                        {
                            var newX = _self.dest[0] + Math.cos(_self.theta);
                            var newY = _self.dest[1] - Math.sin(_self.theta);
                            if (map.getTile(Math.floor(newX),Math.floor(newY)) == "path")
                            {
                                _self.dest[0] = newX;
                                _self.dest[1] = newY;
                            }
                        }
                    }
		    if (_self.theta != null)
		    {
		    	//Normalize theta
		    	_self.theta = normalize(_self.theta);
		        //Smoothed rotations
		        var diff =normalize(_self.dir - _self.theta);
		        if ( diff < Math.PI && diff > STEP)
		        {
		        	_self.dir = normalize(_self.dir - STEP);
		        }
		        else if (diff >= Math.PI && diff < 2.0*Math.PI-STEP)
		        {
		        	_self.dir = normalize(_self.dir + STEP);
		        }
		        else
		        {
		        	_self.dir = _self.theta;
                                var dist = Math.sqrt(Math.pow(_self.x - _self.dest[0],2)+Math.pow(_self.y - _self.dest[1],2));
                                if (MAGNITUDE < dist)
                                {
                                    dist = MAGNITUDE;
                                }
                                else
                                {
                                    dist = dist;
                                }
                                if(!_self.fuzzyCheck())
                                {
			            var movement = new BABYLON.Vector3(dist*Math.cos(_self.dir), 0, dist*Math.sin(_self.dir));
			            _self.model.moveWithCollisions(movement);
                                }
		        }
		    }
		    _self.camera.rotation.y = -(_self.dir-Math.PI/2);
		    _self.camera.position.x = _self.model.position.x;
		    _self.camera.position.z = _self.model.position.z;
		    _self.x = _self.model.position.x/X_SCALE;
		    _self.y = -_self.model.position.z/Y_SCALE;
		};
    _self.fuzzyCheck =
        /**
         * Fuzzy check destination
         */
        function()
        {
            if (Math.abs(_self.x-_self.dest[0]) < 0.01 && Math.abs(_self.y-_self.dest[1]) < 0.01)
            {
                return true;
            }
            return false;
        };
}

//Normalize angle
function normalize(theta)
{
	var pi2 = Math.PI*2;
	return ((theta % pi2) + pi2)%pi2;
};
