import {
  useMarkNotificationAsRead,
  useUnreadNotifications,
} from "@/src/hooks/use-notifications";
import { router, usePathname } from "expo-router";
import { useRef, useState } from "react";
import { QueueClosedModal } from "./queue-closed-modal";

interface NotificationAlertGateProps {
  notificationType: string;
  title?: string;
}

export function NotificationAlertGate({
  notificationType,
  title,
}: NotificationAlertGateProps) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(
    () => new Set(),
  );
  const markedAsReadRef = useRef<Set<string>>(new Set());

  const pathname = usePathname();
  const isPastLoginScreen = pathname !== "/" && pathname !== "/login";

  const { data: unreadNotifications } = useUnreadNotifications({
    enabled: isPastLoginScreen,
  });
  const markNotificationAsRead = useMarkNotificationAsRead();

  const notification = unreadNotifications.find(
    (item) => item.type === notificationType && !dismissedIds.has(item._id),
  );

  const healthUnitId =
    typeof notification?.data?.healthUnitId === "string"
      ? notification.data.healthUnitId
      : undefined;

  const handleClose = () => {
    if (!notification) return;
    const notificationId = notification._id;
    setDismissedIds((previous) => new Set(previous).add(notificationId));
    if (markedAsReadRef.current.has(notificationId)) return;
    markedAsReadRef.current.add(notificationId);
    void markNotificationAsRead.mutateAsync(notificationId);
  };

  const handleFindAnotherDoctor = () => {
    if (!healthUnitId) return;
    handleClose();
    router.push({ pathname: "/agenda", params: { unitId: healthUnitId } });
  };

  return (
    <QueueClosedModal
      visible={Boolean(notification)}
      title={title}
      message={notification?.message ?? ""}
      onClose={handleClose}
      onFindAnotherDoctor={healthUnitId ? handleFindAnotherDoctor : undefined}
    />
  );
}
