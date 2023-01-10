from configparser import SafeConfigParser


def pgsql():

    return read_section(section='postgresql')


def server():

    return read_section(section='server')


def read_section(filename='config.ini', section='default'):

    # create a parser
    parser = SafeConfigParser()
    # read config file
    parser.read(filename)

    # get section
    cfg = {}
    if parser.has_section(section):
        params = parser.items(section)
        for param in params:
            cfg[param[0]] = param[1]
    else:
        raise Exception(
            'Section {0} not found in the {1} file'.format(section, filename))

    return cfg
