# Relatório — Push, WebSocket e atualização de filas

Data: 06/08/2026

## Diagnóstico antes da alteração

### Push Notification

O backend persistia tokens Expo em `User.devices`, mas o worker enviava `notification.patientId` como destino do Expo. Esse valor é um ObjectId de `Patient`, não um `ExpoPushToken[...]`.

Além disso, sem `EXPO_ACCESS_TOKEN`, o provider registrava uma simulação bem-sucedida e retornava sucesso. O serviço então marcava a notificação como `SENT`, preenchia `deliveredAt` e registrava `Push delivered` sem validar ticket ou receipt da API Expo. Essa é a causa dos logs de sucesso sem push no Android.

### Foreground

O handler de notificações já existia, mas o app não criava canal Android antes de pedir token, não passava o `projectId` explicitamente e não tinha listeners para recebimento e interação.

### WebSocket

O gateway escutava em `3002`, enquanto o app usava `ws://192.168.0.18:3001`. A conexão também só era criada ao abrir a tela de notificações. O reconector criava sockets órfãos, pois os novos sockets não eram mantidos pela tela que originou a conexão.

### Fila

`QueueItem.position` era definida no agendamento e jamais recalculada ao chamar, finalizar ou marcar ausência. Portanto, `GET /queue-items/patient/:patientId` devolvia a posição histórica persistida; não era apenas cache do React Query. Também não havia broadcast para mudanças de fila.

## Implementação aplicada

### Backend (`minhavez-backend`)

- `src/domain/notification/service/notification.service.ts`
  - Resolve `patientId -> Patient.userId -> User.devices`.
  - Envia para todos os tokens ativos do usuário.
  - Inclui IDs da notificação, paciente, item de fila e consulta no payload.
  - Define `SENT` apenas após ticket aceito e `DELIVERED` somente após receipt positivo.
  - Persiste tickets e IDs em `providerResponse`.

- `src/infrastructure/external/expo/expo-notification.provider.ts`
  - Envia para a API Expo real; não há mais simulação de sucesso.
  - Registra payload, resposta HTTP completa, tickets, receipts e erros.
  - Falha o job se a API Expo ou algum ticket rejeitar o envio.
  - Usa `EXPO_ACCESS_TOKEN` quando configurado, sem torná-lo obrigatório ao modo padrão do Expo Push Service.

- `src/infrastructure/queue/bullmq/notification-job-scheduler.ts` e `src/infrastructure/queue/bullmq/workers/notification.worker.ts`
  - Criam job de receipt após 60 segundos, com retentativas exponenciais.
  - Após esgotar tentativas, marcam a notificação como `FAILED` e a encaminham à DLQ.

- `src/domain/notification/service/push-token.service.ts`
  - Valida `ExpoPushToken[...]`/`ExponentPushToken[...]`.
  - Atualiza ou insere o dispositivo em `User.devices` e registra log estruturado.

- `src/infrastructure/socket/notification.socket.ts` e `src/main.ts`
  - Gateway tornou-se singleton, iniciado no bootstrap do backend.
  - A porta é `WS_PORT` (padrão `3002`).
  - Adicionados logs de conexão, desconexão, broadcast, destinatários e clientes conectados.

- `src/domain/queue-item/service/queue-item.service.ts`
  - Recalcula e persiste posições após chamar, finalizar ou marcar ausência.
  - Considera itens `WAITING` e `IN_SERVICE` na posição atual.
  - Publica `queue.updated` e cria notificações ao cruzar os limiares configurados.

- Factories de notificação/agendamento/fila receberam as dependências de repositórios, scheduler e gateway necessárias ao fluxo.

### Frontend (`minha-vez-app`)

- `src/services/notifications/notification.service.ts`
  - Cria canal Android `queue-updates`, prioridade alta, vibração e som padrão antes da permissão/token.
  - Obtém token Expo com EAS `projectId` explícito e o registra no backend.
  - Centraliza um único WebSocket global, com reconexão controlada e assinantes.
  - Adiciona logs de connecting, connected, closed, error e message received.

