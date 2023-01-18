
from .articulos import Articulo, ArticuloP
from util import auto_generate_id, debug
from mongoengine import PULL
from . import db


class Usuario(db.Document):
    _id = db.StringField(primary_key=True, default=auto_generate_id)
    alias = db.StringField(required=True)
    correo = db.EmailField(required=True)
    clave = db.StringField(required=True)
    en_linea = db.BooleanField(default=False)
    # biblioteca = db.EmbeddedDocumentListField(Articulo)
    siguiendo = db.ReferenceField('self', reverse_delete_rule=PULL)
    seguidores = db.ReferenceField('self', reverse_delete_rule=PULL)
    avatar = db.StringField(default="")
    es_admin = db.BooleanField(default=False)


class Baneo(db.Document):
    _id = db.StringField(primary_key=True, default=auto_generate_id)
    usuario = db.ReferenceField('Usuario', reverse_delete_rule=db.CASCADE)
    timeout = db.IntField()  # 0 -> pa' toda la vida
    # Admin que ha baneado al usuario
    moderador = db.ReferenceField('Usuario', reverse_delete_rule=db.CASCADE)
