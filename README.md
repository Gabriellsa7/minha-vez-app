<div align="center">

<!-- IMG: logo do app (ex: assets/images/logo.png) -->
<img src="./assets/images/logo.png" alt="Minha Vez" width="120" />

# Minha Vez — App

**Chega de fila. Acompanhe sua vez em tempo real.**

Aplicativo mobile para pacientes agendarem exames, entrarem em filas de atendimento de unidades de saúde e acompanharem sua posição em tempo real, sem precisar esperar fisicamente no local.

[![Expo](https://img.shields.io/badge/Expo-~54-000020?logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?logo=react&logoColor=white)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NativeWind](https://img.shields.io/badge/NativeWind-Tailwind-06B6D4?logo=tailwindcss&logoColor=white)](https://www.nativewind.dev/)

<!-- IMG: mockup/print principal do app (ex.: home + fila em andamento lado a lado) -->
</div>

---

## Sobre o projeto

O **Minha Vez** é o app do paciente dentro de um ecossistema maior de gestão de filas de saúde, composto por três repositórios:

| Repositório | Papel |
|---|---|
| 📱 **minha-vez-app** (este repo) | App mobile do paciente — busca unidades, agenda exames, entra na fila e acompanha em tempo real |
| ⚙️ [minhavez-backend](../minhavez-backend) | API que centraliza filas, agendamentos, notificações e autenticação |
| 🖥️ [minha-vez-manager](../minha-vez-manager) | Painel web usado pelas unidades de saúde para gerenciar filas, profissionais e exames |

## ✨ Funcionalidades

- 🔎 **Busca e explorar** unidades de saúde por especialidade, serviço e localização
- 🩺 **Agendamento de exames**, com seleção de horários disponíveis por unidade/profissional
- ⏱️ **Fila em tempo real** — acompanhe sua posição e tempo estimado sem sair de casa
- 🔔 **Notificações push** quando sua vez estiver próxima ou o status mudar
- 📅 **Meus agendamentos** e **histórico** de atendimentos e exames
- ⭐ **Avaliação** de unidades e profissionais após o atendimento
- 👤 **Perfil e informações médicas**, com dados de prioridade de atendimento (idosos, gestantes, PCD etc.)
- 🌗 **Tema claro/escuro** e configurações de conta/segurança
- 🔐 **Autenticação** com login, cadastro e recuperação de senha

<!-- IMG: grid de prints (busca, fila em tempo real, agendamento, perfil) -->

## 🧱 Stack

- [Expo](https://expo.dev) + [Expo Router](https://docs.expo.dev/router/introduction/) (file-based routing)
- [React Native](https://reactnative.dev) 0.81 / React 19
- [TypeScript](https://www.typescriptlang.org/)
- [NativeWind](https://www.nativewind.dev/) (Tailwind CSS para React Native)
- [TanStack Query](https://tanstack.com/query) para cache e sincronização de dados com a API
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) para formulários e validação
- [Axios](https://axios-http.com/) para consumo da API
- WebSocket para atualização de fila em tempo real
- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) para push notifications

## 📂 Estrutura do projeto

```
src/
├── app/              # Rotas (Expo Router) — telas do app
├── features/         # Features isoladas (UI + hooks por domínio)
├── components/       # Componentes de UI reutilizáveis
├── services/         # Auth, notificações, tema, busca
├── config/           # Entidades, cliente axios, contratos de API
├── hooks/ lib/ utils/ # Utilitários e hooks compartilhados
```

## 🚀 Rodando localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npx expo`)
- API do [minhavez-backend](../minhavez-backend) rodando (local ou remota)
- App [Expo Go](https://expo.dev/go) no celular, ou emulador Android/iOS

### Instalação

```bash
# 1. Instale as dependências
npm install

# 2. Configure as variáveis de ambiente
cp .env.example .env   # e preencha os valores abaixo
```

```env
EXPO_PUBLIC_API_URL=https://sua-api.com
EXPO_PUBLIC_WS_URL=wss://sua-api.com
```

```bash
# 3. Inicie o app
npx expo start
```

No terminal do Expo, escolha abrir em:

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- Emulador Android / Simulador iOS
- [Expo Go](https://expo.dev/go)

### Scripts úteis

| Comando | Descrição |
|---|---|
| `npm run start` | Inicia o Metro bundler |
| `npm run android` / `npm run ios` | Roda em emulador/simulador nativo |
| `npm run web` | Roda a versão web do app |
| `npm run lint` | Roda o ESLint |
| `npm run build:dev` / `build:preview` / `build:production` | Builds via EAS Build |

## 📦 Build & distribuição

O app usa [EAS Build](https://docs.expo.dev/build/introduction/) para gerar builds nativos. Cada perfil (`development`, `preview`, `production`) atualiza a versão automaticamente antes de compilar (`scripts/bump-version.js`).

```bash
npm run build:production
```

<!-- IMG: banner/rodapé opcional -->

---

<div align="center">
  Feito com 💙 por <a href="https://github.com/Gabriellsa7">Gabriel Santana</a>
</div>
