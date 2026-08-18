# Planejamento: Sistema de Gamificação — Minha Vez

> Documento de planejamento de produto + arquitetura técnica. Não é uma implementação — é a base para discutir e depois implementar.

## 1. Objetivo

Gamificar o Minha Vez não é "engajamento por engajamento". O objetivo é usar mecânicas de jogo para reforçar comportamentos que já são bons para o paciente e para o sistema de saúde:

- Reduzir **no-show** (faltas em consultas agendadas).
- Incentivar **exames preventivos** e consultas de acompanhamento (não só consultas de urgência).
- Incentivar **cadastro completo e atualizado** (facilita triagem e prioridade clínica real).
- Incentivar **feedback** (avaliações) que ajudam a melhorar as unidades de saúde.
- Trazer **hábito de cuidado contínuo**, não só uso do app.

Cada mecânica abaixo nasce de um evento que já existe no sistema (comparecimento, exame, avaliação) — nada aqui exige mudar o fluxo clínico, só observá-lo e recompensar.

## 2. Referências: o que pegar de cada modelo

|                    | Duolingo                           | Quero Delivery                           | Adaptado pro Minha Vez                                                                        |
| ------------------ | ---------------------------------- | ---------------------------------------- | --------------------------------------------------------------------------------------------- |
| Mecânica central   | Hábito recorrente (streak diária)  | Recompensa transacional (cashback/cupom) | Hábito de cuidado + benefício não-clínico                                                     |
| Moeda              | XP + gemas                         | Pontos/cashback                          | Pontos de "Cuidado em Dia"                                                                    |
| Progressão         | Níveis, ligas, leaderboard         | Tier VIP                                 | Níveis Bronze/Prata/Ouro                                                                      |
| Recompensa         | Cosmética (skins, streak freeze)   | Real (cupom, desconto)                   | Ambas — benefício de fila/lembrete (universal) + cupom parceiro (opcional, unidades privadas) |
| Gatilho de retorno | Notificação "não perca sua streak" | Notificação de cupom expirando           | Notificação "sua consulta de retorno está próxima"                                            |

**O que NÃO trazer de nenhum dos dois:**

- Mecânica de perda/ansiedade (tipo "hearts" do Duolingo) — não cabe associar saúde a "perder vidas".
- Pressão para "não quebrar a sequência" quando a ausência pode ser por motivo de saúde real (internação, emergência).
- Leaderboard público que exponha informação de saúde (nada de "ranking de quem mais fez exame de X").

## 3. Mecânicas propostas

### 3.1 Pontos ("Cuidado em Dia")

Pontos ganhos por ações verificáveis pelo sistema, não por uso passivo do app.

| Evento                                             | Gatilho técnico                                         | Pontos sugeridos |
| -------------------------------------------------- | ------------------------------------------------------- | ---------------- |
| Cadastro completo (CPF, telefone, data nascimento) | `Patient` criado com todos os campos preenchidos        | 20               |
| Primeira consulta agendada                         | `Appointment` criado (status `SCHEDULED`)               | 10               |
| Comparecimento a consulta agendada                 | `Appointment.status → COMPLETED`                        | 30               |
| Check-in feito na hora certa                       | `QueueItem.checkInTime` dentro da janela do agendamento | 10 (bônus)       |
| Exame preventivo/rotina concluído                  | `ExamBooking` concluído                                 | 40               |
| Avaliação de atendimento enviada                   | `Rating` criado                                         | 15               |
| Indicação de familiar/amigo cadastrado             | novo`Patient` com `referredBy` preenchido               | 25               |
| Retorno agendado após alta                         | `Appointment.isReturn = true` criado                    | 20               |

**Não pontua:** cancelamento, no-show, abrir o app sem agendar nada. Ausência não pontua — mas também **não é punida com perda de pontos**, para não criar mecânica punitiva em cima de saúde.

### 3.2 Streak — "Sequência de Cuidado"

Não é streak diária (não faz sentido pedir uso diário de um app de agendamento de saúde). É uma streak de **adesão**: comparecer às consultas/exames agendados sem faltar, medida por agendamento e não por dia.

