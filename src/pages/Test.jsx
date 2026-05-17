import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// ══════════════════════════════════════════════════════════
// 72 QUESTIONS — RIASEC
// Format : { id, dim, cat, fr: {q, hint}, en: {q, hint}, type }
// type : 'interet' | 'aptitude' | 'personnalite'
// ══════════════════════════════════════════════════════════
const QUESTIONS = [
  // ── CATÉGORIE A — Activités & Intérêts (Q1–Q24) ──
  { id:1,  dim:'R', cat:'A', type:'interet',
    fr:{ q:"J'aime travailler à l'extérieur (pluie, soleil, froid)", hint:"Ex : jardiner, travailler sur un chantier, randonnée..." },
    en:{ q:"I like working outdoors (rain, sun, cold)", hint:"Ex: gardening, working on a construction site, hiking..." }},
  { id:2,  dim:'I', cat:'A', type:'interet',
    fr:{ q:"J'adore lire des revues scientifiques ou spécialisées", hint:"Ex : magazines de science, de technologie, documentaires..." },
    en:{ q:"I love reading scientific or specialized magazines", hint:"Ex: science, technology magazines, documentaries..." }},
  { id:3,  dim:'A', cat:'A', type:'interet',
    fr:{ q:"Apprendre de nouvelles langues est nécessaire pour avancer dans ma carrière", hint:"Ex : anglais, espagnol, chinois pour ouvrir plus de portes..." },
    en:{ q:"Learning new languages is necessary to advance in my career", hint:"Ex: English, Spanish, Chinese to open more doors..." }},
  { id:4,  dim:'S', cat:'A', type:'interet',
    fr:{ q:"J'adore m'engager dans des organismes sociaux ou communautaires", hint:"Ex : bénévolat, association de quartier, événements caritatifs..." },
    en:{ q:"I love getting involved in social or community organizations", hint:"Ex: volunteering, neighborhood association, charity events..." }},
  { id:5,  dim:'E', cat:'A', type:'interet',
    fr:{ q:"J'aime vendre un produit ou une idée nouvelle", hint:"Ex : convaincre quelqu'un d'acheter, pitcher un projet..." },
    en:{ q:"I like selling a product or a new idea", hint:"Ex: convincing someone to buy, pitching a project..." }},
  { id:6,  dim:'C', cat:'A', type:'interet',
    fr:{ q:"Je préfère effectuer des tâches qui soient clairement définies", hint:"Ex : préférer un exercice avec des consignes précises plutôt qu'un travail libre..." },
    en:{ q:"I prefer performing tasks that are clearly defined", hint:"Ex: preferring an exercise with precise instructions rather than free work..." }},
  { id:7,  dim:'R', cat:'A', type:'interet',
    fr:{ q:"Travailler avec des outils tels que tournevis, ciseaux, pince, etc.", hint:"Ex : réparer un objet cassé, faire du bricolage à la maison..." },
    en:{ q:"Working with tools such as screwdrivers, scissors, pliers, etc.", hint:"Ex: repairing a broken object, doing DIY at home..." }},
  { id:8,  dim:'I', cat:'A', type:'interet',
    fr:{ q:"Je suis intéressé à faire des recherches scientifiques pour satisfaire ma curiosité", hint:"Ex : faire des expériences, chercher des réponses à des questions complexes..." },
    en:{ q:"I am interested in doing scientific research to satisfy my curiosity", hint:"Ex: doing experiments, seeking answers to complex questions..." }},
  { id:9,  dim:'A', cat:'A', type:'interet',
    fr:{ q:"J'adore imaginer de nouvelles façons de faire les choses", hint:"Ex : trouver une solution originale à un problème, réinventer une recette..." },
    en:{ q:"I love imagining new ways of doing things", hint:"Ex: finding an original solution to a problem, reinventing a recipe..." }},
  { id:10, dim:'S', cat:'A', type:'interet',
    fr:{ q:"Il m'intéresse de rencontrer des gens pour les aider à résoudre leurs problèmes", hint:"Ex : écouter un ami en difficulté, aider quelqu'un à prendre une décision..." },
    en:{ q:"I am interested in meeting people to help them solve their problems", hint:"Ex: listening to a struggling friend, helping someone make a decision..." }},
  { id:11, dim:'E', cat:'A', type:'interet',
    fr:{ q:"Dans l'avenir, j'aimerais mettre sur pied mon propre commerce", hint:"Ex : ouvrir une boutique, créer une startup, lancer un projet entrepreneurial..." },
    en:{ q:"In the future, I would like to set up my own business", hint:"Ex: opening a store, creating a startup, launching an entrepreneurial project..." }},
  { id:12, dim:'C', cat:'A', type:'interet',
    fr:{ q:"J'ai tendance à garder mon espace de travail à l'ordre", hint:"Ex : ranger son bureau avant de travailler, classer ses fichiers..." },
    en:{ q:"I tend to keep my workspace tidy", hint:"Ex: tidying your desk before working, organizing your files..." }},
  { id:13, dim:'R', cat:'A', type:'interet',
    fr:{ q:"Je suis intéressé à suivre un cours de dessin mécanique", hint:"Ex : apprendre à lire des plans techniques, dessiner des pièces mécaniques..." },
    en:{ q:"I am interested in taking a mechanical drawing course", hint:"Ex: learning to read technical drawings, drawing mechanical parts..." }},
  { id:14, dim:'I', cat:'A', type:'interet',
    fr:{ q:"Il est capital pour moi de suivre des cours de sciences", hint:"Ex : apprécier la physique, chimie, SVT et vouloir approfondir ces matières..." },
    en:{ q:"It is important for me to take science courses", hint:"Ex: appreciating physics, chemistry, life sciences and wanting to go deeper..." }},
  { id:15, dim:'A', cat:'A', type:'interet',
    fr:{ q:"J'aime écrire des romans, des articles de journaux", hint:"Ex : tenir un blog, écrire des histoires courtes, rédiger pour le journal du lycée..." },
    en:{ q:"I like writing novels, newspaper articles", hint:"Ex: keeping a blog, writing short stories, writing for the school newspaper..." }},
  { id:16, dim:'S', cat:'A', type:'interet',
    fr:{ q:"J'ai tendance à aider les gens à prendre conscience de leurs possibilités", hint:"Ex : encourager un ami à postuler pour une bourse, motiver quelqu'un à développer un talent..." },
    en:{ q:"I tend to help people become aware of their possibilities", hint:"Ex: encouraging a friend to apply for a scholarship, motivating someone to develop a talent..." }},
  { id:17, dim:'E', cat:'A', type:'interet',
    fr:{ q:"Pour moi, défendre une cause est quelque chose de très vital", hint:"Ex : militer pour l'environnement, défendre les droits des étudiants..." },
    en:{ q:"For me, defending a cause is something very vital", hint:"Ex: advocating for the environment, defending student rights..." }},
  { id:18, dim:'C', cat:'A', type:'interet',
    fr:{ q:"J'adore préparer des comptes rendus de réunions", hint:"Ex : noter les points importants d'une réunion, rédiger un résumé structuré..." },
    en:{ q:"I love preparing meeting minutes", hint:"Ex: noting important points from a meeting, writing a structured summary..." }},
  { id:19, dim:'R', cat:'A', type:'interet',
    fr:{ q:"Il m'intéresse de travailler avec de la machinerie", hint:"Ex : conduire un tracteur, utiliser une machine industrielle, programmer un robot..." },
    en:{ q:"I am interested in working with machinery", hint:"Ex: driving a tractor, using industrial machinery, programming a robot..." }},
  { id:20, dim:'I', cat:'A', type:'interet',
    fr:{ q:"J'aime résoudre des problèmes mathématiques", hint:"Ex : trouver la solution d'une équation complexe, résoudre des puzzles logiques..." },
    en:{ q:"I like solving mathematical problems", hint:"Ex: finding the solution to a complex equation, solving logic puzzles..." }},
  { id:21, dim:'A', cat:'A', type:'interet',
    fr:{ q:"J'aime dessiner des meubles, des plans de maison, des décors, etc.", hint:"Ex : esquisser l'aménagement de sa chambre, créer des maquettes..." },
    en:{ q:"I like drawing furniture, house plans, decorations, etc.", hint:"Ex: sketching a room layout, creating models..." }},
  { id:22, dim:'S', cat:'A', type:'interet',
    fr:{ q:"J'adore animer un groupe de personnes", hint:"Ex : organiser une activité de groupe, animer un débat en classe..." },
    en:{ q:"I love leading a group of people", hint:"Ex: organizing a group activity, leading a class debate..." }},
  { id:23, dim:'E', cat:'A', type:'interet',
    fr:{ q:"Je suis attiré par la gestion des projets spéciaux", hint:"Ex : coordonner l'organisation d'un événement scolaire, gérer un projet associatif..." },
    en:{ q:"I am attracted to managing special projects", hint:"Ex: coordinating a school event, managing an association project..." }},
  { id:24, dim:'C', cat:'A', type:'interet',
    fr:{ q:"Je préfère m'adonner à des activités régulières", hint:"Ex : avoir une routine quotidienne stable, suivre un planning précis..." },
    en:{ q:"I prefer engaging in regular activities", hint:"Ex: having a stable daily routine, following a precise schedule..." }},

  // ── CATÉGORIE B — Aptitudes & Compétences (Q25–Q48) ──
  { id:25, dim:'R', cat:'B', type:'aptitude',
    fr:{ q:"La rapidité de mes réflexes est :", hint:"Ex : réagir vite face à une situation imprévue, attraper un objet qui tombe..." },
    en:{ q:"The speed of my reflexes is:", hint:"Ex: reacting quickly to an unexpected situation, catching a falling object..." }},
  { id:26, dim:'I', cat:'B', type:'aptitude',
    fr:{ q:"Ma capacité de synthèse est :", hint:"Ex : résumer un chapitre de cours en quelques points clés rapidement..." },
    en:{ q:"My ability to synthesize information is:", hint:"Ex: summarizing a chapter in a few key points quickly..." }},
  { id:27, dim:'A', cat:'B', type:'aptitude',
    fr:{ q:"Mon talent dans les arts de la scène (théâtre, danse, musique, etc.) est :", hint:"Ex : jouer la comédie, danser lors d'un spectacle, chanter ou jouer d'un instrument..." },
    en:{ q:"My talent in performing arts (theater, dance, music, etc.) is:", hint:"Ex: acting, dancing in a show, singing or playing an instrument..." }},
  { id:28, dim:'S', cat:'B', type:'aptitude',
    fr:{ q:"Ma capacité à aider les autres, à les comprendre, à les écouter est :", hint:"Ex : savoir écouter sans juger, comprendre les émotions de l'autre..." },
    en:{ q:"My ability to help others, understand them, listen to them is:", hint:"Ex: knowing how to listen without judging, understanding others' emotions..." }},
  { id:29, dim:'E', cat:'B', type:'aptitude',
    fr:{ q:"Mon sens entrepreneurial et des affaires est :", hint:"Ex : identifier une opportunité de marché, savoir négocier, lancer un projet..." },
    en:{ q:"My entrepreneurial and business sense is:", hint:"Ex: identifying a market opportunity, knowing how to negotiate, launching a project..." }},
  { id:30, dim:'C', cat:'B', type:'aptitude',
    fr:{ q:"Le niveau et le sens de l'organisation chez moi sont :", hint:"Ex : planifier son temps, classer ses documents, respecter les délais..." },
    en:{ q:"My level and sense of organization are:", hint:"Ex: planning your time, filing documents, meeting deadlines..." }},
  { id:31, dim:'R', cat:'B', type:'aptitude',
    fr:{ q:"Ma capacité à installer et à manipuler divers outils, machines ou appareils est :", hint:"Ex : assembler un meuble en kit, réparer un appareil électronique..." },
    en:{ q:"My ability to install and operate various tools, machines or devices is:", hint:"Ex: assembling flat-pack furniture, repairing an electronic device..." }},
  { id:32, dim:'I', cat:'B', type:'aptitude',
    fr:{ q:"Ma capacité à saisir et comprendre des directives rapidement est :", hint:"Ex : comprendre une consigne complexe du premier coup, suivre un mode d'emploi..." },
    en:{ q:"My ability to quickly grasp and understand instructions is:", hint:"Ex: understanding a complex instruction the first time, following a manual..." }},
  { id:33, dim:'A', cat:'B', type:'aptitude',
    fr:{ q:"Ma motivation et ma capacité à apprendre des langues sont :", hint:"Ex : mémoriser du vocabulaire facilement, imiter un accent, communiquer en langue étrangère..." },
    en:{ q:"My motivation and ability to learn languages are:", hint:"Ex: easily memorizing vocabulary, imitating an accent, communicating in a foreign language..." }},
  { id:34, dim:'S', cat:'B', type:'aptitude',
    fr:{ q:"Ma capacité à expliquer les choses clairement est :", hint:"Ex : expliquer un cours à un camarade, décrire un itinéraire précisément..." },
    en:{ q:"My ability to explain things clearly is:", hint:"Ex: explaining a lesson to a classmate, describing directions precisely..." }},
  { id:35, dim:'E', cat:'B', type:'aptitude',
    fr:{ q:"Mon aptitude à défendre une cause est :", hint:"Ex : argumenter pour convaincre, mobiliser des personnes, prendre la parole en public..." },
    en:{ q:"My ability to defend a cause is:", hint:"Ex: arguing to convince, mobilizing people, speaking in public..." }},
  { id:36, dim:'C', cat:'B', type:'aptitude',
    fr:{ q:"Mon aptitude à travailler avec précision est :", hint:"Ex : recopier des données sans erreur, faire des calculs exacts, respecter des mesures..." },
    en:{ q:"My ability to work with precision is:", hint:"Ex: copying data without errors, making exact calculations, following measurements..." }},
  { id:37, dim:'R', cat:'B', type:'aptitude',
    fr:{ q:"Ma capacité à utiliser des outils, des objets, des machines avec précision est :", hint:"Ex : découper droit avec des ciseaux, utiliser un niveau à bulle, régler un appareil..." },
    en:{ q:"My ability to use tools, objects, machines with precision is:", hint:"Ex: cutting straight with scissors, using a spirit level, adjusting a device..." }},
  { id:38, dim:'I', cat:'B', type:'aptitude',
    fr:{ q:"Ma capacité d'analyse est :", hint:"Ex : décomposer un problème complexe, identifier les causes d'un phénomène..." },
    en:{ q:"My analytical ability is:", hint:"Ex: breaking down a complex problem, identifying the causes of a phenomenon..." }},
  { id:39, dim:'A', cat:'B', type:'aptitude',
    fr:{ q:"Ma capacité à travailler par moi-même est :", hint:"Ex : travailler seul sur un projet créatif, avancer sans validation constante..." },
    en:{ q:"My ability to work on my own is:", hint:"Ex: working alone on a creative project, moving forward without constant validation..." }},
  { id:40, dim:'S', cat:'B', type:'aptitude',
    fr:{ q:"Ma capacité à communiquer avec les autres est :", hint:"Ex : engager facilement la conversation, s'exprimer clairement à l'oral et à l'écrit..." },
    en:{ q:"My ability to communicate with others is:", hint:"Ex: easily starting conversations, expressing yourself clearly orally and in writing..." }},
  { id:41, dim:'E', cat:'B', type:'aptitude',
    fr:{ q:"Ma capacité à prendre une décision seul(e) est :", hint:"Ex : choisir rapidement sans hésiter, assumer ses choix même sous pression..." },
    en:{ q:"My ability to make a decision on my own is:", hint:"Ex: choosing quickly without hesitation, owning your choices even under pressure..." }},
  { id:42, dim:'C', cat:'B', type:'aptitude',
    fr:{ q:"Ma capacité à m'adapter à un travail routinier est :", hint:"Ex : effectuer les mêmes tâches chaque jour sans s'ennuyer..." },
    en:{ q:"My ability to adapt to routine work is:", hint:"Ex: performing the same tasks every day without getting bored..." }},
  { id:43, dim:'R', cat:'B', type:'aptitude',
    fr:{ q:"Mon habileté dans les mouvements demandant à voir et à manipuler mes mains en même temps est :", hint:"Ex : taper rapidement au clavier, jouer d'un instrument, assembler de petites pièces..." },
    en:{ q:"My skill in movements requiring hand-eye coordination is:", hint:"Ex: typing quickly, playing an instrument, assembling small parts..." }},
  { id:44, dim:'I', cat:'B', type:'aptitude',
    fr:{ q:"Mon talent à rédiger clairement un texte est :", hint:"Ex : rédiger une dissertation structurée, écrire un email professionnel clair..." },
    en:{ q:"My talent for writing clearly is:", hint:"Ex: writing a structured essay, writing a clear professional email..." }},
  { id:45, dim:'A', cat:'B', type:'aptitude',
    fr:{ q:"Ma capacité à accepter la critique est :", hint:"Ex : recevoir un avis négatif sur son travail sans se décourager..." },
    en:{ q:"My ability to accept criticism is:", hint:"Ex: receiving negative feedback on your work without getting discouraged..." }},
  { id:46, dim:'S', cat:'B', type:'aptitude',
    fr:{ q:"Ma capacité à demeurer enthousiaste et énergique même en situation difficile est :", hint:"Ex : rester motivé lors d'une période stressante, encourager son équipe..." },
    en:{ q:"My ability to remain enthusiastic and energetic even in difficult situations is:", hint:"Ex: staying motivated during a stressful period, encouraging your team..." }},
  { id:47, dim:'E', cat:'B', type:'aptitude',
    fr:{ q:"Ma capacité à convaincre et à influencer les autres est :", hint:"Ex : persuader un groupe d'adopter ton idée, négocier un accord favorable..." },
    en:{ q:"My ability to convince and influence others is:", hint:"Ex: persuading a group to adopt your idea, negotiating a favorable deal..." }},
  { id:48, dim:'C', cat:'B', type:'aptitude',
    fr:{ q:"Ma capacité à observer les détails est :", hint:"Ex : repérer une faute d'orthographe dans un texte, remarquer qu'un chiffre est erroné..." },
    en:{ q:"My ability to observe details is:", hint:"Ex: spotting a spelling mistake in a text, noticing an incorrect number..." }},

  // ── CATÉGORIE C — Personnalité & Traits (Q49–Q72) ──
  { id:49, dim:'R', cat:'C', type:'personnalite',
    fr:{ q:"Je préfère agir plutôt que de discuter trop longuement de ce que l'on va faire", hint:"Ex : lors d'un projet de groupe, tu commences directement à travailler plutôt que de trop planifier..." },
    en:{ q:"I prefer acting rather than discussing too long about what to do", hint:"Ex: in a group project, you start working directly rather than over-planning..." }},
  { id:50, dim:'I', cat:'C', type:'personnalite',
    fr:{ q:"J'analyse les idées, les événements, ce qui se passe autour de moi", hint:"Ex : tu cherches toujours à comprendre pourquoi les choses se passent ainsi..." },
    en:{ q:"I analyze ideas, events, what is happening around me", hint:"Ex: you always try to understand why things happen the way they do..." }},
  { id:51, dim:'A', cat:'C', type:'personnalite',
    fr:{ q:"Dans mes travaux, je fais preuve d'originalité, d'imagination et d'intuition", hint:"Ex : tes exposés ont toujours une touche originale, tu aimes surprendre..." },
    en:{ q:"In my work, I show originality, imagination and intuition", hint:"Ex: your presentations always have an original touch, you like to surprise..." }},
  { id:52, dim:'S', cat:'C', type:'personnalite',
    fr:{ q:"Quand un problème se pose, je préfère le régler par la discussion et l'entente", hint:"Ex : en cas de conflit, tu cherches le dialogue et le compromis..." },
    en:{ q:"When a problem arises, I prefer to resolve it through discussion and agreement", hint:"Ex: in case of conflict, you seek dialogue and compromise..." }},
  { id:53, dim:'E', cat:'C', type:'personnalite',
    fr:{ q:"L'aventure m'attire beaucoup", hint:"Ex : tu aimes tenter de nouvelles expériences, voyager, explorer des situations inconnues..." },
    en:{ q:"Adventure attracts me a lot", hint:"Ex: you like trying new experiences, traveling, exploring unknown situations..." }},
  { id:54, dim:'C', cat:'C', type:'personnalite',
    fr:{ q:"J'aime travailler avec beaucoup de soin", hint:"Ex : tu vérifies toujours ton travail avant de le rendre, tu fais attention aux détails..." },
    en:{ q:"I like working with great care", hint:"Ex: you always check your work before submitting, you pay attention to details..." }},
  { id:55, dim:'R', cat:'C', type:'personnalite',
    fr:{ q:"Avec mon entourage, je suis franc(he) et sincère", hint:"Ex : tu dis ce que tu penses directement, sans détour..." },
    en:{ q:"With those around me, I am frank and sincere", hint:"Ex: you say what you think directly, without detours..." }},
  { id:56, dim:'I', cat:'C', type:'personnalite',
    fr:{ q:"Avant toute décision, je réunis le maximum d'information possible", hint:"Ex : tu fais des recherches approfondies avant de choisir une filière ou de donner un avis..." },
    en:{ q:"Before any decision, I gather as much information as possible", hint:"Ex: you do thorough research before choosing a field or giving an opinion..." }},
  { id:57, dim:'A', cat:'C', type:'personnalite',
    fr:{ q:"Je suis porté(e) à tout idéaliser et à chercher la perfection", hint:"Ex : tu n'es jamais tout à fait satisfait de ton travail, tu cherches toujours à l'améliorer..." },
    en:{ q:"I tend to idealize everything and seek perfection", hint:"Ex: you are never quite satisfied with your work, you always try to improve it..." }},
  { id:58, dim:'S', cat:'C', type:'personnalite',
    fr:{ q:"Je mets ma coopération au service des autres personnes", hint:"Ex : tu te portes volontaire pour aider tes camarades, tu partages tes notes..." },
    en:{ q:"I put my cooperation at the service of other people", hint:"Ex: you volunteer to help your classmates, you share your notes..." }},
  { id:59, dim:'E', cat:'C', type:'personnalite',
    fr:{ q:"Je suis sociable et populaire ; je parle à tout le monde", hint:"Ex : tu te fais facilement de nouveaux amis, tu es à l'aise dans les grandes réunions..." },
    en:{ q:"I am sociable and popular; I talk to everyone", hint:"Ex: you easily make new friends, you are comfortable in large gatherings..." }},
  { id:60, dim:'C', cat:'C', type:'personnalite',
    fr:{ q:"Quand je travaille, j'aime me référer aux méthodes existantes", hint:"Ex : tu suis les procédures établies, tu préfères les recettes éprouvées..." },
    en:{ q:"When I work, I like to refer to existing methods", hint:"Ex: you follow established procedures, you prefer proven approaches..." }},
  { id:61, dim:'R', cat:'C', type:'personnalite',
    fr:{ q:"Généralement, j'évite de me faire remarquer", hint:"Ex : tu préfères rester discret, faire ton travail sans chercher les projecteurs..." },
    en:{ q:"Generally, I avoid drawing attention to myself", hint:"Ex: you prefer to stay discreet, do your work without seeking the spotlight..." }},
  { id:62, dim:'I', cat:'C', type:'personnalite',
    fr:{ q:"Je me comporte avec un naturel très curieux sur tout ce que je fais", hint:"Ex : tu poses beaucoup de questions, tu lis sur des sujets variés..." },
    en:{ q:"I behave in a very naturally curious way about everything I do", hint:"Ex: you ask a lot of questions, you read about various subjects..." }},
  { id:63, dim:'A', cat:'C', type:'personnalite',
    fr:{ q:"J'agis et je pense souvent de façon non conformiste, différemment de la majorité", hint:"Ex : tu as des idées originales qui surprennent ton entourage, tu n'aimes pas suivre la masse..." },
    en:{ q:"I often act and think in a non-conformist way, differently from the majority", hint:"Ex: you have original ideas that surprise those around you..." }},
  { id:64, dim:'S', cat:'C', type:'personnalite',
    fr:{ q:"J'accepte et j'assume des responsabilités au sein de mon entourage", hint:"Ex : tu te proposes naturellement pour organiser, coordonner ou représenter ton groupe..." },
    en:{ q:"I accept and take on responsibilities within my circle", hint:"Ex: you naturally volunteer to organize, coordinate or represent your group..." }},
  { id:65, dim:'E', cat:'C', type:'personnalite',
    fr:{ q:"J'aime entreprendre des activités nouvelles", hint:"Ex : tu es souvent le premier à proposer de nouvelles idées, à lancer des projets..." },
    en:{ q:"I like undertaking new activities", hint:"Ex: you are often the first to propose new ideas, to launch projects..." }},
  { id:66, dim:'C', cat:'C', type:'personnalite',
    fr:{ q:"J'aime recevoir des instructions bien claires qui me permettent de savoir exactement ce qu'on attend de moi", hint:"Ex : tu travailles mieux quand les objectifs sont précis et le cadre bien défini..." },
    en:{ q:"I like receiving clear instructions that let me know exactly what is expected of me", hint:"Ex: you work better when objectives are precise and the framework well defined..." }},
  { id:67, dim:'R', cat:'C', type:'personnalite',
    fr:{ q:"Je me présente toujours au naturel, tel que je suis", hint:"Ex : tu n'essaies pas de paraître différent de ce que tu es, tu es authentique..." },
    en:{ q:"I always present myself naturally, as I am", hint:"Ex: you don't try to appear different from who you are, you are authentic..." }},
  { id:68, dim:'I', cat:'C', type:'personnalite',
    fr:{ q:"Les gens me considèrent comme une personne pratique plutôt qu'émotive", hint:"Ex : face à un problème, tu analyses calmement et cherches des solutions concrètes..." },
    en:{ q:"People consider me a practical person rather than an emotional one", hint:"Ex: faced with a problem, you calmly analyze and look for concrete solutions..." }},
  { id:69, dim:'A', cat:'C', type:'personnalite',
    fr:{ q:"J'exprime mes sentiments par l'entremise de la musique, des beaux-arts, de la poésie, etc.", hint:"Ex : tu écris des poèmes quand tu es ému(e), tu joues de la musique pour te détendre..." },
    en:{ q:"I express my feelings through music, fine arts, poetry, etc.", hint:"Ex: you write poems when moved, you play music to relax..." }},
  { id:70, dim:'S', cat:'C', type:'personnalite',
    fr:{ q:"Je suis d'un naturel serviable", hint:"Ex : tu aides spontanément sans qu'on te le demande, tu te sens mal si tu ne peux pas aider..." },
    en:{ q:"I am naturally helpful", hint:"Ex: you help spontaneously without being asked, you feel bad if you cannot help..." }},
  { id:71, dim:'E', cat:'C', type:'personnalite',
    fr:{ q:"Je suis un(e) optimiste né(e)", hint:"Ex : même dans les situations difficiles, tu vois le bon côté des choses..." },
    en:{ q:"I am a born optimist", hint:"Ex: even in difficult situations, you see the bright side of things..." }},
  { id:72, dim:'C', cat:'C', type:'personnalite',
    fr:{ q:"Dans mes travaux, je suis persistant(e) et consciencieux(se)", hint:"Ex : tu ne lâches pas un devoir tant qu'il n'est pas terminé, tu vérifies plusieurs fois..." },
    en:{ q:"In my work, I am persistent and conscientious", hint:"Ex: you don't give up on an assignment until it's finished, you check multiple times..." }},
]

