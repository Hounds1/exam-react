import Footer from "./features/components/Footer.jsx";
import Header from "./features/components/Header.jsx";
import StatusBar from "./features/components/StatusBar.jsx";
import TodoForm from "./features/components/TodoForm.jsx";
import TodoList from "./features/components/TodoList.jsx";

import { useCallback, useEffect, useState } from 'react';
import { listTodos, details, create, modify, remove, complete, incomplete } from "./features/services/todoService.js";
import { generate } from "./features/services/instantTokenService.js";

export default function App() {
  const [todos, setTodo] = useState([]);
  const [total, setTotal] = useState(0);
  const [isEmpty, setEmpty] = useState(false);
  const [isLoading, setLoading] = useState(false);
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
        await refreshTodo();
      } catch(e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }
    fetchTodo();
  }, []);

  const onCreate = useCallback(async (payload) => {
    setLoading(true); setError(null);
    
    try {
    await create(payload);
    await refreshTodo();
  } catch (e) {
    setError(e);
  } finally {
    setLoading(false);
  }
  }, [create, refreshTodo]);

  const onComplete = useCallback(async (signature) => {
    setError(null);

    try {
      await complete(signature);
    } catch(e) {
      setError(e);
      await refreshTodo();
    }
  }, [complete, refreshTodo])

  const onIncomplete = useCallback(async (signature) => {
    setError(null);

    try {
      await incomplete(signature);
    } catch(e) {
      setError(e);
      await refreshTodo();
    }
  }, [incomplete, refreshTodo])

  const onRemove = useCallback(async (signature) => {
    setError(null);

    setTodo(prev => {
      const next = prev.filter(t => t.signature !== signature);
      setTotal(next.length);
      setEmpty(next.length === 0);
      return next;
    });
    
    try {
      await remove(signature);
    } catch(e) {
       setError(e);
       await refreshTodo();
    }
  }, [remove, refreshTodo])

  const refreshTodo = useCallback(async() => {
    try {
      const { items, total } = await listTodos();
      setTodo(items);
      setTotal(total);
      setEmpty(total === 0);
    } catch(e) {
      setError(e);
    }
  }, []);

  if (!boot.ready && !boot.error) return <div className="status__row is-loading">Initializing…</div>;
  if (boot.error) return <div className="status__row has-error">Failed to generate token.</div>;

  return (
    <div className="app">
      <Header 
        onSearch={setQuery}
        onChangeFilter={setFilter}
        count={total}
      />

      <main className="main container" id="main">
        <section className="panel" aria-labelledby="addTodoTitle">
          <h2 id="addTodoTitle" className="panel__title">새 할 일 추가</h2>
          <TodoForm 
            onCreate={onCreate}
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

          <TodoList 
            items={todos}
            total={total}
            onRemove={onRemove}
            onComplete={onComplete}
            onIncomplete={onIncomplete}
          />
        </section>

      </main>

      <Footer />
    </div>
  );
}