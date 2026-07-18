import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, AlertTriangle, ArrowRightLeft, Search, Check, X, History, PackageOpen } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useSearchParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";

function InventorySkeleton() {
  return (
    <div className="flex h-full flex-col space-y-6 overflow-hidden">
      <div className="flex items-end justify-between shrink-0">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-9 w-32 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-7 w-12" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex-1 rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-4 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-36 flex-1" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Inventory() {
  const { inventory, updateInventoryQty, movements, addMovement } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [highlightedRow, setHighlightedRow] = useState<string | null>(null);

  // Inline adjust state
  const [adjustingItemId, setAdjustingItemId] = useState<string | null>(null);
  const [adjustingDelta, setAdjustingDelta] = useState<number>(0);
  const [adjustingReason, setAdjustingReason] = useState<string>("Restock");

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const highlightId = searchParams.get("highlight");
      if (highlightId) {
        setHighlightedRow(highlightId);
        setTimeout(() => {
          const el = document.getElementById(`inventory-row-${highlightId}`);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
        
        const timer = setTimeout(() => {
          setHighlightedRow(null);
          const newParams = new URLSearchParams(searchParams);
          newParams.delete("highlight");
          setSearchParams(newParams, { replace: true });
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, searchParams, setSearchParams]);

  const filteredInventory = useMemo(() => {
    return inventory.filter(i => 
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      i.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [inventory, searchQuery]);

  const handleNotImplemented = (feature: string) => {
    toast.info(`${feature} is not implemented in this demo.`);
  };

  const startAdjust = (id: string, delta: number) => {
    setAdjustingItemId(id);
    setAdjustingDelta(delta);
    setAdjustingReason(delta > 0 ? "Restock" : "Sale/Usage");
  };

  const confirmAdjust = (item: typeof inventory[0]) => {
    addMovement({
      itemId: item.id,
      itemName: item.name,
      delta: adjustingDelta,
      reason: adjustingReason,
    });
    updateInventoryQty(item.id, adjustingDelta);
    setAdjustingItemId(null);
    toast.success(`Inventory updated: ${item.name} (${adjustingDelta > 0 ? '+' : ''}${adjustingDelta})`);
  };

  const cancelAdjust = () => {
    setAdjustingItemId(null);
  };

  if (isLoading) return <InventorySkeleton />;

  return (
    <div className="flex h-full flex-col space-y-6 overflow-hidden">
      <div className="flex items-end justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Inventory
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage stock items, alerts, and stock movements.
          </p>
        </div>
        <div className="flex gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="text-foreground">
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                Movement Log
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Inventory Movement Log</DialogTitle>
                <DialogDescription>
                  History of all stock adjustments across your inventory.
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-auto border rounded-md mt-4">
                <Table>
                  <TableHeader className="bg-muted/50 sticky top-0">
                    <TableRow>
                      <TableHead>When</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Change</TableHead>
                      <TableHead>Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movements.length > 0 ? (
                      movements.map(m => (
                        <TableRow key={m.id}>
                          <TableCell className="text-muted-foreground text-sm">
                            {new Date(m.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell className="font-medium">{m.itemName}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={m.delta > 0 ? "text-success bg-success/10" : "text-warning bg-warning/10"}>
                              {m.delta > 0 ? '+' : ''}{m.delta}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{m.reason}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          <EmptyState 
                            icon={History} 
                            message="No inventory movements found." 
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 border-none" onClick={() => handleNotImplemented("Add Item")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-success/10 dark:bg-success/20 flex items-center justify-center text-success">
            <Plus className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Total Items</p>
            <p className="text-2xl font-bold text-foreground">{inventory.length}</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-warning/10 dark:bg-warning/20 flex items-center justify-center text-warning">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Low Stock Alerts</p>
            <p className="text-2xl font-bold text-foreground">
              {inventory.filter(i => i.qty <= i.minQty).length}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-auto flex-1">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10 shadow-sm">
              <TableRow>
                <TableHead>Item ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Unit Cost</TableHead>
                <TableHead>Quantity (Thresh.)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Quick Adjust</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map(item => {
                const isLowStock = item.qty <= item.minQty;
                const isAdjusting = adjustingItemId === item.id;
                const isHighlighted = highlightedRow === item.id;

                return (
                  <TableRow 
                    key={item.id} 
                    id={`inventory-row-${item.id}`}
                    className={`hover:bg-muted/50 transition-colors duration-500 ${isHighlighted ? 'bg-primary/20 dark:bg-primary/30 ring-2 ring-primary ring-inset' : ''}`}
                  >
                    <TableCell className="font-medium text-primary">{item.id}</TableCell>
                    <TableCell className="font-medium text-card-foreground">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-muted-foreground">KES {item.unitCost.toLocaleString()}</TableCell>
                    <TableCell className="font-medium">
                      {item.qty} <span className="text-muted-foreground text-xs font-normal">/ {item.minQty} {item.unit}</span>
                    </TableCell>
                    <TableCell>
                      {isLowStock ? (
                        <Badge variant="destructive" className="bg-warning/10 text-warning border-none hover:bg-warning/20 dark:bg-warning/20 dark:text-warning">
                          Low Stock
                        </Badge>
                      ) : (
                        <Badge variant="default" className="bg-success/10 text-success border-none hover:bg-success/20 dark:bg-success/20 dark:text-success">
                          In Stock
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {isAdjusting ? (
                        <div className="flex items-center justify-end gap-2 animate-in fade-in slide-in-from-right-4">
                          <span className="font-bold text-sm">{adjustingDelta > 0 ? '+' : ''}{adjustingDelta}</span>
                          <select 
                            value={adjustingReason} 
                            onChange={(e) => setAdjustingReason(e.target.value)}
                            className="h-7 text-xs border rounded bg-background"
                          >
                            <option value="Restock">Restock</option>
                            <option value="Sale/Usage">Sale/Usage</option>
                            <option value="Correction">Correction</option>
                            <option value="Damaged/Expired">Damaged/Expired</option>
                          </select>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-success hover:text-success/80 hover:bg-success/10" onClick={() => confirmAdjust(item)}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={cancelAdjust}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="icon" className="h-7 w-7 border-border hover:bg-muted" onClick={() => startAdjust(item.id, -1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-7 w-7 border-border hover:bg-muted" onClick={() => startAdjust(item.id, 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredInventory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <EmptyState 
                      icon={PackageOpen} 
                      message="No items found." 
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