// ══════════════════════════════════════════════════════════
// ÉCHELLES DE RÉPONSE
// ══════════════════════════════════════════════════════════
const ECHELLES = {
  interet: {
    fr: ['Pas du tout', 'Un peu', 'Moyennement', 'Beaucoup', 'Énormément'],
    en: ['Not at all', 'A little', 'Moderately', 'A lot', 'Enormously'],
  },
  aptitude: {
    fr: ['Très faible', 'Faible', 'Moyenne', 'Bonne', 'Excellente'],
    en: ['Very low', 'Low', 'Average', 'Good', 'Excellent'],
  },
  personnalite: {
    fr: ['Pas du tout', 'Peu', 'Neutre', "D'accord", 'Tout à fait'],
    en: ['Not at all', 'Rarely', 'Neutral', 'Agree', 'Totally agree'],
  },
}

const DIM_COLORS = {
  R: '#EF4444', I: '#3B82F6', A: '#8B5CF6',
  S: '#10B981', E: '#F59E0B', C: '#06B6D4',
}

const CAT_INFO = {
  fr: {
    A: { label: 'Catégorie A — Activités & Intérêts', desc: 'Dans quelle mesure aimes-tu ces activités ?' },
    B: { label: 'Catégorie B — Aptitudes & Compétences', desc: 'Évalue honnêtement ton niveau dans ces compétences.' },
    C: { label: 'Catégorie C — Personnalité & Traits', desc: 'Dans quelle mesure ces affirmations te correspondent ?' },
  },
  en: {
    A: { label: 'Category A — Activities & Interests', desc: 'To what extent do you enjoy these activities?' },
    B: { label: 'Category B — Skills & Abilities', desc: 'Honestly evaluate your level in these skills.' },
    C: { label: 'Category C — Personality & Traits', desc: 'To what extent do these statements apply to you?' },
  },
}

