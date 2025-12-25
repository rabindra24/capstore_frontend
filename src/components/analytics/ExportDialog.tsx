import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { exportToCSV, exportToPDF } from "@/utils/exportUtils";

type AnalyticsData = {
    totalOrders: number;
    totalRevenue: number;
    netRevenue: number;
    refunds: number;
    aov: number;
    byDay: Record<string, number>;
    topProducts: Array<{
        name: string;
        qty: number;
        revenue: number;
    }>;
};

type ExportDialogProps = {
    data: AnalyticsData;
    store: string;
    dateRange: string;
};

export function ExportDialog({ data, store, dateRange }: ExportDialogProps) {
    const [open, setOpen] = useState(false);
    const [format, setFormat] = useState<"csv" | "pdf">("csv");
    const [exporting, setExporting] = useState(false);

    const handleExport = async () => {
        setExporting(true);

        try {
            if (format === "csv") {
                exportToCSV(data, store, dateRange);
            } else {
                exportToPDF(data, store, dateRange);
            }

            // Close dialog after a short delay
            setTimeout(() => {
                setOpen(false);
                setExporting(false);
            }, 500);
        } catch (error) {
            console.error("Export failed:", error);
            setExporting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Export Analytics Report</DialogTitle>
                    <DialogDescription>
                        Choose the format for your analytics report. The report will include
                        all metrics, daily revenue data, and top products.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-3">
                        <Label>Export Format</Label>
                        <RadioGroup value={format} onValueChange={(v) => setFormat(v as "csv" | "pdf")}>
                            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                                <RadioGroupItem value="csv" id="csv" />
                                <Label htmlFor="csv" className="flex items-center gap-2 cursor-pointer flex-1">
                                    <FileSpreadsheet className="w-4 h-4 text-green-600" />
                                    <div>
                                        <div className="font-medium">CSV (Spreadsheet)</div>
                                        <div className="text-xs text-muted-foreground">
                                            Best for data analysis in Excel or Google Sheets
                                        </div>
                                    </div>
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                                <RadioGroupItem value="pdf" id="pdf" />
                                <Label htmlFor="pdf" className="flex items-center gap-2 cursor-pointer flex-1">
                                    <FileText className="w-4 h-4 text-red-600" />
                                    <div>
                                        <div className="font-medium">PDF (Document)</div>
                                        <div className="text-xs text-muted-foreground">
                                            Best for sharing and printing formatted reports
                                        </div>
                                    </div>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-2 p-3 bg-muted rounded-lg">
                        <div className="text-sm font-medium">Report Details</div>
                        <div className="text-xs text-muted-foreground space-y-1">
                            <div>Store: <span className="font-medium">{store.toUpperCase()}</span></div>
                            <div>Date Range: <span className="font-medium">{dateRange}</span></div>
                            <div>Total Orders: <span className="font-medium">{data.totalOrders}</span></div>
                            <div>Top Products: <span className="font-medium">{data.topProducts.length}</span></div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={exporting}>
                        Cancel
                    </Button>
                    <Button onClick={handleExport} disabled={exporting}>
                        {exporting ? (
                            <>
                                <Download className="w-4 h-4 mr-2 animate-bounce" />
                                Exporting...
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4 mr-2" />
                                Export {format.toUpperCase()}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
