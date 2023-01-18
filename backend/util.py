
from enum import Enum
from hashlib import md5
from uuid import uuid4
from json import loads

import requests
from settings import SECRETO, IGDB_CLIENTID, IGDB_CLIENTSECRET

from typing import TYPE_CHECKING

# from models.usuarios import Usuario


if TYPE_CHECKING:
    from models.usuarios import Usuario
    from models.articulos import ArticuloDB


class TipoArticulo(Enum):
    ARTICULO = 0
    LIBRO = 1
    JUEGO = 2
    SERIE = 3
    PELICULA = 4


class TipoEstado(Enum):
    PENDIENTE = 1
    VIENDO = 2
    TERMINADO = 3


def verify_password(clave: str, clave_hash: str):
    clave = encode_clave(clave)
    return clave == clave_hash


def hash_password(clave: str):
    return encode_clave(clave)


def encode_clave(clave: str) -> str:
    passwd = clave+SECRETO
    return md5(passwd.encode('utf-8')).hexdigest()


def auto_generate_id() -> str:
    return str(uuid4())


def refresh_access_igdb():
    url = f'https://id.twitch.tv/oauth2/token?client_id={IGDB_CLIENTID}&client_secret={IGDB_CLIENTSECRET}&grant_type=client_credentials'
    # Refrescar cada 5323711 segundos
    return requests.post(url).json()


def debug(nombre: str = None, *targets, **opts):
    n = f'({nombre})' if nombre else ''
    print('DEBUG:::' + n, *targets, **opts)


def usuario_json(u: 'Usuario'):
    # debug('usuario_json', u.to_json())
    return loads(u.to_json())


def articulo_json(a: 'ArticuloDB'):
    return loads(a.to_json())
