
from datetime import date
from enum import Enum
from json import loads
import uuid
import strawberry
from strawberry import field
from models.articulos import EstadoUsuario
from models.articulos import RankingUsuario
# from backend.api.articulos.libros import APILibros
from util import TipoArticulo, TipoEstado, debug
from models.articulos import ArticuloDB
from models.usuarios import Usuario
from .articulos import obtenerAPI, librosA, juegosA, seriesA, APIJuegos, APISeries, APILibros, ArticuloFactory
from util import verify_password, hash_password, usuario_json, refresh_access_igdb, articulo_json


@strawberry.enum
class TipoE(Enum):
    ARTICULO = 0
    LIBRO = 1
    JUEGO = 2
    SERIE = 3
    PELICULA = 4


@strawberry.enum
class EstadoE(Enum):
    PENDIENTE = 1
    VIENDO = 2
    TERMINADO = 3


@strawberry.type
class ComentarioType:
    # _id: str
    contenido: str
    autor: 'UsuarioType'
    likes: list['UsuarioType'] = field(default_factory=list)
    dislikes: list['UsuarioType'] = field(default_factory=list)
    respuestas: list['ComentarioType'] = field(default_factory=list)


@strawberry.type
class ArticuloType:
    _id: str
    tipo: TipoE
    estado: EstadoE
    ranking: int
    guardado: bool
    comentarios: list[ComentarioType] | None = None


@strawberry.type
class RankingUsuarioType:
    usuario: Usuario
    puntuacion: int


@strawberry.type
class ArticuloPType:
    _id: str
    tipo: TipoE
    estado: EstadoE
    ranking: int
    guardado: list['UsuarioType']
    comentarios: list[ComentarioType] | None = None


@strawberry.type
class ArticuloDetalladoType:
    id: str
    tipo: int = TipoE.ARTICULO
    titulo: str
    fecha_salida: date
    portada: str
    editora: str
    generos: list[str] = field(default_factory=list)
    creadores: list[str]
    sinopsis: str | None
    personajes: list[str] = field(default_factory=list)
    idioma: str


@strawberry.type
class UsuResult:
    succeded: bool
    usuario: 'UsuarioType'


@strawberry.type
class LibroType(ArticuloDetalladoType):
    num_paginas: int


@strawberry.type
class JuegoType(ArticuloDetalladoType):
    plataformas: list[str]


@strawberry.type
class SerieType(ArticuloDetalladoType):
    num_episodios: int = 0


@strawberry.type
class PeliculaType(ArticuloDetalladoType):
    estreno: date = date.today()


@strawberry.type
class UsuarioType:
    _id: uuid.UUID
    alias: str
    correo: str
    clave: str
    en_linea: bool
    biblioteca: list[ArticuloType] = field(default_factory=list)
    siguiendo: list['UsuarioType'] = field(default_factory=list)
    seguidores: list['UsuarioType'] = field(default_factory=list)
    # campo_prueba: list[ArticuloType] = field(default_factory=list)
    avatar: str
    es_admin: bool


