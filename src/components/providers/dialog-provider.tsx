"use client";

import { useMountedState } from "react-use";
import { NewCategoryDialog } from "../dialogs/NewCategory/NewCategoryDialog";

export function DialogProvider() {
  const isMounted = useMountedState();
  if (!isMounted) return null;

  return (
    <>
      <NewCategoryDialog />
    </>
  );
}
