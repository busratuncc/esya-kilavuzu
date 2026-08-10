"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  ITEM_CATEGORIES,
  ITEM_CONDITIONS,
  ItemFormData,
  ItemRecord,
} from "../Interfaces/item";

interface ItemFormProps {
  editingItem: ItemRecord | null;
  onSave: (data: ItemFormData) => void;
  onCancel: () => void;
}

const emptyForm: ItemFormData = {
  name: "",
  category: "Elektronik",
  brand: "",
  model: "",
  location: "",
  purchaseDate: "",
  warrantyEnd: "",
  nextMaintenance: "",
  condition: "İyi",
  notes: "",
};

export function ItemForm({ editingItem, onSave, onCancel }: ItemFormProps) {
  const [form, setForm] = useState<ItemFormData>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingItem) {
      const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...values } =
        editingItem;
      setForm(values);
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [editingItem]);

  function updateField<K extends keyof ItemFormData>(key: K, value: ItemFormData[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    if (errors[key]) {
      setErrors((current) => ({ ...current, [key]: "" }));
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (!form.name.trim()) nextErrors.name = "Eşyanın adını yazmalısın.";
    if (!form.location.trim()) nextErrors.location = "Eşyanın bulunduğu yeri yazmalısın.";
    if (
      form.purchaseDate &&
      form.warrantyEnd &&
      form.warrantyEnd < form.purchaseDate
    ) {
      nextErrors.warrantyEnd = "Garanti bitişi satın alma tarihinden önce olamaz.";
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    onSave({
      ...form,
      name: form.name.trim(),
      brand: form.brand.trim(),
      model: form.model.trim(),
      location: form.location.trim(),
      notes: form.notes.trim(),
    });
  }

  return (
    <section className="form-card" id="item-form" aria-labelledby="form-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Eşya pasaportu</span>
          <h2 id="form-title">{editingItem ? "Eşyayı düzenle" : "Yeni eşya ekle"}</h2>
        </div>
        <button className="text-button" type="button" onClick={onCancel}>
          Vazgeç
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="field field--wide">
            <label htmlFor="name">Eşyanın adı *</label>
            <input
              id="name"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Örn. Çalışma bilgisayarı"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name ? <small id="name-error">{errors.name}</small> : null}
          </div>

          <div className="field">
            <label htmlFor="category">Kategori *</label>
            <select
              id="category"
              value={form.category}
              onChange={(event) =>
                updateField("category", event.target.value as ItemFormData["category"])
              }
            >
              {ITEM_CATEGORIES.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="condition">Kullanım durumu *</label>
            <select
              id="condition"
              value={form.condition}
              onChange={(event) =>
                updateField("condition", event.target.value as ItemFormData["condition"])
              }
            >
              {ITEM_CONDITIONS.map((condition) => (
                <option key={condition}>{condition}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="brand">Marka</label>
            <input
              id="brand"
              value={form.brand}
              onChange={(event) => updateField("brand", event.target.value)}
              placeholder="Örn. Arçelik"
            />
          </div>

          <div className="field">
            <label htmlFor="model">Model</label>
            <input
              id="model"
              value={form.model}
              onChange={(event) => updateField("model", event.target.value)}
              placeholder="Model veya seri"
            />
          </div>

          <div className="field field--wide">
            <label htmlFor="location">Bulunduğu yer *</label>
            <input
              id="location"
              value={form.location}
              onChange={(event) => updateField("location", event.target.value)}
              placeholder="Örn. Salon, üst raf"
              aria-invalid={Boolean(errors.location)}
              aria-describedby={errors.location ? "location-error" : undefined}
            />
            {errors.location ? <small id="location-error">{errors.location}</small> : null}
          </div>

          <div className="field">
            <label htmlFor="purchaseDate">Satın alma tarihi</label>
            <input
              id="purchaseDate"
              type="date"
              value={form.purchaseDate}
              onChange={(event) => updateField("purchaseDate", event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="warrantyEnd">Garanti bitiş tarihi</label>
            <input
              id="warrantyEnd"
              type="date"
              value={form.warrantyEnd}
              onChange={(event) => updateField("warrantyEnd", event.target.value)}
              aria-invalid={Boolean(errors.warrantyEnd)}
              aria-describedby={errors.warrantyEnd ? "warranty-error" : undefined}
            />
            {errors.warrantyEnd ? (
              <small id="warranty-error">{errors.warrantyEnd}</small>
            ) : null}
          </div>

          <div className="field field--wide">
            <label htmlFor="nextMaintenance">Sonraki bakım tarihi</label>
            <input
              id="nextMaintenance"
              type="date"
              value={form.nextMaintenance}
              onChange={(event) => updateField("nextMaintenance", event.target.value)}
            />
          </div>

          <div className="field field--full">
            <label htmlFor="notes">Kullanım ve bakım notu</label>
            <textarea
              id="notes"
              rows={3}
              value={form.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              placeholder="Temizlik yöntemi, parça bilgisi veya hatırlamak istediğin ayrıntılar..."
            />
          </div>
        </div>

        <div className="form-actions">
          <button className="secondary-button" type="button" onClick={onCancel}>
            İptal
          </button>
          <button className="primary-button" type="submit">
            {editingItem ? "Değişiklikleri kaydet" : "Eşyayı kaydet"}
          </button>
        </div>
      </form>
    </section>
  );
}
