import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, AlertTriangle, ArrowRightLeft } from "lucide-react";

const initialInventory = [
  { id: "ITM-001", name: "Amoxicillin 500mg", category: "Medication", qty: 45, minQty: 50, unit: "Boxes", unitCost: 1200, lastUpdated: "Jul 10, 2026" },
  { id: "ITM-002", name: "Paracetamol 1g", category: "Medication", qty: 120, minQty: 50, unit: "Boxes", unitCost: 450, lastUpdated: "Jul 11, 2026" },
  { id: "ITM-003", name: "Surgical Masks", category: "Supplies", qty: 15, minQty: 100, unit: "Packs", unitCost: 800, lastUpdated: "Jul 09, 2026" },
  { id: "ITM-004", name: "Examination Gloves", category: "Supplies", qty: 250, minQty: 100, unit: "Boxes", unitCost: 1500, lastUpdated: "Jul 05, 2026" },
  { id: "ITM-005", name: "Syringes 5ml", category: "Equipment", qty: 85, minQty: 100, unit: "Pcs", unitCost: 200, lastUpdated: "Jul 10, 2026" },
];

export function Inventory() {
  const [inventory, setInventory] = useState(initialInventory);

  const updateQty = (id: string, delta: number) => {
    setInventory(inventory.map(item => {
      if (item.id === id) {
        return { ...item, qty: Math.max(0, item.qty + delta) };
      }
      return item;
    }));
  };

  return (
    <div className="flex h-full flex-col space-y-6 overflow-hidden">
      <div className="flex items-end justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Inventory
          </h2>
          <p className="text-sm text-slate-500">
            Manage stock items, alerts, and stock movements.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="text-slate-700">
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            Movement Log
          </Button>
          <Button className="bg-indigo-600 text-white hover:bg-indigo-700 border-none">
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <Plus className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Total Items</p>
            <p className="text-2xl font-bold text-slate-900">{inventory.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Low Stock Alerts</p>
            <p className="text-2xl font-bold text-slate-900">
              {inventory.filter(i => i.qty <= i.minQty).length}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-200 bg-slate-50/50 font-medium text-slate-700 sticky top-0">
              <tr>
                <th className="p-4">Item ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Unit Cost</th>
                <th className="p-4">Quantity (Thresh.)</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Quick Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inventory.map(item => {
                const isLowStock = item.qty <= item.minQty;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-medium text-indigo-600">{item.id}</td>
                    <td className="p-4 font-medium text-slate-900">{item.name}</td>
                    <td className="p-4">{item.category}</td>
                    <td className="p-4 text-slate-500">KES {item.unitCost.toLocaleString()}</td>
                    <td className="p-4 font-medium">
                      {item.qty} <span className="text-slate-400 text-xs font-normal">/ {item.minQty} {item.unit}</span>
                    </td>
                    <td className="p-4">
                      {isLowStock ? (
                        <Badge variant="destructive" className="bg-amber-100 text-amber-800 border-none hover:bg-amber-100">
                          Low Stock
                        </Badge>
                      ) : (
                        <Badge variant="default" className="bg-emerald-100 text-emerald-800 border-none hover:bg-emerald-100">
                          In Stock
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQty(item.id, -1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQty(item.id, 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
