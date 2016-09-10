'''
Created on Aug 30, 2016

@author: starchmd
'''
import sys
import labyrinth.maze
import labyrinth.rest
import labyrinth.character

def usage(error=""):
    '''
    Prints a usage statement for this server
    @param error - (optional) error message
    '''
    if error != "":
        print("[ERROR] {0}".format(error),file=sys.stderr)
    print("Usage:\n\t{0} <maze-file>".format(sys.argv[0]),file=sys.stderr)
if __name__ == '__main__':
    '''
    Main program for the maze program
    '''
    if len(sys.argv) != 2:
        usage("Missing maze file")
        sys.exit(-1)
    maze = labyrinth.maze.Maze(sys.argv[1])
    maze.printMazeArray(maze.map)
    maze.printMazeArray(maze.getVisibleCells(25, 25,25))
    maze.addCharacter(labyrinth.character.Character.makeCharacter(maze, "The Starch"))
    maze.addCharacter(labyrinth.character.Character.makeCharacter(maze))
    labyrinth.rest.launch(maze)