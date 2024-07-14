import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono/client";
import { toast } from "sonner";

type RequestType = InferRequestType<
  (typeof client.api.tasks)[":id"]["$patch"]
>["json"];
type ResponseType = InferResponseType<
  (typeof client.api.tasks)[":id"]["$patch"]
>;

export const useTasksEdit = (id?: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.tasks[":id"]["$patch"]({
        json,
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Task Edited");
      queryClient.invalidateQueries({ queryKey: ["task"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => {
      console.log(mutation.error);
      toast.error("Failed to Edit Task");
    },
  });
  return mutation;
};
