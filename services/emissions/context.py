from sqlalchemy.orm import sessionmaker

class Context():

    session = None

    def __init__(self, session: sessionmaker):

        self.session = session