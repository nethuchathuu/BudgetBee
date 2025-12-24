import React from "react";
import { Plus } from "lucide-react";

export default function UploadRight({
  showDetails,
  billDate,
  setBillDate,
  shopName,
  setShopName,
  rows,
  handleRowChange,
  addRow,
  getTotal,
  currency = "$", // Default currency symbol
}) {
  return (
    <div className="w-1/2 p-6 flex flex-col">
      {showDetails ? (
        <div className="flex flex-col">
          {/* Fixed header section */}
          <div className="mb-4">
            {/* Date */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-1">Date</label>
              <input
                type="date"
                value={billDate}
                onChange={(e) => setBillDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0c111c] border border-emerald-400/30 focus:border-emerald-400 outline-none"
              />
            </div>

            {/* Shop Name */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-1">Shop Name</label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="Enter shop name"
                className="w-full px-3 py-2 rounded-lg bg-[#0c111c] border border-emerald-400/30 focus:border-emerald-400 outline-none"
              />
            </div>

            <h2 className="text-lg font-semibold mb-2 text-emerald-400">
              Auto Categorization
            </h2>
          </div>

          {/* Table section with max height and scroll */}
          <div className="mb-4">
            <div className="max-h-80 overflow-y-auto border border-emerald-400/30 rounded-lg">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-[#1a1f2c] sticky top-0">
                  <tr>
                    <th className="border-b border-emerald-400/30 px-3 py-2 text-left">Category</th>
                    <th className="border-b border-emerald-400/30 px-3 py-2 text-left">Product</th>
                    <th className="border-b border-emerald-400/30 px-3 py-2 text-left">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-[#0c111c]/30' : ''}>
                      <td className="border-b border-emerald-400/20 px-3 py-2">
                        <input
                          type="text"
                          value={row.category}
                          onChange={(e) => handleRowChange(i, "category", e.target.value)}
                          placeholder="e.g., Food"
                          className="w-full bg-transparent outline-none text-white"
                        />
                      </td>
                      <td className="border-b border-emerald-400/20 px-3 py-2">
                        <input
                          type="text"
                          value={row.product}
                          onChange={(e) => handleRowChange(i, "product", e.target.value)}
                          placeholder="e.g., Pizza"
                          className="w-full bg-transparent outline-none text-white"
                        />
                      </td>
                      <td className="border-b border-emerald-400/20 px-3 py-2">
                        <input
                          type="number"
                          value={row.price}
                          onChange={(e) => handleRowChange(i, "price", e.target.value)}
                          placeholder="0"
                          className="w-full bg-transparent outline-none text-white"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fixed footer section */}
          <div>
            {/* Add row button */}
            <button
              onClick={addRow}
              className="mb-3 flex items-center space-x-2 bg-emerald-400 text-[#0c111c] px-4 py-2 rounded-xl shadow hover:bg-emerald-500 transition"
            >
              <Plus className="h-5 w-5" />
              <span>Add Row</span>
            </button>

            {/* Total */}
            <div className="text-right font-semibold text-emerald-400">
              Total: {currency}{getTotal()}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-400 text-center">
            Upload and process a bill to see details here.
          </p>
        </div>
      )}
    </div>
  );
}
