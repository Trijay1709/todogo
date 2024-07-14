"use client";

import { insertTaskSchema } from "@/db/schema";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Select } from "@/components/select";

const formSchema = insertTaskSchema.omit({
  id: true,
  userId: true,
  completed: true,
});

type formValues = z.input<typeof formSchema>;
type EditTaskFormProps = {
  onSubmit: (values: formValues) => void;
  disabled: boolean;
  id: string;
  onDelete: () => void;
  defaultValues: formValues;
  onCreateCategory: (name: string) => void;
  categoryOptions: {
    label: string;
    value: string;
  }[];
};

function EditTaskForm({
  onSubmit,
  disabled,
  id,
  onDelete,
  defaultValues,
  onCreateCategory,
  categoryOptions,
}: EditTaskFormProps) {
  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });
  const handleSubmit = (values: formValues) => {
    onSubmit(values);
  };
  const handleDelete = () => {
    onDelete();
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className=" space-y-4 pt-2 w-full "
      >
        <FormField
          name="label"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Name</FormLabel> */}
              <FormControl>
                <Input
                  disabled={disabled}
                  //   placeholder="e.g. Food, Clothes, etc... "
                  className="w-full border-r-0 border-l-0 border-t-0 rounded-none ring-0 border-b-2"
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
        <div className="flex gap-x-2">
          <Button disabled={disabled}>Edit Task</Button>
          <Button
            type="button"
            disabled={disabled}
            onClick={handleDelete}
            className=" flex gap-x-2"
            variant="destructive"
          >
            <Trash className="size-4" />
            Delete Task
          </Button>
        </div>
      </form>
    </Form>
  );
}

export { EditTaskForm };
