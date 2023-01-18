
import requests
from .utils import APIInterfaz, ArticuloI
from util import TipoArticulo

class APILibros(APIInterfaz):
    tipo: str = 'libro'
    
    def __init__(self, api_key) -> None:
        self.url: str = f'https://www.googleapis.com/books/v1/volumes'
        self.__key = api_key
    
    def buscar(self, search: str = '*', condiciones: dict[str, str] = {}, limit: int = 10):
        claves = ['intitle', 'inauthor', 'inpublisher', 'subject', 'isbn', 'lccn', 'oclc']
        condiciones_parsed = '+'.join([':'.join([c, v]) for c, v in condiciones.items() if c in claves])
        search_parsed = '+'.join(search.split(' '))
        query = f'q={search_parsed}'
        if condiciones:
            query += f'+{condiciones_parsed}'
        query += f'&maxResults={limit}'
        return requests.get(f'{self.url}?key={self.__key}&{query}')
        # return f'{self.url}&{query}'
    
    def por_id(self, tipo: str, id):
        return requests.get(f'{self.url}/{id}').json()
    
    def top(self, n: int):
        return self.buscar(limit=n)

class Libro(ArticuloI):
    def __init__(self, data: dict):
        super().__init__()
        vi = data.get('volumeInfo', {})
        self.id = data.get('id')
        self.tipo = TipoArticulo.LIBRO.value
        self.creadores = vi.get('authors', [])
        self.titulo = vi.get('title', '')
        self.fecha_salida = vi.get('publishedDate', '')
        self.sinopsis = vi.get('description', '')
        self.generos = vi.get('categories', [])
        self.portada = vi.get('imageLinks', {}).get('thumbnail', '')
        self.idioma = vi.get('language', 'en')
        self.editora = vi.get('publisher', '')
        self.num_paginas = vi.get('pageCount', 0)
