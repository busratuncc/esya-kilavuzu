import { ItemRecord } from "../Interfaces/item";

interface ItemCardProps {
  item: ItemRecord;
  onEdit: (item: ItemRecord) => void;
  onDelete: (item: ItemRecord) => void;
}

const categoryCodes: Record<ItemRecord["category"], string> = {
  Elektronik: "EL",
  "Ev Aleti": "EV",
  Mobilya: "MO",
  Spor: "SP",
  Kişisel: "Kİ",
  Diğer: "Dİ",
};

function formatDate(date: string) {
  if (!date) return "Belirtilmedi";
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function getWarrantyState(date: string) {
  if (!date) return { label: "Garanti bilgisi yok", tone: "neutral" };
  const active = date >= new Date().toISOString().slice(0, 10);
  return active
    ? { label: "Garanti aktif", tone: "green" }
    : { label: "Garanti sona erdi", tone: "neutral" };
}

function getMaintenanceState(date: string) {
  if (!date) return { label: "Bakım planlanmadı", tone: "neutral" };
  const due = date <= new Date().toISOString().slice(0, 10);
  return due
    ? { label: "Bakım zamanı geldi", tone: "orange" }
    : { label: `Bakım: ${formatDate(date)}`, tone: "blue" };
}

export function ItemCard({ item, onEdit, onDelete }: ItemCardProps) {
  const warranty = getWarrantyState(item.warrantyEnd);
  const maintenance = getMaintenanceState(item.nextMaintenance);
  const conditionTone =
    item.condition === "Arızalı"
      ? "red"
      : item.condition === "Bakım gerekli"
        ? "orange"
        : "green";

  return (
    <article className="item-card">
      <div className="item-card__topline">
        <span className="category-code" aria-hidden="true">
          {categoryCodes[item.category]}
        </span>
        <span className="category-name">{item.category}</span>
        <span className={`status-pill status-pill--${conditionTone}`}>{item.condition}</span>
      </div>

      <div className="item-card__title">
        <div>
          <h3>{item.name}</h3>
          <p>{[item.brand, item.model].filter(Boolean).join(" · ") || "Marka ve model belirtilmedi"}</p>
        </div>
        <span className="location-tag">{item.location}</span>
      </div>

      <dl className="item-details">
        <div>
          <dt>Satın alma</dt>
          <dd>{formatDate(item.purchaseDate)}</dd>
        </div>
        <div>
          <dt>Garanti bitişi</dt>
          <dd>{formatDate(item.warrantyEnd)}</dd>
        </div>
      </dl>

      <div className="item-statuses">
        <span className={`soft-pill soft-pill--${warranty.tone}`}>{warranty.label}</span>
        <span className={`soft-pill soft-pill--${maintenance.tone}`}>{maintenance.label}</span>
      </div>

      {item.notes ? <p className="item-note">{item.notes}</p> : null}

      <div className="item-card__actions">
        <button type="button" onClick={() => onEdit(item)}>
          Düzenle
        </button>
        <button className="danger-text" type="button" onClick={() => onDelete(item)}>
          Sil
        </button>
      </div>
    </article>
  );
}
