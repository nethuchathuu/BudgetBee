import React, { useState } from "react";
import NavBar from "../components/NavHome";
import UploadLeft from "../components/com_uploading/UploadLeft";
import UploadRight from "../components/com_uploading/UploadRight";

export default function Upload() {
  const [billDate, setBillDate] = useState("");
  const [shopName, setShopName] = useState("");
  const [rows, setRows] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#0c111c] text-white">
      <NavBar />
      <div className="flex justify-center items-start p-8">
        <div className="flex bg-[#1a1f2c] rounded-2xl shadow-xl border border-emerald-400/20 w-full max-w-6xl h-[480px] overflow-hidden">
          <UploadLeft onProcess={() => setShowDetails(true)} />
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
      </div>
    </div>
  );
}
