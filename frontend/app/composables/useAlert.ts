import { ref } from "vue";

export type AlertType = "success" | "warning" | "error" | "debug" | "info";

export interface AlertOptions {
  message: string;
  statusCode: number;
  duration?: number;
}

interface AlertItem extends AlertOptions {
  id: number;
  type: AlertType;
}

export const alerts = ref<AlertItem[]>([]);

const cleanMessage = (message: string) => {
  if (!message) return "";
  const lastSpaceIndex = message.lastIndexOf(" ");
  return lastSpaceIndex !== -1 ? message.slice(lastSpaceIndex + 1) : message;
};

export default function useAlert() {
  const getAlertType = (statusCode: number): AlertType => {
    if (statusCode >= 200 && statusCode < 300) return "success";
    if (statusCode >= 400 && statusCode < 500) return "warning";
    if (statusCode >= 500) return "error";
    return "info";
  };

  const showAlert = (options: AlertOptions) => {
    const id = Date.now() + Math.random();
    const type = getAlertType(options.statusCode);
    const message = cleanMessage(options.message);

    alerts.value.push({ ...options, id, type, message });

    if (options.duration !== 0) {
      setTimeout(() => {
        removeAlert(id);
      }, options.duration ?? 5000);
    }
  };

  const removeAlert = (id: number) => {
    alerts.value = alerts.value.filter((a) => a.id !== id);
  };

  return { alerts, showAlert, removeAlert };
}
