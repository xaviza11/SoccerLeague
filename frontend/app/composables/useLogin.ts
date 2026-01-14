import { handlerLogin } from "@/handlers/users";
import { useUserStore } from "#imports";
import { useAlert } from "#imports";

export default function useLogin() {
  const userStore = useUserStore();
  const { showAlert } = useAlert();

  const login = async (email: string, password: string, t: (key: string) => string) => {
    try {
      const response = await handlerLogin({ email, password });
      userStore.setName(response.username as string);
      return true;
    } catch (error: any) {
      showAlert({
        message: error.message || t("warnings.auth.loginFailed"),
        statusCode: error.status || 400,
      });
      return false;
    }
  };

  return { login };
}
