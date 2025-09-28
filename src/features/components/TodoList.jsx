import TodoItem from './TodoItem';

export default function TodoList({ items = [], total = 0, onRemove, onComplete, onIncomplete}) {
  const isEmpty = total === 0;

  return (
    <ul className="todo-list" role="list" id="todoList" aria-describedby="listHelp">
      {isEmpty ? (
        <li>등록된 할 일이 없습니다.</li>
      ) : (
        items.map((todo) => (
          <TodoItem
            key={todo.signature}
            signature={todo.signature}
            title={todo.title}
            priority={todo.priority}
            dueDate={todo.dueDate}
            initialCompleted={todo.completed}
            onRemove={onRemove}
            onComplete={onComplete}
            onIncomplete={onIncomplete}
          />
        ))
      )}
      <p id="listHelp" className="hint">
        항목을 체크하여 완료로 표시할 수 있습니다.
      </p>
    </ul>
  );
}