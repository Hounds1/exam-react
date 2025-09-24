import { useMemo, useState } from 'react';
import { useTodo } from '../hooks/useTodo';

export default function TodoPage() {
  const { todos, loading, error, add, modify, remove } = useTodo();

  // 입력/편집 상태
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  // 완료 상태는 서버 스펙에 없으므로 클라이언트에서만 관리
  const [completedMap, setCompletedMap] = useState({});
  const [filter, setFilter] = useState('all'); // all | active | completed

  const handleAdd = async () => {
    const title = input.trim();
    if (!title) return;
    await add({ title, body: '', generatedBy: 'me' });
    setInput('');
  };

  const toggleComplete = (signature) => {
    setCompletedMap((prev) => ({ ...prev, [signature]: !prev[signature] }));
  };

  const clearCompleted = () => {
    setCompletedMap((prev) => {
      const next = {};
      for (const key of Object.keys(prev)) {
        if (!prev[key]) next[key] = false;
      }
      return next;
    });
  };

  const startEdit = (todo) => {
    setEditingId(todo.signature);
    setEditingText(todo.title);
  };

  const saveEdit = async (signature) => {
    const nextTitle = editingText.trim();
    if (!nextTitle) return setEditingId(null);
    await modify({ signature, title: nextTitle, body: '', modifiedBy: 'me' });
    setEditingId(null);
    setEditingText('');
  };

  const removeTodo = async (signature) => {
    await remove(signature);
  };

  const counts = useMemo(() => {
    const total = todos.length;
    let completed = 0;
    for (const t of todos) if (completedMap[t.signature]) completed += 1;
    return { total, completed, active: total - completed };
  }, [todos, completedMap]);

  const filteredTodos = useMemo(() => {
    if (filter === 'active') return todos.filter((t) => !completedMap[t.signature]);
    if (filter === 'completed') return todos.filter((t) => completedMap[t.signature]);
    return todos;
  }, [todos, completedMap, filter]);

  if (loading) {
    return (
      <div className="container">
        <div className="header">
          <h1 className="title">Todo List</h1>
          <p className="subtitle">목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="header">
          <h1 className="title">Todo List</h1>
          <p className="subtitle" style={{ color: 'var(--danger)' }}>오류: {String(error.message || error)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Todo List</h1>
        <p className="subtitle">오늘 할 일을 관리하세요</p>
      </div>

      <div className="add-form" role="form" aria-label="새 할 일 추가">
        <input
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="할 일을 입력하세요"
          aria-label="할 일 입력"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAdd();
          }}
        />
        <button className="add-btn" onClick={handleAdd} disabled={!input.trim()}>
          추가
        </button>
      </div>

      <div className="toolbar">
        <div className="filters" role="tablist" aria-label="필터">
          <button className={`filter ${filter === 'all' ? 'is-active' : ''}`} onClick={() => setFilter('all')} role="tab" aria-selected={filter === 'all'}>
            전체
          </button>
          <button className={`filter ${filter === 'active' ? 'is-active' : ''}`} onClick={() => setFilter('active')} role="tab" aria-selected={filter === 'active'}>
            진행중
          </button>
          <button className={`filter ${filter === 'completed' ? 'is-active' : ''}`} onClick={() => setFilter('completed')} role="tab" aria-selected={filter === 'completed'}>
            완료
          </button>
        </div>
        <div className="meta">
          <span className="count">남은 일 {counts.active} / 총 {counts.total}</span>
          <button className="clear" onClick={clearCompleted} disabled={counts.completed === 0}>
            완료 정리
          </button>
        </div>
      </div>

      <ul className="list">
        {filteredTodos.length === 0 ? (
          <li className="empty">표시할 할 일이 없습니다.</li>
        ) : (
          filteredTodos.map((t) => {
            const isCompleted = !!completedMap[t.signature];
            const isEditing = editingId === t.signature;
            return (
              <li key={t.signature} className={`item ${isCompleted ? 'completed' : ''}`}>
                <label className="checkbox" aria-label="완료 표시">
                  <input type="checkbox" checked={isCompleted} onChange={() => toggleComplete(t.signature)} />
                  <span className="checkmark" />
                </label>

                <div>
                  {isEditing ? (
                    <div className="edit-form">
                      <input
                        className="edit-input"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(t.signature); }}
                        autoFocus
                      />
                      <button className="save-btn" onClick={() => saveEdit(t.signature)}>저장</button>
                    </div>
                  ) : (
                    <button className="label" onClick={() => startEdit(t)} aria-label="제목 편집">
                      {t.title}
                    </button>
                  )}
                </div>

                <button className="delete" aria-label="삭제" onClick={() => removeTodo(t.signature)}>
                  ×
                </button>
              </li>
            );
          })
        )}
      </ul>

      <div className="footer">완료 상태는 이 브라우저에서만 유지됩니다.</div>
    </div>
  );
}
