import { renderHook, act } from "@testing-library/react";
import { useDispatch, useSelector } from "react-redux";
import useFetchTasks from "../hooks/useFetchTasks";
import useRemoveCompleted from "../hooks/useRemoveCompleted";
import useToggleComplete from "../hooks/useToggleComplete";
import useTasksActions from "../hooks/useTasksActions";
import {
  setTasks,
  removeCompleted,
  toggleComplete,
  Task,
} from "../store/tasksReducer";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
});

describe("useFetchTasks", () => {
  it("загружает задачи и диспатчит setTasks", async () => {
    const mockDispatch = jest.fn();
    (useDispatch as jest.MockedFunction<typeof useDispatch>).mockReturnValue(
      mockDispatch
    );

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: "1", title: "Test task", completed: false }],
    });

    renderHook(() => useFetchTasks());

    await new Promise(setImmediate);

    expect(global.fetch).toHaveBeenCalledWith("http://localhost:3001/tasks");
    expect(mockDispatch).toHaveBeenCalledWith(
      setTasks([{ id: "1", title: "Test task", completed: false }])
    );
  });
});

describe("useRemoveCompleted", () => {
  it("удаляет все completed задачи и диспатчит removeCompleted", async () => {
    const mockDispatch = jest.fn();
    (useDispatch as jest.MockedFunction<typeof useDispatch>).mockReturnValue(
      mockDispatch
    );

    const tasks = [
      { id: "1", title: "Active task", completed: false },
      { id: "2", title: "Done task", completed: true },
    ];

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: async () => tasks,
      })
      .mockResolvedValueOnce({ ok: true });

    const { result } = renderHook(() => useRemoveCompleted());

    await act(async () => {
      await result.current();
    });

    expect(mockDispatch).toHaveBeenCalledWith(removeCompleted([tasks[0]]));
  });
});

describe("useToggleComplete", () => {
  it("PATCH обновляет задачу и диспатчит toggleComplete", async () => {
    const mockDispatch = jest.fn();
    (useDispatch as jest.MockedFunction<typeof useDispatch>).mockReturnValue(
      mockDispatch
    );

    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    const { result } = renderHook(() => useToggleComplete());

    await act(async () => {
      await result.current("1", false);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "https://test-task-proxy.onrender.com/tasks/1",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ completed: true }),
      })
    );

    expect(mockDispatch).toHaveBeenCalledWith(toggleComplete({ taskId: "1" }));
  });
});

describe("useTasksActions", () => {
  it("handleTaskSubmit добавляет задачу и диспатчит setTasks", async () => {
    const mockSelector = jest.fn();
    const mockDispatch = jest.fn();
    (useDispatch as jest.MockedFunction<typeof useDispatch>).mockReturnValue(
      mockDispatch
    );

    (useSelector as jest.MockedFunction<typeof useDispatch>).mockReturnValue(
      mockSelector
    );

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "1", title: "New task", completed: false }),
    });

    const setTaskText = jest.fn();

    const { result } = renderHook(() =>
      useTasksActions({ taskText: "Hello", filter: "all", setTaskText })
    );

    const fakeEvent = { preventDefault: jest.fn() } as any;

    await act(async () => {
      await result.current.handleTaskSubmit(fakeEvent);
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      setTasks([{ id: "1", title: "New task", completed: false }])
    );
    expect(setTaskText).toHaveBeenCalledWith("");
  });

  it("handleChange меняет текст", () => {
    const mockDispatch = jest.fn();
    const setTaskText = jest.fn();
    (useSelector as jest.MockedFunction<typeof useDispatch>).mockReturnValue(
      mockDispatch
    );
    (useDispatch as jest.MockedFunction<typeof useDispatch>).mockReturnValue(
      jest.fn()
    );

    const { result } = renderHook(() =>
      useTasksActions({ taskText: "", filter: "all", setTaskText })
    );

    act(() => {
      result.current.handleChange({ target: { value: "abc" } } as any);
    });

    expect(setTaskText).toHaveBeenCalledWith("abc");
  });

  it("filteredTasks фильтрует completed", () => {
    const tasks = [
      { id: "1", title: "A", completed: false },
      { id: "2", title: "B", completed: true },
    ];
    const mockDispatch = jest.fn();
    (useSelector as jest.MockedFunction<typeof useDispatch>).mockReturnValue(
      mockDispatch
    );
    (useDispatch as jest.MockedFunction<typeof useDispatch>).mockReturnValue(
      jest.fn()
    );

    const { result } = renderHook(() =>
      useTasksActions({
        taskText: "",
        filter: "completed",
        setTaskText: jest.fn(),
      })
    );

    expect(result.current.filteredTasks).toEqual([tasks[1]]);
    expect(result.current.remainingTasks).toBe(1);
  });
});
