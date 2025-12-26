-- 📌 Création d'un utilisateur admin (mdp : admin)
INSERT INTO users (id, username, password) VALUES
(1, 'admin@ega.com', '$2a$10$5Y9EdfyX7PG6nULzMZ0KZ.J6M5dP8xV.UF1FCpljPlNf74v1WVU3m');

-- 📌 Clients
INSERT INTO clients (id, nom, prenom, date_naissance, sexe, adresse, telephone, email, nationalite) VALUES
(1, 'Doe', 'John', '1990-05-12', 'HOMME', 'Lomé', '900112233', 'john.doe@gmail.com', 'Togolaise'),
(2, 'Smith', 'Anna', '1995-08-22', 'FEMME', 'Kara', '900445566', 'anna.smith@gmail.com', 'Togolaise');

-- 📌 Comptes (attention au nom de table : comptes)
INSERT INTO comptes (id, numero_compte, type_compte, date_creation, solde, proprietaire_id) VALUES
(1, 'FR300030123400000001', 'COURANT', CURRENT_DATE, 50000, 1),
(2, 'FR300030123400000002', 'EPARGNE', CURRENT_DATE, 120000, 2);

-- 📌 Transactions (mot réservé → garder ce nom mais MySQL accepte)
INSERT INTO transactions (id, type_transaction, montant, date_transaction, compte_id, compte_dest_id) VALUES (1, 'DEPOT', 20000, CURRENT_TIMESTAMP, NULL, 1);
INSERT INTO transactions (id, type_transaction, montant, date_transaction, compte_id, compte_dest_id) VALUES (2, 'RETRAIT', 15000, CURRENT_TIMESTAMP, 1, NULL);
INSERT INTO transactions (id, type_transaction, montant, date_transaction, compte_id, compte_dest_id) VALUES (3, 'VIREMENT', 10000, CURRENT_TIMESTAMP, 1, 2);
