#!/usr/bin/python

import config

from businessobjects.countrydata import CountryData
from context import Context
from router import Router

from flask import Flask, request, session
from flask_restful import Api

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


def init_appl():

    dbparams = config.pgsql()

    engine = create_engine(dbparams['connstr'])
    Session = sessionmaker(bind=engine)
    application_context = Context(Session())

    # recs = session.query(CountryData).all()
    # session.query(CountryData).get(["2000", "UNITED KINGDOM"])

    app = Flask(__name__)
    api = Api(app)

    Router.add_resources(api)

    # exec if being run as script
    if __name__ == '__main__':
        from waitress import serve
        with app.app_context():
            serve(app, host='localhost', port=5000) # TODO load port and host from config file

application_context = None

init_appl()
