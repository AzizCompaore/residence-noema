# Base de données NOEMA

## Local

SQLite est utilisé uniquement lorsque `DATABASE_URL` et `POSTGRES_DB` ne sont pas définis. Cela permet de travailler sans serveur de base de données.

## PostgreSQL

Définir une seule URL de connexion dans l'environnement du backend :

```env
DATABASE_URL=postgresql://noema_user:mot_de_passe@localhost:5432/noema
```

Ou utiliser les variables `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST` et `POSTGRES_PORT`.

Après configuration :

```powershell
.\backend\.venv\Scripts\python.exe .\backend\manage.py migrate
.\backend\.venv\Scripts\python.exe .\backend\manage.py createsuperuser
.\backend\.venv\Scripts\python.exe .\backend\manage.py check
```

Les formulaires du site passent par `POST /api/leads`, qui est relayé vers Django et enregistré dans le modèle `Lead`. Le tableau mémoire Express n'est plus utilisé pour les nouvelles soumissions.

## Consultation sans CRM

L'administration Django est la première interface commerciale : `/admin/`, puis `Prospects / Leads CRM`. L'action `Exporter les prospects sélectionnés en CSV` permet une extraction contrôlée des données visibles.

En production, les routes de consultation et d'export doivent rester derrière l'authentification Django et HTTPS. Les sauvegardes PostgreSQL doivent être activées chez l'hébergeur et testées régulièrement.