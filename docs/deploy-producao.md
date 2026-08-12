# Como testar o Minha Vez em produção

Relatório gerado em 2026-08-12 com base no estado atual dos 3 projetos:

- **minha-vez-app** — app mobile (Expo + expo-router, EAS já configurado)
- **minhavez-backend** — API Node/TypeScript (Dockerfile pronto, MongoDB + Redis + WebSocket)
- **minha-vez-manager** — painel web (Vite + React, para gestores/unidades de saúde)

---

## 1. Resumo executivo

| Pergunta | Resposta curta |
|---|---|
| Dá pra publicar o app de graça numa loja? | **Não 100% grátis.** Google Play cobra **US$25 uma única vez**. Apple cobra **US$99/ano**. |
| Então só dá pra testar via build do Expo? | Sim, e essa é **a melhor opção pra testes agora**: gerar um `.apk` com EAS Build e instalar direto no Android, sem loja, sem custo. |
| Os usuários instalam e usam normal? | Sim — não é o app "Expo Go", é um instalável de verdade (standalone). Instala, abre e funciona como qualquer app do Android. |
| E o backend/painel web? | Precisam de hospedagem separada (Render/Railway/Fly.io para a API, Vercel/Netlify para o painel), porque não existe "loja" para eles. |

---

## 2. Backend (`minhavez-backend`)

O backend já tem `Dockerfile` e `docker-compose.yml` prontos, usando:

- **MongoDB** via `DATABASE_URI` (você já usa formato `mongodb+srv://...`, ou seja, já pensado para **MongoDB Atlas**)
- **Redis** (BullMQ, para as filas de notificação)
- **WebSocket** dedicado em `WS_PORT` (porta separada da HTTP, hoje `3000` HTTP / `3002` WS)
- JWT, SMTP (recuperação de senha), Cloudinary (upload de imagens/PDFs), push notifications Expo

### 2.1 Onde hospedar (grátis ou quase grátis)

| Serviço | Por quê | Free tier |
|---|---|---|
| **Render** | Sobe direto do seu `Dockerfile`, deploy automático via GitHub | Free web service (dorme após inatividade) |
| **Railway** | Também builda o `Dockerfile`, plano hobby barato ($5 crédito/mês) | Trial/hobby limitado |
| **Fly.io** | Suporta múltiplas portas/serviços no mesmo app (importante pelo WS, ver abaixo) | Free allowance pequeno |

Recomendo **Render** para começar (mais simples de configurar com Docker) ou **Fly.io** se o WebSocket em porta separada der problema (ver 2.3).

### 2.2 Banco de dados e Redis gerenciados (gratuitos)

- **MongoDB Atlas** — tier **M0 grátis** (512MB), já é o formato de URI que seu `.env.example` espera (`DATABASE_URI`).
- **Redis** — Render e Railway não têm Redis free tier robusto. Use **Upstash Redis** (free tier generoso, serverless) e aponte `REDIS_URL` para ele — seu código já suporta essa variável (`bullmq.provider.ts` lê `REDIS_HOST`/`REDIS_PORT`/`REDIS_URL`).

### 2.3 ✅ WebSocket unificado na porta HTTP (já ajustado)

Antes, `NotificationSocketGateway` subia um `WebSocketServer` numa **porta própria** (`WS_PORT`, 3002), separada da porta HTTP (3000) — o que quebraria em hosts free que só expõem uma porta pública por serviço.

Isso já foi corrigido em [`notification.socket.ts`](../../minhavez-backend/src/infrastructure/socket/notification.socket.ts): o `WebSocketServer` agora sobe com `{ noServer: true }` e se anexa ao evento `upgrade` do próprio servidor HTTP (`attachHttpServer()`, chamado em `main.ts` logo após `app.listen()`). Resultado: WS e HTTP dividem a mesma porta (`PORT`), então **qualquer host com uma única porta pública funciona** (Render, Railway, etc.) — sem precisar de Fly.io ou de configuração extra de portas.

