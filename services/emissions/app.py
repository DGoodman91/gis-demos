#!/usr/bin/python

import config

from businessobjects.countrydata import CountryData
from db import db_session
from router import Router

from flask import Flask, request, session
from flask_restful import Api


app = Flask(__name__)
api = Api(app)

Router.add_resources(api)

# exec if being run as script
if __name__ == '__main__':
    from waitress import serve
    with app.app_context():
        serverparams = config.server()
        serve(app, host=serverparams['host'], port=serverparams['port'])


@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()
