import { useDispatch, useSelector } from "react-redux";
import { removeCompleted, Task } from "../store/tasksReducer";
import { RootState } from "../store";

const useRemoveCompleted = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks);

  const removeCompletedTasks = async () => {
    const remainingTasks = tasks.filter((task) => !task.completed);
    dispatch(removeCompleted(remainingTasks));
    (async () => {
      try {
        const completedTasks = tasks.filter((task) => task.completed);
        const deleteRequests = completedTasks.map((task) =>
          fetch(`https://test-task-proxy.onrender.com/tasks/${task.id}`, {
            method: "DELETE",
          })
        );

        console.log(tasks);
        await Promise.all(deleteRequests);
      } catch (error) {
        console.error("Error deleting tasks:", error);
      }
    })();
  };

  return removeCompletedTasks;
};

export default useRemoveCompleted;
