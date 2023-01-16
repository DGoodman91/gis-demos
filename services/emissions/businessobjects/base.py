from sqlalchemy.ext.declarative import declarative_base

class BaseModel():

    # copy all of the object's non-complex attributes into a dictionary
    # used to present serializable versions of the class
    def serializable(self) -> dict:

        d = {}

        for attr in vars(self):

            attr_value = getattr(self, attr)

            # TODO if it's an instance of a Class which itself has a serializable method, use that
            if isinstance(attr_value, str) or isinstance(attr_value, int) or isinstance(attr_value, float):
                d[attr] = attr_value

        return d


# augment the base model with the 'serializable' method
# https://docs.sqlalchemy.org/en/13/orm/extensions/declarative/mixins.html#augmenting-the-base
Base = declarative_base(cls=BaseModel)
