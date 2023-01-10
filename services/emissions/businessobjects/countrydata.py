from businessobjects.base import Base

from sqlalchemy import Column, String, Integer


class CountryData(Base):

    __tablename__ = 'co2_emissions_by_country'

    year = Column(String, primary_key=True)
    country = Column(String, primary_key=True)

    total = Column(Integer)
    solid_fuel = Column(Integer)
    liquid_fuel = Column(Integer)
    gas_fuel = Column(Integer)
    cement = Column(Integer)
    gas_flaring = Column(Integer)
    per_capita = Column(Integer)
    bunker_fuels = Column(Integer)

    def __init__(self, total, solid_fuel, liquid_fuel, gas_fuel, cement, gas_flaring, per_capita, bunker_fuels):
        self.total = total
        self.solid_fuel = solid_fuel
        self.liquid_fuel = liquid_fuel
        self.gas_fuel = gas_fuel
        self.cement = cement
        self.gas_flaring = gas_flaring
        self.per_capita = per_capita
        self.bunker_fuels = bunker_fuels
