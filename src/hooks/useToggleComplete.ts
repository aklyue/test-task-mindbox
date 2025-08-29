import { useDispatch } from "react-redux";
import { toggleComplete } from "../store/tasksReducer";

const useToggleComplete = () => {
  const dispatch = useDispatch();

  const toggleTaskComplete = async (taskId: string, taskCompleted: boolean) => {
    try {
      const response = await fetch(`http://localhost:3001/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !taskCompleted,
        }),
      });
      if (!response.ok) {
        throw new Error("Не удалось обновить задачу на сервере");
      }
      dispatch(toggleComplete({ taskId }));
    } catch (error) {
      console.error("Ошибка при обновлении задачи:", error);
    }
  };

  return toggleTaskComplete;
};

export default useToggleComplete;
