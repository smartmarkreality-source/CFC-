import { useState, useEffect } from "react";

// ─── Persistent Cloud Storage Keys ───────────────────────────────────────────
const KEYS = {
  users: "rms_users",
  sales: "rms_sales",
  staff: "rms_staff",
  expenses: "rms_expenses",
  designations: "rms_designations",
  expenseCategories: "rms_expense_categories",
  vendors: "rms_vendors",
};

// ─── Default Users ────────────────────────────────────────────────────────────
const DEFAULT_USERS = [
  { id: 1, name: "Admin", username: "admin", password: "admin123", role: "owner", active: true },
  { id: 2, name: "Sufian", username: "sufian", password: "mgr123", role: "manager", active: true },
  { id: 3, name: "Chitta", username: "chitta", password: "cash123", role: "cashier", active: true },
];

// ─── Default Designations ─────────────────────────────────────────────────────
const DEFAULT_DESIGNATIONS = [
  { id: 1, name: "Waiter", color: "#3498db", icon: "🍽️" },
  { id: 2, name: "Cashier", color: "#27ae60", icon: "💰" },
  { id: 3, name: "Cook", color: "#e67e22", icon: "👨‍🍳" },
  { id: 4, name: "Rider", color: "#9b59b6", icon: "🏍️" },
  { id: 5, name: "Manager", color: "#2980b9", icon: "🧑‍💼" },
  { id: 6, name: "Cleaner", color: "#95a5a6", icon: "🧹" },
];

// ─── Default Expense Categories ───────────────────────────────────────────────
const DEFAULT_EXPENSE_CATEGORIES = [
  { id: 1, name: "Grocery", icon: "🛒", color: "#27ae60" },
  { id: 2, name: "Utilities", icon: "💡", color: "#f39c12" },
  { id: 3, name: "Salary", icon: "💸", color: "#8e44ad" },
  { id: 4, name: "Rent", icon: "🏠", color: "#2980b9" },
  { id: 5, name: "Maintenance", icon: "🔧", color: "#e67e22" },
  { id: 6, name: "Other", icon: "📦", color: "#7f8c8d" },
];

// ─── Default Vendors ──────────────────────────────────────────────────────────
const DEFAULT_VENDORS = [];

