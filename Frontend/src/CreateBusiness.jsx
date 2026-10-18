
import { useState } from "react";
import { createTenant } from "./api";

const initialForm = {
  name: "",
  slug: "",
  description: "",
  logoUrl: "",
  primaryColor: "#5475ED",
  contactEmail: "",
  contactPhone: "",
};

export default function CreateBusiness({ onCancel, onCreated }) {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === "slug"
          ? value
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "")
          : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.name.trim().length < 2) {
      setError("שם העסק חייב להכיל לפחות שני תווים.");
      return;
    }

    if (!form.slug) {
      setError("יש להזין כתובת באנגלית לעסק.");
      return;
    }

    setSaving(true);

    try {
      const result = await createTenant({
        ...form,
        name: form.name.trim(),
        slug: form.slug,
      });

      const business = result.tenant ?? result;

      if (!business._id) {
        throw new Error("העסק נשלח, אך לא התקבל מזהה עסק מהשרת.");
      }

      onCreated(business);
    } catch (err) {
      setError(
        err.message || "לא הצלחנו ליצור את העסק. נסי שוב."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="main-content create-business-page">
      <button className="secondary-button" type="button" onClick={onCancel}>
        ← חזרה ללוח הבקרה
      </button>

      <div className="welcome-row create-heading">
        <div>
          <div className="welcome-tag">הקמת חנות חדשה</div>
          <h1>בואי ניצור את העסק שלך</h1>
          <p>הגדירי את הפרטים הראשוניים. ניתן יהיה להתאים את החנות בהמשך.</p>
        </div>
      </div>

      <form className="surface business-form" onSubmit={handleSubmit}>
        <div className="surface-heading">
          <div>
            <h2>פרטי העסק</h2>
            <p>המידע שיוצג במערכת ההשכרות שלך</p>
          </div>
        </div>

        <div className="form-grid">
          <label>
            שם העסק *
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="לדוגמה: השכרות ברכה"
              minLength={2}
              maxLength={100}
              required
            />
          </label>

          <label>
            כתובת העסק באנגלית *
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="bracha-rentals"
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              maxLength={100}
              required
              dir="ltr"
            />
            <small>כתובת ייחודית שתזהה את העסק במערכת.</small>
          </label>

          <label className="full-width">
            תיאור העסק
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="ספרי בקצרה על העסק והמוצרים להשכרה"
              rows={4}
              maxLength={1000}
            />
          </label>

          <label className="full-width">
            כתובת תמונת הלוגו (אופציונלי)
            <input
              name="logoUrl"
              value={form.logoUrl}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
              dir="ltr"
            />
          </label>

          <label>
            צבע ראשי לחנות
            <div className="color-input">
              <input
                type="color"
                name="primaryColor"
                value={form.primaryColor}
                onChange={handleChange}
              />
              <span>{form.primaryColor}</span>
            </div>
          </label>

          <label>
            כתובת דוא"ל
            <input
              type="email"
              name="contactEmail"
              value={form.contactEmail}
              onChange={handleChange}
              placeholder="hello@example.com"
              dir="ltr"
            />
          </label>

          <label>
            טלפון ליצירת קשר
            <input
              type="tel"
              name="contactPhone"
              value={form.contactPhone}
              onChange={handleChange}
              placeholder="050-1234567"
              dir="ltr"
            />
          </label>
        </div>

        {error && (
          <div className="error-banner" role="alert">
            {error}
          </div>
        )}

        <div className="form-actions">
          <button className="primary-button" type="submit" disabled={saving}>
            {saving ? "שומרת את העסק..." : "שמירת העסק"}
          </button>

          <button
            className="secondary-button"
            type="button"
            onClick={onCancel}
            disabled={saving}
          >
            ביטול
          </button>
        </div>
      </form>
    </section>
  );
}
