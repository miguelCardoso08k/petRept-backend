# Arquitetura e Convenções do Backend

Este documento registra as decisões de arquitetura e os padrões de código esperados para o backend.

## Contexto

O projeto é dividido em:

- `frontend`
- `backend`

Este documento cobre exclusivamente o backend.

## Responsabilidades do backend

O backend deve ser:

- Resiliente.
- Independente do frontend.
- Responsável por todas as regras de negócio.
- A fonte única de verdade dos dados.

## Arquitetura escolhida

| Item        | Decisão                      |
| ----------- | ---------------------------- |
| Estilo      | Monólito modular             |
| Framework   | NestJS                       |
| Organização | Módulos isolados por domínio |

### Motivação

- O sistema atende apenas um pet shop.
- A escala esperada é linear e previsível.
- Microserviços adicionariam complexidade desnecessária neste estágio.
- Um monólito modular facilita o desenvolvimento e a manutenção inicial.

### Trade-off

Essa escolha reduz a flexibilidade para escalar partes isoladas horizontalmente no futuro, mas deixa o sistema muito mais simples de evoluir agora.

## Organização de módulos

A estrutura base deve seguir:

```text
src/modules/<module>
```

Exemplos:

```text
src/modules/user
src/modules/auth
src/modules/customer
```

Cada módulo deve ser isolado por responsabilidade.

## Princípio fundamental

Cada módulo é dono do seu domínio e não deve assumir responsabilidades de outros módulos.

## Services

Services devem ser semânticos, específicos e isolados.

### Regra principal

Um service trata apenas do seu próprio domínio.

| Correto                                 | Incorreto                                                         |
| --------------------------------------- | ----------------------------------------------------------------- |
| `user.service.ts` com lógica de usuário | `user.service.ts` com usuário, autenticação, cliente e financeiro |
| `auth.service.ts` com autenticação      | `auth.service.ts` controlando regras de cliente                   |
| `customer.service.ts` com clientes      | `customer.service.ts` cuidando de faturamento                     |

## Dependência entre services

Evite dependência direta entre services de domínios diferentes.

### Evitar

```text
AuthService -> UserService
```

### Preferir

```text
AuthService -> UserRepository
```

Ou uma abstração específica:

```text
AuthService -> UserIdentityProvider
```

## Injeção de dependência

O projeto deve usar o sistema de DI do NestJS com foco em contratos, não em implementações concretas.

### Regra

Sempre depender de interfaces ou abstrações.

| Correto                         | Incorreto                             |
| ------------------------------- | ------------------------------------- |
| `UserService -> UserRepository` | `UserService -> PrismaUserRepository` |

## Repositories

### Contrato

```ts
export abstract class UserRepository {
  abstract findById(id: string): Promise<User | null>;
}
```

### Implementação

```ts
export class PrismaUserRepository implements UserRepository {
  // implementação com Prisma
}
```

### Registro no módulo

```ts
{
  provide: UserRepository,
  useClass: PrismaUserRepository,
}
```

## Convenções de nome

| Tipo                              | Convenção                            | Exemplo                   |
| --------------------------------- | ------------------------------------ | ------------------------- |
| Variáveis, propriedades e métodos | `camelCase`                          | `createdAt`               |
| Classes                           | `PascalCase`                         | `UserService`             |
| Banco de dados                    | `snake_case`                         | `customer_id`             |
| Arquivos                          | Nome descritivo por responsabilidade | `create-user.use-case.ts` |

## Exemplos de arquivos

```text
auth.service.ts
user.service.ts
prisma-user.repository.ts
create-user.dto.ts
```

## Princípios gerais

- Backend não depende do frontend.
- Nunca confiar no frontend para regras de negócio.
- Validação deve acontecer no backend.
- Evitar acoplamento entre módulos.
- Evitar services com múltiplas responsabilidades.
- Sempre depender de contratos.
- Manter arquivos semânticos e específicos.

## Objetivo

Essa arquitetura foi escolhida para:

- Evitar crescimento desorganizado.
- Facilitar manutenção.
- Manter clareza no código.
- Permitir evolução sem grandes refatorações.
- Garantir consistência das regras de negócio.

## Resumo

- NestJS com monólito modular.
- Módulos isolados por domínio.
- Services com responsabilidade única.
- Repositories baseados em contratos.
- Dependência via abstração.
- Backend independente do frontend.
