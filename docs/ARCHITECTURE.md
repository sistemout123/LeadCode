# Arquitetura — LeadCode

## Visão Geral

```
┌─────────────┐     HTTP/JSON      ┌──────────────┐     HTTPS     ┌─────────────┐
│  Frontend   │ ◄──────────────► │   Backend    │ ◄──────────► │   AI APIs   │
│  React 19   │   localhost:5173   │  Laravel 12  │              │ Gemini/GPT/ │
│  Vite 7     │                    │  PHP 8.2     │              │ Claude      │
│  TypeScript │                    │  SQLite      │              │             │
└─────────────┘                    └──────────────┘              └─────────────┘
```

## Backend (Laravel 12)

### Estrutura

```
app/
├── Http/Controllers/Api/
│   ├── AiConfigController.php    # CRUD de providers de IA
│   ├── CategoryController.php    # Listagem de categorias
│   ├── ProblemController.php     # Problemas + hints + solutions
│   ├── ProgressController.php    # XP, nível, streaks
│   └── SubmissionController.php  # Submissões + AI feedback
├── Models/
│   ├── AiConfig.php              # api_key encrypted via cast
│   ├── Category.php              # hasMany Problem
│   ├── Problem.php               # belongsTo Category, hasMany Submission
│   ├── Submission.php            # belongsTo Problem
│   └── UserProgress.php          # Singleton (single-user)
└── Services/
    ├── Ai/
    │   ├── AiProviderFactory.php # Factory pattern → cria provider ativo
    │   ├── AiProviderInterface.php
    │   ├── GeminiProvider.php    # Google Gemini API
    │   ├── ClaudeProvider.php    # Anthropic Claude API
    │   └── GptProvider.php       # OpenAI GPT API
    └── ProgressService.php       # Lógica de XP, leveling, streaks
```

### Design Patterns

| Pattern | Onde | Propósito |
|---------|------|-----------|
| **Factory** | `AiProviderFactory` | Cria o provider correto com base na config ativa |
| **Strategy** | `AiProviderInterface` | Cada provider implementa `analyze()` e `buildPrompt()` |
| **Service Layer** | `ProgressService` | Encapsula lógica de gamificação fora do controller |
| **Encrypted Cast** | `AiConfig.api_key` | API keys cifradas no banco automaticamente |

### Banco de Dados (SQLite)

```
categories          problems              submissions
├── id              ├── id                ├── id
├── name            ├── category_id (FK)  ├── problem_id (FK)
├── slug            ├── title             ├── user_code
├── icon            ├── difficulty        ├── status
├── color           ├── description       ├── time_spent_seconds
└── description     ├── starter_code      ├── ai_feedback
                    ├── solution_code     ├── ai_provider
                    ├── explanation       ├── ai_model
                    ├── time_limit_min    ├── language
                    ├── xp_reward         └── created_at
                    ├── hints (JSON)
                    ├── test_cases (JSON) ai_configs
                    ├── tags (JSON)       ├── id
                    └── order             ├── provider
                                          ├── api_key (encrypted)
user_progress                             ├── model_name
├── id                                    └── is_active
├── current_level
├── xp_points
├── problems_solved
├── current_streak
├── best_streak
└── last_activity_at
```

## Frontend (React 19 + TypeScript)

### Estrutura

```
frontend/src/
├── api/               # Camada HTTP (Axios)
│   ├── client.ts      # Instância com baseURL + timeout
│   ├── errors.ts      # parseApiError (429, 500, etc)
│   ├── problems.ts    # getProblems, getProblem, requestHint
│   ├── submissions.ts # createSubmission, getSubmissions
│   ├── progress.ts    # getProgress
│   ├── categories.ts  # getCategories
│   └── aiConfig.ts    # CRUD AI configs
├── components/
│   ├── ui/            # Design system (Button, Card, Badge, Modal, Tooltip, Skeleton)
│   ├── layout/        # Sidebar + AppLayout
│   ├── AiFeedback/    # Markdown + Syntax Highlight
│   ├── AnalyzingOverlay/ # Loading overlay durante IA
│   └── StatsUpdate/   # Animação de XP gain
├── hooks/
│   ├── useApi.ts      # Data fetching genérico com abort
│   ├── useTimer.ts    # Timer com localStorage persistence
│   └── useUtils.ts    # useDebounce
├── pages/
│   ├── Dashboard/     # Stats, categorias, atividade recente
│   ├── Problems/      # Lista filtrada com skeleton loading
│   ├── Solve/         # Monaco Editor + Timer + AI Hints
│   ├── History/       # Tabela de submissões com AiFeedback
│   └── Settings/      # CRUD providers de IA
├── styles/
│   ├── variables.css  # Design tokens (cores, espaçamento, tipografia)
│   ├── reset.css      # CSS reset + focus-visible + scrollbar
│   └── animations.css # 9 keyframes + stagger utility
└── types/index.ts     # Interfaces TypeScript
```

### Design System

| Token | Valor | Uso |
|-------|-------|-----|
| `--bg-primary` | `#0d1117` | Background principal (GitHub dark) |
| `--accent-primary` | `#58a6ff` | Links, CTAs, focus rings |
| `--font-primary` | Inter | Corpo do texto |
| `--font-mono` | JetBrains Mono | Editor, código |
| `--transition-fast` | 150ms ease | Micro-interactions |
| `--radius-lg` | 12px | Cards, modais |

### Fluxo de Dados (Submissão)

```
User clica "Submeter"
  → Solve.tsx: handleSubmit()
    → timer.pause()
    → createSubmission(payload) → POST /api/submissions
      → SubmissionController::store()
        → Problem::findOrFail()
        → Submission::create()
        → AiProviderFactory::create() → GeminiProvider
          → buildPrompt('submitted') → analyze()
          → HTTP POST → Gemini API
        → submission.update(ai_feedback)
        → ProgressService::addXp() (com dedup check)
      ← { submission, ai_feedback, solution?, progress }
    → setResult(res)
    → Modal abre com AiFeedback + StatsUpdate
```
