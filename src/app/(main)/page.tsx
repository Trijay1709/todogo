import { TaskList } from "@/components/Tasks/TaskList";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <main className=" p-10">
      <span className="pr-8 text-4xl w-full flex justify-between">ALL</span>
      <TaskList />
    </main>
  );
}
