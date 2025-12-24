// PDF Report Generator Utility
// Generates professional expense summary reports

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export class PDFReportGenerator {
  constructor() {
    this.logoText = 'BudgetBee';
    this.organizationName = 'Smart Receipt Organizer';
    this.logoImage = null;
    this.loadLogo();
  }

  /**
   * Load logo image as base64
   */
  async loadLogo() {
    try {
      // Import the logo and convert to base64
      const logoPath = '/src/assets/logo.png';
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      
      return new Promise((resolve, reject) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          this.logoImage = canvas.toDataURL('image/png');
          resolve(this.logoImage);
        };
        img.onerror = () => {
          console.warn('Logo image could not be loaded');
          resolve(null);
        };
        img.src = logoPath;
      });
    } catch (error) {
      console.warn('Error loading logo:', error);
      return null;
    }
  }

  /**
   * Generate PDF from HTML element (current implementation - keep for compatibility)
   */
  async generateFromHTML(element, filename = 'report.pdf') {
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#06402B'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(filename);
      return true;
    } catch (error) {
      console.error('Error generating PDF:', error);
      return false;
    }
  }

  /**
   * Generate structured PDF report with data
   */
  async generateStructuredReport(reportData) {
    try {
      const {
        reportType = 'Summary',
        period = '',
        dateGenerated = new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        totalSpent = 0,
        metrics = {},
        categoryBreakdown = [],
        filename = 'expense_summary.pdf'
      } = reportData;

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPos = 20;

      // Header with logo
      pdf.setFillColor(26, 31, 44); // #1a1f2c
      pdf.rect(0, 0, pageWidth, 40, 'F');
      
      // Add logo if available
      if (this.logoImage) {
        try {
          pdf.addImage(this.logoImage, 'PNG', 15, 10, 20, 20);
        } catch (error) {
          console.warn('Could not add logo to PDF:', error);
        }
      }
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text(this.logoText, this.logoImage ? 40 : 15, 20);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(this.organizationName, this.logoImage ? 40 : 15, 28);

      // Report Title
      yPos = 50;
      pdf.setTextColor(51, 51, 51);
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${reportType} Expense Summary Report`, 15, yPos);

      yPos += 10;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Period: ${period}`, 15, yPos);
      
      yPos += 6;
      pdf.text(`Generated: ${dateGenerated}`, 15, yPos);

      // Divider line
      yPos += 8;
      pdf.setDrawColor(200, 200, 200);
      pdf.line(15, yPos, pageWidth - 15, yPos);

      // Check if there's data
      if (totalSpent === 0 && (!categoryBreakdown || categoryBreakdown.length === 0)) {
        yPos += 20;
        pdf.setFontSize(14);
        pdf.setTextColor(150, 150, 150);
        pdf.text('No expenses recorded for this period.', pageWidth / 2, yPos, { align: 'center' });
        
        // Footer
        this.addFooter(pdf, pageHeight);
        pdf.save(filename);
        return true;
      }

      // Key Summary Highlights Section
      yPos += 15;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(51, 51, 51);
      pdf.text('Key Summary Highlights', 15, yPos);

      yPos += 8;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');

      // Total Spent (always show)
      pdf.setFont('helvetica', 'bold');
      pdf.text('Total Spent:', 20, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Rs. ${this.formatNumber(totalSpent)}`, 70, yPos);

      // Display all metrics dynamically
      const metricKeys = Object.keys(metrics);
      for (let i = 0; i < metricKeys.length; i++) {
        yPos += 6;
        
        // Check for page overflow
        if (yPos > pageHeight - 40) {
          pdf.addPage();
          yPos = 20;
        }
        
        const key = metricKeys[i];
        const value = metrics[key];
        
        // Skip if value is null, undefined, or 'N/A'
        if (value === null || value === undefined || value === 'N/A') {
          continue;
        }
        
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${this.formatMetricName(key)}:`, 20, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.text(this.formatMetricValue(value), 70, yPos);
      }

      // Category Breakdown Section (with proper percentages)
      if (categoryBreakdown && categoryBreakdown.length > 0) {
        yPos += 15;
        
        // Check for page overflow
        if (yPos > pageHeight - 60) {
          pdf.addPage();
          yPos = 20;
        }
        
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(51, 51, 51);
        pdf.text('Spending Distribution by Category', 15, yPos);

        yPos += 8;
        pdf.setFontSize(10);

        // Table header
        pdf.setFillColor(240, 240, 240);
        pdf.rect(15, yPos - 4, pageWidth - 30, 8, 'F');
        pdf.setFont('helvetica', 'bold');
        pdf.text('Category', 20, yPos);
        pdf.text('Amount (Rs.)', pageWidth - 70, yPos);
        pdf.text('Percentage', pageWidth - 30, yPos);

        yPos += 8;
        pdf.setFont('helvetica', 'normal');

        // Calculate total for accurate percentages
        const calculatedTotal = categoryBreakdown.reduce((sum, item) => {
          const amount = item.amount || item.total || item.value || 0;
          return sum + Number(amount);
        }, 0);

        // Use the higher of totalSpent or calculatedTotal to avoid 0.00% issue
        const totalForPercentage = Math.max(totalSpent, calculatedTotal);

        // Table rows with calculated percentages
        categoryBreakdown.forEach((item, index) => {
          if (yPos > pageHeight - 40) {
            pdf.addPage();
            yPos = 20;
            
            // Redraw table header on new page
            pdf.setFillColor(240, 240, 240);
            pdf.rect(15, yPos - 4, pageWidth - 30, 8, 'F');
            pdf.setFont('helvetica', 'bold');
            pdf.text('Category', 20, yPos);
            pdf.text('Amount (Rs.)', pageWidth - 70, yPos);
            pdf.text('Percentage', pageWidth - 30, yPos);
            yPos += 8;
            pdf.setFont('helvetica', 'normal');
          }

          const category = item.category || item.name || item.category_name || 'Unknown';
          const amount = Number(item.amount || item.total || item.value || 0);
          
          // Calculate percentage with proper precision
          const percentage = totalForPercentage > 0 
            ? ((amount / totalForPercentage) * 100).toFixed(2) 
            : '0.00';

          // Alternating row background
          if (index % 2 === 0) {
            pdf.setFillColor(250, 250, 250);
            pdf.rect(15, yPos - 4, pageWidth - 30, 6, 'F');
          }

          pdf.text(category, 20, yPos);
          pdf.text(this.formatNumber(amount), pageWidth - 70, yPos);
          pdf.text(`${percentage}%`, pageWidth - 30, yPos);

          yPos += 6;
        });
      }

      // Footer
      this.addFooter(pdf, pageHeight);

      pdf.save(filename);
      return true;
    } catch (error) {
      console.error('Error generating structured PDF:', error);
      return false;
    }
  }

  /**
   * Add footer to PDF
   */
  addFooter(pdf, pageHeight) {
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.setFont('helvetica', 'italic');
    
    const footerText = `${this.organizationName} © 2025 — Automatically generated summary report`;
    const noteText = 'Data is based on uploaded receipts and categorized transactions.';
    
    pdf.text(footerText, pageWidth / 2, pageHeight - 15, { align: 'center' });
    pdf.text(noteText, pageWidth / 2, pageHeight - 10, { align: 'center' });
  }

  /**
   * Format number with commas
   */
  formatNumber(num) {
    return Number(num).toLocaleString('en-IN', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  }

  /**
   * Format metric name (convert camelCase to Title Case)
   */
  formatMetricName(key) {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  /**
   * Format metric value
   */
  formatMetricValue(value) {
    if (typeof value === 'number') {
      return `Rs. ${this.formatNumber(value)}`;
    }
    if (typeof value === 'object' && value !== null) {
      // Handle objects like {date: '...', total: 123}
      if (value.date && value.total !== undefined) {
        return `${value.date} - Rs. ${this.formatNumber(value.total)}`;
      }
      if (value.month && value.total !== undefined) {
        return `${value.month} - Rs. ${this.formatNumber(value.total)}`;
      }
      if (value.week && value.total !== undefined) {
        return `${value.week} - Rs. ${this.formatNumber(value.total)}`;
      }
    }
    return String(value);
  }
}

// Export singleton instance
export const pdfReportGenerator = new PDFReportGenerator();
export default pdfReportGenerator;
