import React, { useState } from "react";
import useFetchTasks from "../../hooks/useFetchTasks";
import useTasksActions from "../../hooks/useTasksActions";
import c from "./Tasks.module.scss";

function Tasks() {
  const [taskText, setTaskText] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");

  const {
    handleTaskSubmit,
    handleChange,
    filteredTasks,
    handleComplete,
    remainingTasks,
    handleClear,
  } = useTasksActions({
    taskText,
    filter,
    setTaskText,
  });

  useFetchTasks();

  return (
    <div className={c.container}>
      <form className={c.taskForm} onSubmit={handleTaskSubmit}>
        <button className={c.symbol} type="submit">
          ❮
        </button>
        <input
          className={c.taskInput}
          placeholder="What needs to be done?"
          value={taskText}
          type="text"
          onChange={handleChange}
        />
      </form>
      <div className={c.tasksContainer}>
        {filteredTasks.map((task) => (
          <p className={c.task} key={task.id}>
            <input
              className={c.taskCheck}
              type="checkbox"
              checked={task.completed}
              onChange={() => handleComplete(task.id, task.completed)}
            />
            <span
              className={`${c.taskTitle} ${task.completed ? c.completed : ""}`}
            >
              {task.title}
            </span>
          </p>
        ))}
      </div>
      <div className={c.taskFormFooter}>
        <p className={c.taskCounter}>{remainingTasks} items left</p>
        <div className={c.btnRow}>
          <button
            onClick={() => setFilter("all")}
            className={filter === "all" ? c.active : ""}
          >
            All
          </button>
          <button
            onClick={() => setFilter("active")}
            className={filter === "active" ? c.active : ""}
          >
            Active
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={filter === "completed" ? c.active : ""}
          >
            Completed
          </button>
        </div>
        <button className={c.completedBtn} onClick={handleClear}>
          Clear completed
        </button>
      </div>
    </div>
  );
}

export default Tasks;
