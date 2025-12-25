-- Création d'un utilisateur admin (mot de passe: admin)
INSERT INTO users (id, username, password) VALUES (1, 'admin@ega.com', '$2a$10$5Y9EdfyX7PG6nULzMZ0KZ.J6M5dP8xV.UF1FCpljPlNf74v1WVU3m');

-- Clients
INSERT INTO clients (id, nom, prenom, date_naissance, sexe, adresse, telephone, email, nationalite) VALUES
(1, 'Doe', 'John', '1990-05-12', 'HOMME', 'Lomé', '900112233', 'john.doe@gmail.com', 'Togolaise'),
(2, 'Smith', 'Anna', '1995-08-22', 'FEMME', 'Kara', '900445566', 'anna.smith@gmail.com', 'Togolaise');

-- Comptes
INSERT INTO compte (id, numero_compte, type_compte, date_creation, solde, proprietaire_id) VALUES
(1, 'FR300030123400000001', 'COURANT', CURRENT_DATE, 50000, 1),
(2, 'FR300030123400000002', 'EPARGNE', CURRENT_DATE, 120000, 2);

-- Transactions d'exemple
INSERT INTO transaction (id, date_transaction, montant, type_transaction, compte_id, compte_destinataire_id) VALUES
(1, CURRENT_TIMESTAMP, 20000, 'DEPOT', NULL, 1),
(2, CURRENT_TIMESTAMP, 15000, 'RETRAIT', 1, NULL),
(3, CURRENT_TIMESTAMP, 10000, 'VIREMENT', 1, 2);
