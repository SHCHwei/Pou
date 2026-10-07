import { useEffect, useMemo, useState } from "react";

const ROW_HEIGHT = 38;
const HEADER_HEIGHT = 34;
const VIEWPORT_HEIGHT = 320;
const OVERSCAN = 6;

function BomEstimate({ parts }) {
  const [startIndex, setStartIndex] = useState(0);
  const total = useMemo(
    () => parts.reduce((sum, part) => sum + part.price * part.multiplier, 0),
    [parts],
  );
  const visibleCount = Math.ceil((VIEWPORT_HEIGHT - HEADER_HEIGHT) / ROW_HEIGHT) + OVERSCAN * 2;
  const renderStartIndex = Math.min(startIndex, Math.max(0, parts.length - visibleCount));
  const endIndex = Math.min(parts.length, renderStartIndex + visibleCount);
  const visibleParts = parts.slice(renderStartIndex, endIndex);
  const topSpacerHeight = renderStartIndex * ROW_HEIGHT;
  const bottomSpacerHeight = (parts.length - endIndex) * ROW_HEIGHT;

  useEffect(() => {
    setStartIndex((currentIndex) => Math.min(currentIndex, Math.max(0, parts.length - visibleCount)));
  }, [parts.length, visibleCount]);

  function handleScroll(event) {
    const firstVisibleIndex = Math.max(
      0,
      Math.floor(Math.max(0, event.currentTarget.scrollTop - HEADER_HEIGHT) / ROW_HEIGHT),
    );
    const nextStartIndex = Math.max(0, firstVisibleIndex - OVERSCAN);
    setStartIndex((currentIndex) => currentIndex === nextStartIndex ? currentIndex : nextStartIndex);
  }

  return (
    <section className="panel bom-panel" aria-labelledby="bom-title">
      <div className="panel-heading bom-heading">
        <div className="title-with-icon">
          <span className="line-icon bom-icon" aria-hidden="true"><i /><i /></span>
          <h2 id="bom-title">BOM 物料清單預估</h2>
        </div>
        <span className="quiet-count">總計 {parts.length} 項</span>
      </div>

      <div className="bom-table-wrap" onScroll={handleScroll}>
        <table className="bom-table" aria-rowcount={parts.length + 1}>
          <colgroup>
            <col style={{ width: "34%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "28%" }} />
            <col style={{ width: "20%" }} />
          </colgroup>
          <thead>
            <tr aria-rowindex={1}>
              <th scope="col">零件名稱</th>
              <th scope="col">材質預覽</th>
              <th scope="col" className="numeric-cell">單價 × 加成</th>
              <th scope="col" className="numeric-cell">小計</th>
            </tr>
          </thead>
          <tbody>
            {topSpacerHeight > 0 && <tr className="bom-virtual-spacer" aria-hidden="true"><td colSpan="4" style={{ height: topSpacerHeight }} /></tr>}
            {visibleParts.map((part, index) => (
              <tr key={part.id} aria-rowindex={renderStartIndex + index + 2}>
                <th scope="row" title={part.name}>{part.name}</th>
                <td title={part.color}><span className="material-swatch" style={{ backgroundColor: part.color }} />{part.color}</td>
                <td className="numeric-cell" title={`$${part.price.toLocaleString("en-US")} × ${Number(part.multiplier).toFixed(1)}`}>${part.price.toLocaleString("en-US")} × {Number(part.multiplier).toFixed(1)}</td>
                <td className="numeric-cell subtotal" title={`$${Math.round(part.price * part.multiplier).toLocaleString("en-US")}`}>${Math.round(part.price * part.multiplier).toLocaleString("en-US")}</td>
              </tr>
            ))}
            {bottomSpacerHeight > 0 && <tr className="bom-virtual-spacer" aria-hidden="true"><td colSpan="4" style={{ height: bottomSpacerHeight }} /></tr>}
          </tbody>
        </table>
      </div>

      <div className="estimate-total">
        <span className="total-caption">專案總估價 <small>TWD</small></span>
        <strong>${Math.round(total).toLocaleString("en-US")}</strong>
      </div>
    </section>
  );
}

export default BomEstimate;