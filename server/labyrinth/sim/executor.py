'''
Created on Nov 5, 2017

@author: starchmd
'''
from labyrinth.models.maze import TileType
#Relative firections
DIRECTION = {
  "UP": (0, -1),
  "DOWN" : (0, 1),
  "LEFT" : (-1, 0),
  "RIGHT" : (1, 0),
  #Cardinal directions
  "NORTH" : (0, -1),
  "SOUTH" : (0, 1),
  "EAST" : (1, 0),
  "WEST": (-1, 0)
}
class Executor(object):
    '''
    An executor base class
    '''
    def execute(self, maze, character):
        '''
        Execute a characters's decisions
        @param character: character to execute
        '''
        nearby = maze.getVisibleCells(character.x, character.y)
        if not hasattr(character, "_cache"):
            character._cache = None 
        if character._cache is not None:
            try:
                direction, character._cache = self.run(character._cache, nearby)
            except StopIteration:
                direction, character._cache = self.run(character.code, nearby)
        else:
            direction, character._cache = self.run(character.code, nearby)
        if maze.map[character.y + direction[1]][character.x + direction[0]].type == TileType.path:
            character.x += direction[0]
            character.y += direction[1]
    def run(self, code):
        '''
        Run the code attached to a given character
        @param code: code to run
        '''
        raise Exception("Abstract class 'Executor' should be subclassed")