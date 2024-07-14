"use client";

import { useState } from "react";
import { useTasksGet } from "../queries/tasks/useTasksGet";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Edit, MoreVertical, Plus, PlusCircle } from "lucide-react";
import { useCategoryGet } from "../queries/categories/useCategoryGet";
import { Separator } from "../ui/separator";
import { IndivualTask } from "./IndivualTask";
import { AddTask } from "./AddTask";
//TODO ADD A COMPONENT WHICH CAN ADD TASKS
type TaskListCategoryProps = {
  categoryId: string;
};
function TaskListCategory({ categoryId }: TaskListCategoryProps) {
  const taskQuery = useTasksGet();
  const tasksData = taskQuery.data || [];

  console.log();
  return (
    <div className="flex flex-col w-full py-10 justify-center">
      <AddTask categoryId={categoryId} />

      <div className="px-8 gap-8 flex flex-col w-full">
        {tasksData
          ?.filter((task) => task.categoryId === categoryId)
          .map((task) => (
            <IndivualTask
              categoryId={task.categoryId}
              id={task.id}
              completed={task.completed}
              label={task.label}
            />
          ))}
      </div>
      {/* <Separator className=" my-6" /> */}
    </div>
  );
}

export { TaskListCategory };
