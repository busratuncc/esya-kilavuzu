interface StatsPanelProps {
  total: number;
  activeWarranty: number;
  maintenanceDue: number;
  needsAttention: number;
}

const statItems = [
  { key: "total", label: "Kayıtlı eşya", tone: "ink" },
  { key: "activeWarranty", label: "Aktif garanti", tone: "green" },
  { key: "maintenanceDue", label: "Bakım zamanı", tone: "orange" },
  { key: "needsAttention", label: "İlgi bekliyor", tone: "red" },
] as const;

export function StatsPanel(props: StatsPanelProps) {
  return (
    <section className="stats-grid" aria-label="Eşya özeti">
      {statItems.map((stat) => (
        <article className={`stat-card stat-card--${stat.tone}`} key={stat.key}>
          <span className="stat-dot" aria-hidden="true" />
          <strong>{props[stat.key]}</strong>
          <span>{stat.label}</span>
        </article>
      ))}
    </section>
  );
}
