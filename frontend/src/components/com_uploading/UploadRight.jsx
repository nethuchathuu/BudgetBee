import React from "react";
import { Plus, Trash } from "lucide-react";
import { useTheme } from '../../context/ThemeContext';

// Standardized categories matching the backend categorization system
const STANDARD_CATEGORIES = [
  "Vegetables",
  "Fruits", 
  "Meat, Fish & Eggs",
  "Dairy & Alternatives",
  "Spices & Seasonings",
  "Food Essentials",
  "Grocery Essentials",
  "Beverages",
  "Cooked Food",
  "Cleaning Items",
  "Baby Products",
  "Cosmetics, Beauty & Personal Care",
  "Electronics & Appliances",
  "Clothing & Footwear",
  "Fashion",
  "Stationery & Books",
  "Pharmacy / Medical",
  "Furniture & Home Needs",
  "Household Items",
  "Bakery",
  "Snacks & Confectionery",
  "Ice Cream & Frozen Foods",
  "Automotive",
  "Sports & Outdoors",
  "Garden & Outdoor",
  "Pet Care",
  "Seasonal & Holiday",
  "Others / Miscellaneous"
];

export default function UploadRight({
  showDetails,
  billDate,
  setBillDate,
  shopName,
  setShopName,
  rows,
  handleRowChange,
  handleDeleteRow,
  addRow,
  getTotal,
  onSave,
  isValidForSave,
  isLoading,
  saveMessage,
}) {
  const { theme } = useTheme();
  
  return (
    <div className="w-1/2 p-6 flex flex-col">
      {showDetails ? (
        <div className="flex flex-col">
          {/* Fixed header section */}
          <div className="mb-4">
            {/* Date */}
            <div className="mb-4">
              <label className={`block mb-1 ${
                theme === 'dark' ? 'text-[#CBD5E1]' : 'text-[#475569]'
              }`}>Date</label>
              <input
                type="date"
                value={billDate}
                onChange={(e) => setBillDate(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border outline-none transition ${
                  theme === 'dark'
                    ? 'bg-[#0F172A] text-[#F1F5F9] border-[#475569] focus:border-emerald-400'
                    : 'bg-white text-[#0F172A] border-[#CBD5E1] focus:border-[#059669]'
                }`}
              />
            </div>

            {/* Shop Name */}
            <div className="mb-4">
              <label className={`block mb-1 ${
                theme === 'dark' ? 'text-[#CBD5E1]' : 'text-[#475569]'
              }`}>Shop Name</label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="Enter shop name"
                className={`w-full px-3 py-2 rounded-lg border outline-none transition ${
                  theme === 'dark'
                    ? 'bg-[#0F172A] text-[#F1F5F9] border-[#475569] focus:border-emerald-400 placeholder-gray-500'
                    : 'bg-white text-[#0F172A] border-[#CBD5E1] focus:border-[#059669] placeholder-gray-400'
                }`}
              />
            </div>

            <h2 className={`text-lg font-semibold mb-2 ${
              theme === 'dark' ? 'text-emerald-400' : 'text-[#059669]'
            }`}>
              Auto Categorization
            </h2>
          </div>

          {/* Table section with max height and scroll */}
          <div className="mb-4">
            <div className={`max-h-80 overflow-y-auto border rounded-lg ${
              theme === 'dark' ? 'border-[#334155]' : 'border-[#E2E8F0]'
            }`}>
              <table className="w-full border-collapse text-sm">
                <thead className={`sticky top-0 ${
                  theme === 'dark' ? 'bg-[#1E293B]' : 'bg-gray-50'
                }`}>
                  <tr>
                    <th className={`border-b px-3 py-2 text-left ${
                      theme === 'dark'
                        ? 'border-[#334155] text-[#F8FAFC]'
                        : 'border-[#E2E8F0] text-[#0F172A]'
                    }`}>Category</th>
                    <th className={`border-b px-3 py-2 text-left ${
                      theme === 'dark'
                        ? 'border-[#334155] text-[#F8FAFC]'
                        : 'border-[#E2E8F0] text-[#0F172A]'
                    }`}>Product</th>
                    <th className={`border-b px-3 py-2 text-left ${
                      theme === 'dark'
                        ? 'border-[#334155] text-[#F8FAFC]'
                        : 'border-[#E2E8F0] text-[#0F172A]'
                    }`}>Price</th>
                    <th className={`border-b px-3 py-2 text-center ${
                      theme === 'dark'
                        ? 'border-[#334155] text-[#F8FAFC]'
                        : 'border-[#E2E8F0] text-[#0F172A]'
                    }`}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? (theme === 'dark' ? 'bg-[#0F172A]/30' : 'bg-gray-50/50') : ''}>
                      <td className={`border-b px-3 py-2 ${
                        theme === 'dark' ? 'border-[#334155]' : 'border-[#E2E8F0]'
                      }`}>
                        <select
                          value={row.category}
                          onChange={(e) => handleRowChange(i, "category", e.target.value)}
                          className={`w-full border rounded px-2 py-1 outline-none transition ${
                            theme === 'dark'
                              ? 'bg-[#0F172A] text-white border-[#475569] focus:border-emerald-400'
                              : 'bg-white text-[#0F172A] border-[#CBD5E1] focus:border-[#059669]'
                          }`}
                        >
                          {!row.category && <option value="">Select category...</option>}
                          {STANDARD_CATEGORIES.map((category) => (
                            <option key={category} value={category} className={theme === 'dark' ? 'bg-[#0F172A]' : 'bg-white'}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className={`border-b px-3 py-2 ${
                        theme === 'dark' ? 'border-[#334155]' : 'border-[#E2E8F0]'
                      }`}>
                        <input
                          type="text"
                          value={row.product}
                          onChange={(e) => handleRowChange(i, "product", e.target.value)}
                          placeholder="e.g., Pizza"
                          className={`w-full outline-none ${
                            theme === 'dark' ? 'bg-transparent text-white placeholder-gray-500' : 'bg-transparent text-[#0F172A] placeholder-gray-400'
                          }`}
                        />
                      </td>
                      <td className={`border-b px-3 py-2 ${
                        theme === 'dark' ? 'border-[#334155]' : 'border-[#E2E8F0]'
                      }`}>
                        <input
                          type="number"
                          value={row.price}
                          onChange={(e) => handleRowChange(i, "price", e.target.value)}
                          placeholder="0"
                          className={`w-full outline-none ${
                            theme === 'dark' ? 'bg-transparent text-white placeholder-gray-500' : 'bg-transparent text-[#0F172A] placeholder-gray-400'
                          }`}
                        />
                      </td>
                      <td className={`border-b px-3 py-2 text-center ${
                        theme === 'dark' ? 'border-[#334155]' : 'border-[#E2E8F0]'
                      }`}>
                        <button
                          onClick={() => handleDeleteRow(i)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete row"
                        >
                          <Trash size={18} />
                        </button>
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
              className={`mb-3 flex items-center space-x-2 px-4 py-2 rounded-xl transition ${
                theme === 'dark'
                  ? 'bg-[#1a1f2c] text-white border border-emerald-400/20 hover:bg-[#0f141f] shadow-[0_1px_3px_rgba(0,0,0,0.4)]'
                  : 'bg-[#059669] text-white hover:bg-[#047857] shadow-[0_1px_3px_rgba(0,0,0,0.15)]'
              }`}
            >
              <Plus className="h-5 w-5" />
              <span>Add Row</span>
            </button>

            {/* Total - always display in Rs (LKR) */}
            <div className={`text-right font-semibold mb-4 ${
              theme === 'dark' ? 'text-emerald-400' : 'text-[#059669]'
            }`}>
              Total: Rs.{getTotal().toFixed(2)}
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={onSave}
                disabled={!isValidForSave() || isLoading}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  isValidForSave() && !isLoading
                    ? theme === 'dark'
                      ? 'bg-[#1a1f2c] text-white border border-emerald-400/20 hover:bg-[#0f141f] shadow-[0_1px_3px_rgba(0,0,0,0.4)] transform hover:scale-105'
                      : 'bg-[#059669] text-white hover:bg-[#047857] shadow-[0_1px_3px_rgba(0,0,0,0.15)] transform hover:scale-105'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  'Save Expenses'
                )}
              </button>
            </div>

            {/* Validation hint */}
            {!isValidForSave() && (
              <p className={`text-xs mt-2 text-center ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Fill at least one complete row to enable save button
              </p>
            )}
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
