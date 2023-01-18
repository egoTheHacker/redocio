
class APIInterfaz:
    tipo: str
    propiedades: list[str]
    def buscar(self, search: str = '', condiciones: dict[str, str] = {}, limit: int = 10):
        raise NotImplementedError('Metodo no sobreescrito')
    
    def por_id(self, tipo: str, id: str):
        raise NotImplementedError('Metodo no sobreescrito')
    
    def top(self, n: int):
        raise NotImplementedError('Metodo no sobreescrito')

class ArticuloI:
    def __init__(self) -> None:
        self.id: str = ''
        self.titulo: str = ''
        self.tipo: str = 'articulo'
        self.fecha_salida: str = ''
        self.portada: str = ''
        self.editora: str = ''
        self.generos: list[str] = [] # terror, fantasia, no-ficción, etc
        self.creadores: list[str] = []
        self.sinopsis: str = ''  # SERIES: plot LIBROS: description JUEGOS: summary
        self.personajes: list[str] = []
        self.idioma: str = 'en'
