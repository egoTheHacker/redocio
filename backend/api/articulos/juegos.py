
from datetime import datetime
import requests
from .utils import APIInterfaz, ArticuloI
from util import TipoArticulo, debug


class APIJuegos(APIInterfaz):
    tipo: str = 'juego'
    propiedades: list[str] = [
        'name',
        'summary',
        'created_at',
        'game_localizations.name',
        'cover.url',
        'genres.name',
        'involved_companies.company.name',
        'involved_companies.publisher',
        'platforms.name']

    def __init__(self, client_id, token) -> None:
        self.headers = {
            'Client-ID': client_id,
            'Authorization': f'Bearer {token}'
        }
        self.api = 'games'
        self.__url = 'https://api.igdb.com/v4/'

    @property
    def url(self):
        return self.__url + self.api

    def buscar(self, search: str = '', campos: tuple[str] = None, condiciones: dict[str] = {}, limit: int = 10):
        campos = campos or tuple(self.propiedades)
        # print(self.url, campos)
        # print(campos)
        # debug('/api/articulos/juegos.py 36', self.url)
        campos_parsed = ','.join(campos)
        condiciones_parsed = '&'.join(
            ['='.join([c, v]) for c, v in condiciones.items()])
        query = f'fields {campos_parsed}; limit {limit};'
        if search:
            query += f'search "{search}";'
        if condiciones:
            query += f'where {condiciones_parsed};'
        # res = requests.post('https://api.igdb.com/v4/games', headers=self.headers, data='fields name,summary,url,cover; where id = 1942;')
        return requests.post(self.url, headers=self.headers, data=query)

    def top(self, n: int):
        return self.buscar(limit=n)

    def por_id(self, tipo: str, id):
        j = self.buscar(condiciones={'id': id}).json()
        if isinstance(j, list):
            return j[0]
        return j

    def obtener_portada(self, id):
        self.api = 'covers'
        return self.buscar(campos=('url',), condiciones={'id': id})


class Juego(ArticuloI):
    def __init__(self, data: dict):
        super().__init__()
        # debug('/api/articulos/juegos.py 65', data)
        ca = data.get('created_at')
        companies = data.get('involved_companies', [])
        # print('DATE:', datetime.fromtimestamp(ca).date())
        # debug('juegos.py 70', data.get('cover', {}))
        self.id = data.get('id')
        self.tipo = TipoArticulo.JUEGO.value
        self.titulo = data.get('name', '')
        self.sinopsis = data.get('summary', '')
        self.portada = data.get('cover', {}).get('url', '')
        self.generos = list(map(lambda x: x['name'], data.get('genres', [])))
        self.creadores = self.__creadores_from_companies(companies)
        self.plataformas = list(
            map(lambda x: x['name'], data.get('platforms', [])))
        self.editora = self.__editora_from_companies(companies)
        self.fecha_salida = datetime.fromtimestamp(ca).date()

    def __creadores_from_companies(self, companies: list[dict]):
        aux = filter(lambda x: not x.get('publisher'), companies)
        aux = list(map(lambda x: x.get('company', {}).get('name', ''), aux))
        return aux

    def __editora_from_companies(self, companies: list[dict]):
        aux = filter(lambda x: x.get('publisher'), companies)
        aux = list(
            map(lambda x: x.get('company', {}).get('name', ''), aux)) or ['']
        return aux[0]
