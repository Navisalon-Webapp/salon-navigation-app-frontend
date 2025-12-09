import React, { useState, useEffect } from "react";

type Service = {
  id: string;
  name: string;
  duration: number; // minutes
  priceUsd: number; // dollars
  cat_id?: number | null;
  category: string;
  description?: string | null;
  workers: Worker[];
};

type Category = { id: number; name: string };

type Worker = { eid: number; name: string };

// Simple styles, same palette as Auth pages
const cardStyle: React.CSSProperties = {
  backgroundColor: "#563727",
  border: "1px solid #7A431D",
  borderRadius: "0.5rem",
  padding: "1rem",
  color: "#FFFFFF",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "1rem 1.5rem",
  borderRadius: "0.5rem",
  backgroundColor: "#563727",
  border: "1px solid #7A431D",
  color: "#FFFFFF",
  outline: "none",
};

const buttonPrimary: React.CSSProperties = {
  padding: "0.75rem 1.25rem",
  fontWeight: 600,
  borderRadius: "0.5rem",
  backgroundColor: "#DE9E48",
  color: "#372C2E",
  border: "none",
  cursor: "pointer",
};

const buttonGhost: React.CSSProperties = {
  padding: "0.75rem 1.25rem",
  fontWeight: 600,
  borderRadius: "0.5rem",
  backgroundColor: "transparent",
  color: "#FFFFFF",
  border: "1px solid #7A431D",
  cursor: "pointer",
};

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function loadInitialServices(_bid: number): Promise<Service[]> {
  const res = await fetch(`${API_BASE}/services/`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Failed to load services: ${await res.text()}`);
  return await res.json();
}

async function loadCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE}/services/categories`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to load categories");
  return await res.json();
}

async function loadEmployees(): Promise<Worker[]> {
  const res = await fetch(`${API_BASE}/services/employees`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to load employees");
  return await res.json();
}

const ManageServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [employees, setEmployees] = useState<Worker[]>([]);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([loadInitialServices(), loadCategories(), loadEmployees()])
      .then(([svs, cats, emps]) => {
        setServices(svs);
        setCategories(cats);
        setEmployees(emps);
      })
      .catch((err) => {
        console.error(err);
        setLoadingError(err.message || String(err));
      });
  }, []);


  // Create form (stacked like Sign Up)
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [priceUsd, setPriceUsd] = useState("");
  const [categoryId, setCategoryId] = useState(0);
  const [newCategory, setNewCategory] = useState("");
  const [description, setDescription] = useState("");
  const [workers, setWorkers] = useState<number[]>([]);

  // Edit form (simple toggle per item)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [editPriceUsd, setEditPriceUsd] = useState("");
  const [editCategoryId, setEditCategoryId] = useState(0);
  const [editNewCategory, setEditNewCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editWorkers, setEditWorkers] = useState<number[]>([]);

  const addService = async () => {
    const n = name.trim();
    const d = parseInt(duration, 10);
    const p = parseFloat(priceUsd);
    if (!n || isNaN(d) || isNaN(p)) return alert("Please fill name, duration, price");

    const payload: any = { name: n, duration: d, priceUsd: p, description: description};

    if (categoryId > 0) {
      payload.cat_id = categoryId;
      const cat = categories.find(c => c.id === categoryId);
      if (cat) payload.category = cat.name; // <-- this ensures backend gets the string
    } else if (categoryId === -1 && newCategory.trim()) {
      payload.category = newCategory.trim();
    } else {
      return alert("Please select a category or create a new one");
    }

    payload.workers = workers;

    const res = await fetch(`${API_BASE}/services/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error(await res.text());
      alert("Failed to create service");
      return;
    }
    const newService = await res.json();

    setServices([newService, ...services]);
    setName("");
    setDuration("");
    setPriceUsd("");
    setCategoryId(0);
    setNewCategory("");
    setDescription("");
    setWorkers([]);
    loadCategories().then(setCategories).catch(console.error);
  }

  function startEdit(s: Service) {
    setEditingId(s.id);
    setEditName(s.name);
    setEditDuration(String(s.duration));
    setEditPriceUsd(String(s.priceUsd));
    const existCategory = categories.find((c) => c.name === s.category)
    setEditCategoryId(existCategory ? existCategory.id : 0);
    setEditNewCategory(existCategory ? "" : (s.category ?? ""));
    setEditDescription(s.description ?? "");
    setEditWorkers(s.workers.map((w) => w.eid));
  }

  const saveEdit = async (id: string) => {
    const n = editName.trim();
    const d = parseInt(editDuration, 10);
    const p = parseFloat(editPriceUsd);
    if (!n || isNaN(d) || isNaN(p)) return alert("Please fill name, duration, price");

    const payload: any = { name: n, duration: d, priceUsd: p, description: editDescription };
        if (editCategoryId > 0) {
      payload.cat_id = editCategoryId;
      const cat = categories.find(c => c.id === editCategoryId);
      if (cat) payload.category = cat.name;
    } else if (editCategoryId === -1 && editNewCategory.trim()) {
      payload.category = editNewCategory.trim();
    } else {
      return alert("Please select a category or create a new one");
    }
    payload.workers = editWorkers;

    const res = await fetch(`${API_BASE}/services/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
      console.error(await res.text());
      alert("Failed to update service");
      return;
    }

  setServices(
    services.map((s) =>
      s.id === id ? {
        ...s,
        name: n,
        duration: d,
        priceUsd: p,
        category: (editCategoryId > 0) ? editNewCategory : (categories.find(c=>c.id===editCategoryId)?.name ?? s.category),
        description: editDescription,
        workers: editWorkers.map((eid) => {
                const found = employees.find((e) => e.eid === eid);
                return { eid, name: found ? found.name : String(eid) };
        })
      } : s
    )
    );
    setEditingId(null);
    loadCategories().then(setCategories).catch(console.error);
  }

  const remove = async (id: string) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/services/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (res.ok) setServices(services.filter((s) => s.id !== id));

  }

  const toggleAssignWorker = (eid: number, forEdit = false) => {
    const setter = forEdit ? setEditWorkers : setWorkers;
    const current = forEdit ? editWorkers : workers;
    if (current.includes(eid)) setter(current.filter((x) => x !== eid));
    else setter([...current, eid]);
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Page-only background */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          background: "#372C2E",
          zIndex: -1,
        }}
      />

      <h1
        style={{
          color: "#FFFFFF",
          fontSize: "1.75rem",
          fontWeight: 600,
          marginBottom: "1rem",
        }}
      >
        Manage Services
      </h1>

      {/* Create new service (stacked inputs) */}
      <div style={{ ...cardStyle, marginBottom: "1rem" }}>
        <h2
          style={{ marginTop: 0, marginBottom: "0.75rem", fontSize: "1.1rem" }}
        >
          Add a service
        </h2>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <input
            type="text"
            placeholder="Service name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Duration (minutes)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Price (USD)"
            value={priceUsd}
            onChange={(e) => setPriceUsd(e.target.value)}
            style={inputStyle}
          />
          <div>
            <select value={categoryId as any} onChange={(e)=> {
              const val = e.target.value;
              if (val === "") setCategoryId(0);
              else if (val === "new") setCategoryId(-1);
              else setCategoryId(Number(val));
            }} style={{ ...inputStyle, padding: "0.5rem" }}>
              <option value="">Select Service Category</option>
              <option value="new">Create new category...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {categoryId === -1 && (
              <input placeholder="New category name" value={newCategory} onChange={(e)=>setNewCategory(e.target.value)} style={{...inputStyle, marginTop: "0.5rem"}} />
            )}
          </div>
          <input
            type="text"
            placeholder="Service description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={inputStyle}
          />
          <div>
            <label style={{ display: "block", marginBottom: "0.25rem" }}>Assign workers (multi-select)</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {employees.map(emp => {
                const checked = workers.includes(emp.eid);
                return (
                  <label key={emp.eid} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", cursor: "pointer" }}>
                    <input type="checkbox" checked={checked} onChange={()=>toggleAssignWorker(emp.eid)} />
                    <span style={{ color: "#fff" }}>{emp.name}</span>
                  </label>
                );
              })}
            </div>
          </div>
          <div>
            <button onClick={addService} style={buttonPrimary}>
              Add
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.75rem" }}
      >
        {services.map((s) => (
          <div key={s.id} style={cardStyle}>
            {editingId === s.id ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={inputStyle}
                />
                <input
                  type="number"
                  value={editDuration}
                  onChange={(e) => setEditDuration(e.target.value)}
                  style={inputStyle}
                />
                <input
                  type="number"
                  value={editPriceUsd}
                  onChange={(e) => setEditPriceUsd(e.target.value)}
                  style={inputStyle}
                />
                <div>
                  <select value={editCategoryId as any} onChange={(e)=> {
                    const val = e.target.value;
                    setEditCategoryId(val === "new" ? "new" : Number(val));
                  }} style={{ ...inputStyle, padding: "0.5rem" }}>
                    <option value="new">Create new category...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  {editCategoryId === "new" && (
                    <input placeholder="New category name" value={editNewCategory} onChange={(e)=>setEditNewCategory(e.target.value)} style={{...inputStyle, marginTop: "0.5rem"}} />
                  )}
                </div>
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  style={inputStyle}
                />
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {employees.map(emp => {
                    const checked = editWorkers.includes(emp.eid);
                    return (
                      <label key={emp.eid} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", cursor: "pointer" }}>
                        <input type="checkbox" checked={checked} onChange={()=>toggleAssignWorker(emp.eid, true)} />
                        <span style={{ color: "#fff" }}>{emp.name}</span>
                      </label>
                    );
                  })}
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => saveEdit(s.id)} style={buttonPrimary}>
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    style={buttonGhost}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.35rem",
                }}
              >
                <div style={{ fontWeight: 600 }}>{s.name}{" ("}{s.category}{")"}</div>
                <div>{s.description}</div>
                <div>
                  {s.duration} min • ${s.priceUsd.toFixed(2)}
                </div>
                <div style={{ fontSize: "0.9rem" }}>{"Workers: "}{s.workers.map(w=>w.name).join(", ")}</div>
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginTop: "0.25rem",
                  }}
                >
                  <button onClick={() => startEdit(s)} style={buttonGhost}>
                    Edit
                  </button>
                  <button onClick={() => remove(s.id)} style={buttonGhost}>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {services.length === 0 && (
          <div style={{ ...cardStyle, opacity: 0.9 }}>
            No services yet. Add your first one above.
          </div>
        )}
      </div>

      <style>{`
        input::placeholder { color: rgba(255, 255, 255, 0.5); }
        input:focus { border-color: #DE9E48 !important; }
      `}</style>
    </div>
  );
};

export default ManageServices;
