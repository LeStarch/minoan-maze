import uuid
'''
Created on Sep 3, 2016

@author: starchmd
'''
CIRCLE='''
def execution(input): 
  return choice([LEFT, RIGHT, UP, DOWN])
'''
class Character(object):
    '''
    A character class representing a character
    '''
    def __init__(self,ident,name,code,x,y):
        '''
        Constructor
        '''
        self.x = x
        self.y = y
        self.name = name
        self.code = code
        self.ident = ident
    @classmethod
    def makeCharacter(cls,maze,ident=None,name=None,code=CIRCLE):
        '''
        Make a character
        '''
        if ident is None:
            ident = str(uuid.uuid4())
        if name is None:
            name = ident
        x,y = maze.getPassableLocation()
        return cls(ident,name,code,x,y)
        
