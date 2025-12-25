package com.example.EGA.utils;


import org.iban4j.CountryCode;
import org.iban4j.Iban;
import org.iban4j.IbanFormatException;

public class IbanUtil {

    // Génération d'un IBAN aléatoire basé sur le nom du propriétaire
    public static String generateIban(String ownerName) {
        try {
            return new Iban.Builder()
                    .countryCode(CountryCode.FR)
                    .bankCode("30003")
                    .branchCode("01234")
                    .accountNumber(String.valueOf((int)(Math.random() * 99999999)))
                    .build()
                    .toString();
        } catch (IbanFormatException e) {
            throw new RuntimeException("Erreur lors de la génération du numéro IBAN : " + e.getMessage());
        }
    }
}
 
