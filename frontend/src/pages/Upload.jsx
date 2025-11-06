import React, { useState, useEffect } from "react";
import NavBar from "../components/NavHome";
import UploadLeft from "../components/com_uploading/UploadLeft";
import UploadRight from "../components/com_uploading/UploadRight";
import { useToast } from '../context/ToastContext';

export default function Upload() {
  const toast = useToast();
  const [billDate, setBillDate] = useState("");
  const [shopName, setShopName] = useState("");
  const [rows, setRows] = useState([]);
  const [extractedText, setExtractedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

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
    // Clear save message when user starts editing
    if (saveMessage) setSaveMessage("");
  };

  // Calculate total
  const getTotal = () => rows.reduce((acc, row) => acc + (parseFloat(row.price) || 0), 0);

  // Validation: Check if at least one row is properly filled
  const isValidForSave = () => {
    return rows.some(row => 
      row.category.trim() && 
      row.product.trim() && 
      row.price && 
      !isNaN(parseFloat(row.price)) && 
      parseFloat(row.price) > 0
    );
  };

  // Get user ID from localStorage (assuming it's stored after login)
  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || user.user_id || 1; // Fallback to 1 for testing
  };

  // Save expenses to backend
  const handleSave = async () => {
    if (!isValidForSave()) {
      setSaveMessage("Please fill at least one complete row (category, product, and price)");
      return;
    }

    if (!billDate) {
      setSaveMessage("Please select a bill date");
      return;
    }

    setIsLoading(true);
    setSaveMessage("");

    try {
      const user_id = getUserId();
      const token = localStorage.getItem('token');

      // Filter out empty rows
      const validRows = rows.filter(row => 
        row.category.trim() && 
        row.product.trim() && 
        row.price && 
        !isNaN(parseFloat(row.price)) && 
        parseFloat(row.price) > 0
      );

      // Save each row as a separate expense
      const savePromises = validRows.map(async (row) => {
        const expenseData = {
          user_id: user_id,
          bill_date: billDate,
          created_at: billDate, // Use bill_date as created_at for accurate daily summaries
          shop_name: shopName || null,
          category_name: row.category,
          product_name: row.product,
          price: parseFloat(row.price)
        };

        console.log('📤 Sending expense with created_at:', {
          bill_date: billDate,
          created_at: billDate,
          category: row.category,
          product: row.product
        });

        const response = await fetch('http://localhost:5000/api/expenses/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(expenseData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to save expense');
        }

        return response.json();
      });

      await Promise.all(savePromises);
      
      // Show in-app toast notification
      toast.show(`Successfully saved ${validRows.length} expense(s)!`, 'success');

      // Clear image preview by dispatching event to UploadLeft
      window.dispatchEvent(new Event('budgetbee:clearImage'));
      
      // Reset form after successful save
      setTimeout(() => {
        setRows([{ category: "", product: "", price: "" }]);
        setBillDate("");
        setShopName("");
        setExtractedText("");
        setSaveMessage("");
      }, 1500);

    } catch (error) {
      console.error('Error saving expenses:', error);
      toast.show(`Error: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OCR results
  const handleOCRResults = (billInfo, rawText) => {
    setExtractedText(rawText);

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

    // Populate items (all prices are in LKR)
    if (billInfo.items && billInfo.items.length > 0) {
      const formattedRows = billInfo.items.map((item) => ({
        category: item.category || "Other",
        product: item.product || "",
        price: item.price ? String(item.price) : "",
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
            onSave={handleSave}
            isValidForSave={isValidForSave}
            isLoading={isLoading}
            saveMessage={saveMessage}
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

        {/* Save Status Message */}
        {saveMessage && (
          <div className={`mt-4 p-4 rounded-xl w-full max-w-6xl text-center font-semibold ${
            saveMessage.includes('Error') || saveMessage.includes('Please') 
              ? 'bg-red-600/20 border border-red-400/30 text-red-300' 
              : 'bg-green-600/20 border border-green-400/30 text-green-300'
          }`}>
            {saveMessage}
          </div>
        )}
      </div>
    </div>
  );
}
