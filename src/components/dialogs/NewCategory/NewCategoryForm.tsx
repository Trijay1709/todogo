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

const formSchema = insertCategorySchema.pick({
  name: true,
});

type formValues = z.input<typeof formSchema>;
type NewCategoryFormProps = {
  onSubmit: (values: formValues) => void;
  disabled: boolean;
};

function NewCategoryForm({ onSubmit, disabled }: NewCategoryFormProps) {
  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
  });
  const handleSubmit = (values: formValues) => {
    onSubmit(values);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className=" space-y-4 pt-2"
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="e.g. Food, Clothes, etc... "
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={disabled}>
          Add Category
        </Button>
      </form>
    </Form>
  );
}

export { NewCategoryForm };
