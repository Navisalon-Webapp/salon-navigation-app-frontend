import React, { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface ReportItem {
  id: string;
  label: string;
  ref: React.RefObject<HTMLDivElement>;
}

interface Props {
  items: ReportItem[];
  onClose: () => void;
}

const ReportModal: React.FC<Props> = ({ items, onClose }) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const generatePDF = async () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      let y = 10;

      for (const item of items) {
        if (!selected.includes(item.id) || !item.ref.current) continue;

        const canvas = await html2canvas(item.ref.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#372C2E",
        });

        const imgData = canvas.toDataURL("image/png");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = 190;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        if (y + pdfHeight > 280) {
          pdf.addPage();
          y = 10;
        }

        pdf.addImage(imgData, "PNG", 10, y, pdfWidth, pdfHeight);
        y += pdfHeight + 8;
      }

      pdf.save("admin-report.pdf");
      onClose();
    } catch (err) {
      console.error("Failed to generate PDF", err);
      onClose();
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        top: "calc(100% + 10px)",
        right: 0,
        width: 300,
        background: "#563727",
        borderRadius: 12,
        padding: "12px",
        zIndex: 2000,
        boxShadow: "0 10px 25px rgba(0,0,0,.3)",
        color: "#fff",
      }}
    >
      <h4 style={{ margin: "0 0 8px 0" }}>Select Metrics for Report</h4>

      <div style={{ maxHeight: 260, overflowY: "auto", display: "grid", gap: 8 }}>
        {items.map((item) => (
          <label key={item.id} style={{ display: "flex", gap: 8 }}>
            <input
              type="checkbox"
              checked={selected.includes(item.id)}
              onChange={() => toggle(item.id)}
            />
            <span style={{ fontSize: 14 }}>{item.label}</span>
          </label>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
        <button onClick={generatePDF}>Generate</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ReportModal;
