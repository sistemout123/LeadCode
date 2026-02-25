# Providers de IA — LeadCode

O LeadCode suporta 3 providers de IA para gerar feedback e dicas.

## Providers Suportados

| Provider | Modelo Padrão | Custo | Link |
|----------|---------------|-------|------|
| **Google Gemini** | `gemini-2.0-flash` | Tier gratuito disponível | [Obter key](https://aistudio.google.com/apikey) |
| **Anthropic Claude** | `claude-sonnet-4-20250514` | Pago (API credits) | [Console](https://console.anthropic.com/) |
| **OpenAI GPT** | `gpt-4o-mini` | Pago (API credits) | [Platform](https://platform.openai.com/api-keys) |

## Como Funciona

### Fluxo de Análise

```
1. User submete código → POST /submissions
2. SubmissionController busca o provider ativo
3. AiProviderFactory cria instância do provider
4. Provider.buildPrompt() gera prompt contextual
5. Provider.analyze() envia HTTP para a API do provider
6. Resposta da IA é salva em submission.ai_feedback
```

### Tipos de Prompt

| Tipo | Quando | Comportamento |
|------|--------|---------------|
| `submitted` | Usuário submete solução | Analisa o código, aponta acertos/erros, sugere melhorias |
| `gave_up` | Usuário desiste | Explica a solução completa de forma didática |
| `hint` | Usuário pede dica | Dá 1 dica curta (máx 2 frases) sem revelar a solução |

### Exemplo de Prompt (Hint)

```
Você é um tutor de programação. Dê UMA dica curta (máximo 2 frases)
para o problema "Two Sum" baseado no código parcial do usuário.
NÃO revele a solução completa, apenas guie o raciocínio.

Problema: Dado um array de inteiros...
Código atual:
<user_code>
function twoSum(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    // ???
  }
}
</user_code>

Responda em Português do Brasil. Apenas a dica, sem formatação extra.
```

## Segurança

- **API keys são cifradas** no banco usando `Crypt::encryptString()` via Laravel cast `'encrypted'`
- **Keys nunca são retornadas** pela API — apenas `has_key: true/false`
- O banco SQLite é **local e excluído do git**

## Troca de Provider

1. Acesse **⚙️ Configurações** no app
2. Cole a API key do provider desejado
3. Selecione o radio button para torná-lo ativo
4. Clique **Salvar** — apenas 1 provider fica ativo por vez

## Modelos Alternativos

Você pode usar qualquer modelo compatível com a API do provider:

| Provider | Modelos Alternativos |
|----------|---------------------|
| Gemini | `gemini-2.5-pro`, `gemini-2.5-flash`, `gemini-2.0-flash-lite` |
| Claude | `claude-sonnet-4-20250514`, `claude-3-5-haiku-20241022` |
| OpenAI | `gpt-4o`, `gpt-4o-mini`, `gpt-4.1-nano` |

> Basta digitar o nome do modelo no campo **Modelo** em Configurações.
