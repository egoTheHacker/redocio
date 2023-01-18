
from . import db
from util import TipoArticulo, TipoEstado
from typing import TYPE_CHECKING


if TYPE_CHECKING:
    from .usuarios import Usuario


class Articulo(db.EmbeddedDocument):
    _id = db.StringField(primary_key=True)
    tipo = db.EnumField(TipoArticulo, default=TipoArticulo.ARTICULO)
    estado = db.EnumField(TipoEstado, default=TipoEstado.PENDIENTE)
    ranking = db.IntField(default=0)
    guardado = db.BooleanField(default=False)
    siguiendo = db.BooleanField(default=False)


class Comentario(db.EmbeddedDocument):
    _id = db.StringField(primary_key=True)
    contenido = db.StringField(required=True)
    autor = db.ReferenceField('Usuario', required=True)
    likes = db.ListField(db.ReferenceField('Usuario'))
    dislikes = db.ListField(db.ReferenceField('Usuario'))
    respuestas = db.ListField(db.ReferenceField('self'))


class RankingUsuario(db.EmbeddedDocument):
    usuario = db.ReferenceField('Usuario')
    puntuacion = db.IntField(default=0)


class EstadoUsuario(db.EmbeddedDocument):
    usuario = db.ReferenceField('Usuario')
    estado = db.EnumField(TipoEstado, default=TipoEstado.PENDIENTE)


class ArticuloDB(db.Document):
    meta = {'collection': 'articulo'}
    _id = db.StringField(primary_key=True)
    tipo = db.EnumField(TipoArticulo, default=TipoArticulo.ARTICULO)
    seguidores = db.ReferenceField('Usuario')
    bibliotecas = db.ListField(db.ReferenceField('Usuario'))
    comentarios = db.EmbeddedDocumentListField(Comentario)
    rankings = db.EmbeddedDocumentListField(RankingUsuario)
    estados = db.EmbeddedDocumentListField(EstadoUsuario)


class ArticuloP(db.Document):
    _id = db.StringField(primary_key=True)
    tipo = db.EnumField(TipoArticulo, default=TipoArticulo.ARTICULO)
    estado = db.EnumField(TipoEstado, default=TipoEstado.PENDIENTE)
    ranking = db.IntField(default=0)
    guardado = db.ListField(db.ReferenceField('Usuario'))
    siguiendo = db.BooleanField(default=False)


# ArticuloP
