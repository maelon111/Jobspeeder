export type ContentBlock =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'callout'; text: string }
  | { type: 'tip'; label: string; text: string }

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  categorySlug: string
  author: string
  authorRole: string
  publishedAt: string
  updatedAt: string
  readingTimeMin: number
  gradient: string
  tags: string[]
  content: ContentBlock[]
}

export const CATEGORIES = [
  { label: 'Tous', slug: 'tous' },
  { label: 'Automatisation', slug: 'automatisation' },
  { label: 'Lettre de motivation', slug: 'lettre-de-motivation' },
  { label: 'Recherche d\'emploi', slug: 'recherche-emploi' },
  { label: 'LinkedIn & réseaux', slug: 'linkedin' },
  { label: 'Préparation entretien', slug: 'entretien' },
]

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'automatiser-candidatures-2025',
    title: 'Comment automatiser ses candidatures en 2025',
    excerpt:
      'La recherche d\'emploi est épuisante. En 2025, les candidats qui trouvent un poste en moins de 60 jours utilisent tous la même arme secrète : l\'automatisation. Voici comment faire.',
    category: 'Automatisation',
    categorySlug: 'automatisation',
    author: 'Équipe JobSpeeder',
    authorRole: 'Experts en recrutement IA',
    publishedAt: '2025-03-01T08:00:00Z',
    updatedAt: '2025-03-15T10:00:00Z',
    readingTimeMin: 8,
    gradient: 'from-brand/20 via-blue-500/10 to-purple-500/10',
    tags: ['automatisation', 'IA', 'candidatures', 'emploi', 'productivité'],
    content: [
      {
        type: 'p',
        text: 'En 2025, la recherche d\'emploi est plus compétitive que jamais. Pour un seul poste cadre en France, les recruteurs reçoivent en moyenne 150 à 300 candidatures. Dans ce contexte, postuler à 5 offres par semaine manuellement ne suffit plus. Les candidats qui décrochent un poste rapidement ont compris une chose : il faut jouer le jeu des volumes tout en maintenant une personnalisation suffisante pour sortir du lot.',
      },
      {
        type: 'callout',
        text: 'Un candidat qui postule à 50 offres ciblées a statistiquement 8× plus de chances d\'obtenir un entretien que celui qui postule à 5 offres "parfaites". La qualité seule ne suffit plus — il faut combiner qualité ET volume.',
      },
      {
        type: 'h2',
        text: 'Pourquoi automatiser ses candidatures ?',
      },
      {
        type: 'p',
        text: 'L\'automatisation des candidatures repose sur un constat simple : la plupart des tâches d\'une candidature sont répétitives. Remplir ses coordonnées, uploader son CV, écrire une lettre de motivation adaptée… Ces actions prennent 20 à 45 minutes par candidature. Multipliez par 30 candidatures par semaine et vous passez plus de 20 heures sur des formulaires.',
      },
      {
        type: 'ul',
        items: [
          'Économiser 15 à 20h par semaine sur les tâches administratives',
          'Postuler sur des créneaux horaires où les offres viennent d\'être publiées (le matin entre 7h et 9h)',
          'Maintenir une régularité que la fatigue mentale rendrait impossible manuellement',
          'Tracer toutes les candidatures dans un tableau de bord centralisé',
          'A/B tester différentes formulations de lettre de motivation',
        ],
      },
      {
        type: 'h2',
        text: 'Les 3 piliers d\'une automatisation efficace',
      },
      {
        type: 'h3',
        text: '1. Un CV optimisé pour les ATS',
      },
      {
        type: 'p',
        text: 'Avant d\'automatiser quoi que ce soit, votre CV doit passer les filtres ATS (Applicant Tracking System). Ces logiciels analysent automatiquement les candidatures et en éliminent 70 à 80 % avant qu\'un humain les lise. Un CV mal structuré — colonnes multiples, tableaux, icônes dans l\'en-tête — sera systématiquement rejeté, quelle que soit votre expérience.',
      },
      {
        type: 'tip',
        label: 'Conseil clé',
        text: 'Utilisez un format à colonne unique, des titres de section standards (Expérience, Formation, Compétences), et intégrez les mots-clés de l\'offre dans votre résumé de profil. Des outils comme JobSpeeder optimisent automatiquement votre CV avec GPT-4o pour maximiser votre score ATS.',
      },
      {
        type: 'h3',
        text: '2. Un moteur de matching intelligent',
      },
      {
        type: 'p',
        text: 'L\'automatisation sans ciblage produit des candidatures hors-sujet — la pire chose pour votre réputation professionnelle. Un bon système de candidatures automatiques doit d\'abord matcher vos critères : intitulé de poste, lieu, type de contrat (CDI, CDD, freelance), mode de travail (présentiel, distanciel, hybride), et fourchette de salaire. JobSpeeder analyse plus de 10 000 offres par jour pour ne vous proposer que celles qui correspondent exactement à votre profil configuré.',
      },
      {
        type: 'h3',
        text: '3. Une lettre de motivation adaptée',
      },
      {
        type: 'p',
        text: 'Le mythe de la lettre de motivation générique est mort. Les recruteurs reconnaissent instantanément un copier-coller. L\'IA moderne — en particulier GPT-4o-mini — est capable de générer des lettres personnalisées en quelques secondes en injectant le nom de l\'entreprise, le titre du poste, et des éléments spécifiques de l\'offre dans un template validé par vous.',
      },
      {
        type: 'h2',
        text: 'Mise en place : le workflow pas à pas',
      },
      {
        type: 'ol',
        items: [
          'Créez un compte gratuit sur JobSpeeder — 3 minutes, pas de carte requise',
          'Importez votre CV (PDF ou DOCX) ou construisez-en un depuis l\'éditeur intégré',
          'Lancez l\'optimisation IA : GPT-4o-mini réécrit votre CV pour maximiser le score ATS',
          'Configurez vos préférences : poste cible, localisation, type de contrat, salaire',
          'Activez la campagne — notre bot commence à postuler dans les minutes qui suivent',
          'Suivez vos candidatures en temps réel depuis le tableau de bord',
        ],
      },
      {
        type: 'h2',
        text: 'Ce que l\'automatisation ne remplace pas',
      },
      {
        type: 'p',
        text: 'L\'automatisation gère le volume, pas la relation humaine. Une fois que vous obtenez un entretien grâce au système, c\'est à vous de jouer. Préparez chaque entretien en recherchant l\'entreprise, préparez des questions pertinentes, et soignez votre présence en ligne (LinkedIn, GitHub, portfolio).',
      },
      {
        type: 'ul',
        items: [
          'La préparation aux entretiens reste 100% humaine',
          'Les réponses aux messages de recruteurs doivent être personnalisées',
          'Le networking et les candidatures spontanées sur recommandation ont un taux de succès 3× supérieur',
          'Votre profil LinkedIn doit être soigné — les recruteurs le vérifient systématiquement',
        ],
      },
      {
        type: 'h2',
        text: 'Résultats attendus',
      },
      {
        type: 'p',
        text: 'Les utilisateurs actifs de JobSpeeder observent en moyenne leur premier retour recruteur dans les 48 heures suivant l\'activation de leur campagne. Sur un mois complet avec le plan Platinum (500 candidatures/mois), le taux moyen d\'entretiens obtenus est de 4,8% — soit environ 24 entretiens pour 500 candidatures, contre 1 à 2 en moyenne pour une démarche manuelle équivalente.',
      },
      {
        type: 'callout',
        text: 'L\'automatisation ne remplace pas le travail de fond — elle l\'amplifie. Un bon CV + des préférences bien ciblées + le volume que permet JobSpeeder = une recherche d\'emploi transformée.',
      },
    ],
  },
  {
    slug: 'lettre-motivation-ia-guide',
    title: 'Écrire une lettre de motivation avec l\'IA : guide pratique',
    excerpt:
      'L\'IA peut générer une lettre de motivation en 30 secondes — mais 80% des candidats font les mêmes erreurs. Ce guide vous montre comment obtenir des lettres vraiment personnalisées qui déclenchent des entretiens.',
    category: 'Lettre de motivation',
    categorySlug: 'lettre-de-motivation',
    author: 'Équipe JobSpeeder',
    authorRole: 'Experts en recrutement IA',
    publishedAt: '2025-03-10T08:00:00Z',
    updatedAt: '2025-03-18T10:00:00Z',
    readingTimeMin: 7,
    gradient: 'from-purple-500/20 via-pink-500/10 to-brand/10',
    tags: ['lettre de motivation', 'IA', 'ChatGPT', 'GPT-4o', 'candidature'],
    content: [
      {
        type: 'p',
        text: 'La lettre de motivation fait l\'objet d\'un débat depuis des années : est-elle encore utile ? La réponse en 2025 est nuancée. Dans 60% des offres en France, elle reste obligatoire ou fortement conseillée. Et si les recruteurs passent en moyenne 7 secondes sur un CV, ils accordent paradoxalement plus de temps à une lettre bien écrite — parce qu\'elle révèle la personnalité et la motivation réelle du candidat.',
      },
      {
        type: 'h2',
        text: 'Le problème avec les lettres générées par IA (et comment l\'éviter)',
      },
      {
        type: 'p',
        text: 'Depuis l\'avènement de ChatGPT, des millions de candidats demandent simplement "écris-moi une lettre de motivation pour ce poste". Le résultat est reconnaissable entre mille : phrases génériques, ton corporate désincarné, et surtout l\'absence totale de ce qui distingue un candidat d\'un autre. Les recruteurs expérimentés identifient ces lettres en 5 secondes.',
      },
      {
        type: 'ul',
        items: [
          '"Je suis vivement intéressé par votre offre d\'emploi..." (opening cliché)',
          '"Mes compétences correspondent parfaitement à vos besoins..." (vague)',
          '"Je suis une personne dynamique et motivée..." (non-information)',
          'Aucune mention spécifique de l\'entreprise ou du secteur',
          'Structure identique pour tous les postes',
        ],
      },
      {
        type: 'callout',
        text: 'L\'IA ne remplace pas la réflexion — elle l\'accélère. Votre travail est de fournir à l\'IA les matériaux uniques dont elle a besoin pour produire quelque chose de vraiment personnalisé.',
      },
      {
        type: 'h2',
        text: 'La méthode des 4 ingrédients',
      },
      {
        type: 'p',
        text: 'Avant de lancer ChatGPT, GPT-4o ou l\'outil intégré de JobSpeeder, préparez quatre éléments spécifiques. Ce sont ces matériaux qui transformeront une lettre générique en une lettre mémorable.',
      },
      {
        type: 'h3',
        text: '1. Un fait précis sur l\'entreprise',
      },
      {
        type: 'p',
        text: 'Pas "je connais votre entreprise leader du secteur". Mais : "J\'ai suivi avec intérêt votre levée de fonds de 15M€ en janvier 2025 et votre expansion sur le marché allemand." Ou : "Votre approche de l\'onboarding clients, détaillée dans l\'article de votre CEO sur LinkedIn du mois dernier, correspond exactement à la philosophie que j\'ai appliquée chez [entreprise précédente]."',
      },
      {
        type: 'h3',
        text: '2. Une réalisation chiffrée de votre expérience',
      },
      {
        type: 'p',
        text: 'Pas "j\'ai amélioré les ventes". Mais : "J\'ai restructuré le process de relance commerciale, ce qui a réduit le cycle de vente de 45 à 28 jours et augmenté le taux de conversion de 12 points en 6 mois." Les chiffres sont crédibles, mémorables, et difficiles à ignorer.',
      },
      {
        type: 'h3',
        text: '3. La raison profonde de votre candidature',
      },
      {
        type: 'p',
        text: 'Qu\'est-ce qui vous attire spécifiquement dans ce poste, à ce moment de votre carrière ? Une transition sectorielle ? Un retour à un type de mission que vous aviez adoré ? Un défi technique spécifique mentionné dans l\'offre ? Cette raison doit être authentique et non interchangeable avec une autre offre.',
      },
      {
        type: 'h3',
        text: '4. Un pont clair entre votre passé et leur futur',
      },
      {
        type: 'p',
        text: 'La lettre doit répondre implicitement à la question du recruteur : "En quoi cette personne va-t-elle nous aider à atteindre nos objectifs ?" Identifiez le problème principal que l\'entreprise essaie de résoudre avec ce recrutement (croissance, transformation digitale, refonte produit…) et montrez que vous l\'avez déjà résolu ailleurs.',
      },
      {
        type: 'h2',
        text: 'Le prompt qui fonctionne vraiment',
      },
      {
        type: 'p',
        text: 'Une fois vos 4 ingrédients prêts, voici la structure de prompt qui produit systématiquement de bons résultats avec GPT-4o ou Claude :',
      },
      {
        type: 'tip',
        label: 'Template de prompt',
        text: 'Tu es un expert en recrutement français. Rédige une lettre de motivation en français (300 mots max, ton professionnel mais chaleureux, pas de clichés) pour : Poste : [titre exact] chez [entreprise]. Fait spécifique sur l\'entreprise : [votre recherche]. Ma réalisation clé : [chiffre + contexte]. Ma motivation profonde : [raison authentique]. Mon profil : [titre actuel, X ans d\'expérience, compétences-clés]. Structure : accroche directe → valeur apportée → fit culturel → closing actif. Évite : "vivement intéressé", "dynamique", "motivé", tout cliché corporate.',
      },
      {
        type: 'h2',
        text: 'L\'automatisation à grande échelle avec JobSpeeder',
      },
      {
        type: 'p',
        text: 'JobSpeeder intègre ce principe de personnalisation dans son moteur d\'automatisation. Pour chaque offre qui matche votre profil, notre système génère une lettre adaptée en injectant automatiquement les informations clés de l\'annonce (intitulé exact, secteur, compétences mentionnées) dans un template que vous avez préalablement validé. Vous gardez le contrôle du ton et de la structure, l\'IA gère la personnalisation à l\'échelle.',
      },
      {
        type: 'h2',
        text: 'Ce qu\'il faut toujours vérifier avant d\'envoyer',
      },
      {
        type: 'ul',
        items: [
          'Le nom du recruteur ou du responsable est correct (évitez "Madame, Monsieur" si vous connaissez le nom)',
          'L\'entreprise mentionnée dans le corps correspond bien à celle visée (erreur fréquente en copier-coller)',
          'Les chiffres cités sont exacts et vérifiables',
          'La lettre fait moins de 350 mots — au-delà, elle ne sera pas lue',
          'L\'appel à l\'action final est clair et actif ("Je serais ravi d\'échanger lors d\'un entretien...")',
        ],
      },
      {
        type: 'callout',
        text: 'La meilleure lettre de motivation est celle qui donne au recruteur l\'impression de déjà vous connaître avant de vous avoir rencontré. C\'est ça, le vrai travail de personnalisation — et c\'est là que l\'IA, bien guidée, devient votre meilleure alliée.',
      },
    ],
  },
  {
    slug: 'meilleurs-outils-recherche-emploi',
    title: 'Les meilleurs outils pour accélérer sa recherche d\'emploi en 2025',
    excerpt:
      'De l\'optimisation CV à l\'automatisation des candidatures, en passant par la veille d\'offres et la préparation aux entretiens — panorama complet des outils qui changent vraiment la donne.',
    category: 'Recherche d\'emploi',
    categorySlug: 'recherche-emploi',
    author: 'Équipe JobSpeeder',
    authorRole: 'Experts en recrutement IA',
    publishedAt: '2025-03-18T08:00:00Z',
    updatedAt: '2025-03-20T10:00:00Z',
    readingTimeMin: 9,
    gradient: 'from-blue-500/20 via-brand/10 to-purple-500/10',
    tags: ['outils', 'recherche emploi', 'productivité', 'IA', 'LinkedIn', 'CV'],
    content: [
      {
        type: 'p',
        text: 'En 2025, un candidat équipé des bons outils fait le travail d\'une équipe entière. La démocratisation de l\'IA a créé une rupture nette entre ceux qui cherchent encore un emploi "à l\'ancienne" (Indeed + CV PDF + candidature manuelle) et ceux qui ont industrialisé leur démarche sans perdre en qualité. Ce guide passe en revue les catégories d\'outils essentielles et les meilleurs acteurs dans chacune.',
      },
      {
        type: 'h2',
        text: '1. Optimisation CV et ATS',
      },
      {
        type: 'p',
        text: 'Avant de postuler à quoi que ce soit, votre CV doit être prêt à passer les filtres ATS. Ces systèmes éliminent automatiquement 70 à 80% des candidatures sur des critères purement techniques (format, mots-clés, structure). Un bon outil d\'optimisation CV analyse votre document et le réécrit pour maximiser son score.',
      },
      {
        type: 'ul',
        items: [
          'JobSpeeder — optimisation IA complète avec GPT-4o-mini, gestion multi-profils CV (jusqu\'à 15 profils selon le plan)',
          'Jobscan — compare votre CV à une offre spécifique et calcule un score de match ATS',
          'Resume Worded — analyse ligne par ligne et suggère des améliorations concrètes',
          'Enhancv — constructeur de CV avec templates ATS-friendly et analytics de vues',
        ],
      },
      {
        type: 'tip',
        label: 'Point de vigilance',
        text: 'Un beau CV visuellement (avec des icônes, des graphiques de compétences, des colonnes colorées) est souvent catastrophique pour les ATS. Priorisez toujours la lisibilité machine sur l\'esthétique.',
      },
      {
        type: 'h2',
        text: '2. Agrégateurs d\'offres et veille automatique',
      },
      {
        type: 'p',
        text: 'Chercher des offres manuellement sur 5 ou 6 jobboards différents chaque matin est chronophage et inefficace. Les agrégateurs consolident toutes les sources en un seul flux personnalisé, avec des alertes en temps réel.',
      },
      {
        type: 'ul',
        items: [
          'JobSpeeder — analyse 10 000+ offres/jour sur 70+ pays avec matching automatique selon vos critères (poste, lieu, contrat, salaire, mode de travail)',
          'Indeed — le plus grand agrégateur mondial, alertes email configurables',
          'LinkedIn Jobs — indispensable pour le networking associé à la candidature',
          'Welcome to the Jungle — focus startups et scale-ups françaises, profils d\'entreprises détaillés',
          'Apec — dédié aux cadres et ingénieurs en France, offres souvent exclusives',
        ],
      },
      {
        type: 'h2',
        text: '3. Automatisation des candidatures',
      },
      {
        type: 'p',
        text: 'C\'est la catégorie qui a connu la plus forte croissance depuis 2024. L\'idée est simple : au lieu de remplir manuellement les mêmes formulaires encore et encore, un bot le fait à votre place, 24h/24.',
      },
      {
        type: 'ul',
        items: [
          'JobSpeeder — automatisation complète via n8n + Skyvern : matching, génération de lettre, soumission de formulaire, tracking. Plans de 0€ à 149€/mois.',
          'LazyApply — extension Chrome qui postule sur LinkedIn, Indeed et Glassdoor en un clic',
          'Simplify — extension Chrome qui remplit automatiquement les champs des formulaires de candidature',
          'Sonara — IA qui postule à votre place sur la base de votre profil',
        ],
      },
      {
        type: 'callout',
        text: 'Attention aux outils qui postulent sans discernement : une candidature sur un poste pour lequel vous n\'êtes pas qualifié peut nuire à votre réputation auprès du recruteur. Configurez toujours des critères de matching stricts.',
      },
      {
        type: 'h2',
        text: '4. Optimisation LinkedIn',
      },
      {
        type: 'p',
        text: '87% des recruteurs utilisent LinkedIn pour sourcer des candidats — même quand vous ne postulez pas activement. Un profil LinkedIn optimisé génère des sollicitations entrantes (InMail) qui s\'ajoutent à vos candidatures sortantes.',
      },
      {
        type: 'ul',
        items: [
          'Shield Analytics — analyse la portée de vos posts et identifie ce qui génère de l\'engagement dans votre secteur',
          'Taplio — outil de création de contenu LinkedIn avec IA, idéal pour construire une audience dans votre domaine',
          'JobSpeeder Chrome Extension (Beta, plans Platinum et Elite) — automatise les candidatures directement depuis LinkedIn',
          'LinkedIn Premium Career — accès aux InMails, vues de profil détaillées et apprentissages sectoriels',
        ],
      },
      {
        type: 'h2',
        text: '5. Suivi des candidatures',
      },
      {
        type: 'p',
        text: 'Sans tableau de bord, une recherche intensive devient rapidement incontrôlable. Vous oubliez à qui vous avez postulé, quand relancer, et quel CV vous avez envoyé pour quel poste.',
      },
      {
        type: 'ul',
        items: [
          'JobSpeeder Dashboard — centralise automatiquement toutes les candidatures envoyées par le bot, avec statut en temps réel (envoyée, en attente, entretien)',
          'Huntr — kanban visuel pour organiser sa recherche d\'emploi, notes de contacts, rappels',
          'Notion — flexible, permet de créer un CRM candidature personnalisé avec templates gratuits',
          'Google Sheets — le classique, parfait pour une approche simple avec formules de suivi',
        ],
      },
      {
        type: 'h2',
        text: '6. Préparation aux entretiens',
      },
      {
        type: 'p',
        text: 'Décrocher l\'entretien n\'est que la moitié du chemin. La préparation est souvent la différence entre une offre et un refus poli.',
      },
      {
        type: 'ul',
        items: [
          'Yoodli — entraînement aux entretiens avec IA, analyse votre débit, tics de langage et structure de réponse',
          'Interview Warmup (Google) — questions d\'entretien par secteur avec transcription et feedback automatique',
          'ChatGPT / Claude — simulez un entretien en briefant l\'IA sur l\'entreprise et le poste : "joue le rôle d\'un recruteur pour ce poste et pose-moi des questions difficiles"',
          'Glassdoor — retours d\'expérience d\'entretiens réels pour l\'entreprise que vous visez',
        ],
      },
      {
        type: 'h2',
        text: 'La combinaison gagnante',
      },
      {
        type: 'p',
        text: 'La stack optimale en 2025 pour un candidat actif en France : JobSpeeder pour l\'automatisation et le tracking, LinkedIn Premium pour la visibilité entrante, Yoodli pour la préparation aux entretiens, et Claude ou GPT-4o pour la personnalisation des lettres de motivation sur les candidatures prioritaires (grandes entreprises, postes de rêve). Cette combinaison vous permet de maintenir un volume élevé sans sacrifier la qualité sur les opportunités qui comptent vraiment.',
      },
      {
        type: 'callout',
        text: 'Les outils ne remplacent pas la stratégie. Définissez d\'abord clairement ce que vous cherchez (secteur, poste, niveau de responsabilité, salaire cible) — ensuite seulement les outils peuvent être réellement efficaces.',
      },
    ],
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug)
}

export function getRelatedPosts(currentSlug: string, limit = 2): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.slug !== currentSlug).slice(0, limit)
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
