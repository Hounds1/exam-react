import Footer from "./features/components/Footer.jsx";
import Header from "./features/components/Header.jsx";
import StatusBar from "./features/components/StatusBar.jsx";
import TodoForm from "./features/components/TodoForm.jsx";
import TodoList from "./features/components/TodoList.jsx";
import TodoItem from "./features/components/TodoItem";

import { useEffect, useState } from 'react';
import { listTodos, details, create, modify, remove } from "./features/services/todoService.js";
import { generate } from "./features/services/instantTokenService.js";

export default function App() {
  const [todos, setTodo] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isEmpty, setEmpty] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [boot, setBoot] = useState({ ready: false, error: null, source: null});

  useEffect(() => {
    (async () => {
      try {
        const { source } = await generate();
        setBoot({ ready: true, error: null, source});
      } catch(e) {
        console.log(e);
        setBoot({ ready: false, error: e, source: null});
      }
    })();
  }, []);

  useEffect(() => {
    async function fetchTodo() {
      try {
        setLoading(true);
        setError(null);
        const { items } = await listTodos();
        setTodo(items);
        if(items.length === 0) setEmpty(true);
      } catch(e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }
    fetchTodo 
  }, [])



  if (!boot.ready && !boot.error) return <div className="status__row is-loading">Initializing…</div>;
  if (boot.error) return <div className="status__row has-error">Failed to generate token.</div>;

  return (
    <div className="app">
      <Header 
        onSearch={setQuery}
        onChangeFilter={setFilter}
        count={filter.length}      
      />

      <main className="main container" id="main">
        <section className="panel" aria-labelledby="addTodoTitle">
          <h2 id="addTodoTitle" className="panel__title">새 할 일 추가</h2>
          <TodoForm 
            onCreate={create}
            pending = {isLoading}
          />
          <p className="hint">엔터로 추가 가능. 제목은 필수입니다.</p>
        </section>

        <StatusBar 
          isLoading={isLoading}
          error={error}
          isEmpty={isEmpty}
        />

        <section className="panel" aria-labelledby="listTitle">
          <div className="panel__header">
            <h2 id="listTitle" className="panel__title">할 일 목록</h2>
            <div className="panel__actions">
              <button className="btn btn--ghost" type="button" id="toggleAll" data-testid="toggleAll">
                전체 완료 토글
              </button>
              <button className="btn btn--danger" type="button" id="clearCompleted" data-testid="clearCompleted">
                완료 항목 삭제
              </button>
            </div>
          </div>

          <TodoList />
          <p id="listHelp" className="hint">항목을 체크하여 완료로 표시할 수 있습니다.</p>
        </section>

      </main>

      <Footer />
    </div>
  );
}