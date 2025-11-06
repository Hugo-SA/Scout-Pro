import json
from flask import Flask, jsonify, request, Response
from flask_cors import CORS

class JsonDataProvider:

    # O metodo deve ter o nome que será utilizado na URL: const baseURL = `${BASE_URL}/usuarios`;
    # Basta adicionar todos os JSONs aqui
    # Já está implementado os métodos GET, POST, UPDATE e DELETE
    def usuarios(self):
        return [
            { "id": 1, "login": "usuario01", "senha": "1", "senhaRepeticao": "1", "cpf": "111111111", "admin": True },
            { "id": 2, "login": "usuario02", "senha": "1", "senhaRepeticao": "1", "cpf": "111111111", "admin": True },
            { "id": 3, "login": "usuario03", "senha": "1", "senhaRepeticao": "1", "cpf": "111111111", "admin": True },
            { "id": 4, "login": "usuario04", "senha": "1", "senhaRepeticao": "1", "cpf": "111111111", "admin": False },
            { "id": 5, "login": "usuario05", "senha": "1", "senhaRepeticao": "1", "cpf": "111111111", "admin": False }
        ].copy()

    def times(self):
        return [
            { "id": 1, "nome": "Time 1", "idTecnico": "1", "idJogador": "1" },
            { "id": 2, "nome": "Time 2", "idTecnico": "2", "idJogador": "2" },
            { "id": 3, "nome": "Time 3", "idTecnico": "3", "idJogador": "3" },
            { "id": 4, "nome": "Time 4", "idTecnico": "4", "idJogador": "4" }
        ].copy()

    def jogadores(self):
        return [
            { "id": 1, "idTecnico": "1", "nome": "Jogador 1", "idade": "1", "pePreferido": "esquerdo", "posicao": "goleiro", "altura": "1" },
            { "id": 2, "idTecnico": "2", "nome": "Jogador 2", "idade": "1", "pePreferido": "esquerdo", "posicao": "atacante", "altura": "1" },
            { "id": 3, "idTecnico": "3", "nome": "Jogador 3", "idade": "1", "pePreferido": "esquerdo", "posicao": "meio-campo", "altura": "1" },
            { "id": 4, "idTecnico": "4", "nome": "Jogador 4", "idade": "1", "pePreferido": "direito", "posicao": "lateral", "altura": "1" },
            { "id": 5, "idTecnico": "5", "nome": "Jogador 5", "idade": "1", "pePreferido": "direito", "posicao": "zagueiro", "altura": "1" }
        ].copy()

    def competicao(self):
        return [
            { "id": 1, "idTime": "1", "nome": "Competicao 1", "dataInicio": "11-11-1111", "dataTermino": "22-22-2222" },
            { "id": 2, "idTime": "2", "nome": "Competicao 2", "dataInicio": "11-11-1111", "dataTermino": "22-22-2222" },
            { "id": 3, "idTime": "3", "nome": "Competicao 3", "dataInicio": "11-11-1111", "dataTermino": "22-22-2222" },
            { "id": 4, "idTime": "4", "nome": "Competicao 4", "dataInicio": "11-11-1111", "dataTermino": "22-22-2222" },
            { "id": 5, "idTime": "5", "nome": "Competicao 5", "dataInicio": "11-11-1111", "dataTermino": "22-22-2222" }
        ].copy()

    def tecnico(self):
        return [
            { "id": 1, "nome": "Tecnico 1", "idade": "1" },
            { "id": 2, "nome": "Tecnico 2", "idade": "1" },
            { "id": 3, "nome": "Tecnico 3", "idade": "1" },
            { "id": 4, "nome": "Tecnico 4", "idade": "1" },
            { "id": 5, "nome": "Tecnico 5", "idade": "1" }
        ].copy()

