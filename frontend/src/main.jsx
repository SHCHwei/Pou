import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import BomEstimate from "./BomEstimate.jsx";
import MaterialEditor from "./MaterialEditor.jsx";
import PartList from "./PartList.jsx";
import "./app.css";

const PARTS_API_URL = "http://localhost:8000/pou/Parts/list";

function App() {
  const [parts, setParts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState(null);
  const selectedPart = parts.find((part) => part.id === selectedId);

  useEffect(() => {
    const controller = new AbortController();

    async function loadParts() {
      try {
        const response = await fetch(PARTS_API_URL, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = await response.json();
        // 後端欄位對應到元件使用的 price / detail
        const products = result.data.product.map((product) => ({
          ...product,
          detail: product.categoryName,
          price: product.basePrice,
          editStatus: true,
        }));
        setParts(products);
        setSelectedId(products[0]?.id ?? null);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      }
    }

    loadParts();
    return () => controller.abort();
  }, []);

  function updatePart(id, changes) {
    setParts((currentParts) =>
      currentParts.map((part) =>
        part.id === id ? { ...part, ...changes } : part,
      ),
    );
  }

  function updateSelectedPart(changes) {
    updatePart(selectedId, changes);
  }

  return (
    <main className="workspace">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="POU 工作台首頁">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>
          <span>POU</span>
        </a>
        <div className="topbar-divider" />
        <div className="project-context">
          <span className="eyebrow">產品配置</span>
          <span className="project-name">機殼零件成本估算</span>
        </div>
        <div className="save-state">
          <span className="status-dot" />
          {error ? `資料載入失敗：${error}` : "所有變更已儲存"}
        </div>
      </header>

      <section className="work-area" id="top">
        <div className="page-heading">
          <div>
            <p className="section-kicker">成本規劃 <span>/</span> 新估價</p>
            <h1>零件配置</h1>
          </div>
          <div className="part-count"><span>{parts.length.toString().padStart(2, "0")}</span> 個配置零件</div>
        </div>

        <div className="workspace-grid">
          <PartList
            parts={parts}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          <div className="right-column">
            <MaterialEditor part={selectedPart} onChange={updateSelectedPart} onUpdate={updatePart} />
            <BomEstimate parts={parts} />
          </div>
        </div>
        <footer className="workspace-footer">
          <span>POU · 製造成本規劃</span>
          <span>估價依目前配置即時更新</span>
        </footer>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
