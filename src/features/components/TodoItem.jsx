import { useState } from 'react';
import { complete, incomplete } from '../services/todoService.js'

export default function TodoItem({ signature, title, priority, dueDate, initialCompleted , onRemove}) {
    const [completed, setCompleted] = useState(initialCompleted ?? false);
    const [pending, setPending] = useState(false);

    async function handleToggle(e) {
        const checked = e.target.checked;
        setCompleted(checked);

        try {
            if (checked) await complete(signature);
            else await incomplete(signature);
        } catch(err) {
            console.log(err);
            setCompleted(!checked);
        }
    }

    async function handleRemove() {
        if(pending) return;
        setPending(true);

        try {
            console.log(signature);
            await onRemove?.(signature);
        } finally {
            setPending(false);
        }
    }

    return (
        <li className="todo-item" data-id="ex-1">
            <label className="todo-item__body">
                <input className="todo-item__check" 
                type="checkbox" 
                aria-label="완료 표시"
                checked={completed}
                onChange={handleToggle} />
                <span className="todo-item__title">{title}</span>
            </label>

            <div className="todo-item__meta">
                <span className="badge">{priority}</span>
                <time className="badge" dateTime={dueDate}>마감: {dueDate}</time>
            </div>

            <div className="todo-item__actions">
                <button className="btn btn--ghost" type="button" data-action="edit">수정</button>
                <button className="btn btn--ghost" type="button" data-action="delete" onClick={handleRemove} disabled={pending}>삭제</button>
            </div>
        </li>
    );
}