import React, { useEffect, useState } from "react";
import uuid from "uuid/v4";
import update from "immutability-helper";

const ALL = "ALL";
const COMPLETE = "COMPLETE";
const INCOMPLETE = "INCOMPLETE";

const FILTERS = [ALL, COMPLETE, INCOMPLETE];

function getVisibleTodos(todos, filter) {
  switch (filter) {
    case COMPLETE:
      return todos.filter(todo => todo.complete);
    case INCOMPLETE:
      return todos.filter(todo => !todo.complete);
    default:
      return todos;
  }
}

function Todos() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState(ALL);
  const visibleTodos = getVisibleTodos(todos, filter);

  useEffect(() => {
    const localStorageFilter = localStorage.getItem("filter");
    if (localStorageFilter && FILTERS.includes(localStorageFilter)) {
      setFilter(localStorageFilter);
    }

    const localStorageTodos = localStorage.getItem("todos");
    try {
      const todos = JSON.parse(localStorageTodos);
      if (todos) {
        setTodos(todos);
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("filter", filter);
  }, [filter]);

  const handleNewTodo = ({ text }) => {
    setTodos([...todos, { id: uuid(), text, complete: false }]);
  };

  const handleToggleTodo = id => {
    const index = todos.findIndex(todo => id === todo.id);
    const updated = update(todos, {
      [index]: { complete: { $set: !todos[index].complete } }
    });
    setTodos(updated);
  };

  const handleDeleteTodo = id => {
    const updated = todos.filter(todo => id !== todo.id);
    setTodos(updated);
  };

  return (
    <div>
      <div style={{ padding: 8, border: "1px solid blue" }}>
        <button onClick={() => setFilter(ALL)} disabled={filter === ALL}>
          All
        </button>
        <button
          style={{ marginLeft: 8 }}
          onClick={() => setFilter(COMPLETE)}
          disabled={filter === COMPLETE}
        >
          Complete
        </button>
        <button
          style={{ marginLeft: 8 }}
          onClick={() => setFilter(INCOMPLETE)}
          disabled={filter === INCOMPLETE}
        >
          Incomplete
        </button>
      </div>

      <div style={{ marginTop: 16 }}>
        {visibleTodos.map(({ id, text, complete }) => (
          <div
            key={id}
            style={{
              display: "flex",
              padding: 8,
              marginTop: 8,
              border: "1px solid green"
            }}
          >
            <span
              style={{
                textDecoration: complete ? "line-through" : "none",
                flex: 1
              }}
              data-test="todo-text"
              onClick={() => handleToggleTodo(id)}
            >
              {text}
            </span>
            <button
              style={{ marginLeft: 8 }}
              data-test="todo-remove"
              onClick={() => handleDeleteTodo(id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <TodosForm onSubmit={handleNewTodo} />
    </div>
  );
}

function TodosForm({ onSubmit }) {
  const [text, setText] = useState("");

  const handleSubmit = e => {
    e.preventDefault();

    setText("");
    onSubmit({ text });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", marginTop: 16 }}>
      <input
        type="text"
        style={{ flex: "1", padding: 4 }}
        placeholder="What are you going to do?"
        data-testid="todo-form-input"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        type="submit"
        style={{ marginLeft: 16 }}
        data-testid="todo-form-submit"
      >
        Create
      </button>
    </form>
  );
}

export default Todos;
