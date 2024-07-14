import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono/client";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)[":id"]["$delete"]
>;

export const useTaskDelete = (id?: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.tasks[":id"]["$delete"]({
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Task Deleted");
      // queryClient.invalidateQueries({queryKey:["account",{id}]});
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task"] });
    },
    onError: () => {
      console.log(mutation.error);
      toast.error("Failed to Delete Task");
    },
  });
  return mutation;
};