class ResourceService:
    def __init__(self, provider: JsonDataProvider):
        self._provider = provider
        self._data_stores = {}

    def _get_store(self, resource_name):
        if resource_name not in self._data_stores:
            if hasattr(self._provider, resource_name):
                data_method = getattr(self._provider, resource_name)
                self._data_stores[resource_name] = data_method()
            else:
                return None
        return self._data_stores.get(resource_name)

    def get_all(self, resource_name):
        data_list = self._get_store(resource_name)
        return data_list if data_list is not None else []

    def get_by_id(self, resource_name, item_id):
        data_list = self._get_store(resource_name)
        if data_list is None:
            return None
        
        for item in data_list:
            if item.get('id') == int(item_id):
                return item
        return None

    def create(self, resource_name, data):
        data_list = self._get_store(resource_name)
        if data_list is None:
            return None

        max_id = max(item['id'] for item in data_list) if data_list else 0
        new_id = max_id + 1
        
        new_item = data.copy()
        new_item['id'] = new_id
        data_list.append(new_item)
        
        return new_item

    def update(self, resource_name, item_id, data):
        data_list = self._get_store(resource_name)
        if data_list is None:
            return None

        index = next((i for i, item in enumerate(data_list) 
                      if item.get('id') == int(item_id)), None)

        if index is not None:
            data['id'] = int(item_id)
            data_list[index] = data
            return data
        return None

    def delete_by_id(self, resource_name, item_id):
        data_list = self._get_store(resource_name)
        if data_list is None:
            return False
        
        item_encontrado = self.get_by_id(resource_name, item_id)
        
        if item_encontrado:
            data_list.remove(item_encontrado)
            return True
        return False

class ApiServer:
    def __init__(self, resource_service: ResourceService, resource_names: list):
        self.app = Flask(__name__)
        self.resource_service = resource_service
        
        CORS(self.app, resources={
            r"/*": {
                "origins": "*",
                "allow_headers": ["Content-Type", "Authorization"]
            }
        })
        
        self.register_routes(resource_names)

    def _create_json_response(self, data, status_code=200):
        response_data = json.dumps(data, ensure_ascii=False)
        return Response(response_data, 
                        content_type='application/json; charset=utf-8', 
                        status=status_code)

    def register_routes(self, resource_names: list):
        
        for name in resource_names:
            
            def create_get_all_handler(resource_name=name):
                def get_all_handler():
                    dados = self.resource_service.get_all(resource_name)
                    return self._create_json_response(dados)
                return get_all_handler

            def create_get_one_handler(resource_name=name):
                def get_one_handler(id):
                    item = self.resource_service.get_by_id(resource_name, id)
                    if item:
                        return self._create_json_response(item)
                    return self._create_json_response({"error": "Item não encontrado"}, 404)
                return get_one_handler

            def create_post_handler(resource_name=name):
                def post_handler():
                    data = request.json
                    new_item = self.resource_service.create(resource_name, data)
                    return self._create_json_response(new_item, 201)
                return post_handler

            def create_put_handler(resource_name=name):
                def put_handler(id):
                    data = request.json
                    updated_item = self.resource_service.update(resource_name, id, data)
                    if updated_item:
                        return self._create_json_response(updated_item)
                    return self._create_json_response({"error": "Item não encontrado"}, 404)
                return put_handler

            def create_delete_handler(resource_name=name):
                def delete_handler(id):
                    success = self.resource_service.delete_by_id(resource_name, id)
                    if success:
                        return jsonify({"message": f"Item {id} excluído de {resource_name}"}), 200
                    return self._create_json_response({"error": "Item não encontrado"}, 404)
                return delete_handler

            base_url = f'/{name}'
            id_url = f'/{name}/<int:id>'

            self.app.add_url_rule(base_url, endpoint=f"get_all_{name}", view_func=create_get_all_handler(), methods=['GET'])
            self.app.add_url_rule(base_url, endpoint=f"create_{name}", view_func=create_post_handler(), methods=['POST'])
            self.app.add_url_rule(id_url, endpoint=f"get_one_{name}", view_func=create_get_one_handler(), methods=['GET'])
            self.app.add_url_rule(id_url, endpoint=f"update_{name}", view_func=create_put_handler(), methods=['PUT'])
            self.app.add_url_rule(id_url, endpoint=f"delete_{name}", view_func=create_delete_handler(), methods=['DELETE'])

    def run(self):
        print("Iniciando API Flask em http://0.0.0.0:5000")
        print("Rotas registradas:")
        for rule in self.app.url_map.iter_rules():
            if rule.endpoint != 'static':
                print(f"- {rule.methods} {rule}")
        
        self.app.run(debug=True, use_reloader=False, port=5000, host='0.0.0.0')

if __name__ == '__main__':
    json_provider = JsonDataProvider()
    
    resource_names = [
        func for func in dir(json_provider) 
        if callable(getattr(json_provider, func)) and not func.startswith("_")
    ]
    
    resource_service = ResourceService(json_provider)
    
    api_server = ApiServer(resource_service, resource_names)
    
    api_server.run()