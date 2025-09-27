export default function Header({ onSearch, onChangeFilter, count }) {
    function handleSearch(e) {
        e.preventDefault();
        const from = new FormData(e.currentTarget);
        onSearch?.(String(from.get("q") || ``));
    }

    return (
        <header className="header">
            <div className="header__inner container">
                <h1 className="header__title">TodoList</h1>

                <form className="header__search" role="search" onSubmit={handleSearch}>
                    <input className="input input--search" type="search" name="q" placeholder="할 일을 검색하세요…" />
                    <button className="btn btn--primary" type="submit">검색</button>
                </form>

                <div className="header__controls">
                    <div className="select">
                        <select className="select__field" onChange={(e) => onChangeFilter?.(e.target.value)}>
                            <option value="all">전체</option>
                            <option value="active">진행 중</option>
                            <option value="completed">완료</option>
                        </select>
                    </div>
                    <span className="counter" aria-live="polite">총 {count}개</span>
                </div>
            </div>
        </header>
    );
}