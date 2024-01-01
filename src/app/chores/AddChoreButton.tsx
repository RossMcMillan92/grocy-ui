"use client"

import { Chore } from "types/grocy"
import { PlusOutline } from "heroicons-react"
import AddChoreModal from "components/AddChoreModal"
import React from "react"
import classNames from "helpers/classNames"

export function AddChoreButton({ sortedChores }: { sortedChores: Chore[] }) {
  const [status, setStatus] = React.useState<"pending" | "adding-chore">(
    "pending",
  )
  return (
    <>
      <button
        className={classNames(
          "flex items-center justify-center",
          "bg-gray-100 text-gray-700 text-sm py-3 px-4 rounded uppercase tracking-wide",
        )}
        aria-label="Add chore"
        onClick={() => setStatus("adding-chore")}
      >
        Add <PlusOutline className={classNames("text-gray-600 h-5 w-5 ml-2")} />
      </button>
      {status === "adding-chore" ? (
        <AddChoreModal chores={sortedChores} />
      ) : null}
    </>
  )
}
