// src/App.tsx
import { useEffect, useRef, useState } from "react";
import "./App.css";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { loadArchive } from "./features/articles/articlesSlice";
import ArticleCard from "./components/ArticleCard";
import Header from "./components/Header";
import { GroupedVirtuoso, VirtuosoHandle } from "react-virtuoso";
import dayjs from "dayjs";
import { selectGroups } from "./features/articles/selectors";
import UpButton from "./components/UpButton";

function App() {
  const dispatch = useAppDispatch();
  const { daysOrder, groupCounts, itemsFlat } = useAppSelector(selectGroups);
  const { status, error } = useAppSelector((s) => s.articles);
  const virtuosoRef = useRef<VirtuosoHandle | null>(null);
  const [showUp, setShowUp] = useState(false);

  useEffect(() => {
    dispatch(loadArchive({ year: 2025, month: 4 }));
  }, [dispatch]);

  if (status === "loading") return <div>Загрузка…</div>;
  if (status === "failed") return <div>Ошибка: {error}</div>;

  return (
    <>
      <Header title="BESIDER" />
      <div className="app">
        <div style={{ height: "calc(100dvh - 56px)" }}>
          <GroupedVirtuoso
            ref={virtuosoRef}
            groupCounts={groupCounts}
            groupContent={(index) => {
              const d = daysOrder[index];
              const title =
                d === "unknown" ? "Без даты" : dayjs(d).format("MMM D, YYYY");
              return <div className="title-group">News for {title}</div>;
            }}
            itemContent={(index) => {
              const doc = itemsFlat[index];
              if (!doc) return null;
              return <ArticleCard doc={doc} />;
            }}
            overscan={100}
            atTopStateChange={(atTop) => setShowUp(!atTop)}
          />
          <UpButton
            visible={showUp}
            onClick={() =>
              virtuosoRef.current?.scrollToIndex({
                index: 0,
                align: "start",
                behavior: "smooth",
              })
            }
          />
        </div>
        {itemsFlat.length === 0 && status === "succeeded" && (
          <div>Нет материалов</div>
        )}
      </div>
    </>
  );
}

export default App;
