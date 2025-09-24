import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import TodoPage from "./features/pages/todo.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: 12, borderBottom: "1px solid #ddd" }}>
        <Link to="/">Home</Link>
        <Link to="/todos" style={{ marginLeft: 12 }}>Todos</Link>
      </nav>
      <Routes>
        <Route path="/" element={<div style={{ padding: 16 }}>Home Page</div>} />
        <Route path="/todos" element={<TodoPage />} />
      </Routes>
    </BrowserRouter>
  );
}