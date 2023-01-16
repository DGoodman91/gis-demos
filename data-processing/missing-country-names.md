"ANTARCTIC FISHERIES"
"BONAIRE, SAINT EUSTATIUS, AND SABA"
"CHINA (MAINLAND)"
"CHRISTMAS ISLAND"
"CURACAO"
"DEMOCRATIC PEOPLE S REPUBLIC OF KOREA"
"DEMOCRATIC REPUBLIC OF VIETNAM"
"EAST & WEST PAKISTAN"
"FAEROE ISLANDS"
"FEDERATION OF MALAYA-SINGAPORE"
"FORMER DEMOCRATIC YEMEN"
"FORMER PANAMA CANAL ZONE"
"FORMER YEMEN"
"FRENCH EQUATORIAL AFRICA"
"FRENCH GUIANA"
"FRENCH INDO-CHINA"
"FRENCH WEST AFRICA"
"GUADELOUPE"
"JAPAN (EXCLUDING THE RUYUKU ISLANDS)"
"KUWAITI OIL FIRES"
"LEEWARD ISLANDS"
"MARTINIQUE"
"NETHERLAND ANTILLES"
"NETHERLAND ANTILLES AND ARUBA"
"OCCUPIED PALESTINIAN TERRITORY"
"PACIFIC ISLANDS (PALAU)"
"PENINSULAR MALAYSIA"
"REPUBLIC OF KOREA"
"REPUBLIC OF SOUTH VIETNAM"
"REUNION"
"RHODESIA-NYASALAND"
"RUSSIAN FEDERATION"
"RWANDA-URUNDI"
"RYUKYU ISLANDS"
"SABAH"
"SAO TOME & PRINCIPE"
"SARAWAK"
"ST. KITTS-NEVIS"
"ST. KITTS-NEVIS-ANGUILLA"
"TANGANYIKA"
"UNITED KOREA"
"WALLIS AND FUTUNA ISLANDS"
"ZANZIBAR"


* The gap between Western Sahara & Mauritiana is broken :( Google maps makes it look like the space in our gap should be part of Western Sahara

* What is the hole in kazakhstan

* Somalia is missing a chunk..

* Small gap between Pakistan and China

* ISSUE: pre-unification, emission data is split between "FEDERAL REPUBLIC OF GERMANY" and "FORMER GERMAN DEMOCRATIC REPUBLIC". Need the boundary geometry for them.
  RESOLUTION: obtain the boundary data from somewhere??? :(
                                              https://censusmosaic.demog.berkeley.edu/data/historical-gis-files ???
                                              https://www.arcgis.com/home/item.html?id=5512678acc9540f5aed157b9c788ad57 ???
              imported into QGIS then into postgresql as per https://naysan.ca/2020/07/26/upload-a-shapefile-into-a-postgis-table-using-qgis/
              while importing, converted to SRID 4326


* ISSUE: The emissions data for Vietnam in range [1946, 1969] is split into north & south. Solution is same as for germany, but I'm not too clear on these dates and how well they match up with the splitting & reunion of vietnam.

* Pre-split, emission data comes from "CZECHOSLOVAKIA". Need to UNION Czechnia and Slovakia's borders and add a countries record for it

* We have no emissions data for kosovo. Is it being included in Serbia?

- ISSUE: Yugoslavia breakup, similar to the USSR.
- RESOLUTION: Create union country records with appropriate years_active fields
              The co2 emission data has records for "Yugoslavia (Former Socialist Federal Republic)" from 1880 until 1991, but Yugoslavia didn't exist until the end of the First World War, so this needs clearing up.