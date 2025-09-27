import TodoItem from "./TodoItem";

export default function TodoList() {
    return (
        <ul className="todo-list" role="list" id="todoList" aria-describedby="listHelp">
        <TodoItem />
      </ul>
    );
}