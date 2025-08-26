import { Events, EventPayloads } from "../../common/config/rabbitmq/events";
import { sendEmailWithAttachments } from "../../services/emailService";
import { generateInvoiceHTML } from "../../templates/invoiceTemplate";
import puppeteer from "puppeteer";

export async function handleInvoiceCreated(
  data: EventPayloads[Events.INVOICE_CREATED]
) {
  const html = generateInvoiceHTML(data);

  // covert html
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(10_000); // 10 sec timeout
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  // Send email
  await sendEmailWithAttachments(
    data.student.email,
    "Your Invoice",
    "<p>Attached is your invoice. Thank you!</p>",
    {
      filename: `invoice-${data.invoiceId}.pdf`,
      content: pdfBuffer,
    }
  );
}
