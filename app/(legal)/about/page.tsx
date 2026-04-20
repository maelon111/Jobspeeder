'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'

const content = {
  fr: {
    backHome: '← Retour',
    title: '🙋 Qui sommes-nous ?',
    faqLink: 'Tu as des questions sur le fonctionnement ?',
    faqCta: '→ Consulte notre FAQ',
    intro: `La recherche d'emploi est épuisante. On l'a vécu.\n\nTu te lèves le matin avec de l'énergie, tu ouvres LinkedIn, Indeed, et cinq autres onglets. Tu repères une offre intéressante. Tu cliques. Un formulaire s'ouvre — nom, prénom, email, téléphone, CV, lettre de motivation, puis dix questions supplémentaires sur ta situation, tes prétentions, ta disponibilité.\n\nTu remplis. Tu soumets. Et tu recommences.\n\nDix fois. Vingt fois. Cinquante fois.\n\nLes semaines passent. Les réponses tardent. La motivation s'effrite.\n\nCe n'est pas un manque de compétences. Ce n'est pas un manque de volonté. C'est un système qui épuise les gens avant même qu'ils aient eu la chance de se montrer.`,
    sections: [
      {
        title: 'Pourquoi JobSpeeder existe',
        body: `JobSpeeder est né d'une conviction simple : le temps et l'énergie d'un candidat valent mieux que du copier-coller.\n\nLa partie mécanique de la recherche d'emploi — scruter des centaines d'offres, remplir des formulaires identiques, envoyer des emails standardisés — peut être automatisée. Elle doit l'être. Pour que toi, tu puisses te concentrer sur ce qui fait vraiment la différence :\n\n• Préparer tes entretiens à fond\n• Construire ton réseau avec authenticité\n• Choisir les opportunités qui t'correspondent vraiment\n• Et surtout — préserver ton énergie mentale\n\nParce que la dépression liée à la recherche d'emploi est une réalité que personne ne devrait vivre.`,
      },
      {
        title: "Ce qu'on a construit",
        body: `JobSpeeder combine intelligence artificielle et automatisation pour faire le travail ingrat à ta place :\n\n• Il scanne les offres en continu sur les grandes plateformes\n• Il analyse leur pertinence par rapport à ton profil\n• Il adapte ton CV aux exigences de chaque poste\n• Il vérifie ton score ATS pour éviter d'être filtré avant même qu'un humain te lise\n• Il postule pour toi — via ton navigateur ou depuis nos serveurs — pendant que tu fais autre chose\n\nOn n'est pas un cabinet de recrutement. On ne te promet pas un emploi. On te promet quelque chose de plus précieux : te rendre du temps, de l'énergie, et de la sérénité dans l'une des périodes les plus stressantes de la vie professionnelle.`,
      },
      {
        title: 'Qui se cache derrière JobSpeeder ?',
        body: `Un ingénieur. Un chercheur d'emploi comme toi. Quelqu'un qui a vécu la frustration du système et qui a décidé, plutôt que de se plaindre, de construire la solution qu'il aurait voulu avoir.\n\nJobSpeeder est un projet indépendant, construit avec passion, itéré au contact de vrais utilisateurs. Pas de grande entreprise derrière. Pas d'investisseurs qui dictent la feuille de route. Juste une obsession : rendre la recherche d'emploi moins inhumaine.`,
      },
      {
        title: 'Rejoins ceux qui ont repris le contrôle',
        body: `Des centaines de candidats utilisent déjà JobSpeeder pour postuler plus vite, mieux, et sans s'épuiser. Chaque semaine, on améliore la plateforme. Chaque retour compte.\n\nSi tu es là, c'est que tu mérites mieux que de passer tes journées à remplir des formulaires.\n\nAlors laisse-nous faire le sale boulot. 👊`,
      },
    ],
  },
  en: {
    backHome: '← Back',
    title: '🙋 Who are we?',
    faqLink: 'Got questions about how it works?',
    faqCta: '→ Check our FAQ',
    intro: `Job hunting is exhausting. We've lived it.\n\nYou wake up in the morning with energy, open LinkedIn, Indeed, and five other tabs. You spot an interesting listing. You click. A form opens — name, first name, email, phone, CV, cover letter, then ten additional questions about your situation, salary expectations, availability.\n\nYou fill it in. You submit. And you start again.\n\nTen times. Twenty times. Fifty times.\n\nWeeks pass. Responses are slow. Motivation crumbles.\n\nIt's not a lack of skills. It's not a lack of willpower. It's a system that exhausts people before they've even had a chance to show themselves.`,
    sections: [
      {
        title: 'Why JobSpeeder exists',
        body: `JobSpeeder was born from a simple conviction: a candidate's time and energy are worth more than copy-paste.\n\nThe mechanical part of job hunting — scanning hundreds of listings, filling in identical forms, sending standardized emails — can be automated. It must be. So that you can focus on what truly makes a difference:\n\n• Thoroughly prepare your interviews\n• Build your network with authenticity\n• Choose opportunities that truly suit you\n• And above all — preserve your mental energy\n\nBecause job-search depression is a reality no one should have to experience.`,
      },
      {
        title: 'What we built',
        body: `JobSpeeder combines artificial intelligence and automation to do the grunt work for you:\n\n• It continuously scans listings on major platforms\n• It analyzes their relevance against your profile\n• It adapts your CV to each job's requirements\n• It checks your ATS score to avoid being filtered before a human ever reads you\n• It applies for you — via your browser or from our servers — while you do something else\n\nWe're not a recruitment agency. We don't promise you a job. We promise you something more precious: giving back your time, energy, and peace of mind during one of the most stressful periods of professional life.`,
      },
      {
        title: "Who's behind JobSpeeder?",
        body: `An engineer. A job seeker like you. Someone who lived the frustration of the system and decided, rather than complaining, to build the solution they wished they'd had.\n\nJobSpeeder is an independent project, built with passion, iterated with real users. No big company behind it. No investors dictating the roadmap. Just one obsession: making job hunting less inhumane.`,
      },
      {
        title: 'Join those who have taken back control',
        body: `Hundreds of candidates already use JobSpeeder to apply faster, better, and without burning out. Every week, we improve the platform. Every piece of feedback matters.\n\nIf you're here, it's because you deserve better than spending your days filling out forms.\n\nSo let us do the dirty work. 👊`,
      },
    ],
  },
  es: {
    backHome: '← Volver',
    title: '🙋 ¿Quiénes somos?',
    faqLink: '¿Tienes preguntas sobre el funcionamiento?',
    faqCta: '→ Consulta nuestras FAQ',
    intro: `La búsqueda de empleo es agotadora. Lo hemos vivido.\n\nTe levantas por la mañana con energía, abres LinkedIn, Indeed y cinco pestañas más. Encuentras una oferta interesante. Haces clic. Se abre un formulario — nombre, apellidos, email, teléfono, CV, carta de presentación, y luego diez preguntas adicionales sobre tu situación, pretensiones salariales, disponibilidad.\n\nLo rellenas. Lo envías. Y vuelves a empezar.\n\nDiez veces. Veinte veces. Cincuenta veces.\n\nPasan las semanas. Las respuestas tardan. La motivación se desmorona.\n\nNo es falta de habilidades. No es falta de voluntad. Es un sistema que agota a las personas antes de que hayan tenido siquiera la oportunidad de demostrarse.`,
    sections: [
      {
        title: 'Por qué existe JobSpeeder',
        body: `JobSpeeder nació de una convicción simple: el tiempo y la energía de un candidato valen más que el copiar y pegar.\n\nLa parte mecánica de la búsqueda de empleo — revisar cientos de ofertas, rellenar formularios idénticos, enviar emails estandarizados — puede automatizarse. Debe hacerse. Para que tú puedas concentrarte en lo que realmente marca la diferencia:\n\n• Preparar a fondo tus entrevistas\n• Construir tu red con autenticidad\n• Elegir las oportunidades que realmente te convienen\n• Y sobre todo — preservar tu energía mental\n\nPorque la depresión por búsqueda de empleo es una realidad que nadie debería vivir.`,
      },
      {
        title: 'Lo que hemos construido',
        body: `JobSpeeder combina inteligencia artificial y automatización para hacer el trabajo ingrato por ti:\n\n• Escanea las ofertas continuamente en las principales plataformas\n• Analiza su relevancia respecto a tu perfil\n• Adapta tu CV a los requisitos de cada puesto\n• Verifica tu puntuación ATS para evitar ser filtrado antes de que un humano te lea\n• Postula por ti — desde tu navegador o desde nuestros servidores — mientras haces otra cosa\n\nNo somos una agencia de selección. No te prometemos un empleo. Te prometemos algo más valioso: devolverte tiempo, energía y tranquilidad en uno de los períodos más estresantes de la vida profesional.`,
      },
      {
        title: '¿Quién hay detrás de JobSpeeder?',
        body: `Un ingeniero. Un buscador de empleo como tú. Alguien que vivió la frustración del sistema y decidió, en lugar de quejarse, construir la solución que habría querido tener.\n\nJobSpeeder es un proyecto independiente, construido con pasión, iterado con usuarios reales. Sin una gran empresa detrás. Sin inversores que dicten la hoja de ruta. Solo una obsesión: hacer la búsqueda de empleo menos inhumana.`,
      },
      {
        title: 'Únete a los que han recuperado el control',
        body: `Cientos de candidatos ya usan JobSpeeder para postular más rápido, mejor y sin agotarse. Cada semana mejoramos la plataforma. Cada opinión cuenta.\n\nSi estás aquí, es porque mereces algo mejor que pasar tus días rellenando formularios.\n\nAsí que déjanos hacer el trabajo sucio. 👊`,
      },
    ],
  },
  it: {
    backHome: '← Indietro',
    title: '🙋 Chi siamo?',
    faqLink: 'Hai domande su come funziona?',
    faqCta: '→ Consulta le nostre FAQ',
    intro: `La ricerca di lavoro è estenuante. Lo abbiamo vissuto.\n\nTi alzi al mattino con energia, apri LinkedIn, Indeed e altri cinque tab. Trovi un'offerta interessante. Clicchi. Si apre un modulo — nome, cognome, email, telefono, CV, lettera di presentazione, poi dieci domande aggiuntive sulla tua situazione, le pretese salariali, la disponibilità.\n\nCompili. Invii. E ricominci.\n\nDieci volte. Venti volte. Cinquanta volte.\n\nPassano le settimane. Le risposte tardano. La motivazione si sgretola.\n\nNon è mancanza di competenze. Non è mancanza di volontà. È un sistema che esaurisce le persone prima ancora che abbiano avuto la possibilità di dimostrare il proprio valore.`,
    sections: [
      {
        title: 'Perché esiste JobSpeeder',
        body: `JobSpeeder è nato da una semplice convinzione: il tempo e l'energia di un candidato valgono più del copia-incolla.\n\nLa parte meccanica della ricerca di lavoro — scorrere centinaia di offerte, compilare moduli identici, inviare email standardizzate — può essere automatizzata. Deve esserlo. Così che tu possa concentrarti su ciò che fa davvero la differenza:\n\n• Preparare a fondo i tuoi colloqui\n• Costruire la tua rete con autenticità\n• Scegliere le opportunità che ti corrispondono davvero\n• E soprattutto — preservare la tua energia mentale\n\nPerché la depressione da ricerca di lavoro è una realtà che nessuno dovrebbe vivere.`,
      },
      {
        title: 'Cosa abbiamo costruito',
        body: `JobSpeeder combina intelligenza artificiale e automazione per fare il lavoro ingrato al posto tuo:\n\n• Scansiona continuamente le offerte sulle principali piattaforme\n• Analizza la loro pertinenza rispetto al tuo profilo\n• Adatta il tuo CV ai requisiti di ogni posizione\n• Verifica il tuo punteggio ATS per evitare di essere filtrato prima che un umano ti legga\n• Candida per te — tramite il tuo browser o dai nostri server — mentre tu fai altro\n\nNon siamo un'agenzia di reclutamento. Non ti promettiamo un lavoro. Ti promettiamo qualcosa di più prezioso: restituirti tempo, energia e serenità in uno dei periodi più stressanti della vita professionale.`,
      },
      {
        title: 'Chi c\'è dietro JobSpeeder?',
        body: `Un ingegnere. Un cercatore di lavoro come te. Qualcuno che ha vissuto la frustrazione del sistema e ha deciso, invece di lamentarsi, di costruire la soluzione che avrebbe voluto avere.\n\nJobSpeeder è un progetto indipendente, costruito con passione, migliorato a contatto con utenti reali. Nessuna grande azienda dietro. Nessun investitore che detta la roadmap. Solo un'ossessione: rendere la ricerca di lavoro meno disumana.`,
      },
      {
        title: 'Unisciti a chi ha ripreso il controllo',
        body: `Centinaia di candidati usano già JobSpeeder per candidarsi più velocemente, meglio e senza esaurirsi. Ogni settimana miglioriamo la piattaforma. Ogni feedback conta.\n\nSe sei qui, è perché meriti qualcosa di meglio che passare le tue giornate a compilare moduli.\n\nQuindi lascia che facciamo noi il lavoro sporco. 👊`,
      },
    ],
  },
  de: {
    backHome: '← Zurück',
    title: '🙋 Wer sind wir?',
    faqLink: 'Hast du Fragen zur Funktionsweise?',
    faqCta: '→ Schau in unsere FAQ',
    intro: `Die Jobsuche ist erschöpfend. Wir haben es selbst erlebt.\n\nDu stehst morgens voller Energie auf, öffnest LinkedIn, Indeed und fünf weitere Tabs. Du entdeckst eine interessante Stelle. Du klickst. Ein Formular öffnet sich — Name, Vorname, E-Mail, Telefon, Lebenslauf, Anschreiben, dann zehn weitere Fragen zu deiner Situation, deinen Gehaltsvorstellungen, deiner Verfügbarkeit.\n\nDu füllst aus. Du sendest ab. Und fängst wieder von vorne an.\n\nZehn Mal. Zwanzig Mal. Fünfzig Mal.\n\nWochen vergehen. Antworten lassen auf sich warten. Die Motivation bröckelt.\n\nEs ist kein Mangel an Fähigkeiten. Es ist kein Mangel an Willen. Es ist ein System, das Menschen erschöpft, bevor sie überhaupt die Chance hatten, sich zu zeigen.`,
    sections: [
      {
        title: 'Warum es JobSpeeder gibt',
        body: `JobSpeeder entstand aus einer einfachen Überzeugung: Die Zeit und Energie eines Bewerbers sind mehr wert als Copy-Paste.\n\nDer mechanische Teil der Jobsuche — Hunderte von Stellen durchsuchen, identische Formulare ausfüllen, standardisierte E-Mails versenden — kann automatisiert werden. Es muss so sein. Damit du dich auf das konzentrieren kannst, was wirklich einen Unterschied macht:\n\n• Deine Vorstellungsgespräche gründlich vorbereiten\n• Dein Netzwerk authentisch aufbauen\n• Die Chancen wählen, die wirklich zu dir passen\n• Und vor allem — deine mentale Energie schonen\n\nDenn die Jobsuche-Depression ist eine Realität, die niemand erleben sollte.`,
      },
      {
        title: 'Was wir aufgebaut haben',
        body: `JobSpeeder kombiniert künstliche Intelligenz und Automatisierung, um die mühsame Arbeit für dich zu erledigen:\n\n• Es scannt kontinuierlich Stellen auf den großen Plattformen\n• Es analysiert ihre Relevanz für dein Profil\n• Es passt deinen Lebenslauf an die Anforderungen jeder Stelle an\n• Es prüft deinen ATS-Score, damit du nicht gefiltert wirst, bevor ein Mensch dich liest\n• Es bewirbt sich für dich — über deinen Browser oder von unseren Servern — während du etwas anderes tust\n\nWir sind keine Personalvermittlung. Wir versprechen dir keinen Job. Wir versprechen dir etwas Wertvolleres: dir Zeit, Energie und Gelassenheit in einer der stressigsten Phasen des Berufslebens zurückzugeben.`,
      },
      {
        title: 'Wer steckt hinter JobSpeeder?',
        body: `Ein Ingenieur. Ein Jobsuchender wie du. Jemand, der die Frustration des Systems erlebt hat und beschlossen hat, anstatt zu klagen, die Lösung zu bauen, die er sich gewünscht hätte.\n\nJobSpeeder ist ein unabhängiges Projekt, mit Leidenschaft gebaut und gemeinsam mit echten Nutzern weiterentwickelt. Kein großes Unternehmen dahinter. Keine Investoren, die die Roadmap diktieren. Nur eine Obsession: die Jobsuche menschlicher zu machen.`,
      },
      {
        title: 'Schließ dich denen an, die die Kontrolle zurückgewonnen haben',
        body: `Hunderte von Bewerbern nutzen JobSpeeder bereits, um schneller, besser und ohne Erschöpfung zu bewerben. Jede Woche verbessern wir die Plattform. Jedes Feedback zählt.\n\nWenn du hier bist, dann weil du mehr verdienst, als deine Tage mit dem Ausfüllen von Formularen zu verbringen.\n\nLass uns also die Drecksarbeit machen. 👊`,
      },
    ],
  },
  nl: {
    backHome: '← Terug',
    title: '🙋 Wie zijn wij?',
    faqLink: 'Heb je vragen over hoe het werkt?',
    faqCta: '→ Bekijk onze FAQ',
    intro: `Solliciteren is uitputtend. We hebben het zelf meegemaakt.\n\nJe staat 's ochtends energiek op, opent LinkedIn, Indeed en vijf andere tabbladen. Je ziet een interessante vacature. Je klikt. Een formulier verschijnt — naam, voornaam, e-mail, telefoon, cv, motivatiebrief, dan tien extra vragen over je situatie, salariswensen, beschikbaarheid.\n\nJe vult in. Je verstuurt. En je begint opnieuw.\n\nTien keer. Twintig keer. Vijftig keer.\n\nWeken gaan voorbij. Reacties blijven uit. De motivatie brokkelt af.\n\nHet is geen gebrek aan vaardigheden. Het is geen gebrek aan wilskracht. Het is een systeem dat mensen uitput voordat ze ook maar de kans hebben gehad om zichzelf te laten zien.`,
    sections: [
      {
        title: 'Waarom JobSpeeder bestaat',
        body: `JobSpeeder is ontstaan vanuit een eenvoudige overtuiging: de tijd en energie van een sollicitant zijn meer waard dan kopiëren en plakken.\n\nHet mechanische deel van solliciteren — honderden vacatures doorzoeken, identieke formulieren invullen, gestandaardiseerde e-mails versturen — kan worden geautomatiseerd. Dat moet ook. Zodat jij je kunt concentreren op wat echt het verschil maakt:\n\n• Je sollicitatiegesprekken grondig voorbereiden\n• Je netwerk authentiek opbouwen\n• De kansen kiezen die echt bij je passen\n• En bovenal — je mentale energie bewaren\n\nWant sollicitatiemoeheid is een realiteit die niemand zou moeten meemaken.`,
      },
      {
        title: 'Wat we hebben gebouwd',
        body: `JobSpeeder combineert kunstmatige intelligentie en automatisering om het saaie werk voor jou te doen:\n\n• Het scant continu vacatures op de grote platforms\n• Het analyseert hun relevantie voor jouw profiel\n• Het past jouw cv aan de vereisten van elke functie aan\n• Het controleert je ATS-score om te voorkomen dat je gefilterd wordt voordat een mens je leest\n• Het solliciteert voor jou — via jouw browser of vanuit onze servers — terwijl jij iets anders doet\n\nWe zijn geen uitzendbureau. We beloven je geen baan. We beloven je iets kostbaarders: je tijd, energie en gemoedsrust teruggeven in een van de meest stressvolle periodes van je professionele leven.`,
      },
      {
        title: 'Wie zit er achter JobSpeeder?',
        body: `Een ingenieur. Een sollicitant zoals jij. Iemand die de frustratie van het systeem heeft ervaren en besloot, in plaats van te klagen, de oplossing te bouwen die hij zelf had willen hebben.\n\nJobSpeeder is een onafhankelijk project, gebouwd met passie, voortdurend verbeterd met echte gebruikers. Geen groot bedrijf achter. Geen investeerders die de roadmap bepalen. Alleen één obsessie: solliciteren minder onmenselijk maken.`,
      },
      {
        title: 'Sluit je aan bij wie de controle heeft teruggenomen',
        body: `Honderden kandidaten gebruiken JobSpeeder al om sneller, beter en zonder uitputting te solliciteren. Elke week verbeteren we het platform. Elke reactie telt.\n\nAls je hier bent, dan verdien je beter dan je dagen te spenderen aan het invullen van formulieren.\n\nLaat ons dus het vuile werk doen. 👊`,
      },
    ],
  },
}

