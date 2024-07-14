import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono/client";
import { toast } from "sonner";

type RequestType = InferRequestType<typeof client.api.tasks.$post>["json"];
type ResponseType = InferResponseType<typeof client.api.tasks.$post>;

export const useTasksCreate = (categoryId?: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      console.log("hello");
      const response = await client.api.tasks.$post({ json });
      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      toast.success("Task Created");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task"] });
    },
    onError: () => {
      console.log(mutation.error);
      toast.error("Failed to create task");
    },
  });
  return mutation;
};
