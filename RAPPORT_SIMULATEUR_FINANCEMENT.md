# Rapport de situation - Simulateur de financement NOEMA

Date : 20 septembre 2026

## 1. Synthèse exécutive

Le simulateur actuel est un simulateur de capacité de remboursement classique. Il calcule une mensualité de crédit à partir du prix du lot, de l'apport, de la durée et d'un taux indicatif, puis compare cette mensualité aux revenus déclarés et aux charges existantes.

Il ne gère pas encore les revenus locatifs futurs. Le champ « revenus complémentaires » existe, mais il s'agit d'un montant libre saisi par l'utilisateur. Le système ne sait pas s'il s'agit d'un salaire, d'un loyer existant ou d'un revenu locatif futur lié au lot NOEMA.

La durée étant maintenant limitée à 8 ans, les mensualités sont élevées. C'est la raison principale pour laquelle de nombreuses simulations dépassent le seuil indicatif de 35 %. Le T2 est actuellement le lot le plus accessible, mais il nécessite encore un apport important pour un profil disposant d'environ 707 700 FCFA de revenus mensuels retenus.

## 2. Parcours actuel du simulateur

Le parcours comporte les étapes suivantes :

1. Sélection du lot à financer.
2. Pays de résidence.
3. Situation professionnelle et âge.
4. Revenus mensuels nets, avec un revenu complémentaire facultatif.
5. Apport personnel.
6. Charges et crédits mensuels existants.
7. Type de projet et durée de financement.
8. Résultat indicatif et formulaire de contact.

Le simulateur collecte également le prénom, le nom, le téléphone, l'email, le consentement RGPD et le consentement marketing.

## 3. Données actuellement utilisées dans le calcul

Le calcul reçoit les données suivantes :

- prix du lot ;
- apport personnel ;
- durée du prêt ;
- taux d'intérêt indicatif ;
- revenu net principal ;
- revenus complémentaires ;
- revenus éventuels d'un co-emprunteur ;
- charges ou crédits mensuels existants.

Les données de revenus complémentaires et de co-emprunteur existent dans l'API, mais le parcours utilisateur actuel ne propose pas encore de véritable parcours de co-emprunteur ni de qualification détaillée de la nature du revenu complémentaire.

## 4. Calcul de la mensualité

Le simulateur utilise une formule d'amortissement standard :

`M = P x [r x (1 + r)^n] / [(1 + r)^n - 1]`

Avec :

- `M` = mensualité estimée ;
- `P` = montant emprunté ;
- `r` = taux mensuel, soit taux annuel / 12 ;
- `n` = nombre total de mensualités, soit durée en années x 12.

Le montant emprunté est calculé ainsi :

`Montant emprunté = prix du lot - apport personnel`

Le montant est plafonné à zéro et l'apport est plafonné au prix du lot.

Paramètres actuels :

- taux indicatif par défaut : 6,5 % annuel ;
- durée maximale appliquée par le serveur : 8 ans ;
- durée sélectionnable dans l'interface : de 5 à 8 ans ;
- taux d'endettement indicatif : 35 %.

Le taux de 6,5 % et le seuil de 35 % sont indicatifs. Ils doivent être confirmés avec la banque ou la cliente.

## 5. Calcul des revenus et du taux d'endettement

Les revenus retenus sont actuellement additionnés :

`Revenus retenus = revenu principal + revenus complémentaires + revenus du co-emprunteur`

Les charges existantes ne sont pas déduites des revenus pour calculer le taux. Elles sont ajoutées aux nouvelles mensualités dans le total des engagements :

`Engagements totaux = nouvelle mensualité + charges existantes`

Puis :

`Taux d'endettement = engagements totaux / revenus retenus x 100`

Le résultat est considéré comme dans le seuil si le taux est inférieur ou égal à 35 %.

Le simulateur calcule également :

`Revenus disponibles = revenus retenus - charges existantes`

et :

`Budget mensuel recommandé = revenus disponibles x 35 %`

Attention : cette valeur de budget recommandé est affichée comme information, mais le contrôle principal du seuil utilise bien les engagements totaux divisés par les revenus retenus.

