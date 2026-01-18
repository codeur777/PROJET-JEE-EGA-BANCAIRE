package com.example.EGA.service.impl;

import com.example.EGA.entity.Compte;
import com.example.EGA.entity.Transaction;
import com.example.EGA.entity.Client;
import com.example.EGA.repository.CompteRepository;
import com.example.EGA.repository.TransactionRepository;
import com.example.EGA.service.ReleveService;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReleveServiceImpl implements ReleveService {

    private final CompteRepository compteRepository;
    private final TransactionRepository transactionRepository;

    @Override
    public byte[] generateRelevePDF(Long compteId, LocalDate dateDebut, LocalDate dateFin) {
        long startTime = System.currentTimeMillis();
        System.out.println("=== DÉBUT GÉNÉRATION PDF ===");
        System.out.println("Compte ID: " + compteId + ", Période: " + dateDebut + " à " + dateFin);

        try {
            Compte compte = compteRepository.findByIdWithClient(compteId)
                    .orElseThrow(() -> new RuntimeException("Compte introuvable"));

            System.out.println("Compte trouvé: " + compte.getNumeroCompte());

            Client client = compte.getProprietaire();
            if (client == null) {
                throw new RuntimeException("Client introuvable pour ce compte");
            }

            System.out.println("Client trouvé: " + client.getNom() + " " + client.getPrenom());

            List<Transaction> transactions = getTransactionsForReleve(compteId, dateDebut, dateFin);
            System.out.println("Transactions chargées: " + transactions.size());

            long pdfStartTime = System.currentTimeMillis();
            System.out.println("Début génération PDF physique...");

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);

            try {
                // Génération du contenu PDF
                System.out.println("Génération en-tête...");
                generatePDFHeader(document);

                System.out.println("Génération infos client...");
                generateClientInfo(document, client);

                System.out.println("Génération infos compte...");
                generateAccountInfo(document, compte);

                System.out.println("Génération transactions...");
                generateTransactionsTable(document, transactions, compte);

                System.out.println("Génération résumé...");
                generateSummary(document, transactions, compteId);

                System.out.println("Génération pied de page...");
                generateFooter(document);

                System.out.println("PDF généré avec succès");

                return baos.toByteArray();

            } finally {
                document.close();
                System.out.println("Document PDF fermé");
            }

        } catch (Exception e) {
            System.err.println("ERREUR lors de la génération du PDF: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de la génération du PDF: " + e.getMessage(), e);
        } finally {
            long endTime = System.currentTimeMillis();
            System.out.println("=== FIN GÉNÉRATION PDF === Temps total: " + (endTime - startTime) + "ms");
        }
    }

    @Override
    public List<Transaction> getTransactionsForReleve(Long compteId, LocalDate dateDebut, LocalDate dateFin) {
        Compte compte = compteRepository.findById(compteId)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));

        LocalDateTime start = dateDebut.atStartOfDay();
        LocalDateTime end = dateFin.atTime(23, 59, 59);

        return transactionRepository.findByCompteAndDateTransactionBetween(compte, start, end);
    }

    private String getLibelle(Transaction tx) {
        switch (tx.getTypeTransaction().name()) {
            case "DEPOT":
                return "Dépôt sur compte";
            case "RETRAIT":
                return "Retrait d'espèces";
            case "VIREMENT":
                if (tx.getCompteDestinataire() != null) {
                    return "Virement vers compte " + tx.getCompteDestinataire().getNumeroCompte();
                } else {
                    return "Virement depuis compte externe";
                }
            default:
                return "Opération bancaire";
        }
    }

    private boolean isDebit(Transaction tx, Long compteId) {
        if (tx.getTypeTransaction().name().equals("RETRAIT")) return true;
        if (tx.getTypeTransaction().name().equals("VIREMENT") && tx.getCompte().getId().equals(compteId)) return true;
        return false;
    }

    private void generatePDFHeader(Document document) {
        try {
            System.out.println("  -> Création en-tête banque...");
            // En-tête de la banque
            Paragraph bankHeader = new Paragraph("EGA BANK")
                    .setFontSize(20)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(10);
            document.add(bankHeader);

            Paragraph bankInfo = new Paragraph("Siège social: Avenue de la Libération, Lomé, Togo\n" +
                    "Téléphone: +228 22 XX XX XX | Email: contact@egabank.tg")
                    .setFontSize(10)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20);
            document.add(bankInfo);

            // Titre du relevé
            Paragraph title = new Paragraph("RELEVÉ DE COMPTE")
                    .setFontSize(16)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20);
            document.add(title);
            System.out.println("  -> En-tête créé avec succès");
        } catch (Exception e) {
            System.err.println("  -> ERREUR dans generatePDFHeader: " + e.getMessage());
            throw new RuntimeException("Erreur lors de la génération de l'en-tête PDF", e);
        }
    }

    private void generateClientInfo(Document document, Client client) {
        try {
            System.out.println("  -> Création infos client...");
            if (client == null) {
                throw new IllegalArgumentException("Client est null");
            }

            // Informations du client
            Paragraph clientTitle = new Paragraph("INFORMATIONS DU TITULAIRE")
                    .setFontSize(12)
                    .setMarginBottom(10);
            document.add(clientTitle);

            Table clientTable = new Table(UnitValue.createPercentArray(new float[]{1, 2}));
            clientTable.setWidth(UnitValue.createPercentValue(100));

            String nomComplet = (client.getNom() != null ? client.getNom() : "N/A") + " " +
                               (client.getPrenom() != null ? client.getPrenom() : "N/A");
            clientTable.addCell(new Cell().add(new Paragraph("Nom complet")).setFontSize(10));
            clientTable.addCell(new Cell().add(new Paragraph(nomComplet)).setFontSize(10));

            clientTable.addCell(new Cell().add(new Paragraph("Email")).setFontSize(10));
            clientTable.addCell(new Cell().add(new Paragraph(client.getEmail() != null ? client.getEmail() : "N/A")).setFontSize(10));

            clientTable.addCell(new Cell().add(new Paragraph("Téléphone")).setFontSize(10));
            clientTable.addCell(new Cell().add(new Paragraph(client.getTelephone() != null ? client.getTelephone() : "N/A")).setFontSize(10));

            clientTable.addCell(new Cell().add(new Paragraph("Adresse")).setFontSize(10));
            clientTable.addCell(new Cell().add(new Paragraph(client.getAdresse() != null ? client.getAdresse() : "N/A")).setFontSize(10));

            document.add(clientTable);
            document.add(new Paragraph("\n"));
            System.out.println("  -> Infos client créées avec succès");
        } catch (Exception e) {
            System.err.println("  -> ERREUR dans generateClientInfo: " + e.getMessage());
            throw new RuntimeException("Erreur lors de la génération des informations client", e);
        }
    }

    private void generateAccountInfo(Document document, Compte compte) {
        // Informations du compte
        Paragraph compteTitle = new Paragraph("DÉTAILS DU COMPTE")
                .setFontSize(12)
                .setMarginBottom(10);
        document.add(compteTitle);

        Table compteTable = new Table(UnitValue.createPercentArray(new float[]{1, 2}));
        compteTable.setWidth(UnitValue.createPercentValue(100));

        compteTable.addCell(new Cell().add(new Paragraph("Numéro de compte")).setFontSize(10));
        compteTable.addCell(new Cell().add(new Paragraph(compte.getNumeroCompte())).setFontSize(10));

        compteTable.addCell(new Cell().add(new Paragraph("Type de compte")).setFontSize(10));
        compteTable.addCell(new Cell().add(new Paragraph(compte.getTypeCompte().name())).setFontSize(10));

        compteTable.addCell(new Cell().add(new Paragraph("Solde actuel")).setFontSize(10));
        compteTable.addCell(new Cell().add(new Paragraph(compte.getSolde() + " CFA")).setFontSize(10));

        document.add(compteTable);
        document.add(new Paragraph("\n"));
    }

    private void generateTransactionsTable(Document document, List<Transaction> transactions, Compte compte) {
        try {
            System.out.println("  -> Création tableau transactions (" + transactions.size() + " transactions)...");

            // Tableau des transactions
            Paragraph transactionsTitle = new Paragraph("HISTORIQUE DES TRANSACTIONS")
                    .setFontSize(12)
                    .setMarginBottom(10);
            document.add(transactionsTitle);

            if (transactions.isEmpty()) {
                document.add(new Paragraph("Aucune transaction trouvée pour cette période").setFontSize(10));
                System.out.println("  -> Aucune transaction à afficher");
            } else {
                Table transactionTable = new Table(UnitValue.createPercentArray(new float[]{2, 3, 1, 1, 1, 1}));
                transactionTable.setWidth(UnitValue.createPercentValue(100));

                // En-têtes
                transactionTable.addHeaderCell(new Cell().add(new Paragraph("Date")).setFontSize(10));
                transactionTable.addHeaderCell(new Cell().add(new Paragraph("Libellé")).setFontSize(10));
                transactionTable.addHeaderCell(new Cell().add(new Paragraph("Type")).setFontSize(10));
                transactionTable.addHeaderCell(new Cell().add(new Paragraph("Débit")).setFontSize(10));
                transactionTable.addHeaderCell(new Cell().add(new Paragraph("Crédit")).setFontSize(10));
                transactionTable.addHeaderCell(new Cell().add(new Paragraph("Solde")).setFontSize(10));

                // Calculer le solde initial (solde actuel moins toutes les transactions de la période)
                BigDecimal soldeInitial = compte.getSolde();
                System.out.println("  -> Solde actuel du compte: " + soldeInitial);

                for (Transaction tx : transactions) {
                    if (isDebit(tx, compte.getId())) {
                        soldeInitial = soldeInitial.add(tx.getMontant()); // Annuler les débits
                    } else {
                        soldeInitial = soldeInitial.subtract(tx.getMontant()); // Annuler les crédits
                    }
                }
                System.out.println("  -> Solde initial calculé: " + soldeInitial);

                // Trier les transactions par date croissante
                transactions.sort((a, b) -> a.getDateTransaction().compareTo(b.getDateTransaction()));

                BigDecimal soldeCourant = soldeInitial;

                for (int i = 0; i < transactions.size(); i++) {
                    Transaction tx = transactions.get(i);
                    System.out.println("  -> Traitement transaction " + (i+1) + ": " + tx.getTypeTransaction() + " - " + tx.getMontant());

                    try {
                        transactionTable.addCell(new Cell().add(new Paragraph(
                                tx.getDateTransaction().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")))).setFontSize(9));
                        transactionTable.addCell(new Cell().add(new Paragraph(getLibelle(tx))).setFontSize(9));
                        transactionTable.addCell(new Cell().add(new Paragraph(tx.getTypeTransaction().name())).setFontSize(9));

                        if (isDebit(tx, compte.getId())) {
                            transactionTable.addCell(new Cell().add(new Paragraph("-" + tx.getMontant() + " CFA")).setFontSize(9));
                            transactionTable.addCell(new Cell().add(new Paragraph("")).setFontSize(9));
                            soldeCourant = soldeCourant.subtract(tx.getMontant());
                        } else {
                            transactionTable.addCell(new Cell().add(new Paragraph("")).setFontSize(9));
                            transactionTable.addCell(new Cell().add(new Paragraph("+" + tx.getMontant() + " CFA")).setFontSize(9));
                            soldeCourant = soldeCourant.add(tx.getMontant());
                        }

                        transactionTable.addCell(new Cell().add(new Paragraph(soldeCourant + " CFA")).setFontSize(9));
                    } catch (Exception e) {
                        System.err.println("  -> ERREUR lors du traitement de la transaction " + (i+1) + ": " + e.getMessage());
                        throw e;
                    }
                }

                document.add(transactionTable);
                System.out.println("  -> Tableau transactions créé avec succès");
            }
        } catch (Exception e) {
            System.err.println("  -> ERREUR dans generateTransactionsTable: " + e.getMessage());
            throw new RuntimeException("Erreur lors de la génération du tableau des transactions", e);
        }
    }

    private void generateSummary(Document document, List<Transaction> transactions, Long compteId) {
        document.add(new Paragraph("\n"));

        // Résumé
        Paragraph resumeTitle = new Paragraph("RÉSUMÉ DE LA PÉRIODE")
                .setFontSize(12)
                .setMarginBottom(10);
        document.add(resumeTitle);

        BigDecimal totalCredits = transactions.stream()
                .filter(tx -> !isDebit(tx, compteId))
                .map(Transaction::getMontant)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalDebits = transactions.stream()
                .filter(tx -> isDebit(tx, compteId))
                .map(Transaction::getMontant)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Table resumeTable = new Table(UnitValue.createPercentArray(new float[]{1, 1}));
        resumeTable.setWidth(UnitValue.createPercentValue(100));

        resumeTable.addCell(new Cell().add(new Paragraph("Nombre d'opérations")).setFontSize(10));
        resumeTable.addCell(new Cell().add(new Paragraph(String.valueOf(transactions.size()))).setFontSize(10));

        resumeTable.addCell(new Cell().add(new Paragraph("Total crédits")).setFontSize(10));
        resumeTable.addCell(new Cell().add(new Paragraph("+" + totalCredits + " CFA")).setFontSize(10));

        resumeTable.addCell(new Cell().add(new Paragraph("Total débits")).setFontSize(10));
        resumeTable.addCell(new Cell().add(new Paragraph("-" + totalDebits + " CFA")).setFontSize(10));

        document.add(resumeTable);
    }

    private void generateFooter(Document document) {
        // Pied de page
        document.add(new Paragraph("\n\n"));
        Paragraph footer = new Paragraph("Ce document est un relevé de compte officiel généré électroniquement.\n" +
                "Pour toute réclamation, veuillez contacter notre service client dans un délai de 30 jours.\n\n" +
                "Lomé, le " + LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")) + "\n\n" +
                "Direction EGA BANK")
                .setFontSize(8)
                .setTextAlignment(TextAlignment.CENTER);
        document.add(footer);
    }
}