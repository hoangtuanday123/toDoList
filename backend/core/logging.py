import logging
import json

def config_log():
    with open("log.json", "r") as f:
        config = json.load(f)
        logging.config.dictConfig(config)