"use client";

import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "../Components/AppHeader";
import { EmptyState } from "../Components/EmptyState";
import { FilterBar } from "../Components/FilterBar";
import { ItemCard } from "../Components/ItemCard";
import { ItemForm } from "../Components/ItemForm";
import { StatsPanel } from "../Components/StatsPanel";
import { ItemFormData, ItemRecord } from "../Interfaces/item";

const STORAGE_KEY = "esya-kilavuzu-items-v1";

const sampleItems: ItemRecord[] = [
  {
    id: "sample-laptop",
    name: "Çalışma bilgisayarı",
    category: "Elektronik",
    brand: "Lenovo",
    model: "IdeaPad 5",
    location: "Çalışma odası",
    purchaseDate: "2025-11-18",
    warrantyEnd: "2027-11-18",
    nextMaintenance: "2026-09-15",
    condition: "Çok iyi",
    notes: "Fan temizliği için yumuşak fırça kullan. Şarjı sürekli yüzde 100'de tutma.",
    createdAt: "2026-08-08T10:00:00.000Z",
    updatedAt: "2026-08-08T10:00:00.000Z",
  },
  {
    id: "sample-coffee",
    name: "Filtre kahve makinesi",
    category: "Ev Aleti",
    brand: "Philips",
    model: "Daily Collection",
    location: "Mutfak tezgâhı",
    purchaseDate: "2024-04-07",
    warrantyEnd: "2026-04-07",
    nextMaintenance: "2026-08-01",
    condition: "Bakım gerekli",
    notes: "Kireç temizliği yapılacak. Cam hazne elde yıkanmalı.",
    createdAt: "2026-08-07T10:00:00.000Z",
    updatedAt: "2026-08-07T10:00:00.000Z",
  },
  {
    id: "sample-bike",
    name: "Şehir bisikleti",
    category: "Spor",
    brand: "Bianchi",
    model: "Touring",
    location: "Balkon",
    purchaseDate: "2023-05-20",
    warrantyEnd: "",
    nextMaintenance: "2026-10-20",
    condition: "İyi",
    notes: "Zinciri ayda bir kontrol et. Yağmurdan sonra kurula.",
    createdAt: "2026-08-06T10:00:00.000Z",
    updatedAt: "2026-08-06T10:00:00.000Z",
  },
];

