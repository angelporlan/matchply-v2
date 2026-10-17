import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { CvData } from "@/lib/cv";

export async function cvToPdf(title: string, data: CvData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  let page = doc.addPage([595, 842]);
  let y = 800;
  const left = 50;
  const maxWidth = 495;

  const line = (text: string, size: number, face = font) => {
    const wrapped = wrap(text, face, size, maxWidth);
    for (const row of wrapped) {
      if (y < 60) {
        page = doc.addPage([595, 842]);
        y = 800;
      }
      page.drawText(row, {
        x: left,
        y,
        size,
        font: face,
        color: rgb(0.05, 0.06, 0.1),
      });
      y -= size + 6;
    }
  };

  const heading = data.profile.fullName || title;
  line(heading, 18, bold);
  if (data.profile.headline) {
    line(data.profile.headline, 11);
  }
  const contact = [data.profile.email, data.profile.phone, data.profile.location]
    .filter(Boolean)
    .join("  ·  ");
  if (contact) {
    line(contact, 9);
  }
  y -= 8;
  if (data.profile.summary) {
    line(data.profile.summary, 10);
    y -= 6;
  }
  if (data.experience.length > 0) {
    line("Experiencia", 12, bold);
    for (const item of data.experience) {
      line(`${item.role} · ${item.company}`, 10, bold);
      if (item.start || item.end) {
        line([item.start, item.end || "actual"].filter(Boolean).join(" — "), 9);
      }
      for (const bullet of item.bullets) {
        line(`• ${bullet}`, 10);
      }
      y -= 4;
    }
  }
  if (data.education.length > 0) {
    line("Educación", 12, bold);
    for (const item of data.education) {
      line([item.degree, item.school, item.year].filter(Boolean).join(" · "), 10);
    }
    y -= 4;
  }
  if (data.skills.length > 0) {
    line("Skills", 12, bold);
    line(data.skills.join(" · "), 10);
  }

  return doc.save();
}

function wrap(
  text: string,
  font: { widthOfTextAtSize: (t: string, s: number) => number },
  size: number,
  maxWidth: number,
): string[] {
  const safe = Array.from(text, (ch) =>
    ch.charCodeAt(0) <= 255 ? ch : "?",
  ).join("");
  const words = safe.split(/\s+/).filter(Boolean);
  const rows: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) > maxWidth && current) {
      rows.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) {
    rows.push(current);
  }
  return rows.length > 0 ? rows : [""];
}
