import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PdfExportOptions {
  fileName?: string;
  includeWireframes?: boolean;
  onProgress?: (step: string, percent: number) => void;
}

/**
 * High-fidelity multi-page PDF exporter that captures sections or the entire report element,
 * adds running headers/footers with page numbers, and downloads the PDF directly.
 */
export async function exportReportToPdf(
  containerElement: HTMLElement,
  options: PdfExportOptions = {}
): Promise<void> {
  const {
    fileName = `TOBMALL_TO-BE_화면구성설계서_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.pdf`,
    onProgress = () => {}
  } = options;

  try {
    onProgress('PDF 생성 준비 중...', 5);

    // Find all designated page blocks inside container
    const sectionElements = Array.from(
      containerElement.querySelectorAll<HTMLElement>('.pdf-page-block')
    );

    // If no specific page blocks are marked, capture container as a whole
    if (sectionElements.length === 0) {
      onProgress('전체 문서 렌더링 중...', 30);
      const canvas = await html2canvas(containerElement, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1100
      });

      onProgress('PDF 페이지 구성 중...', 75);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 10;
      const contentWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * contentWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = margin;

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, imgHeight, undefined, 'FAST');
      heightLeft -= (pageHeight - margin * 2);

      while (heightLeft > 0) {
        position = margin - (imgHeight - heightLeft);
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, imgHeight, undefined, 'FAST');
        heightLeft -= (pageHeight - margin * 2);
      }

      onProgress('PDF 파일 저장 중...', 95);
      pdf.save(fileName);
      onProgress('완료', 100);
      return;
    }

    // High quality paginated rendering: process each section element
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const marginTop = 16;
    const marginBottom = 16;
    const marginLeft = 12;
    const marginRight = 12;
    const contentWidth = pageWidth - marginLeft - marginRight;
    const maxContentHeight = pageHeight - marginTop - marginBottom;

    let isFirstPage = true;
    const totalSections = sectionElements.length;

    for (let i = 0; i < totalSections; i++) {
      const section = sectionElements[i];
      const sectionName = section.getAttribute('data-pdf-title') || `섹션 ${i + 1}`;
      const progressPercent = Math.round(10 + ((i + 1) / totalSections) * 75);
      
      onProgress(`페이지 렌더링 중: ${sectionName} (${i + 1}/${totalSections})`, progressPercent);

      // Render high-res canvas for the section
      const canvas = await html2canvas(section, {
        scale: 1.75, // Sharp quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1000
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const imgHeight = (canvas.height * contentWidth) / canvas.width;

      if (imgHeight <= maxContentHeight) {
        // Fits comfortably on a single A4 page
        if (!isFirstPage) {
          pdf.addPage();
        }
        isFirstPage = false;

        // Draw section image
        pdf.addImage(imgData, 'JPEG', marginLeft, marginTop, contentWidth, imgHeight, undefined, 'FAST');
      } else {
        // Large section: split across multiple sub-pages smoothly
        let remainingHeight = imgHeight;
        let offset = 0;

        while (remainingHeight > 0) {
          if (!isFirstPage) {
            pdf.addPage();
          }
          isFirstPage = false;

          const sliceHeight = Math.min(remainingHeight, maxContentHeight);
          
          // Create sub-canvas slice
          const sliceCanvas = document.createElement('canvas');
          sliceCanvas.width = canvas.width;
          const pixelSliceHeight = (sliceHeight * canvas.width) / contentWidth;
          sliceCanvas.height = Math.round(pixelSliceHeight);

          const ctx = sliceCanvas.getContext('2d');
          if (ctx) {
            const pixelSourceY = (offset * canvas.width) / contentWidth;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
            ctx.drawImage(
              canvas,
              0, pixelSourceY, canvas.width, pixelSliceHeight,
              0, 0, sliceCanvas.width, sliceCanvas.height
            );

            const sliceImgData = sliceCanvas.toDataURL('image/jpeg', 0.95);
            pdf.addImage(sliceImgData, 'JPEG', marginLeft, marginTop, contentWidth, sliceHeight, undefined, 'FAST');
          }

          remainingHeight -= maxContentHeight;
          offset += maxContentHeight;
        }
      }
    }

    // Add running header & footer page numbers on all pages
    const totalPages = pdf.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      pdf.setPage(p);

      // Don't draw header on Cover Page (Page 1)
      if (p > 1) {
        pdf.setFontSize(8);
        pdf.setTextColor(140, 145, 155);
        pdf.text('TOBMALL 플랫폼 TO-BE 화면구성설계서 (S2B2C & Planner X)', marginLeft, 10);
        pdf.text('友霓网络科技(上海)有限公司', pageWidth - marginRight, 10, { align: 'right' });
        
        pdf.setDrawColor(226, 232, 240); // slate-200 line
        pdf.setLineWidth(0.2);
        pdf.line(marginLeft, 12, pageWidth - marginRight, 12);
      }

      // Running footer with page number
      pdf.setFontSize(8);
      pdf.setTextColor(140, 145, 155);
      pdf.setDrawColor(226, 232, 240);
      pdf.setLineWidth(0.2);
      pdf.line(marginLeft, pageHeight - 11, pageWidth - marginRight, pageHeight - 11);

      pdf.text('CONFIDENTIAL · UNINET TECHNOLOGY (SHANGHAI) CO., LTD.', marginLeft, pageHeight - 7);
      pdf.text(`${p} / ${totalPages}`, pageWidth - marginRight, pageHeight - 7, { align: 'right' });
    }

    onProgress('PDF 파일 저장 중...', 92);
    pdf.save(fileName);

    onProgress('완료', 100);
  } catch (error) {
    console.error('PDF export failed:', error);
    throw error;
  }
}
