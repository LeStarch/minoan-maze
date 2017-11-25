'''
Created on Nov 4, 2017

@author: starchmd
'''
import os
import sys
import time
import traceback
import threading

from labyrinth.sim.executor import Executor

class Simulator(threading.Thread):
    '''
    A simulator class used to run the maze simulations based on a map and a set of
    characters
    '''
    def __init__(self, maze, exchanger):
        '''
        Initialize the simulator
        '''
        threading.Thread.__init__(self)
        self.maze = maze
        self.exit = False
        self.executor = Executor()
        self.exchanger = exchanger
    def run(self):
        '''
        The run method for this thread
        '''
        while not self.exit:
            self.executor.chunk(self.maze, self.maze.characters)
            os.system("cls" if os.name == "nt" else "clear")
            self.maze.printMazeArray(self.maze.map, self.maze.characters)
            self.exchanger.update(self.maze)
            self.exchanger.publish(self.maze)
            time.sleep(0.820)
