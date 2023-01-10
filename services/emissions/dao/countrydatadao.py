from businessobjects.countrydata import CountryData
from dao.basedao import BaseDAO

class CountryDataDAO(BaseDAO):

    def __init__(self):

        super().__init__()
    
    def get(self, country_name: str, year: str) -> CountryData:

        return self.session.query(CountryData).get([year, country_name])
