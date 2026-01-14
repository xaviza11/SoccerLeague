import { handlerCreateUser } from "@/handlers/users";
import { useUserStore } from "#imports";
import { useAlert } from "#imports";

export default function useRegister() {
  const userStore = useUserStore();
  const { showAlert } = useAlert();

  const register = async (
    name: string,
    email: string,
    password: string,
    t: (key: string) => string,
  ) => {
    try {
      const response = await handlerCreateUser({
        name,
        email,
        password,
      });

      userStore.setName(response.username as string);
      return true;
    } catch (error: any) {
      showAlert({
        message: error?.message ?? t("warnings.auth.registerFailed"),
        statusCode: error?.status ?? 400,
      });
      return false;
    }
  };

  return { register };
}
