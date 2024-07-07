"use client";

import { insertCategorySchema } from "@/db/schema";
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

const formSchema = insertCategorySchema.pick({
  name: true,
});

type formValues = z.input<typeof formSchema>;
type EditCategoryFormProps = {
  onSubmit: (values: formValues) => void;
  disabled: boolean;
  id: string;
  onDelete: () => void;
  defaultValues: formValues;
};

function EditCategoryForm({
  onSubmit,
  disabled,
  id,
  onDelete,
  defaultValues,
}: EditCategoryFormProps) {
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
        className=" space-y-4 pt-2 w-full"
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Name</FormLabel> */}
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="e.g. Food, Clothes, etc... "
                  className="w-full border-r-0 border-l-0 border-t-0 rounded-none ring-0 text-4xl border-b-2"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex gap-x-2">
          <Button disabled={disabled}>Edit Category</Button>
          <Button
            type="button"
            disabled={disabled}
            onClick={handleDelete}
            className=" flex gap-x-2"
            variant="destructive"
          >
            <Trash className="size-4" />
            Delete category
          </Button>
        </div>
      </form>
    </Form>
  );
}

export { EditCategoryForm };
