import { EventPayloads, Events } from "../common/config/rabbitmq/events";

export function generateInvoiceHTML(
  data: EventPayloads[Events.INVOICE_CREATED]
) {
  // build summary table rows
  const summaryRows = data.monthlySummary
    .map(
      (m) => `
      <tr>
        <td>${m.monthName}</td>
        <td>${m.generated}</td>
        <td>${m.receipt}</td>
        <td>${m.waiver}</td>
        <td>${m.pending}</td>
      </tr>
    `
    )
    .join("");

  // build detailed rows
  const detailRows = data.monthlyDetails
    .map(
      (m) => m.fees
        .map(
          (f) => `
          <tr>
            <td>${m.monthName}</td>
            <td>${f.headName}</td>
            <td>${f.totalValue}</td>
            <td>${f.receipt}</td>
            <td>${f.waiver}</td>
            <td>${f.paid}</td>
            <td>${f.pending}</td>
          </tr>
        `
        )
        .join("")
    )
    .join("");

  return `
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 40px;
        color: #333;
      }
      .header {
        height: 200px;
        padding: 2px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: url("https://plus.unsplash.com/premium_photo-1701590725523-984a41d4b635?q=80&w=1031&auto=format&fit=crop");
        background-size: cover;
        color: white;
        border-radius: 8px;
      }
      .header-info {
        display: flex;
        gap: 10px;
      }
      .logo {
        font-size: 20px;
        font-weight: bold;
      }
      .invoice-title {
        text-align: center;
        margin: 30px 0;
        font-size: 22px;
      }
      .info p {
        margin: 2px 0;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      th {
        background: #f5f5f5;
      }
      .totals {
        margin-top: 20px;
        text-align: right;
      }
      .totals p {
        margin: 5px 0;
        font-weight: bold;
      }
      .footer {
        margin-top: 40px;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="header-info">
        <p>Admin |</p>
        <p>gauravv.sahu2011@gmail.com |</p>
        <p>222 555 777</p>
      </div>
      <div class="logo">SCHOOL MICROSERVICES</div>
    </div>

    <h2 class="invoice-title">School Invoice</h2>

    <div class="info">
      <p><strong>Invoice Number:</strong> ${data.invoiceId}</p>
      <p><strong>Student:</strong> ${data.student.name} (Class ${data.student.classNumber})</p>
      <p><strong>Email:</strong> ${data.student.email}</p>
      <p><strong>Session:</strong> ${data.sessionName}</p>
    </div>

    <h3>Monthly Summary</h3>
    <table>
      <thead>
        <tr>
          <th>Month</th>
          <th>Generated</th>
          <th>Receipt</th>
          <th>Waiver</th>
          <th>Pending</th>
        </tr>
      </thead>
      <tbody>
        ${summaryRows}
      </tbody>
    </table>

    <h3>Detailed Breakdown</h3>
    <table>
      <thead>
        <tr>
          <th>Month</th>
          <th>Fee Head</th>
          <th>Total Value</th>
          <th>Receipt</th>
          <th>Waiver</th>
          <th>Paid</th>
          <th>Pending</th>
        </tr>
      </thead>
      <tbody>
        ${detailRows}
      </tbody>
    </table>

    <div class="totals">
      <p><strong>Payment Due Date:</strong> ${data.dueDate}</p>
    </div>

    <div class="footer">
      <p><strong>Bank Transfer:</strong> Please make payments to <b>School Microservices</b></p>
      <p>Account Number: 777777 at <b>GBI</b></p>
      <p>For any questions, contact us at gaurav.sahu2011@gmail.com</p>
    </div>
  </body>
</html>
`;
}