@strawberry.type
class Query:
    @strawberry.field
    def biblioteca(self, usuario: str) -> list[ArticuloType]:
        usu = Usuario.objects(_id=usuario).first()
        # return [articulo_parse(a) for a in usu.biblioteca] if usu else []
        return get_biblioteca(usu)

    @strawberry.field
    def articulos_app(self, usuario: str) -> list[ArticuloType]:
        u = Usuario.objects.get(_id=usuario)
        return [articulo_parse(a, u) for a in ArticuloDB.objects()]

    @strawberry.field
    def articulo(self, id: str, tipo: TipoE) -> ArticuloDetalladoType:
        t = TipoArticulo(tipo.value)
        articulosA = obtenerAPI(t)
        art = articulosA.por_id('none', id)
        return articulo_det_parse(t, art)

    @strawberry.field
    def articulos(self, limite: int = 10) -> list[ArticuloDetalladoType]:
        libros = librosA.top(limite).json()['items']
        juegos = juegosA.top(limite).json()
        series = seriesA.top_series().json()['items'][:limite]
        pelis = seriesA.top_peliculas().json()['items'][:limite]
        art = [articulo_det_parse(TipoArticulo.LIBRO, l) for l in libros] +\
            [articulo_det_parse(TipoArticulo.JUEGO, j) for j in juegos] +\
            [articulo_det_parse(TipoArticulo.SERIE, s) for s in series] +\
            [articulo_det_parse(TipoArticulo.PELICULA, p) for p in pelis]
        return art
        # print(refresh_access_igdb())
        # return []

    @strawberry.field
    def usuarios(self) -> list[UsuarioType]:
        # usuarios: list[UsuarioType] = []
        # usu = Usuario.objects.get(alias='usu1')
        # usu.campo_prueba
        # debug('usuarios', usu.__dict__)
        # usuario_parse(usu)
        # for usu in Usuario.objects():
        #     usu.campo_prueba
        # usuarios.append(usuario_parse(usu))
        return [usuario_parse(usu) for usu in Usuario.objects()]
        # return usuarios


