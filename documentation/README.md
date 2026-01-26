# SoccerLeague 🎮⚽

A fantasy football game built whit a modern and scalable architecture, where users create teams, play matches and improve their ELO rating based on results.

---

## 🏗 Architecture

The app is split into a few services, whit different responsibilities.

| Service      | Technology | Responsibility |
|---------------|-----------|--------------------------|
| Frontend      | Nuxt 4    | User interface and game interaction |
| BFF           | Fastify   | API integration, token encryption, ELO & match management |
| Simulator     | Rust      | Player generation, match simulation, bonus calculator |
| Backend       | NestJS    | Authentication and database CRUD |
| Base de datos | PostgreSQL| Persistent game data. |

> ⚠️ El servicio Simulator está en desarrollo, ya que Rust todavía está en fase de aprendizaje.

---

## 📌 Stack Tecnológico

- **Frontend:** Nuxt 4, Pinia, CSS Modules, i18n  
- **BFF:** Fastify, Swagger, Crypto, Cron Jobs  
- **Simulator:** Rust  
- **Backend:** NestJS  
- **Base de datos:** PostgreSQL  
- **Contenedores:** Docker  
- **Testing:** E2E tests (separate repository)
- **E2E FRONTEND** Planned cypress integration for frontend  

---

## 💡 Implementation Details

### Frontend
- Hybrid rendering
- Global design CSS. (colors, spacing, typography)
- Centralized states whit **Pinia**
- Multi-language error handling
- Reusable alert/notification system

### BFF
- Token encryption/decryption
- Aggregates multiple backend API
- Custom error handling
- **Swagger** API documentation
- Cron Jobs for automated tasks
- Match creation & ELO calculator

### Simulator
- Random player generation
- Skill-based probabilities:
  - Aura
  - Instructions
  - Team Chemistry
- Match resolution based on simulated actions

### Backend
- Authentication system
- Token generation & validation
- CRUD operations for all entities

### Database
- Stores
  - Users
  - Users Storage
  - Users Stats
  - Teams
  - Position Change Cards
  - Player
  - Played_games
  - Market_position_change_cards
  - Market_players
  - Market_cards
  - Market_auras
  - Games
  - Cards
  - Auras
---

## 🐳 Docker Architecture

- Containerized environment
- Multiple configuration
  - `.test.yml`: isolated testing (no network).
  - Main Setup: reverse proxy + private services.
- Possible improvements:
  - Integration whit **redis**.
  - Dedicated API for mobile/desktop.
  - Horizontal service scaling.

## 🔗 Application Flow

1. **Frontend** sends requests to the BFF.  
2. **BFF**:
   - Validates & decrypts tokens.
   - Orchestrates multiples services.
   - Handles game system.  
3. **Simulator** Generate players, applies bonuses, simulate the match.  
4. **Backend**:
   - Authenticates users.
   - Persists data in **PostgreSQL**.

---

## 📄 License

This project is create for educational purposes



