import jsPDF from "jspdf";
import { SchoolDetailResponse } from "@/types";

export function generateBrochurePDF(school: SchoolDetailResponse) {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  // --- Helper functions ---
  const primaryColor: [number, number, number] = [0, 150, 136]; // teal
  const darkColor: [number, number, number] = [30, 30, 30];
  const grayColor: [number, number, number] = [100, 100, 100];
  const lightGray: [number, number, number] = [240, 240, 240];

  function checkPageBreak(needed: number) {
    if (y + needed > pageHeight - 25) {
      doc.addPage();
      y = margin;
    }
  }

  function drawSectionHeader(title: string) {
    checkPageBreak(18);
    y += 6;
    doc.setFillColor(...primaryColor);
    doc.roundedRect(margin, y, contentWidth, 10, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    doc.text(title, margin + 5, y + 7);
    y += 16;
    doc.setTextColor(...darkColor);
  }

  function drawKeyValue(key: string, value: string) {
    checkPageBreak(8);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...grayColor);
    doc.text(key + ":", margin + 2, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...darkColor);
    const valX = margin + 42;
    const lines = doc.splitTextToSize(value, contentWidth - 44);
    doc.text(lines, valX, y);
    y += lines.length * 5 + 2;
  }

  function drawBulletItem(text: string, indent = 0) {
    checkPageBreak(7);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...darkColor);
    const bulletX = margin + 4 + indent;
    doc.setFillColor(...primaryColor);
    doc.circle(bulletX, y - 1.2, 1.2, "F");
    const lines = doc.splitTextToSize(text, contentWidth - 12 - indent);
    doc.text(lines, bulletX + 4, y);
    y += lines.length * 5 + 1.5;
  }

  // =====================================================================
  // PAGE 1: COVER
  // =====================================================================
  // Background header block
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 100, "F");

  // Decorative accent
  doc.setFillColor(0, 130, 118);
  doc.rect(0, 90, pageWidth, 12, "F");

  // School initials circle
  doc.setFillColor(255, 255, 255);
  doc.circle(pageWidth / 2, 45, 22, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(...primaryColor);
  const initials = school.school_name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .substring(0, 3)
    .toUpperCase();
  doc.text(initials, pageWidth / 2, 52, { align: "center" });

  // School name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  const nameLines = doc.splitTextToSize(school.school_name, contentWidth);
  doc.text(nameLines, pageWidth / 2, 78, { align: "center" });

  // Tagline
  y = 115;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(...grayColor);
  doc.text("School Information Brochure", pageWidth / 2, y, { align: "center" });

  // Divider
  y += 10;
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.8);
  doc.line(margin + 40, y, pageWidth - margin - 40, y);

  // Quick facts grid
  y += 12;
  const facts = [
    ["Location", school.location || "N/A"],
    ["Board", school.board_type || "N/A"],
    ["Established", school.formation_year?.toString() || "N/A"],
    ["Classes", school.class_range || "N/A"],
    ["Principal", school.principal_name || "N/A"],
    ["Director", school.director_name || "N/A"],
  ];

  doc.setFillColor(...lightGray);
  doc.roundedRect(margin, y - 4, contentWidth, facts.length * 10 + 8, 3, 3, "F");

  facts.forEach(([key, val]) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...primaryColor);
    doc.text(key, margin + 8, y + 3);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...darkColor);
    doc.text(val, margin + 55, y + 3);
    y += 10;
  });

  // Contact info
  y += 8;
  if (school.phone || school.email || school.website) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.text("Contact Information", margin, y);
    y += 8;
    if (school.phone) { drawKeyValue("Phone", school.phone); }
    if (school.email) { drawKeyValue("Email", school.email); }
    if (school.website) { drawKeyValue("Website", school.website); }
    if (school.full_address) { drawKeyValue("Address", school.full_address); }
  }

  // Description
  if (school.description) {
    y += 4;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.text("About", margin, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...darkColor);
    const descLines = doc.splitTextToSize(school.description, contentWidth);
    checkPageBreak(descLines.length * 5);
    doc.text(descLines, margin, y);
    y += descLines.length * 5 + 2;
  }

  // =====================================================================
  // PAGE 2+: DETAILED SECTIONS
  // =====================================================================

  // --- Teachers ---
  if (school.teachers && school.teachers.length > 0) {
    doc.addPage();
    y = margin;
    drawSectionHeader("Our Faculty");

    // Table header
    doc.setFillColor(230, 245, 243);
    doc.roundedRect(margin, y - 4, contentWidth, 8, 1, 1, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...primaryColor);
    doc.text("Name", margin + 3, y);
    doc.text("Subject", margin + 55, y);
    doc.text("Experience", margin + 105, y);
    doc.text("Classes", margin + 140, y);
    y += 8;

    school.teachers.forEach((t, i) => {
      checkPageBreak(7);
      if (i % 2 === 0) {
        doc.setFillColor(248, 248, 248);
        doc.rect(margin, y - 4, contentWidth, 7, "F");
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...darkColor);
      doc.text(t.teacher_name, margin + 3, y);
      doc.text(t.subject, margin + 55, y);
      doc.text(`${t.experience} yrs`, margin + 105, y);
      doc.text(t.class_range, margin + 140, y);
      y += 7;
    });
  }

  // --- Facilities ---
  if (school.facilities && school.facilities.length > 0) {
    checkPageBreak(40);
    drawSectionHeader("Facilities & Infrastructure");

    school.facilities.forEach((f) => {
      drawBulletItem(
        f.facility_description
          ? `${f.facility_name} - ${f.facility_description}`
          : f.facility_name
      );
    });
  }

  // --- Extracurriculars ---
  if (school.extracurriculars && school.extracurriculars.length > 0) {
    checkPageBreak(40);
    drawSectionHeader("Extracurricular Activities");

    const grouped: Record<string, string[]> = {};
    school.extracurriculars.forEach((e) => {
      const label =
        e.activity_type === "club" ? "Clubs & Activities" :
        e.activity_type === "competitive_prep" ? "Competitive Preparation" :
        "Sports & Fitness";
      if (!grouped[label]) grouped[label] = [];
      grouped[label].push(e.activity_name);
    });

    Object.entries(grouped).forEach(([category, items]) => {
      checkPageBreak(12);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...primaryColor);
      doc.text(category, margin + 2, y);
      y += 6;
      items.forEach((item) => drawBulletItem(item, 4));
      y += 2;
    });
  }

  // --- Reviews Summary ---
  if (school.reviews && school.reviews.length > 0) {
    checkPageBreak(40);
    drawSectionHeader("Student Reviews");

    const avgRating = (
      school.reviews.reduce((sum, r) => sum + r.rating, 0) / school.reviews.length
    ).toFixed(1);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...darkColor);
    doc.text(`Average Rating: ${avgRating}/10`, margin + 2, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...grayColor);
    doc.text(`(Based on ${school.reviews.length} reviews)`, margin + 60, y);
    y += 8;

    // Show top 5 reviews
    const topReviews = [...school.reviews]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);

    topReviews.forEach((r) => {
      checkPageBreak(16);
      doc.setFillColor(248, 248, 248);
      doc.roundedRect(margin, y - 3, contentWidth, 13, 2, 2, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...primaryColor);
      doc.text(`${r.student_name || "Student"} (${r.rating}/10)`, margin + 4, y + 2);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...darkColor);
      const reviewLines = doc.splitTextToSize(r.review, contentWidth - 10);
      doc.text(reviewLines[0], margin + 4, y + 7);
      y += 15;
    });
  }

  // --- Advertisements / Announcements ---
  if (school.ads && school.ads.length > 0) {
    checkPageBreak(30);
    drawSectionHeader("Current Announcements");

    school.ads.forEach((ad) => {
      checkPageBreak(18);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...darkColor);
      doc.text(ad.title, margin + 2, y);
      y += 5;
      if (ad.description) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...grayColor);
        const adLines = doc.splitTextToSize(ad.description, contentWidth - 4);
        doc.text(adLines, margin + 2, y);
        y += adLines.length * 4.5 + 2;
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...primaryColor);
      doc.text(`Valid: ${ad.start_date} to ${ad.end_date}`, margin + 2, y);
      y += 8;
    });
  }

  // =====================================================================
  // FOOTER on every page
  // =====================================================================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    // Footer line
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    // Footer text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...grayColor);
    doc.text(
      `${school.school_name} | Generated by EduFind`,
      margin,
      pageHeight - 10
    );
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 10, {
      align: "right",
    });
  }

  // Save
  const filename = school.school_name.replace(/[^a-zA-Z0-9]/g, "_") + "_Brochure.pdf";
  doc.save(filename);
}
