
from .libros import APILibros, Libro
from .juegos import APIJuegos, Juego
from .series import APISeries, Serie, Pelicula
from util import TipoArticulo
from settings import GOOGLE_APIKEY, IGDB_CLIENTID, IGDB_TOKEN, IMDB_APIKEY

librosA = APILibros(GOOGLE_APIKEY)
juegosA = APIJuegos(IGDB_CLIENTID, IGDB_TOKEN)
seriesA = APISeries(IMDB_APIKEY)

def obtenerAPI(tipo: TipoArticulo) -> APIJuegos | APILibros | APISeries:
    tipos = {
        TipoArticulo.LIBRO: APILibros(GOOGLE_APIKEY),
        TipoArticulo.JUEGO: APIJuegos(IGDB_CLIENTID, IGDB_TOKEN),
        TipoArticulo.SERIE: APISeries(IMDB_APIKEY),
        TipoArticulo.PELICULA: APISeries(IMDB_APIKEY),
    }
    return tipos[tipo]

def ArticuloFactory(tipo: TipoArticulo, data: dict):
    tipos = {
        TipoArticulo.LIBRO: Libro,
        TipoArticulo.JUEGO: Juego,
        TipoArticulo.SERIE: Serie,
        TipoArticulo.PELICULA: Pelicula,
    }
    return tipos[tipo](data)
