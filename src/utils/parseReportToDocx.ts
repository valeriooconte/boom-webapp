import { Paragraph, TextRun, HeadingLevel } from "docx";

/**
 * Converte una stringa "markdown-like" in paragrafi formattati per docx
 * Supporta:
 *  - ### Titolo → Heading1
 *  - ## Capitolo → Heading2
 *  - # Paragrafo → Heading3
 *  - - Elemento → elenco puntato
 *  - **grassetto**
 *  - *corsivo*
 *  - \n → nuova riga
 */
export function parseReportToDocxParagraphs(reportText: string): Paragraph[] {
  const text = reportText.replace("---", "");
  const lines = text.split("\n");
  const paragraphs: Paragraph[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      paragraphs.push(new Paragraph("")); // linea vuota = a capo
      continue;
    }

    // === Titoli ===
    if (line.startsWith("### ")) {
      paragraphs.push(
        new Paragraph({
          text: line.slice(4),
          heading: HeadingLevel.HEADING_3,
        })
      );
      continue;
    }

    if (line.startsWith("## ")) {
      paragraphs.push(
        new Paragraph({
          text: line.slice(3),
          heading: HeadingLevel.HEADING_2,
        })
      );
      continue;
    }

    if (line.startsWith("# ")) {
      paragraphs.push(
        new Paragraph({
          text: line.slice(2),
          heading: HeadingLevel.HEADING_1,
        })
      );
      continue;
    }

    // === Elenchi puntati ===
    if (line.startsWith("- ")) {
      const text = line.slice(2);
      const bulletRuns: TextRun[] = [];
      const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g); // gestisce * e **

      for (const part of parts) {
        if (!part) continue;

        if (part.startsWith("**") && part.endsWith("**")) {
          bulletRuns.push(new TextRun({ text: part.slice(2, -2), bold: true }));
        } else if (part.startsWith("*") && part.endsWith("*")) {
          bulletRuns.push(new TextRun({ text: part.slice(1, -1), italics: true }));
        } else {
          bulletRuns.push(new TextRun(part));
        }
      }

      paragraphs.push(
        new Paragraph({
          children: bulletRuns,
          bullet: { level: 0 }, // elenchi puntati Word
        })
      );
      continue;
    }

    // === Testo normale (con * e **) ===
    const textRuns: TextRun[] = [];
    const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);

    for (const part of parts) {
      if (!part) continue;

      if (part.startsWith("**") && part.endsWith("**")) {
        textRuns.push(new TextRun({ text: part.slice(2, -2), bold: true }));
      } else if (part.startsWith("*") && part.endsWith("*")) {
        textRuns.push(new TextRun({ text: part.slice(1, -1), italics: true }));
      } else {
        textRuns.push(new TextRun(part));
      }
    }

    paragraphs.push(new Paragraph({ children: textRuns }));
  }

  return paragraphs;
}