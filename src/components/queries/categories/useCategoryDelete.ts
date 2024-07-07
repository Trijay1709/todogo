import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono/client";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.categories)[":id"]["$delete"]
>;

export const usecategoryDelete = (id?: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.categories[":id"]["$delete"]({
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Category Deleted");
      // queryClient.invalidateQueries({queryKey:["account",{id}]});
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      console.log(mutation.error);
      toast.error("Failed to Delete Category");
    },
  });
  return mutation;
};
