const TaskCard = ({ task, editTask, deleteTask }: any) => {
  return (
    <div
      className={`flex items-center justify-between rounded-lg border px-4 py-3
        transition hover:bg-gray-50
        ${task.status === "completed" ? "opacity-70" : ""}
      `}
    >
      {/* Left */}
      <div className="flex flex-col gap-1">
        <span
          className={`text-sm md:text-base font-medium
            ${
              task.status === "completed"
                ? "line-through text-gray-400"
                : "text-gray-800"
            }
          `}
        >
          {task.title}
        </span>

        {/* Status text */}
        <span
          className={`text-xs
            ${
              task.status === "completed"
                ? "text-emerald-600"
                : "text-yellow-600"
            }
          `}
        >
          {task.status === "completed" ? "Completed" : "Pending"}
        </span>
      </div>

      {/* Right */}
      <div className="flex gap-2">
        <button
          onClick={() => editTask(task)}
          className="rounded-md border px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer"
        >
          Edit
        </button>
        <button
          onClick={() => deleteTask(task.id)}
          className="rounded-md bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600 cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
