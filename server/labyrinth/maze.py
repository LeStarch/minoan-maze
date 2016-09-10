import enum
import math
'''
Created on Aug 30, 2016

@author: starchmd
'''
VIEW_RADIUS = 3
class Maze(object):
    '''
    A class to represent a maze, its players, and its layout
    '''
    def __init__(self, file):
        '''
        Setup of the maze
        @param file: file to load in as a maze
        '''
        self.loadMaze(file)
        self.characters = []
    def loadMaze(self, file):
        '''
        Load a file specifying a maze into a maze object
        @param file: filename to load
        '''
        #A map is a 2d list 
        self.map = list()
        with open(file) as inputFile:
            #Read all lines of the file and make into a row
            for line in inputFile.readlines():
                row = list()
                self.map.append(row)
                line = line.strip()
                while len(line) > 0:
                    row.append(Tile(line[0:2]))
                    line = line[2:]
    def getPassableLocation(self):
        '''
        Get a random tile that is passable (not a wall) 
        '''
        x,y = (1,1)
        return (x,y)
    def addCharacter(self,character):
        '''
        Add a character to the map
        @param character - character to add
        '''
        self.characters.append(character)
    def getVisibleCells(self,x,y,radius=VIEW_RADIUS):
        '''
        Get all cells in a XxX grid around the above cell, pad extra with walls
        @param x - float of x value
        @param y - float of y value
        @return: XxX tile grid
        '''
        ret = []
        #Create a VIEW_RADIUSxVIEW_RADIUS grid
        for i in range(0,radius*2+1):
            row = list()
            ret.append(row)
            for j in range(0,radius*2+1):
                row.append(Tile("[]"))
        x = math.floor(x)
        y = math.floor(y)
        #Loop through the viewport
        for i in range(0,radius*2+1):
            for j in range(0,radius*2+1):
                mI = (x - radius)+i
                mJ = (y - radius)+j
                #If this exists in the maze, add it in
                if mI >= 0 and mI < len(self.map) and mJ >= 0 and mJ < len(self.map[mI]):
                    ret[i][j] = self.map[mI][mJ]
        return ret
    @staticmethod
    def printMazeArray(maze):
        '''
        Print out a maze array
        @param maze - maze array (of tiles) to print to terminal
        '''
        for row in maze:
            for col in row:
                print(col.type.getCharacters(),end="")
            print()
class Tile(object):
    '''
    Represents a tile space for the maze
    '''
    def __init__(self,chars):
        '''
        Init the Tile
        '''
        #self.chars = chars
        self.type = TileType.path
        if chars == "##":
            self.type = TileType.wall
        elif chars == "[]":
            self.type = TileType.moat
class TileType(enum.Enum):
    '''
    What type of space is this?
    '''
    wall = 1
    path = 2
    moat = 3
    
    def getSerializableDict(self):
        '''
        Returns the serialization spec for this object
        @return: spec to serialize
        '''
        return {"name":self.name}
    def getCharacters(self):
        '''
        Get printable characters
        '''
        if self == TileType.wall:
            return "##"
        elif self == TileType.path:
            return "  "
        return "[]"
    