"use client";

import { useCategoryGet } from "@/components/queries/categories/useCategoryGet";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { useNewCategory } from "../Hooks/use-new-category";
import { redirect, useRouter } from "next/navigation";

function Navbar() {
  const categoryQuery = useCategoryGet();
  const { onOpen } = useNewCategory();
  const categoryData = categoryQuery.data || [];
  const router = useRouter();

  const isDisabled = categoryQuery.isLoading;
  return (
    <div className="bg-zinc-800 h-full flex flex-col px-3 pt-10  items-center">
      <div className="w-full flex flex-col gap-4  items-center">
        <Button
          variant="outline"
          className="w-full hover:bg-zinc-900 bg-inherit border-amber-200 "
          onClick={onOpen}
        >
          <Plus className="mr-2 size-4 " />
          Create New
        </Button>
        {/*TODO: Add button actions */}
        <Button
          className="bg-amber-200 hover:bg-amber-300 w-full"
          onClick={() => {
            router.push("/");
          }}
        >
          All
        </Button>
      </div>
      <Separator className="bg-zinc-400 rounded-xl my-4" />
      <div className="w-full">
        <ScrollArea className="border-none h-full w-full">
          <div className="flex flex-col w-full  gap-4 items-center">
            {
              categoryData.map((c) => (
                <Button
                  className="bg-amber-200 hover:bg-amber-300 w-full"
                  onClick={() => {
                    router.replace(`${c.id}`);
                  }}
                >
                  {c.name}
                </Button>
              ))
              //TODO: Add button actions
            }
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

export { Navbar };
