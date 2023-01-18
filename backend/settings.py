
from dotenv import load_dotenv
import os

load_dotenv()

IGDB_CLIENTID = os.environ.get('IGDB_CLIENTID')
IGDB_CLIENTSECRET = os.environ.get('IGDB_CLIENTSECRET')
IGDB_TOKEN = os.environ.get('IGDB_TOKEN')
GOOGLE_APIKEY = os.environ.get('GOOGLE_APIKEY')
IMDB_APIKEY = os.environ.get('IMDB_APIKEY')
SECRETO = os.environ.get('SECRETO', 'secreto')
