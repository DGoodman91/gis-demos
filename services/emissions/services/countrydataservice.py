from services.baseservice import BaseService
from dao.countrydatadao import CountryDataDAO
from flask import jsonify

class CountryDataService(BaseService):

    countrydatadao = CountryDataDAO()
    
    def get(self, country, year):

        data = self.countrydatadao.get(country, year)

        return jsonify(data.serializable())