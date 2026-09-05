export const demoProperties = [
  { id: "PROP-001", name: "Villa Ndar", type: "Villa", district: "Almadies", city: "Dakar", owner: "Aminata Fall", rent: 850000, status: "Loué", occupancy: "Awa Cissé", rooms: 6 },
  { id: "PROP-002", name: "Résidence Mermoz", type: "Immeuble", district: "Mermoz", city: "Dakar", owner: "SCI Teranga", rent: 475000, status: "Loué", occupancy: "Moussa Diop", rooms: 4 },
  { id: "PROP-003", name: "Studio Point E", type: "Studio", district: "Point E", city: "Dakar", owner: "Cheikh Sarr", rent: 325000, status: "Loué", occupancy: "Fatou Ndiaye", rooms: 1 },
  { id: "PROP-004", name: "Bureau Horizon", type: "Bureau", district: "Plateau", city: "Dakar", owner: "Sokhna Ba", rent: 1200000, status: "Loué", occupancy: "Baobab Conseil", rooms: 7 },
  { id: "PROP-005", name: "Appartement Mamelles B2", type: "Appartement", district: "Mamelles", city: "Dakar", owner: "Aminata Fall", rent: 550000, status: "Disponible", occupancy: "—", rooms: 4 },
  { id: "PROP-006", name: "Commerce Keur Massar", type: "Commerce", district: "Keur Massar", city: "Dakar", owner: "Mamadou Ly", rent: 285000, status: "Maintenance", occupancy: "—", rooms: 2 },
];

export const demoOwners = [
  { initials: "AF", name: "Aminata Fall", kind: "Particulier", phone: "+221 77 450 18 32", properties: 5, collected: 3250000, net: 2860000 },
  { initials: "ST", name: "SCI Teranga", kind: "Société", phone: "+221 33 821 06 42", properties: 8, collected: 4100000, net: 3685000 },
  { initials: "CS", name: "Cheikh Sarr", kind: "Particulier", phone: "+221 76 301 24 76", properties: 3, collected: 975000, net: 872000 },
  { initials: "SB", name: "Sokhna Ba", kind: "Particulier", phone: "+221 78 009 11 28", properties: 4, collected: 2150000, net: 1915000 },
];

export const demoTenants = [
  { initials: "AC", name: "Awa Cissé", phone: "+221 77 801 20 44", property: "Villa Ndar", since: "01 jan. 2025", balance: 0, status: "À jour" },
  { initials: "MD", name: "Moussa Diop", phone: "+221 76 208 31 15", property: "Résidence Mermoz · A3", since: "15 mars 2024", balance: 0, status: "À jour" },
  { initials: "FN", name: "Fatou Ndiaye", phone: "+221 78 652 48 09", property: "Studio Point E", since: "01 juin 2026", balance: 125000, status: "Partiel" },
  { initials: "IB", name: "Ibrahima Ba", phone: "+221 70 104 75 86", property: "Bureau Horizon", since: "01 sept. 2023", balance: 1200000, status: "En retard" },
];

export const demoContracts = [
  { ref: "BAIL-2026-018", tenant: "Awa Cissé", property: "Villa Ndar", start: "01 jan. 2025", end: "31 déc. 2026", rent: 850000, status: "Actif" },
  { ref: "BAIL-2026-014", tenant: "Moussa Diop", property: "Résidence Mermoz · A3", start: "15 mars 2024", end: "14 mars 2027", rent: 475000, status: "Actif" },
  { ref: "BAIL-2026-027", tenant: "Fatou Ndiaye", property: "Studio Point E", start: "01 juin 2026", end: "31 mai 2027", rent: 325000, status: "Actif" },
  { ref: "BAIL-2025-009", tenant: "Ibrahima Ba", property: "Bureau Horizon", start: "01 sept. 2023", end: "31 août 2026", rent: 1200000, status: "Expire bientôt" },
];

export const demoPayments = [
  { ref: "PAY-2026-0821", date: "29 août 2026", tenant: "Awa Cissé", property: "Villa Ndar", amount: 850000, method: "Wave", status: "Confirmé" },
  { ref: "PAY-2026-0820", date: "28 août 2026", tenant: "Moussa Diop", property: "Résidence Mermoz · A3", amount: 475000, method: "Virement", status: "Confirmé" },
  { ref: "PAY-2026-0819", date: "27 août 2026", tenant: "Fatou Ndiaye", property: "Studio Point E", amount: 200000, method: "Orange Money", status: "Partiel" },
  { ref: "PAY-2026-0818", date: "26 août 2026", tenant: "Baobab Conseil", property: "Bureau Horizon", amount: 1200000, method: "Chèque", status: "Confirmé" },
];

export const demoLeads = [
  { name: "Mame Diarra Sow", need: "Villa · Almadies", budget: "1,2M – 1,8M", score: 94, status: "Nouveau", agent: "MK" },
  { name: "Ousmane Gueye", need: "Appartement · Mermoz", budget: "450K – 650K", score: 88, status: "Contacté", agent: "FD" },
  { name: "Khadija Diallo", need: "Bureau · Plateau", budget: "800K – 1,4M", score: 91, status: "Qualifié", agent: "MK" },
  { name: "Jean-Baptiste Faye", need: "Studio · Point E", budget: "250K – 400K", score: 84, status: "Visite prévue", agent: "AS" },
  { name: "Marième Seck", need: "Villa · Mamelles", budget: "900K – 1,3M", score: 92, status: "Négociation", agent: "FD" },
];

export const demoVisits = [
  { time: "09:30", date: "31 août", lead: "Mame Diarra Sow", property: "Villa Ndar", agent: "Mamadou Kane", status: "Confirmée" },
  { time: "11:00", date: "31 août", lead: "Ousmane Gueye", property: "Appartement Mamelles B2", agent: "Fatou Dièye", status: "Planifiée" },
  { time: "15:30", date: "01 sept.", lead: "Khadija Diallo", property: "Bureau Horizon", agent: "Mamadou Kane", status: "Planifiée" },
];

export const demoExpenses = [
  { ref: "DEP-2026-204", date: "28 août", category: "Réparation", item: "Pompe à eau", property: "Villa Ndar", vendor: "Hydro Service", amount: 185000 },
  { ref: "DEP-2026-203", date: "26 août", category: "Nettoyage", item: "Parties communes", property: "Résidence Mermoz", vendor: "Sen Clean", amount: 75000 },
  { ref: "DEP-2026-202", date: "22 août", category: "Électricité", item: "Remplacement tableau", property: "Bureau Horizon", vendor: "ElecPro", amount: 320000 },
];

export const demoTickets = [
  { ref: "MAINT-041", property: "Villa Ndar", title: "Fuite sur canalisation cuisine", urgency: "Urgent", owner: "Hydro Service", opened: "Aujourd’hui", status: "Assigné" },
  { ref: "MAINT-040", property: "Résidence Mermoz", title: "Interphone du hall en panne", urgency: "Normal", owner: "ElecPro", opened: "28 août", status: "En cours" },
  { ref: "MAINT-039", property: "Studio Point E", title: "Climatisation à réviser", urgency: "Faible", owner: "ClimaFroid", opened: "25 août", status: "En attente" },
];

export const formatXof = (value: number) => `${new Intl.NumberFormat("fr-FR").format(value)} FCFA`;
