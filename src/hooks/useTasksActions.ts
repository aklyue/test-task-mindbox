import { useDispatch, useSelector } from "react-redux";
import useRemoveCompleted from "./useRemoveCompleted";
import useToggleComplete from "./useToggleComplete";
import { RootState } from "../store";
import { setTasks, Task } from "../store/tasksReducer";

interface useTasksActionsProps {
  taskText: string;
  filter: string;
  setTaskText: (task: string) => void;
}

const useTasksActions = ({
  taskText,
  filter,
  setTaskText,
}: useTasksActionsProps) => {
  const tasks = useSelector((state: RootState) => state.tasks);
  const dispatch = useDispatch();
  const removeCompletedTasks = useRemoveCompleted();
  const toggleTaskComplete = useToggleComplete();
  const handleTaskSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (taskText.trim() === "") return;

    const tempTask: Task = {
      id: Date.now().toString(),
      title: taskText,
      completed: false,
    };

    dispatch(setTasks([...tasks, tempTask]));
    setTaskText("");

    (async () => {
      try {
        const res = await fetch(`https://test-task-proxy.onrender.com/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tempTask),
        });

        const createdTask = await res.json();

        dispatch(setTasks([...tasks, createdTask]));

        if (!res.ok) {
          throw new Error("Failed to create task");
        }
      } catch (e) {
        console.error(e);
      }
    })();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskText(e.target.value);
  };

  const handleComplete = (taskId: string, taskCompleted: boolean) => {
    toggleTaskComplete(taskId, taskCompleted);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    if (filter === "all") return t;
  });

  const remainingTasks = tasks.filter((t) => !t.completed).length;

  const handleClear = () => {
    removeCompletedTasks();
  };

  return {
    handleTaskSubmit,
    handleChange,
    filteredTasks,
    handleComplete,
    remainingTasks,
    handleClear,
  };
};

export default useTasksActions;
