const TaskCard = ({ task, editTask, deleteTask }: any) => {
  return (
    <div
      className={`flex items-center justify-between rounded-lg border px-4 py-3
        transition hover:bg-gray-50
        ${task.completed === true ? "opacity-70" : ""}
      `}
    >
      {/* Left */}
      <div className="flex flex-col gap-1">
        <span
          className={`text-sm md:text-base
            ${
              task.completed === true
                ? "line-through text-gray-500 font-normal"
                : "text-gray-950 font-medium"
            }
          `}
        >
          {task.title}
        </span>

        {/* Status text */}

        <span
          className={`text-xs font-medium px-3 py-1 rounded-full w-[80px] ${
            task.completed === true
              ? "bg-emerald-300 text-white" // Completed: green bg, white text
              : "bg-yellow-300 text-white" // Pending/Endon: yellow bg, white text
          }`}
        >
          {task.completed ? "Completed" : "Pending"}
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
