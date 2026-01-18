package com.example.EGA.controller;

import com.example.EGA.service.ReleveService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

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
            byte[] pdfContent = releveService.generateRelevePDF(compteId, dateDebut, dateFin);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "releve_compte_" + compteId + ".pdf");
            headers.setContentLength(pdfContent.length);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfContent);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}