export default function TodoForm({ onCreate, pending = false }) {
    const [title, setTitle] = useState('');
    const [dueDate, setDue] = useState('');
    const [priority, setPriority] = useState('normal');

    function handleSubmit(e) {
        e.preventDefault();
        if (!title.trim()) return;
        onCreate?.({ title: title.trim(), dueDate: dueDate || undefined, priority });
        setTitle(''); setDue(''); setPriority('normal');
    }

    return (
        <form className="todo-form" onSubmit={handleSubmit} autoComplete="off">
            <input className="input input--text" value={title} onChange={e => setTitle(e.target.value)} placeholder="할 일을 입력하세요" required />
            <input className="input input--date" type="date" value={dueDate} onChange={e => setDue(e.target.value)} />
            <select className="select__field" value={priority} onChange={e => setPriority(e.target.value)}>
                <option value="normal">보통</option><option value="high">높음</option><option value="low">낮음</option>
            </select>
            <div className="todo-form__row todo-form__row--actions">
                <button className="btn btn--primary" type="submit" disabled={pending || !title.trim()}>추가</button>
                <button className="btn btn--ghost" type="reset" onClick={() => { setTitle(''); setDue(''); setPriority('normal') }}>초기화</button>
            </div>
        </form>
    );
}