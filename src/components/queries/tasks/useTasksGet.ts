import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useTasksGet = () => {
  const query = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await client.api.tasks.$get();
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
