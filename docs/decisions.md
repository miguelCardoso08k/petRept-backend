# Decisões Técnicas

Este documento resume as principais decisões técnicas da modelagem, com vantagens e trade-offs.

## 1. Separar contrato, ciclo e crédito

### Decisão

Criar três níveis para representar assinatura, renovação e saldo:

| Tabela | Responsabilidade |
| ------ | ---------------- |
| `customer_package_subscriptions` | Contrato do cliente |
| `customer_package_cycles` | Cada período da assinatura |
| `customer_package_service_credits` | Saldo por serviço dentro do ciclo |

### Vantagens

- Mantém histórico completo.
- Permite auditoria por ciclo.
- Facilita relatórios futuros.
- Suporta renovação automática sem sobrescrever dados.

### Trade-offs

- Mais tabelas.
- Mais joins nas queries.
- Backend mais trabalhoso, principalmente na lógica de renovação.

## 2. Separar saldo por serviço

### Decisão

Cada serviço possui seu próprio crédito dentro do pacote.

### Vantagens

- Reflete o negócio real: `4 banhos` não equivalem a `1 tosa`.
- Evita consumo incorreto de saldo.
- Permite regras diferentes por serviço.

### Trade-offs

- Mais registros no banco.
- Lógica mais complexa para consumir crédito.

## 3. Registrar consumo de crédito

### Decisão

Criar a tabela `customer_package_credit_usages` para registrar cada baixa de crédito.

### Vantagens

- Rastreabilidade total.
- Permite saber quem usou, quando e em qual atendimento.
- Evita inconsistência de saldo.
- Facilita debug e auditoria.

### Trade-offs

- Mais escritas no banco.
- Maior complexidade transacional.

## 4. Atendimento como fonte de histórico

### Decisão

Toda ação de serviço gera um `service_appointment`.

### Vantagens

- Histórico completo no estilo e-commerce.
- Base sólida para relatórios.
- Permite reconstruir o estado do sistema.

### Trade-offs

- Volume de dados cresce com o tempo.
- Exige indexação e otimização conforme o uso aumenta.

## 5. Salvar preço no atendimento

### Decisão

Guardar no atendimento:

- `base_price`
- `adjustment`
- `final_price`

### Vantagens

- Histórico financeiro confiável.
- Mudanças futuras de preço não alteram dados antigos.
- Facilita auditoria.

### Trade-offs

- Redundância de dados.
- Mais campos para manter.

## 6. Definir preço por porte

### Decisão

Usar `service_prices` para separar preço por tamanho do pet.

### Vantagens

- Flexibilidade na precificação.
- Reflete melhor a realidade do negócio.
- Permite ajustes sem quebrar histórico.

### Trade-offs

- Mais uma tabela.
- Necessidade de lógica extra na busca de preço.

## 7. Diferenciar origem da cobrança

### Decisão

Usar o campo `billing_origin` para indicar a origem financeira do atendimento:

```text
ONE_TIME
PACKAGE_CREDIT
SUBSCRIPTION
```

### Vantagens

- Clareza no histórico.
- Facilita relatórios financeiros.
- Evita confusão entre desconto, crédito e assinatura.

### Trade-offs

- Mais lógica condicional no backend.

## 8. Serviço de pacote com valor zerado

### Decisão

Quando o atendimento usa crédito de pacote, `final_price = 0`.

### Vantagens

- Simples de entender.
- Evita cobrança duplicada.
- Separa cobrança financeira de consumo de crédito.

### Trade-offs

- A receita não aparece diretamente no atendimento.
- Análises financeiras precisam consultar contrato ou ciclo.

## 9. Não salvar próxima renovação

### Decisão

Calcular a próxima renovação em vez de armazená-la.

### Vantagens

- Evita inconsistência de dados.
- Reduz risco de bugs por valor desatualizado.

### Trade-offs

- Exige cálculo em tempo de execução.
- Pode impactar queries se o cálculo não for bem planejado.

## 10. Renovar criando novos ciclos

### Decisão

Criar um novo ciclo a cada renovação, sem sobrescrever dados anteriores.

### Vantagens

- Histórico preservado.
- Nenhuma perda de dados.
- Base sólida para crescimento.

### Trade-offs

- Banco cresce ao longo do tempo.
- Queries ficam mais complexas.

## 11. Usar transações no consumo de crédito

### Decisão

A baixa de crédito deve ser transacional.

### Vantagens

- Evita inconsistência.
- Garante integridade dos dados.

### Trade-offs

- Mais complexidade no backend.
- Possível impacto de performance em alta concorrência.

## Resumo de arquitetura

O modelo escolhido prioriza:

- Robustez.
- Escalabilidade.
- Auditoria.
- Histórico confiável.

Em troca, ele exige:

- Mais esforço de implementação.
- Queries mais cuidadosas.
- Maior atenção a transações e índices.

