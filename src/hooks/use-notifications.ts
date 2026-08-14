import { useGetPatientById } from "@/src/api/get-patient-by-id";
import { useGetUser } from "@/src/api/get-user-me";
import {
  NotificationItem,
  NotificationService,
} from "@/src/services/notifications/notification.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const notificationQueryKeys = {
  all: ["notifications"] as const,
  list: (patientId: string) => ["notifications", patientId] as const,
  unread: (patientId: string) => ["notifications", patientId, "unread"] as const,
  detail: (patientId: string, id: string) =>
    ["notifications", patientId, "detail", id] as const,
};

const NOTIFICATIONS_STALE_TIME = 30_000;

function useCurrentPatient() {
  const userQuery = useGetUser();
  const patientQuery = useGetPatientById(
    { userId: userQuery.data?._id ?? "" },
    { enabled: Boolean(userQuery.data?._id), retry: false },
  );

  return { userQuery, patientQuery, patientId: patientQuery.data?._id };
}

function filterNotificationsByPatient(
  notifications: NotificationItem[],
  patientId: string,
) {
  return notifications.filter((notification) => notification.patientId === patientId);
}

function usePatientNotifications(
  queryType: "all" | "unread",
  options?: { enabled?: boolean },
) {
  const { userQuery, patientQuery, patientId } = useCurrentPatient();
  const isEnabled = Boolean(patientId) && (options?.enabled ?? true);
  const query = useQuery<NotificationItem[], Error>({
    queryKey:
      queryType === "all"
        ? notificationQueryKeys.list(patientId ?? "unknown")
        : notificationQueryKeys.unread(patientId ?? "unknown"),
    queryFn: async () => {
      const notifications =
        queryType === "all"
          ? await NotificationService.listNotifications()
          : await NotificationService.listUnreadNotifications();

      return filterNotificationsByPatient(notifications, patientId!);
    },
    staleTime: NOTIFICATIONS_STALE_TIME,
    enabled: isEnabled,
  });

  return {
    ...query,
    data: query.data ?? [],
    isLoading: userQuery.isLoading || patientQuery.isLoading || query.isLoading,
    isError: userQuery.isError || patientQuery.isError || query.isError,
    patientId,
  };
}

export function useNotifications(options?: { enabled?: boolean }) {
  return usePatientNotifications("all", options);
}

export function useUnreadNotifications() {
  return usePatientNotifications("unread");
}

export function useNotification(id?: string) {
  const notificationsQuery = useNotifications();

  return {
    ...notificationsQuery,
    data: notificationsQuery.data?.find((notification) => notification._id === id),
  };
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  const { patientId } = useCurrentPatient();

  return useMutation({
    mutationFn: (id: string) => NotificationService.markAsRead(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<NotificationItem[]>(
        notificationQueryKeys.list(patientId ?? "unknown"),
        (notifications) =>
          notifications?.map((notification) =>
            notification._id === id ? { ...notification, read: true } : notification,
          ),
      );
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
      if (patientId) {
        queryClient.invalidateQueries({
          queryKey: notificationQueryKeys.unread(patientId),
        });
        queryClient.invalidateQueries({
          queryKey: notificationQueryKeys.detail(patientId, id),
        });
      }
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  const { patientId } = useCurrentPatient();

  return useMutation({
    mutationFn: () => NotificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.setQueryData<NotificationItem[]>(
        notificationQueryKeys.list(patientId ?? "unknown"),
        (notifications) =>
          notifications?.map((notification) => ({ ...notification, read: true })),
      );
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
    },
  });
}

export function useClearNotifications() {
  const queryClient = useQueryClient();
  const { patientId } = useCurrentPatient();

  return useMutation({
    mutationFn: () => NotificationService.clearNotifications(),
    onSuccess: () => {
      queryClient.setQueryData<NotificationItem[]>(
        notificationQueryKeys.list(patientId ?? "unknown"),
        [],
      );
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
    },
  });
}

export function invalidateNotificationQueries(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
}
