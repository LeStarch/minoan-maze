'''
Created on Nov 5, 2017

@author: starchmd
'''
import time
from multiprocessing import Pool, Manager
from labyrinth.models.maze import TileType
from labyrinth.sim.evil import run_code, DIRECTION

POOL_SIZE = 100
STEP_TIME = 0.5
MAX_PLAYERS = 1000
CHUNK_TIMEOUT = STEP_TIME/(MAX_PLAYERS/POOL_SIZE)

class Executor(object):
    '''
    An executor base class
    '''
    def __init__(self):
        '''
        Initialize the memory store
        '''
        self.manager = Manager()
        self.mindex = {}
        self.pool = Pool(POOL_SIZE)
    def chunk(self, maze, characters):
        '''
        Chunk it
        @param maze: maze updating
        @param characters: characters to chunk thorugh
        '''
        chunks = (characters[pos:pos + POOL_SIZE] for pos in range(0, len(characters), POOL_SIZE))
        end_time = time.time() + STEP_TIME
        for chunk in chunks:
            self.outstanding = len(chunk)
            for item in chunk:
                item.error = {"type": "timeout", "message":"Execution took too long"}
                self.start(maze, item)
        time.sleep(CHUNK_TIMEOUT)
        if self.outstanding > 0:
            self.pool.terminate()
            self.pool = Pool(POOL_SIZE)
        now = time.time()
        if now < end_time:
            time.sleep(end_time - now)
        elif now > end_time + 0.5 * STEP_TIME:
            raise Exception("Server is falling behind by: {0}".format(now - end_time))            
    def start(self, maze, character):
        '''
        Execute a characters's decisions
        @param character: character to execute
        '''
        nearby = maze.getVisibleCells(character.x, character.y)
        if character.ident not in self.mindex:
            self.mindex[character.ident] = self.manager.dict()
        memory = self.mindex[character.ident]
        def update(ret):
            '''
            Update character callback
            @param ret: return value
            '''
            character.error = None
            self.outstanding = self.outstanding - 1
            if isinstance(ret, Exception):
                character.error = {"type": type(ret), "message": str(ret)}
                return
            if ret not in DIRECTION.values():
                character.error = {"type": "bad-return", "message": "Function should return UP, DOWN, LEFT, RIGHT"}
                return
            if maze.map[character.y + ret[1]][character.x + ret[0]].type == TileType.path:
                character.x += ret[0]
                character.y += ret[1]      
        self.pool.apply_async(run_code, args=(character.code, nearby, memory), callback=update)