- Streak incrementa a cada `Appointment` concluído (`COMPLETED`) sem falta anterior recente.
- Streak **não quebra automaticamente** por cancelamento com antecedência (cancelar avisando é comportamento responsável, não deve ser punido).
- Streak quebra apenas em `ABSENT` (falta sem aviso) — e mesmo assim, com uma "reserva" (1 falta tolerada a cada X, pensando em imprevistos de saúde reais).
- Marco de streak gera notificação de reforço positivo: "3 consultas seguidas em dia — continue assim!"

### 3.3 Badges / Conquistas

| Badge                | Critério                                |
| -------------------- | --------------------------------------- |
| 🩺 Primeira Consulta | 1ª`Appointment` concluída               |
| ⏱️ Sempre Pontual    | 5 check-ins dentro da janela agendada   |
| 📋 Cadastro em Dia   | Perfil 100% completo                    |
| 🔁 Cuidado Contínuo  | 3 consultas de retorno concluídas       |
| 🧪 Prevenção em Dia  | 2 exames de rotina concluídos no ano    |
| 🤝 Rede de Cuidado   | 3 indicações que viraram cadastro ativo |
| 💬 Feedback Ativo    | 5 avaliações enviadas                   |

Badges são só exibição/reconhecimento — não desbloqueiam nada por si só (isso é papel dos níveis).

### 3.4 Níveis (Bronze / Prata / Ouro)

Calculados por pontos acumulados. Importante: **níveis dão benefícios não-clínicos**, nunca alteram a prioridade real de atendimento (`Patient.priority`, que continua sendo só critério clínico: idoso, gestante, PCD etc.). Misturar os dois seria eticamente problemático — furar fila por "gamificação" não pode acontecer.

| Nível  | Pontos  | Benefícios                                                                                                                           |
| ------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Bronze | 0–299   | Acesso padrão                                                                                                                        |
| Prata  | 300–799 | Lembrete de agendamento com 48h de antecedência (em vez de 24h); acesso a horários de exame com 1 dia de antecedência extra          |
| Ouro   | 800+    | Tudo do Prata + selo de perfil "Ouro" + prioridade em lista de espera de reagendamento (entre pacientes de mesma prioridade clínica) |

### 3.5 Recompensas parceiras (opt-in, unidades privadas)

Como o app atende unidades públicas e privadas, essa camada é **opcional por unidade**: só unidades privadas que aderirem ao programa oferecem cupons. Unidades públicas continuam com os benefícios universais (níveis, badges, lembretes).

Exemplos: desconto em farmácia parceira, desconto em exame particular adicional, brinde de produto de saúde (ex. parceria com marca de suplemento/fralda geriátrica, dependendo do público da unidade).

Modelo similar ao Quero Delivery: catálogo de recompensas resgatáveis por pontos, com estoque/validade, mas curado — sem "raspadinha"/roleta de aleatoriedade, que não combina com o tom de um app de saúde.

### 3.6 Notificações de gamificação

Reaproveita 100% o pipeline de notificação já existente (BullMQ + Expo push + WebSocket):

- `BADGE_EARNED` — "Você desbloqueou o badge Sempre Pontual 🎉"
- `STREAK_MILESTONE` — "3 consultas seguidas em dia!"
- `LEVEL_UP` — "Você chegou ao nível Prata"
- `REWARD_AVAILABLE` — "Novo cupom disponível na sua unidade"

## 4. Considerações éticas

- **Sem mecânica de perda/ansiedade** associada a saúde (nada de "hearts", "streak morreu").
- **Sem punição por falta** além de não pontuar — motivo pode ser saúde real.
- **Dados de saúde nunca em leaderboard público.** Se houver ranking, é só de pontos totais, opt-in, sem detalhar qual exame/consulta.
- **Transparência**: tela de histórico de pontos mostra exatamente por que cada ponto foi ganho.
- **Nível não pode furar fila clínica** — separação explícita entre `priority` (clínico) e `level` (gamificação) em todo o sistema, inclusive no modelo de dados.

## 5. Arquitetura técnica — Backend (`minhavez-backend`)

Segue o padrão DDD já usado no projeto (`src/domain/<feature>/{interfaces,repository,service}`).

### 5.1 Novo domínio

```
src/domain/gamification/
  interfaces/
  repository/
  service/
    gamification.service.ts       # cálculo de pontos, streak, níveis, badges
    reward.service.ts             # catálogo e resgate
```

