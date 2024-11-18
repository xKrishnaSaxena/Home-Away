import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


interface LoginInput {
  email: string;
  password: string;
}


interface User {
  id: string;
  email?: string;

}


interface LoginResponse {
  user: User|null;
}

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation<LoginResponse, Error, LoginInput>(
    (credentials: LoginInput) => login(credentials), 
    {
      onSuccess: (data) => {
        queryClient.setQueryData(["user"], data.user);
        navigate("/dashboard", { replace: true });
      },
      onError: () => {
        toast.error("Provided email or password are incorrect");
      },
    }
  );

  return { mutate, isLoading };
}