A variável `WS_PORT` foi removida do `.env`/`.env.example` por não ser mais usada. No app, use o mesmo host/porta da API para o WS (ex.: `wss://sua-api.onrender.com`, sem porta separada).

### 2.4 Variáveis de ambiente a configurar no host

Baseado no seu `.env.example`:

```
DATABASE_URI=       # MongoDB Atlas
PORT=3000
TZ=America/Sao_Paulo
JWT_SECRET=          # gerar novo valor forte, não usar o de dev
JWT_EXPIRATION=1h
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRATION=7d
REDIS_URL=            # Upstash
SMTP_HOST=, SMTP_USER=, SMTP_PASS=, SMTP_FROM=   # para "esqueci senha"
EXPO_ACCESS_TOKEN=    # push notifications
CLOUDINARY_CLOUD_NAME=, CLOUDINARY_API_KEY=, CLOUDINARY_API_SECRET=
WS_PORT=3002
```

**Importante:** gere segredos novos (`JWT_SECRET`, `REFRESH_TOKEN_SECRET`) para produção — nunca reuse os de desenvolvimento local.

---

## 3. Painel web (`minha-vez-manager`)

É um app Vite + React puro (SPA), o deploy mais simples dos três:

1. **Vercel** ou **Netlify** (ambos free tier cobre tranquilamente esse uso)
2. Conectar o repositório, build command `npm run build` (ou `yarn build`), output `dist/`
3. Configurar a variável de ambiente que aponta para a URL da API em produção (procure no código do manager como o `axios`/baseURL é configurado — provavelmente algo como `VITE_API_URL`)

Sem custo nenhum nesse passo.

---

## 4. App mobile (`minha-vez-app`)

### 4.1 Publicação em loja é grátis?

**Não.**

| Loja | Custo | Observação |
|---|---|---|
| Google Play | **US$25, pagamento único** (não recorrente) | Depois de pago, você pode publicar quantos apps quiser, inclusive em faixas de teste interno/fechado gratuitas |
| Apple App Store | **US$99/ano** | Recorrente, e exige Mac para builds iOS nativos (o EAS Build resolve isso na nuvem, mas a taxa da Apple continua) |

Como seu público inicial parece ser Android (`android()`, `10.0.1.56` no `api.ts` sugerem testes locais em Android), faz sentido focar em Android primeiro.

### 4.2 Caminho grátis: EAS Build + instalação direta (recomendado para agora)

Seu projeto **já está configurado** para isso — `eas.json` já tem os perfis `development`, `preview` (distribution: `internal`, agora com `buildType: apk`) e `production`, e o `app.json` já tem `projectId` do EAS.

Passos:

```bash
# 1. Login (se ainda não estiver logado)
npx eas login

# 2. Build de um APK instalável (perfil "preview")
npx eas build --platform android --profile preview
```

Isso gera um link (e QR code) para baixar um `.apk` — **sem passar pela Play Store, sem custo, sem revisão**.

> ✅ Já ajustado: o perfil `preview` do `eas.json` agora tem `"android": { "buildType": "apk" }`, garantindo que o build gere um `.apk` instalável direto em vez do `.aab` (formato só de loja).

### 4.3 Como o usuário instala e usa

1. Você compartilha o **link do build** (ou QR code) gerado pelo EAS.
2. No Android do usuário: baixar o `.apk` pelo link → ao abrir, o Android pede para permitir "instalar apps de fontes desconhecidas" (só na primeira vez) → instalar.
3. Pronto — o app aparece na tela normalmente, com ícone próprio, **funciona 100% como um app baixado de loja** (não precisa do app "Expo Go", não precisa de internet especial, não expira como o Expo Go antigo).
4. Cada nova versão = novo build + novo link enviado (ou, mais à frente, configurar **EAS Update** para enviar atualizações de JS sem gerar novo APK toda vez).

