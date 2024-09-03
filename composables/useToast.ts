import { toast } from "vue-sonner";

//TODO: remove action toast
type ActionToast = { label: string; onClick: () => void };

export const useToast = (
  message: string,
  type?: string,
  action?: ActionToast
) => {
  const { label, onClick } = action || {};
  switch (type) {
    case "success":
      return toast.success(message);
    case "error":
      return toast.warning(message);
    case "action":
      return toast.success(message, {
        action: {
          label: label || "Default",
          onClick: onClick || (() => {}),
        },
      });
    default:
      return toast(message);
  }
};
