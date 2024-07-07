import { useNewCategory } from "@/components/Hooks/use-new-category";
import { useCategoryCreate } from "@/components/queries/categories/useCategoryPost";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { insertCategorySchema } from "@/db/schema";
import { z } from "zod";
import { NewCategoryForm } from "./NewCategoryForm";

function NewCategoryDialog() {
  const { isOpen, onClose, onOpen } = useNewCategory();
  const mutation = useCategoryCreate();
  const formSchema = insertCategorySchema.pick({
    name: true,
  });

  type formValues = z.input<typeof formSchema>;
  const onSubmit = async (values: formValues) => {
    console.log(values);
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new Category</DialogTitle>
          </DialogHeader>
          <NewCategoryForm onSubmit={onSubmit} disabled={mutation.isPending} />
        </DialogContent>
      </Dialog>
    </>
  );
}

export { NewCategoryDialog };
