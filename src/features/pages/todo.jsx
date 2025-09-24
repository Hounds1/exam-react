import { useState } from 'react';
import { useTodo } from '../hooks/useTodo';

export default function TodoPage() {
  // 객체 구조 분해로 받습니다.
  const {todos, loading, error, add, modify, remove } = useTodo();
  const [input, setInput] = useState('');

  const handleAdd = async () => {
    const title = input.trim();
    if (!title) return;

    // 훅의 add 시그니처에 따라 둘 중 하나를 선택하십시오.
    // 1) add가 payload를 받는 경우(권장)
    await add({ title, body: '', generatedBy: 'me' });

    // 2) add가 문자열(title)만 받도록 구현한 경우
    // await add(title);

    setInput('');
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: 20 }}>Loading...</div>;
  if (error)   return <div style={{ textAlign: 'center', marginTop: 20 }}>Error: {String(error.message || error)}</div>;

  return (
    <div style={{ padding: 16 }}>
      <h1>Todo List</h1>
      <div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="할 일을 입력하세요"
        />
        <button onClick={handleAdd} style={{ marginLeft: 8 }}>추가</button>
      </div>

      <ul>
        {todos.map((t) => (
          <li key={t.signature} style={{ marginTop: 8 }}>
            {/* 서버 스펙에 completed가 없으므로 체크박스는 우선 제거 */}
            <span style={{ marginLeft: 8 }}>{t.title}</span>
            <button onClick={() => remove(t.signature)} style={{ marginLeft: 8 }}>
              삭제
            </button>
            {/* 수정(예: 제목 변경) 예시 버튼 */}
            <button
              onClick={() => modify({ signature: t.signature, title: t.title + ' (수정)', body: t.body, modifiedBy: 'me' })}
              style={{ marginLeft: 8 }}
            >
              수정
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
