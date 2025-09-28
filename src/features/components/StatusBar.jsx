export default function StatusBar({ isLoading, error, total}) {
    const isEmpty = total === 0;

    return (
        <section className="status" aria-live="polite">
            <div className="status__row is-loading" hidden={!isLoading}>로딩 중…</div>
            <div className="status__row has-error" hidden={!error} role="alert">
                {error ? (error.message ?? '오류가 발생했습니다.') : null}
            </div>
            <div className="status__row is-empty" hidden={isEmpty}>등록된 할 일이 없습니다.</div>
        </section>
    );
}