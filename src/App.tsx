// src/App.tsx
import { useEffect } from "react";
import "./App.css";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { loadArchive } from "./features/articles/articlesSlice";
import ArticleCard from "./components/ArticleCard";
import Header from "./components/Header";

function App() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((s) => s.articles);

  useEffect(() => {
    dispatch(loadArchive({ year: 2023, month: 4 }));
  }, [dispatch]);

  if (status === "loading") return <div>Загрузка…</div>;
  if (status === "failed") return <div>Ошибка: {error}</div>;

  return (
    <>
      <Header title="BESIDER" />
      <div className="app">
        <h2 style={{ margin: "0 0 12px" }}>Архив NYT — Апрель 2023</h2>
        {items.slice(0, 30).map((doc) => (
          <ArticleCard key={doc._id} doc={doc} />
        ))}
        {items.length === 0 && status === "succeeded" && (
          <div>Нет материалов</div>
        )}
      </div>
    </>
  );
}

export default App;
