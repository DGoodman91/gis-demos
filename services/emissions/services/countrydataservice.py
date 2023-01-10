from services.baseservice import BaseService


class CountryDataService(BaseService):
    
    def get(self, country, year):

        return { 'testing': 'working?' }