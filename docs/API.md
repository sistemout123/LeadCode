# API Reference — LeadCode

> Base URL: `http://localhost:8000/api`
>
> Content-Type: `application/json`

---

## Categorias

### `GET /categories`

Lista todas as categorias com contagem de problemas.

**Response:** `200`
```json
[
  {
    "id": 1,
    "name": "Arrays",
    "slug": "arrays",
    "icon": "📦",
    "color": "#58a6ff",
    "description": "Problemas com arrays e listas",
    "problems_count": 5
  }
]
```

### `GET /categories/{id}`

Detalhes de uma categoria com seus problemas.

---

## Problemas

### `GET /problems`

Lista problemas. Aceita query params para filtros.

| Param | Tipo | Descrição |
|-------|------|-----------|
| `difficulty` | `easy\|medium\|hard` | Filtrar por dificuldade |
| `category` | `string` (slug) | Filtrar por slug da categoria |
| `search` | `string` | Busca no título |

**Response:** `200`
```json
[
  {
    "id": 1,
    "category_id": 1,
    "title": "Two Sum",
    "slug": "two-sum",
    "difficulty": "easy",
    "xp_reward": 50,
    "time_limit_minutes": 15,
    "order": 1,
    "tags": ["array", "hash-map"],
    "category": { "id": 1, "name": "Arrays", "slug": "arrays", "icon": "📦", "color": "#58a6ff" }
  }
]
```

### `GET /problems/{id}`

Detalhes de um problema (sem `solution_code`).

**Response:** `200`
```json
{
  "id": 1,
  "title": "Two Sum",
  "description": "Dado um array...",
  "starter_code": "function twoSum(nums, target) {\n  // seu código\n}",
  "time_limit_minutes": 15,
  "xp_reward": 50,
  "hints": ["Tente usar um hash map", "..."],
  "test_cases": [{ "input": { "nums": [2,7], "target": 9 }, "output": [0,1] }],
  "constraints": "2 ≤ nums.length ≤ 10⁴"
}
```

### `GET /problems/{id}/solution`

Retorna a solução. **Requer ao menos 1 submissão anterior.**

**Response:** `200`
```json
{
  "solution_code": "function twoSum(nums, target) { ... }",
  "explanation": "A solução usa um hash map..."
}
```

**Erro:** `403` → Nenhuma submissão encontrada.

### `POST /problems/{id}/hint`

Solicita dica da IA baseada no código parcial.

**Body:**
```json
{ "user_code": "function twoSum(nums, target) { ... }" }
```

**Response:** `200`
```json
{ "hint": "Considere usar um dicionário para armazenar..." }
```

---

## Submissões

### `POST /submissions`

Cria uma submissão e recebe feedback da IA.

**Body:**
```json
{
  "problem_id": 1,
  "user_code": "function twoSum(...) { ... }",
  "status": "submitted",
  "time_spent_seconds": 420,
  "language": "javascript"
}
```

| Campo | Tipo | Obrigatório | Validação |
|-------|------|:-----------:|-----------|
| `problem_id` | `integer` | ✅ | Deve existir em `problems` |
| `user_code` | `string` | ✅ | Máx 50.000 caracteres |
| `status` | `string` | ✅ | `submitted` ou `gave_up` |
| `time_spent_seconds` | `integer` | ✅ | 0 – 86.400 |
| `language` | `string` | ❌ | Máx 50 caracteres |

**Response:** `201`
```json
{
  "submission": {
    "id": 1,
    "problem_id": 1,
    "user_code": "...",
    "status": "submitted",
    "ai_feedback": "Sua solução está correta! ...",
    "ai_provider": "gemini",
    "ai_model": "gemini-2.0-flash"
  },
  "ai_feedback": "Sua solução está correta! ...",
  "solution": null,
  "progress": {
    "current_level": 2,
    "xp_points": 50,
    "problems_solved": 3,
    "current_streak": 2
  }
}
```

> **Nota:** Quando `status=gave_up`, o campo `solution` retorna `{ solution_code, explanation }`.
>
> **XP Dedup:** XP é concedido apenas na primeira submissão `submitted` por problema.

### `GET /submissions`

Lista submissões paginadas (20 por página).

| Param | Tipo | Descrição |
|-------|------|-----------|
| `page` | `integer` | Página atual |
| `status` | `submitted\|gave_up` | Filtrar por status |
| `problem_id` | `integer` | Filtrar por problema |

---

## Progresso

### `GET /progress`

Retorna o progresso do usuário.

```json
{
  "current_level": 3,
  "xp_points": 75,
  "problems_solved": 8,
  "problems_attempted": 12,
  "current_streak": 3,
  "best_streak": 5,
  "last_activity_at": "2026-02-25T09:00:00.000000Z"
}
```

---

## Configurações de IA

### `GET /ai-configs`

Lista providers configurados. **Nunca retorna a API key.**

```json
[
  {
    "id": 1,
    "provider": "gemini",
    "model_name": "gemini-2.0-flash",
    "is_active": true,
    "has_key": true
  }
]
```

### `POST /ai-configs`

Cria ou atualiza um provider (upsert por `provider`).

```json
{
  "provider": "gemini",
  "api_key": "AIza...",
  "model_name": "gemini-2.0-flash",
  "is_active": true
}
```

### `PUT /ai-configs/{id}`

Atualiza um provider existente.

### `DELETE /ai-configs/{id}`

Remove um provider.

---

## Rate Limiting

| Grupo | Limite | Rotas |
|-------|--------|-------|
| **Leitura** | 60 req/min | `GET /problems`, `GET /categories`, etc |
| **Escrita** | 60 req/min | `POST /submissions`, `POST /hint`, AI configs |

## Códigos de Erro

| Código | Significado |
|--------|-------------|
| `400` | Provider de IA não configurado |
| `403` | Sem permissão (ex: solution sem submissão) |
| `422` | Validação falhou (campos inválidos) |
| `429` | Rate limit excedido |
| `500` | Erro interno (AI timeout, etc) |
