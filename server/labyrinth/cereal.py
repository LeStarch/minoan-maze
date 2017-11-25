import flask.json
'''
Created on Sep 4, 2016

@author: starchmd
'''

class LabyrinthEncoder(flask.json.JSONEncoder):
    '''
    An encoder used to encode items in JSON
    '''
    def default(self,obj):
        '''
        Default encoding method
        '''
        #Call JSON encoder if possible
        if not getattr(obj, "getSerializableDict",None) is None:
            return obj.getSerializableDict()
        return obj.__dict__