
import requests
from .utils import APIInterfaz, ArticuloI
from util import TipoArticulo

class APISeries(APIInterfaz):
    tipo: str = 'serie'
    def __init__(self, api_key) -> None:
        self.api = 'AdvancedSearch'
        self.__api_key = api_key
        self.__url = 'https://imdb-api.com/en/API/'
    
    @property
    def url(self):
        return self.__url + self.api + '/' + self.__api_key
    
    def buscar(self, search: str = '', campos: str = '', condiciones: dict[str, list] = {}, limit: int = 10):
        # print(self.url)
        condiciones_parsed = '&'.join(['='.join([c, ','.join(v)]) for c, v in condiciones.items()])
        claves = ['none', 'all', 'title', 'movie', 'series', 'name', 'episode', 'company', 'keyword']
        if campos in claves:
            self.api = 'Search' + (campos.capitalize() if campos != 'none' else '')
        if search and condiciones:
            raise ValueError(f'Input invalido. Debe buscar {search} o {condiciones}, pero no ambas a la vez')
        if campos and condiciones:
            raise ValueError(f'Input invalido. Debe buscar {campos} o {condiciones}, pero no ambas a la vez')
        return requests.get(self.url + '/' + search)
    
    def por_id(self, tipo: str, id: str):
        self.api = tipo.capitalize()
        return requests.get(self.url + '/' + id).json()
    
    def top_series(self):
        self.api = 'MostPopularTVs'
        return self.buscar()
    
    def top_peliculas(self):
        self.api = 'MostPopularMovies'
        return self.buscar()

class Serie(ArticuloI):
    def __init__(self, data: dict):
        super().__init__()
        self.id = data.get('id')
        self.tipo = TipoArticulo.SERIE.value
        self.titulo = data.get('title', '')
        self.fecha_salida = data.get('releaseDate', '')
        self.portada = data.get('image', '')
        self.editora = self.__editora_from_companies(data.get('companyList', []))
        self.generos = [x['value'] for x in data.get('genreList', [])]
        self.sinopsis = data.get('plot')
        self.personajes = [x.get('asCharacter') for x in data.get('actorList', [])]
    
    def __editora_from_companies(self, companies: list[dict]):
        aux = [x['name'] for x in companies] or ['']
        return aux[0]

class Pelicula(ArticuloI):
    def __init__(self, data: dict):
        super().__init__()
        self.id = data.get('id')
        self.tipo = TipoArticulo.PELICULA.value
        self.titulo = data.get('title', '')
        self.portada = data.get('image', '')
        self.fecha_salida = data.get('year', '')

