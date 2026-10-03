import PDFDocument from "pdfkit";

type TicketData = {
  id: string;
  ticket_type: string;
  price: number;
  qr_code: string;
};

type PdfData = {
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  orderId: string;
  holderEmail: string;
  tickets: TicketData[];
};

async function fetchQrBuffer(qrCode: string): Promise<Buffer> {
  const url =
    "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" +
    encodeURIComponent(qrCode);
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function generateTicketPdf(data: PdfData): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 40 });
      const chunks: Buffer[] = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const qrBuffers: Buffer[] = [];
      for (const t of data.tickets) {
        const buf = await fetchQrBuffer(t.qr_code);
        qrBuffers.push(buf);
      }

      for (let i = 0; i < data.tickets.length; i++) {
        if (i > 0) doc.addPage();
        const t = data.tickets[i];
        const qr = qrBuffers[i];

        // Header bar
        doc.rect(0, 0, doc.page.width, 90).fill("#000000");
        doc
          .fill("#FFFFFF")
          .fontSize(28)
          .text("ADMISSION TICKET", 40, 30, { width: doc.page.width - 80 });

        // Event title
        doc
          .fill("#000000")
          .fontSize(26)
          .text(data.eventTitle, 40, 130, { width: doc.page.width - 80 });

        doc.moveDown(0.3);
        doc.fontSize(12).fillColor("#666666");
        doc.text(data.eventDate, 40, 180);
        doc.text("Doors " + data.eventTime, 40, 200);

        // Ticket type box
        const boxY = 240;
        doc
          .rect(40, boxY, doc.page.width - 80, 60)
          .fillAndStroke("#F5F5F5", "#DDDDDD");
        doc
          .fillColor("#999999")
          .fontSize(9)
          .text("TICKET TYPE", 55, boxY + 12);
        doc
          .fillColor("#000000")
          .fontSize(16)
          .text(t.ticket_type, 55, boxY + 28);
        doc
          .fontSize(14)
          .fillColor("#000000")
          .text("£" + t.price.toFixed(2), doc.page.width - 140, boxY + 28, {
            width: 100,
            align: "right",
          });

        // QR code
        const qrY = 340;
        doc.image(qr, 40, qrY, { width: 180, height: 180 });

        // Ticket details next to QR
        const detailsX = 250;
        doc.fillColor("#999999").fontSize(9).text("TICKET HOLDER", detailsX, qrY);
        doc.fillColor("#000000").fontSize(11).text(data.holderEmail, detailsX, qrY + 14, { width: 280 });

        doc.fillColor("#999999").fontSize(9).text("ORDER REFERENCE", detailsX, qrY + 44);
        doc
          .fillColor("#000000")
          .fontSize(11)
          .font("Courier")
          .text(data.orderId.slice(0, 8).toUpperCase(), detailsX, qrY + 58);

        doc.font("Helvetica");
        doc.fillColor("#999999").fontSize(9).text("TICKET ID", detailsX, qrY + 88);
        doc
          .fillColor("#000000")
          .fontSize(8)
          .font("Courier")
          .text(t.qr_code, detailsX, qrY + 102, { width: 300 });

        doc.font("Helvetica");

        // Footer
        doc
          .fillColor("#999999")
          .fontSize(9)
          .text(
            "Present this ticket at the door. Each QR code is valid for one entry only.",
            40,
            doc.page.height - 80,
            { width: doc.page.width - 80, align: "center" }
          );
        doc
          .fillColor("#000000")
          .fontSize(11)
          .text("ticketai.org.uk", 40, doc.page.height - 55, {
            width: doc.page.width - 80,
            align: "center",
          });
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