## 6. Pourquoi beaucoup de simulations dépassent 35 %

### 6.1 La durée de 8 ans augmente fortement les mensualités

Une durée courte rembourse le capital rapidement. La mensualité est donc beaucoup plus élevée qu'avec un prêt sur 15, 20 ou 25 ans.

La limitation à 8 ans est cohérente avec l'information communiquée sur la banque, mais elle rend les lots difficiles à financer avec des revenus moyens.

### 6.2 Les prix des lots sont élevés par rapport aux revenus saisis

Le catalogue actuel comprend notamment :

- T2 : 59 000 000 FCFA ;
- T3 : 109 000 000 FCFA.

Avec les chiffres visibles dans la capture :

- mensualité : environ 394 894 FCFA ;
- taux affiché : 55,8 % ;
- revenus retenus estimés : environ 707 700 FCFA par mois.

À 35 %, l'ensemble des engagements ne devrait pas dépasser environ 247 700 FCFA par mois. La mensualité de 394 894 FCFA dépasse donc déjà la capacité indicativement acceptable, avant même d'ajouter d'éventuelles charges existantes.

### 6.3 L'apport réduit directement le capital financé

Plus l'apport est élevé, plus la mensualité baisse. Pour le profil de la capture, à 8 ans et avec un taux de 6,5 %, la capacité d'emprunt compatible avec 35 % est approximativement de 18,51 millions FCFA, hors autre charge.

Ordres de grandeur indicatifs :

| Lot | Prix | Apport approximatif pour viser 35 % | Part du prix |
|---|---:|---:|---:|
| T2 | 59 000 000 FCFA | 40 490 000 FCFA | 68,6 % |
| T3 | 109 000 000 FCFA | 90 490 000 FCFA | 83,0 % |

Ces chiffres ne constituent pas une décision bancaire. Ils illustrent simplement l'effet combiné du prix, de la durée courte et du revenu déclaré.

### 6.4 Les revenus locatifs ne sont pas encore intégrés

Le simulateur ne prend actuellement en compte aucun loyer futur de NOEMA. Le fait de choisir une option comme « J'investis pour générer des revenus » ne modifie pas le calcul.

Le revenu locatif futur ne doit pas être ajouté intégralement sans validation bancaire. La banque peut appliquer une décote, par exemple retenir seulement une fraction du loyer prévisionnel, et demander des justificatifs.

## 7. Ce qui doit être confirmé avec la cliente

Il faut d'abord clarifier le produit concerné :

- Quels lots peuvent être exploités en location ?
- La location est-elle longue durée, courte durée, para-hôtelière ou mixte ?
- La gestion locative est-elle obligatoire ou optionnelle ?
- Qui exploite le bien : le propriétaire, NOEMA, un opérateur ou une agence partenaire ?
- Existe-t-il une formule avec loyer garanti ?
- Existe-t-il une formule avec partage de revenus ?
- Le propriétaire peut-il occuper le logement certaines périodes ?
- La location est-elle autorisée par le règlement de copropriété ?

## 8. Questions sur les revenus locatifs

### Hypothèses de revenus

- Quel loyer mensuel brut est prévu pour chaque type de lot ?
- Le loyer est-il différent selon le T2, le T3, l'étage, la vue ou le mobilier ?
- Quel est le taux d'occupation prudent à retenir ?
- Quelle saisonnalité faut-il prévoir ?
- Quel montant annuel peut-on raisonnablement retenir dans un scénario prudent, central et optimiste ?
- Les revenus annoncés sont-ils garantis contractuellement ou simplement prévisionnels ?

### Charges à déduire

- Quel est le montant de la gestion locative ?
- La commission est-elle prélevée sur le loyer brut ou sur le revenu encaissé ?
- Qui paie les charges de copropriété ?
- Qui paie l'entretien, les réparations, le ménage et le renouvellement du mobilier ?
- Les assurances, taxes et périodes de vacance sont-elles incluses dans les projections ?
- Existe-t-il des frais de commercialisation, de plateforme ou de conciergerie ?
- Quel est le revenu net réellement reversé au propriétaire ?

### Cadre contractuel