### 5.2 Novas schemas Mongoose (`src/infrastructure/db/mongo/schema/`)

```ts
// gamification-profile.schema.ts
{
  patientId: ObjectId,       // ref Patient
  totalPoints: number,
  level: 'BRONZE' | 'PRATA' | 'OURO',
  currentStreak: number,
  longestStreak: number,
  updatedAt: Date,
}

// points-transaction.schema.ts  (histórico auditável — nunca deletar)
{
  patientId: ObjectId,
  amount: number,
  reason: 'APPOINTMENT_COMPLETED' | 'EXAM_COMPLETED' | 'RATING_SUBMITTED' | 'REFERRAL' | ...,
  refId: ObjectId,           // id do Appointment/ExamBooking/Rating de origem
  createdAt: Date,
}

// badge.schema.ts + badge-award.schema.ts
Badge { code, name, description, icon }
BadgeAward { patientId, badgeCode, awardedAt }

// reward.schema.ts + redemption.schema.ts
Reward { title, description, costPoints, healthUnitId?, isPartnerReward: boolean, stock, expiresAt }
Redemption { patientId, rewardId, redeemedAt, status }
```

### 5.3 Hooks de evento

Os services que já existem disparam o cálculo de gamificação de forma assíncrona (via job na fila BullMQ existente, para não acoplar latência ao fluxo clínico principal):

- `appointment.service` → ao mudar status para `COMPLETED` → enfileira job `award-points('APPOINTMENT_COMPLETED', patientId, appointmentId)`
- `queue-item.service` → check-in dentro da janela → bônus de pontualidade
- `rating.service` → ao criar `Rating` → pontos de feedback
- `exam-booking.service` → conclusão de exame → pontos de prevenção
- `auth`/signup → perfil completo → pontos de cadastro

### 5.4 Novos endpoints REST

```
GET  /gamification/profile          → pontos, nível, streak do paciente logado
GET  /gamification/history          → extrato de pontos (points-transaction)
GET  /gamification/badges           → badges conquistados + disponíveis
GET  /gamification/rewards          → catálogo (filtrado pela unidade do paciente, se aplicável)
POST /gamification/rewards/:id/redeem
```

### 5.5 Notificações

Adicionar ao enum de `Notification.type`: `BADGE_EARNED`, `STREAK_MILESTONE`, `LEVEL_UP`, `REWARD_AVAILABLE`. Usa o `metadata` (Mixed) já existente no schema para carregar `{ badgeCode }` ou `{ level }`, sem precisar migrar o schema de notificação.

## 6. Arquitetura técnica — Frontend (`minha-vez-app`)

- **`profile-content`**: novo card de gamificação (pontos, nível, badges em destaque) logo abaixo do card "Informações Pessoais" já existente.
- **`home`**: resumo compacto opcional (ex. barra de progresso pro próximo nível).
- **Nova rota** `src/app/gamification/` (ou `src/app/(tabs)/profile/gamification.tsx`): histórico de pontos, lista completa de badges, catálogo de recompensas resgatáveis.
- **Notificações**: reaproveitar `notification-bell` e `notification-modal` (já escutam o WebSocket) — eventos de gamificação aparecem no mesmo sino, sem novo componente de infraestrutura.

## 7. Roadmap de implementação

1. **Fase 1 — Base**: `gamification-profile`, `points-transaction`, cálculo de pontos nos eventos de `Appointment`/`Rating`, tela de perfil com pontos e badges básicos. Sem recompensas parceiras ainda.
2. **Fase 2 — Hábito**: streak de adesão, níveis Bronze/Prata/Ouro com benefícios de lembrete/antecedência, notificações de marco (`STREAK_MILESTONE`, `LEVEL_UP`).
3. **Fase 3 — Recompensas parceiras**: catálogo de `Reward` opt-in por unidade privada, fluxo de resgate, painel para a unidade cadastrar cupons (via `minha-vez-manager`).
4. **Fase 4 — Social (opcional)**: ranking opt-in só de pontos (sem dados de saúde), badges compartilháveis.

## 8. Métricas de sucesso

- Taxa de no-show antes/depois (por `QueueItem.status = ABSENT` / total agendado).
- % de pacientes com cadastro completo.
- Nº médio de exames preventivos por paciente/ano.
- Retenção de uso do app (consultas de retorno agendadas).
