# PostGIS

## Setting up the db for geo data

```sql
create extension postgis;
```
The restored the following files, see https://postgis.net/docs/manual-1.4/ch02.html#id415430
```shell
david@LAPTOP-H6DPS38T MINGW64 /c/Program Files/PostgreSQL/15/share/contrib/postgis-3.3
$ psql -U postgres -d gis --port 5433 -f spatial_ref_sys.sql
BEGIN
INSERT 0 0
COMMIT
ANALYZE

$ psql -U postgres -d gis --port 5433 -f postgis_comments.sql
COMMENT
COMMENT
...
```

## Importing the countries GeoJSON data

Imported the geojson data with
```shell
 & 'C:\Program Files\QGIS 3.22.10\bin\ogr2ogr.exe' -f "PostgreSQL" PG:"dbname=gis port=5433 user=postgres password=postgres" ".\archive\countries.geojson"
```

### Data has no SRID...
Some early guesswork suggests it might be 4326, which represents spatial data using longitude and latitude coordinates on the Earth's surface as defined in the WGS84 standard, which is also used for the Global Positioning System (GPS). Need to further verify and add it in.


Coordinates seem to be in Long/Lat, whereas 4326 is Lat/Long - need flipping? There's a postgis function for that
https://postgis.net/docs/manual-dev/ST_FlipCoordinates.html

```sql
-- swap the long/lat values to be lat/long on all the geometries, and add our suspected SRID
update countries set wkb_geometry = ST_FlipCoordinates(wkb_geometry);
update countries set wkb_geometry = ST_SetSRID(ST_GeomFromWKB(wkb_geometry), 4326);
```

### Geometry column type

Currently bytea, we'd like it to be Geometry so we can more easily work with it. We also take the opportunity to cast all the geometries to MultiPolygons, since there's currently a mix. Finally, we'll add a spacial index to our new column.

```sql
select AddGeometryColumn('countries', 'geom', 4326, 'MultiPolygon', 2);
update countries set geom = ST_Multi(ST_GeomFromWKB(wkb_geometry));
alter table countries drop column wkb_geometry;

create index countries_geom_idx on countries using GIST(geom);
```

## Importing the administrative boundary GeoJSON data 

Pretty much the same as above. Note that at the time the dataset was grabbed (16/11/2022), the data is marked as being in 'BETA', though no update has been made in 4 years.

```shell
& 'C:\Program Files\QGIS 3.22.10\bin\ogr2ogr.exe' -f "PostgreSQL" PG:"dbname=gis port=5433 user=postgres password=postgres" ".\archive\admin1.geojson"
ERROR 1: PROJ: proj_create_from_database: C:\Program Files\PostgreSQL\15\share\contrib\postgis-3.3\proj\proj.db contains DATABASE.LAYOUT.VERSION.MINOR = 0 whereas a number >= 2 is expected. It comes from another PROJ installation.
```

Need to look into the error, but the data imported anyway.

And fix & prep the data as before. Note that we use the ***GeometryFromEWKB*** function instead of ***GeometryFromWKB***, since the binary data is in EWKB format rather than OGC WKB.

```sql
update admin1 set wkb_geometry = ST_FlipCoordinates(wkb_geometry);
update admin1 set wkb_geometry = ST_SetSRID(GeometryFromEWKB(wkb_geometry), 4326);

select AddGeometryColumn('admin1', 'geom', 4326, 'MultiPolygon', 2);
update admin1 set geom = ST_Multi(GeometryFromEWKB(wkb_geometry));
alter table admin1 drop column wkb_geometry;

create index admin1_geom_idx on admin1 using GIST(geom);
```

## Sanity check our data

We run a quick sanity check on our data so far - let's check to see that all of the UK's admin boundaries lie within in the country boundary.


```sql
-- returns 232 records
select * from admin1 where country = 'United Kingdom';

-- returns 128 records
select * from admin1 where ST_Contains((select geom from countries where admin = 'United Kingdom'), geom);

-- returns 237 records, all 232 above plus 5 from ireland
select * from admin1 where ST_Intersects((select geom from countries where admin = 'United Kingdom'), geom);

```

So not perfect, but it'll do for now.

## Handling country splits/unions

Where countries have merged and/or split over time (e.g., Vietnam, Germany, Czech Republic/Slovakia) we can't have Features with overlapping geometries. We'll need to add a Years Active field to our country data and use it in a filter on our application's map. The field will contain one of three structures, see the expression used in the code for it's usage. "ALL" indicates the country exists for all years, "NOT:1945-1990" indicates the country exists for all years except those in the (inclusive) range specified, and "IN:1945-1990" indicates the country exists in all years withing the (inclusive) range. We'll use the years 0000 & 9999 as bookends.

```sql
alter table countries add column years_active varchar(32);
-- to start with, set them all to ALL and we'll update special cases when we prep & clean our data
update countries set years_active = 'ALL';
```

## Add CO2 Emission data to our countries table

Create a table to hold our data

