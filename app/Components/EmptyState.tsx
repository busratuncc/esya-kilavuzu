interface EmptyStateProps {
  filtered: boolean;
  onAdd: () => void;
  onClear: () => void;
}

export function EmptyState({ filtered, onAdd, onClear }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <span className="empty-state__mark" aria-hidden="true">
        EK
      </span>
      <h3>{filtered ? "Bu ölçütlerde eşya bulunamadı" : "İlk eşya pasaportunu oluştur"}</h3>
      <p>
        {filtered
          ? "Arama kelimelerini veya filtreleri değiştirerek tekrar deneyebilirsin."
          : "Garanti, bakım ve kullanım bilgilerini kaydetmeye başla."}
      </p>
      <button className="primary-button" type="button" onClick={filtered ? onClear : onAdd}>
        {filtered ? "Filtreleri temizle" : "Eşya ekle"}
      </button>
    </div>
  );
}
