from services.countrydataservice import CountryDataService

class Router():

    def add_resources(api):

        api.add_resource(CountryDataService, '/country/<string:country>/year/<string:year>')