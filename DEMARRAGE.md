# TOUBA VISUEL — Guide de démarrage

## Prérequis

1. **Node.js** (version 18 ou plus) : https://nodejs.org/
2. **PostgreSQL** (base de données) : https://www.postgresql.org/download/
   - Alternative gratuite en ligne : https://neon.tech ou https://supabase.com

---

## Installation (5 étapes)

### 1. Installer les dépendances
```bash
npm install
```

### 2. Configurer les variables d'environnement
Ouvrez le fichier `.env.local` et remplacez les valeurs :
- `DATABASE_URL` : votre URL PostgreSQL
- `STRIPE_SECRET_KEY` : clé secrète Stripe (stripe.com)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` : clé publique Stripe
- `WAVE_API_KEY` : clé API Wave (wave.com/business)

### 3. Initialiser la base de données
```bash
npm run db:push
```

### 4. Démarrer l'application
```bash
npm run dev
```

### 5. Ouvrir dans votre navigateur
```
http://localhost:3000
```

---

## Pages de l'application

| Page | URL | Description |
|------|-----|-------------|
| Accueil | `/` | Page d'accueil avec les supports populaires |
| Catalogue | `/catalogue` | Tous les supports (88+) en 8 catégories |
| Commander | `/commande` | Formulaire de commande |
| Suivi | `/suivi` | Suivre l'état d'une commande |
| Paiement | `/paiement` | Informations sur les paiements |
| **Admin** | `/admin` | Gestion des commandes (protéger en prod) |

---

## Supports de communication disponibles (88+)

### 8 catégories :
1. **Impression & Papier** — Flyers, affiches, cartes de visite, brochures, calendriers...
2. **Signalétique & Grand Format** — Banderoles, roll-up, panneaux, enseignes, covering véhicule...
3. **Textile & Objets Publicitaires** — T-shirts, mugs, casquettes, stylos, tote bags...
4. **Numérique & Digital** — Logo, posts réseaux sociaux, vidéos animées, présentations...
5. **Événementiel** — Backdrop, step & repeat, invitations, photobooth...
6. **Conditionnement & Emballage** — Boîtes carton, sacs papier, étiquettes produits...
7. **Identité Corporate** — Kit démarrage, uniformes, habillage flotte véhicules...
8. **Presse & Médias** — Insertions presse, dossiers de presse, communiqués...

---

## Paiements intégrés

- **Stripe** : Carte Visa/Mastercard (international)
- **Wave** : Mobile Money Sénégal
- **Orange Money** : Mobile Money Orange
- **À la livraison** : Cash à la réception

---

## Pour la production (mise en ligne)

```bash
npm run build
npm start
```

Recommandé : déployer sur **Vercel** (gratuit pour démarrer)
```bash
npm install -g vercel
vercel
```
