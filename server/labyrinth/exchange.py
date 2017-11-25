'''
Created on Nov 7, 2017

@author: starchmd
'''
import zmq
import labyrinth.models.character

PUB_SUB_PORT=5573
REQ_REP_PORT=5574

class ExchangerServer(object):
    '''
    A data exchanger built on zero-mq, yehaw!
    '''
    def __init__(self, pub_port=PUB_SUB_PORT, rep_port=REQ_REP_PORT):
        '''
        Sets up the ZeroMQ sockers
        '''
        context = zmq.Context()
        self.rep_sock = context.socket(zmq.REP)
        self.pub_sock = context.socket(zmq.PUB)
        self.rep_sock.bind("tcp://*:{0}".format(rep_port))
        self.pub_sock.bind("tcp://*:{0}".format(pub_port))
    def update(self, maze):
        '''
        Updates the map from external calls
        @param maze: maze to add stuff too
        '''
        try:
            obj = self.rep_sock.recv_pyobj(zmq.NOBLOCK)
            if isinstance(obj, labyrinth.models.character.Character):
                maze.addCharacter(obj)
            self.rep_sock.send_string("ACK")
        except zmq.ZMQError:
            pass
        return
    def publish(self, maze):
        '''
        Publish the updates to the maze
        @param maze: maze to publish out
        '''
        self.pub_sock.send_pyobj(maze)
class ExchangerClient(object):
    '''
    A data exchanger client built on zero-mq, yehaw!
    '''
    def __init__(self, sub_port=PUB_SUB_PORT, req_port=REQ_REP_PORT):
        '''
        Sets up the ZeroMQ sockers
        '''
        context = zmq.Context()
        self.req_sock = context.socket(zmq.REQ)
        self.sub_sock = context.socket(zmq.SUB)
        self.sub_sock.setsockopt_string(zmq.SUBSCRIBE, "")
        self.req_sock.connect("tcp://localhost:{0}".format(req_port))
        self.sub_sock.connect("tcp://localhost:{0}".format(sub_port))
    def send(self, character):
        '''
        Send character
        @param character: character to send
        '''
        self.req_sock.send_pyobj(character)
        return self.req_sock.recv_string() == "ACK"
    def subscribe(self):
        '''
        Subscribe to the updates to the maze
        '''
        #Loop and return when there are no items left
        #If no items found, wait for one
        obj = None
        try:
            while True:
                obj = self.sub_sock.recv_pyobj(zmq.NOBLOCK)
        except zmq.ZMQError:
            if obj is None:
                return self.sub_sock.recv_pyobj()
            return obj
        return obj