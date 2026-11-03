import type { Task } from "./schemas";

type Props = {
  tasks: Task[];
};

function TaskList({ tasks }: Props) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          {task.title} - {task.status}
          {task.dueDate ? ` (due ${task.dueDate})` : ""}
        </li>
      ))}
    </ul>
  );
}

export default TaskList;