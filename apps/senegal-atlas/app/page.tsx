const regions = [
  ["Dakar", "L’énergie urbaine, les îles et les musées.", "14.7° N", "Bleu Atlantique"],
  ["Saint-Louis", "Patrimoine, fleuve Sénégal et jazz.", "16.0° N", "Sable doré"],
  ["Casamance", "Forêts, bolongs et villages diola.", "12.6° N", "Vert profond"],
  ["Sine-Saloum", "Mangroves, oiseaux et navigation douce.", "13.8° N", "Terre cuivrée"],
];

const experiences = [
  ["01", "Au rythme de Dakar", "Une journée entre le Plateau, Soumbédioune et la Corniche.", "48 h"],
  ["02", "Le long du fleuve", "De Saint-Louis à Podor, suivre les traces des comptoirs.", "4 jours"],
  ["03", "Ralentir au Sud", "Une traversée de la Casamance entre marchés, rizières et plages.", "6 jours"],
];

export default function Home() {
  return (
    <main>
      <nav className="nav shell"><a className="brand" href="#top"><span className="brand-mark">SA</span><span>Sénégal<br /><b>Atlas</b></span></a><div className="nav-links"><a href="#regions">Régions</a><a href="#itineraires">Itinéraires</a><a href="#carnet">Carnet</a></div><a className="nav-button" href="#regions">Explorer l’Atlas <span>↗</span></a></nav>
      <section className="hero shell" id="top">
        <div className="hero-copy"><p className="eyebrow">République du Sénégal · Afrique de l’Ouest</p><h1>Un pays.<br /><em>Mille horizons.</em></h1><p className="lead">Sénégal Atlas est un nouveau regard sur les territoires, les savoir-faire et les voyages qui font le Sénégal.</p><div className="hero-actions"><a className="primary" href="#regions">Commencer l’exploration <span>↓</span></a><a className="text-link" href="#itineraires">Voir les itinéraires <span>→</span></a></div><div className="hero-meta"><span><b>14</b> régions</span><span><b>700 km</b> de côte</span><span><b>1</b> pays à parcourir</span></div></div>
        <div className="atlas-art" aria-label="Illustration abstraite du Sénégal"><div className="sun" /><div className="land land-one" /><div className="land land-two" /><div className="map"><i className="pin pin-one" /><i className="pin pin-two" /><i className="pin pin-three" /><span className="map-label">SÉNÉGAL</span></div><p className="coordinates">12° 30′ — 16° 42′ N</p></div>
      </section>
      <section className="intro"><div className="shell intro-grid"><p className="eyebrow">Un atlas vivant</p><h2>Plus qu’une destination,<br />une <em>rencontre.</em></h2><p>Des rues de Dakar aux bolongs du Saloum, des maisons coloniales de Saint-Louis aux mangroves de Casamance : découvrez des lieux, et surtout les personnes qui les font vivre.</p></div></section>
      <section className="regions shell" id="regions"><div className="section-heading"><div><p className="eyebrow">Choisir un point de départ</p><h2>Les territoires à la une</h2></div><a className="text-link" href="#carnet">Voir la carte complète <span>→</span></a></div><div className="region-grid">{regions.map(([name, description, coordinate, tone], index) => <article className={`region-card region-${index + 1}`} key={name}><div className="region-number">0{index + 1}</div><div className="region-art"><span>{coordinate}</span><i /></div><div className="region-content"><p>{tone}</p><h3>{name}</h3><span>{description}</span><a href="#itineraires" aria-label={`Découvrir ${name}`}>↗</a></div></article>)}</div></section>
      <section className="statement"><div className="shell"><p className="eyebrow">Le carnet sénégalais</p><h2>« Voyager ici, c’est prendre le temps<br />de regarder <em>autrement.</em> »</h2><div className="statement-line"><span>Du littoral aux frontières du Fouta</span><span>·</span><span>Une sélection éditoriale indépendante</span></div></div></section>
      <section className="routes shell" id="itineraires"><div className="section-heading"><div><p className="eyebrow">Prendre la route</p><h2>Itinéraires choisis</h2></div><p className="caption">Des parcours dessinés pour s’orienter, s’inspirer et voyager à son rythme.</p></div><div className="route-list">{experiences.map(([number, title, text, duration]) => <article className="route" key={number}><span className="route-number">{number}</span><div><h3>{title}</h3><p>{text}</p></div><span className="duration">{duration}</span><a href="#carnet" aria-label={`Explorer ${title}`}>→</a></article>)}</div></section>
      <section className="newsletter" id="carnet"><div className="shell newsletter-inner"><div><p className="eyebrow">Le carnet de l’Atlas</p><h2>Une histoire du Sénégal,<br /><em>chaque semaine.</em></h2></div><form><label htmlFor="email">Votre adresse email</label><div><input id="email" type="email" placeholder="vous@exemple.com" /><button type="button">S’inscrire <span>→</span></button></div><small>Itinéraires, portraits et adresses sélectionnées. Sans bruit.</small></form></div></section>
      <footer className="footer shell"><a className="brand" href="#top"><span className="brand-mark">SA</span><span>Sénégal<br /><b>Atlas</b></span></a><p>Explorer, comprendre, transmettre.</p><span>© 2026 Sénégal Atlas</span></footer>
    </main>
  );
}
