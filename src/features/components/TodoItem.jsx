export default function TodoItem() {
    return (
        <li className="todo-item" data-id="ex-1">
            <label className="todo-item__body">
                <input className="todo-item__check" type="checkbox" aria-label="완료 표시" />
                <span className="todo-item__title">예시 할 일 제목입니다.</span>
            </label>

            <div className="todo-item__meta">
                <span className="badge">우선순위: 보통</span>
                <time className="badge" dateTime="2025-09-30">마감: 2025-09-30</time>
            </div>

            <div className="todo-item__actions">
                <button className="btn btn--ghost" type="button" data-action="edit">수정</button>
                <button className="btn btn--ghost" type="button" data-action="delete">삭제</button>
            </div>
        </li>

    );
}