import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono/client";
import { toast } from "sonner";

type RequestType = InferRequestType<typeof client.api.categories.$post>["json"];
type ResponseType = InferResponseType<typeof client.api.categories.$post>;

export const useCategoryCreate = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      console.log("hello");
      const response = await client.api.categories.$post({ json });
      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      toast.success("Category Created");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      console.log(mutation.error);
      toast.error("Failed to create category");
    },
  });
  return mutation;
};