- `src/app/_layout.tsx`
  - Mantém o socket ativo por toda a sessão.
  - Invalida as queries de itens e detalhes de fila em cada evento.
  - Registra listeners de push recebido, clique, abertura pelo push e notificações descartadas pelo sistema/provedor.

- `src/app/notifications.tsx`
  - Assina o socket global sem criar conexão exclusiva da tela.

- `app.json`
  - Configura `expo-notifications` com `defaultChannel: "queue-updates"`.
  - Exige novo Development Build.

- `.env` local
  - `EXPO_PUBLIC_WS_URL` foi corrigido para `ws://192.168.0.18:3002`.
  - O ambiente implantado deve apontar para a porta `WS_PORT` do backend.

## Logs esperados

Backend:

```text
Expo push token registered
Notification created
Notification job created
Notification worker started
Expo push request
Expo push response
Push accepted by Expo
Expo receipt job created
Expo push receipts response
Expo delivery confirmed by receipt
WebSocket event broadcasted
```

Os logs de push incluem token, payload, resposta do Expo, ticket IDs, receipt IDs e erros. O antigo `Push delivered` não é emitido antes de confirmação pelo receipt.

Aplicativo:

```text
[push] permission status
[push] Expo token obtained
[push] Expo token registered in backend
[socket] connecting
[socket] connected
[socket] message received
[realtime] invalidating queue cache
[push] received
[push] user clicked notification
[push] app opened from notification
```

## Validações executadas

| Projeto | Comando | Resultado |
| --- | --- | --- |
| Backend | `yarn build` | aprovado |
| Backend | `yarn test:unit` | 5 suites e 5 testes aprovados |
| App | `npx expo config --type public` | aprovado |
| App | `yarn lint` | aprovado |

Não foi possível enviar uma push física neste ambiente: isso requer dispositivo Android, configuração de credenciais Expo/FCM e acesso à rede externa. A implementação passou a registrar evidências suficientes para validar a entrega real, sem inferir sucesso.

## Roteiro de validação ponta a ponta

1. Inicie MongoDB e Redis; no backend configure `PORT=3001` e `WS_PORT=3002`, depois execute `yarn dev`.
2. Gere e instale novo Development Build: `npx expo run:android`.
3. Faça login em dispositivo físico, permita notificações e confira o token em `User.devices`.
4. Crie uma notificação ou chame um paciente. Valide `Expo push response` com ticket `status: "ok"` e, após cerca de um minuto, receipt e status `DELIVERED`.
5. Com o app aberto, valide banner, som, central de notificações e `[push] received`.
6. Em background, valide a notificação na central Android e o log ao tocá-la.
7. Com app encerrado, valide a notificação Android e `[push] app opened from notification` quando aberta pelo toque.
8. Chame/finalize/ausente um paciente com a tela inicial aberta. Confirme `queue.updated`, invalidação do cache e nova posição sem logout ou reinício.

## Limitações reais de plataforma

- Push visual normal não executa JavaScript com o app encerrado; a validação nesse estado é a exibição do Android e o log após interação do usuário.
- O Expo não expõe evento para detectar o gesto de dispensar uma push remota. `addNotificationsDroppedListener` detecta descarte pelo sistema/provedor, não pelo usuário.
- Headless background exige push somente de dados, `expo-task-manager` e configuração adicional. Não foi implementado porque não atende ao requisito principal de banner visual.
- A alteração em `app.json` é nativa: recompilar o Development Build é obrigatório.

## Referência Expo SDK 54

O SDK 54 requer Development Build para remote push no Android; também recomenda criar canal Android antes do token e informar `projectId` ao obter o Expo token.

- <https://docs.expo.dev/versions/v54.0.0/sdk/notifications/>
