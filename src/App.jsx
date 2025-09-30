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
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [tokenError, setTokenError] = useState(false);

  const refreshTodo = useCallback(async () => {
    try {
      const { items, total } = await listTodos();
      setTodo(items);
      setTotal(total);
    } catch (e) {
      setError(e);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const token = await generate();
        if (token === null || token === undefined) setTokenError(true);
      } catch (e) {
        console.log(e);
        setTokenError(true);
      }
    })();
  }, []);

  useEffect(() => {
    async function fetchTodo() {
      try {
        setLoading(true);
        setError(null);
        await refreshTodo();
      } catch (e) {
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
    } catch (e) {
      setError(e);
      await refreshTodo();
    }
  }, [complete, refreshTodo])

  const onIncomplete = useCallback(async (signature) => {
    setError(null);

    try {
      await incomplete(signature);
    } catch (e) {
      setError(e);
      await refreshTodo();
    }
  }, [incomplete, refreshTodo])

  const onRemove = useCallback(async (signature) => {
    setError(null);

    setTodo(prev => {
      const next = prev.filter(t => t.signature !== signature);
      setTotal(next.length);
      return next;
    });

    try {
      await remove(signature);
    } catch (e) {
      setError(e);
      await refreshTodo();
    }
  }, [remove, refreshTodo])

  const onSearch = useCallback(async (keyword) => {
    setError(null);
    try {
      const { items, total } = await listTodos({ keyword: keyword ?? '' });
      setTodo(items);
      setTotal(total);
    } catch (e) {
      setError(e);
    }
  }, []);

  const isEmpty = total === 0;
  const ready = !isLoading && !error;

  if (!ready) return <div className="status__row has-error">Internal Server Error Or Bad Request.</div>;
  if (tokenError) return <div className="status__row has-error">Failed to generate token.</div>;

  return (
    <div className="app">
      <Header
        onSearch={onSearch}
        onChangeFilter={setFilter}
        count={total}
      />

      <main className="main container" id="main">
        <section className="panel" aria-labelledby="addTodoTitle">
          <h2 id="addTodoTitle" className="panel__title">새 할 일 추가</h2>
          <TodoForm
            onCreate={onCreate}
            pending={isLoading}
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