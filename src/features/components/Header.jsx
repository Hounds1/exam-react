import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Header
 * - props:
 *   - onSearch(keyword: string): Promise<void> | void
 *   - onChangeFilter(value: 'all'|'active'|'completed'): void
 *   - count: number
 *   - defaultQuery?: string
 *   - debounceMs?: number  // 기본 300ms
 *   - searchOnType?: boolean // 기본 true (false면 submit으로만 검색)
 */
export default function Header({
  onSearch,
  onChangeFilter,
  count,
  defaultQuery = '',
  debounceMs = 300,
  searchOnType = true,
}) {
  const [text, setText] = useState(defaultQuery);
  const composingRef = useRef(false);     // 한글 등 IME 입력 중 여부
  const timerRef = useRef(null);

  // 디바운스 호출 함수
  const debouncedSearch = useMemo(() => {
    return (keyword) => {
      if (!onSearch) return;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onSearch(keyword ?? ''), debounceMs);
    };
  }, [onSearch, debounceMs]);

  // 입력 변경 핸들러
  const onChange = (e) => {
    const v = e.target.value ?? '';
    setText(v);

    // 입력 중 즉시 호출을 원할 때만 (searchOnType=true)
    if (searchOnType && !composingRef.current) {
      debouncedSearch(v);
    }
  };

  // 폼 제출(엔터/버튼 클릭) 시 즉시 검색
  const onSubmit = (e) => {
    e.preventDefault(); // 기본 페이지 리로드 방지
    if (!onSearch) return;

    // 디바운스 타이머 제거 후 즉시 호출
    if (timerRef.current) clearTimeout(timerRef.current);
    onSearch(text ?? '');
  };

  // 한글 IME 조절: 조합 끝난 시점에 디바운스 트리거
  const onCompositionStart = () => { composingRef.current = true; };
  const onCompositionEnd = () => {
    composingRef.current = false;
    if (searchOnType) debouncedSearch(text);
  };

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <header className="header">
      <div className="header__inner container">
        <h1 className="header__title">TodoList</h1>

        <form className="header__search" role="search" onSubmit={onSubmit}>
          <input
            className="input input--search"
            type="search"
            value={text}
            name="q"
            placeholder="할 일을 검색하세요…"
            onChange={onChange}
            onCompositionStart={onCompositionStart}
            onCompositionEnd={onCompositionEnd}
            aria-label="할 일 검색"
          />
          <button className="btn btn--primary" type="submit">
            검색
          </button>
          {/* 선택: 빠른 초기화 버튼 */}
          <button
            className="btn btn--ghost"
            type="button"
            onClick={() => {
              setText('');
              if (timerRef.current) clearTimeout(timerRef.current);
              onSearch?.(''); // 빈 검색 → 전체 목록
            }}
            aria-label="검색어 지우기"
          >
            지우기
          </button>
        </form>

        <div className="header__controls">
          <div className="select">
            <select
              className="select__field"
              onChange={(e) => onChangeFilter?.(e.target.value)}
              aria-label="필터 선택"
            >
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
