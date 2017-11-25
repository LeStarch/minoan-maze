'''
Created on Nov 5, 2017

@author: starchmd
'''
import sys
import copy
import random

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


#Maximum size 16MB of memory allowed
MAX_SIZE = 1024 * 1024 * 15

def run_code(code, data, memory):
    '''
    An evil, unsafe, stupid run method based on "exec" command,
    used for controlled testing with trusted developers.
    
    THIS IS EVIL, STUPID, and UNSAFE.
    THIS IS EVIL! STUPID! and UNSAFE! 
    
    @param code: code to run as a string
    @param input: input 
    '''
    try:
        if not isinstance(code, str):
            raise Exception("Code must be in string form")
        #Get rid of python built-ins, and therefore make it "safe"
        #Note: it is not safe, even with this
        if "_" in code:
            raise Exception("'_' is an invalid character")
        #Try to setup an impossible "safe" sandbox
        #Note: it is not safe, even with this
        globs = copy.copy(DIRECTION)
        globs["__builtins__"] = {}
        globs["MEMORY"] = memory
        globs["random"] = random.random
        globs["choice"] = random.choice
        locs = {}
        exec(code, globs, locs)
        for key, func in locs.items():
            if callable(func):
                ret = func(data)
                break
        else:
            raise Exception("No function found in code")
        #Check to make sure that we haven't exceeded our resources
        ram = sys.getsizeof(memory)
        if ram > MAX_SIZE:
            raise Exception("Used to much memory {0}".format(ram))
        #Finally return the value
        return ret
    except Exception as exc:
        return exc
    