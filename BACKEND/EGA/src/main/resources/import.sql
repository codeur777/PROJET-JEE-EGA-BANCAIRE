-- 📌 Création d'un utilisateur admin (mdp : admin123)
INSERT INTO users (id, email, password, role, enabled) VALUES
(1, 'admin@egabank.tg', '$2a$10$JLVj5qndzn1Sxb9FsdaGF.KE1/teIaJ/lKpQXWrmCd3kDXWO4Z4Um', 'ADMIN', true);

-- 📌 Clients
INSERT INTO clients (id, nom, prenom, date_naissance, sexe, adresse, telephone, email, nationalite, statut, ville, code_postal, type_document, numero_document, date_inscription) VALUES
(1, 'Doe', 'John', '1990-05-12', 'HOMME', 'Lomé', '900112233', 'john.doe@gmail.com', 'Togolaise', 'ACTIF', 'Lomé', '00228', 'CNI', '123456789', '2024-01-01'),
(2, 'Smith', 'Anna', '1995-08-22', 'FEMME', 'Kara', '900445566', 'anna.smith@gmail.com', 'Togolaise', 'ACTIF', 'Kara', '00228', 'CNI', '987654321', '2024-01-02');

-- 📌 Comptes (attention au nom de table : comptes)
INSERT INTO comptes (id, numero_compte, type_compte, date_creation, solde, client_id) VALUES
(1, 'FR300030123400000001', 'COURANT', '2024-01-10', 50000, 1),
(2, 'FR300030123400000002', 'EPARGNE', '2024-01-12', 120000, 2);

-- 📌 Client Auth (mdp : client123)
INSERT INTO client_auth (id, client_id, email, password, actif) VALUES
(1, 1, 'john.doe@gmail.com', '$2a$10$6J9EdfyX7PG6nULzMZ0KZ.J6M5dP8xV.UF1FCpljPlNf74v1WVU3m', true),
(2, 2, 'anna.smith@gmail.com', '$2a$10$6J9EdfyX7PG6nULzMZ0KZ.J6M5dP8xV.UF1FCpljPlNf74v1WVU3m', true);

-- 📌 Transactions
-- DEPOT sur le compte 1
INSERT INTO transactions (id, type_transaction, montant, date_transaction, compte_id, compte_dest_id)
VALUES (1, 'DEPOT', 20000, '2024-01-15 10:00:00', 1, NULL);

-- RETRAIT depuis le compte 1
INSERT INTO transactions (id, type_transaction, montant, date_transaction, compte_id, compte_dest_id)
VALUES (2, 'RETRAIT', 15000, '2024-01-16 14:30:00', 1, NULL);

-- VIREMENT du compte 1 vers le compte 2
INSERT INTO transactions (id, type_transaction, montant, date_transaction, compte_id, compte_dest_id)
VALUES (3, 'VIREMENT', 10000, '2024-01-17 09:15:00', 1, 2);
