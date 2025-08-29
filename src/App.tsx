import Tasks from "./components/Tasks";
import c from "./App.module.scss";

function App() {
  return (
    <div className={c.appContainer}>
      <p className={c.todosText}>
        todos
      </p>
      <Tasks />
    </div>
  );
}

export default App;
