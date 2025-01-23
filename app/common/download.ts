import download from 'downloadjs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { Sermon } from '~/api/interfaces';
import { hasContent } from '~/common/sanitize';

export async function downloadUrl(
  url: string | undefined,
  filename: string,
  type: string | undefined,
) {
  if (url === undefined) {
    // Handle the error appropriately (e.g., show an error message to the user)
    return;
  }
  try {
    const response = await fetch(url);
    const data = await response.blob(); // Get the file content as a Blob
    download(data, filename, type);
  } catch (error) {
    throw new Error(`Failed to download url: '${url}' because '${error}'`);
  }
}

export async function downloadMP3(url: string | undefined, filename: string) {
  await downloadUrl(url, filename, 'audio/mpeg');
}

export async function downloadMP4(url: string | undefined, filename: string) {
  await downloadUrl(url, filename, 'video/mpeg');
}

export function downloadPlainText(text: string | undefined, filename: string) {
  if (text === undefined) {
    throw new Error('Failed to download text because it is undefined');
  }
  download(text, filename, 'text/plain');
}

export async function downloadPDF(
  sermon: Sermon | undefined,
  filename: string,
) {
  if (sermon === undefined || !hasContent(sermon.transcript)) {
    throw new Error('Failed to download pdf because it is undefined');
  }

  await createSermonPDF(
    sermon.title,
    sermon.contributorFullName,
    sermon.contributorImageUrl,
    sermon.transcript,
    filename,
  );
}

// todo: styling work needed (ex. Add SI icon, verses, topic, etc)
async function createSermonPDF(
  title: string,
  author: string,
  icon: string | undefined,
  text: string | undefined,
  filename: string,
) {
  const doc = new jsPDF();
  const PAGE_MARGIN = 20; // Margin in millimeters (adjust as needed)
  const PAGE_HEIGHT = doc.internal.pageSize.getHeight(); // Total page height
  const USABLE_PAGE_HEIGHT = PAGE_HEIGHT - 2 * PAGE_MARGIN + 10; // Height minus top and bottom margin

  // Add title
  doc.setFontSize(22);
  doc.text(title, PAGE_MARGIN, PAGE_MARGIN);

  // Add author
  doc.setFontSize(16);
  doc.text(`By ${author}`, PAGE_MARGIN, PAGE_MARGIN + 10);

  if (icon !== undefined) {
    try {
      const response = await fetch(icon);
      const data = await response.blob();
      const jpeg = await data.text();
      doc.addImage(jpeg, 'JPEG', 15, 40, 25, 25);
    } catch (error) {
      throw new Error('Failed to fetch speaker image');
    }
  }

  // Add hyperlink to each page
  const addFooterContent = (pageNum: number, totalPages: number) => {
    const url = 'https://www.sermonindex.net';
    const linkText = 'sermonindex.net';
    const pageWidth = doc.internal.pageSize.getWidth();

    const originalFontSize = doc.getFontSize();
    doc.setFontSize(10);

    // Page number
    const pageNumberText = `Page ${pageNum} of ${totalPages}`;
    const pageNumberTextWidth = doc.getTextWidth(pageNumberText);
    doc.text(
      pageNumberText,
      pageWidth - PAGE_MARGIN - pageNumberTextWidth,
      PAGE_HEIGHT - 10,
    );

    // Hyperlink
    doc.setTextColor('#4A4A23');
    // Calculate the x-coordinate to center the link
    const textWidth = doc.getTextWidth(linkText);
    const xCoordinate = (pageWidth - textWidth) / 2;
    // Add the hyperlink
    doc.textWithLink(linkText, xCoordinate, PAGE_HEIGHT - 10, { url });

    // Reset text color to black for subsequent text
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(originalFontSize);
  };

  // Format and add the main text content with paragraph handling
  doc.setFontSize(12);
  const lineHeight = doc.getLineHeight() * 0.35;
  const paragraphs = text.split('\n\n');
  let y = 75;
  let pageNum = 1;

  function addParagraph(paragraph: string, y: number) {
    const lines = doc.splitTextToSize(paragraph, 170);
    let remainingLines = [...lines]; // Create a copy to work with

    while (remainingLines.length > 0) {
      let linesToPrint = [];
      let currentY = y;

      // Determine how many lines fit on the current page
      for (let i = 0; i < remainingLines.length; i++) {
        if (currentY + lineHeight > USABLE_PAGE_HEIGHT) {
          break; // Page full
        }
        linesToPrint.push(remainingLines[i]);
        currentY += lineHeight;
      }

      doc.text(linesToPrint, PAGE_MARGIN, y);
      y += linesToPrint.length * lineHeight + 5;

      remainingLines = remainingLines.slice(linesToPrint.length); // Remove printed lines

      if (remainingLines.length > 0) {
        // More lines to print, add a new page
        doc.addPage();
        y = PAGE_MARGIN;
        pageNum++;
      }
    }
    return y; // Return the updated y value
  }

  for (let i = 0; i < paragraphs.length; i++) {
    // Use a for loop instead of forEach
    const paragraph = paragraphs[i];
    y = addParagraph(paragraph, y);

    // Check for a new page *only if there's another paragraph after this one*
    if (i < paragraphs.length - 1) {
      // Crucial change!
      const nextParagraphLines = doc.splitTextToSize(paragraphs[i + 1], 170);
      if (y + nextParagraphLines.length * lineHeight > USABLE_PAGE_HEIGHT) {
        doc.addPage();
        y = PAGE_MARGIN;
        pageNum++;
      }
    }
  }

  // Now that we know the total number of pages, go back and update the page numbers
  const totalPages = pageNum;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooterContent(i, totalPages);
  }

  // Save the PDF
  doc.save(filename);
}
