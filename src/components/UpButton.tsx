import styles from './UpButton.module.css'

type Props = {
  visible: boolean
  onClick: () => void
  label?: string
}

export default function UpButton({ visible, onClick, label = '↑ Наверх' }: Props) {
  return (
    <button
      type="button"
      className={`${styles.root} ${!visible ? styles.hidden : ''}`}
      aria-label="К началу"
      onClick={onClick}
    >
      {label}
    </button>
  )
}