from flask import Flask, send_from_directory
from strawberry.flask.views import GraphQLView
# from strawberry.subscriptions import GRAPHQL_TRANSPORT_WS_PROTOCOL, GRAPHQL_WS_PROTOCOL
from flask_cors import CORS
# from flask_mongoengine import MongoEngine as me
from api.schema import schema
from models import db

app = Flask(__name__, static_url_path='', static_folder='../frontend/build')
CORS(app)
app.config['MONGODB_SETTINGS'] = {
    'db': 'redocio',
    'host': 'localhost',
    'port': 27017
}

db.init_app(app)

# , subscription_protocols = [
#     GRAPHQL_TRANSPORT_WS_PROTOCOL,
#     GRAPHQL_WS_PROTOCOL,
# ]


@app.route("/", defaults={'path': ''})
def serve(path):
    return send_from_directory(app.static_folder, 'index.html')


app.add_url_rule(
    "/graphql",
    view_func=GraphQLView.as_view("graphql_view", schema=schema),
)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
