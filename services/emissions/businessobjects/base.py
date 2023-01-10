from sqlalchemy.ext.declarative import declarative_base

class BaseModel():
    
    def serializable(self) -> dict:

        d = {}

        for attr in vars(self):

            attr_value = getattr(self, attr)

            if isinstance(attr_value, str) or isinstance(attr_value, int) or isinstance(attr_value, float):
                d[attr] = attr_value

        return d

Base = declarative_base(cls=BaseModel)