- Quelle est la durée du mandat de gestion ?
- Comment le propriétaire peut-il résilier le mandat ?
- Quel est le délai de versement des loyers ?
- Le gestionnaire fournit-il un relevé mensuel et un compte rendu annuel ?
- Qui supporte les impayés et les dégradations ?
- Le revenu est-il garanti même en cas de logement vacant ?
- Quelles sont les conditions exactes de cette garantie ?

## 9. Questions bancaires indispensables

- La banque accepte-t-elle les revenus locatifs futurs dans l'étude de solvabilité ?
- Quelle part du loyer prévisionnel est retenue : 100 %, 70 %,  et quelle décote exacte ?
- Faut-il un bail signé, un mandat de gestion, une garantie de loyer ou un historique d'encaissement ?
- Le revenu locatif est-il retenu avant ou après les charges de gestion ?
- Le seuil d'endettement reste-t-il strictement à 35 % pour ce dossier ?
- La banque applique-t-elle une règle spécifique aux revenus de courte durée ou de location meublée ?
- La durée maximale de 8 ans est-elle ferme pour tous les lots et tous les profils ?
- Quel taux réel doit remplacer le taux indicatif de 6,5 % ?
- Quels frais doivent être intégrés : assurance emprunteur, frais de dossier, garantie, notaire et travaux ?
- La banque accepte-t-elle un co-emprunteur ou une société d'exploitation ?

## 10. Proposition de futur calcul avec gestion locative

Il faudra séparer clairement trois notions : revenu personnel, revenu locatif brut et revenu locatif retenu par la banque.

### Étape A : calculer le revenu locatif net prévisionnel

`Revenu locatif net = loyer brut - vacance - gestion - copropriété - entretien - assurance - autres charges`

La vacance peut être modélisée par exemple avec un taux d'occupation prudent. Le taux exact doit être confirmé avec la cliente.

### Étape B : appliquer la règle bancaire

`Revenu locatif retenu = revenu locatif net x taux de prise en compte bancaire`

Le taux de prise en compte ne doit pas être inventé dans le simulateur. Il doit être configurable et afficher sa source, par exemple : « 70 % retenus selon hypothèse à confirmer par la banque ».

### Étape C : calculer le taux d'endettement

`Revenus retenus = revenus personnels + revenus co-emprunteur + revenus locatifs retenus`

`Taux d'endettement = (nouvelle mensualité + charges existantes) / revenus retenus x 100`

### Étape D : afficher plusieurs scénarios

Le simulateur devrait présenter au minimum :

- scénario sans revenu locatif ;
- scénario prudent ;
- scénario central ;
- scénario optimiste, clairement présenté comme non garanti.

Pour chaque scénario, afficher : loyer brut, charges, revenu net, part retenue par la banque, taux d'endettement, mensualité et reste mensuel estimé.

## 11. Données à ajouter dans le futur formulaire

- formule d'exploitation choisie ;
- type de location ;
- loyer brut mensuel estimé ;
- taux d'occupation estimé ;
- frais de gestion en pourcentage ou montant fixe ;
- charges mensuelles liées au lot ;
- revenu locatif net estimé ;
- taux de prise en compte bancaire ;
- présence d'une garantie de loyer ;
- durée d'une éventuelle garantie ;
- période d'occupation personnelle ;
- scénario choisi : prudent, central ou optimiste.

## 12. Recommandation pour la réunion

La décision la plus importante est de ne pas intégrer immédiatement un loyer optimiste dans le calcul. Il faut d'abord obtenir une fiche économique par formule de gestion locative et une règle bancaire écrite sur la prise en compte des loyers.

Pendant la réunion, demander à la cliente une simulation complète par lot avec : prix, apport minimum, durée, taux, loyer brut, charges, revenu net propriétaire, taux d'occupation, garantie éventuelle et part du revenu acceptée par la banque.

Après validation de ces éléments, le simulateur pourra être refondu autour de deux résultats distincts :

1. capacité bancaire et taux d'endettement ;
2. rentabilité et trésorerie nette du projet.

Il ne faut pas présenter la rentabilité locative comme une garantie d'obtention du crédit tant que la banque n'a pas confirmé sa méthode de calcul.