function renderBody(text: string) {
  return text.split('\n').map((line, i) => {
    const formatted = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    if (line.startsWith('•')) {
      return (
        <li key={i} className="text-white/60 text-sm leading-relaxed ml-4" dangerouslySetInnerHTML={{ __html: formatted.replace('• ', '') }} />
      )
    }
    if (!line.trim()) return <br key={i} />
    return <p key={i} className="text-white/60 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }} />
  })
}

export default function AboutPage() {
  const { lang } = useLanguage()
  const c = content[lang as keyof typeof content] ?? content.fr

  return (
    <div>
      <Link href="/" className="inline-flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors mb-8">
        {c.backHome}
      </Link>

      <h1 className="text-3xl font-bold text-white mb-8">{c.title}</h1>

      {/* Intro story */}
      <div className="glass rounded-2xl p-6 mb-6">
        <div className="space-y-1.5">{renderBody(c.intro)}</div>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {c.sections.map((section) => (
          <div key={section.title} className="glass rounded-2xl p-6">
            <h2 className="text-base font-semibold text-white mb-4">{section.title}</h2>
            <div className="space-y-1.5">{renderBody(section.body)}</div>
          </div>
        ))}
      </div>

      {/* Link to FAQ */}
      <div className="mt-8 glass rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap">
        <p className="text-white/60 text-sm">{c.faqLink}</p>
        <Link
          href="/faq"
          className="text-sm font-semibold text-brand hover:text-brand-dark transition-colors whitespace-nowrap"
        >
          {c.faqCta}
        </Link>
      </div>
    </div>
  )
}
