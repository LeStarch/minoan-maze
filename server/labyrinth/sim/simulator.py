'''
Created on Nov 4, 2017

@author: starchmd
'''
import os
import sys
import time
import traceback
import threading

from labyrinth.sim.evil import UnsafeExecutor

class Simulator(threading.Thread):
    '''
    A simulator class used to run the maze simulations based on a map and a set of
    characters
    '''
    def __init__(self, maze):
        '''
        Initialize the simulator
        '''
        threading.Thread.__init__(self)
        self.maze = maze
        self.exit = False
        self.executor = UnsafeExecutor()
    def run(self):
        '''
        The run method for this thread
        '''
        while not self.exit:
            for actor in self.maze.characters:
                try:
                    self.executor.execute(self.maze, actor)
                except Exception as exc:
                    print("[ERROR] Failed to execute actor: {0} with {1}:{2}".format(actor.name, type(exc), str(exc)),
                          file=sys.stderr)
                    traceback.print_exc()
            os.system("cls" if os.name == "nt" else "clear")
            self.maze.printMazeArray(self.maze.map, self.maze.characters)
            time.sleep(0.020)
