import download from 'downloadjs';
import { PDFDocument, StandardFonts } from 'pdf-lib';

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
    console.error('Error downloading MP3:', error);
    // Handle the error appropriately (e.g., show an error message to the user)
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
    // Handle the error appropriately (e.g., show an error message to the user)
    return;
  }
  download(text, filename, 'text/plain');
}

// todo: the create pdf part has some styling work needed. We probably want to pass
//   in title, author, url, and some other data to style into it. Also, line wrap, etc.
export async function downloadPDF(text: string | undefined, filename: string) {
  if (text === undefined) {
    console.error('Error: Text is undefined.');
    return;
  }

  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const pageWidth = page.getWidth();

    // Add the text content
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    const lines = text.split('\n');
    let y = page.getHeight() - 50; // Start at the top with some margin
    const leftMargin = 50;

    for (const line of lines) {
      const textWidth = font.widthOfTextAtSize(line, fontSize);

      // If the line is too wide, split it into multiple lines
      if (textWidth > pageWidth - 2 * leftMargin) {
        const words = line.split(' ');
        let currentLine = '';
        for (const word of words) {
          const potentialLine = currentLine ? `${currentLine} ${word}` : word;
          const potentialLineWidth = font.widthOfTextAtSize(
            potentialLine,
            fontSize,
          );
          if (potentialLineWidth > pageWidth - 2 * leftMargin) {
            page.drawText(currentLine, {
              x: leftMargin,
              y,
              font,
              size: fontSize,
            });
            y -= fontSize + 5;
            currentLine = word;
          } else {
            currentLine = potentialLine;
          }
        }
        // Draw the last line
        page.drawText(currentLine, { x: leftMargin, y, font, size: fontSize });
        y -= fontSize + 5;
      } else {
        page.drawText(line, { x: leftMargin, y, font, size: fontSize });
        y -= fontSize + 5;
      }
    }

    const pdfBytes = await pdfDoc.save();
    download(pdfBytes, filename, 'application/pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}
