interface AppHeaderProps {
  onAdd: () => void;
}

export function AppHeader({ onAdd }: AppHeaderProps) {
  return (
    <header className="app-header">
      <a className="brand" href="#top" aria-label="Eşya Kılavuzu ana sayfa">
        <span className="brand-mark" aria-hidden="true">
          EK
        </span>
        <span>
          <strong>Eşya Kılavuzu</strong>
          <small>Bakım • garanti • yaşam döngüsü</small>
        </span>
      </a>

      <button className="primary-button header-button" type="button" onClick={onAdd}>
        <span aria-hidden="true">+</span> Yeni eşya ekle
      </button>
    </header>
  );
}
