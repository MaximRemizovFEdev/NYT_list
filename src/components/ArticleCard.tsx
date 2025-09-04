import type { ArchiveDoc } from "../services/nyt";
import styles from "./ArticleCard.module.css";

type Props = {
  doc: ArchiveDoc;
};

function formatDate(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d.toLocaleDateString();
}

export default function ArticleCard({ doc }: Props) {
  const date = formatDate(doc.pub_date);

  return (
    <a
      href={doc.web_url}
      target="_blank"
      rel="noreferrer"
      className={styles.card}
    >
      <div className={styles.title}>{doc.headline.main}</div>

      {doc.byline?.original && (
        <div className={styles.byline}>{doc.byline.original}</div>
      )}

      {doc.abstract && <div className={styles.abstract}>{doc.abstract}</div>}

      {date && <div className={styles.meta}>{date}</div>}
    </a>
  );
}