const QS_PAR_PAGE = 6

export default function Test() {
  const navigate = useNavigate()
  const [lang, setLang] = useState('fr')
  const [page, setPage] = useState(0) // 0..11 (12 pages de 6 questions)
  const [reponses, setReponses] = useState({}) // { id: 0..4 }
  const [showHint, setShowHint] = useState(null)

  const totalPages = Math.ceil(QUESTIONS.length / QS_PAR_PAGE)
  const debut = page * QS_PAR_PAGE
  const qsPage = QUESTIONS.slice(debut, debut + QS_PAR_PAGE)
  const reponsesData = Object.keys(reponses).length
  const pct = Math.round((reponsesData / 72) * 100)

  // Protection : vérifier qu'on a les données de session
  useEffect(() => {
    if (!sessionStorage.getItem('code_acces')) navigate('/code')
    if (!sessionStorage.getItem('eleve')) navigate('/formulaire')
    // Restaurer réponses sauvegardées
    const saved = sessionStorage.getItem('reponses_test')
    if (saved) setReponses(JSON.parse(saved))
  }, [])

  // Sauvegarder automatiquement à chaque réponse
  useEffect(() => {
    sessionStorage.setItem('reponses_test', JSON.stringify(reponses))
  }, [reponses])

  const repondre = (id, val) => {
    setReponses(r => ({ ...r, [id]: val }))
  }

  // Toutes les questions de la page répondues ?
  const pageComplete = qsPage.every(q => reponses[q.id] !== undefined)

  const pageSuivante = () => {
    if (page < totalPages - 1) {
      setPage(p => p + 1)
      window.scrollTo(0, 0)
    } else {
      // Fin du test → calculer et naviguer vers résultats
      sessionStorage.setItem('reponses_test', JSON.stringify(reponses))
      navigate('/resultats')
    }
  }

  const pagePrec = () => {
    if (page > 0) { setPage(p => p - 1); window.scrollTo(0, 0) }
  }

  // Catégorie courante
  const catCourante = qsPage[0]?.cat
  const catInfo = CAT_INFO[lang][catCourante]

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Segoe UI', sans-serif", display: 'flex', flexDirection: 'column' }}>

      {/* NAVBAR */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#7C3AED,#5B21B6)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 13, letterSpacing: 0.5, boxShadow: '0 2px 8px rgba(124,58,237,0.35)', flexShrink: 0 }}>AT</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1E293B', lineHeight: 1.1 }}>Atlas Tawjih</div>
            <div style={{ fontSize: 10, color: '#94A3B8', letterSpacing: 1 }}>ORIENTATION</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 12, color: '#7C3AED', fontWeight: 600 }}>
            {reponsesData} / 72 {lang === 'fr' ? 'réponses' : 'answers'}
          </span>
          <div style={{ display: 'flex', gap: 2, background: '#F1F5F9', borderRadius: 8, padding: 3 }}>
            {['fr', 'en'].map(l => (
              <button key={l} onClick={() => setLang(l)} style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: lang === l ? '#7C3AED' : 'transparent', color: lang === l ? '#fff' : '#64748B', fontSize: 12, fontWeight: lang === l ? 600 : 400, cursor: 'pointer' }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* BARRE DE PROGRESSION GLOBALE */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', padding: '10px 24px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 11, color: '#7C3AED', fontWeight: 600 }}>
              {lang === 'fr' ? `Page ${page + 1} sur ${totalPages}` : `Page ${page + 1} of ${totalPages}`}
            </span>
            <span style={{ fontSize: 11, color: '#94A3B8' }}>{pct}%</span>
          </div>
          <div style={{ height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #7C3AED, #5B21B6)', borderRadius: 3, transition: 'width 0.4s ease' }} />
          </div>
          {/* Mini étapes */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            {[
              { num: 1, label: lang === 'fr' ? 'Code' : 'Code', done: true },
              { num: 2, label: lang === 'fr' ? 'Profil' : 'Profile', done: true },
              { num: 3, label: lang === 'fr' ? 'Test' : 'Test', active: true },
              { num: 4, label: lang === 'fr' ? 'Résultats' : 'Results' },
            ].map(e => (
              <div key={e.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: e.done ? '#10B981' : e.active ? '#7C3AED' : '#E2E8F0', color: e.done || e.active ? '#fff' : '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>
                  {e.done ? '✓' : e.num}
                </div>
                <span style={{ fontSize: 9, color: e.active ? '#7C3AED' : e.done ? '#059669' : '#94A3B8', fontWeight: e.active || e.done ? 600 : 400 }}>{e.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BANNIÈRE CATÉGORIE */}
      <div style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)', padding: '12px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{catInfo.label}</div>
        <div style={{ fontSize: 11, color: '#DDD6FE' }}>{catInfo.desc}</div>
      </div>

      {/* QUESTIONS */}
      <div style={{ flex: 1, padding: '16px 24px 24px', maxWidth: 700, margin: '0 auto', width: '100%' }}>
        {qsPage.map((q, idx) => {
          const echelle = ECHELLES[q.type][lang]
          const repondu = reponses[q.id] !== undefined
          const dimColor = DIM_COLORS[q.dim]
          const txt = q[lang]

          return (
            <div key={q.id} style={{ background: '#fff', border: `1px solid ${repondu ? dimColor + '40' : '#E2E8F0'}`, borderRadius: 12, marginBottom: 12, overflow: 'hidden', boxShadow: repondu ? `0 2px 8px ${dimColor}20` : '0 1px 4px rgba(0,0,0,0.04)', transition: 'all 0.2s' }}>

              {/* En-tête question */}
              <div style={{ display: 'flex', alignItems: 'stretch' }}>
                <div style={{ background: dimColor, width: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>Q{String(q.id).padStart(2,'0')}</span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)' }}>{q.dim}</span>
                </div>
                <div style={{ padding: '12px 14px', flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1E293B', lineHeight: 1.5, marginBottom: 4 }}>
                    {txt.q}
                  </div>
                  <button onClick={() => setShowHint(showHint === q.id ? null : q.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#94A3B8', padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                    💡 {lang === 'fr' ? 'Voir un exemple' : 'See an example'}
                  </button>
                  {showHint === q.id && (
                    <div style={{ marginTop: 6, padding: '6px 10px', background: '#F5F3FF', borderRadius: 6, fontSize: 11, color: '#5B21B6', fontStyle: 'italic', borderLeft: `3px solid ${dimColor}` }}>
                      {txt.hint}
                    </div>
                  )}
                </div>
                {repondu && (
                  <div style={{ padding: '0 12px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: 18, color: '#10B981' }}>✓</span>
                  </div>
                )}
              </div>

              {/* Choix de réponse */}
              <div style={{ display: 'flex', borderTop: '1px solid #F1F5F9' }}>
                {echelle.map((label, i) => {
                  const selected = reponses[q.id] === i
                  return (
                    <div key={i} onClick={() => repondre(q.id, i)} style={{
                      flex: 1, padding: '10px 4px', textAlign: 'center', cursor: 'pointer',
                      borderRight: i < 4 ? '1px solid #F1F5F9' : 'none',
                      background: selected ? dimColor + '15' : 'transparent',
                      transition: 'all 0.15s',
                    }}
                      onMouseEnter={e => { if (!selected) e.currentTarget.style.background = '#F8FAFC' }}
                      onMouseLeave={e => { if (!selected) e.currentTarget.style.background = 'transparent' }}
                    >
                      <div style={{ fontSize: 18, marginBottom: 3, color: selected ? dimColor : '#CBD5E1', transition: 'all 0.15s' }}>
                        {selected ? '●' : '○'}
                      </div>
                      <div style={{ fontSize: 9, color: selected ? dimColor : '#94A3B8', fontWeight: selected ? 700 : 400, lineHeight: 1.3 }}>
                        {label}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* NAVIGATION */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, padding: '12px 0' }}>
          <button onClick={pagePrec} disabled={page === 0} style={{ padding: '10px 20px', border: '1.5px solid #E2E8F0', borderRadius: 8, background: '#fff', color: page === 0 ? '#CBD5E1' : '#475569', fontSize: 13, fontWeight: 500, cursor: page === 0 ? 'not-allowed' : 'pointer' }}>
            {lang === 'fr' ? '← Précédent' : '← Previous'}
          </button>

          {!pageComplete && (
            <span style={{ fontSize: 11, color: '#F59E0B', fontWeight: 500 }}>
              {lang === 'fr' ? '⚠ Réponds à toutes les questions' : '⚠ Answer all questions'}
            </span>
          )}

          <button onClick={pageSuivante} disabled={!pageComplete} style={{
            padding: '10px 24px', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: pageComplete ? 'pointer' : 'not-allowed',
            background: pageComplete ? 'linear-gradient(135deg, #7C3AED, #5B21B6)' : '#E2E8F0',
            color: pageComplete ? '#fff' : '#94A3B8',
            boxShadow: pageComplete ? '0 4px 12px rgba(124,58,237,0.3)' : 'none',
            transition: 'all 0.2s'
          }}>
            {page === totalPages - 1
              ? (lang === 'fr' ? 'Voir mes résultats 🎯' : 'See my results 🎯')
              : (lang === 'fr' ? 'Suivant →' : 'Next →')}
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: '#1E293B', padding: '14px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <span style={{ color: '#E2E8F0', fontSize: 13, fontWeight: 600 }}>Atlas Tawjih</span>
          <span style={{ color: '#64748B' }}>·</span>
          <span style={{ color: '#94A3B8', fontSize: 13 }}>أطلس توجيه</span>
        </div>
      </footer>
    </div>
  )
}
