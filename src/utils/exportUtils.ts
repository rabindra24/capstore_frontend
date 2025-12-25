import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

/**
 * Format currency for display
 */
const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(value);
};

/**
 * Export analytics data to CSV format
 */
export const exportToCSV = (
    data: AnalyticsData,
    store: string,
    dateRange: string
): void => {
    const filename = `analytics-${store}-${dateRange}-${Date.now()}.csv`;

    // Prepare CSV content
    let csvContent = 'Analytics Report\n';
    csvContent += `Store: ${store}\n`;
    csvContent += `Date Range: ${dateRange}\n`;
    csvContent += `Generated: ${new Date().toLocaleString()}\n\n`;

    // Summary metrics
    csvContent += 'Summary Metrics\n';
    csvContent += 'Metric,Value\n';
    csvContent += `Total Revenue,${data.totalRevenue}\n`;
    csvContent += `Net Revenue,${data.netRevenue}\n`;
    csvContent += `Total Orders,${data.totalOrders}\n`;
    csvContent += `Average Order Value,${data.aov}\n`;
    csvContent += `Refunds,${data.refunds}\n\n`;

    // Daily revenue
    csvContent += 'Daily Revenue\n';
    csvContent += 'Date,Revenue\n';
    Object.entries(data.byDay)
        .sort(([a], [b]) => a.localeCompare(b))
        .forEach(([date, revenue]) => {
            csvContent += `${date},${revenue}\n`;
        });

    csvContent += '\n';

    // Top products
    csvContent += 'Top Products\n';
    csvContent += 'Product Name,Quantity Sold,Revenue,Revenue Share %\n';
    data.topProducts.forEach((product) => {
        const share = ((product.revenue / data.totalRevenue) * 100).toFixed(2);
        csvContent += `"${product.name}",${product.qty},${product.revenue},${share}\n`;
    });

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Export analytics data to PDF format
 */
export const exportToPDF = (
    data: AnalyticsData,
    store: string,
    dateRange: string
): void => {
    const filename = `analytics-${store}-${dateRange}-${Date.now()}.pdf`;

    // Create PDF document
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Analytics Report', 14, 20);

    // Metadata
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Store: ${store.toUpperCase()}`, 14, 30);
    doc.text(`Date Range: ${dateRange}`, 14, 36);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 42);

    // Summary Metrics Table
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary Metrics', 14, 55);

    autoTable(doc, {
        startY: 60,
        head: [['Metric', 'Value']],
        body: [
            ['Total Revenue', formatCurrency(data.totalRevenue)],
            ['Net Revenue', formatCurrency(data.netRevenue)],
            ['Total Orders', data.totalOrders.toString()],
            ['Average Order Value', formatCurrency(data.aov)],
            ['Refunds', formatCurrency(data.refunds)],
        ],
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
    });

    // Daily Revenue Table
    const dailyData = Object.entries(data.byDay)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, revenue]) => [date, formatCurrency(revenue)]);

    if (dailyData.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        const yPos = (doc as any).lastAutoTable.finalY + 15;
        doc.text('Daily Revenue', 14, yPos);

        autoTable(doc, {
            startY: yPos + 5,
            head: [['Date', 'Revenue']],
            body: dailyData,
            theme: 'striped',
            headStyles: { fillColor: [59, 130, 246] },
        });
    }

    // Top Products Table
    if (data.topProducts.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        const yPos = (doc as any).lastAutoTable.finalY + 15;

        // Check if we need a new page
        if (yPos > 250) {
            doc.addPage();
            doc.text('Top Products', 14, 20);
            autoTable(doc, {
                startY: 25,
                head: [['Product Name', 'Qty Sold', 'Revenue', 'Share %']],
                body: data.topProducts.map((p) => [
                    p.name,
                    p.qty.toString(),
                    formatCurrency(p.revenue),
                    ((p.revenue / data.totalRevenue) * 100).toFixed(1) + '%',
                ]),
                theme: 'striped',
                headStyles: { fillColor: [59, 130, 246] },
            });
        } else {
            doc.text('Top Products', 14, yPos);
            autoTable(doc, {
                startY: yPos + 5,
                head: [['Product Name', 'Qty Sold', 'Revenue', 'Share %']],
                body: data.topProducts.map((p) => [
                    p.name,
                    p.qty.toString(),
                    formatCurrency(p.revenue),
                    ((p.revenue / data.totalRevenue) * 100).toFixed(1) + '%',
                ]),
                theme: 'striped',
                headStyles: { fillColor: [59, 130, 246] },
            });
        }
    }

    // Save PDF
    doc.save(filename);
};

/**
 * Format data for export
 */
export const formatDataForExport = (data: any): AnalyticsData => {
    return {
        totalOrders: data.totalOrders || 0,
        totalRevenue: data.totalRevenue || 0,
        netRevenue: data.netRevenue || 0,
        refunds: data.refunds || 0,
        aov: data.aov || 0,
        byDay: data.byDay || {},
        topProducts: data.topProducts || [],
    };
};
