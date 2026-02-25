<p align="center">
  <img src="https://img.shields.io/badge/Laravel-12-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel 12" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 7" />
  <img src="https://img.shields.io/badge/AI-Gemini%20|%20Claude%20|%20GPT-8E75B2?style=for-the-badge" alt="AI Powered" />
</p>

# ⟨/⟩ LeadCode

> **Plataforma pessoal de treino para entrevistas técnicas de programação com feedback de IA.**

Resolva problemas de algoritmos no seu próprio tempo, receba feedback inteligente via Gemini, Claude ou GPT, acompanhe seu progresso com XP e níveis, e esteja preparado para qualquer entrevista técnica.

---

## ✨ Features

- 🧩 **Problemas categorizados** — Fácil, Médio e Difícil com timer integrado
- 🤖 **Feedback de IA** — Análise de código via Gemini, Claude ou OpenAI
- 💡 **Dicas inteligentes** — Hints contextuais sem revelar a solução
- 📊 **Gamificação** — XP, níveis, streaks e progresso visual
- 📝 **Editor Monaco** — O mesmo editor do VS Code, direto no navegador
- 📜 **Histórico completo** — Todas as submissões com feedback e código
- ⚙️ **Multi-provider** — Configure múltiplas APIs de IA e alterne entre elas
- 🌙 **Dark mode** — Interface GitHub-inspired com design premium
- 📱 **Responsivo** — Sidebar que vira bottom-nav no mobile

---

## 🛠️ Tech Stack

| Camada | Tecnologias |
|--------|-------------|
| **Backend** | PHP 8.2+, Laravel 12, SQLite |
| **Frontend** | React 19, TypeScript 5.9, Vite 7 |
| **Editor** | Monaco Editor (VS Code) |
| **IA** | Gemini API, Claude API, OpenAI API |
| **Styling** | CSS Vanilla com design tokens |

---

## 🚀 Instalação

### Pré-requisitos

- **PHP 8.2+** com extensões: `sqlite3`, `mbstring`, `openssl`, `pdo_sqlite`
- **Composer** (gerenciador de dependências PHP)
- **Node.js 18+** com npm
- **Uma API Key** de Gemini, Claude ou OpenAI (opcional, mas recomendado)

### Setup rápido

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/leadcode.git
cd leadcode

# 2. Instale tudo de uma vez (backend + frontend)
composer setup
```

O comando `composer setup` executa automaticamente:
- `composer install` — Dependências PHP
- Copia `.env.example` → `.env`
- `php artisan key:generate` — Gera chave de aplicação
- `php artisan migrate` — Cria o banco SQLite
- `npm install` — Dependências JavaScript
- `npm run build` — Compila o frontend

### Seed dos problemas

```bash
# Popula o banco com categorias + problemas de exemplo
php artisan db:seed
```

---

## ▶️ Como Usar

### Iniciar o servidor de desenvolvimento

```bash
composer dev
```

Isso inicia 4 processos em paralelo:
- 🟢 **Laravel** em `http://localhost:8000`
- 🟡 **Vite** (hot-reload) em `http://localhost:5173`
- 🔵 **Queue listener** para jobs
- 🟣 **Pail** (logs em tempo real)

Acesse **http://localhost:8000** no navegador.

### Configurar a IA

1. Acesse **⚙️ Configurações** na sidebar
2. Adicione sua API key (Gemini, Claude ou OpenAI)
3. Selecione o provider ativo
4. Pronto! Os feedbacks e dicas agora serão gerados pela IA

> 💡 **Dica:** A API do Gemini tem um tier gratuito generoso. [Obtenha sua key aqui](https://aistudio.google.com/apikey).

---

## 🎮 Fluxo de Uso

```
1. Dashboard     → Veja seu nível, XP, streak e progresso
2. Problemas     → Filtre por categoria/dificuldade e escolha um
3. Resolver      → Code no Monaco Editor com timer ativo
   ├── Dica 💡   → Peça uma dica sem revelar a solução
   ├── Submeter  → Receba feedback detalhado da IA
   └── Desistir  → Veja a solução explicada
4. Histórico     → Revise todas as submissões com feedback
5. Configurações → Gerencie providers de IA
```

---

## 📁 Estrutura do Projeto

```
leadcode/
├── app/
│   ├── Http/Controllers/Api/   # Controllers REST
│   ├── Models/                 # Eloquent models
│   └── Services/
│       ├── Ai/                 # Providers (Gemini, Claude, GPT)
│       └── ProgressService.php # Sistema de XP e níveis
├── database/
│   ├── migrations/             # Schema do banco
│   └── seeders/                # Dados iniciais (30 problemas)
├── frontend/
│   ├── src/
│   │   ├── api/                # Client HTTP (Axios)
│   │   ├── components/         # UI components reutilizáveis
│   │   ├── hooks/              # Custom hooks (timer, API, debounce)
│   │   ├── pages/              # Dashboard, Problems, Solve, History, Settings
│   │   ├── styles/             # Design tokens, animations, reset
│   │   └── types/              # TypeScript interfaces
│   └── index.html
├── routes/api.php              # Rotas da API
└── docs/                       # Documentação técnica
```

---

## 📚 Documentação Técnica

| Documento | Descrição |
|-----------|-----------|
| [**Arquitetura**](docs/ARCHITECTURE.md) | Estrutura backend/frontend, design patterns, schema do banco, design system, fluxo de dados |
| [**API Reference**](docs/API.md) | Todos os endpoints, query params, payloads, responses e códigos de erro |
| [**Providers de IA**](docs/AI-PROVIDERS.md) | Providers suportados, tipos de prompt, segurança, modelos alternativos |

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do repositório
2. Crie uma branch (`git checkout -b feature/minha-feature`)
3. Commit suas mudanças (`git commit -m 'feat: minha feature'`)
4. Push para a branch (`git push origin feature/minha-feature`)
5. Abra um Pull Request

### Rodando localmente para desenvolvimento

```bash
# Backend + Frontend com hot-reload
composer dev

# Apenas o frontend (em outro terminal)
cd frontend && npm run dev

# Rodar lint do frontend
cd frontend && npm run lint

# Build de produção
cd frontend && npm run build
```

---

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).

---

<p align="center">
  Feito com ☕ por <a href="https://github.com/sistemout123">João Pedro Fernandes</a>
</p>
