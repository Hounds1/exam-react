import { useState, useEffect, useCallback } from 'react';
import { getTodos, creation, modification, deletion, getDetails } from '../services/todoService.js';

export function useTodo() {
  const [todos, setTodos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTodos();
      console.log(res);
      setTodos(res?.todos ?? []);   // getTodos()가 배열 자체를 주면 setTodos(res ?? [])
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDetails = useCallback(async (signature) => {
    setDetailsLoading(true);
    setError(null);
    try {
      const details = await getDetails(signature);
      setSelected(details ?? null);
      return details;
    } catch (e) {
      setError(e);
      return null;
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  const add = useCallback(async ({ title, body, generatedBy }) => {
    setError(null);
    try {
      const created = await creation({ title, body, generatedBy });
      if (created && created.signature) {
        setTodos((prev) => [...prev, created]);
        return created;
      }
      await load(); // 201만 반환하는 서버라면 재조회
      return null;
    } catch (e) {
      setError(e);
      throw e;
    }
  }, [load]);

  const modify = useCallback(async ({ signature, title, body, modifiedBy }) => {
    setError(null);
    try {
      const updated = await modification({ signature, title, body, modifiedBy });
      if (updated && updated.signature) {
        setTodos((prev) => prev.map((t) => (t.signature === updated.signature ? updated : t)));
        setSelected((cur) => (cur && cur.signature === updated.signature ? updated : cur));
        return updated;
      }
      await load();
      return null;
    } catch (e) {
      setError(e);
      throw e;
    }
  }, [load]);

  const remove = useCallback(async (signature) => {
    setError(null);
    try {
      await deletion(signature);
      setTodos((prev) => prev.filter((t) => t.signature !== signature));
      setSelected((cur) => (cur && cur.signature === signature ? null : cur));
    } catch (e) {
      setError(e);
      throw e;
    }
  }, []);

  // ➊ 마운트 시 초기 목록 로드
  useEffect(() => {
    load();
  }, [load]);

  // ➋ 반드시 반환
  return {
    todos,
    selected,
    loading,
    detailsLoading,
    error,
    load,
    loadDetails,
    add,
    modify,
    remove,
  };
}
