'''
Created on Sep 4, 2016

@author: starchmd
'''
import flask
import flask_restful
import labyrinth.json


def launch(maze):
    '''
    '''
    app = flask.Flask(__name__)
    app.config.from_object(Config)
    api = flask_restful.Api(app)
    api.add_resource(MazeResource,"/maze",resource_class_args=[maze])
    app.run(debug=True)

class Config(object):
    RESTFUL_JSON = {"cls":labyrinth.json.LabyrinthEncoder}

class MazeResource(flask_restful.Resource):
    '''
    '''
    def __init__(self,maze):
        '''
        '''
        self.maze = maze
    def get(self):
        '''
        '''
        return self.maze