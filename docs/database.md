# Modelagem de Banco de Dados

Este documento descreve as entidades principais do sistema, seus campos, relacionamentos e fluxos de negócio.

## Visão geral

```text
customers
├── pets
├── customer_package_subscriptions
│   └── customer_package_cycles
│       └── customer_package_service_credits
│           └── customer_package_credit_usages
└── service_appointments

packages
└── package_services
    └── services
        └── service_prices

users
└── service_appointments
```

## Entidades

### 1. `customers`

Representa o cliente ou tutor responsável pelos pets.

#### Campos

| Campo | Tipo sugerido | Descrição |
| ----- | ------------- | --------- |
| `id` | UUID | Identificador único do cliente |
| `name` | string | Nome do cliente |
| `phone` | string | Telefone principal |
| `whatsapp` | string | Número usado para notificações |
| `email` | string | Email do cliente |
| `registered_at` | datetime | Data de cadastro |
| `is_active` | boolean | Indica se o cliente está ativo |

#### Relacionamentos

- Um `customer` pode ter muitos `pets`.
- Um `customer` pode ter muitas `customer_package_subscriptions`.
- Um `customer` pode ter muitos `service_appointments`.

### 2. `pets`

Representa os animais vinculados a um cliente.

#### Campos

| Campo | Tipo sugerido | Descrição |
| ----- | ------------- | --------- |
| `id` | UUID | Identificador único do pet |
| `customer_id` | UUID | Cliente dono do pet |
| `name` | string | Nome do pet |
| `breed` | string | Raça |
| `size` | enum | Porte: `SMALL`, `MEDIUM`, `LARGE` |
| `notes` | text | Observações gerais |
| `is_active` | boolean | Indica se o pet está ativo |

#### Relacionamentos

- Um `pet` pertence a um `customer`.
- Um `pet` pode ter muitos `service_appointments`.

### 3. `users`

Representa os funcionários que usam o sistema.

#### Campos

| Campo | Tipo sugerido | Descrição |
| ----- | ------------- | --------- |
| `id` | UUID | Identificador único do usuário |
| `name` | string | Nome do funcionário |
| `email` | string | Email usado no login |
| `password_hash` | string | Senha criptografada |
| `role` | enum | Perfil: `ADMIN`, `EMPLOYEE` |
| `is_active` | boolean | Indica se o usuário está ativo |

#### Relacionamentos

- Um `user` pode registrar muitos `service_appointments`.

### 4. `services`

Representa os serviços oferecidos pelo pet shop.

Exemplos:

- Banho.
- Tosa.
- Tosa higiênica.

#### Campos

| Campo | Tipo sugerido | Descrição |
| ----- | ------------- | --------- |
| `id` | UUID | Identificador único do serviço |
| `name` | string | Nome do serviço |
| `description` | text | Descrição do serviço |
| `is_active` | boolean | Indica se o serviço está disponível |

#### Relacionamentos

- Um `service` pode ter muitos `service_prices`.
- Um `service` pode estar em muitos `package_services`.
- Um `service` pode aparecer em muitos `service_appointments`.

### 5. `service_prices`

Representa o preço base de um serviço de acordo com o porte do pet.

#### Campos

| Campo | Tipo sugerido | Descrição |
| ----- | ------------- | --------- |
| `id` | UUID | Identificador único do preço |
| `service_id` | UUID | Serviço ao qual o preço pertence |
| `pet_size` | enum | Porte: `SMALL`, `MEDIUM`, `LARGE` |
| `base_price` | decimal | Valor base do serviço para aquele porte |
| `is_active` | boolean | Indica se esse preço está ativo |

#### Relacionamentos

- Um `service_price` pertence a um `service`.

#### Exemplo

| Service | Pet size | Base price |
| ------- | -------- | ---------: |
| Bath | SMALL | 50.00 |
| Bath | MEDIUM | 70.00 |
| Bath | LARGE | 90.00 |

### 6. `packages`

Representa o modelo de pacote vendido pelo pet shop.

Exemplo: `Monthly Basic Package`.

#### Campos

| Campo | Tipo sugerido | Descrição |
| ----- | ------------- | --------- |
| `id` | UUID | Identificador único do pacote |
| `name` | string | Nome do pacote |
| `description` | text | Descrição do pacote |
| `total_price` | decimal | Valor total do pacote |
| `duration_days` | integer | Duração do pacote em dias |
| `is_active` | boolean | Indica se o pacote está disponível |

#### Relacionamentos

- Um `package` pode ter muitos `package_services`.
- Um `package` pode ter muitas `customer_package_subscriptions`.

