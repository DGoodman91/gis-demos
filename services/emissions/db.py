import config

from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker


dbparams = config.pgsql()

engine = create_engine(dbparams['connstr'])
db_session = scoped_session(sessionmaker(bind=engine))

# TODO are we creating a fresh engine every time we init a class that imports db_session?