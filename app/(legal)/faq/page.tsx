'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'

const content = {
  fr: {
    backHome: '← Retour',
    title: '❓ FAQ — On répond à tout',
    aboutLink: 'Tu veux comprendre notre vision et pourquoi on a créé JobSpeeder ?',
    aboutCta: '→ Notre histoire',
    pricingLabel: 'Voir les tarifs →',
    questions: [
      {
        q: "C'est quoi exactement JobSpeeder ?",
        a: "C'est ton assistant candidature automatisé. Tu configures ton profil une fois — secteur, localisation, type de poste, CV — et JobSpeeder fait le reste : il trouve les offres, analyse leur pertinence, adapte ta candidature et postule pour toi. Pendant ce temps, toi tu te concentres sur ce qui compte vraiment.",
      },
      {
        q: 'Ça marche sur quels sites ?',
        a: "Sur les principales plateformes : LinkedIn, Indeed, et d'autres. Notre système s'adapte automatiquement aux différents types de formulaires. Et on ajoute régulièrement de nouvelles sources.",
      },
      {
        q: "C'est quoi le score ATS et pourquoi c'est important ?",
        a: "La plupart des grandes entreprises utilisent des logiciels (appelés ATS) qui filtrent automatiquement les CV avant qu'un recruteur humain ne les voie. Résultat : un bon profil peut être éliminé juste parce que son CV n'utilise pas les bons mots-clés. La fonctionnalité ATS+ de JobSpeeder analyse ton CV face à une offre et te donne un score. Tu sais exactement où tu en es avant d'envoyer — et tu peux corriger le tir.",
      },
      {
        q: "Mes candidatures partent dans mon dos ?",
        a: "Non — enfin, pas tout à fait. Une partie des candidatures est envoyée directement depuis ton navigateur via notre extension Chrome JobSpeeder LinkedIn Easy Apply. Le reste transite par nos serveurs. Dans les deux cas, JobSpeeder agit selon les critères que tu as définis. Tu restes aux commandes, même sans être devant ton écran.",
      },
      {
        q: "Mon CV s'adapte vraiment à chaque offre ?",
        a: "Oui. JobSpeeder analyse les mots-clés et exigences de chaque poste, et met en avant les compétences de ton profil qui correspondent le mieux. Tu n'envoies plus le même CV générique partout — chaque candidature est ajustée, sans effort de ta part.",
      },
      {
        q: 'Combien de temps avant de voir des résultats ?',
        a: "Ça dépend de ton secteur et de la pression du marché, mais la plupart des utilisateurs constatent une augmentation significative du nombre de candidatures envoyées dès la première semaine. Plus tu envoies, plus tu augmentes tes chances statistiquement. C'est mathématique.",
      },
      {
        q: "Quelle différence avec LinkedIn Easy Apply ?",
        a: "LinkedIn Easy Apply, c'est bien — mais ça reste manuel. Tu dois cliquer sur chaque offre, remplir chaque formulaire toi-même. JobSpeeder automatise tout ce processus, y compris la recherche des offres pertinentes, l'adaptation du CV, et l'envoi. Notre extension va plus loin que ce que LinkedIn propose nativement.",
      },
      {
        q: "Je cherche discrètement, sans que mon employeur le sache. C'est possible ?",
        a: "Tout à fait. JobSpeeder fonctionne en arrière-plan, sans rien publier sur ton profil. Tu gardes le contrôle total de ta visibilité. Ta recherche reste privée.",
      },
      {
        q: "C'est légal ?",
        a: "Oui. JobSpeeder agit exactement comme tu le ferais toi-même : il remplit des formulaires publics en ton nom. Aucune donnée n'est utilisée frauduleusement. Des erreurs peuvent parfois survenir — l'IA n'est pas parfaite — mais elles restent rares et sans conséquence grave.",
      },
      {
        q: "C'est compliqué à utiliser ?",
        a: "Non. Tu crées ton compte, tu uploades ton CV, tu définis tes critères, et c'est parti. Zéro compétence technique requise. Si tu sais utiliser LinkedIn, tu sais utiliser JobSpeeder.",
      },
      {
        q: 'Combien ça coûte ?',
        a: "On propose plusieurs formules selon ton niveau de recherche. Une offre de base pour démarrer, et des plans supérieurs pour postuler sans limite.",
        hasPricing: true,
      },
    ],
  },
  en: {
    backHome: '← Back',
    title: '❓ FAQ — We answer everything',
    aboutLink: 'Want to understand our vision and why we created JobSpeeder?',
    aboutCta: '→ Our story',
    pricingLabel: 'See pricing →',
    questions: [
      {
        q: 'What exactly is JobSpeeder?',
        a: "It's your automated application assistant. You configure your profile once — sector, location, job type, CV — and JobSpeeder does the rest: it finds listings, analyzes their relevance, adapts your application and applies for you. Meanwhile, you focus on what really matters.",
      },
      {
        q: 'Which sites does it work on?',
        a: 'On the main platforms: LinkedIn, Indeed, and others. Our system automatically adapts to different types of forms. And we regularly add new sources.',
      },
      {
        q: "What's the ATS score and why does it matter?",
        a: "Most large companies use software (called ATS) that automatically filters CVs before a human recruiter sees them. Result: a good profile can be eliminated just because the CV doesn't use the right keywords. JobSpeeder's ATS+ feature analyzes your CV against a listing and gives you a score. You know exactly where you stand before applying — and you can correct course.",
      },
      {
        q: 'Are my applications sent without me knowing?',
        a: "No — well, not exactly. Some applications are sent directly from your browser via our Chrome extension JobSpeeder LinkedIn Easy Apply. The rest goes through our servers. In both cases, JobSpeeder acts according to the criteria you've defined. You stay in control, even when you're not at your screen.",
      },
      {
        q: 'Does my CV really adapt to each listing?',
        a: "Yes. JobSpeeder analyzes the keywords and requirements of each position and highlights the skills from your profile that match best. You no longer send the same generic CV everywhere — each application is tailored, without any effort on your part.",
      },
      {
        q: 'How long before seeing results?',
        a: "It depends on your sector and market pressure, but most users notice a significant increase in the number of applications sent within the first week. The more you send, the more you increase your chances statistically. It's mathematical.",
      },
      {
        q: "What's the difference from LinkedIn Easy Apply?",
        a: "LinkedIn Easy Apply is good — but it remains manual. You have to click on each listing, fill out each form yourself. JobSpeeder automates the entire process, including finding relevant listings, adapting the CV, and sending. Our extension goes further than what LinkedIn natively offers.",
      },
      {
        q: "I'm looking discreetly, without my employer knowing. Is that possible?",
        a: 'Absolutely. JobSpeeder works in the background, without posting anything to your profile. You retain full control of your visibility. Your search stays private.',
      },
      {
        q: 'Is it legal?',
        a: "Yes. JobSpeeder acts exactly as you would yourself: it fills out public forms on your behalf. No data is used fraudulently. Errors can sometimes occur — AI isn't perfect — but they remain rare and without serious consequences.",
      },
      {
        q: 'Is it complicated to use?',
        a: 'No. You create your account, upload your CV, define your criteria, and you\'re off. Zero technical skills required. If you know how to use LinkedIn, you know how to use JobSpeeder.',
      },
      {
        q: 'How much does it cost?',
        a: 'We offer several plans depending on your search level. A basic offer to get started, and higher plans to apply without limits.',
        hasPricing: true,
      },
    ],
  },
  es: {
    backHome: '← Volver',
    title: '❓ FAQ — Respondemos a todo',
    aboutLink: '¿Quieres entender nuestra visión y por qué creamos JobSpeeder?',
    aboutCta: '→ Nuestra historia',
    pricingLabel: 'Ver precios →',
    questions: [
      {
        q: '¿Qué es exactamente JobSpeeder?',
        a: 'Es tu asistente de candidaturas automatizado. Configuras tu perfil una vez — sector, localización, tipo de puesto, CV — y JobSpeeder hace el resto: encuentra las ofertas, analiza su relevancia, adapta tu candidatura y postula por ti. Mientras tanto, tú te concentras en lo que realmente importa.',
      },
      {
        q: '¿En qué sitios funciona?',
        a: 'En las principales plataformas: LinkedIn, Indeed y otras. Nuestro sistema se adapta automáticamente a los diferentes tipos de formularios. Y añadimos regularmente nuevas fuentes.',
      },
      {
        q: '¿Qué es la puntuación ATS y por qué es importante?',
        a: 'La mayoría de las grandes empresas utilizan software (llamado ATS) que filtra automáticamente los CVs antes de que un reclutador humano los vea. Resultado: un buen perfil puede ser eliminado simplemente porque su CV no usa las palabras clave correctas. La función ATS+ de JobSpeeder analiza tu CV frente a una oferta y te da una puntuación. Sabes exactamente dónde estás antes de enviar — y puedes corregir el rumbo.',
      },
      {
        q: '¿Mis candidaturas se envían sin que yo lo sepa?',
        a: 'No — bueno, no exactamente. Algunas candidaturas se envían directamente desde tu navegador a través de nuestra extensión Chrome JobSpeeder LinkedIn Easy Apply. El resto pasa por nuestros servidores. En ambos casos, JobSpeeder actúa según los criterios que has definido. Tú sigues al mando, incluso sin estar frente a tu pantalla.',
      },
      {
        q: '¿Mi CV se adapta realmente a cada oferta?',
        a: 'Sí. JobSpeeder analiza las palabras clave y requisitos de cada puesto, y destaca las habilidades de tu perfil que mejor se adaptan. Ya no envías el mismo CV genérico en todas partes — cada candidatura se ajusta, sin ningún esfuerzo por tu parte.',
      },
      {
        q: '¿Cuánto tiempo antes de ver resultados?',
        a: 'Depende de tu sector y la presión del mercado, pero la mayoría de los usuarios constatan un aumento significativo en el número de candidaturas enviadas durante la primera semana. Cuantas más envíes, más aumentas tus posibilidades estadísticamente. Es matemático.',
      },
      {
        q: '¿Qué diferencia hay con LinkedIn Easy Apply?',
        a: 'LinkedIn Easy Apply está bien — pero sigue siendo manual. Tienes que hacer clic en cada oferta, rellenar cada formulario tú mismo. JobSpeeder automatiza todo este proceso, incluyendo la búsqueda de ofertas relevantes, la adaptación del CV y el envío. Nuestra extensión va más allá de lo que LinkedIn ofrece de forma nativa.',
      },
      {
        q: 'Busco discretamente, sin que mi empleador lo sepa. ¿Es posible?',
        a: 'Por supuesto. JobSpeeder funciona en segundo plano, sin publicar nada en tu perfil. Mantienes el control total de tu visibilidad. Tu búsqueda permanece privada.',
      },
      {
        q: '¿Es legal?',
        a: 'Sí. JobSpeeder actúa exactamente como lo harías tú mismo: rellena formularios públicos en tu nombre. Ningún dato se usa de forma fraudulenta. A veces pueden ocurrir errores — la IA no es perfecta — pero son raros y sin consecuencias graves.',
      },
      {
        q: '¿Es complicado de usar?',
        a: 'No. Creas tu cuenta, subes tu CV, defines tus criterios, y listo. Cero habilidades técnicas requeridas. Si sabes usar LinkedIn, sabes usar JobSpeeder.',
      },
      {
        q: '¿Cuánto cuesta?',
        a: 'Ofrecemos varias tarifas según tu nivel de búsqueda. Una oferta básica para empezar y planes superiores para postular sin límites.',
        hasPricing: true,
      },
    ],
  },
  it: {
    backHome: '← Indietro',
    title: '❓ FAQ — Rispondiamo a tutto',
    aboutLink: 'Vuoi capire la nostra visione e perché abbiamo creato JobSpeeder?',
    aboutCta: '→ La nostra storia',
    pricingLabel: 'Vedi i prezzi →',
    questions: [
      {
        q: "Cos'è esattamente JobSpeeder?",
        a: "È il tuo assistente per candidature automatizzato. Configuri il tuo profilo una volta — settore, posizione, tipo di lavoro, CV — e JobSpeeder fa il resto: trova le offerte, ne analizza la pertinenza, adatta la tua candidatura e si candida per te. Nel frattempo, tu ti concentri su ciò che conta davvero.",
      },
      {
        q: 'Su quali siti funziona?',
        a: 'Sulle principali piattaforme: LinkedIn, Indeed e altre. Il nostro sistema si adatta automaticamente ai diversi tipi di moduli. E aggiungiamo regolarmente nuove fonti.',
      },
      {
        q: "Cos'è il punteggio ATS e perché è importante?",
        a: "La maggior parte delle grandi aziende utilizza software (chiamati ATS) che filtrano automaticamente i CV prima che un reclutatore umano li veda. Risultato: un buon profilo può essere eliminato solo perché il CV non usa le parole chiave giuste. La funzione ATS+ di JobSpeeder analizza il tuo CV rispetto a un'offerta e ti dà un punteggio. Sai esattamente dove ti trovi prima di inviare — e puoi correggere il tiro.",
      },
      {
        q: 'Le mie candidature vengono inviate senza che io lo sappia?',
        a: "No — o meglio, non esattamente. Alcune candidature vengono inviate direttamente dal tuo browser tramite la nostra estensione Chrome JobSpeeder LinkedIn Easy Apply. Il resto transita dai nostri server. In entrambi i casi, JobSpeeder agisce secondo i criteri che hai definito. Rimani al comando, anche senza essere davanti allo schermo.",
      },
      {
        q: 'Il mio CV si adatta davvero a ogni offerta?',
        a: "Sì. JobSpeeder analizza le parole chiave e i requisiti di ogni posizione e mette in evidenza le competenze del tuo profilo che corrispondono meglio. Non invii più lo stesso CV generico ovunque — ogni candidatura è personalizzata, senza alcuno sforzo da parte tua.",
      },
      {
        q: 'Quanto tempo prima di vedere risultati?',
        a: "Dipende dal tuo settore e dalla pressione del mercato, ma la maggior parte degli utenti nota un aumento significativo nel numero di candidature inviate fin dalla prima settimana. Più ne invii, più aumenti le tue possibilità statisticamente. È matematico.",
      },
      {
        q: "Qual è la differenza con LinkedIn Easy Apply?",
        a: "LinkedIn Easy Apply va bene — ma rimane manuale. Devi cliccare su ogni offerta, compilare ogni modulo tu stesso. JobSpeeder automatizza l'intero processo, inclusa la ricerca di offerte pertinenti, l'adattamento del CV e l'invio. La nostra estensione va oltre ciò che LinkedIn offre nativamente.",
      },
      {
        q: 'Cerco discretamente, senza che il mio datore di lavoro lo sappia. È possibile?',
        a: 'Assolutamente. JobSpeeder funziona in background, senza pubblicare nulla sul tuo profilo. Mantieni il pieno controllo della tua visibilità. La tua ricerca rimane privata.',
      },
      {
        q: 'È legale?',
        a: "Sì. JobSpeeder agisce esattamente come faresti tu stesso: compila moduli pubblici per tuo conto. Nessun dato viene usato fraudolentemente. A volte possono verificarsi errori — l'IA non è perfetta — ma rimangono rari e senza conseguenze gravi.",
      },
      {
        q: 'È complicato da usare?',
        a: "No. Crei il tuo account, carichi il CV, definisci i criteri e sei pronto. Zero competenze tecniche richieste. Se sai usare LinkedIn, sai usare JobSpeeder.",
      },
      {
        q: 'Quanto costa?',
        a: "Offriamo diversi piani in base al tuo livello di ricerca. Un'offerta base per iniziare e piani superiori per candidarsi senza limiti.",
        hasPricing: true,
      },
    ],
  },
  de: {
    backHome: '← Zurück',
    title: '❓ FAQ — Wir antworten auf alles',
    aboutLink: 'Möchtest du unsere Vision verstehen und warum wir JobSpeeder erstellt haben?',
    aboutCta: '→ Unsere Geschichte',
    pricingLabel: 'Preise ansehen →',
    questions: [
      {
        q: 'Was genau ist JobSpeeder?',
        a: 'Es ist dein automatisierter Bewerbungsassistent. Du konfigurierst dein Profil einmal — Branche, Standort, Stellentyp, Lebenslauf — und JobSpeeder erledigt den Rest: Es findet Stellen, analysiert ihre Relevanz, passt deine Bewerbung an und bewirbt sich für dich. Währenddessen konzentrierst du dich auf das, was wirklich zählt.',
      },
      {
        q: 'Auf welchen Seiten funktioniert es?',
        a: 'Auf den wichtigsten Plattformen: LinkedIn, Indeed und anderen. Unser System passt sich automatisch an verschiedene Arten von Formularen an. Und wir fügen regelmäßig neue Quellen hinzu.',
      },
      {
        q: 'Was ist der ATS-Score und warum ist er wichtig?',
        a: 'Die meisten großen Unternehmen verwenden Software (sogenannte ATS), die Lebensläufe automatisch filtert, bevor ein menschlicher Recruiter sie sieht. Ergebnis: Ein gutes Profil kann aussortiert werden, nur weil der Lebenslauf nicht die richtigen Schlüsselwörter verwendet. Die ATS+-Funktion von JobSpeeder analysiert deinen Lebenslauf gegenüber einer Stelle und gibt dir einen Score. Du weißt genau, wo du stehst, bevor du sendest — und kannst nachbessern.',
      },
      {
        q: 'Werden meine Bewerbungen ohne mein Wissen verschickt?',
        a: 'Nein — zumindest nicht ganz. Einige Bewerbungen werden direkt von deinem Browser über unsere Chrome-Erweiterung JobSpeeder LinkedIn Easy Apply gesendet. Der Rest läuft über unsere Server. In beiden Fällen handelt JobSpeeder nach den Kriterien, die du festgelegt hast. Du behältst die Kontrolle, auch wenn du nicht vor deinem Bildschirm bist.',
      },
      {
        q: 'Passt sich mein Lebenslauf wirklich an jede Stelle an?',
        a: 'Ja. JobSpeeder analysiert die Schlüsselwörter und Anforderungen jeder Position und hebt die Fähigkeiten deines Profils hervor, die am besten passen. Du schickst nicht mehr überall denselben generischen Lebenslauf — jede Bewerbung wird angepasst, ohne Aufwand deinerseits.',
      },
      {
        q: 'Wie lange, bis man Ergebnisse sieht?',
        a: 'Das hängt von deiner Branche und dem Marktdruck ab, aber die meisten Nutzer bemerken bereits in der ersten Woche eine deutliche Zunahme der gesendeten Bewerbungen. Je mehr du sendest, desto mehr erhöhst du deine Chancen statistisch. Das ist Mathematik.',
      },
      {
        q: 'Was ist der Unterschied zu LinkedIn Easy Apply?',
        a: 'LinkedIn Easy Apply ist gut — aber es bleibt manuell. Du musst auf jede Stelle klicken, jedes Formular selbst ausfüllen. JobSpeeder automatisiert den gesamten Prozess, einschließlich der Suche nach relevanten Stellen, der Anpassung des Lebenslaufs und des Versands. Unsere Erweiterung geht weiter als das, was LinkedIn nativ bietet.',
      },
      {
        q: 'Ich suche diskret, ohne dass mein Arbeitgeber es weiß. Ist das möglich?',
        a: 'Absolut. JobSpeeder arbeitet im Hintergrund, ohne etwas in deinem Profil zu veröffentlichen. Du behältst die volle Kontrolle über deine Sichtbarkeit. Deine Suche bleibt privat.',
      },
      {
        q: 'Ist es legal?',
        a: 'Ja. JobSpeeder handelt genau so, wie du es selbst tun würdest: Es füllt öffentliche Formulare in deinem Namen aus. Keine Daten werden missbräuchlich verwendet. Fehler können gelegentlich auftreten — KI ist nicht perfekt — aber sie bleiben selten und ohne schwerwiegende Folgen.',
      },
      {
        q: 'Ist es kompliziert zu verwenden?',
        a: 'Nein. Du erstellst dein Konto, lädst deinen Lebenslauf hoch, definierst deine Kriterien, und los geht\'s. Null technische Kenntnisse erforderlich. Wenn du weißt, wie man LinkedIn benutzt, weißt du, wie man JobSpeeder benutzt.',
      },
      {
        q: 'Was kostet es?',
        a: 'Wir bieten je nach Suchintensität verschiedene Pläne an. Ein Basisangebot zum Einstieg und höhere Pläne zum unbegrenzten Bewerben.',
        hasPricing: true,
      },
    ],
  },
  nl: {
    backHome: '← Terug',
    title: '❓ FAQ — We beantwoorden alles',
    aboutLink: 'Wil je onze visie begrijpen en waarom we JobSpeeder hebben gemaakt?',
    aboutCta: '→ Ons verhaal',
    pricingLabel: 'Bekijk prijzen →',
    questions: [
      {
        q: 'Wat is JobSpeeder precies?',
        a: "Het is je geautomatiseerde sollicitatie-assistent. Je configureert je profiel één keer — sector, locatie, functietype, cv — en JobSpeeder doet de rest: het vindt vacatures, analyseert hun relevantie, past je sollicitatie aan en solliciteert voor jou. Ondertussen concentreer jij je op wat echt telt.",
      },
      {
        q: 'Op welke sites werkt het?',
        a: 'Op de belangrijkste platforms: LinkedIn, Indeed en andere. Ons systeem past zich automatisch aan aan verschillende soorten formulieren. En we voegen regelmatig nieuwe bronnen toe.',
      },
      {
        q: 'Wat is de ATS-score en waarom is die belangrijk?',
        a: "De meeste grote bedrijven gebruiken software (ATS genaamd) die cv's automatisch filtert voordat een menselijke recruiter ze ziet. Resultaat: een goed profiel kan worden geëlimineerd alleen omdat het cv de juiste trefwoorden niet gebruikt. De ATS+-functie van JobSpeeder analyseert jouw cv ten opzichte van een vacature en geeft je een score. Je weet precies waar je staat vóór het versturen — en je kunt bijsturen.",
      },
      {
        q: 'Worden mijn sollicitaties zonder mijn medeweten verstuurd?',
        a: "Nee — althans niet helemaal. Sommige sollicitaties worden rechtstreeks vanuit je browser verstuurd via onze Chrome-extensie JobSpeeder LinkedIn Easy Apply. De rest gaat via onze servers. In beide gevallen handelt JobSpeeder volgens de criteria die je hebt ingesteld. Jij blijft in controle, ook als je niet achter je scherm zit.",
      },
      {
        q: 'Past mijn cv zich echt aan bij elke vacature?',
        a: "Ja. JobSpeeder analyseert de trefwoorden en vereisten van elke functie en belicht de vaardigheden uit jouw profiel die het beste aansluiten. Je stuurt niet langer hetzelfde generieke cv overal naartoe — elke sollicitatie wordt aangepast, zonder enige moeite van jouw kant.",
      },
      {
        q: 'Hoe lang duurt het voor je resultaten ziet?',
        a: "Dat hangt af van je sector en de marktdruk, maar de meeste gebruikers merken al in de eerste week een significante toename van het aantal verstuurde sollicitaties. Hoe meer je verstuurt, hoe groter je kansen statistisch gezien. Dat is wiskunde.",
      },
      {
        q: 'Wat is het verschil met LinkedIn Easy Apply?',
        a: "LinkedIn Easy Apply is handig — maar het blijft handmatig. Je moet op elke vacature klikken, elk formulier zelf invullen. JobSpeeder automatiseert het hele proces, inclusief het zoeken naar relevante vacatures, het aanpassen van het cv en het versturen. Onze extensie gaat verder dan wat LinkedIn zelf biedt.",
      },
      {
        q: 'Ik zoek discreet, zonder dat mijn werkgever het weet. Is dat mogelijk?',
        a: 'Absoluut. JobSpeeder werkt op de achtergrond, zonder iets op je profiel te publiceren. Je behoudt volledige controle over je zichtbaarheid. Je zoektocht blijft privé.',
      },
      {
        q: 'Is het legaal?',
        a: "Ja. JobSpeeder handelt precies zoals jij dat zelf zou doen: het vult openbare formulieren in jouw naam in. Er worden geen gegevens frauduleus gebruikt. Soms kunnen er fouten optreden — AI is niet perfect — maar ze blijven zeldzaam en zonder ernstige gevolgen.",
      },
      {
        q: 'Is het ingewikkeld om te gebruiken?',
        a: "Nee. Je maakt een account aan, uploadt je cv, definieert je criteria en je bent klaar. Nul technische vaardigheden vereist. Als je LinkedIn kunt gebruiken, kun je JobSpeeder gebruiken.",
      },
      {
        q: 'Hoeveel kost het?',
        a: 'We bieden verschillende plannen aan afhankelijk van je zoekintensiteit. Een basisaanbod om te starten en hogere plannen om zonder limiet te solliciteren.',
        hasPricing: true,
      },
    ],
  },
}

export default function FaqPage() {
  const { lang } = useLanguage()
  const c = content[lang as keyof typeof content] ?? content.fr

  return (
    <div>
      <Link href="/" className="inline-flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors mb-8">
        {c.backHome}
      </Link>

      <h1 className="text-3xl font-bold text-white mb-8">{c.title}</h1>

      <div className="space-y-4">
        {c.questions.map((item, i) => (
          <div key={i} className="glass rounded-2xl p-6">
            <h2 className="text-base font-semibold text-white mb-3">{item.q}</h2>
            <p className="text-white/60 text-sm leading-relaxed">{item.a}</p>
            {item.hasPricing && (
              <Link
                href="/pricing"
                className="inline-block mt-3 text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
              >
                {c.pricingLabel}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Link to About */}
      <div className="mt-8 glass rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap">
        <p className="text-white/60 text-sm">{c.aboutLink}</p>
        <Link
          href="/about"
          className="text-sm font-semibold text-brand hover:text-brand-dark transition-colors whitespace-nowrap"
        >
          {c.aboutCta}
        </Link>
      </div>
    </div>
  )
}
