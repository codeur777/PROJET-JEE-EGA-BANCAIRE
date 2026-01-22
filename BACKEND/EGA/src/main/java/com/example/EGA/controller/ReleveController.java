package com.example.EGA.controller;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.EGA.service.ReleveService;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.properties.TextAlignment;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/releves")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ReleveController {

    private final ReleveService releveService;

    @GetMapping(value = "/pdf/{compteId}", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> generateRelevePDF(
            @PathVariable Long compteId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin) {

        try {
            System.out.println("=== DEMANDE PDF ===");
            System.out.println("Compte ID: " + compteId);
            System.out.println("Date début: " + dateDebut);
            System.out.println("Date fin: " + dateFin);

            byte[] pdfContent = releveService.generateRelevePDF(compteId, dateDebut, dateFin);

            System.out.println("PDF généré, taille: " + pdfContent.length + " bytes");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "releve_compte_" + compteId + ".pdf");
            headers.setContentLength(pdfContent.length);

            System.out.println("Headers configurés, envoi de la réponse...");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfContent);

        } catch (Exception e) {
            System.err.println("ERREUR lors de la génération du PDF: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // Endpoint de test pour générer un PDF simple
    @GetMapping(value = "/test-pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> generateTestPDF() {
        try {
            System.out.println("=== GÉNÉRATION PDF TEST ===");

            // PDF simple avec iText
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);

            try {
                document.add(new Paragraph("EGA BANK - PDF TEST")
                        .setFontSize(20)
                        .setTextAlignment(TextAlignment.CENTER));

                document.add(new Paragraph("Test réussi - " + LocalDateTime.now())
                        .setFontSize(12));

                System.out.println("PDF test généré avec succès");
            } finally {
                document.close();
            }

            byte[] pdfContent = baos.toByteArray();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "test.pdf");
            headers.setContentLength(pdfContent.length);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfContent);

        } catch (Exception e) {
            System.err.println("ERREUR PDF test: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}