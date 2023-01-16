#!/usr/bin/python

import config

from db import db_session
from router import Router

from flask import Flask
from flask_restful import Api
from waitress import serve

app = Flask(__name__)
api = Api(app)

Router.add_resources(api)

# exec if being run as script
if __name__ == '__main__':
    with app.app_context():
        serverparams = config.server()
        serve(app, host=serverparams['host'], port=serverparams['port'])

@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()
