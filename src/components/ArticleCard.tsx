import type { ArchiveDoc } from "../services/nyt";
import styles from "./ArticleCard.module.css";
import dayjs from "dayjs";

type Props = {
  doc: ArchiveDoc;
  imageUrl?: string;
};

function formatDate(iso?: string) {
  if (!iso) return null;
  const d = dayjs(iso);
  if (!d.isValid()) return null;
  return d.format("MMM D, YYYY, h.mm A"); // пример: Feb 26, 2023, 4.32 PM
}

export default function ArticleCard({ doc, imageUrl }: Props) {
  const date = formatDate(doc.pub_date);

  return (
    <a
      href={doc.web_url}
      target="_blank"
      rel="noreferrer"
      className={styles.card}
    >
      <div className={styles.thumb}>
        {imageUrl ? (
          <img
            className={styles.image}
            src={imageUrl}
            alt={doc.headline.main}
          />
        ) : (
          <div className={styles.placeholder}>Нет изображения</div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.title}>{doc.headline.main}</div>

        {doc.abstract && <div className={styles.abstract}>{doc.abstract}</div>}

        {date && <div className={styles.meta}>{date}</div>}
      </div>
    </a>
  );
}
