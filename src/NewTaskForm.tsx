import { useState } from "react";
import type { FormEvent } from "react";
import { CreateTaskSchema } from "./schemas";
import type { CreateTaskInput } from "./schemas";

type Props = {
  onAddTask: (task: CreateTaskInput) => void;
};

type FieldErrors = {
  title?: string[];
  dueDate?: string[];
  status?: string[];
};

function NewTaskForm({ onAddTask }: Props) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("open");
  const [errors, setErrors] = useState<FieldErrors>({});

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = CreateTaskSchema.safeParse({ title, dueDate, status });
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }
    setErrors({});
    onAddTask(result.data);
    setTitle("");
    setDueDate("");
    setStatus("open");
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <p>{errors.title[0]}</p>}
      </div>
      <div>
        <input
          name="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        {errors.dueDate && <p>{errors.dueDate[0]}</p>}
      </div>
      <div>
        <select
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="open">open</option>
          <option value="doing">doing</option>
          <option value="done">done</option>
        </select>
        {errors.status && <p>{errors.status[0]}</p>}
      </div>
      <button type="submit">Add task</button>
    </form>
  );
}

export default NewTaskForm;