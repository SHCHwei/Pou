import { useEffect, useRef, useState } from "react";

const PARTS_API_URL = "http://localhost:8000/pou/Parts";

function MaterialEditor({ part, onChange, onUpdate }) {
  const partId = part?.id;
  const color = part?.color;
  const price = part?.price;
  const multiplier = part?.multiplier;
  // 記錄最後一次與後端同步的值，切換零件時重設基準，避免誤送
  const syncedRef = useRef(null);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    if (partId === undefined) return;
    const synced = syncedRef.current;
    if (!synced || synced.id !== partId) {
      syncedRef.current = { id: partId, color, price, multiplier };
      return;
    }
    if (synced.color === color && synced.price === price && synced.multiplier === multiplier) return;
    if (!/^#[0-9a-fA-F]{6}$/.test(color)) return;

    const restore = { color: synced.color, price: synced.price, multiplier: synced.multiplier };
    const partName = part.name;
    const timer = setTimeout(async () => {

      
      // 請求送出後不隨切換零件中止，editStatus 才能確實還原
      onUpdate(partId, { editStatus: false });


      try {


        const response = await fetch(`${PARTS_API_URL}/${encodeURIComponent(partId)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ color, basePrice: price, multiplier }),
        });



        if (!response.ok) throw new Error(`HTTP ${response.status}`);


        if (syncedRef.current?.id === partId) {
          syncedRef.current = { id: partId, color, price, multiplier };
        }


      } catch (err) {
        console.error("更新零件失敗", err);
        setSaveError({ message: err.message, id: partId, name: partName, restore });
      } finally {
        onUpdate(partId, { editStatus: true });
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [partId, color, price, multiplier]);

  useEffect(() => {
    if (!saveError) return;
    const onKeyDown = (event) => event.key === "Escape" && dismissError();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  // 還原為最後一次成功同步的值；值與基準相同，不會再觸發寫入
  function dismissError() {
    onUpdate(saveError.id, saveError.restore);
    setSaveError(null);
  }

  if (!part) return null;

  // editStatus 為 false 代表該零件正在更新中，禁止編輯
  const locked = part.editStatus === false;

  return (
    <section className={`panel editor-panel${locked ? " is-locked" : ""}`} aria-labelledby="material-editor-title" aria-busy={locked}>
      <div className="panel-heading editor-heading">
        <div>
          <p className="section-kicker">目前編輯</p>
          <h2 id="material-editor-title">材質與屬性編輯器</h2>
        </div>
        <span className="editing-part"><span style={{ backgroundColor: part.color }} />{part.name}</span>
      </div>
      {locked && <p className="locked-notice" role="status">此零件正在更新中，暫時無法編輯</p>}
      <div className="editor-fields">
        <label className="field-group">
          <span className="field-label">材質色彩 <span>(Albedo Color)</span></span>
          <span className="color-input-wrap">
            <input
              className="color-picker"
              type="color"
              value={part.color}
              aria-label="選擇材質色彩"
              disabled={locked}
              onChange={(event) => onChange({ color: event.target.value })}
            />
            <input
              className="hex-input"
              type="text"
              value={part.color}
              aria-label="材質色碼"
              disabled={locked}
              maxLength={7}
              spellCheck="false"
              onChange={(event) => {
                const value = event.target.value;
                if (/^#[0-9a-fA-F]{0,6}$/.test(value)) onChange({ color: value });
              }}
              onBlur={() => {
                if (!/^#[0-9a-fA-F]{6}$/.test(part.color)) onChange({ color: "#8c92ac" });
              }}
            />
            <span className="field-end-icon" aria-hidden="true">⌄</span>
          </span>
        </label>

        <label className="field-group">
          <span className="field-label">基礎單價 <span>(Base Price)</span></span>
          <span className="number-input-wrap">
            <span className="currency-prefix">$</span>
            <input
              className="number-input"
              type="number"
              min="0"
              step="50"
              value={part.price}
              aria-label="基礎單價"
              disabled={locked}
              onChange={(event) => onChange({ price: Math.max(0, Number(event.target.value)) })}
            />
            <span className="field-suffix">TWD</span>
          </span>
        </label>
      </div>

      <div className="multiplier-control">
        <div className="slider-heading">
          <label htmlFor="material-multiplier">材質複雜度加成 <span>(Multiplier)</span></label>
          <output htmlFor="material-multiplier">{Number(part.multiplier).toFixed(1)}<small>×</small></output>
        </div>
        <input
          id="material-multiplier"
          className="range-input"
          type="range"
          min="1"
          max="5"
          step="0.1"
          value={part.multiplier}
          disabled={locked}
          style={{ "--range-progress": `${((part.multiplier - 1) / 4) * 100}%` }}
          onChange={(event) => onChange({ multiplier: Number(event.target.value) })}
        />
        <div className="range-labels"><span>基礎（1.0×）</span><span>極高（5.0×）</span></div>
      </div>

      {saveError && (
        <div className="modal-backdrop" onClick={dismissError}>
          <div
            className="modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="save-error-title"
            aria-describedby="save-error-desc"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="save-error-title">資料庫更新失敗</h3>
            <p id="save-error-desc">
              「{saveError.name}」的修改尚未儲存至資料庫，目前畫面上的數值可能與資料庫不一致。請稍後再試。
              <small>錯誤原因：{saveError.message}</small>
            </p>
            <button type="button" className="modal-button" autoFocus onClick={dismissError}>我知道了</button>
          </div>
        </div>
      )}
    </section>
  );
}

export default MaterialEditor;