@strawberry.type
class Mutation:
    @strawberry.field
    def signin(self, alias: str, correo: str, clave: str, gen_avatar: bool = False, es_admin: bool = False) -> UsuarioType:
        avatar = None
        if Usuario.objects(correo=correo).count() > 0:
            raise ValueError(
                'Error al registrar, pruebe con un correo válido.')
        if gen_avatar:
            avatar = f'https://robohash.org/{alias}.png' + \
                ('?set=set5' if es_admin else '')
        usu = Usuario(alias=alias, clave=hash_password(
            clave), correo=correo, es_admin=es_admin, avatar=avatar)
        usu.save()
        return usuario_parse(usu)

    @strawberry.field
    def login(self, correo: str, clave: str) -> UsuarioType:
        usu = Usuario.objects(correo=correo).first()
        if not usu or not verify_password(clave, usu.clave):
            raise ValueError(
                f'Error al iniciar sesión, pruebe con unas credenciales válidas.')
        usu.en_linea = True
        usu.save()
        # print(usu.__dict__)
        return usuario_parse(usu)

    @strawberry.field
    def logout(self, usuario: str) -> UsuarioType:
        usu: Usuario = Usuario.objects(_id=usuario).first()
        usu.en_linea = False
        usu.save()
        return usuario_parse(usu)

    @strawberry.field
    def modificar_usuario(self, id: str, alias: str | None = None, clave: str | None = None) -> UsuarioType:
        usu = Usuario.objects.get(_id=id)
        if alias and alias != usu.alias:
            usu.alias = alias
        if clave and not verify_password(clave, usu.clave):
            usu.clave = hash_password(clave)
        usu.save()
        return usuario_parse(usu)

    @strawberry.field
    def agregar_seguidor(self, usuario: str, seguidor: str) -> UsuarioType:
        usu = Usuario.objects(_id=usuario)
        seg = Usuario.objects(_id=seguidor)
        usu.update_one(add_to_set__seguidores=seg.first())
        seg.update_one(add_to_set__siguiendo=usu.first())
        usu.first().save()
        usu.first().save()
        return usuario_parse(usu.first())

    @strawberry.field
    def dejar_de_seguir(self, usuario: str, seguidor: str) -> UsuarioType:
        usu = Usuario.objects(_id=usuario)
        seg = Usuario.objects(_id=seguidor)
        usu.update_one(pull__seguidores=seg.first())
        seg.update_one(pull__siguiendo=usu.first())
        usu.first().save()
        usu.first().save()
        return usuario_parse(usu.first())

    @strawberry.field
    def ban_usuario(self, admin: str, usuario: str) -> UsuResult:
        raise NotImplementedError('Por implementar')

    @strawberry.field
    def unban_usuario(self, admin: str, usuario: str) -> UsuResult:
        raise NotImplementedError('Por implementar')

    @strawberry.field
    def unsubscribe(self, id: str) -> UsuResult:
        usu = Usuario.objects(_id=id).first()
        if usu:
            usu.delete()
            return UsuResult(succeded=True, usuario=usuario_parse(usu))
        return UsuResult(succeded=False, usuario=usuario_parse(usu))

    # @strawberry.field
    # def guardar_articulo(self, tipo: TipoE, usuario: str, articulo: str) -> ArticuloType:
    #     usu = Usuario.objects(_id=usuario)
    #     if usu.first().biblioteca and usu.first().biblioteca.get(_id=articulo):
    #         art = usu.first().biblioteca.get(_id=articulo)
    #         art.guardado = True
    #     else:
    #         art = Articulo(_id=articulo, tipo=TipoArticulo(
    #             tipo.value), guardado=True)
    #         usu.update_one(add_to_set__biblioteca=art)
    #     usu.first().save()
    #     return articulo_parse(art)

    @strawberry.field
    def guardar_articulo(self, tipo: TipoE, usuario: str, articulo: str) -> ArticuloType:
        usu = Usuario.objects.get(_id=usuario)
        try:
            art = ArticuloDB.objects.get(_id=articulo)
        except Exception as e:
            art = ArticuloDB(_id=articulo, tipo=TipoArticulo(tipo.value))
            art.save()
            art.update(add_to_set__rankings={
                       'usuario': usu._id, 'puntuacion': 0})
        art.update(add_to_set__bibliotecas=usu)
        # print(art.__dict__)
        return articulo_parse(art, usu)

    @strawberry.field
    def modificar_articulo(self, usuario: str, articulo: str, tipo: TipoE, estado: EstadoE | None = None, ranking: int | None = None) -> ArticuloType:
        usu = Usuario.objects.get(_id=usuario)
        # print('antes de art')
        # print(usu.first(), usu.first().biblioteca)
        # raise NotImplementedError('Probando cosas')
        art = None
        try:
            # art = usu.first().biblioteca.get(_id=articulo)
            art = ArticuloDB.objects.get(_id=articulo)
        except Exception as e:
            # print('cosas malas pasan. Puede que biblioteca este vacío')
            art = ArticuloDB(_id=articulo, tipo=TipoArticulo(tipo.value))
            art.save()
        finally:
            if estado is not None:
                # Encuentra o no el estado en la base
                stat = art.estados.filter(usuario=usu)
                if stat:
                    e = TipoEstado(
                        estado.value) if estado else TipoEstado.PENDIENTE
                    stat.update(estado=estado)
                else:
                    stat = EstadoUsuario(usuario=usuario, estado=e)
                    art.update(add_to_set__estados=stat)
            if ranking is not None:
                rank = art.rankings.filter(usuario=usu)
                if rank:
                    rank.update(puntuacion=ranking)
                else:
                    print(ranking)
                    rank = RankingUsuario(
                        usuario=usuario, puntuacion=ranking or 0)
                    art.update(add_to_set__rankings=rank)
        art.save()
        # debug('/api/schema.py 307', art.to_json())
        return articulo_parse(art, usu)

    @strawberry.field
    def borrar_articulo(self, usuario: str, articulo: str) -> ArticuloType:
        usu = Usuario.objects.get(_id=usuario)
        # art = usu.biblioteca.get(_id=articulo)
        try:
            art = ArticuloDB.objects.get(_id=articulo)
            art.update(pull__bibliotecas=usu)
            art.save()
            return articulo_parse(art, usu)
        except Exception as e:
            raise ValueError('Intentando borrar algo que no existe')
        # art.guardado = False
        # Usuario.objects(_id=usuario).update_one(pull__biblioteca=art)
        # usu.save()

    @strawberry.field
    def comentar_articulo(self, usuario: str, articulo: str, tipo: TipoE, contenido: str) -> ComentarioType:
        usu = Usuario.objects.get(_id=usuario)
        art = None
        try:
            # art = usu.first().biblioteca.get(_id=articulo)
            art: ArticuloDB = ArticuloDB.objects.get(_id=articulo)
        except Exception as e:
            art = ArticuloDB(_id=articulo, tipo=TipoArticulo(
                tipo.value))
            art.save()
        finally:
            com = ComentarioType(autor=usu, contenido=contenido)
            art.update(push__comentarios=com)
        return com

    @strawberry.field
    def upvote_comentario(self, usuario: str, comentario: str) -> ComentarioType:
        usu = Usuario.objects.get(_id=usuario)
        com = ArticuloDB.comentarios.filter(_id=comentario)
        if com:
            # com.update()
            print(com.likes)


