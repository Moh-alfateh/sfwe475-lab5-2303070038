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
        <label htmlFor="title">Task title (required)</label>
        <input
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "title-error" : undefined}
        />
        {errors.title && <p id="title-error">{errors.title[0]}</p>}
      </div>
      <div>
        <label htmlFor="dueDate">Due date (optional)</label>
        <input
          id="dueDate"
          name="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          aria-invalid={!!errors.dueDate}
          aria-describedby={errors.dueDate ? "dueDate-error" : undefined}
        />
        {errors.dueDate && <p id="dueDate-error">{errors.dueDate[0]}</p>}
      </div>
      <div>
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-invalid={!!errors.status}
          aria-describedby={errors.status ? "status-error" : undefined}
        >
          <option value="open">open</option>
          <option value="doing">doing</option>
          <option value="done">done</option>
        </select>
        {errors.status && <p id="status-error">{errors.status[0]}</p>}
      </div>
      <button type="submit" disabled={title.trim() === ""}>
        Add task
      </button>
    </form>
  );
}

export default NewTaskForm;