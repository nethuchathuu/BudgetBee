import React, { useState, useEffect } from "react";
import NavBar from "../components/NavHome";
import UploadLeft from "../components/com_uploading/UploadLeft";
import UploadRight from "../components/com_uploading/UploadRight";

export default function Upload() {
  const [billDate, setBillDate] = useState("");
  const [shopName, setShopName] = useState("");
  const [rows, setRows] = useState([]);
  const [extractedText, setExtractedText] = useState("");
  const [currency, setCurrency] = useState("$"); // Default currency symbol

  // ✅ Ensure at least one empty row is there at the beginning
  useEffect(() => {
    if (rows.length === 0) {
      setRows([{ category: "", product: "", price: "" }]);
    }
  }, []);

  // Add new row
  const addRow = () => setRows([...rows, { category: "", product: "", price: "" }]);

  // Handle row change
  const handleRowChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  // Calculate total
  const getTotal = () => rows.reduce((acc, row) => acc + (parseFloat(row.price) || 0), 0);

  // Handle OCR results
  const handleOCRResults = (billInfo, rawText) => {
    setExtractedText(rawText);

    // Set currency from detected bill info
    if (billInfo.currencySymbol) {
      setCurrency(billInfo.currencySymbol);
    } else {
      setCurrency("$"); // Default fallback
    }

    // Populate shop name
    if (billInfo.shopName) {
      setShopName(billInfo.shopName);
    }

    // Populate date
    if (billInfo.date) {
      try {
        let parsedDate = new Date(billInfo.date);
        if (isNaN(parsedDate)) {
          const dateParts = billInfo.date.split(/[-\/]/);
          if (dateParts.length === 3) {
            parsedDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
          }
        }
        if (!isNaN(parsedDate)) {
          const formattedDate = parsedDate.toISOString().split("T")[0];
          setBillDate(formattedDate);
        }
      } catch (error) {
        console.log("Could not parse date:", billInfo.date);
      }
    }

    // Populate items
    if (billInfo.items && billInfo.items.length > 0) {
      const formattedRows = billInfo.items.map((item) => ({
        category: item.category || "Other",
        product: item.product || "",
        price: item.price ? item.price.toString() : "",
      }));
      setRows(formattedRows);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c111c] text-white">
      <NavBar />
      <div className="flex flex-col justify-center items-center p-8">
        <div className="flex bg-[#1a1f2c] rounded-2xl shadow-xl border border-emerald-400/20 w-full max-w-6xl min-h-[500px]">
          <UploadLeft onProcess={handleOCRResults} />
          <UploadRight
            showDetails={true}   // ✅ Always true → show immediately
            billDate={billDate}
            setBillDate={setBillDate}
            shopName={shopName}
            setShopName={setShopName}
            rows={rows}
            handleRowChange={handleRowChange}
            addRow={addRow}
            getTotal={getTotal}
            currency={currency}
          />
        </div>

        {/* Debug section */}
        {extractedText && (
          <div className="mt-6 p-4 bg-[#1a1f2c] rounded-xl border border-emerald-400/20 w-full max-w-6xl">
            <h3 className="text-emerald-400 font-semibold mb-2">Extracted Text (Debug):</h3>
            <pre className="text-gray-300 text-sm bg-[#0c111c] p-3 rounded overflow-auto max-h-60">
              {extractedText}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
