import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, ClipboardList, Weight, Ruler, Edit, Phone, MapPin } from 'lucide-react';
import { DEMO_ANIMAUX, DEMO_RDV, DEMO_DOSSIERS, ESPECE_LABELS, ETAT_SANTE_CONFIG, TYPE_RDV_LABELS, STATUT_RDV_CONFIG } from '@/lib/vetalert/data';

export function generateStaticParams() {
  return DEMO_ANIMAUX.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const animal = DEMO_ANIMAUX.find((a) => a.id === id);
  return { title: animal ? `Dossier — ${animal.nom}` : 'Animal introuvable' };
}

export default async function FicheAnimalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const animal = DEMO_ANIMAUX.find((a) => a.id === id);
  if (!animal) notFound();

  const rdvAnimal = DEMO_RDV.filter((r) => r.animalId === animal.id);
  const dossiersAnimal = DEMO_DOSSIERS.filter((d) => d.animalId === animal.id);
  const etatConf = ETAT_SANTE_CONFIG[animal.etatSante];
  const especeLabel = ESPECE_LABELS[animal.espece] ?? animal.espece;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* ── Retour ── */}
      <Link href="/vetalert/animaux"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-5 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Retour à la liste
      </Link>

      {/* ── Carte identité ── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="h-3 w-full" style={{ background: `linear-gradient(90deg, ${etatConf.color}, ${etatConf.color}88)` }} />
        <div className="p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 border"
                style={{ background: etatConf.bg, borderColor: `${etatConf.color}25` }}>
                {especeLabel.split(' ')[0]}
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>{animal.nom}</h1>
                <p className="text-gray-500">{especeLabel.split(' ').slice(1).join(' ')} · {animal.race}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-sm font-bold px-3 py-1 rounded-full"
                    style={{ background: etatConf.bg, color: etatConf.color }}>
                    {etatConf.label}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">{animal.numeroId}</span>
                </div>
              </div>
            </div>
            <Link href="#"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border-2 transition-colors"
              style={{ borderColor: '#0a6342', color: '#0a6342' }}>
              <Edit className="w-4 h-4" />
              Modifier
            </Link>
          </div>

          {/* Infos détaillées */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-5 border-t border-gray-100">
            {[
              { label: 'Sexe',           val: animal.sexe === 'male' ? '♂ Mâle' : '♀ Femelle', icon: '🏷️' },
              { label: 'Âge',            val: `${animal.ageAns > 0 ? animal.ageAns + ' ans' : ''} ${animal.ageMois > 0 ? animal.ageMois + ' mois' : ''}`.trim(), icon: '📅' },
              { label: 'Poids',          val: `${animal.poids} kg`, icon: '⚖️' },
              { label: 'Naissance',      val: new Date(animal.dateNaissance).toLocaleDateString('fr-FR'), icon: '🎂' },
              { label: 'Propriétaire',   val: animal.proprietaireNom, icon: '👤' },
              { label: 'Vétérinaire',    val: animal.veterinaire, icon: '🩺' },
              { label: 'Numéro ID',      val: animal.numeroId, icon: '🔖' },
              { label: 'Enregistré le',  val: new Date(animal.createdAt).toLocaleDateString('fr-FR'), icon: '📋' },
            ].map(({ label, val, icon }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <div className="text-lg mb-1">{icon}</div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</div>
                <div className="text-sm font-bold text-gray-900 mt-0.5">{val || '—'}</div>
              </div>
            ))}
          </div>

          {animal.notes && (
            <div className="mt-4 p-4 rounded-xl border" style={{ background: '#fffbeb', borderColor: '#fbbf24' }}>
              <p className="text-xs font-bold text-yellow-700 uppercase tracking-wide mb-1">📝 Notes</p>
              <p className="text-sm text-gray-700">{animal.notes}</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* ── Rendez-vous ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <h2 className="font-black text-gray-900 text-base flex items-center gap-2">
              <Calendar className="w-5 h-5" style={{ color: '#0a6342' }} />
              Rendez-vous ({rdvAnimal.length})
            </h2>
            <Link href="/vetalert/rendez-vous"
              className="text-xs font-semibold" style={{ color: '#0a6342' }}>
              + Nouveau
            </Link>
          </div>
          {rdvAnimal.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-sm">Aucun rendez-vous planifié</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {rdvAnimal.map((rdv) => {
                const typeConf = TYPE_RDV_LABELS[rdv.type];
                const statutConf = STATUT_RDV_CONFIG[rdv.statut];
                return (
                  <div key={rdv.id} className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-gray-900">
                        {new Date(rdv.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} à {rdv.heure}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: statutConf.bg, color: statutConf.color }}>
                        {statutConf.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{rdv.motif}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md"
                        style={{ background: `${typeConf.color}18`, color: typeConf.color }}>
                        {typeConf.label}
                      </span>
                      {rdv.lieu && (
                        <span className="text-xs text-gray-400 flex items-center gap-0.5">
                          <MapPin className="w-3 h-3" />{rdv.lieu}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Dossiers médicaux ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <h2 className="font-black text-gray-900 text-base flex items-center gap-2">
              <ClipboardList className="w-5 h-5" style={{ color: '#0a6342' }} />
              Historique médical ({dossiersAnimal.length})
            </h2>
            <Link href="/vetalert/historique" className="text-xs font-semibold" style={{ color: '#0a6342' }}>
              Voir tout
            </Link>
          </div>
          {dossiersAnimal.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-sm">Aucun dossier médical</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {dossiersAnimal.map((dossier) => {
                const typeColors: Record<string, { color: string; bg: string; emoji: string }> = {
                  maladie:      { color: '#dc2626', bg: '#fee2e2', emoji: '🤒' },
                  vaccin:       { color: '#0a6342', bg: '#d9f2e3', emoji: '💉' },
                  traitement:   { color: '#1d4ed8', bg: '#dbeafe', emoji: '💊' },
                  operation:    { color: '#7c3aed', bg: '#ede9fe', emoji: '🔪' },
                  analyse:      { color: '#b45309', bg: '#fef3c7', emoji: '🧪' },
                  prescription: { color: '#0891b2', bg: '#cffafe', emoji: '📋' },
                };
                const tc = typeColors[dossier.type] ?? { color: '#6b7280', bg: '#f3f4f6', emoji: '📄' };
                return (
                  <div key={dossier.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                        style={{ background: tc.bg }}>
                        {tc.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-gray-900">{dossier.titre}</span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: tc.bg, color: tc.color }}>
                            {dossier.type}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{dossier.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(dossier.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          {dossier.prochainControle && (
                            <span className="text-green-600 ml-2 font-semibold">
                              · Prochain contrôle : {new Date(dossier.prochainControle).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Contact propriétaire ── */}
      <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-black text-gray-900 text-base mb-4">👤 Propriétaire</h2>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #b45309, #d97706)' }}>
            {animal.proprietaireNom.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900">{animal.proprietaireNom}</p>
            <p className="text-gray-500 text-sm">Éleveur</p>
          </div>
          <a href="tel:+221769876543"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white"
            style={{ background: '#0a6342' }}>
            <Phone className="w-4 h-4" />
            Appeler
          </a>
        </div>
      </div>
    </div>
  );
}