### 7. `package_services`

Representa quais serviços fazem parte de um pacote.

#### Campos

| Campo | Tipo sugerido | Descrição |
| ----- | ------------- | --------- |
| `id` | UUID | Identificador único |
| `package_id` | UUID | Pacote relacionado |
| `service_id` | UUID | Serviço incluído |
| `included_quantity` | integer | Quantidade incluída no pacote |

#### Relacionamentos

- Um `package_service` pertence a um `package`.
- Um `package_service` referencia um `service`.

#### Exemplo

| Package | Service | Included quantity |
| ------- | ------- | ----------------: |
| Monthly Basic | Bath | 4 |
| Monthly Basic | Hygienic Grooming | 1 |

### 8. `customer_package_subscriptions`

Representa o contrato ou assinatura do cliente com um pacote.

Essa tabela não representa um mês específico. Ela representa o vínculo contínuo do cliente com aquele pacote.

#### Campos

| Campo | Tipo sugerido | Descrição |
| ----- | ------------- | --------- |
| `id` | UUID | Identificador único da assinatura |
| `customer_id` | UUID | Cliente que contratou |
| `package_id` | UUID | Pacote contratado |
| `contracted_price` | decimal | Valor contratado no momento da assinatura |
| `auto_renew` | boolean | Indica se renova automaticamente |
| `subscription_started_at` | datetime | Data de início da assinatura |
| `last_renewed_at` | datetime | Última renovação feita |
| `renewal_day` | integer | Dia do mês previsto para renovação |
| `status` | enum | `ACTIVE`, `PAUSED`, `CANCELED`, `ENDED` |

#### Relacionamentos

- Uma `customer_package_subscription` pertence a um `customer`.
- Uma `customer_package_subscription` pertence a um `package`.
- Uma `customer_package_subscription` possui muitos `customer_package_cycles`.

### 9. `customer_package_cycles`

Representa cada ciclo da assinatura.

Exemplos:

- Ciclo de abril.
- Ciclo de maio.
- Ciclo de junho.

#### Campos

| Campo | Tipo sugerido | Descrição |
| ----- | ------------- | --------- |
| `id` | UUID | Identificador único do ciclo |
| `subscription_id` | UUID | Assinatura à qual o ciclo pertence |
| `cycle_number` | integer | Número sequencial do ciclo |
| `starts_at` | datetime | Início do ciclo |
| `ends_at` | datetime | Fim do ciclo |
| `renewed_at` | datetime | Data em que o ciclo foi criado ou renovado |
| `cycle_price` | decimal | Valor cobrado naquele ciclo |
| `status` | enum | `ACTIVE`, `EXPIRED`, `CANCELED`, `FINISHED` |

#### Relacionamentos

- Um `customer_package_cycle` pertence a uma `customer_package_subscription`.
- Um `customer_package_cycle` possui muitos `customer_package_service_credits`.
- Um `customer_package_cycle` pode estar ligado a muitos `service_appointments`.

### 10. `customer_package_service_credits`

Representa o saldo de cada serviço dentro de um ciclo.

Essa é a tabela de crédito.

#### Campos

| Campo | Tipo sugerido | Descrição |
| ----- | ------------- | --------- |
| `id` | UUID | Identificador único do crédito |
| `cycle_id` | UUID | Ciclo ao qual o crédito pertence |
| `service_id` | UUID | Serviço disponível como crédito |
| `total_quantity` | integer | Quantidade total liberada no ciclo |
| `used_quantity` | integer | Quantidade já usada |
| `available_quantity` | integer | Quantidade ainda disponível |

#### Relacionamentos

- Um `customer_package_service_credit` pertence a um `customer_package_cycle`.
- Um `customer_package_service_credit` referencia um `service`.
- Um `customer_package_service_credit` pode ter muitos `customer_package_credit_usages`.

#### Exemplo

| Service | Total quantity | Used quantity | Available quantity |
| ------- | -------------: | ------------: | -----------------: |
| Bath | 4 | 1 | 3 |
| Hygienic Grooming | 1 | 0 | 1 |

### 11. `service_appointments`

Representa o histórico de serviços realizados.

Um atendimento pode ser:

- Avulso.
- Usando crédito de pacote.
- Via assinatura.

#### Campos

