"use client";
import { EditCategoryForm } from "@/components/forms/EditCategory/EditCategory";
import { usecategoryDelete } from "@/components/queries/categories/useCategoryDelete";
import { useCategoryGetOne } from "@/components/queries/categories/useCategoryGetOne";
import { useCategoryEdit } from "@/components/queries/categories/useCategoryPatch";
import { TaskListCategory } from "@/components/Tasks/TaskListCategory";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { insertCategorySchema } from "@/db/schema";
import { useAuth } from "@clerk/nextjs";
import { Cross, Edit2, X } from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

type Props = {
  params: {
    categoryId: string;
  };
};

enum PAGE_STATE {
  LIST = "LIST",
  EDIT_CATEGORY = "EDIT_CATEGORY",
}

function Page({ params }: Props) {
  const [Page_state, setPage_state] = useState<PAGE_STATE>(PAGE_STATE.LIST);
  const { categoryId } = params;
  const categoryQuery = useCategoryGetOne(params.categoryId);
  const editmutation = useCategoryEdit(categoryQuery.data?.id);
  const deletemutation = usecategoryDelete(categoryQuery.data?.id);
  const isLoading = categoryQuery.isLoading;
  const isPending = editmutation.isPending || deletemutation.isPending;
  const router = useRouter();
  const formSchema = insertCategorySchema.pick({
    name: true,
  });
  type formValues = z.input<typeof formSchema>;
  const onEdit = (values: formValues) => {
    console.log(values);
    editmutation.mutate(values, {
      onSuccess: () => {
        setPage_state(PAGE_STATE.LIST);
      },
    });
  };
  const onDelete = () => {
    deletemutation.mutate(undefined, {
      onSuccess: () => {
        router.replace("/");
      },
    });
  };
  if (isLoading) {
    return <Skeleton className="h-full w-full" />;
  } else if (!categoryQuery.data) {
    return notFound();
  }
  const defaultValues = { name: categoryQuery.data?.name || "" };

  return (
    <div className="p-10 ">
      {Page_state !== PAGE_STATE.EDIT_CATEGORY ? (
        <div className="pr-8 text-4xl w-full flex justify-between">
          {categoryQuery.data.name}
          <Button
            variant="outline"
            className="border-none"
            onClick={() => {
              setPage_state(PAGE_STATE.EDIT_CATEGORY);
            }}
          >
            <Edit2 />
          </Button>
        </div>
      ) : (
        <div className="pr-8 text-4xl w-full flex justify-between">
          <EditCategoryForm
            disabled={isPending}
            defaultValues={defaultValues}
            onSubmit={onEdit}
            id={categoryQuery.data.id}
            onDelete={onDelete}
          />
          <Button
            variant="outline"
            className="border-none"
            onClick={() => {
              setPage_state(PAGE_STATE.LIST);
            }}
          >
            <X />
          </Button>
        </div>
      )}
      <Separator className="mt-6" />
      <TaskListCategory categoryId={categoryQuery.data?.id} />
    </div>
  );
}

export default Page;