Esse é o caminho mais rápido e **totalmente gratuito** para colocar o app na mão de testers reais.

### 4.4 Caminho "quase loja" grátis: Google Play Internal Testing

Se quiser algo mais parecido com o fluxo final (usuários instalam pela Play Store):

1. Pagar o registro único de US$25 na [Play Console](https://play.google.com/console).
2. Criar o app e subir o build (`eas build --platform android --profile production` + `eas submit`).
3. Usar a faixa **"Teste interno"** (internal testing) — até 100 testers por e-mail, **sem revisão da Google**, aprovação quase instantânea.
4. Testers recebem um link, aceitam o convite, instalam pela própria Play Store.

Vantagem sobre o APK direto: não precisa desabilitar "fontes desconhecidas", e já valida o fluxo de submissão que você vai usar quando for pra produção de verdade.

### 4.5 iOS

Fica mais caro e mais burocrático: precisa da conta Apple Developer (US$99/ano) e, para testes, do **TestFlight**. O EAS Build compila na nuvem (não precisa de Mac), mas o custo da conta Apple é inevitável. Se o foco agora é validar o produto, **vale adiar o iOS** e focar 100% em Android via 4.2.

### 4.6 Conectando o app ao backend de produção

Antes de gerar o build para os testers, atualize a variável de ambiente do app (`.env` ou variáveis do EAS):

```
EXPO_PUBLIC_API_URL=https://sua-api.onrender.com
EXPO_PUBLIC_WS_URL=wss://sua-api.onrender.com   # ajustar conforme solução do item 2.3
```

Hoje o `httpClient` em `src/services/api.ts` cai para um IP local (`10.0.1.56` / `192.168.0.19`) se essa env não estiver setada — isso é ótimo pra dev, mas **não funciona para testers fora da sua rede**. Sem configurar essa env antes do build, o app buildado vai tentar falar com seu IP local e falhar para qualquer pessoa fora da sua rede.

Para o EAS Build pegar essa env, ou:
- Deixar no `.env` versionado só para dev, e configurar via `eas.json` → `env` por perfil (`preview`/`production`), ou
- Configurar como **EAS secret**: `npx eas env:create --environment preview --name EXPO_PUBLIC_API_URL --value https://sua-api.onrender.com`

---

## 5. Checklist / ordem sugerida

1. [ ] Criar cluster grátis no **MongoDB Atlas** (M0) e pegar a `DATABASE_URI`
2. [ ] Criar banco Redis grátis no **Upstash** e pegar a `REDIS_URL`
3. [ ] (Opcional mas recomendado) Ajustar o backend para servir WebSocket na mesma porta HTTP
4. [ ] Subir o backend no **Render** (usa o `Dockerfile` existente), configurar todas as envs
5. [ ] Testar a API em produção com `curl`/Postman antes de mexer no app
6. [ ] Subir o **minha-vez-manager** na **Vercel**, apontando para a API de produção
7. [ ] Configurar `EXPO_PUBLIC_API_URL` / `EXPO_PUBLIC_WS_URL` no perfil `preview` do EAS
8. [ ] Rodar `eas build --platform android --profile preview` e distribuir o `.apk` para os testers
9. [ ] (Se quiser ir além) Pagar os US$25 da Play Console e subir para "Teste interno"

---

## 6. Custos totais estimados

| Item | Custo |
|---|---|
| MongoDB Atlas M0 | Grátis |
| Upstash Redis | Grátis (free tier) |
| Render (backend) | Grátis (com sleep) ou ~US$7/mês (sempre ativo) |
| Vercel (painel) | Grátis |
| EAS Build (Android) | Grátis até um limite mensal de builds no plano free do Expo |
| Distribuição via APK direto | Grátis |
| Google Play (opcional) | US$25 único |
| Apple App Store (opcional) | US$99/ano |

**Para validar o produto com testers reais, o caminho 100% gratuito é: Atlas + Upstash + Render (free) + EAS Build (preview/apk).**
