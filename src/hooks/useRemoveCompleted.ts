import { useDispatch } from "react-redux";
import { removeCompleted, Task } from "../store/tasksReducer";

const useRemoveCompleted = () => {
  const dispatch = useDispatch();

  const removeCompletedTasks = async () => {
    try {
      const response = await fetch("http://localhost:3001/tasks");
      const tasks: Task[] = await response.json();

      const completedTasks = tasks.filter((task) => task.completed);
      const deleteRequests = completedTasks.map((task) =>
        fetch(`http://localhost:3001/tasks/${task.id}`, {
          method: "DELETE",
        })
      );

      console.log(tasks);
      await Promise.all(deleteRequests);

      const remainingTasks = tasks.filter((task) => !task.completed);
      dispatch(removeCompleted(remainingTasks));
    } catch (error) {
      console.error("Error deleting tasks:", error);
    }
  };

  return removeCompletedTasks;
};

export default useRemoveCompleted;
