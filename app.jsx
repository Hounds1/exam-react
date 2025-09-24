const { useEffect, useMemo, useRef, useState } = React;

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (e) {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // ignore persistence errors
    }
  }, [key, value]);

  return [value, setValue];
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const FILTERS = {
  all: () => true,
  active: (t) => !t.completed,
  completed: (t) => t.completed,
};

function App() {
  const [todos, setTodos] = useLocalStorage("todos", []);
  const [filter, setFilter] = useState("all");
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  const remainingCount = useMemo(
    () => todos.filter((t) => !t.completed).length,
    [todos]
  );

  const filteredTodos = useMemo(
    () => todos.filter(FILTERS[filter] || FILTERS.all),
    [todos, filter]
  );

  function addTodo(label) {
    const text = label.trim();
    if (!text) return;
    setTodos((prev) => [
      { id: generateId(), text, completed: false, createdAt: Date.now() },
      ...prev,
    ]);
    setInput("");
  }

  function toggleTodo(id) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }

  function removeTodo(id) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function clearCompleted() {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }

  function updateTodoText(id, text) {
    const next = text.trim();
    if (!next) {
      // If emptied during edit, remove
      removeTodo(id);
      return;
    }
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text: next } : t)));
  }

  function handleSubmit(e) {
    e.preventDefault();
    addTodo(input);
  }

  useEffect(() => {
    // Focus input on first mount
    inputRef.current?.focus();
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">TodoList</h1>
        <p className="subtitle">간단하고 빠른 작업 정리</p>
      </header>

      <form className="add-form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          className="input"
          type="text"
          placeholder="할 일을 입력 후 Enter"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="새 할 일 입력"
        />
        <button className="add-btn" type="submit" disabled={!input.trim()}>
          추가
        </button>
      </form>

      <div className="toolbar">
        <div className="filters" role="tablist" aria-label="필터">
          {[
            { key: "all", label: "전체" },
            { key: "active", label: "미완료" },
            { key: "completed", label: "완료" },
          ].map((f) => (
            <button
              key={f.key}
              role="tab"
              aria-selected={filter === f.key}
              className={`filter ${filter === f.key ? "is-active" : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="meta">
          <span className="count" aria-live="polite">
            남은 작업 {remainingCount}
          </span>
          <button className="clear" onClick={clearCompleted} disabled={!todos.some((t) => t.completed)}>
            완료 삭제
          </button>
        </div>
      </div>

      <ul className="list" role="list">
        {filteredTodos.length === 0 ? (
          <li className="empty">표시할 항목이 없습니다</li>
        ) : (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={() => toggleTodo(todo.id)}
              onRemove={() => removeTodo(todo.id)}
              onUpdate={(text) => updateTodoText(todo.id, text)}
            />
          ))
        )}
      </ul>

      <footer className="footer">
        <span>저장: LocalStorage</span>
      </footer>
    </div>
  );
}

function TodoItem({ todo, onToggle, onRemove, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);
  const editRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      editRef.current?.focus();
    }
  }, [isEditing]);

  function handleEditSubmit(e) {
    e.preventDefault();
    onUpdate(draft);
    setIsEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      setDraft(todo.text);
      setIsEditing(false);
    }
  }

  return (
    <li className={`item ${todo.completed ? "completed" : ""}`}>
      <label className="checkbox">
        <input type="checkbox" checked={todo.completed} onChange={onToggle} aria-label="완료 토글" />
        <span className="checkmark" />
      </label>

      {isEditing ? (
        <form className="edit-form" onSubmit={handleEditSubmit}>
          <input
            ref={editRef}
            className="edit-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="항목 편집"
          />
          <button className="save-btn" type="submit" disabled={!draft.trim()}>
            저장
          </button>
        </form>
      ) : (
        <button className="label" onClick={() => setIsEditing(true)} title="클릭하여 편집">
          {todo.text}
        </button>
      )}

      <button className="delete" onClick={onRemove} aria-label="항목 삭제" title="삭제">
        ×
      </button>
    </li>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

