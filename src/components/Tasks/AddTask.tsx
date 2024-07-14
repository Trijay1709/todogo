"use client";

import { Plus, X } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { insertTaskSchema } from "@/db/schema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { useTasksCreate } from "../queries/tasks/useTasksPost";
import { useCategoryCreate } from "../queries/categories/useCategoryPost";
import { useCategoryGet } from "../queries/categories/useCategoryGet";
import { Select } from "../select";

type AddTaskProps = {
  categoryId?: string;
};
enum VARIANT {
  BUTTON = "BUTTON",
  ADD = "ADD",
}
const formSchema = insertTaskSchema.omit({
  id: true,
  userId: true,
  completed: true,
});

type formValues = z.input<typeof formSchema>;
function AddTask({ categoryId }: AddTaskProps) {
  const [variant, setVariant] = useState<VARIANT>(VARIANT.BUTTON);
  const createMutation = useTasksCreate();
  const handleSubmit = (values: formValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        setVariant(VARIANT.BUTTON);
      },
    });
  };
  const categoryMutation = useCategoryCreate();
  const categoryQuery = useCategoryGet();
  const onCreateCategory = (name: string) =>
    categoryMutation.mutate({
      name,
    });
  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));
  const defaultOptions = {
    label: "",
    categoryId: categoryId,
  };
  const disabled =
    createMutation.isPending ||
    categoryQuery.isLoading ||
    categoryMutation.isPending;
  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultOptions,
  });
  return (
    <div className="w-full">
      {variant === VARIANT.BUTTON ? (
        <div className="w-full flex justify-end pb-6">
          <Button
            className=" border-primary/25 p-4"
            variant="outline"
            onClick={() => setVariant(VARIANT.ADD)}
          >
            <Plus className="size-10" />
          </Button>
        </div>
      ) : (
        <div className="w-full flex gap-6 justify-between pb-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className=" space-y-4 pt-2 w-full"
            >
              <FormField
                name="label"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={disabled}
                        placeholder="Enter the Task "
                        className="w-full border-r-0 border-l-0 border-t-0 rounded-none ring-0 border-b-2 active:rounded-sm"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="categoryId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        placeholder="Select Category"
                        options={categoryOptions}
                        onCreate={onCreateCategory}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={disabled}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button className="" disabled={disabled}>
                Add Task
              </Button>
            </form>
          </Form>
          <Button
            className=" border-primary/25 p-4"
            variant="outline"
            onClick={() => setVariant(VARIANT.BUTTON)}
          >
            <X className="size-10" />
          </Button>
        </div>
      )}
    </div>
  );
}

export { AddTask };
