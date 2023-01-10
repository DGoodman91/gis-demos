from db import db_session


class BaseDAO():

    def __init__(self):

        self.session = db_session