// ─── Role Config ──────────────────────────────────────────────────────────────
const ROLES = {
  owner: { label: "Owner/Admin", color: "#c0392b", badge: "👑", canViewAll: true, canEdit: true, canManageUsers: true, canViewReports: true },
  manager: { label: "Manager", color: "#2980b9", badge: "🧑‍💼", canViewAll: true, canEdit: false, canManageUsers: false, canViewReports: true },
  cashier: { label: "Cashier", color: "#27ae60", badge: "💰", canViewAll: false, canEdit: false, canManageUsers: false, canViewReports: false },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const today = () => new Date().toISOString().split("T")[0];
const fmt = (n) => Number(n || 0).toLocaleString("ur-PK");
const uid = () => Date.now() + Math.random().toString(36).slice(2, 6);

// ─── Storage Helpers ──────────────────────────────────────────────────────────
async function load(key, fallback) {
  try {
    const r = await window.storage.get(key, true);
    return r ? JSON.parse(r.value) : fallback;
  } catch { return fallback; }
}
async function save(key, val) {
  try { await window.storage.set(key, JSON.stringify(val), true); } catch {}
}

// ═════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [sales, setSales] = useState([]);
  const [staff, setStaff] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    (async () => {
      const [u, s, st, ex, des, cats, vens] = await Promise.all([
        load(KEYS.users, DEFAULT_USERS),
        load(KEYS.sales, []),
        load(KEYS.staff, [
          { id: 1, name: "Sufian", role: "Waiter", salary: 5000, advance: 0, active: true },
          { id: 2, name: "Mushoof", role: "Waiter", salary: 15000, advance: 0, active: true },
          { id: 3, name: "Chitta", role: "Cashier", salary: 500, advance: 0, active: true },
          { id: 4, name: "Pasha", role: "Cook", salary: 210, advance: 0, active: true },
          { id: 5, name: "Fazeel", role: "Waiter", salary: 130, advance: 0, active: true },
          { id: 6, name: "Imran", role: "Delivery", salary: 500, advance: 0, active: true },
          { id: 7, name: "Anous", role: "Cook", salary: 34670, advance: 0, active: true },
          { id: 8, name: "Adeel", role: "Waiter", salary: 19670, advance: 0, active: true },
          { id: 9, name: "Wahab", role: "Rider", salary: 34700, advance: 0, active: true },
        ]),
        load(KEYS.expenses, []),
        load(KEYS.designations, DEFAULT_DESIGNATIONS),
        load(KEYS.expenseCategories, DEFAULT_EXPENSE_CATEGORIES),
        load(KEYS.vendors, DEFAULT_VENDORS),
      ]);
      setUsers(u); setSales(s); setStaff(st); setExpenses(ex);
      setDesignations(des); setExpenseCategories(cats); setVendors(vens);
      setLoading(false);
    })();
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateSales = async (data) => { setSales(data); await save(KEYS.sales, data); };
  const updateStaff = async (data) => { setStaff(data); await save(KEYS.staff, data); };
  const updateExpenses = async (data) => { setExpenses(data); await save(KEYS.expenses, data); };
  const updateUsers = async (data) => { setUsers(data); await save(KEYS.users, data); };
  const updateDesignations = async (data) => { setDesignations(data); await save(KEYS.designations, data); };
  const updateExpenseCategories = async (data) => { setExpenseCategories(data); await save(KEYS.expenseCategories, data); };
  const updateVendors = async (data) => { setVendors(data); await save(KEYS.vendors, data); };

  if (loading) return (
    <div style={S.splash}>
      <div style={S.splashInner}>
        <div style={S.logo}>🍽️</div>
        <div style={S.splashTitle}>Restaurant Portal</div>
        <div style={S.loader}></div>
      </div>
    </div>
  );

  if (!user) return <Login users={users} onLogin={setUser} />;

  const role = ROLES[user.role];
  const todaySales = sales.filter(s => s.date === today());
  const totalSale = todaySales.reduce((a, b) => a + Number(b.amount || 0), 0);
  const totalExpense = expenses.filter(e => e.date === today()).reduce((a, b) => a + Number(b.amount || 0), 0);

  const navItems = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "sale", icon: "💵", label: "Daily Sale" },
    ...(role.canViewReports ? [{ id: "reports", icon: "📈", label: "Reports" }] : []),
    ...(role.canViewAll ? [{ id: "staff", icon: "👥", label: "Staff" }] : []),
    ...(role.canViewAll ? [{ id: "expenses", icon: "📋", label: "Expenses" }] : []),
    ...(role.canViewAll ? [{ id: "vendors", icon: "🏪", label: "Vendors" }] : []),
    ...(role.canManageUsers ? [{ id: "settings", icon: "⚙️", label: "Settings" }] : []),
    ...(role.canManageUsers ? [{ id: "users", icon: "👤", label: "Users" }] : []),
  ];

  return (
    <div style={S.app}>
      <aside style={S.sidebar}>
        <div style={S.sideTop}>
          <div style={S.sideLogoWrap}>
            <span style={S.sideLogo}>🍽️</span>
            <span style={S.sideTitle}>Restaurant</span>
          </div>
          <div style={S.userBadge}>
            <span style={{ ...S.roleDot, background: role.color }}>{role.badge}</span>
            <div>
              <div style={S.userName}>{user.name}</div>
              <div style={{ ...S.roleLabel, color: role.color }}>{role.label}</div>
            </div>
          </div>
        </div>

        <nav style={S.nav}>
          {navItems.map(item => (
            <button key={item.id} style={{ ...S.navBtn, ...(page === item.id ? S.navActive : {}) }}
              onClick={() => setPage(item.id)}>
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>

        <button style={S.logoutBtn} onClick={() => setUser(null)}>🚪 Logout</button>
      </aside>

      <main style={S.main}>
        {toast && (
          <div style={{ ...S.toast, background: toast.type === "error" ? "#c0392b" : "#27ae60" }}>
            {toast.msg}
          </div>
        )}

        {page === "dashboard" && (
          <Dashboard totalSale={totalSale} totalExpense={totalExpense}
            salesCount={todaySales.length} staffCount={staff.filter(s => s.active).length}
            role={role} sales={sales} vendorCount={vendors.length} />
        )}
        {page === "sale" && (
          <SaleEntry sales={sales} onUpdate={updateSales} staff={staff}
            user={user} toast={showToast} role={role} />
        )}
        {page === "reports" && role.canViewReports && (
          <Reports sales={sales} expenses={expenses} staff={staff} />
        )}
        {page === "staff" && role.canViewAll && (
          <Staff staff={staff} onUpdate={updateStaff} role={role} toast={showToast} designations={designations} />
        )}
        {page === "expenses" && role.canViewAll && (
          <Expenses expenses={expenses} onUpdate={updateExpenses} role={role} toast={showToast}
            expenseCategories={expenseCategories} vendors={vendors} />
        )}
        {page === "vendors" && role.canViewAll && (
          <Vendors vendors={vendors} onUpdate={updateVendors} role={role} toast={showToast} />
        )}
        {page === "settings" && role.canManageUsers && (
          <Settings
            designations={designations} onUpdateDesignations={updateDesignations}
            expenseCategories={expenseCategories} onUpdateExpenseCategories={updateExpenseCategories}
            toast={showToast}
          />
        )}
        {page === "users" && role.canManageUsers && (
          <Users users={users} onUpdate={updateUsers} toast={showToast} />
        )}
      </main>
    </div>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────
function Login({ users, onLogin }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");

  const login = () => {
    const found = users.find(x => x.username === u && x.password === p && x.active);
    if (found) onLogin(found);
    else setErr("❌ غلط username یا password");
  };

  return (
    <div style={S.loginWrap}>
      <div style={S.loginCard}>
        <div style={S.loginLogo}>🍽️</div>
        <h1 style={S.loginTitle}>Restaurant Portal</h1>
        <p style={S.loginSub}>اپنی ID سے login کریں</p>
        <input style={S.input} placeholder="Username" value={u}
          onChange={e => { setU(e.target.value); setErr(""); }} />
        <input style={S.input} type="password" placeholder="Password" value={p}
          onChange={e => { setP(e.target.value); setErr(""); }}
          onKeyDown={e => e.key === "Enter" && login()} />
        {err && <div style={S.errMsg}>{err}</div>}
        <button style={S.loginBtn} onClick={login}>Login کریں</button>
        <div style={S.loginHint}>
          <b>Demo:</b> admin/admin123 · sufian/mgr123 · chitta/cash123
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ totalSale, totalExpense, salesCount, staffCount, role, sales, vendorCount }) {
  const net = totalSale - totalExpense;
  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const amt = sales.filter(s => s.date === key).reduce((a, b) => a + Number(b.amount || 0), 0);
    last7.push({ date: key.slice(5), amt });
  }
  const maxAmt = Math.max(...last7.map(d => d.amt), 1);

  return (
    <div style={S.page}>
      <h2 style={S.pageTitle}>📊 Dashboard — آج کا خلاصہ</h2>
      <div style={S.cards}>
        <Card icon="💵" label="آج کی Sale" value={`Rs. ${fmt(totalSale)}`} color="#27ae60" />
        <Card icon="📋" label="Expenses" value={`Rs. ${fmt(totalExpense)}`} color="#e67e22" />
        <Card icon="📈" label="Net Profit" value={`Rs. ${fmt(net)}`} color={net >= 0 ? "#2980b9" : "#c0392b"} />
        {role.canViewAll && <Card icon="👥" label="Active Staff" value={staffCount} color="#8e44ad" />}
        {role.canViewAll && <Card icon="🏪" label="Vendors" value={vendorCount} color="#16a085" />}
      </div>

      <div style={S.chartBox}>
        <div style={S.sectionTitle}>📅 پچھلے 7 دن کی Sales</div>
        <div style={S.barChart}>
          {last7.map((d, i) => (
            <div key={i} style={S.barWrap}>
              <div style={S.barAmt}>{d.amt > 0 ? `${Math.round(d.amt / 1000)}k` : ""}</div>
              <div style={{ ...S.bar, height: `${Math.max((d.amt / maxAmt) * 120, 4)}px` }} />
              <div style={S.barLabel}>{d.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({ icon, label, value, color }) {
  return (
    <div style={{ ...S.card, borderTop: `4px solid ${color}` }}>
      <div style={S.cardIcon}>{icon}</div>
      <div style={S.cardLabel}>{label}</div>
      <div style={{ ...S.cardValue, color }}>{value}</div>
    </div>
  );
}

// ─── Sale Entry ───────────────────────────────────────────────────────────────
function SaleEntry({ sales, onUpdate, staff, user, toast, role }) {
  const [form, setForm] = useState({ date: today(), amount: "", type: "Cash", note: "", staffId: "" });
  const [filter, setFilter] = useState(today());

  const add = async () => {
    if (!form.amount || isNaN(form.amount)) return toast("Amount درست نہیں", "error");
    const rec = { id: uid(), ...form, amount: Number(form.amount), addedBy: user.name, addedAt: new Date().toLocaleTimeString("ur-PK") };
    await onUpdate([...sales, rec]);
    setForm(f => ({ ...f, amount: "", note: "" }));
    toast("✅ Sale save ہو گئی!");
  };

  const del = async (id) => {
    if (!role.canEdit) return toast("آپ کو delete کی اجازت نہیں", "error");
    await onUpdate(sales.filter(s => s.id !== id));
    toast("🗑️ Delete ہو گیا");
  };

  const filtered = sales.filter(s => s.date === filter);
  const total = filtered.reduce((a, b) => a + Number(b.amount), 0);

  return (
    <div style={S.page}>
      <h2 style={S.pageTitle}>💵 Daily Sale Entry</h2>
      <div style={S.formCard}>
        <div style={S.formGrid}>
          <div style={S.formGroup}>
            <label style={S.label}>تاریخ</label>
            <input style={S.input} type="date" value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          </div>
          <div style={S.formGroup}>
            <label style={S.label}>Amount (Rs.)</label>
            <input style={S.input} type="number" placeholder="مثلاً: 428720"
              value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
          </div>
          <div style={S.formGroup}>
            <label style={S.label}>قسم</label>
            <select style={S.input} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              <option>Cash</option><option>Card</option><option>Online</option><option>ATM</option>
            </select>
          </div>
          <div style={S.formGroup}>
            <label style={S.label}>Staff</label>
            <select style={S.input} value={form.staffId} onChange={e => setForm(f => ({ ...f, staffId: e.target.value }))}>
              <option value="">-- کوئی نہیں --</option>
              {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div style={{ ...S.formGroup, gridColumn: "1/-1" }}>
            <label style={S.label}>نوٹ</label>
            <input style={S.input} placeholder="اضافی معلومات..." value={form.note}
              onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
          </div>
        </div>
        <button style={S.addBtn} onClick={add}>+ Sale Add کریں</button>
      </div>

      <div style={S.tableCard}>
        <div style={S.tableHeader}>
          <span style={S.sectionTitle}>📋 Sales Record</span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input style={{ ...S.input, width: 140, marginBottom: 0 }} type="date" value={filter}
              onChange={e => setFilter(e.target.value)} />
            <span style={S.totalBadge}>Total: Rs. {fmt(total)}</span>
          </div>
        </div>
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead>
              <tr style={S.thead}>
                {["تاریخ", "Amount", "قسم", "Staff", "نوٹ", "By", "وقت", role.canEdit ? "🗑️" : null].filter(Boolean).map(h => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={S.empty}>کوئی record نہیں</td></tr>
              ) : filtered.slice().reverse().map(s => (
                <tr key={s.id} style={S.tr}>
                  <td style={S.td}>{s.date}</td>
                  <td style={{ ...S.td, color: "#27ae60", fontWeight: 700 }}>Rs. {fmt(s.amount)}</td>
                  <td style={S.td}><span style={{ ...S.tag, background: s.type === "Cash" ? "#e8f5e9" : "#e3f2fd" }}>{s.type}</span></td>
                  <td style={S.td}>{staff.find(x => x.id == s.staffId)?.name || "—"}</td>
                  <td style={S.td}>{s.note || "—"}</td>
                  <td style={S.td}>{s.addedBy}</td>
                  <td style={S.td}>{s.addedAt}</td>
                  {role.canEdit && <td style={S.td}><button style={S.delBtn} onClick={() => del(s.id)}>🗑️</button></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Reports ──────────────────────────────────────────────────────────────────
function Reports({ sales, expenses, staff }) {
  const [month, setMonth] = useState(today().slice(0, 7));
  const mSales = sales.filter(s => s.date?.startsWith(month));
  const mExp = expenses.filter(e => e.date?.startsWith(month));
  const totalSale = mSales.reduce((a, b) => a + Number(b.amount || 0), 0);
  const totalExp = mExp.reduce((a, b) => a + Number(b.amount || 0), 0);
  const net = totalSale - totalExp;
  const salaryTotal = staff.reduce((a, b) => a + Number(b.salary || 0), 0);
  const byDay = {};
  mSales.forEach(s => { byDay[s.date] = (byDay[s.date] || 0) + Number(s.amount || 0); });
  const days = Object.entries(byDay).sort(([a], [b]) => a > b ? -1 : 1);

  return (
    <div style={S.page}>
      <h2 style={S.pageTitle}>📈 Monthly Report</h2>
      <input style={{ ...S.input, maxWidth: 200, marginBottom: 20 }} type="month" value={month}
        onChange={e => setMonth(e.target.value)} />
      <div style={S.cards}>
        <Card icon="💵" label="کل Sales" value={`Rs. ${fmt(totalSale)}`} color="#27ae60" />
        <Card icon="📋" label="کل Expenses" value={`Rs. ${fmt(totalExp)}`} color="#e67e22" />
        <Card icon="👥" label="Staff Salary" value={`Rs. ${fmt(salaryTotal)}`} color="#8e44ad" />
        <Card icon="📈" label="Net Profit" value={`Rs. ${fmt(net - salaryTotal)}`} color={net - salaryTotal >= 0 ? "#2980b9" : "#c0392b"} />
      </div>
      <div style={S.tableCard}>
        <div style={S.sectionTitle}>📅 روزانہ Sales</div>
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead><tr style={S.thead}>{["تاریخ", "Sale", "Entries"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>
              {days.length === 0 ? <tr><td colSpan={3} style={S.empty}>کوئی record نہیں</td></tr>
                : days.map(([d, amt]) => (
                  <tr key={d} style={S.tr}>
                    <td style={S.td}>{d}</td>
                    <td style={{ ...S.td, color: "#27ae60", fontWeight: 700 }}>Rs. {fmt(amt)}</td>
                    <td style={S.td}>{mSales.filter(s => s.date === d).length}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Staff ────────────────────────────────────────────────────────────────────
function Staff({ staff, onUpdate, role, toast, designations }) {
  const [form, setForm] = useState({ name: "", role: "", salary: "", advance: 0 });
  const [editId, setEditId] = useState(null);

  const defaultRole = designations.length > 0 ? designations[0].name : "";

  const save = async () => {
    if (!form.name) return toast("نام لکھیں", "error");
    const roleToSave = form.role || defaultRole;
    if (editId) {
      await onUpdate(staff.map(s => s.id === editId ? { ...s, ...form, role: roleToSave } : s));
      setEditId(null); toast("✅ Update ہو گیا!");
    } else {
      await onUpdate([...staff, { id: uid(), ...form, role: roleToSave, salary: Number(form.salary), active: true }]);
      toast("✅ Staff Add ہو گئی!");
    }
    setForm({ name: "", role: "", salary: "", advance: 0 });
  };

  const startEdit = (s) => { setForm({ name: s.name, role: s.role, salary: s.salary, advance: s.advance }); setEditId(s.id); };
  const toggle = async (id) => {
    if (!role.canEdit) return toast("آپ کو یہ اجازت نہیں", "error");
    await onUpdate(staff.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };
  const del = async (id) => {
    if (!role.canEdit) return toast("اجازت نہیں", "error");
    await onUpdate(staff.filter(s => s.id !== id));
    toast("🗑️ Delete ہو گیا");
  };

  const getDesignationInfo = (roleName) => designations.find(d => d.name === roleName);

  return (
    <div style={S.page}>
      <h2 style={S.pageTitle}>👥 Staff Management</h2>
      {role.canEdit && (
        <div style={S.formCard}>
          <div style={S.sectionTitle}>{editId ? "✏️ Staff Edit کریں" : "➕ نئی Staff"}</div>
          <div style={S.formGrid}>
            <div style={S.formGroup}>
              <label style={S.label}>نام</label>
              <input style={S.input} placeholder="نام" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div style={S.formGroup}>
              <label style={S.label}>عہدہ (Designation)</label>
              <select style={S.input} value={form.role || defaultRole} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                {designations.map(d => <option key={d.id} value={d.name}>{d.icon} {d.name}</option>)}
                {designations.length === 0 && <option value="">پہلے designation بنائیں ⚙️ Settings میں</option>}
              </select>
            </div>
            <div style={S.formGroup}>
              <label style={S.label}>تنخواہ (Rs.)</label>
              <input style={S.input} type="number" value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} />
            </div>
            <div style={S.formGroup}>
              <label style={S.label}>Advance (Rs.)</label>
              <input style={S.input} type="number" value={form.advance} onChange={e => setForm(f => ({ ...f, advance: e.target.value }))} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={S.addBtn} onClick={save}>{editId ? "Update کریں" : "+ Add کریں"}</button>
            {editId && <button style={S.cancelBtn} onClick={() => { setEditId(null); setForm({ name: "", role: "", salary: "", advance: 0 }); }}>Cancel</button>}
          </div>
        </div>
      )}

      <div style={S.tableCard}>
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead>
              <tr style={S.thead}>
                {["نام", "عہدہ", "تنخواہ", "Advance", "Status", role.canEdit ? "Actions" : null].filter(Boolean).map(h => <th key={h} style={S.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {staff.map(s => {
                const desInfo = getDesignationInfo(s.role);
                return (
                  <tr key={s.id} style={{ ...S.tr, opacity: s.active ? 1 : 0.5 }}>
                    <td style={S.td}><b>{s.name}</b></td>
                    <td style={S.td}>
                      <span style={{ ...S.tag, background: (desInfo?.color || "#7f8c8d") + "22", color: desInfo?.color || "#7f8c8d" }}>
                        {desInfo?.icon || "👤"} {s.role}
                      </span>
                    </td>
                    <td style={{ ...S.td, color: "#27ae60", fontWeight: 700 }}>Rs. {fmt(s.salary)}</td>
                    <td style={{ ...S.td, color: "#e67e22" }}>Rs. {fmt(s.advance)}</td>
                    <td style={S.td}><span style={{ ...S.tag, background: s.active ? "#e8f5e9" : "#fce4ec", color: s.active ? "#27ae60" : "#c0392b" }}>{s.active ? "Active" : "Inactive"}</span></td>
                    {role.canEdit && (
                      <td style={S.td}>
                        <button style={S.editBtn} onClick={() => startEdit(s)}>✏️</button>
                        <button style={S.delBtn} onClick={() => toggle(s.id)}>{s.active ? "🚫" : "✅"}</button>
                        <button style={{ ...S.delBtn, marginLeft: 4 }} onClick={() => del(s.id)}>🗑️</button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Expenses ─────────────────────────────────────────────────────────────────
function Expenses({ expenses, onUpdate, role, toast, expenseCategories, vendors }) {
  const defaultCat = expenseCategories.length > 0 ? expenseCategories[0].name : "Other";
  const [form, setForm] = useState({ date: today(), category: defaultCat, amount: "", note: "", vendorId: "" });
  const [filterCat, setFilterCat] = useState("all");

  const add = async () => {
    if (!form.amount) return toast("Amount لکھیں", "error");
    const cat = form.category || defaultCat;
    await onUpdate([...expenses, { id: uid(), ...form, category: cat, amount: Number(form.amount) }]);
    setForm(f => ({ ...f, amount: "", note: "", vendorId: "" }));
    toast("✅ Expense Save ہو گئی!");
  };

  const del = async (id) => {
    if (!role.canEdit) return toast("اجازت نہیں", "error");
    await onUpdate(expenses.filter(e => e.id !== id));
  };

  const filtered = filterCat === "all" ? expenses : expenses.filter(e => e.category === filterCat);
  const total = filtered.reduce((a, b) => a + Number(b.amount || 0), 0);

  const getCatInfo = (catName) => expenseCategories.find(c => c.name === catName);
  const getVendorName = (vId) => vendors.find(v => v.id == vId)?.name;

  return (
    <div style={S.page}>
      <h2 style={S.pageTitle}>📋 Expenses</h2>
      {role.canEdit && (
        <div style={S.formCard}>
          <div style={S.sectionTitle}>➕ نئی Expense</div>
          <div style={S.formGrid}>
            <div style={S.formGroup}>
              <label style={S.label}>تاریخ</label>
              <input style={S.input} type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div style={S.formGroup}>
              <label style={S.label}>قسم (Category)</label>
              <select style={S.input} value={form.category || defaultCat} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {expenseCategories.map(c => <option key={c.id} value={c.name}>{c.icon} {c.name}</option>)}
                {expenseCategories.length === 0 && <option>پہلے category بنائیں ⚙️ Settings میں</option>}
              </select>
            </div>
            <div style={S.formGroup}>
              <label style={S.label}>Vendor (اختیاری)</label>
              <select style={S.input} value={form.vendorId} onChange={e => setForm(f => ({ ...f, vendorId: e.target.value }))}>
                <option value="">-- کوئی Vendor نہیں --</option>
                {vendors.map(v => <option key={v.id} value={v.id}>{v.name} ({v.city})</option>)}
              </select>
            </div>
            <div style={S.formGroup}>
              <label style={S.label}>Amount (Rs.)</label>
              <input style={S.input} type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
            </div>
            <div style={{ ...S.formGroup, gridColumn: "1/-1" }}>
              <label style={S.label}>نوٹ</label>
              <input style={S.input} value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
            </div>
          </div>
          <button style={S.addBtn} onClick={add}>+ Add کریں</button>
        </div>
      )}

      <div style={S.tableCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
          <span style={S.sectionTitle}>کل Expenses</span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <select style={{ ...S.input, marginBottom: 0, minWidth: 150 }} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
              <option value="all">سب Categories</option>
              {expenseCategories.map(c => <option key={c.id} value={c.name}>{c.icon} {c.name}</option>)}
            </select>
            <span style={S.totalBadge}>Rs. {fmt(total)}</span>
          </div>
        </div>
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead>
              <tr style={S.thead}>
                {["تاریخ", "قسم", "Vendor", "Amount", "نوٹ", role.canEdit ? "🗑️" : null].filter(Boolean).map(h => <th key={h} style={S.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? <tr><td colSpan={6} style={S.empty}>کوئی record نہیں</td></tr>
                : filtered.slice().reverse().map(e => {
                  const catInfo = getCatInfo(e.category);
                  return (
                    <tr key={e.id} style={S.tr}>
                      <td style={S.td}>{e.date}</td>
                      <td style={S.td}>
                        <span style={{ ...S.tag, background: (catInfo?.color || "#7f8c8d") + "22", color: catInfo?.color || "#7f8c8d" }}>
                          {catInfo?.icon || "📦"} {e.category}
                        </span>
                      </td>
                      <td style={S.td}>{getVendorName(e.vendorId) || "—"}</td>
                      <td style={{ ...S.td, color: "#c0392b", fontWeight: 700 }}>Rs. {fmt(e.amount)}</td>
                      <td style={S.td}>{e.note || "—"}</td>
                      {role.canEdit && <td style={S.td}><button style={S.delBtn} onClick={() => del(e.id)}>🗑️</button></td>}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Vendors ──────────────────────────────────────────────────────────────────
function Vendors({ vendors, onUpdate, role, toast }) {
  const [form, setForm] = useState({ name: "", category: "", city: "", address: "", phone: "", contactPerson: "", notes: "" });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const VENDOR_CATEGORIES = [
    "Grocery / سبزی",
    "Meat / گوشت",
    "Dairy / دودھ",
    "Beverages / مشروبات",
    "Packaging / پیکجنگ",
    "Cooking Oil / تیل",
    "Spices / مسالے",
    "Bakery / بیکری",
    "Cleaning / صفائی",
    "Electronics / الیکٹرونکس",
    "Furniture / فرنیچر",
    "Other / دیگر",
  ];

  const save = async () => {
    if (!form.name || !form.city) return toast("نام اور شہر ضروری ہیں", "error");
    if (editId) {
      await onUpdate(vendors.map(v => v.id === editId ? { ...v, ...form } : v));
      setEditId(null); toast("✅ Vendor Update ہو گیا!");
    } else {
      await onUpdate([...vendors, { id: uid(), ...form, addedOn: today() }]);
      toast("✅ Vendor Add ہو گیا!");
    }
    setForm({ name: "", category: "", city: "", address: "", phone: "", contactPerson: "", notes: "" });
  };

  const startEdit = (v) => {
    setForm({ name: v.name, category: v.category, city: v.city, address: v.address || "", phone: v.phone || "", contactPerson: v.contactPerson || "", notes: v.notes || "" });
    setEditId(v.id);
  };
  const del = async (id) => {
    if (!role.canEdit) return toast("اجازت نہیں", "error");
    await onUpdate(vendors.filter(v => v.id !== id));
    toast("🗑️ Delete ہو گیا");
  };

  const filtered = vendors.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.city.toLowerCase().includes(search.toLowerCase()) ||
    (v.category || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={S.page}>
      <h2 style={S.pageTitle}>🏪 Vendors Management</h2>

      {role.canEdit && (
        <div style={S.formCard}>
          <div style={S.sectionTitle}>{editId ? "✏️ Vendor Edit کریں" : "➕ نیا Vendor بنائیں"}</div>
          <div style={S.formGrid}>
            <div style={S.formGroup}>
              <label style={S.label}>Vendor نام *</label>
              <input style={S.input} placeholder="مثلاً: Al-Madina Grocery" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div style={S.formGroup}>
              <label style={S.label}>قسم (Category) *</label>
              <select style={S.input} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <option value="">-- Category چنیں --</option>
                {VENDOR_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={S.formGroup}>
              <label style={S.label}>شہر / علاقہ *</label>
              <input style={S.input} placeholder="مثلاً: گوجرانوالہ، لاہور" value={form.city}
                onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
            </div>
            <div style={S.formGroup}>
              <label style={S.label}>پتہ (Address)</label>
              <input style={S.input} placeholder="گلی / محلہ / بازار" value={form.address}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
            </div>
            <div style={S.formGroup}>
              <label style={S.label}>رابطہ نمبر (Phone)</label>
              <input style={S.input} placeholder="0300-0000000" value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div style={S.formGroup}>
              <label style={S.label}>Contact Person</label>
              <input style={S.input} placeholder="دکاندار کا نام" value={form.contactPerson}
                onChange={e => setForm(f => ({ ...f, contactPerson: e.target.value }))} />
            </div>
            <div style={{ ...S.formGroup, gridColumn: "1/-1" }}>
              <label style={S.label}>نوٹ</label>
              <input style={S.input} placeholder="کوئی اضافی معلومات..." value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={S.addBtn} onClick={save}>{editId ? "Update کریں" : "+ Vendor Add کریں"}</button>
            {editId && <button style={S.cancelBtn} onClick={() => { setEditId(null); setForm({ name: "", category: "", city: "", address: "", phone: "", contactPerson: "", notes: "" }); }}>Cancel</button>}
          </div>
        </div>
      )}

      <div style={S.tableCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
          <span style={S.sectionTitle}>کل Vendors: {vendors.length}</span>
          <input style={{ ...S.input, maxWidth: 220, marginBottom: 0 }} placeholder="🔍 نام / شہر / قسم تلاش کریں"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead>
              <tr style={S.thead}>
                {["Vendor نام", "قسم", "شہر", "پتہ", "فون", "Contact", "نوٹ", role.canEdit ? "Actions" : null].filter(Boolean).map(h => <th key={h} style={S.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={8} style={S.empty}>کوئی Vendor نہیں ملا</td></tr>
                : filtered.map(v => (
                  <tr key={v.id} style={S.tr}>
                    <td style={S.td}><b>{v.name}</b></td>
                    <td style={S.td}><span style={{ ...S.tag, background: "#e8f4fd", color: "#2980b9" }}>{v.category || "—"}</span></td>
                    <td style={S.td}><span style={{ ...S.tag, background: "#e8f5e9", color: "#27ae60" }}>📍 {v.city}</span></td>
                    <td style={S.td}>{v.address || "—"}</td>
                    <td style={S.td}>{v.phone || "—"}</td>
                    <td style={S.td}>{v.contactPerson || "—"}</td>
                    <td style={S.td}>{v.notes || "—"}</td>
                    {role.canEdit && (
                      <td style={S.td}>
                        <button style={S.editBtn} onClick={() => startEdit(v)}>✏️</button>
                        <button style={{ ...S.delBtn, marginLeft: 4 }} onClick={() => del(v.id)}>🗑️</button>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Settings (Designations + Expense Categories) ────────────────────────────
function Settings({ designations, onUpdateDesignations, expenseCategories, onUpdateExpenseCategories, toast }) {
  const [tab, setTab] = useState("designations");

  // Designation form
  const [desForm, setDesForm] = useState({ name: "", icon: "👤", color: "#3498db" });
  const [desEditId, setDesEditId] = useState(null);

  // Expense Category form
  const [catForm, setCatForm] = useState({ name: "", icon: "📦", color: "#7f8c8d" });
  const [catEditId, setCatEditId] = useState(null);

  const PRESET_ICONS_DES = ["👤", "🍽️", "💰", "👨‍🍳", "🏍️", "🧑‍💼", "🧹", "🔒", "📦", "🚚", "🛎️", "⭐", "🔑", "📱", "🎯"];
  const PRESET_ICONS_CAT = ["🛒", "💡", "💸", "🏠", "🔧", "📦", "🥩", "🥛", "🍵", "🧴", "🛢️", "🌶️", "🧂", "🍞", "🎁"];
  const PRESET_COLORS = ["#e74c3c", "#3498db", "#27ae60", "#e67e22", "#9b59b6", "#2980b9", "#16a085", "#d35400", "#c0392b", "#8e44ad", "#f39c12", "#1abc9c", "#2ecc71", "#e91e63", "#607d8b"];

  // --- Designation handlers ---
  const saveDes = async () => {
    if (!desForm.name.trim()) return toast("نام لکھیں", "error");
    if (desEditId) {
      await onUpdateDesignations(designations.map(d => d.id === desEditId ? { ...d, ...desForm } : d));
      setDesEditId(null); toast("✅ Designation Update ہو گئی!");
    } else {
      if (designations.find(d => d.name.toLowerCase() === desForm.name.toLowerCase())) return toast("یہ designation پہلے سے موجود ہے", "error");
      await onUpdateDesignations([...designations, { id: uid(), ...desForm }]);
      toast("✅ Designation بن گئی!");
    }
    setDesForm({ name: "", icon: "👤", color: "#3498db" });
  };

  const editDes = (d) => { setDesForm({ name: d.name, icon: d.icon, color: d.color }); setDesEditId(d.id); };
  const delDes = async (id) => {
    await onUpdateDesignations(designations.filter(d => d.id !== id));
    toast("🗑️ Delete ہو گیا");
  };

  // --- Category handlers ---
  const saveCat = async () => {
    if (!catForm.name.trim()) return toast("نام لکھیں", "error");
    if (catEditId) {
      await onUpdateExpenseCategories(expenseCategories.map(c => c.id === catEditId ? { ...c, ...catForm } : c));
      setCatEditId(null); toast("✅ Category Update ہو گئی!");
    } else {
      if (expenseCategories.find(c => c.name.toLowerCase() === catForm.name.toLowerCase())) return toast("یہ category پہلے سے موجود ہے", "error");
      await onUpdateExpenseCategories([...expenseCategories, { id: uid(), ...catForm }]);
      toast("✅ Category بن گئی!");
    }
    setCatForm({ name: "", icon: "📦", color: "#7f8c8d" });
  };

  const editCat = (c) => { setCatForm({ name: c.name, icon: c.icon, color: c.color }); setCatEditId(c.id); };
  const delCat = async (id) => {
    await onUpdateExpenseCategories(expenseCategories.filter(c => c.id !== id));
    toast("🗑️ Delete ہو گیا");
  };

  return (
    <div style={S.page}>
      <h2 style={S.pageTitle}>⚙️ Settings</h2>

      {/* Tab Bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button
          style={{ ...S.tabBtn, ...(tab === "designations" ? S.tabActive : {}) }}
          onClick={() => setTab("designations")}>
          👤 Staff Designations
        </button>
        <button
          style={{ ...S.tabBtn, ...(tab === "categories" ? S.tabActive : {}) }}
          onClick={() => setTab("categories")}>
          📋 Expense Categories
        </button>
      </div>

      {/* ── Designations Tab ── */}
      {tab === "designations" && (
        <>
          <div style={S.formCard}>
            <div style={S.sectionTitle}>{desEditId ? "✏️ Designation Edit کریں" : "➕ نئی Designation بنائیں"}</div>
            <div style={S.formGrid}>
              <div style={S.formGroup}>
                <label style={S.label}>عہدے کا نام *</label>
                <input style={S.input} placeholder="مثلاً: Head Chef, Supervisor" value={desForm.name}
                  onChange={e => setDesForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div style={S.formGroup}>
                <label style={S.label}>رنگ (Color)</label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                  {PRESET_COLORS.map(c => (
                    <div key={c} onClick={() => setDesForm(f => ({ ...f, color: c }))}
                      style={{ width: 24, height: 24, borderRadius: "50%", background: c, cursor: "pointer", border: desForm.color === c ? "3px solid #1a1a2e" : "2px solid #fff", boxShadow: "0 1px 3px #0003" }} />
                  ))}
                </div>
              </div>
              <div style={S.formGroup}>
                <label style={S.label}>آئیکن (Icon)</label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {PRESET_ICONS_DES.map(ic => (
                    <div key={ic} onClick={() => setDesForm(f => ({ ...f, icon: ic }))}
                      style={{ width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, cursor: "pointer", background: desForm.icon === ic ? desForm.color + "33" : "#f0f0f0", border: desForm.icon === ic ? `2px solid ${desForm.color}` : "2px solid transparent" }}>
                      {ic}
                    </div>
                  ))}
                </div>
              </div>
              <div style={S.formGroup}>
                <label style={S.label}>Preview</label>
                <span style={{ ...S.tag, background: desForm.color + "22", color: desForm.color, fontSize: 14, padding: "6px 14px" }}>
                  {desForm.icon} {desForm.name || "Designation"}
                </span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={S.addBtn} onClick={saveDes}>{desEditId ? "Update کریں" : "+ بنائیں"}</button>
              {desEditId && <button style={S.cancelBtn} onClick={() => { setDesEditId(null); setDesForm({ name: "", icon: "👤", color: "#3498db" }); }}>Cancel</button>}
            </div>
          </div>

          <div style={S.tableCard}>
            <div style={S.sectionTitle}>موجودہ Designations ({designations.length})</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 12 }}>
              {designations.length === 0 && <p style={{ color: "#aaa" }}>ابھی کوئی designation نہیں</p>}
              {designations.map(d => (
                <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 10, background: d.color + "11", border: `1.5px solid ${d.color}33`, borderRadius: 10, padding: "10px 16px" }}>
                  <span style={{ fontSize: 22 }}>{d.icon}</span>
                  <span style={{ fontWeight: 700, color: d.color }}>{d.name}</span>
                  <button style={S.editBtn} onClick={() => editDes(d)}>✏️</button>
                  <button style={S.delBtn} onClick={() => delDes(d.id)}>🗑️</button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Expense Categories Tab ── */}
      {tab === "categories" && (
        <>
          <div style={S.formCard}>
            <div style={S.sectionTitle}>{catEditId ? "✏️ Category Edit کریں" : "➕ نئی Expense Category بنائیں"}</div>
            <div style={S.formGrid}>
              <div style={S.formGroup}>
                <label style={S.label}>Category نام *</label>
                <input style={S.input} placeholder="مثلاً: Fuel, Medicine, Marketing" value={catForm.name}
                  onChange={e => setCatForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div style={S.formGroup}>
                <label style={S.label}>رنگ (Color)</label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                  {PRESET_COLORS.map(c => (
                    <div key={c} onClick={() => setCatForm(f => ({ ...f, color: c }))}
                      style={{ width: 24, height: 24, borderRadius: "50%", background: c, cursor: "pointer", border: catForm.color === c ? "3px solid #1a1a2e" : "2px solid #fff", boxShadow: "0 1px 3px #0003" }} />
                  ))}
                </div>
              </div>
              <div style={S.formGroup}>
                <label style={S.label}>آئیکن (Icon)</label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {PRESET_ICONS_CAT.map(ic => (
                    <div key={ic} onClick={() => setCatForm(f => ({ ...f, icon: ic }))}
                      style={{ width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, cursor: "pointer", background: catForm.icon === ic ? catForm.color + "33" : "#f0f0f0", border: catForm.icon === ic ? `2px solid ${catForm.color}` : "2px solid transparent" }}>
                      {ic}
                    </div>
                  ))}
                </div>
              </div>
              <div style={S.formGroup}>
                <label style={S.label}>Preview</label>
                <span style={{ ...S.tag, background: catForm.color + "22", color: catForm.color, fontSize: 14, padding: "6px 14px" }}>
                  {catForm.icon} {catForm.name || "Category"}
                </span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={S.addBtn} onClick={saveCat}>{catEditId ? "Update کریں" : "+ بنائیں"}</button>
              {catEditId && <button style={S.cancelBtn} onClick={() => { setCatEditId(null); setCatForm({ name: "", icon: "📦", color: "#7f8c8d" }); }}>Cancel</button>}
            </div>
          </div>

          <div style={S.tableCard}>
            <div style={S.sectionTitle}>موجودہ Categories ({expenseCategories.length})</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 12 }}>
              {expenseCategories.length === 0 && <p style={{ color: "#aaa" }}>ابھی کوئی category نہیں</p>}
              {expenseCategories.map(c => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, background: c.color + "11", border: `1.5px solid ${c.color}33`, borderRadius: 10, padding: "10px 16px" }}>
                  <span style={{ fontSize: 22 }}>{c.icon}</span>
                  <span style={{ fontWeight: 700, color: c.color }}>{c.name}</span>
                  <button style={S.editBtn} onClick={() => editCat(c)}>✏️</button>
                  <button style={S.delBtn} onClick={() => delCat(c.id)}>🗑️</button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Users ────────────────────────────────────────────────────────────────────
function Users({ users, onUpdate, toast }) {
  const [form, setForm] = useState({ name: "", username: "", password: "", role: "cashier" });

  const add = async () => {
    if (!form.name || !form.username || !form.password) return toast("سب fields بھریں", "error");
    if (users.find(u => u.username === form.username)) return toast("یہ username پہلے سے موجود ہے", "error");
    await onUpdate([...users, { id: uid(), ...form, active: true }]);
    setForm({ name: "", username: "", password: "", role: "cashier" });
    toast("✅ User بن گیا!");
  };

  const toggle = async (id) => await onUpdate(users.map(u => u.id === id ? { ...u, active: !u.active } : u));
  const del = async (id) => await onUpdate(users.filter(u => u.id !== id));

  return (
    <div style={S.page}>
      <h2 style={S.pageTitle}>👤 User Management</h2>
      <div style={S.formCard}>
        <div style={S.sectionTitle}>➕ نیا User بنائیں</div>
        <div style={S.formGrid}>
          <div style={S.formGroup}><label style={S.label}>نام</label>
            <input style={S.input} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div style={S.formGroup}><label style={S.label}>Username</label>
            <input style={S.input} value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} /></div>
          <div style={S.formGroup}><label style={S.label}>Password</label>
            <input style={S.input} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} /></div>
          <div style={S.formGroup}><label style={S.label}>Role</label>
            <select style={S.input} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
              <option value="owner">Owner/Admin 👑</option>
              <option value="manager">Manager 🧑‍💼</option>
              <option value="cashier">Cashier 💰</option>
            </select></div>
        </div>
        <button style={S.addBtn} onClick={add}>+ User Add کریں</button>
      </div>

      <div style={S.tableCard}>
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead><tr style={S.thead}>{["نام", "Username", "Role", "Status", "Actions"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ ...S.tr, opacity: u.active ? 1 : 0.5 }}>
                  <td style={S.td}><b>{u.name}</b></td>
                  <td style={S.td}><code>{u.username}</code></td>
                  <td style={S.td}><span style={{ ...S.tag, background: ROLES[u.role]?.color + "22", color: ROLES[u.role]?.color }}>{ROLES[u.role]?.badge} {ROLES[u.role]?.label}</span></td>
                  <td style={S.td}><span style={{ ...S.tag, background: u.active ? "#e8f5e9" : "#fce4ec", color: u.active ? "#27ae60" : "#c0392b" }}>{u.active ? "Active" : "Inactive"}</span></td>
                  <td style={S.td}>
                    <button style={S.editBtn} onClick={() => toggle(u.id)}>{u.active ? "🚫" : "✅"}</button>
                    <button style={S.delBtn} onClick={() => del(u.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  splash: { display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#1a1a2e", fontFamily: "sans-serif" },
  splashInner: { textAlign: "center" },
  logo: { fontSize: 64, marginBottom: 12 },
  splashTitle: { color: "#fff", fontSize: 28, fontWeight: 700, marginBottom: 24 },
  loader: { width: 40, height: 40, border: "4px solid #ffffff33", borderTop: "4px solid #e74c3c", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" },

  app: { display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#f0f2f5" },

  sidebar: { width: 220, background: "#1a1a2e", display: "flex", flexDirection: "column", padding: "20px 0", flexShrink: 0 },
  sideTop: { padding: "0 16px 20px", borderBottom: "1px solid #ffffff15" },
  sideLogoWrap: { display: "flex", alignItems: "center", gap: 8, marginBottom: 16 },
  sideLogo: { fontSize: 28 },
  sideTitle: { color: "#fff", fontWeight: 700, fontSize: 16 },
  userBadge: { display: "flex", alignItems: "center", gap: 10, background: "#ffffff10", borderRadius: 10, padding: "10px 12px" },
  roleDot: { width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 },
  userName: { color: "#fff", fontWeight: 600, fontSize: 13 },
  roleLabel: { fontSize: 11, fontWeight: 600 },

  nav: { flex: 1, padding: "16px 10px", display: "flex", flexDirection: "column", gap: 4 },
  navBtn: { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, border: "none", background: "transparent", color: "#ffffffaa", cursor: "pointer", fontSize: 14, textAlign: "left", transition: "all 0.2s" },
  navActive: { background: "#e74c3c", color: "#fff", fontWeight: 600 },
  logoutBtn: { margin: "0 10px", padding: "10px 14px", border: "1px solid #ffffff22", borderRadius: 8, background: "transparent", color: "#ffffff88", cursor: "pointer", fontSize: 13 },

  main: { flex: 1, overflow: "auto", position: "relative" },
  toast: { position: "fixed", top: 20, right: 20, padding: "12px 20px", borderRadius: 10, color: "#fff", fontWeight: 600, zIndex: 1000, fontSize: 14, boxShadow: "0 4px 20px #0003" },

  page: { padding: 24, maxWidth: 1100, margin: "0 auto" },
  pageTitle: { fontSize: 22, fontWeight: 700, color: "#1a1a2e", marginBottom: 20, paddingBottom: 12, borderBottom: "2px solid #e74c3c" },
  sectionTitle: { fontSize: 15, fontWeight: 700, color: "#1a1a2e", marginBottom: 12 },

  cards: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 24 },
  card: { background: "#fff", borderRadius: 12, padding: "20px 16px", boxShadow: "0 2px 8px #0001" },
  cardIcon: { fontSize: 28, marginBottom: 8 },
  cardLabel: { color: "#666", fontSize: 12, marginBottom: 4 },
  cardValue: { fontSize: 20, fontWeight: 800 },

  chartBox: { background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 2px 8px #0001" },
  barChart: { display: "flex", alignItems: "flex-end", gap: 10, height: 160, padding: "10px 0 0" },
  barWrap: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  barAmt: { fontSize: 10, color: "#666" },
  bar: { width: "100%", background: "linear-gradient(180deg, #e74c3c, #c0392b)", borderRadius: "4px 4px 0 0", minHeight: 4 },
  barLabel: { fontSize: 10, color: "#888" },

  formCard: { background: "#fff", borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: "0 2px 8px #0001" },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 16 },
  formGroup: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 12, fontWeight: 600, color: "#555" },
  input: { padding: "10px 12px", border: "1.5px solid #e0e0e0", borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "inherit", marginBottom: 0 },
  addBtn: { background: "#e74c3c", color: "#fff", border: "none", padding: "11px 24px", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 14 },
  cancelBtn: { background: "#eee", color: "#333", border: "none", padding: "11px 20px", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 14 },

  tableCard: { background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 2px 8px #0001" },
  tableHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  thead: { background: "#f8f9fa" },
  th: { padding: "10px 12px", textAlign: "left", fontWeight: 700, color: "#444", borderBottom: "2px solid #eee", whiteSpace: "nowrap" },
  tr: { borderBottom: "1px solid #f0f0f0" },
  td: { padding: "10px 12px", color: "#333" },
  empty: { padding: 32, textAlign: "center", color: "#aaa" },
  tag: { padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: "#f0f0f0" },
  totalBadge: { background: "#1a1a2e", color: "#fff", padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 700 },
  delBtn: { background: "#fce4ec", border: "none", padding: "5px 8px", borderRadius: 6, cursor: "pointer", marginLeft: 4 },
  editBtn: { background: "#e3f2fd", border: "none", padding: "5px 8px", borderRadius: 6, cursor: "pointer" },

  tabBtn: { padding: "9px 20px", borderRadius: 8, border: "1.5px solid #e0e0e0", background: "#fff", color: "#555", cursor: "pointer", fontWeight: 600, fontSize: 14 },
  tabActive: { background: "#1a1a2e", color: "#fff", border: "1.5px solid #1a1a2e" },

  loginWrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)", fontFamily: "'Segoe UI', sans-serif" },
  loginCard: { background: "#fff", borderRadius: 20, padding: 40, width: "100%", maxWidth: 380, boxShadow: "0 20px 60px #0005", textAlign: "center" },
  loginLogo: { fontSize: 56, marginBottom: 8 },
  loginTitle: { fontSize: 24, fontWeight: 800, color: "#1a1a2e", margin: "0 0 6px" },
  loginSub: { color: "#888", fontSize: 14, marginBottom: 24 },
  loginBtn: { width: "100%", padding: "13px", background: "#e74c3c", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 16, cursor: "pointer", marginTop: 8 },
  loginHint: { marginTop: 16, fontSize: 12, color: "#aaa", lineHeight: 1.6 },
  errMsg: { color: "#c0392b", fontSize: 13, marginBottom: 8, fontWeight: 600 },
};