| Campo | Tipo sugerido | Descrição |
| ----- | ------------- | --------- |
| `id` | UUID | Identificador único do atendimento |
| `customer_id` | UUID | Cliente atendido |
| `pet_id` | UUID | Pet atendido |
| `service_id` | UUID | Serviço realizado |
| `user_id` | UUID | Funcionário que registrou |
| `cycle_id` | UUID nullable | Ciclo usado, caso tenha vindo de pacote |
| `billing_origin` | enum | `ONE_TIME`, `PACKAGE_CREDIT`, `SUBSCRIPTION` |
| `base_price` | decimal | Valor base no momento do atendimento |
| `price_adjustment_type` | enum | `NONE`, `DISCOUNT`, `SURCHARGE` |
| `price_adjustment_amount` | decimal | Valor do desconto ou acréscimo |
| `final_price` | decimal | Valor final cobrado |
| `price_adjustment_reason` | text | Motivo do desconto ou acréscimo |
| `status` | enum | `COMPLETED`, `CANCELED` |
| `performed_at` | datetime | Data do atendimento |
| `notes` | text | Observações do atendimento |

#### Relacionamentos

- Um `service_appointment` pertence a um `customer`.
- Um `service_appointment` pertence a um `pet`.
- Um `service_appointment` referencia um `service`.
- Um `service_appointment` é registrado por um `user`.
- Um `service_appointment` pode estar ligado a um `customer_package_cycle`.
- Um `service_appointment` pode gerar um `customer_package_credit_usage`.

### 12. `customer_package_credit_usages`

Representa a baixa do crédito de pacote.

Essa tabela liga o atendimento ao crédito consumido.

#### Campos

| Campo | Tipo sugerido | Descrição |
| ----- | ------------- | --------- |
| `id` | UUID | Identificador único do uso de crédito |
| `service_credit_id` | UUID | Crédito consumido |
| `appointment_id` | UUID | Atendimento que consumiu o crédito |
| `used_quantity` | integer | Quantidade consumida |
| `used_at` | datetime | Data do consumo |

#### Relacionamentos

- Um `customer_package_credit_usage` pertence a um `customer_package_service_credit`.
- Um `customer_package_credit_usage` pertence a um `service_appointment`.

## Fluxos principais

### Contratação de pacote

1. Cria `customer_package_subscriptions`.
2. Cria o primeiro `customer_package_cycles`.
3. Copia os serviços de `package_services`.
4. Cria os créditos em `customer_package_service_credits`.

### Atendimento avulso

1. Busca o pet.
2. Verifica o porte do pet.
3. Busca o preço em `service_prices`.
4. Aplica desconto ou acréscimo, se houver.
5. Cria `service_appointments`.

Nesse caso:

```text
billing_origin = ONE_TIME
final_price > 0
```

### Atendimento usando pacote

1. Busca assinatura ativa do cliente.
2. Busca ciclo ativo.
3. Busca crédito disponível para o serviço.
4. Cria `service_appointments`.
5. Cria `customer_package_credit_usages`.
6. Atualiza `customer_package_service_credits`.

Nesse caso:

```text
billing_origin = PACKAGE_CREDIT
base_price = 0
price_adjustment_type = NONE
price_adjustment_amount = 0
final_price = 0
```

### Renovação automática

1. Encerra ou expira o ciclo atual.
2. Cria novo `customer_package_cycles`.
3. Recria os créditos em `customer_package_service_credits`.
4. Atualiza `last_renewed_at` em `customer_package_subscriptions`.

## Enums sugeridos

### `PetSize`

```ts
SMALL
MEDIUM
LARGE
```

### `UserRole`

```ts
ADMIN
EMPLOYEE
```

### `SubscriptionStatus`

```ts
ACTIVE
PAUSED
CANCELED
ENDED
```

### `CycleStatus`

```ts
ACTIVE
EXPIRED
CANCELED
FINISHED
```

### `BillingOrigin`

```ts
ONE_TIME
PACKAGE_CREDIT
SUBSCRIPTION
```

### `PriceAdjustmentType`

```ts
NONE
DISCOUNT
SURCHARGE
```

### `AppointmentStatus`

```ts
COMPLETED
CANCELED
```

## Ponto central da modelagem

A modelagem separa:

| Camada | Responsabilidade |
| ------ | ---------------- |
| `packages` | Modelo comercial do pacote |
| `customer_package_subscriptions` | Contrato do cliente |
| `customer_package_cycles` | Cada mês ou ciclo da assinatura |
| `customer_package_service_credits` | Saldo disponível |
| `service_appointments` | Histórico do serviço realizado |
| `customer_package_credit_usages` | Baixa do crédito usado |

Essa separação evita perda de histórico e deixa o sistema pronto para renovação automática, auditoria e relatórios.

