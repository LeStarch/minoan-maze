'''
Created on Nov 5, 2017

@author: starchmd
'''
import copy
import types
import labyrinth.sim.executor

class UnsafeExecutor(labyrinth.sim.executor.Executor):
    '''
    An evil, unsafe, stupid executor based on "exec" command,
    used for controlled testing with trusted developers.
    '''
    def run(self, code, data):
        '''
        Run the given code and return a direction
        @param code: code to run
        @param input: input 
        '''
        if isinstance(code, types.GeneratorType):
            return (code.__next__(), code)
        if callable(code):
            return (code(data), code)
        if "_" in code:
            raise Exception("'_' is an invalid character")
        globs = copy.copy(labyrinth.sim.executor.DIRECTION)
        globs["__builtins__"] = {}
        locs = {}
        exec(code, globs, locs)
        for key,func in locs.items():
            if callable(func):
                out = func(data)
                #Potential generators
                if isinstance(out, types.GeneratorType):
                    func = out
                    out = func.__next__()
                return (out, func)
        raise Exception("No function found in code")