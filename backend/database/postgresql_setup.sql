-- Executer ce script avec un role PostgreSQL administrateur.
-- Remplacer les deux valeurs marquees avant execution.
-- Ne jamais versionner un mot de passe reel dans ce fichier.

CREATE ROLE noema_user LOGIN PASSWORD 'REMPLACER_PAR_UN_SECRET_FORT';
CREATE DATABASE noema OWNER noema_user;
GRANT ALL PRIVILEGES ON DATABASE noema TO noema_user;

-- Connexion ensuite a la base noema avec noema_user, puis Django cree les tables.