export function GuidePage() {
  const [items, setItems] = useState<ItemRecord[]>(sampleItems);
  const [storageReady, setStorageReady] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemRecord | null>(null);
  const [deletingItem, setDeletingItem] = useState<ItemRecord | null>(null);
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {
      setToast("Kayıtlı veriler okunamadı; örnek kayıtlar gösteriliyor.");
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, storageReady]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const today = new Date().toISOString().slice(0, 10);
  const stats = {
    total: items.length,
    activeWarranty: items.filter((item) => item.warrantyEnd && item.warrantyEnd >= today)
      .length,
    maintenanceDue: items.filter(
      (item) => item.nextMaintenance && item.nextMaintenance <= today,
    ).length,
    needsAttention: items.filter(
      (item) => item.condition === "Bakım gerekli" || item.condition === "Arızalı",
    ).length,
  };

  const visibleItems = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("tr-TR");
    const filtered = items.filter((item) => {
      const searchable = [item.name, item.brand, item.model, item.location]
        .join(" ")
        .toLocaleLowerCase("tr-TR");
      return (
        (!normalizedSearch || searchable.includes(normalizedSearch)) &&
        (!category || item.category === category) &&
        (!condition || item.condition === condition)
      );
    });

    return filtered.sort((first, second) => {
      if (sort === "name") return first.name.localeCompare(second.name, "tr");
      if (sort === "maintenance") {
        return (first.nextMaintenance || "9999-12-31").localeCompare(
          second.nextMaintenance || "9999-12-31",
        );
      }
      return second.createdAt.localeCompare(first.createdAt);
    });
  }, [items, search, category, condition, sort]);

  function scrollToForm() {
    window.setTimeout(() => {
      document.getElementById("item-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  function startAdding() {
    setEditingItem(null);
    setFormOpen(true);
    scrollToForm();
  }

  function startEditing(item: ItemRecord) {
    setEditingItem(item);
    setFormOpen(true);
    scrollToForm();
  }

  function saveItem(data: ItemFormData) {
    const now = new Date().toISOString();
    if (editingItem) {
      setItems((current) =>
        current.map((item) =>
          item.id === editingItem.id ? { ...item, ...data, updatedAt: now } : item,
        ),
      );
      setToast("Eşya bilgileri güncellendi.");
    } else {
      const id = typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}`;
      setItems((current) => [{ ...data, id, createdAt: now, updatedAt: now }, ...current]);
      setToast("Yeni eşya pasaportu oluşturuldu.");
    }
    setEditingItem(null);
    setFormOpen(false);
  }

  function confirmDelete() {
    if (!deletingItem) return;
    setItems((current) => current.filter((item) => item.id !== deletingItem.id));
    setDeletingItem(null);
    setToast("Eşya kaydı silindi.");
  }

  function clearFilters() {
    setSearch("");
    setCategory("");
    setCondition("");
  }

  const hasFilter = Boolean(search || category || condition);

  return (
    <div id="top" className="site-shell">
      <AppHeader onAdd={startAdding} />

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">Eşyalarına iyi bak, ömürlerini uzat</span>
            <h1>Her eşyanın bir geçmişi, bir bakımı ve bir sonraki adımı var.</h1>
            <p>
              Garanti tarihlerini unutma, bakım zamanlarını yakala ve evindeki eşyaların
              yaşam öyküsünü tek yerde tut.
            </p>
            <div className="hero-actions">
              <button className="primary-button" type="button" onClick={startAdding}>
                İlk eşyanı ekle
              </button>
              <a className="secondary-button" href="#inventory">
                Envanteri incele
              </a>
            </div>
          </div>

          <div className="hero-card" aria-label="Yaklaşan bakım hatırlatıcısı">
            <span className="hero-card__label">Sıradaki bakım</span>
            <strong>Kahve makinesi</strong>
            <p>Kireç temizliği ve filtre kontrolü</p>
            <div className="maintenance-meter">
              <span style={{ width: "82%" }} />
            </div>
            <small>Bakım zamanı geldi</small>
            <div className="hero-card__seal" aria-hidden="true">
              BAKIM
            </div>
          </div>
        </section>

        <StatsPanel {...stats} />

        {formOpen ? (
          <ItemForm
            editingItem={editingItem}
            onSave={saveItem}
            onCancel={() => {
              setEditingItem(null);
              setFormOpen(false);
            }}
          />
        ) : null}

        <section className="inventory-section" id="inventory">
          <div className="section-heading inventory-heading">
            <div>
              <span className="eyebrow">Kişisel envanter</span>
              <h2>Eşya pasaportların</h2>
              <p>Bakım, garanti ve kullanım bilgilerini düzenli tut.</p>
            </div>
            <button className="secondary-button" type="button" onClick={startAdding}>
              + Eşya ekle
            </button>
          </div>

          <FilterBar
            search={search}
            category={category}
            condition={condition}
            sort={sort}
            resultCount={visibleItems.length}
            onSearch={setSearch}
            onCategory={setCategory}
            onCondition={setCondition}
            onSort={setSort}
            onClear={clearFilters}
          />

          {visibleItems.length ? (
            <div className="item-grid">
              {visibleItems.map((item) => (
                <ItemCard
                  item={item}
                  key={item.id}
                  onEdit={startEditing}
                  onDelete={setDeletingItem}
                />
              ))}
            </div>
          ) : (
            <EmptyState filtered={hasFilter} onAdd={startAdding} onClear={clearFilters} />
          )}
        </section>

        <section className="promise-strip">
          <span className="promise-number">01</span>
          <div>
            <strong>Daha uzun kullanım</strong>
            <p>Düzenli bakım notlarıyla eşyalarının ömrünü uzat.</p>
          </div>
          <span className="promise-number">02</span>
          <div>
            <strong>Daha az unutkanlık</strong>
            <p>Garanti ve bakım tarihlerini tek ekranda gör.</p>
          </div>
          <span className="promise-number">03</span>
          <div>
            <strong>Daha bilinçli tüketim</strong>
            <p>Elindekini tanı, koru ve gereksiz alışverişi azalt.</p>
          </div>
        </section>
      </main>

      <footer>
        <strong>Eşya Kılavuzu</strong>
        <span>Veriler yalnızca bu tarayıcıda saklanır.</span>
      </footer>

      {deletingItem ? (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setDeletingItem(null)}>
          <div
            className="confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <span className="modal-mark" aria-hidden="true">
              !
            </span>
            <h2 id="delete-title">Bu eşya kaydı silinsin mi?</h2>
            <p>
              <strong>{deletingItem.name}</strong> ve ona ait bakım bilgileri kalıcı olarak
              silinecek.
            </p>
            <div className="modal-actions">
              <button className="secondary-button" type="button" onClick={() => setDeletingItem(null)}>
                Vazgeç
              </button>
              <button className="danger-button" type="button" onClick={confirmDelete} autoFocus>
                Kaydı sil
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="toast" role="status">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
