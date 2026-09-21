import React from 'react';
import { Building2 } from 'lucide-react';

export const LoadingScreen: React.FC = () => (
  <main className="site-loader" aria-label="Chargement de la Résidence NOEMA" role="status">
    <div className="site-loader__grid" aria-hidden="true" />
    <div className="site-loader__content">
      <div className="site-loader__mark"><Building2 className="h-5 w-5" /></div>
      <p className="site-loader__eyebrow">Résidence d'exception</p>
      <h1>NOEMA</h1>
      <p className="site-loader__location">Angré Djorogobité · Abidjan</p>
      <div className="site-loader__line" aria-hidden="true"><span /></div>
      <p className="site-loader__status">Préparation de votre visite</p>
    </div>
  </main>
);
