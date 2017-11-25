/**
 * A "class" used for displaying a grid of the world based on type of the
 * individual cells underlying it.
 *
 * @author lestarch
 */
function Grid(id)
{
    var _self = this;
    //Set the grid element that we are going to render to
    _self.canvas = document.getElementById(id);

    _self.setMaze =
        /**
         * Updates the maze used to render
         * @param grid: updated grid to use
         */
        function(grid)
        {
            _self.maze = grid
        }
    _self.setCharacters =
        /**
         * Sets the characters for the maze to render.
         * @param characters: list of characters to set
         */
        function(characters)
        {
            _self.characters = characters;
        }
    _self.renderMaze =
        /**
         * Render the maze/grid portion of the map
         */
        function(height)
        {
            var context = _self.canvas.getContext("2d");
            //Don't render if grid is unset
            var grid = _self.maze;
            if (typeof(grid) === "undefined")
            {
                return -1;
            }
            var size = height/grid.length;
            //Loop and draw rectangles
            for (var i = 0; i < grid.length; i++)
            {
                for (var j = 0; j < grid[0].length; j++)
                {
                    var cell = grid[i][j].type.name;
                    context.fillStyle = (cell == "wall") ? "#FF0000" : (cell == "moat") ? "#0000FF" : "#FFFFFF";
                    context.fillRect(j*size,i*size,size,size);
                    context.rect(j*size,i*size,size,size);
                    context.lineWidth = 1;
                    context.strokeStyle = "black";
                    context.stroke();
                }
            }
            return size;
        }
    _self.renderCharacters =
        /**
         * Render the characters ontop of the map
         * @param size: size of on grid square
         */
        function(size)
        {
            var context = _self.canvas.getContext("2d");
            //Don't render if characters are unset
            var characters = _self.characters;
            if (size == -1 || typeof(characters) === "undefined")
            {
                return;
            }
            //Check if the character display is needed
            for (var i = 0; i < characters.length; i++)
            {
                context.beginPath();
                context.arc(characters[i].x * size + size/2, characters[i].y * size + size/2, size/10, 0, 2 * Math.PI, false);
                context.fillStyle = "pink";
                context.fill();
                context.lineWidth = 1;
                context.strokeStyle = "maroon";
                context.stroke();
            }
        }
    _self.render =
        /**
         * Render the gird object to the grid canvas
         */
        function()
        {
            var context = _self.canvas.getContext("2d");
            var height = context.canvas.height;
            var width = context.canvas.width;
            context.clearRect(0, 0, width, height);
            var size = _self.renderMaze(height);
            _self.renderCharacters(size);
            window.requestAnimationFrame(_self.render);
        };
    window.requestAnimationFrame(_self.render);
};
