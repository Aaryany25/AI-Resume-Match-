import { PDFParse } from "pdf-parse";
import { readFile } from "node:fs/promises";

/**
 * Extracts plain text from a PDF Buffer.
 * @param {Buffer} buffer - Raw PDF buffer
 * @returns {Promise<string>} - Extracted text
 */
export const extractTextFromPdfBuffer = async (buffer) => {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error("Invalid PDF buffer provided");
  }

  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    return result?.text || "";
  } finally {
    if (typeof parser.destroy === "function") {
      await parser.destroy();
    }
  }
};

/**
 * Extracts plain text from a PDF file path.
 * @param {string} filePath - Absolute or relative file path
 * @returns {Promise<string>} - Extracted text
 */
export const extractTextFromPdfPath = async (filePath) => {
  const buffer = await readFile(filePath);
  return extractTextFromPdfBuffer(buffer);
};
