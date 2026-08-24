const regions = [
  ["Dakar", "Capitale atlantique", "14 départements"],
  ["Saint-Louis", "Patrimoine et fleuve", "Nord du Sénégal"],
  ["Casamance", "Forêts et mangroves", "Sud du Sénégal"],
];

const experiences = [
  ["Culture", "Musiques, savoir-faire et mémoire vivante."],
  ["Nature", "Littoral, parcs, îles et paysages du pays."],
  ["Voyage", "Préparer des itinéraires utiles, responsables et locaux."],
];

export default function Home() {
  return (
    <main>
      <nav className="nav"><a className="brand" href="#accueil">SÉNÉGAL <span>ATLAS</span></a><div><a href="#regions">Régions</a><a href="#decouvrir">Découvrir</a><a href="#guide">Guide</a></div></nav>
      <section id="accueil" className="hero">
        <p className="eyebrow">Guide du territoire sénégalais</p>
        <h1>Le Sénégal,<br /><em>à portée de regard.</em></h1>
        <p className="lead">Explorez ses territoires, ses histoires et les expériences qui font la richesse du pays.</p>
        <a className="button" href="#regions">Explorer les régions <span>↓</span></a>
        <div className="sun" aria-hidden="true" />
      </section>
      <section id="regions" className="section"><p className="eyebrow">01 — Territoires</p><div className="title-row"><h2>Un pays, mille horizons.</h2><p>Des repères pour découvrir le Sénégal avec curiosité et respect.</p></div><div className="region-grid">{regions.map(([name, subtitle, detail], index) => <article className={`region region-${index + 1}`} key={name}><p>0{index + 1}</p><h3>{name}</h3><span>{subtitle}</span><small>{detail} ↗</small></article>)}</div></section>
      <section id="decouvrir" className="section dark"><p className="eyebrow">02 — Découvrir</p><h2>Voyager autrement.</h2><div className="experience-grid">{experiences.map(([title, text], index) => <article key={title}><b>0{index + 1}</b><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <section id="guide" className="guide"><p className="eyebrow">Bientôt disponible</p><h2>Votre prochain itinéraire commence ici.</h2><p>Guides pratiques, cartes et bonnes adresses sélectionnées avec soin.</p><a className="button light" href="mailto:bonjour@senegalatlas.com">Être informé</a></section>
      <footer><span>Sénégal Atlas</span><span>Conçu pour explorer le Sénégal</span></footer>
    </main>
  );
}
