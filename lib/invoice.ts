import { formatDate, formatHour } from "./format";
import type { Booking } from "./types";

// jsPDF's built-in fonts can't draw "$" spacing nicely with Intl output on every platform, so format plainly.
const usd = (n: number) => `$${n.toFixed(2)}`;

/** Builds and downloads a PDF receipt for a confirmed or completed booking. Loaded on demand. */
export async function downloadInvoice(booking: Booking) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const M = 48;
  const invoiceNo = `SD-${booking._id.slice(-8).toUpperCase()}`;

  // Header band
  doc.setFillColor(232, 85, 59);
  doc.rect(0, 0, W, 96, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("SD Studio", M, 58);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Booking receipt", W - M, 50, { align: "right" });
  doc.text(invoiceNo, W - M, 66, { align: "right" });

  // Billed to / booking info
  doc.setTextColor(30, 26, 36);
  let y = 140;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("BILLED TO", M, y);
  doc.text("RECEIPT DETAILS", W / 2, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  y += 18;
  doc.text(booking.guestName, M, y);
  doc.text(`Issued: ${new Date().toLocaleDateString("en-US", { dateStyle: "medium" })}`, W / 2, y);
  y += 16;
  doc.text(booking.guestEmail, M, y);
  doc.text(`Status: ${booking.status[0].toUpperCase()}${booking.status.slice(1)}`, W / 2, y);

  // Session
  y += 44;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("SESSION", M, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  y += 20;
  doc.text(booking.studio.title, M, y);
  doc.setFontSize(11);
  doc.setTextColor(100, 96, 110);
  y += 16;
  doc.text(`${booking.studio.category} · ${booking.studio.city}`, M, y);
  y += 16;
  doc.text(
    `${formatDate(booking.date)}, ${formatHour(booking.startHour)} – ${formatHour(booking.endHour)} (${booking.hours} hour${booking.hours > 1 ? "s" : ""})`,
    M,
    y,
  );

  // Line items
  y += 40;
  doc.setTextColor(30, 26, 36);
  doc.setDrawColor(220, 214, 204);
  doc.line(M, y, W - M, y);
  const row = (label: string, value: string, bold = false) => {
    y += 24;
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.text(label, M, y);
    doc.text(value, W - M, y, { align: "right" });
  };
  const p = booking.pricing;
  row(`Studio time (${usd(p.hourlyRate)} × ${booking.hours}h)`, usd(p.subtotal));
  row("Service fee (5%)", usd(p.serviceFee));
  row("Security deposit (refundable)", usd(p.securityDeposit ?? 0));
  y += 12;
  doc.line(M, y, W - M, y);
  doc.setFontSize(13);
  row("Total", usd(p.total), true);

  // Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120, 116, 130);
  doc.text(
    "The security deposit is returned by the host after the session if the studio and equipment are left in good condition.",
    M,
    760,
    { maxWidth: W - M * 2 },
  );
  doc.text("Thank you for creating with SD Studio.", M, 790);

  doc.save(`SD-Studio-receipt-${invoiceNo}.pdf`);
}
