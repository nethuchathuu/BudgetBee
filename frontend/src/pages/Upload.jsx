import React, { useState } from "react";
import NavBar from "../components/NavHome";
import UploadLeft from "../components/com_uploading/UploadLeft";
import UploadRight from "../components/com_uploading/UploadRight";

export default function Upload() {
  const [billDate, setBillDate] = useState("");
  const [shopName, setShopName] = useState("");
  const [rows, setRows] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [extractedText, setExtractedText] = useState("");

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
    
    // Populate shop name
    if (billInfo.shopName) {
      setShopName(billInfo.shopName);
    }
    
    // Populate date (convert to YYYY-MM-DD format for date input)
    if (billInfo.date) {
      try {
        // Try to parse different date formats
        let parsedDate = new Date(billInfo.date);
        if (isNaN(parsedDate)) {
          // Try different parsing for DD/MM/YYYY or DD-MM-YYYY
          const dateParts = billInfo.date.split(/[-\/]/);
          if (dateParts.length === 3) {
            parsedDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
          }
        }
        
        if (!isNaN(parsedDate)) {
          const formattedDate = parsedDate.toISOString().split('T')[0];
          setBillDate(formattedDate);
        }
      } catch (error) {
        console.log('Could not parse date:', billInfo.date);
      }
    }
    
    // Populate items
    if (billInfo.items && billInfo.items.length > 0) {
      const formattedRows = billInfo.items.map(item => ({
        category: item.category || 'Other',
        product: item.product || '',
        price: item.price ? item.price.toString() : ''
      }));
      setRows(formattedRows);
    } else {
      // If no items detected, add one empty row
      setRows([{ category: "", product: "", price: "" }]);
    }
    
    setShowDetails(true);
  };

  return (
    <div className="min-h-screen bg-[#0c111c] text-white">
      <NavBar />
      <div className="flex flex-col justify-center items-center p-8">
        <div className="flex bg-[#1a1f2c] rounded-2xl shadow-xl border border-emerald-400/20 w-full max-w-6xl min-h-[500px]">
          <UploadLeft onProcess={handleOCRResults} />
          <UploadRight
            showDetails={showDetails}
            billDate={billDate}
            setBillDate={setBillDate}
            shopName={shopName}
            setShopName={setShopName}
            rows={rows}
            handleRowChange={handleRowChange}
            addRow={addRow}
            getTotal={getTotal}
          />
        </div>
        
        {/* Debug section for extracted text (optional) */}
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