```sql
-- TODO primary keys & indexes
create table co2_emissions_by_country (
    year         varchar(4) NOT NULL,
    country      varchar(128) NOT NULL,
    total        integer,
    solid_fuel   integer,
    liquid_fuel  integer,
    gas_fuel     integer,
    cement       integer,
    gas_flaring  integer,
    per_capita   integer,
    bunker_fuels integer
)
```

Import our CSV file into the table with the psql copy command

```shell
--command " "\\copy public.co2_emissions_by_country (year, country, total, solid_fuel, liquid_fuel, gas_fuel, cement, gas_flaring, per_capita, bunker_fuels) FROM 'C:/Users/david/DOCUME~1/MAPSAN~1/CO2-FO~1/data/FOSSIL~1.CSV' DELIMITER ',' CSV HEADER QUOTE '\"' ESCAPE '''';""
```

### Data tidying time

We now have 77 "country" values in our *co2_emissions_by_country* table that don't have a corresponding record in the *countries* table, and 76 of the converse, based on the following queries. Some are typos, some are grammatical differences, some are alternate names, and some will need further work/decisions making (e.g. united korea, san marino). We'll tidy up the simple ones then come back to the rest.

```sql
select distinct country from co2_emissions_by_country where lower(country) not in (select lower(admin) from countries); -- 77 results
select distinct admin from countries where lower(admin) not in (select lower(country) from co2_emissions_by_country); -- 76 results
```

See the *missing-country-names* file for details. We fix a bunch of them with the following

```sql
update countries set admin = 'Plurinational State of Bolivia' where admin = 'Bolivia';
update countries set admin = 'Bosnia & Herzegovina' where admin = 'Bosnia and Herzegovina';
update countries set admin = 'Antigua & Barbuda' where admin = 'Antigua and Barbuda';
update countries set admin = 'Timor-Leste (Formerly East Timor)' where admin = 'East Timor';
update countries set admin = 'Falklands Islands (Malvinas)' where admin = 'Falkland Islands';
update countries set admin = 'Lao People s Democratic Republic' where admin = 'Laos';
update countries set admin = 'State of Libya' where admin = 'Libya';
update co2_emissions_by_country set country = "STATE OF LIBYA" where country = 'LIBYAN ARAB JAMAHIRIYAH';
update countries set admin = 'China (Mainland)' where admin = 'China';
update countries set admin = 'Hong Kong Special Administrative Region of China' where admin = 'Hong Kong S.A.R.';
update co2_emissions_by_country set country = "HONG KONG SPECIAL ADMINISTRATIVE REGION OF CHINA" where country = 'HONG KONG SPECIAL ADMINSTRATIVE REGION OF CHINA';
update countries set admin = 'Macau Special Administrative Region of China ' where admin = 'Macao S.A.R';
update co2_emissions_by_country set country = "MACAU SPECIAL ADMINISTRATIVE REGION OF CHINA" where country = 'MACAU SPECIAL ADMINSTRATIVE REGION OF CHINA';
update countries set admin = 'Islamic Republic of Iran' where admin = 'Iran';

update countries set admin = 'Brunei (Darussalam)' where admin = 'Brunei';
update countries set admin = 'Bahamas' where admin = 'The Bahamas';
update countries set admin = 'Syrian Arab Republic' where admin = 'Syria';
update countries set admin = 'Saint Martin (Dutch Portion)' where admin = 'Saint Martin';
update countries set admin = 'St. Pierre & Miquelon' where admin = 'Saint Pierre and Miquelon';
update countries set admin = 'St. Vincent & the Grenadines' where admin = 'Saint Vincent and the Grenadines';

update countries set admin = 'Republic of Cameroon' where admin = 'Cameroon';
update countries set admin = 'Republic of Moldova' where admin = 'Moldova';
update countries set admin = 'Republic of South Sudan' where admin = 'South Sudan';
```

```sql
-- TODO loads left, but let's get some stuff built first then return to tidy up the data!
-- Lots of questions, like how to handle countries that used to be different (e.g., korea, vietnam)
update co2_emissions_by_country set country = 'FRANCE' where country = 'FRANCE (INCLUDING MONACO)';
```

02/01/2023 Data Cleaning Work

- ISSUE: countries table has france and monaco as two separate entities. co2 emissions data has them as a single 'France (Including Monaco)' state.
  RESOLUTION: union the geometries of france and monaco to make a new row that matches the emissions data. We'll insert new country record with negative ogc id
  ```sql
  insert into countries values (-78, 'France (including Monaco)', 'FRA_MCO', (select ST_Union(geom) from countries where admin ilike '%france%' or admin ilike '%monaco%'))
  ```

- ISSUE: countries table has italy and san marino as two separate entities. co2 emissions data has them as a single 'Italy (Including San Marino)' state.
  RESOLUTION: union the geometries of italy and san marino to make a new row that matches the emissions data. We'll insert new country record with negative ogc ids
  ```sql
  insert into countries values (-113, 'Italy (Including San Marino)', 'ITA_SMR', (select ST_Union(geom) from countries where admin ilike '%italy%' or admin ilike '%marino%'))
  ```

