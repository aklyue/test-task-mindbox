import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setTasks } from "../store/tasksReducer";

const useFetchTasks = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("https://test-task-proxy.onrender.com/tasks");
        if (!res.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const tasks = await res.json();
        dispatch(setTasks(tasks));
      } catch (e) {
        console.error(e);
      }
    };

    fetchTasks();
  }, [dispatch]);
};

export default useFetchTasks;
