
import { useEffect, useState } from "react";
import { getTenants } from "./api";
import CreateBusiness from "./CreateBusiness";
import "./App.css";

function Icon({ name, size = 20 }) {
  const paths = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    shop: (
      <>
        <path d="M3 9l2-6h14l2 6" />
        <path d="M4 9v11h16V9" />
        <path d="M9 20v-7h6v7" />
      </>
    ),
    box: (
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="m3 8 9 5 9-5" />
        <path d="M3 8v9l9 5 9-5V8" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19 13v-2l2-1-2-4-2 1-2-1V4h-5v3L8 8 6 7l-2 4 2 1v2l-2 1 2 4 2-1 2 1v3h5v-3l2-1 2 1 2-4z" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    arrow: <path d="M7 17 17 7M7 7h10v10" />,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.dashboard}
    </svg>
  );
}

function Sidebar({ page, setPage }) {
  const items = [
    { id: "dashboard", label: "סקירה כללית", icon: "dashboard" },
    { id: "businesses", label: "העסקים שלי", icon: "shop" },
    { id: "products", label: "ניהול השכרות", icon: "box" },
    { id: "settings", label: "הגדרות", icon: "settings" },
  ];

  return (
    <aside className="sidebar">
      <button
        type="button"
        className="brand"
        onClick={() => setPage("dashboard")}
      >
        <span className="brand-symbol">R</span>
        <span>
          rentify<span className="brand-dot">.</span>
        </span>
      </button>

      <div className="workspace">
        <div className="workspace-avatar">R</div>
        <div className="workspace-text">
          <strong>סביבת העבודה שלי</strong>
          <span>תוכנית בסיסית</span>
        </div>
      </div>

      <div className="nav-caption">תפריט ראשי</div>

      <nav className="nav-links">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={page === item.id ? "active" : ""}
            onClick={() => setPage(item.id)}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="help-card">
          <div className="help-icon">?</div>
          <strong>צריכה עזרה?</strong>
          <p>כל מה שצריך כדי להתחיל לעבוד.</p>
        </div>

        <div className="profile">
          <div className="profile-avatar">R</div>
          <div className="profile-info">
            <strong>מנהלת המערכת</strong>
            <span>חשבון ניהול</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Dashboard({ onCreateBusiness, onShowBusinesses }) {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getTenants()
      .then((data) => {
        if (active) setTenants(data);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="dashboard">
      <header className="topbar">
        <div className="breadcrumbs">
          סביבת עבודה <span>/</span> <strong>סקירה כללית</strong>
        </div>
        <div className="topbar-actions">
          <span className="today">לוח הבקרה שלך</span>
          <div className="topbar-avatar">R</div>
        </div>
      </header>

      <main className="main-content">
        <section className="welcome-row">
          <div>
            <div className="welcome-tag">
              <span /> סביבת הניהול שלך
            </div>
            <h1>ברוכה הבאה ל-Rentify</h1>
            <p>כל מה שקורה בעסקי ההשכרה שלך, במבט אחד.</p>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={onCreateBusiness}
          >
            <Icon name="plus" size={18} />
            יצירת עסק חדש
          </button>
        </section>

        {error && (
          <div className="error-banner" role="alert">
            לא ניתן לטעון את העסקים: {error}
          </div>
        )}

        <section className="stats-grid">
          <article className="stat-card">
            <div className="stat-top">
              <span className="stat-icon stat-blue">
                <Icon name="shop" />
              </span>
              <span className="stat-label">כל העסקים</span>
            </div>
            <div className="stat-value">
              {loading ? "—" : tenants.length}
            </div>
            <div className="stat-footer">עסקים רשומים במערכת</div>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <span className="stat-icon stat-purple">
                <Icon name="box" />
              </span>
              <span className="stat-label">ניהול מוצרים</span>
            </div>
            <div className="stat-value">—</div>
            <div className="stat-footer">נתוני המוצרים יוצגו בהמשך</div>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <span className="stat-icon stat-green">
                <Icon name="dashboard" />
              </span>
              <span className="stat-label">מצב המערכת</span>
            </div>
            <div className="stat-value">פעילה</div>
            <div className="stat-footer">ממשק הניהול זמין</div>
          </article>
        </section>

        <section className="content-grid">
          <article className="surface businesses-panel">
            <div className="surface-heading">
              <div>
                <h2>העסקים שלך</h2>
                <p>ניהול החנויות והקטלוגים שלך</p>
              </div>

              <button
                type="button"
                className="subtle-button"
                onClick={onShowBusinesses}
              >
                כל העסקים ←
              </button>
            </div>

            {loading ? (
              <div className="loading-state">טוענת נתונים...</div>
            ) : tenants.length === 0 && !error ? (
              <div className="empty-state">
                <div className="empty-illustration">
                  <Icon name="shop" size={30} />
                </div>
                <h3>מתחילות מהעסק הראשון</h3>
                <p>
                  צרי חנות, התאימי לה את המיתוג והוסיפי
                  את המוצרים להשכרה.
                </p>
                <button
                  type="button"
                  className="primary-button"
                  onClick={onCreateBusiness}
                >
                  <Icon name="plus" size={17} />
                  יצירת העסק הראשון
                </button>
              </div>
            ) : (
              <div className="tenant-list">
                {tenants.map((tenant) => (
                  <div className="tenant-row" key={tenant._id}>
                    <div
                      className="tenant-avatar"
                      style={{
                        background: tenant.primaryColor || "#3157d5",
                      }}
                    >
                      {(tenant.name || "?").charAt(0)}
                    </div>

                    <div className="tenant-details">
                      <strong>{tenant.name}</strong>
                      <span>{tenant.description || tenant.slug}</span>
                    </div>

                    <span
                      className={
                        tenant.isActive === false
                          ? "tenant-status inactive"
                          : "tenant-status"
                      }
                    >
                      {tenant.isActive === false ? "לא פעיל" : "פעיל"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className="surface quick-panel">
            <div className="surface-heading">
              <div>
                <h2>התחלה מהירה</h2>
                <p>מה תרצי לעשות היום?</p>
              </div>
            </div>

            <button
              type="button"
              className="quick-action"
              onClick={onCreateBusiness}
            >
              <span className="quick-icon blue-bg">
                <Icon name="plus" />
              </span>
              <span>
                <strong>יצירת עסק</strong>
                <small>פתיחת חנות חדשה</small>
              </span>
              <Icon name="arrow" size={16} />
            </button>

            <button
              type="button"
              className="quick-action"
              onClick={onShowBusinesses}
            >
              <span className="quick-icon purple-bg">
                <Icon name="shop" />
              </span>
              <span>
                <strong>ניהול החנויות</strong>
                <small>צפייה בעסקים הקיימים</small>
              </span>
              <Icon name="arrow" size={16} />
            </button>

            <div className="tip-card">
              <span className="tip-star">✦</span>
              <strong>טיפ קטן להצלחה</strong>
              <p>
                הוסיפי תמונות איכותיות ותיאור ברור לכל
                מוצר כדי להציג את החנות שלך בצורה מקצועית.
              </p>
            </div>
          </article>
        </section>

        <footer className="page-footer">
          <span>© 2026 Rentify</span>
          <span>ניהול השכרות, פשוט יותר.</span>
        </footer>
      </main>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [refreshKey, setRefreshKey] = useState(0);

  function handleBusinessCreated() {
    setRefreshKey((current) => current + 1);
    setPage("dashboard");
  }

  return (
    <div className="app-shell" dir="rtl">
      <Sidebar page={page} setPage={setPage} />

      <div className="app-main">
        {page === "dashboard" && (
          <Dashboard
            key={refreshKey}
            onCreateBusiness={() => setPage("create-business")}
            onShowBusinesses={() => setPage("businesses")}
          />
        )}

        {page === "create-business" && (
          <CreateBusiness
            onCancel={() => setPage("dashboard")}
            onCreated={handleBusinessCreated}
          />
        )}

        {page === "businesses" && (
          <BusinessesPage
            onCreateBusiness={() => setPage("create-business")}
          />
        )}

        {page === "products" && (
          <section className="main-content">
            <h1>ניהול השכרות</h1>
            <p>כאן ננהל את המוצרים, הכמויות והמחירים להשכרה.</p>
          </section>
        )}

        {page === "settings" && (
          <section className="main-content">
            <h1>הגדרות</h1>
            <p>כאן נגדיר את פרטי המערכת.</p>
          </section>
        )}
      </div>
    </div>
  );
}

function BusinessesPage({ onCreateBusiness }) {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getTenants()
      .then(setTenants)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="main-content">
      <div className="welcome-row">
        <div>
          <h1>העסקים שלי</h1>
          <p>כל החנויות שיצרת בפלטפורמה.</p>
        </div>
        <button
          type="button"
          className="primary-button"
          onClick={onCreateBusiness}
        >
          <Icon name="plus" size={18} />
          יצירת עסק חדש
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {loading && <div className="loading-state">טוענת נתונים...</div>}

      {!loading && !error && tenants.length === 0 && (
        <div className="surface empty-state">
          <h3>עדיין לא יצרת עסק</h3>
          <p>צרי את העסק הראשון שלך כדי להתחיל.</p>
          <button
            type="button"
            className="primary-button"
            onClick={onCreateBusiness}
          >
            יצירת עסק
          </button>
        </div>
      )}

      {!loading && tenants.length > 0 && (
        <div className="surface tenant-list">
          {tenants.map((tenant) => (
            <div className="tenant-row" key={tenant._id}>
              <div
                className="tenant-avatar"
                style={{
                  background: tenant.primaryColor || "#3157d5",
                }}
              >
                {(tenant.name || "?").charAt(0)}
              </div>
              <div className="tenant-details">
                <strong>{tenant.name}</strong>
                <span>{tenant.description || tenant.slug}</span>
              </div>
              <span className="tenant-status">
                {tenant.isActive === false ? "לא פעיל" : "פעיל"}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