- ISSUE: Pre-split, emission data comes from "CZECHOSLOVAKIA".
  RESOLUTION: Need to UNION Czechnia and Slovakia's borders and add a countries record for it
  ```sql
  -- also need to use st_multi to cast the resulting POLYGON to a MULTIPOLYGON
  insert into countries values (-61, 'Czechoslovakia', 'CZE_SVK', (select ST_Multi(ST_Union(geom)) from countries where admin ilike '%Czech Republic%' or admin ilike '%slovakia%'), 'IN:0000-1991');
  -- finally, update the years_active field on the existing records
  update countries set years_active = 'NOT:0000-1991' where admin in ('Slovakia', 'Czech Republic');
  ```

- ISSUE: Pre-breakup, emission data comes from "USSR" and all the soviet countries merge into it. Need to UNION all their Geometries and add a countries record for it. Countries were: Armenia, Azerbaijan, Belorussia (now Belarus), Estonia, Georgia, Kazakhstan, Kirgiziya (now Kyrgyzstan), Latvia, Lithuania, Moldavia (now Moldova), Russia, Tajikistan, Turkmenistan, Ukraine, and Uzbekistan.
  RESOLUTION: First, check our data to see which years each of the above countries started getting their own emission data. All except Estonia and Latvia have their data starting in 1992, with those two missing data between 1940-1991. So we can add a USSR country record with years_active range 1940-1991, and set the years_active's of the separate countries to "NOT:1940-1991"
  ```sql
  INSERT INTO countries VALUES (-192, 'USSR', 'USSR', (select ST_Multi(ST_Union(geom)) from countries WHERE UPPER(admin) IN ('ARMENIA', 'AZERBAIJAN', 'BELARUS', 'ESTONIA', 'GEORGIA', 'KAZAKHSTAN', 'KYRGYZSTAN', 'LATVIA', 'LITHUANIA', 'REPUBLIC OF MOLDOVA', 'RUSSIAN FEDERATION', 'TAJIKISTAN', 'TURKMENISTAN', 'UKRAINE', 'UZBEKISTAN')), 'IN:1940-1991');
  UPDATE countries SET years_active = 'NOT:1940-1991' WHERE UPPER(admin) IN ('ARMENIA', 'AZERBAIJAN', 'BELARUS', 'ESTONIA', 'GEORGIA', 'KAZAKHSTAN', 'KYRGYZSTAN', 'LATVIA', 'LITHUANIA', 'REPUBLIC OF MOLDOVA', 'RUSSIAN FEDERATION', 'TAJIKISTAN', 'TURKMENISTAN', 'UKRAINE', 'UZBEKISTAN');
  ```

- Some just need their names tweaking to match
```sql
update countries set admin = 'Russian Federation' where admin = 'Russia';
update countries set admin = 'Republic of Sudan' where admin = 'Sudan';
update co2_emissions_by_country set country = 'REPUBLIC OF SERBIA' where country = 'SERBIA'
update co2_emissions_by_country set country = 'IVORY COAST' where country = 'COTE D IVOIRE'
update co2_emissions_by_country set country = 'DEMOCRATIC REPUBLIC OF THE CONGO' where country = 'DEMOCRATIC REPUBLIC OF THE CONGO (FORMERLY ZAIRE)'
update co2_emissions_by_country set country = 'REPUBLIC OF CONGO' where country = 'CONGO'
```



## Exporting back to GeoJSON

If we want to export back to GeoJSON, we can do so with something like

```sql
 & 'C:\Program Files\QGIS 3.22.10\bin\ogr2ogr.exe' -f GeoJSON out.json "PG:host=localhost port=5433 dbname=gis user=postgres password=postgres" -sql "select * from countries"
```

# Mapbox GL JS

NOTE. From prelim testing, mapbox seems to expect Long/Lat, so we'll have to remember to flip the coords back when we export.

We've got some different ways we can build our co2-emissions-by-year map.
* Create a style with a layer per year, and then hide/show layers based on the selected year
* On year-selection-change, remove the current layer and create a new one based on a server call to retrieve that year's data set
* Have a single layer with data properties for every year, then have the layer's fill expression contain a 'selected year' variable

After experimenting with the functionality available in the Mapbox API and comparing performance, the best option seems to have a single data source with a separate property for each year. We can then programatically update the map's style to switch the property used for the fill colour.

The following command, with the query specified in options.opt to work around the Windows command length limit, exports our data in geojson format.

```shell
& 'C:\Program Files\QGIS 3.22.10\bin\ogr2ogr.exe' -f GeoJSON co2.json "PG:host=localhost port=5433 dbname=gis user=postgres password=postgres" --optfile .\options.opt
```

# Thoughts on the data...

For a cloropleth, would co2 per area make more sense, or co2 per head maybe?
