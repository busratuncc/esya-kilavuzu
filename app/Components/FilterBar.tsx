import { ITEM_CATEGORIES, ITEM_CONDITIONS } from "../Interfaces/item";

interface FilterBarProps {
  search: string;
  category: string;
  condition: string;
  sort: string;
  resultCount: number;
  onSearch: (value: string) => void;
  onCategory: (value: string) => void;
  onCondition: (value: string) => void;
  onSort: (value: string) => void;
  onClear: () => void;
}

export function FilterBar({
  search,
  category,
  condition,
  sort,
  resultCount,
  onSearch,
  onCategory,
  onCondition,
  onSort,
  onClear,
}: FilterBarProps) {
  const hasFilter = search || category || condition;

  return (
    <section className="filter-panel" aria-label="Eşyaları filtrele">
      <div className="search-field">
        <label htmlFor="search">Eşya ara</label>
        <input
          id="search"
          type="search"
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Ad, marka, model veya konum..."
        />
      </div>

      <div className="compact-field">
        <label htmlFor="category-filter">Kategori</label>
        <select
          id="category-filter"
          value={category}
          onChange={(event) => onCategory(event.target.value)}
        >
          <option value="">Tümü</option>
          {ITEM_CATEGORIES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      <div className="compact-field">
        <label htmlFor="condition-filter">Durum</label>
        <select
          id="condition-filter"
          value={condition}
          onChange={(event) => onCondition(event.target.value)}
        >
          <option value="">Tümü</option>
          {ITEM_CONDITIONS.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      <div className="compact-field">
        <label htmlFor="sort">Sırala</label>
        <select id="sort" value={sort} onChange={(event) => onSort(event.target.value)}>
          <option value="newest">En yeni kayıt</option>
          <option value="name">Ada göre</option>
          <option value="maintenance">Yaklaşan bakım</option>
        </select>
      </div>

      <div className="filter-result">
        <strong>{resultCount}</strong>
        <span>sonuç</span>
        {hasFilter ? (
          <button type="button" onClick={onClear}>
            Temizle
          </button>
        ) : null}
      </div>
    </section>
  );
}
