import { useEffect, useState } from "react";
import type { Task } from "./schemas";
import { simulateFetchTasks } from "./mockApi";
import TaskList from "./TaskList";

type Status = "loading" | "success" | "empty" | "error";

const MIN_LOADING_MS = 400;

function TaskBoard() {
  const [status, setStatus] = useState<Status>("loading");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const startedAt = Date.now();

    function finish(next: Status, data: Task[]) {
      const remaining = Math.max(0, MIN_LOADING_MS - (Date.now() - startedAt));
      timer = setTimeout(() => {
        setTasks(data);
        setStatus(next);
      }, remaining);
    }

    simulateFetchTasks()
      .then((data) => {
        if (!cancelled) finish(data.length === 0 ? "empty" : "success", data);
      })
      .catch(() => {
        if (!cancelled) finish("error", []);
      });

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [reloadKey]);

  function handleRetry() {
    setStatus("loading");
    setReloadKey((key) => key + 1);
  }

  return (
    <section>
      <h1>Task Board</h1>
      <div>
        {status === "loading" && <p>Loading tasks...</p>}
        {status === "error" && (
          <>
            <p>We couldn't load your tasks.</p>
            <button type="button" onClick={handleRetry}>
              Try loading tasks again
            </button>
          </>
        )}
        {status === "empty" && <p>No tasks yet. Add your first one below.</p>}
      </div>
      {status === "success" && <TaskList tasks={tasks} />}
    </section>
  );
}

export default TaskBoard;