import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useTasksGetCtaegory = (categoryId?: string) => {
  const query = useQuery({
    enabled: !!categoryId,
    queryKey: ["task"],

    queryFn: async () => {
      const response = await client.api.tasks[":categoryId"].$get({
        param: { categoryId },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
