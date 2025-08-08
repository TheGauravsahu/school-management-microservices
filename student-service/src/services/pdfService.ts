import ejs from "ejs";
import path from "path";
import puppeteer from "puppeteer";
import { IStudent } from "../types";

export class PDFService {
  async exportStudentsToPDF(students: IStudent[]): Promise<Buffer> {
    const template = path.join(__dirname, "../templates/studentsList-pdf.ejs");

    // render html
    const html = await ejs.renderFile(template, { students });

    // generate PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
    });

    await browser.close();
    return Buffer.from(pdfBuffer);
  }
}
