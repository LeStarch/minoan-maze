
function Grid(id)
{
	var _self = this;
	//Set the grid element that we are going to render to
	_self.canvas = document.getElementById(id);

	_self.render =
		/**
		 * Render the gird object to the grid canvas
		 * @param grid - NxN grid project
		 */
		function(grid,x,y,angle)
		{
			var context = _self.canvas.getContext("2d");
			context.clearRect(0,0,_self.canvas.width,_self.canvas.height);
			var height = context.canvas.height;
			var width = context.canvas.width;
			var size = height/grid.length;
			var pad = (width - height)/2;
			//Loop and draw rectangles
			for (var i = 0; i < grid.length; i++)
			{
				for (var j = 0; j < grid[0].length; j++)
				{
					var cell = grid[i][j];
					context.fillStyle = (cell == "wall") ? "#FF0000" : (cell == "moat") ? "#0000FF" : "#FFFFFF";
					context.fillRect(i*size,j*size,size,size);
					context.rect(i*size,j*size,size,size);
					context.stroke();
				}
			}
                        var locX = (x-Math.floor(x))*size+size;
                        var locY = (y-Math.floor(y))*size+size;
                        context.beginPath(); 
                        context.moveTo(locX,locY);
                        locX = locX + size*Math.cos(angle);
                        locY = locY - size*Math.sin(angle);
                        context.lineTo(locX,locY);
		};
};
