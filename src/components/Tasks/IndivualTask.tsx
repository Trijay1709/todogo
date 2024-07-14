"use client";

import { Edit, X } from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { useTasksComplete } from "../queries/tasks/useTaskComplete";
import { useState } from "react";
import { categories, insertTaskSchema } from "@/db/schema";
import { z } from "zod";
import { useTasksEdit } from "../queries/tasks/useTasksPatch";
import { useTaskDelete } from "../queries/tasks/useTasksDelete";
import { useCategoryCreate } from "../queries/categories/useCategoryPost";
import { useCategoryGet } from "../queries/categories/useCategoryGet";
import { EditTaskForm } from "../forms/EditTask/EditTask";

type IndivualTaskProps = {
  completed: boolean;
  label: string;
  id: string;
  categoryId: string | null;
};
enum VARIANT {
  BUTTON = "BUTTON",
  EDIT = "EDIT",
}
function IndivualTask({ completed, categoryId, label, id }: IndivualTaskProps) {
  const taskCompleteMutation = useTasksComplete(id);
  const [checked, setChecked] = useState<boolean>(completed);
  const [variant, setVariant] = useState<VARIANT>(VARIANT.BUTTON);
  const editmutation = useTasksEdit(id);
  const deletemutation = useTaskDelete(id);
  const formSchema = insertTaskSchema.omit({
    id: true,
    userId: true,
    completed: true,
  });

  type formValues = z.input<typeof formSchema>;
  const onEdit = (values: formValues) => {
    console.log(values);
    editmutation.mutate(values, {
      onSuccess: () => {
        setVariant(VARIANT.BUTTON);
      },
    });
  };
  const onDelete = () => {
    deletemutation.mutate(undefined, {
      onSuccess: () => {
        setVariant(VARIANT.BUTTON);
      },
    });
  };
  const handleCheckboxClick = () => {
    const values = {
      completed: !completed,
    };
    setChecked(values.completed);
    taskCompleteMutation.mutate(values, {
      onSuccess: () => {},
    });
  };
  const defaultValues = {
    label: label || "",
    categoryId: categoryId,
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
  const disabled =
    categoryMutation.isPending ||
    deletemutation.isPending ||
    editmutation.isPending ||
    categoryQuery.isLoading;
  if (variant === VARIANT.EDIT) {
    return (
      <div className="flex items-center text-wrap justify-between  w-full ">
        <EditTaskForm
          onSubmit={onEdit}
          onDelete={onDelete}
          categoryOptions={categoryOptions}
          onCreateCategory={onCreateCategory}
          defaultValues={defaultValues}
          disabled={disabled}
          id={id}
        />
        <Button
          onClick={() => setVariant(VARIANT.BUTTON)}
          className="border-none"
          variant="ghost"
        >
          <X />
        </Button>
      </div>
    );
  }
  return (
    <div className="flex items-center text-wrap gap-4   w-full">
      <Checkbox onClick={handleCheckboxClick} checked={checked} />
      <span className=" px-3 w-full text-wrap">{label}</span>
      <Button
        onClick={() => setVariant(VARIANT.EDIT)}
        className="border-none"
        variant="ghost"
      >
        <Edit />
      </Button>
    </div>
  );
}

export { IndivualTask };