def usuario_parse(u: Usuario) -> UsuarioType:
    usu = usuario_json(u)
    # debug('usuario_parse', usu)
    # campo_prueba = [ArticuloPType(**a) for a in usu.pop('campo_prueba', [])]
    # biblioteca = [ArticuloType(**a) for a in usu.pop('biblioteca', [])]
    biblioteca = get_biblioteca(u)
    # debug('usuario_parse', biblioteca)
    seguidores = [UsuarioType(**usuario_json(Usuario.objects.get(_id=s)))
                  for s in usu.pop('seguidores', [])]
    siguiendo = [UsuarioType(**usuario_json(Usuario.objects.get(_id=s)))
                 for s in usu.pop('siguiendo', [])]
    # print('DEBUG:::(usuario_parse)', usu.get('alias'), seguidores)
    return UsuarioType(**usu, biblioteca=biblioteca, siguiendo=siguiendo, seguidores=seguidores)
    # return UsuarioType(**usu, biblioteca=biblioteca)


def get_biblioteca(u: Usuario) -> list[ArticuloType]:
    b = []
    for a in ArticuloDB.objects:
        # print([usu for usu in a.bibliotecas if u._id == usu._id])
        if [usu for usu in a.bibliotecas if u._id == usu._id]:
            b.append(articulo_parse(a, u))
    # debug('get_biblioteca', b)
    return b


# def biblioteca_parse(**data):
#     pass


def articulo_parse(a: ArticuloDB, u: Usuario) -> ArticuloType:
    art = articulo_json(a)
    _id = art.pop('_id')
    rankings: list[dict] = art.pop('rankings', [])
    estados: list[dict] = art.pop('estados', [])
    guardado: bool = bool([usu for usu in a.bibliotecas if usu._id == u._id])
    # debug('articulo_parse', guardado)
    r_middle = [
        r.get('puntuacion', 0)
        for r in rankings if r.get('usuario', '') == u._id
    ]
    ranking = 0 if len(r_middle) == 0 else r_middle[0]
    # ranking = 0 if len(rankings) == 0 else [
    #     [puntuacion for usuario, puntuacion in r.items()] for r in rankings if usuario == u._id][0]
    tipo = art.pop('tipo')
    estado = EstadoE.PENDIENTE if len(estados) == 0 else [
        e.get('estado', EstadoE.PENDIENTE) for e in estados if e.get('usuario', '') == u._id
        # valor for usuario, valor in estados.items() if usuario == u._id
    ][0]
    return ArticuloType(_id=_id, ranking=ranking, tipo=tipo, guardado=guardado, estado=estado)


def articulo_det_parse(tipo: TipoArticulo, data: dict) -> ArticuloDetalladoType:
    a = ArticuloFactory(tipo, data)
    T: type
    match(tipo):
        case TipoArticulo.LIBRO:
            T = LibroType
        case TipoArticulo.JUEGO:
            T = JuegoType
        case TipoArticulo.SERIE:
            T = SerieType
        case TipoArticulo.PELICULA:
            T = PeliculaType
        case _:
            T = ArticuloDetalladoType
            raise ValueError('No contemplado')
    return T(**a.__dict__)


schema = strawberry.Schema(query=Query, mutation=Mutation)
