'''
Created on Sep 4, 2016

@author: starchmd
'''
import os
import flask
import flask_restful
import labyrinth.exchange
import labyrinth.cereal

def launch():
    '''
    Launch a REST server example
    '''
    exchanger = labyrinth.exchange.ExchangerClient()
    app = flask.Flask(__name__)
    app.config.from_object(Config)
    api = flask_restful.Api(app)
    api.add_resource(MazeResource,"/maze",resource_class_args=[exchanger])
    api.add_resource(CharactersResource,"/characters",resource_class_args=[exchanger])
    #Define static routes
    def root():
        '''
        Send index.html
        '''
        return flask.send_file(os.path.join(os.path.dirname(__file__),"../webui/index.html"))    
    def js(path):
        '''
        Send JS paths
        '''
        return flask.send_from_directory(os.path.join(os.path.dirname(__file__),"../webui/js"), path)
    app.add_url_rule("/", "root", root)
    app.add_url_rule("/js/<path:path>", "js", js)
    app.run(debug=True)

class Config(object):
    RESTFUL_JSON = {"cls":labyrinth.cereal.LabyrinthEncoder}

class MazeResource(flask_restful.Resource):
    '''
    A resource for obtaining the maze
    '''
    def __init__(self, exchanger):
        '''
        Initialize the service with an exchanger
        '''
        self.exchanger = exchanger
    def get(self):
        '''
        Get the maze grid
        '''
        maze = self.exchanger.subscribe()
        return maze.map
class CharactersResource(flask_restful.Resource):
    '''
    A character resource
    '''
    def __init__(self, exchanger):
        '''
        Init the service with an exchanger
        '''
        self.exchanger = exchanger
    def get(self):
        '''
        Get the characters in the maze
        '''
        maze = self.exchanger.subscribe()
        return maze.characters
def main():
    '''
    Main program; Hi Lewis!!
    '''
    launch()
if __name__ == "__main__":
    main()