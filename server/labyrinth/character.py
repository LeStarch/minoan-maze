import uuid
'''
Created on Sep 3, 2016

@author: starchmd
'''

class Character(object):
    '''
    A character class representing a character
    '''
    def __init__(self,ident,x,y):
        '''
        Constructor
        '''
        self.x = x
        self.y = y
        self.ident = ident
    @classmethod
    def makeCharacter(cls,maze,ident=None):
        '''
        Make a character
        '''
        if ident is None:
            ident = str(uuid.uuid4())
        x,y = maze.getPassableLocation()
        return cls(ident,x,y)
        