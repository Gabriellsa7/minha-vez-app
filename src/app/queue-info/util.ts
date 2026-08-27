import { EQueueItemStatus } from "@/src/config/entities/queue-items/queue-items.types";
import {
  EQueueShift,
  EQueueStatus,
} from "@/src/config/entities/queue/queue.type";

export const QUEUE_STATUS_LABEL: Record<EQueueStatus, string> = {
  [EQueueStatus.OPEN]: "Aberta",
  [EQueueStatus.IN_PROGRESS]: "Em andamento",
  [EQueueStatus.CLOSED]: "Fechada",
};

export const QUEUE_SHIFT_LABEL: Record<EQueueShift, string> = {
  [EQueueShift.MORNING]: "Manhã",
  [EQueueShift.AFTERNOON]: "Tarde",
};

export const ITEM_STATUS_LABEL: Record<EQueueItemStatus, string> = {
  [EQueueItemStatus.WAITING]: "Aguardando",
  [EQueueItemStatus.IN_SERVICE]: "Em atendimento",
  [EQueueItemStatus.FINISHED]: "Finalizado",
  [EQueueItemStatus.ABSENT]: "Ausente",
  [EQueueItemStatus.QUEUE_CLOSED]: "Fila encerrada",
};
