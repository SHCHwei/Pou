import { useEffect, useRef, useState } from "react";

const OVERSCAN = 6;

function PartList({ parts, selectedId, onSelect }) {
  const listRef = useRef(null);
  const [startRow, setStartRow] = useState(0);
  const [layout, setLayout] = useState({ columnCount: 1, rowHeight: 66, rowGap: 8, visibleRows: 18 });
  const totalRows = Math.ceil(parts.length / layout.columnCount);
  const visibleRows = Math.min(totalRows, layout.visibleRows);
  const renderStartRow = Math.min(startRow, Math.max(0, totalRows - visibleRows));
  const renderEndRow = Math.min(totalRows, renderStartRow + visibleRows);
  const startIndex = renderStartRow * layout.columnCount;
  const endIndex = Math.min(parts.length, renderEndRow * layout.columnCount);
  const visibleParts = parts.slice(startIndex, endIndex);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    function updateLayout() {
      const styles = window.getComputedStyle(list);
      const columnCount = styles.gridTemplateColumns.split(/\s+/).filter(Boolean).length || 1;
      const rowHeight = Number.parseFloat(styles.gridAutoRows) || 66;
      const rowGap = Number.parseFloat(styles.rowGap) || 0;
      const padding = Number.parseFloat(styles.paddingTop) + Number.parseFloat(styles.paddingBottom);
      const viewportRows = Math.ceil((list.clientHeight - padding) / (rowHeight + rowGap));
      const visibleRows = viewportRows + OVERSCAN * 2 + 1;

      setLayout((current) =>
        current.columnCount === columnCount &&
        current.rowHeight === rowHeight &&
        current.rowGap === rowGap &&
        current.visibleRows === visibleRows
          ? current
          : { columnCount, rowHeight, rowGap, visibleRows },
      );
    }

    updateLayout();
    const observer = new ResizeObserver(updateLayout);
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setStartRow((currentRow) => Math.min(currentRow, Math.max(0, totalRows - visibleRows)));
  }, [totalRows, visibleRows]);

  function handleScroll(event) {
    const rowStride = layout.rowHeight + layout.rowGap;
    const firstVisibleRow = Math.floor(event.currentTarget.scrollTop / rowStride);
    const nextStartRow = Math.max(0, firstVisibleRow - OVERSCAN);
    setStartRow((currentRow) => currentRow === nextStartRow ? currentRow : nextStartRow);
  }

  return (
    <section className="panel part-panel" aria-labelledby="part-list-title">
      <div className="panel-heading">
        <div className="title-with-icon">
          <span className="line-icon parts-icon" aria-hidden="true"><i /><i /><i /></span>
          <h2 id="part-list-title">模型零件清單</h2>
        </div>
        <span className="quiet-count">{parts.length} 項</span>
      </div>
      <div className="part-items" ref={listRef} role="radiogroup" aria-label="選擇要編輯的零件" onScroll={handleScroll}>
        {renderStartRow > 0 && <div className="part-virtual-spacer" aria-hidden="true" style={{ gridRow: `span ${renderStartRow}` }} />}
        {visibleParts.map((part, offset) => {
          const index = startIndex + offset;
          const selected = part.id === selectedId;
          return (
            <button
              className={`part-item${selected ? " is-selected" : ""}`}
              key={part.id}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-posinset={index + 1}
              aria-setsize={parts.length}
              onClick={() => onSelect(part.id)}
            >
              <span className="part-index">{String(index + 1).padStart(2, "0")}</span>
              <span className="part-copy">
                <span className="part-name">{part.name}</span>
                <span className="part-detail">{part.detail}</span>
              </span>
              <span className="part-cost">${Math.round(part.price * part.multiplier).toLocaleString("en-US")}</span>
              <span className="selection-indicator" style={{ "--part-color": part.color }} aria-hidden="true" />
            </button>
          );
        })}
        {renderEndRow < totalRows && <div className="part-virtual-spacer" aria-hidden="true" style={{ gridRow: `span ${totalRows - renderEndRow}` }} />}
      </div>
      <div className="panel-footnote">
        <span className="footnote-mark" aria-hidden="true">↳</span>
        選取零件以編輯材質與成本
      </div>
    </section>
  );
}

export default PartList;