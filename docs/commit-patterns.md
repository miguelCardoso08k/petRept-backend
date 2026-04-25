# Padrão de Commits

O histórico atual do projeto segue um padrão simples inspirado em Conventional Commits:

```text
tipo: descricao curta
```

## Regras

| Regra | Orientação |
| ----- | ---------- |
| Tipo | Use sempre em minúsculas |
| Idioma | Escreva a descrição em inglês |
| Voz | Comece a descrição com verbo no imperativo |
| Tamanho | Mantenha o título curto e objetivo |
| Pontuação | Não use ponto final no assunto do commit |
| Escopo | Evite misturar mudanças de natureza diferente no mesmo commit |

## Tipos recomendados

| Tipo | Quando usar |
| ---- | ----------- |
| `feat` | Nova funcionalidade ou novo comportamento no sistema |
| `fix` | Correção de bug |
| `chore` | Infraestrutura, configuração, geração de código e manutenção |
| `docs` | Documentação |
| `test` | Testes novos ou ajustes em testes |
| `refactor` | Reorganização interna sem alterar comportamento esperado |

## Exemplos

```text
feat: add business hours entity
chore: document domain entities and add initial prisma schema
chore: bootstrap initial backend structure
```

## Separação recomendada

- Um commit para documentação.
- Um commit para schema, migrations e cliente gerado do Prisma.
- Um commit para módulos ou endpoints novos.
- Um commit separado para correção pontual de bug, quando aplicável.

