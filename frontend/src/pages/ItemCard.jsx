import styles from "./styles/ItemCard.module.css";

export default function ItemCard({
  image,
  title,
  category,
  location,
  date,
  description,
  status, // "lost" | "found"
  onContact,
}) {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={image}
          alt={title}
          loading="lazy"
          className={styles.image}
        />
        <span
          className={`${styles.badge} ${
            status === "found" ? styles.found : styles.lost
          }`}
        >
          {status.toUpperCase()}
        </span>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>

        <p className={styles.meta}>
          <span>{category}</span> · <span>{location}</span>
        </p>

        <p className={styles.date}>Reported on {date}</p>

        <p className={styles.description}>{description}</p>

        <button onClick={onContact} className={styles.button}>
          Contact Owner
        </button>
      </div>
    </div>
  );
}
