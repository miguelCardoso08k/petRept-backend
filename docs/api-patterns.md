# Padrões de API

Este documento define os padrões básicos para endpoints, respostas e erros da API.

## Endpoints REST

| Método  | Rota                   | Uso esperado                     |
| ------- | ---------------------- | -------------------------------- |
| `GET`   | `/customer`            | Lista clientes                   |
| `POST`  | `/customer`            | Cria um novo cliente             |
| `PATCH` | `/customer/:id/<data>` | Atualiza parcialmente um cliente |

## Resposta padrão

Controllers devem retornar um objeto com `message` e, quando houver payload, `data`.

### Com payload

```json
{
  "message": "User created successfully",
  "data": {}
}
```

### Sem payload

```json
{
  "message": "User deleted successfully"
}
```

Quando não houver dados adicionais, o retorno pode conter apenas `message`.

## Erros HTTP

| Status | Significado     | Quando usar                         |
| ------ | --------------- | ----------------------------------- |
| `400`  | Validação       | Payload inválido ou regra violada   |
| `401`  | Não autenticado | Usuário sem autenticação válida     |
| `403`  | Sem permissão   | Usuário autenticado, mas sem acesso |
| `404`  | Não encontrado  | Recurso inexistente                 |
