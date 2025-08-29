import { useDispatch } from "react-redux";
import { toggleComplete } from "../store/tasksReducer";

const useToggleComplete = () => {
  const dispatch = useDispatch();

  const toggleTaskComplete = async (taskId: string, taskCompleted: boolean) => {
    dispatch(toggleComplete({ taskId }));
    (async () => {
      try {
        const response = await fetch(
          `https://test-task-proxy.onrender.com/tasks/${taskId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              completed: !taskCompleted,
            }),
          }
        );
        if (!response.ok) {
          throw new Error("Не удалось обновить задачу на сервере");
        }
      } catch (error) {
        console.error("Ошибка при обновлении задачи:", error);
      }
    })();
  };

  return toggleTaskComplete;
};

export default useToggleComplete;
