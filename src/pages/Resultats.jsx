import { useEffect, useState, useRef } from 'react'
import Feedback from '../components/Feedback'
import { incrementerCompteur } from '../services/sheets'
import { useNavigate } from 'react-router-dom'

// ══════════════════════════════════════════════════════════
// BASE DE DONNÉES RIASEC — Profils, Domaines, Métiers
// ══════════════════════════════════════════════════════════
const PROFILS = {
  R: {
    fr: {
      nom: 'Réaliste', emoji: '🔧',
      desc: `Tu es une personne concrète, pratique et manuelle. Tu préfères agir plutôt que de trop réfléchir. Tu t'épanouis dans les activités qui produisent des résultats tangibles et visibles. Tu es à l'aise avec les machines, les outils et le terrain.`,
      bonsEn: [`Les machines`, `Les chantiers`, `La construction`, `L'industrie`, `Les systèmes techniques`, `Le terrain`],
      forts: [
        [`Sens pratique`, `Tu préfères agir concrètement plutôt que rester dans la théorie.`],
        [`Habileté manuelle`, `Tu travailles facilement avec tes mains et les outils.`],
        [`Autonomie`, `Tu avances seul sur les tâches sans avoir besoin d'aide constante.`],
        [`Résolution de problèmes`, `Tu trouves des solutions concrètes aux problèmes du quotidien.`],
        [`Endurance`, `Tu maintiens ton effort dans le temps, même sur des tâches difficiles.`],
        [`Fiabilité`, `Les autres peuvent compter sur toi, tu tiens tes engagements.`],
      ],
      metiers: [
        { cat: `Ingénieurs`, liste: [
          [`Ingénieur génie civil`, `Tu conçois et supervises la construction de bâtiments, ponts, routes et infrastructures.`],
          [`Ingénieur en infrastructures routières`, `Tu planifies et gères la construction et la maintenance des routes et autoroutes.`],
          [`Ingénieur en matériaux de construction`, `Tu analyses et améliores les matériaux utilisés dans les chantiers.`],
          [`Ingénieur en génie mécanique`, `Tu conçois, fabriques et maintiens des machines et systèmes mécaniques.`],
          [`Ingénieur en génie électrique`, `Tu travailles sur les systèmes électriques et les installations industrielles.`],
          [`Ingénieur en automatisation / robotique`, `Tu programmes et intègres des robots et systèmes automatiques dans les usines.`],
          [`Ingénieur mécatronique`, `Tu combines mécanique, électronique et informatique pour des systèmes intelligents.`],
          [`Ingénieur en systèmes embarqués`, `Tu développes les logiciels et circuits dans les machines, voitures et appareils connectés.`],
          [`Ingénieur aéronautique`, `Tu conçois, fabriques et maintiens des aéronefs et leurs composants.`],
          [`Ingénieur en énergies renouvelables`, `Tu développes des projets solaires, éoliens ou hydrauliques pour une énergie propre.`],
          [`Ingénieur hydraulique`, `Tu gères les systèmes d'eau : barrages, irrigation et adduction d'eau.`],
          [`Ingénieur traitement des eaux`, `Tu conçois des systèmes pour purifier et distribuer l'eau potable.`],
          [`Ingénieur en génie rural`, `Tu travailles sur les infrastructures agricoles : irrigation et drainage.`],
          [`Ingénieur logistique`, `Tu organises et optimises le transport, le stockage et la distribution.`],
          [`Ingénieur qualité`, `Tu garantis que les produits respectent les normes et standards requis.`],
          [`Ingénieur sécurité et hygiène industrielle`, `Tu veilles à la sécurité des travailleurs sur les sites industriels.`],
          [`Ingénieur télécommunications (terrain)`, `Tu installes et maintiens les antennes et réseaux télécom sur le terrain.`],
          [`Ingénieur industriel`, `Tu améliores les processus de production pour réduire les coûts.`],
          [`Ingénieur topographe`, `Tu mesures et cartographies les terrains pour les projets de construction.`],
          [`Ingénieur production agroalimentaire`, `Tu supervises la fabrication de produits alimentaires en garantissant qualité et hygiène.`],
          [`Ingénieur en génie minier (OCP)`, `Tu extrais et traites les ressources minérales, très demandé au Maroc.`],
        ]},
        { cat: `Techniciens`, liste: [
          [`Technicien en énergies renouvelables`, `Tu installes et maintiens les panneaux solaires et éoliennes sur le terrain.`],
          [`Technicien de maintenance industrielle`, `Tu assures le bon fonctionnement des machines en effectuant les réparations.`],
          [`Technicien en génie civil`, `Tu assistes l'ingénieur sur les chantiers et contrôles la qualité des travaux.`],
          [`Technicien en topographie`, `Tu réalises des mesures de terrain et prépares les plans pour la construction.`],
          [`Technicien en hydraulique`, `Tu installes et entretiens les systèmes hydrauliques dans les industries.`],
          [`Technicien en électricité automobile`, `Tu diagnostiques et répares les systèmes électriques des véhicules.`],
          [`Technicien en fabrication mécanique`, `Tu opères les machines-outils pour fabriquer des pièces selon les plans.`],
          [`Technicien en maintenance aéronautique`, `Tu inspectes et entretiens les avions pour garantir leur sécurité.`],
          [`Technicien agricole`, `Tu accompagnes les agriculteurs dans l'utilisation des techniques modernes.`],
          [`Technicien en horticulture`, `Tu cultives et entretiens des plantes et arbres pour des projets agricoles.`],
          [`Technicien élevage`, `Tu gères et surveilles la santé et l'alimentation des animaux en élevage.`],
          [`Technicien en soudure industrielle`, `Tu assembles des pièces métalliques par soudage dans les chantiers.`],
          [`Conducteur de travaux BTP`, `Tu coordonnes les équipes sur le chantier et veilles au respect des délais.`],
          [`Chef de chantier`, `Tu diriges les ouvriers et organises les travaux quotidiens sur un chantier.`],
          [`Dessinateur projeteur BTP`, `Tu réalises les plans techniques des bâtiments à partir des études des ingénieurs.`],
        ]},
        { cat: `Maritime et Pêche`, liste: [
          [`Marin pêcheur`, `Tu travailles en mer pour la pêche et la récolte de produits marins, présent sur les côtes marocaines.`],
          [`Mécanicien naval`, `Tu assures la maintenance et réparation des moteurs et équipements des bateaux.`],
          [`Ingénieur en aquaculture`, `Tu développes et gères des fermes d'élevage de poissons en milieu contrôlé.`],
        ]},
      ],
      domaines: [`Génie civil`, `Génie mécanique`, `Génie électrique`, `Aéronautique`, `Énergies renouvelables`, `Hydraulique`, `Automatisation / robotique`, `Télécommunications`, `Agriculture et agronomie`, `Génie industriel`, `Génie minier`, `Génie rural`, `Agroalimentaire`, `Sciences maritimes et halieutiques`, `Topographie`],
      envIdeal: [`Chantier, atelier ou terrain`, `Usine ou unité industrielle`, `Bureau technique avec outils et machines`, `Nature, agriculture, extérieur`, `Laboratoire technique`, `Port ou zone maritime`],
      eviter: [
        [`Bureaux fermés sans activité physique`, `Tu as besoin de bouger et d'agir, le travail sédentaire te démotive rapidement.`],
        [`Travail purement administratif`, `Les tâches de bureau répétitives sans résultat concret ne te correspondent pas.`],
        [`Environnement très théorique`, `Tu préfères voir des résultats tangibles, la théorie pure te freine.`],
      ],
      env: `Environnement de travail en extérieur ou en atelier, activités concrètes et techniques, peu de travail de bureau, résultats mesurables et visibles.`,
    },
    en: {
      nom: 'Realistic', emoji: '🔧',
      desc: `You are a concrete, practical and hands-on person. You prefer acting rather than overthinking. You thrive in activities that produce tangible and visible results. You are comfortable with machines, tools and fieldwork.`,
      bonsEn: [`Machines`, `Construction sites`, `Building`, `Industry`, `Technical systems`, `Fieldwork`],
      forts: [
        [`Practical sense`, `You prefer taking concrete action rather than staying in theory.`],
        [`Manual dexterity`, `You work easily with your hands and tools.`],
        [`Autonomy`, `You move forward on tasks independently without constant help.`],
        [`Problem solving`, `You find concrete solutions to everyday problems.`],
        [`Endurance`, `You maintain effort over time, even on difficult tasks.`],
        [`Reliability`, `Others can count on you — you keep your commitments.`],
      ],
      metiers: [
        { cat: `Engineers`, liste: [
          [`Civil engineer`, `You design and supervise the construction of buildings, bridges, roads and infrastructure.`],
          [`Road infrastructure engineer`, `You plan and manage the construction and maintenance of roads and highways.`],
          [`Construction materials engineer`, `You analyze and improve the materials used on construction sites.`],
          [`Mechanical engineer`, `You design, manufacture and maintain machines and mechanical systems.`],
          [`Electrical engineer`, `You work on electrical systems and industrial installations.`],
          [`Automation / robotics engineer`, `You program and integrate robots and automatic systems in factories.`],
          [`Mechatronics engineer`, `You combine mechanics, electronics and computing for intelligent systems.`],
          [`Embedded systems engineer`, `You develop software and circuits in machines, cars and connected devices.`],
          [`Aeronautical engineer`, `You design, manufacture and maintain aircraft and their components.`],
          [`Renewable energy engineer`, `You develop solar, wind or hydraulic projects for clean energy.`],
          [`Hydraulic engineer`, `You manage water systems: dams, irrigation and water supply.`],
          [`Water treatment engineer`, `You design systems to purify and distribute drinking water.`],
          [`Rural engineering engineer`, `You work on agricultural infrastructure: irrigation and drainage.`],
          [`Logistics engineer`, `You organize and optimize transport, storage and distribution.`],
          [`Quality engineer`, `You ensure products meet required standards and norms.`],
          [`Industrial safety engineer`, `You ensure worker safety on industrial sites.`],
          [`Telecommunications engineer (field)`, `You install and maintain antennas and telecom networks in the field.`],
          [`Industrial engineer`, `You improve production processes to reduce costs.`],
          [`Survey engineer`, `You measure and map land for construction projects.`],
          [`Food production engineer`, `You supervise food product manufacturing ensuring quality and hygiene.`],
          [`Mining engineer (OCP)`, `You extract and process mineral resources, highly sought in Morocco.`],
        ]},
        { cat: `Technicians`, liste: [
          [`Renewable energy technician`, `You install and maintain solar panels and wind turbines in the field.`],
          [`Industrial maintenance technician`, `You ensure machines work properly by performing repairs.`],
          [`Civil engineering technician`, `You assist the engineer on construction sites and check work quality.`],
          [`Survey technician`, `You take field measurements and prepare plans for construction.`],
          [`Hydraulics technician`, `You install and maintain hydraulic systems in industries.`],
          [`Automotive electrician`, `You diagnose and repair vehicle electrical systems.`],
          [`Mechanical manufacturing technician`, `You operate machine tools to manufacture parts from technical drawings.`],
          [`Aeronautical maintenance technician`, `You inspect and maintain aircraft to ensure their safety.`],
          [`Agricultural technician`, `You support farmers in using modern production techniques.`],
          [`Horticulture technician`, `You grow and maintain plants and trees for agricultural projects.`],
          [`Livestock technician`, `You manage and monitor animal health and feeding on farms.`],
          [`Industrial welding technician`, `You assemble metal parts by welding on construction sites.`],
          [`BTP works supervisor`, `You coordinate teams on site and ensure deadlines are met.`],
          [`Site manager`, `You direct workers and organize daily work on a construction site.`],
          [`BTP technical draughtsman`, `You produce technical building plans from engineer studies.`],
        ]},
        { cat: `Maritime and Fishing`, liste: [
          [`Fisherman`, `You work at sea fishing and harvesting marine products along the Moroccan coast.`],
          [`Marine mechanic`, `You maintain and repair engines and equipment on fishing and cargo boats.`],
          [`Aquaculture engineer`, `You develop and manage fish and seafood farms in controlled environments.`],
        ]},
      ],
      domaines: [`Civil engineering`, `Mechanical engineering`, `Electrical engineering`, `Aeronautics`, `Renewable energies`, `Hydraulics`, `Automation / robotics`, `Telecommunications`, `Agriculture and agronomy`, `Industrial engineering`, `Mining engineering`, `Rural engineering`, `Food industry`, `Maritime and fishery sciences`, `Topography`],
      envIdeal: [`Construction site, workshop or field`, `Factory or industrial unit`, `Technical office with tools and machines`, `Nature, agriculture, outdoors`, `Technical laboratory`, `Port or maritime zone`],
      eviter: [
        [`Closed offices without physical activity`, `You need to move and act — purely sedentary work will quickly demotivate you.`],
        [`Pure administrative work`, `Repetitive desk tasks without concrete results don't suit you.`],
        [`Very theoretical environments`, `You prefer seeing tangible results — pure theory holds you back.`],
      ],
      env: `Outdoor or workshop work environment, concrete and technical activities, minimal desk work, measurable and visible results.`,
    },
  },
  I: {
    fr: {
      nom: 'Investigateur', emoji: '🔬',
      desc: `Tu es une personne curieuse, analytique et scientifique. Tu aimes observer, apprendre, enquêter et résoudre des problèmes complexes. Tu préfères réfléchir avant d'agir et tu t'épanouis dans les environnements intellectuellement stimulants.`,
      bonsEn: [`L'analyse et la recherche`, `Les sciences exactes`, `La technologie et l'informatique`, `La médecine et la santé`, `La résolution de problèmes complexes`, `Les données et les statistiques`],
      forts: [
        [`Esprit analytique`, `Tu décomposes les problèmes complexes pour mieux les comprendre.`],
        [`Curiosité intellectuelle`, `Tu aimes apprendre et découvrir de nouvelles connaissances.`],
        [`Rigueur scientifique`, `Tu vérifies tes hypothèses et travailles avec précision.`],
        [`Capacité de synthèse`, `Tu résumes l'essentiel rapidement à partir d'informations complexes.`],
        [`Pensée critique`, `Tu questionnes les idées reçues avant d'accepter une conclusion.`],
        [`Autonomie intellectuelle`, `Tu peux travailler seul sur des sujets complexes sans aide.`],
      ],
      metiers: [
        { cat: `Informatique et Technologie`, liste: [
          [`Ingénieur en intelligence artificielle`, `Tu crées des algorithmes capables d'apprendre et de prendre des décisions comme un être humain.`],
          [`Ingénieur data / Data scientist`, `Tu analyses de grandes quantités de données pour en extraire des informations utiles.`],
          [`Ingénieur big data`, `Tu construis les infrastructures qui stockent et traitent des volumes massifs de données.`],
          [`Ingénieur en cybersécurité`, `Tu protèges les systèmes informatiques et les données contre les attaques.`],
          [`Ingénieur en informatique`, `Tu conçois et développes des logiciels, applications et systèmes informatiques.`],
          [`Ingénieur logiciel`, `Tu développes des programmes et applications en utilisant des langages de programmation.`],
          [`Ingénieur systèmes et réseaux`, `Tu installes, configures et administres les serveurs et réseaux informatiques.`],
          [`Ingénieur génie électrique`, `Tu conçois des systèmes électroniques complexes pour l'industrie et l'énergie.`],
        ]},
        { cat: `Sciences et Recherche`, liste: [
          [`Chercheur scientifique`, `Tu mènes des expériences et des études pour faire avancer les connaissances.`],
          [`Enseignant-chercheur universitaire`, `Tu enseignes à l'université tout en menant des travaux de recherche.`],
          [`Analyste scientifique`, `Tu interprètes des résultats d'expériences pour en tirer des conclusions scientifiques.`],
          [`Physicien`, `Tu étudies les lois fondamentales de la nature : énergie, matière et forces physiques.`],
          [`Chimiste`, `Tu analyses et synthétises des substances chimiques pour des applications industrielles ou médicales.`],
          [`Biologiste`, `Tu étudies les êtres vivants, leurs fonctions et leurs interactions.`],
          [`Mathématicien`, `Tu développes des modèles mathématiques pour résoudre des problèmes complexes.`],
          [`Statisticien`, `Tu collectes et analyses des données numériques pour aider à la prise de décision.`],
          [`Ingénieur chimiste`, `Tu conçois des procédés chimiques industriels pour fabriquer des produits.`],
        ]},
        { cat: `Médecine et Santé`, liste: [
          [`Médecin généraliste`, `Tu diagnostiques et traites les maladies courantes et orientes les patients vers les spécialistes.`],
          [`Médecin spécialiste`, `Tu te concentres sur un domaine précis : cardiologie, neurologie, pneumologie.`],
          [`Pharmacien`, `Tu délivres les médicaments, conseilles les patients et garantis la sécurité des traitements.`],
          [`Dentiste`, `Tu diagnostiques et traites les problèmes dentaires et buccaux des patients.`],
          [`Biologiste médical`, `Tu analyses des échantillons biologiques pour aider au diagnostic médical.`],
          [`Technicien de laboratoire`, `Tu réalises des analyses et expériences en laboratoire sous supervision médicale.`],
          [`Radiologue`, `Tu interprètes les images médicales (radio, scanner, IRM) pour diagnostiquer les pathologies.`],
          [`Analyste biomédical`, `Tu développes et contrôles les équipements et réactifs utilisés dans les analyses médicales.`],
          [`Infirmier spécialisé`, `Tu assures des soins techniques avancés en réanimation ou bloc opératoire.`],
          [`Aide-soignant(e)`, `Tu assistes les infirmiers en prodiguant les soins de base aux patients hospitalisés.`],
          [`Vétérinaire`, `Tu diagnostiques et traites les maladies des animaux en clinique ou dans les élevages.`],
        ]},
        { cat: `Autres`, liste: [
          [`Analyste financier`, `Tu étudies les marchés financiers et les entreprises pour conseiller les investisseurs.`],
          [`Ingénieur en biotechnologie`, `Tu utilises les organismes vivants pour développer des produits médicaux ou agricoles.`],
        ]},
      ],
      domaines: [`Informatique et intelligence artificielle`, `Cybersécurité`, `Data science et big data`, `Génie électrique`, `Médecine générale`, `Pharmacie`, `Médecine dentaire`, `Biologie et biotechnologie`, `Chimie et génie chimique`, `Mathématiques et physique`, `Statistiques et actuariat`, `Sciences vétérinaires`, `Génie biomédical`],
      envIdeal: [`Laboratoire de recherche scientifique`, `Bureau d'études ou centre R&D`, `Université ou organisme de recherche`, `Entreprise tech ou startup innovante`, `Cabinet médical ou clinique`, `Hôpital et centre de soins`, `Service informatique d'une grande entreprise`],
      eviter: [
        [`Environnement sans stimulation intellectuelle`, `Tu as besoin de défis complexes, un travail répétitif t'ennuiera rapidement.`],
        [`Travail très répétitif sans réflexion`, `Tu as besoin de penser et d'analyser, l'exécution mécanique ne te correspond pas.`],
        [`Pression commerciale excessive`, `Tu préfères un travail de fond, la vente agressive va à l'encontre de ta nature.`],
      ],
      env: `Environnement intellectuellement stimulant, travail en autonomie, accès aux ressources scientifiques, équipe de pairs compétents, liberté de recherche.`,
    },
    en: {
      nom: 'Investigative', emoji: '🔬',
      desc: `You are a curious, analytical and scientific person. You love to observe, learn, investigate and solve complex problems. You prefer thinking before acting and thrive in intellectually stimulating environments.`,
      bonsEn: [`Analysis and research`, `Exact sciences`, `Technology and computing`, `Medicine and health`, `Solving complex problems`, `Data and statistics`],
      forts: [
        [`Analytical mind`, `You break down complex problems to better understand them.`],
        [`Intellectual curiosity`, `You love learning and discovering new knowledge.`],
        [`Scientific rigor`, `You verify hypotheses and work with precision.`],
        [`Synthesis ability`, `You quickly summarize essentials from complex information.`],
        [`Critical thinking`, `You question assumptions before accepting conclusions.`],
        [`Intellectual autonomy`, `You can work alone on complex subjects without help.`],
      ],
      metiers: [
        { cat: `IT and Technology`, liste: [
          [`AI engineer`, `You create algorithms that can learn and make decisions like a human being.`],
          [`Data engineer / Data scientist`, `You analyze large amounts of data to extract useful information.`],
          [`Big data engineer`, `You build infrastructure to store and process massive data volumes.`],
          [`Cybersecurity engineer`, `You protect computer systems and data from attacks and intrusions.`],
          [`Computer engineer`, `You design and develop software, applications and computer systems.`],
          [`Software engineer`, `You develop programs and applications using programming languages.`],
          [`Systems and network engineer`, `You install, configure and administer servers and computer networks.`],
          [`Electrical engineering engineer`, `You design complex electronic systems for industry and energy.`],
        ]},
        { cat: `Science and Research`, liste: [
          [`Scientific researcher`, `You conduct experiments and studies to advance knowledge in your field.`],
          [`University professor-researcher`, `You teach at university while conducting research in your specialty.`],
          [`Scientific analyst`, `You interpret experimental results to draw scientific conclusions.`],
          [`Physicist`, `You study fundamental laws of nature: energy, matter and physical forces.`],
          [`Chemist`, `You analyze and synthesize chemical substances for industrial or medical use.`],
          [`Biologist`, `You study living organisms, their functions and interactions.`],
          [`Mathematician`, `You develop mathematical models to solve complex problems.`],
          [`Statistician`, `You collect and analyze numerical data to aid decision-making.`],
          [`Chemical engineer`, `You design industrial chemical processes to manufacture products.`],
        ]},
        { cat: `Medicine and Health`, liste: [
          [`General practitioner`, `You diagnose and treat common diseases and refer patients to specialists.`],
          [`Medical specialist`, `You focus on a specific field: cardiology, neurology, pneumology.`],
          [`Pharmacist`, `You dispense medicines, advise patients and ensure treatment safety.`],
          [`Dentist`, `You diagnose and treat dental and oral problems in patients.`],
          [`Medical biologist`, `You analyze biological samples to help with medical diagnosis.`],
          [`Laboratory technician`, `You perform analyses and experiments in a laboratory under medical supervision.`],
          [`Radiologist`, `You interpret medical images (X-ray, scanner, MRI) to diagnose pathologies.`],
          [`Biomedical analyst`, `You develop and control equipment and reagents used in medical analyses.`],
          [`Specialized nurse`, `You provide advanced technical care in intensive care or operating rooms.`],
          [`Healthcare assistant`, `You assist nurses by providing basic care and comfort to hospitalized patients.`],
          [`Veterinarian`, `You diagnose and treat animal diseases in clinics or on farms.`],
        ]},
        { cat: `Other`, liste: [
          [`Financial analyst`, `You study financial markets and companies to advise investors.`],
          [`Biotechnology engineer`, `You use living organisms to develop medical or agricultural products.`],
        ]},
      ],
      domaines: [`Computer science and AI`, `Cybersecurity`, `Data science and big data`, `Electrical engineering`, `General medicine`, `Pharmacy`, `Dental medicine`, `Biology and biotechnology`, `Chemistry and chemical engineering`, `Mathematics and physics`, `Statistics and actuarial science`, `Veterinary sciences`, `Biomedical engineering`],
      envIdeal: [`Scientific research laboratory`, `Engineering office or R&D center`, `University or research institution`, `Tech company or innovative startup`, `Medical practice or clinic`, `Hospital and care center`, `IT department of a large company`],
      eviter: [
        [`No intellectual stimulation`, `You need complex challenges — repetitive work will bore you quickly.`],
        [`Very repetitive work without thinking`, `You need to think and analyze — mechanical execution doesn't suit you.`],
        [`Excessive commercial pressure`, `You prefer deep work — aggressive sales go against your nature.`],
      ],
      env: `Intellectually stimulating environment, autonomous work, access to scientific resources, team of competent peers, freedom of research.`,
    },
  },
  A: {
    fr: {
      nom: 'Artistique', emoji: '🎨',
      desc: `Tu es une personne créative, expressive et imaginative. Tu aimes créer, imaginer et t'exprimer à travers différents médias. Tu penses souvent de façon originale et tu as une sensibilité particulière à l'esthétique et à la beauté.`,
      bonsEn: [`La création visuelle et artistique`, `La communication et l'expression`, `L'écriture et le langage`, `Le design et l'architecture`, `Le spectacle et les médias`, `L'artisanat et la culture`],
      forts: [
        [`Créativité`, `Tu imagines des solutions et des idées originales que les autres n'ont pas.`],
        [`Sensibilité artistique`, `Tu perçois la beauté et l'esthétique avec un regard particulier et unique.`],
        [`Expression personnelle`, `Tu sais exprimer tes émotions et tes idées à travers différents médias.`],
        [`Adaptation`, `Tu t'ajustes facilement aux nouvelles situations et aux changements.`],
        [`Vision esthétique`, `Tu as un sens développé du beau et de l'harmonie visuelle.`],
        [`Ouverture`, `Tu acceptes facilement les nouvelles idées et les points de vue différents.`],
      ],
      metiers: [
        { cat: `Design et Architecture`, liste: [
          [`Architecte`, `Tu conçois des bâtiments et des espaces en combinant esthétique, fonctionnalité et contraintes techniques.`],
          [`Designer graphique`, `Tu crées des visuels, logos, affiches et supports de communication pour des entreprises ou agences.`],
          [`Designer UX/UI`, `Tu conçois l'expérience utilisateur des sites web et applications mobiles pour qu'ils soient beaux et faciles à utiliser.`],
          [`Illustrateur`, `Tu crées des dessins et illustrations pour des livres, presses, publicités ou plateformes numériques.`],
          [`Directeur artistique`, `Tu supervises et valides la direction visuelle d'une campagne, d'un projet ou d'une marque entière.`],
          [`Décorateur d'intérieur`, `Tu aménages et décores des espaces intérieurs (maisons, hôtels, bureaux) selon les goûts du client.`],
          [`Architecte d'intérieur`, `Tu repenses complètement des espaces en intervenant sur la structure, les volumes et l'esthétique.`],
          [`Designer d'espace`, `Tu conçois des espaces fonctionnels et esthétiques pour des commerces, hôtels ou expositions.`],
          [`Graphiste`, `Tu réalises des créations visuelles pour le print et le digital : flyers, bannières, identités visuelles.`],
          [`Game artist (jeux vidéo)`, `Tu crées les visuels, personnages et décors des jeux vidéo en combinant talent et outils numériques.`],
        ]},
        { cat: `Médias et Communication`, liste: [
          [`Journaliste`, `Tu enquêtes, tu rédiges et tu transmets l'information au public via la presse, la TV ou le web.`],
          [`Réalisateur`, `Tu diriges la production d'un film, d'un clip ou d'un documentaire en gérant l'équipe et la vision.`],
          [`Scénariste`, `Tu écris les histoires et les dialogues des films, séries, publicités ou contenus audiovisuels.`],
          [`Photographe`, `Tu captures des moments, des personnes ou des produits à travers l'objectif pour des projets variés.`],
          [`Monteur vidéo`, `Tu assembles et montes les séquences vidéo pour créer un contenu final cohérent et impactant.`],
          [`Community manager`, `Tu gères les réseaux sociaux d'une marque, tu crées du contenu et tu interagis avec la communauté.`],
          [`Chef de publicité`, `Tu coordonnes les campagnes publicitaires entre le client et l'agence de communication.`],
          [`Chargé de communication`, `Tu gères l'image et la communication interne et externe d'une entreprise.`],
          [`Animateur radio / TV`, `Tu animes des émissions en direct ou enregistrées en créant un lien chaleureux avec le public.`],
        ]},
        { cat: `Écriture et Langues`, liste: [
          [`Rédacteur web`, `Tu crées du contenu écrit pour des sites internet, blogs ou newsletters.`],
          [`Traducteur-interprète`, `Tu traduis des textes ou interprètes entre deux langues dans des contextes professionnels.`],
          [`Écrivain`, `Tu crées des oeuvres littéraires — romans, nouvelles, essais — publiées par des maisons d'édition.`],
        ]},
        { cat: `Spectacle et Arts`, liste: [
          [`Musicien`, `Tu composes, joues et interprètes de la musique dans des concerts, studios ou productions audiovisuelles.`],
          [`Comédien`, `Tu joues des rôles au théâtre, au cinéma ou à la télévision en donnant vie à des personnages.`],
          [`Animateur 3D`, `Tu crées des animations tridimensionnelles pour des films, jeux vidéo, publicités ou effets spéciaux.`],
        ]},
        { cat: `Mode et Artisanat`, liste: [
          [`Styliste de mode`, `Tu crées des collections vestimentaires en combinant tendances, matières et identité de marque.`],
          [`Designer mode`, `Tu conçois des vêtements et accessoires en combinant créativité et contraintes de production.`],
          [`Maquilleur professionnel`, `Tu réalises des maquillages artistiques pour des shootings, spectacles, mariages ou productions TV.`],
          [`Créateur d'accessoires et de mode`, `Tu conçois des bijoux, sacs et accessoires qui expriment un univers créatif unique.`],
          [`Artisan d'art`, `Tu fabriques à la main des objets uniques en utilisant des techniques traditionnelles ou contemporaines.`],
          [`Calligraphe`, `Tu maîtrises l'art de l'écriture artistique, très demandé au Maroc pour l'arabe et le décor islamique.`],
        ]},
        { cat: `Culture et Patrimoine`, liste: [
          [`Responsable patrimoine culturel`, `Tu gères et valorises le patrimoine historique et artistique d'une ville ou institution.`],
          [`Animateur dans les centres culturels`, `Tu organises des ateliers et activités artistiques pour faire découvrir la culture au public.`],
          [`Chef de projets culturels`, `Tu conçois et coordonnes des événements culturels : festivals, expositions, spectacles.`],
        ]},
      ],
      domaines: [`Architecture et design`, `Beaux-arts et arts plastiques`, `Journalisme et communication`, `Cinéma et audiovisuel`, `Littérature et langues`, `Musique et arts du spectacle`, `Mode et stylisme`, `Artisanat et patrimoine culturel`, `Design graphique et multimédia`],
      envIdeal: [`Studio créatif ou agence de communication`, `Rédaction de presse ou maison d'édition`, `Théâtre, studio de musique ou galerie d'art`, `Agence de design ou d'architecture`, `Plateau de tournage ou studio photo`, `Atelier d'artisanat ou de mode`, `Environnement flexible avec liberté d'expression`],
      eviter: [
        [`Cadre très rigide et bureaucratique`, `Les règles strictes bloquent ta créativité et éteignent ton potentiel artistique.`],
        [`Tâches routinières sans créativité`, `Faire toujours la même chose te démotive — tu as besoin de variation et de nouveauté.`],
        [`Milieu très conservateur`, `Tu penses différemment — un milieu fermé aux idées nouvelles te frustre profondément.`],
      ],
      env: `Environnement créatif et flexible, liberté d'expression, peu de contraintes rigides, travail sur des projets variés et stimulants.`,
    },
    en: {
      nom: 'Artistic', emoji: '🎨',
      desc: `You are a creative, expressive and imaginative person. You love to create, imagine and express yourself through different media. You often think originally and have a particular sensitivity to aesthetics and beauty.`,
      bonsEn: [`Visual and artistic creation`, `Communication and expression`, `Writing and language`, `Design and architecture`, `Performing arts and media`, `Crafts and culture`],
      forts: [
        [`Creativity`, `You imagine original solutions and ideas that others don't have.`],
        [`Artistic sensitivity`, `You perceive beauty and aesthetics with a special and unique eye.`],
        [`Personal expression`, `You express your emotions and ideas through different media.`],
        [`Adaptability`, `You adjust easily to new situations and changes.`],
        [`Aesthetic vision`, `You have a developed sense of beauty and visual harmony.`],
        [`Openness`, `You easily accept new ideas and different points of view.`],
      ],
      metiers: [
        { cat: `Design and Architecture`, liste: [
          [`Architect`, `You design buildings and spaces combining aesthetics, functionality and technical constraints.`],
          [`Graphic designer`, `You create visuals, logos, posters and communication materials for companies or agencies.`],
          [`UX/UI designer`, `You design the user experience of websites and mobile apps to make them beautiful and easy to use.`],
          [`Illustrator`, `You create drawings and illustrations for books, press, advertising or digital platforms.`],
          [`Art director`, `You supervise and validate the visual direction of a campaign, project or entire brand.`],
          [`Interior decorator`, `You furnish and decorate interior spaces (homes, hotels, offices) to the client's taste.`],
          [`Interior architect`, `You completely rethink spaces by working on structure, volumes and overall aesthetics.`],
          [`Space designer`, `You design functional and aesthetic spaces for shops, hotels or exhibitions.`],
          [`Graphic artist`, `You produce visual creations for print and digital: flyers, banners, visual identities.`],
          [`Game artist (video games)`, `You create visuals, characters and scenery for video games combining talent and digital tools.`],
        ]},
        { cat: `Media and Communication`, liste: [
          [`Journalist`, `You investigate, write and convey information to the public via press, TV or web.`],
          [`Film director`, `You direct the production of a film, clip or documentary managing the team and vision.`],
          [`Screenwriter`, `You write the stories and dialogues of films, series, advertising or audiovisual content.`],
          [`Photographer`, `You capture moments, people or products through the lens for various projects.`],
          [`Video editor`, `You assemble and edit video sequences to create a coherent and impactful final content.`],
          [`Community manager`, `You manage a brand's social media, create content and interact with the community.`],
          [`Advertising manager`, `You coordinate advertising campaigns between the client and the communication agency.`],
          [`Communication officer`, `You manage the internal and external image and communication of a company.`],
          [`Radio / TV presenter`, `You host live or recorded programs creating a warm connection with the audience.`],
        ]},
        { cat: `Writing and Languages`, liste: [
          [`Web copywriter`, `You create written content for websites, blogs or newsletters.`],
          [`Translator-interpreter`, `You translate texts or interpret between two languages in professional contexts.`],
          [`Writer`, `You create literary works — novels, short stories, essays — published by publishing houses.`],
        ]},
        { cat: `Performing Arts`, liste: [
          [`Musician`, `You compose, play and perform music in concerts, studios or audiovisual productions.`],
          [`Actor`, `You play roles in theater, cinema or television bringing characters to life.`],
          [`3D animator`, `You create three-dimensional animations for films, video games, advertising or special effects.`],
        ]},
        { cat: `Fashion and Crafts`, liste: [
          [`Fashion stylist`, `You create clothing collections combining trends, materials and brand identity.`],
          [`Fashion designer`, `You design clothes and accessories combining creativity and production constraints.`],
          [`Professional makeup artist`, `You create artistic makeup for photoshoots, shows, weddings or TV productions.`],
          [`Fashion accessories creator`, `You design jewelry, bags and accessories that express a unique creative universe.`],
          [`Art craftsman`, `You handcraft unique objects using traditional or contemporary techniques.`],
          [`Calligrapher`, `You master the art of artistic writing, highly sought in Morocco for Arabic and Islamic decor.`],
        ]},
        { cat: `Culture and Heritage`, liste: [
          [`Cultural heritage manager`, `You manage and promote the historical and artistic heritage of a city or institution.`],
          [`Cultural center animator`, `You organize artistic workshops and activities to introduce culture to the public.`],
          [`Cultural project manager`, `You design and coordinate cultural events: festivals, exhibitions, shows.`],
        ]},
      ],
      domaines: [`Architecture and design`, `Fine arts and visual arts`, `Journalism and communication`, `Cinema and audiovisual`, `Literature and languages`, `Music and performing arts`, `Fashion and styling`, `Crafts and cultural heritage`, `Graphic design and multimedia`],
      envIdeal: [`Creative studio or communication agency`, `Press room or publishing house`, `Theater, music studio or art gallery`, `Design or architecture agency`, `Film set or photo studio`, `Craft or fashion workshop`, `Flexible environment with freedom of expression`],
      eviter: [
        [`Very rigid and bureaucratic framework`, `Strict rules block your creativity and extinguish your artistic potential.`],
        [`Routine tasks without creativity`, `Doing the same thing demotivates you — you need variation and novelty.`],
        [`Very conservative environment`, `You think differently — a closed-minded environment deeply frustrates you.`],
      ],
      env: `Creative and flexible work environment, freedom of expression, few rigid constraints, work on varied and stimulating projects.`,
    },
  },
  S: {
    fr: {
      nom: 'Social', emoji: '🤝',
      desc: `Tu es une personne empathique, coopérative et communicative. Tu aimes aider, enseigner, conseiller et interagir avec les autres. Tu as un sens naturel du service et tu t'épanouis dans les relations humaines.`,
      bonsEn: [`L'enseignement et la formation`, `Le soin et la santé`, `Le conseil et l'accompagnement`, `Le travail social et humanitaire`, `Les ressources humaines`, `Le tourisme et l'accueil`],
      forts: [
        [`Empathie`, `Tu comprends facilement ce que les autres ressentent et tu les écoutes vraiment.`],
        [`Communication`, `Tu expliques clairement tes idées et tu crées facilement le dialogue.`],
        [`Coopération`, `Tu travailles bien en équipe et tu favorises l'entente dans le groupe.`],
        [`Patience`, `Tu restes calme et bienveillant même dans les situations difficiles.`],
        [`Motivation des autres`, `Tu sais encourager et motiver les personnes autour de toi.`],
        [`Leadership bienveillant`, `Tu guides naturellement les autres avec respect et sans imposer.`],
      ],
      metiers: [
        { cat: `Enseignement et Formation`, liste: [
          [`Enseignant (primaire / collège / lycée)`, `Tu transmets des connaissances aux élèves et tu les accompagnes dans leur développement scolaire.`],
          [`Professeur universitaire`, `Tu enseignes une matière spécialisée à l'université et tu encadres les étudiants dans leurs recherches.`],
          [`Formateur professionnel`, `Tu formes des adultes et des salariés à de nouvelles compétences dans des centres de formation.`],
          [`Conseiller d'orientation`, `Tu aides les élèves à choisir leur filière et leur métier en tenant compte de leurs aptitudes.`],
          [`Directeur d'école`, `Tu administres et diriges un établissement scolaire en gérant les équipes et les programmes.`],
          [`Orthophoniste`, `Tu diagnostiques et traites les troubles du langage et de la parole chez les enfants et adultes.`],
          [`Surveillant scolaire`, `Tu assures la sécurité et le bon comportement des élèves dans un établissement scolaire.`],
        ]},
        { cat: `Santé et Soins`, liste: [
          [`Infirmier(ère)`, `Tu assures les soins médicaux quotidiens des patients en collaboration avec les médecins.`],
          [`Sage-femme`, `Tu accompagnes les femmes pendant la grossesse, l'accouchement et le suivi post-natal.`],
          [`Kinésithérapeute`, `Tu aides les patients à récupérer leurs capacités motrices après une blessure ou opération.`],
          [`Médecin généraliste`, `Tu diagnostiques les maladies et suis les patients en les orientant vers les spécialistes.`],
          [`Aide-soignant(e)`, `Tu assistes les infirmiers en prodiguant les soins de base aux patients hospitalisés.`],
          [`Psychomotricien`, `Tu accompagnes les personnes ayant des troubles du mouvement par des exercices adaptés.`],
        ]},
        { cat: `Psychologie et Accompagnement`, liste: [
          [`Psychologue`, `Tu évalues et traites les troubles psychologiques des patients par des thérapies adaptées.`],
          [`Psychologue clinicien`, `Tu accompagnes les patients dans un cadre clinique pour traiter des troubles mentaux profonds.`],
          [`Coach professionnel`, `Tu accompagnes des personnes ou équipes pour développer leurs compétences et objectifs.`],
          [`Coach de vie`, `Tu accompagnes des personnes dans leur développement personnel et leurs projets de vie.`],
          [`Coach mental`, `Tu travailles sur la préparation mentale pour aider à surmonter les blocages psychologiques.`],
          [`Thérapeute`, `Tu utilises des approches thérapeutiques spécialisées pour résoudre les difficultés des patients.`],
          [`Conseiller en insertion professionnelle`, `Tu aides les personnes sans emploi à définir leur projet et à trouver un travail.`],
          [`Éducateur spécialisé`, `Tu accompagnes des enfants ou adultes en difficulté sociale ou comportementale.`],
          [`Médiateur social`, `Tu interviens dans les conflits pour rétablir le dialogue entre les personnes.`],
        ]},
        { cat: `Travail Social et Humanitaire`, liste: [
          [`Assistant(e) social(e)`, `Tu aides les personnes en difficulté à accéder aux droits et services sociaux.`],
          [`Animateur socioculturel`, `Tu organises des activités culturelles et éducatives pour des groupes de personnes.`],
          [`Chargé de mission ONG`, `Tu gères des projets humanitaires sur le terrain pour améliorer les conditions de vie.`],
          [`Chef de projets sociaux`, `Tu coordonnes des programmes d'aide et d'insertion sociale pour les populations.`],
        ]},
        { cat: `Ressources Humaines`, liste: [
          [`Responsable ressources humaines`, `Tu gères le recrutement, la formation et le bien-être des salariés dans une entreprise.`],
          [`Chargé de formation`, `Tu planifies et organises les programmes de formation continue pour les employés.`],
        ]},
        { cat: `Tourisme et Hôtellerie`, liste: [
          [`Guide touristique`, `Tu accueilles et accompagnes les visiteurs en leur faisant découvrir la culture du Maroc.`],
          [`Responsable hôtelier`, `Tu gères les opérations d'un hôtel pour assurer la satisfaction de tous les clients.`],
          [`Agent de voyages`, `Tu conçois et vends des séjours et circuits adaptés aux besoins de chaque client.`],
        ]},
        { cat: `Animation et Médias`, liste: [
          [`Animateur radio / TV`, `Tu animes des émissions en direct ou enregistrées en établissant un lien chaleureux avec le public.`],
        ]},
        { cat: `Droit et Justice`, liste: [
          [`Avocat`, `Tu défends et conseilles tes clients devant les tribunaux et dans leurs démarches juridiques.`],
          [`Notaire`, `Tu rédiges et authentifies les actes officiels : contrats, testaments, achats immobiliers.`],
          [`Magistrat`, `Tu rends des décisions de justice en appliquant la loi dans les affaires civiles ou pénales.`],
        ]},
      ],
      domaines: [`Médecine et soins infirmiers`, `Éducation et enseignement`, `Psychologie et coaching`, `Travail social et humanitaire`, `Droit et sciences juridiques`, `Ressources humaines`, `Tourisme et hôtellerie`, `Kinésithérapie et rééducation`, `Orthophonie et psychomotricité`],
      envIdeal: [`École ou centre de formation`, `Hôpital, clinique ou centre de soins`, `Association humanitaire ou ONG`, `Cabinet de psychologie ou de coaching`, `Service des ressources humaines`, `Hôtel, agence de voyages ou office du tourisme`, `Tribunal ou cabinet juridique`],
      eviter: [
        [`Travail totalement isolé`, `Tu as besoin de contact humain constant — travailler seul toute la journée te vide.`],
        [`Environnement froid et très compétitif`, `Tu travailles mieux dans la bienveillance — la compétition agressive te stresse.`],
        [`Tâches purement techniques sans relation`, `Tu as besoin de sens et d'interaction humaine — le travail machine ne te nourrit pas.`],
      ],
      env: `Environnement humain et chaleureux, travail en équipe, contact permanent avec les gens, impact social visible et gratifiant.`,
    },
    en: {
      nom: 'Social', emoji: '🤝',
      desc: `You are an empathetic, cooperative and communicative person. You love to help, teach, advise and interact with others. You have a natural sense of service and thrive in human relationships.`,
      bonsEn: [`Teaching and training`, `Care and health`, `Counseling and support`, `Social and humanitarian work`, `Human resources`, `Tourism and hospitality`],
      forts: [
        [`Empathy`, `You easily understand what others feel and truly listen to them.`],
        [`Communication`, `You explain your ideas clearly and naturally create dialogue.`],
        [`Cooperation`, `You work well in teams and promote group harmony.`],
        [`Patience`, `You stay calm and kind even in difficult situations.`],
        [`Motivating others`, `You know how to encourage and motivate people around you.`],
        [`Benevolent leadership`, `You naturally guide others with respect and without imposing.`],
      ],
      metiers: [
        { cat: `Teaching and Training`, liste: [
          [`Teacher (primary / secondary)`, `You transmit knowledge to students and accompany them in their school development.`],
          [`University professor`, `You teach a specialized subject at university and supervise students in their research.`],
          [`Professional trainer`, `You train adults and employees in new skills at training centers.`],
          [`Career counselor`, `You help students choose their field and career based on their abilities.`],
          [`School principal`, `You administer and lead a school managing teams and programs.`],
          [`Speech therapist`, `You diagnose and treat speech and language disorders in children and adults.`],
          [`School supervisor`, `You ensure student safety and good behavior in a school.`],
        ]},
        { cat: `Health and Care`, liste: [
          [`Nurse`, `You provide daily medical care to patients in collaboration with doctors.`],
          [`Midwife`, `You accompany women through pregnancy, childbirth and post-natal follow-up.`],
          [`Physiotherapist`, `You help patients regain motor skills after an injury or operation.`],
          [`General practitioner`, `You diagnose diseases and follow patients referring them to specialists as needed.`],
          [`Healthcare assistant`, `You assist nurses by providing basic care and comfort to hospitalized patients.`],
          [`Psychomotor therapist`, `You accompany people with movement disorders through adapted exercises.`],
        ]},
        { cat: `Psychology and Counseling`, liste: [
          [`Psychologist`, `You evaluate and treat patients psychological disorders through adapted therapies.`],
          [`Clinical psychologist`, `You accompany patients in a clinical setting to treat deep mental disorders.`],
          [`Professional coach`, `You accompany people or teams to develop their skills and reach their goals.`],
          [`Life coach`, `You accompany people in their personal development and life projects.`],
          [`Mental coach`, `You work on mental preparation to help overcome psychological blocks.`],
          [`Therapist`, `You use specialized therapeutic approaches to resolve patients difficulties.`],
          [`Professional integration counselor`, `You help unemployed people define their project and find work.`],
          [`Special education teacher`, `You accompany children or adults with social or behavioral difficulties.`],
          [`Social mediator`, `You intervene in conflicts to restore dialogue between people.`],
        ]},
        { cat: `Social and Humanitarian Work`, liste: [
          [`Social worker`, `You help people in difficulty access their rights and social services.`],
          [`Sociocultural animator`, `You organize cultural and educational activities for groups of people.`],
          [`NGO project officer`, `You manage humanitarian projects in the field to improve living conditions.`],
          [`Social project manager`, `You coordinate social assistance and integration programs for populations.`],
        ]},
        { cat: `Human Resources`, liste: [
          [`HR manager`, `You manage recruitment, training and employee well-being in a company.`],
          [`Training officer`, `You plan and organize continuing education programs for employees.`],
        ]},
        { cat: `Tourism and Hospitality`, liste: [
          [`Tour guide`, `You welcome and accompany visitors discovering the history and culture of Morocco.`],
          [`Hotel manager`, `You manage hotel operations to ensure the satisfaction of all guests.`],
          [`Travel agent`, `You design and sell trips and tours adapted to each client's needs and budget.`],
        ]},
        { cat: `Media and Animation`, liste: [
          [`Radio / TV presenter`, `You host live or recorded programs creating a warm connection with the audience.`],
        ]},
        { cat: `Law and Justice`, liste: [
          [`Lawyer`, `You defend and advise your clients in court and in their legal proceedings.`],
          [`Notary`, `You draft and authenticate official documents: contracts, wills, property purchases.`],
          [`Magistrate`, `You make judicial decisions applying the law in civil or criminal cases.`],
        ]},
      ],
      domaines: [`Medicine and nursing`, `Education and teaching`, `Psychology and coaching`, `Social and humanitarian work`, `Law and legal sciences`, `Human resources`, `Tourism and hospitality`, `Physiotherapy and rehabilitation`, `Speech therapy and psychomotor therapy`],
      envIdeal: [`School or training center`, `Hospital, clinic or care center`, `Humanitarian association or NGO`, `Psychology or coaching practice`, `Human resources department`, `Hotel, travel agency or tourism office`, `Court or law firm`],
      eviter: [
        [`Totally isolated work`, `You need constant human contact — working alone all day drains you.`],
        [`Cold and very competitive environment`, `You work better with kindness — aggressive competition stresses you.`],
        [`Purely technical tasks without relationships`, `You need meaning and human interaction — machine-like work doesn't fulfill you.`],
      ],
      env: `Human and warm environment, teamwork, permanent contact with people, visible and rewarding social impact.`,
    },
  },
  E: {
    fr: {
      nom: 'Entreprenant', emoji: '🚀',
      desc: `Tu es une personne ambitieuse, persuasive et dynamique. Tu aimes diriger, convaincre, initier des projets et prendre des risques calculés. Tu as un fort sens du leadership et tu t'épanouis dans les environnements compétitifs et stimulants.`,
      bonsEn: [`Le commerce et la vente`, `Le management et la direction`, `L'entrepreneuriat et les startups`, `La communication et les relations publiques`, `La finance et les affaires`, `La politique et l'administration`],
      forts: [
        [`Leadership`, `Tu prends naturellement les devants et tu guides les autres vers un objectif.`],
        [`Persuasion`, `Tu convaincs les autres et défends tes idées avec efficacité.`],
        [`Initiative`, `Tu passes à l'action sans attendre qu'on te le demande.`],
        [`Vision stratégique`, `Tu vois loin et planifies avec une vision globale et ambitieuse.`],
        [`Énergie`, `Tu apportes enthousiasme et dynamisme dans tout ce que tu entreprends.`],
        [`Prise de décision`, `Tu décides rapidement et assumes tes choix avec confiance.`],
      ],
      metiers: [
        { cat: `Direction et Management`, liste: [
          [`Directeur d'entreprise`, `Tu diriges l'ensemble d'une entreprise en définissant la vision et en motivant les équipes.`],
          [`Chef d'entreprise / Entrepreneur`, `Tu crées et gères ta propre entreprise en prenant toutes les décisions stratégiques.`],
          [`Manager d'équipe`, `Tu encadres et motives une équipe au quotidien pour atteindre les objectifs fixés.`],
          [`Chef de projet`, `Tu coordonnes les équipes, les délais et les budgets pour mener un projet à bien.`],
          [`Directeur commercial`, `Tu pilotes l'équipe de vente et définis la stratégie commerciale de l'entreprise.`],
          [`Directeur marketing`, `Tu définis la stratégie marketing et coordonnes les actions pour promouvoir la marque.`],
          [`Responsable de magasin`, `Tu gères l'ensemble d'un point de vente : équipe, stock, clients et performance.`],
        ]},
        { cat: `Vente et Commerce`, liste: [
          [`Responsable des ventes`, `Tu supervises et animes l'équipe commerciale pour maximiser les ventes.`],
          [`Commercial B2B`, `Tu prospectes et gères des clients professionnels en proposant des solutions adaptées.`],
          [`Responsable export`, `Tu développes les marchés internationaux et gères les partenaires étrangers.`],
          [`Agent immobilier`, `Tu accompagnes les clients dans l'achat, la vente ou la location de biens immobiliers.`],
        ]},
        { cat: `Banque et Finance`, liste: [
          [`Chef d'agence bancaire`, `Tu diriges une agence bancaire en gérant l'équipe, les clients et les objectifs.`],
          [`Conseiller clientèle bancaire`, `Tu accompagnes les clients dans la gestion de leurs comptes et leur proposes des produits adaptés.`],
          [`Conseiller en financement`, `Tu analyses les besoins de financement et proposes les meilleures solutions de crédit.`],
          [`Conseiller en assurance`, `Tu conseilles les clients sur les contrats d'assurance adaptés à leur situation.`],
          [`Courtier`, `Tu négocies les meilleures conditions de contrats pour le compte de tes clients.`],
          [`Gestionnaire commercial banque`, `Tu gères un portefeuille de clients bancaires et développes les ventes de produits.`],
          [`Directeur financier (DAF)`, `Tu supervises toutes les finances de l'entreprise : comptabilité, trésorerie et investissements.`],
        ]},
        { cat: `Hôtellerie et Tourisme`, liste: [
          [`Directeur d'hôtel`, `Tu diriges l'ensemble des opérations d'un hôtel pour garantir la qualité du service.`],
        ]},
        { cat: `Communication et Conseil`, liste: [
          [`Consultant en stratégie`, `Tu analyses les organisations et proposes des solutions pour améliorer leur performance.`],
          [`Directeur de communication`, `Tu définis et pilotes la stratégie de communication globale d'une entreprise.`],
          [`Responsable administratif et financier`, `Tu supervises à la fois l'administration et les finances d'une organisation.`],
        ]},
        { cat: `Administration et Diplomatie`, liste: [
          [`Haut fonctionnaire`, `Tu occupes un poste de responsabilité dans l'administration publique marocaine.`],
          [`Diplomate`, `Tu représentes le Maroc à l'étranger et défends les intérêts du pays dans les négociations.`],
          [`Avocat d'affaires`, `Tu conseilles les entreprises sur les questions juridiques : contrats, litiges et acquisitions.`],
        ]},
      ],
      domaines: [`Commerce et marketing`, `Management et gestion`, `Finance et banque`, `Droit des affaires`, `Entrepreneuriat et innovation`, `Communication et relations publiques`, `Administration publique`, `Sciences politiques et diplomatie`, `Économie et gestion`],
      envIdeal: [`Entreprise commerciale dynamique`, `Startup ou projet entrepreneurial`, `Cabinet de conseil en stratégie`, `Environnement de vente et négociation`, `Poste de direction ou de management`, `Administration publique ou ministère`, `Banque ou institution financière`],
      eviter: [
        [`Environnement très hiérarchique et rigide`, `Tu as besoin de liberté d'action — une structure trop rigide t'étouffe et te démotive.`],
        [`Travail sans objectifs ambitieux`, `Tu as besoin de défis — un travail sans perspective de croissance te lasse rapidement.`],
        [`Peu de liberté de décision`, `Tu as besoin d'autonomie — devoir tout demander à quelqu'un te freine considérablement.`],
      ],
      env: `Environnement compétitif et stimulant, liberté de prendre des décisions, travail sur des objectifs ambitieux, contacts nombreux et variés.`,
    },
    en: {
      nom: 'Enterprising', emoji: '🚀',
      desc: `You are an ambitious, persuasive and dynamic person. You love to lead, convince, initiate projects and take calculated risks. You have a strong sense of leadership and thrive in competitive and stimulating environments.`,
      bonsEn: [`Business and sales`, `Management and leadership`, `Entrepreneurship and startups`, `Communication and public relations`, `Finance and business`, `Politics and administration`],
      forts: [
        [`Leadership`, `You naturally take the lead and guide others toward a goal.`],
        [`Persuasion`, `You convince others and defend your ideas effectively.`],
        [`Initiative`, `You take action without waiting to be asked.`],
        [`Strategic vision`, `You think ahead and plan with a global and ambitious perspective.`],
        [`Energy`, `You bring enthusiasm and drive to everything you undertake.`],
        [`Decision making`, `You decide quickly and own your choices with confidence.`],
      ],
      metiers: [
        { cat: `Direction and Management`, liste: [
          [`Company director`, `You lead an entire company defining the vision and motivating teams.`],
          [`Business owner / Entrepreneur`, `You create and manage your own company making all strategic decisions.`],
          [`Team manager`, `You manage and motivate a team daily to reach set objectives.`],
          [`Project manager`, `You coordinate teams, deadlines and budgets to successfully complete a project.`],
          [`Sales director`, `You lead the sales team and define the company commercial strategy.`],
          [`Marketing director`, `You define the marketing strategy and coordinate actions to promote the brand.`],
          [`Store manager`, `You manage all aspects of a retail outlet: team, stock, customers and performance.`],
        ]},
        { cat: `Sales and Commerce`, liste: [
          [`Sales manager`, `You supervise and animate the commercial team to maximize sales.`],
          [`B2B sales representative`, `You prospect and manage professional clients proposing tailored solutions.`],
          [`Export manager`, `You develop international markets and manage foreign partners.`],
          [`Real estate agent`, `You accompany clients in buying, selling or renting real estate.`],
        ]},
        { cat: `Banking and Finance`, liste: [
          [`Bank branch manager`, `You lead a bank branch managing the team, clients and commercial objectives.`],
          [`Bank customer advisor`, `You accompany clients in managing their accounts and propose adapted products.`],
          [`Financing advisor`, `You analyze financing needs and propose the best credit solutions.`],
          [`Insurance advisor`, `You advise clients on insurance contracts suited to their situation.`],
          [`Broker`, `You negotiate the best contract terms on behalf of your clients.`],
          [`Bank commercial manager`, `You manage a portfolio of banking clients and develop product sales.`],
          [`Chief Financial Officer (CFO)`, `You oversee all company finances: accounting, treasury and investments.`],
        ]},
        { cat: `Hospitality and Tourism`, liste: [
          [`Hotel director`, `You lead all hotel operations to guarantee service quality and profitability.`],
        ]},
        { cat: `Communication and Consulting`, liste: [
          [`Strategy consultant`, `You analyze organizations and propose solutions to improve their performance.`],
          [`Communication director`, `You define and lead the global communication strategy of a company.`],
          [`Administrative and financial manager`, `You oversee both administration and finances of an organization.`],
        ]},
        { cat: `Administration and Diplomacy`, liste: [
          [`Senior civil servant`, `You hold a position of responsibility in the Moroccan public administration.`],
          [`Diplomat`, `You represent Morocco abroad and defend the country's interests in negotiations.`],
          [`Business lawyer`, `You advise companies on legal matters: contracts, disputes and acquisitions.`],
        ]},
      ],
      domaines: [`Business and marketing`, `Management`, `Finance and banking`, `Business law`, `Entrepreneurship and innovation`, `Communication and PR`, `Public administration`, `Political science and diplomacy`, `Economics and management`],
      envIdeal: [`Dynamic commercial company`, `Startup or entrepreneurial project`, `Strategy consulting firm`, `Sales and negotiation environment`, `Management or leadership position`, `Public administration or ministry`, `Bank or financial institution`],
      eviter: [
        [`Very hierarchical and rigid environment`, `You need freedom to act — a very rigid structure stifles and demotivates you.`],
        [`Work without ambitious goals`, `You need challenges — work without growth prospects bores you quickly.`],
        [`Little decision freedom`, `You need autonomy — having to ask permission for everything holds you back.`],
      ],
      env: `Competitive and stimulating environment, freedom to make decisions, work on ambitious goals, numerous and varied contacts.`,
    },
  },
  C: {
    fr: {
      nom: 'Conventionnel', emoji: '📊',
      desc: `Tu es une personne organisée, précise et méthodique. Tu aimes les tâches structurées, les données chiffrées et les procédures claires. Tu t'épanouis dans les environnements ordonnés où les règles et les processus sont bien définis.`,
      bonsEn: [`La comptabilité et la finance`, `L'administration et la gestion`, `La logistique et l'organisation`, `Le droit et le notariat`, `L'informatique de gestion`, `La qualité et les normes`],
      forts: [
        [`Organisation`, `Tu structures ton travail avec méthode et planifies avec précision.`],
        [`Rigueur`, `Tu travailles avec exactitude et fais attention aux moindres détails.`],
        [`Sens du détail`, `Tu remarques ce que les autres oublient et corriges les erreurs.`],
        [`Fiabilité`, `On peut compter sur toi pour rendre un travail propre et dans les délais.`],
        [`Maîtrise des procédures`, `Tu suis les règles et les processus établis avec rigueur et discipline.`],
        [`Gestion des données`, `Tu manipules facilement les chiffres, tableaux et informations structurées.`],
      ],
      metiers: [
        { cat: `Comptabilité et Audit`, liste: [
          [`Comptable`, `Tu enregistres et contrôles toutes les opérations financières d'une entreprise avec précision.`],
          [`Aide-comptable`, `Tu assistes le comptable dans la saisie, le classement et le traitement des documents comptables.`],
          [`Expert-comptable`, `Tu conseilles les entreprises sur leur gestion financière et certifies la conformité de leurs comptes.`],
          [`Auditeur interne / externe`, `Tu examines les comptes et processus d'une entreprise pour détecter les erreurs et fraudes.`],
          [`Contrôleur de gestion`, `Tu analyses les performances financières et proposes des actions pour optimiser les coûts.`],
          [`Gestionnaire de paie`, `Tu calcules et traites les salaires des employés en respectant la législation sociale.`],
          [`Responsable administratif et financier`, `Tu supervises l'administration et les finances d'une entreprise ou organisation.`],
          [`Fiscaliste`, `Tu gères les obligations fiscales des entreprises et optimises leur situation vis-à-vis des impôts.`],
        ]},
        { cat: `Administration et Secrétariat`, liste: [
          [`Secrétaire de direction`, `Tu assistes un directeur dans son organisation quotidienne : agenda, courriers et réunions.`],
          [`Assistant de gestion`, `Tu appuies le management dans les tâches administratives et la gestion des documents.`],
          [`Archiviste`, `Tu organises, classes et conserves les documents officiels d'une organisation.`],
          [`Administrateur public`, `Tu gères les affaires administratives d'une collectivité ou d'un ministère selon les procédures officielles.`],
          [`Responsable scolarité`, `Tu gères les inscriptions, dossiers et plannings des étudiants dans un établissement.`],
          [`Agent d'exploitation`, `Tu assures le bon fonctionnement opérationnel d'un service ou d'une infrastructure.`],
          [`Assistant RH`, `Tu appuies le service des ressources humaines dans la gestion des dossiers et recrutements.`],
        ]},
        { cat: `Logistique et Supply Chain`, liste: [
          [`Responsable logistique`, `Tu coordonnes le transport, le stockage et la distribution des produits pour optimiser la chaîne.`],
          [`Gestionnaire des stocks`, `Tu gères les entrées et sorties de marchandises pour éviter les ruptures et surplus.`],
          [`Agent douanier`, `Tu contrôles et facilite le passage des marchandises aux frontières selon la réglementation.`],
          [`Planificateur de production`, `Tu organises le calendrier de fabrication pour répondre aux commandes dans les délais.`],
        ]},
        { cat: `Informatique de Gestion`, liste: [
          [`Responsable systèmes d'information`, `Tu gères l'infrastructure informatique et les logiciels utilisés dans l'entreprise.`],
          [`Analyste ERP / SAP`, `Tu paramètres et optimises les logiciels de gestion pour automatiser les processus internes.`],
          [`Data analyst`, `Tu analyses les données de l'entreprise pour produire des tableaux de bord et aider aux décisions.`],
        ]},
        { cat: `Banque et Assurance`, liste: [
          [`Gestionnaire de trésorerie`, `Tu gères les flux financiers de l'entreprise pour garantir sa liquidité.`],
          [`Analyste risques`, `Tu identifies et évalues les risques financiers et opérationnels pour protéger l'organisation.`],
          [`Gestionnaire back-office bancaire`, `Tu traites les opérations bancaires en coulisses : virements, validations et réconciliations.`],
          [`Actuaire`, `Tu calcules les risques et les primes d'assurance en utilisant des modèles mathématiques.`],
          [`Responsable compliance`, `Tu veilles à ce que l'entreprise respecte toutes les lois, règlements et normes.`],
          [`Employé assurances`, `Tu traites les contrats, sinistres et dossiers clients dans une compagnie d'assurance.`],
          [`Chargé de clientèle`, `Tu accueilles et accompagnes les clients, gères leurs demandes et assures le suivi de leurs dossiers.`],
        ]},
        { cat: `Droit et Notariat`, liste: [
          [`Notaire`, `Tu rédiges et authentifies les actes officiels : contrats, testaments, ventes immobilières.`],
          [`Huissier de justice`, `Tu exécutes les décisions de justice et signifies les actes officiels aux parties concernées.`],
        ]},
        { cat: `Qualité et Normes`, liste: [
          [`Responsable qualité (QHSE)`, `Tu mets en place et suis les systèmes de management de la qualité, la sécurité et l'environnement.`],
          [`Auditeur qualité`, `Tu contrôles que les processus de l'entreprise respectent les normes ISO et les standards requis.`],
          [`Statisticien`, `Tu collectes et analyses des données numériques pour aider à la prise de décision.`],
        ]},
      ],
      domaines: [`Comptabilité et audit`, `Finance et banque`, `Administration et gestion`, `Informatique de gestion et ERP`, `Logistique et supply chain`, `Droit et notariat`, `Statistiques et actuariat`, `Qualité, hygiène, sécurité et environnement (QHSE)`, `Gestion des ressources humaines`],
      envIdeal: [`Cabinet comptable ou service financier`, `Administration publique ou entreprise structurée`, `Service juridique ou notarial`, `Département logistique ou supply chain`, `Back-office bancaire ou assurance`, `Service qualité d'une entreprise industrielle`, `Direction des systèmes d'information`],
      eviter: [
        [`Environnement désorganisé et chaotique`, `Tu as besoin de structure et de clarté — le désordre réduit ton efficacité et te stresse.`],
        [`Tâches floues sans règles claires`, `Tu travailles mieux avec des consignes précises — le vague génère du stress.`],
        [`Changements trop fréquents`, `Tu préfères la stabilité et la routine — les changements permanents te perturbent.`],
      ],
      env: `Environnement stable et structuré, tâches bien définies, procédures claires, peu de surprises, valorisation de la précision et de l'exactitude.`,
    },
    en: {
      nom: 'Conventional', emoji: '📊',
      desc: `You are an organized, precise and methodical person. You like structured tasks, numerical data and clear procedures. You thrive in orderly environments where rules and processes are well defined.`,
      bonsEn: [`Accounting and finance`, `Administration and management`, `Logistics and organization`, `Law and notary`, `Management computing`, `Quality and standards`],
      forts: [
        [`Organization`, `You structure your work methodically and plan with precision.`],
        [`Rigor`, `You work with accuracy and pay attention to every detail.`],
        [`Attention to detail`, `You notice what others miss and correct errors.`],
        [`Reliability`, `You deliver clean work on time, every time.`],
        [`Process mastery`, `You follow established rules and processes with rigor and discipline.`],
        [`Data management`, `You handle numbers, tables and structured information easily.`],
      ],
      metiers: [
        { cat: `Accounting and Audit`, liste: [
          [`Accountant`, `You record and control all financial operations of a company with precision.`],
          [`Accounting assistant`, `You assist the accountant in data entry, filing and processing accounting documents.`],
          [`Chartered accountant`, `You advise companies on financial management and certify their accounts compliance.`],
          [`Internal / external auditor`, `You examine company accounts and processes to detect errors and fraud.`],
          [`Management controller`, `You analyze financial performance and propose actions to optimize costs.`],
          [`Payroll manager`, `You calculate and process employee salaries respecting social legislation.`],
          [`Administrative and financial manager`, `You oversee both administration and finances of a company or organization.`],
          [`Tax specialist`, `You manage company tax obligations and optimize their tax situation.`],
        ]},
        { cat: `Administration and Secretariat`, liste: [
          [`Executive secretary`, `You assist a director in their daily organization: agenda, correspondence and meetings.`],
          [`Management assistant`, `You support management in administrative tasks and document management.`],
          [`Archivist`, `You organize, file and preserve official documents of an organization.`],
          [`Public administrator`, `You manage administrative affairs of a local authority or ministry following official procedures.`],
          [`School registrar`, `You manage student registrations, files and schedules in an educational institution.`],
          [`Operations agent`, `You ensure the smooth operational functioning of a service or infrastructure.`],
          [`HR assistant`, `You support the HR department in managing files, recruitments and training.`],
        ]},
        { cat: `Logistics and Supply Chain`, liste: [
          [`Logistics manager`, `You coordinate transport, storage and product distribution to optimize the supply chain.`],
          [`Stock manager`, `You manage merchandise in and out to avoid shortages and surpluses.`],
          [`Customs agent`, `You control and facilitate the passage of goods at borders according to regulations.`],
          [`Production planner`, `You organize the manufacturing schedule to fulfill orders on time.`],
        ]},
        { cat: `Management IT`, liste: [
          [`IT systems manager`, `You manage the company IT infrastructure and software to ensure proper functioning.`],
          [`ERP / SAP analyst`, `You configure and optimize management software to automate internal processes.`],
          [`Data analyst`, `You analyze company data to produce dashboards and support decision-making.`],
        ]},
        { cat: `Banking and Insurance`, liste: [
          [`Treasury manager`, `You manage company financial flows to ensure liquidity.`],
          [`Risk analyst`, `You identify and assess financial and operational risks to protect the organization.`],
          [`Bank back-office manager`, `You process banking operations behind the scenes: transfers, validations and reconciliations.`],
          [`Actuary`, `You calculate insurance risks and premiums using mathematical models.`],
          [`Compliance manager`, `You ensure the company complies with all laws, regulations and standards.`],
          [`Insurance employee`, `You process contracts, claims and client files in an insurance company.`],
          [`Customer relationship officer`, `You welcome and assist clients, manage their requests and follow up on their files.`],
        ]},
        { cat: `Law and Notary`, liste: [
          [`Notary`, `You draft and authenticate official documents: contracts, wills, property sales.`],
          [`Enforcement officer`, `You execute court decisions and serve official documents to the parties concerned.`],
        ]},
        { cat: `Quality and Standards`, liste: [
          [`Quality manager (QHSE)`, `You implement and monitor quality, safety and environment management systems.`],
          [`Quality auditor`, `You verify that company processes comply with ISO standards and required norms.`],
          [`Statistician`, `You collect and analyze numerical data to support decision-making.`],
        ]},
      ],
      domaines: [`Accounting and audit`, `Finance and banking`, `Administration and management`, `Management IT and ERP`, `Logistics and supply chain`, `Law and notary`, `Statistics and actuarial science`, `Quality, health, safety and environment (QHSE)`, `Human resources management`],
      envIdeal: [`Accounting firm or financial department`, `Public administration or structured company`, `Legal or notary office`, `Logistics or supply chain department`, `Bank back-office or insurance`, `Quality department of an industrial company`, `Information systems department`],
      eviter: [
        [`Disorganized and chaotic environment`, `You need structure and clarity — disorder reduces your efficiency and stresses you.`],
        [`Vague tasks without clear rules`, `You work better with precise instructions — vagueness generates stress.`],
        [`Too frequent changes`, `You prefer stability and routine — permanent changes disturb you.`],
      ],
      env: `Stable and structured work environment, well-defined tasks, clear procedures, few surprises, appreciation of precision and accuracy.`,
    },
  },
}



const DIM_COLORS = {
  R:'#EF4444', I:'#3B82F6', A:'#8B5CF6',
  S:'#10B981', E:'#F59E0B', C:'#06B6D4',
}
const DIM_BG = {
  R:'#FEF2F2', I:'#EFF6FF', A:'#F5F3FF',
  S:'#F0FDF4', E:'#FFFBEB', C:'#ECFEFF',
}

// ══════════════════════════════════════════════════════════
// CALCUL RIASEC
// ══════════════════════════════════════════════════════════
const DIMS_QUESTIONS = {
  R: [1,7,13,19,25,31,37,43,49,55,61,67],
  I: [2,8,14,20,26,32,38,44,50,56,62,68],
  A: [3,9,15,21,27,33,39,45,51,57,63,69],
  S: [4,10,16,22,28,34,40,46,52,58,64,70],
  E: [5,11,17,23,29,35,41,47,53,59,65,71],
  C: [6,12,18,24,30,36,42,48,54,60,66,72],
}

function calculerScores(reponses) {
  const scores = {}
  for (const [dim, ids] of Object.entries(DIMS_QUESTIONS)) {
    const total = ids.reduce((sum, id) => sum + (reponses[id] ?? 0), 0)
    scores[dim] = Math.round((total / 48) * 100)
  }
  return scores
}

function getClassement(scores) {
  return Object.entries(scores)
    .sort(([,a],[,b]) => b - a)
    .map(([dim]) => dim)
}

// ══════════════════════════════════════════════════════════
// GÉNÉRATION PDF avec jsPDF
// ══════════════════════════════════════════════════════════
async function genererPDF(eleve, scores, classement, lang) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const W = 210, H = 297, ML = 14, MR = 14, TW = W - ML - MR

  const profA = PROFILS[classement[0]][lang]
  const profB = PROFILS[classement[1]][lang]
  const profC = PROFILS[classement[2]][lang]
  const code3 = classement[0] + classement[1] + classement[2]

  const RGB = {
    R:[239,68,68], I:[59,130,246], A:[139,92,246],
    S:[16,185,129], E:[245,158,11], C:[6,182,212]
  }
  const cA = RGB[classement[0]]
  const cB = RGB[classement[1]]
  const cC = RGB[classement[2]]
  const DRK=[30,41,59], GRY=[71,85,105], LGT=[148,163,184]
  const WHT=[255,255,255], RED=[239,68,68], AMB=[217,119,6]

  const clp  = v => Math.min(255,Math.max(0,Math.round(v)))
  const mix  = (c,w) => c.map(v=>clp(v*(1-w)+255*w))
  const drk  = (c,w) => c.map(v=>clp(v*(1-w)))

  const sf = (bold,size,col) => {
    doc.setFont('helvetica',bold?'bold':'normal')
    doc.setFontSize(size)
    doc.setTextColor(col[0],col[1],col[2])
  }
  const fl = col => doc.setFillColor(col[0],col[1],col[2])
  const dr = col => doc.setDrawColor(col[0],col[1],col[2])
  const bx = (x,y,w,h,r,col) => {
    fl(col||[248,250,252])
    doc.roundedRect(x,y,Math.max(0.5,w),Math.max(0.5,h),r||0,r||0,'F')
  }
  const cl = s => String(s||'').replace(/[^\x00-\xFF \n]/g,'').trim()
  const tx = (s,x,y,al) => { const c=cl(s); if(c) doc.text(c,x,y,al?{align:al}:{}) }
  const txw = (s,x,y,mw,lh) => {
    const c=cl(s); if(!c) return y
    const ls=doc.splitTextToSize(c,mw)
    doc.text(ls,x,y)
    return y+ls.length*(lh||5.4)
  }

  let curPage=1, y=0

  // ── Logo bar sur chaque nouvelle page ──
  const logoBar = () => {
    bx(0,0,W,13,0,DRK)
    // Petit carré AT
    bx(ML,1.5,10,10,2,cA)
    sf(true,7,WHT); tx('AT',ML+5,8,'center')
    sf(true,10,WHT); tx('ATLAS TAWJIH',ML+13,9)
    sf(false,8,LGT); tx(`${eleve.prenom} ${eleve.nom}  |  Code : ${code3}`,W-MR,9,'right')
  }
  const newPage = () => {
    doc.addPage(); bx(0,0,W,H,0,WHT); logoBar(); curPage++; y=20
  }
  const chk = n => { if(y+n>H-12) newPage() }
  const ftr = () => {
    bx(0,H-10,W,10,0,DRK); sf(false,8,LGT)
    tx('Atlas Tawjih  |  atlastawjih.maroc@gmail.com',ML,H-4)
    tx(`${curPage}`,W-MR,H-4,'right')
  }

  // ── Barre de section (comme les blocs colorés de la page web) ──
  const secBar = (label, col) => {
    chk(14)
    // Bande colorée + barre latérale gauche
    bx(ML,y,TW,10,2,col)
    sf(true,11,WHT); tx(label,ML+6,y+7)
    y+=13
  }

  // ── Sous-titre avec barre latérale gauche (style page web) ──
  const subBar = (label, col) => {
    chk(10)
    bx(ML,y,3,10,0,col)
    sf(true,10,col); tx(label,ML+7,y+7)
    y+=13
  }

  // ── Bloc texte avec bord gauche coloré (identique page web) ──
  const tblk = (s, col) => {
    const c=cl(s)
    const ls=doc.splitTextToSize(c,TW-10)
    const h=ls.length*5.6+10
    chk(h+4)
    bx(ML,y,TW,h,3,mix(col,0.94))
    bx(ML,y,3,h,0,col)
    sf(false,9.5,DRK); doc.text(ls,ML+7,y+7)
    y+=h+5
  }

  // ── Pastille (tags ronds colorés, exactement comme la page web) ──
  const pills = (items, col) => {
    let sx=ML, rowY=y
    items.forEach(item => {
      const s=cl(item), sw=doc.getTextWidth(s)+10
      if(sx+sw>W-MR){ sx=ML; rowY+=8; chk(10) }
      bx(sx,rowY,sw,7,3,mix(col,0.9))
      dr(mix(col,0.65)); doc.setLineWidth(0.3)
      doc.roundedRect(sx,rowY,sw,7,3,3,'FD')
      sf(false,8.5,col); tx(s,sx+5,rowY+5)
      sx+=sw+4
    })
    y=rowY+10
  }

  // ── Ligne de tableau alternée (style points forts) ──
  const tableRow = (col1, col2, col, even) => {
    const c2=cl(col2)
    const ls=doc.splitTextToSize(c2,TW*0.62-6)
    const h=Math.max(10,ls.length*5.2+8)
    chk(h+2)
    bx(ML,y,TW,h,0,even?mix(col,0.07):WHT)
    // Barre latérale gauche
    bx(ML,y,3,h,0,col)
    // Colonne 1 — titre
    sf(true,9.5,col); tx(cl(col1),ML+6,y+h/2+1.5)
    // Ligne séparatrice verticale
    dr(mix(col,0.6)); doc.setLineWidth(0.3)
    doc.line(ML+TW*0.36,y+2,ML+TW*0.36,y+h-2)
    // Colonne 2 — description
    sf(false,9,GRY); doc.text(ls,ML+TW*0.37,y+6)
    y+=h+1
  }

  // ── Bloc métier avec catégorie ──
  const metiersBlock = (metiers, col) => {
    metiers.forEach(({cat,liste}) => {
      chk(16)
      // Badge catégorie (comme le badge orange/violet dans la page web)
      bx(ML,y,TW,8,2,mix(col,0.85))
      bx(ML,y,3,8,0,col)
      sf(true,9.5,col); tx(cl(cat),ML+7,y+5.5)
      y+=10
      liste.forEach(([nom,desc],i) => {
        const dls=doc.splitTextToSize(cl(desc),TW-16)
        const h=Math.max(12,dls.length*5+10)
        chk(h+2)
        bx(ML+2,y,TW-2,h,2,i%2===0?mix(col,0.06):WHT)
        bx(ML+2,y,2,h,0,mix(col,0.5))
        sf(true,9.5,col); tx('v '+cl(nom),ML+7,y+7)
        sf(false,8.5,GRY); doc.text(dls,ML+7,y+13)
        y+=h+2
      })
      y+=4
    })
  }

  // ── Bloc à éviter (rouge, style page web) ──
  const eviterBlock = (items) => {
    items.forEach(([titre,desc]) => {
      const dls=doc.splitTextToSize(cl(desc),TW-14)
      const h=dls.length*5.2+14
      chk(h+3)
      bx(ML,y,TW,h,3,[254,242,242])
      bx(ML,y,3,h,0,RED)
      sf(true,10,RED); tx('x  '+cl(titre),ML+7,y+8)
      sf(false,9,[127,29,29]); doc.text(dls,ML+7,y+14)
      y+=h+5
    })
  }

  // ── Séparateur (identique à la page web) ──
  const separator = (label) => {
    chk(14)
    dr([220,220,220]); doc.setLineWidth(0.4)
    doc.line(ML,y+4,W/2-25,y+4)
    doc.line(W/2+25,y+4,W-MR,y+4)
    bx(W/2-24,y,48,8,2,[241,245,249])
    sf(true,7.5,[100,116,139]); tx(label,W/2,y+5.5,'center')
    y+=14
  }

  // ═══════════════════════════════════════════
  // PAGE 1 — COUVERTURE
  // ═══════════════════════════════════════════
  bx(0,0,W,H,0,WHT)

  // Header avec dégradé (comme le header de la page web)
  bx(0,0,W,58,0,cA)
  // Logo carré AT
  bx(ML,9,22,22,3,WHT)
  sf(true,12,cA); tx('AT',ML+11,23,'center')
  sf(true,20,WHT); tx('ATLAS TAWJIH',ML+28,19)
  sf(false,9,mix(cA,0.55))
  tx(lang==='fr'?"Rapport d'Orientation RIASEC":'RIASEC Orientation Report',ML+28,27)
  sf(false,8,mix(cA,0.5))
  tx(new Date().toLocaleDateString(lang==='fr'?'fr-FR':'en-US'),W-MR,19,'right')

  // Bande inférieure header (nom étudiant)
  bx(ML,37,TW,17,2,drk(cA,0.12))
  sf(true,13,WHT); tx(`${eleve.prenom} ${eleve.nom}`,ML+6,46)
  sf(false,9,mix(cA,0.5)); tx(`${eleve.filiere}   |   ${eleve.ville}`,ML+6,53)

  y=68

  // Bloc profil dominant (style carte page web)
  bx(ML,y,TW,32,3,mix(cA,0.93))
  bx(ML+4,y+5,22,22,3,cA)
  sf(true,14,WHT); tx(classement[0],ML+15,y+19,'center')
  sf(true,14,DRK); tx(profA.nom,ML+32,y+13)
  sf(false,9,GRY); tx(lang==='fr'?"Profil dominant":'Dominant profile',ML+32,y+20)
  sf(true,12,cA); tx(code3,ML+32,y+28)
  bx(W-MR-26,y+6,22,20,3,cA)
  sf(true,14,WHT); tx(`${scores[classement[0]]}%`,W-MR-15,y+18,'center')
  sf(false,7,WHT); tx('score',W-MR-15,y+24,'center')
  y+=38

  // Scores RIASEC avec barres
  subBar(lang==='fr'?'Scores RIASEC':'RIASEC Scores',DRK)
  classement.forEach((dim,i) => {
    const sc=scores[dim], cc=RGB[dim], pn=cl(PROFILS[dim][lang].nom)
    sf(true,9,cc); tx(dim,ML,y+3.5)
    sf(false,9,GRY); tx(pn,ML+8,y+3.5)
    // Barre fond
    bx(ML+54,y,88,6,2,[226,232,240])
    // Barre valeur
    bx(ML+54,y,Math.max(1,88*sc/100),6,2,cc)
    sf(true,9,cc); tx(`${sc}%`,ML+146,y+4.5)
    const medals=['[A]','[B]','[C]']
    if(i<3){ sf(true,8.5,DRK); tx(medals[i],ML+156,y+4.5) }
    y+=9
  })
  y+=4

  // Description profil
  subBar(lang==='fr'?'Profil en detail':'Profile in detail',cA)
  tblk(profA.desc,cA)

  // Tu seras bon dans (pastilles)
  if(profA.bonsEn && profA.bonsEn.length>0){
    subBar(lang==='fr'?'Tu seras tres bon dans':'You will excel in',cA)
    pills(profA.bonsEn,cA)
  }

  ftr()

  // ═══════════════════════════════════════════
  // PAGE 2 — POINTS FORTS (tableau style page web)
  // ═══════════════════════════════════════════
  newPage()
  secBar(lang==='fr'?'Points forts':'Key strengths',cA)

  // En-tête tableau (comme la page web)
  chk(10)
  bx(ML,y,TW,9,2,cA)
  sf(true,10,WHT)
  tx(lang==='fr'?"Point fort":'Strength',ML+6,y+6.3)
  tx(lang==='fr'?"Ce que ca signifie pour toi":'What it means for you',ML+TW*0.37,y+6.3)
  y+=11

  profA.forts.forEach(([fort,desc],i) => {
    tableRow(fort,desc,cA,i%2===0)
  })
  y+=6
  ftr()

  // ═══════════════════════════════════════════
  // PAGE 3 — PLAN A
  // ═══════════════════════════════════════════
  newPage()
  // Badge Plan A (style badge page web)
  bx(ML,y,TW,22,3,cA)
  bx(ML,y,4,22,0,drk(cA,0.2))
  sf(true,9,mix(cA,0.4))
  tx(lang==='fr'?"PLAN A - PROFIL DOMINANT - PRIORITE":'PLAN A - DOMINANT PROFILE - PRIORITY',ML+8,y+7)
  sf(true,16,WHT); tx(`${classement[0]}  -  ${profA.nom}  (${scores[classement[0]]}%)`,ML+8,y+18)
  bx(W-MR-28,y+4,24,14,2,drk(cA,0.15))
  sf(true,8,WHT); tx('Score',W-MR-16,y+10,'center')
  sf(true,13,WHT); tx(`${scores[classement[0]]}%`,W-MR-16,y+18,'center')
  y+=27

  // Domaines (pastilles style page web)
  subBar(lang==='fr'?"Domaines d'etudes au Maroc":"Fields of study in Morocco",cA)
  pills(profA.domaines,cA)

  // Métiers avec catégories et descriptions
  subBar(lang==='fr'?'Metiers recommandes':'Recommended careers',cA)
  metiersBlock(profA.metiers,cA)
  ftr()

  // ═══════════════════════════════════════════
  // PAGE 4 — PLAN B
  // ═══════════════════════════════════════════
  newPage()
  bx(ML,y,TW,22,3,cB)
  bx(ML,y,4,22,0,drk(cB,0.2))
  sf(true,9,mix(cB,0.4))
  tx(lang==='fr'?"PLAN B - PROFIL SECONDAIRE - ALTERNATIVE":'PLAN B - SECONDARY PROFILE - ALTERNATIVE',ML+8,y+7)
  sf(true,16,WHT); tx(`${classement[1]}  -  ${profB.nom}  (${scores[classement[1]]}%)`,ML+8,y+18)
  bx(W-MR-28,y+4,24,14,2,drk(cB,0.15))
  sf(true,8,WHT); tx('Score',W-MR-16,y+10,'center')
  sf(true,13,WHT); tx(`${scores[classement[1]]}%`,W-MR-16,y+18,'center')
  y+=27
  subBar(lang==='fr'?"Domaines d'etudes au Maroc":"Fields of study in Morocco",cB)
  pills(profB.domaines,cB)
  subBar(lang==='fr'?'Metiers recommandes':'Recommended careers',cB)
  metiersBlock(profB.metiers,cB)
  ftr()

  // ═══════════════════════════════════════════
  // PAGE 5 — PLAN C
  // ═══════════════════════════════════════════
  newPage()
  bx(ML,y,TW,22,3,cC)
  bx(ML,y,4,22,0,drk(cC,0.2))
  sf(true,9,mix(cC,0.4))
  tx(lang==='fr'?"PLAN C - PROFIL TERTIAIRE - OPTION DE REPLI":'PLAN C - TERTIARY PROFILE - BACKUP OPTION',ML+8,y+7)
  sf(true,16,WHT); tx(`${classement[2]}  -  ${profC.nom}  (${scores[classement[2]]}%)`,ML+8,y+18)
  bx(W-MR-28,y+4,24,14,2,drk(cC,0.15))
  sf(true,8,WHT); tx('Score',W-MR-16,y+10,'center')
  sf(true,13,WHT); tx(`${scores[classement[2]]}%`,W-MR-16,y+18,'center')
  y+=27
  subBar(lang==='fr'?"Domaines d'etudes au Maroc":"Fields of study in Morocco",cC)
  pills(profC.domaines,cC)
  subBar(lang==='fr'?'Metiers recommandes':'Recommended careers',cC)
  metiersBlock(profC.metiers,cC)
  ftr()

  // ═══════════════════════════════════════════
  // PAGE 6 — ENVIRONNEMENT & À ÉVITER
  // ═══════════════════════════════════════════
  newPage()
  secBar(lang==='fr'?'Environnement et Conseils':'Environment and Advice',cA)

  // Environnement idéal (bloc coloré avec bord gauche, style page web)
  subBar(lang==='fr'?'Environnement de travail ideal':'Ideal work environment',cA)
  tblk(profA.env,cA)

  // Lieux adaptés (pastilles)
  if(profA.envIdeal && profA.envIdeal.length>0){
    subBar(lang==='fr'?'Lieux qui te correspondent':'Environments that suit you',cA)
    pills(profA.envIdeal,cA)
  }

  // À éviter (blocs rouges avec description, style page web)
  if(profA.eviter && profA.eviter.length>0){
    subBar(lang==='fr'?'A eviter':'To avoid',RED)
    eviterBlock(profA.eviter)
  }

  // Message personnel
  subBar(lang==='fr'?'Message personnel':'Personal message',cA)
  const motiv = lang==='fr'
    ? `${eleve.prenom}, ce rapport est un point de depart, pas un verdict definitif. Ton profil ${profA.nom} est un veritable atout. Fais confiance a tes forces naturelles et construis ton avenir avec passion et determination !`
    : `${eleve.prenom}, this report is a starting point, not a final verdict. Your ${profA.nom} profile is a real asset. Trust your natural strengths and build your future with passion!`
  tblk(motiv,cA)
  ftr()

  // ═══════════════════════════════════════════
  // PAGE 7 — NOTE PARENTS
  // ═══════════════════════════════════════════
  newPage()
  secBar(lang==='fr'?'Note pour les parents':'Note for parents',AMB)

  // Bloc note parents (jaune, style page web)
  const parentNote = lang==='fr'
    ? `Chers parents,\n\nVotre enfant ${eleve.prenom} a un profil ${profA.nom} dominant (${scores[classement[0]]}%). Ce resultat est une base de reflexion, pas un verdict definitif. Ce rapport ouvre des pistes, il ne ferme pas de portes.\n\nNous vous recommandons d'explorer ensemble les domaines compatibles listes dans ce rapport. Les recommandations d'etablissements seront communiquees par l'equipe Atlas Tawjih selon la situation, la mobilite et les preferences de votre enfant.`
    : `Dear parents,\n\nYour child ${eleve.prenom} has a dominant ${profA.nom} profile (${scores[classement[0]]}%). This result is a basis for reflection, not a final verdict. This report opens paths, it does not close doors.\n\nWe recommend exploring compatible fields together. Institution recommendations will be provided by the Atlas Tawjih team.`

  const pls=doc.splitTextToSize(cl(parentNote),TW-10)
  const ph=pls.length*5.6+12; chk(ph+4)
  bx(ML,y,TW,ph,3,[255,251,235])
  bx(ML,y,3,ph,0,AMB)
  sf(false,10,[120,53,15]); doc.text(pls,ML+7,y+8)
  y+=ph+8

  // Conseils aux parents (tableau style points forts)
  subBar(lang==='fr'?'Comment accompagner votre enfant':'How to support your child',AMB)

  const cpFr=[
    [`Ne pas imposer`,`Laissez votre enfant explorer ses interets naturels sans imposer de filiere.`],
    [`Valoriser les interets`,`Soutenez ses passions meme si elles semblent inhabituelles.`],
    [`Offrir des ressources`,`Livres, stages, visites de metiers : tout ce qui nourrit son projet est utile.`],
    [`Respecter l'autonomie`,`Il a besoin d'espace pour reflechir et construire son projet.`],
    [`Contacter Atlas Tawjih`,`Notre equipe accompagne votre enfant dans ses demarches d'orientation.`],
  ]
  const cpEn=[
    [`Do not impose`,`Let your child explore their natural interests without imposing a field.`],
    [`Value interests`,`Support their passions even if unusual. This is their main strength.`],
    [`Offer resources`,`Books, internships, career visits: everything builds their project.`],
    [`Respect autonomy`,`They need space to think and build their project at their own pace.`],
    [`Contact Atlas Tawjih`,`Our team supports your child through their entire orientation journey.`],
  ]
  const cp = lang==='fr' ? cpFr : cpEn
  cp.forEach(([titre,desc],i) => tableRow(titre,desc,AMB,i%2===0))
  ftr()

  // ═══════════════════════════════════════════
  // PAGE 8 — RÉCAPITULATIF & SIGNATURE
  // ═══════════════════════════════════════════
  newPage()
  secBar(lang==='fr'?'Recapitulatif':'Summary',DRK)

  // Tableau infos élève (alternance gris/blanc, style page web)
  subBar(lang==='fr'?"Informations de l'eleve":"Student information",cA)
  const mobVal = eleve.mobilite==='oui'?(lang==='fr'?'Oui - toute ville':'Yes - any city'):eleve.mobilite==='non'?(lang==='fr'?'Non':'No'):(lang==='fr'?'Certaines villes':'Certain cities')
  const priveVal = eleve.prive==='oui'?(lang==='fr'?'Oui':'Yes'):(lang==='fr'?'Non':'No')
  const rows=[
    [lang==='fr'?'Nom complet':'Full name', `${eleve.prenom} ${eleve.nom}`],
    [lang==='fr'?'Filiere':'Field', eleve.filiere],
    ['Ville', eleve.ville],
    [lang==='fr'?'Mobilite':'Mobility', mobVal],
    [lang==='fr'?'Prive':'Private', priveVal],
    [lang==='fr'?'Date':'Date', new Date().toLocaleDateString(lang==='fr'?'fr-FR':'en-US')],
    ['Code Holland', `${code3}  -  ${profA.nom} / ${profB.nom} / ${profC.nom}`],
  ]
  rows.forEach(([k,v],i) => {
    const h=10; chk(h+1)
    bx(ML,y,TW,h,0,i%2===0?mix(cA,0.07):WHT)
    bx(ML,y,3,h,0,cA)
    sf(true,9.5,DRK); tx(cl(String(k)),ML+6,y+7)
    sf(false,9.5,GRY)
    const vls=doc.splitTextToSize(cl(String(v||'')),TW-52)
    doc.text(vls,ML+52,y+7); y+=h+1
  })
  y+=8

  // Diagramme barres verticales des 6 scores
  subBar(lang==='fr'?'Tes 6 scores RIASEC':'Your 6 RIASEC scores',cA)
  const bW=26,bMH=40,bGap=5,bSX=ML+6,bBY=y+bMH+8
  Object.entries(scores).forEach(([dim,sc],i)=>{
    const bh=Math.max(2,(sc/100)*bMH),bx2=bSX+i*(bW+bGap),by2=bBY-bh
    const cc=RGB[dim]
    bx(bx2,bBY-bMH,bW,bMH,2,[226,232,240])
    bx(bx2,by2,bW,bh,2,cc)
    sf(true,9,cc); tx(`${sc}%`,bx2+bW/2,by2-2,'center')
    sf(true,10,DRK); tx(dim,bx2+bW/2,bBY+5,'center')
    sf(false,7.5,GRY)
    const pn=cl(PROFILS[dim][lang].nom)
    const pnL=doc.splitTextToSize(pn,bW+2)
    pnL.forEach((line,li)=>tx(line,bx2+bW/2,bBY+10+li*4.5,'center'))
  })
  y=bBY+20

  // À propos Atlas Tawjih
  subBar('Atlas Tawjih',cA)
  const about = lang==='fr'
    ? `Atlas Tawjih est une plateforme d'orientation dediee aux bacheliers marocains. Notre mission : aider chaque eleve a decouvrir son profil et s'orienter vers la filiere qui lui correspond. Nous gerons les candidatures aux ecoles et bourses avec un suivi national jusqu'a la fin du parcours.`
    : `Atlas Tawjih is an orientation platform for Moroccan students. We help every student discover their profile and find the right field. We handle applications to schools and scholarships with full national follow-up.`
  tblk(about,cA)

  // Signature
  chk(30)
  dr([220,220,220]); doc.setLineWidth(0.8); doc.line(ML,y,W-MR,y); y+=7
  sf(false,9,GRY)
  tx(lang==='fr'?"Certifie par":'Certified by',ML,y)
  tx(lang==='fr'?"Cachet":'Stamp',W/2,y); y+=6
  sf(true,12,DRK); tx('Atlas Tawjih',ML,y)
  sf(false,9,GRY); tx(new Date().toLocaleDateString(lang==='fr'?'fr-FR':'en-US'),ML,y+7)
  bx(W/2,y-5,TW/2,24,3,cA)
  sf(true,13,WHT); tx('ATLAS TAWJIH',W/2+TW/4,y+6,'center')
  sf(false,9,mix(cA,0.5)); tx('atlastawjih.maroc@gmail.com',W/2+TW/4,y+13,'center')
  ftr()

  doc.save(`AtlasTawjih_${eleve.prenom}_${eleve.nom}_${code3}.pdf`)
}


export default function Resultats() {
  const navigate = useNavigate()
  const [lang, setLang] = useState('fr')
  const [scores, setScores] = useState(null)
  const [classement, setClassement] = useState([])
  const [eleve, setEleve] = useState(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pdfLang, setPdfLang]     = useState('fr')
  const [showAll, setShowAll] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackDone, setFeedbackDone] = useState(false)

  useEffect(() => {
    const rep = sessionStorage.getItem('reponses_test')
    const el  = sessionStorage.getItem('eleve')
    if (!rep || !el) { navigate('/code'); return }
    const reponses = JSON.parse(rep)
    const eleveData = JSON.parse(el)
    const sc = calculerScores(reponses)
    const cl = getClassement(sc)
    setScores(sc)
    setClassement(cl)
    setEleve(eleveData)
    // Incrémenter le compteur global
    incrementerCompteur()
  }, [])

  const handlePDF = async () => {
    if (!eleve || !scores || !classement.length) {
      console.error('Données manquantes:', { eleve, scores, classement })
      alert('Erreur : données manquantes. Recharge la page.')
      return
    }
    setPdfLoading(true)
    try {
      console.log('Génération PDF...', { eleve, scores, classement, pdfLang })
      await genererPDF(eleve, scores, classement, pdfLang)
      console.log('PDF généré avec succès')
    } catch(e) {
      console.error('Erreur PDF:', e)
      alert('Erreur lors de la génération du PDF : ' + e.message)
    }
    setPdfLoading(false)
  }

  if (!scores || !eleve) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Segoe UI',sans-serif" }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:40, marginBottom:16 }}>⏳</div>
        <div style={{ fontSize:16, color:'#64748B' }}>Calcul de ton profil...</div>
      </div>
    </div>
  )

  const profilDom = PROFILS[classement[0]][lang]
  const code3 = `${classement[0]}${classement[1]}${classement[2]}`

  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFC', fontFamily:"'Segoe UI',sans-serif", display:'flex', flexDirection:'column' }}>

      {/* NAVBAR */}
      <nav style={{ background:'#fff', borderBottom:'1px solid #E2E8F0', padding:'0 24px', height:56, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100, boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width:36, height:36, background:'linear-gradient(135deg,#7C3AED,#5B21B6)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:13, letterSpacing:0.5, boxShadow:'0 2px 8px rgba(124,58,237,0.35)', flexShrink:0 }}>AT</div>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:'#1E293B', lineHeight:1.1 }}>Atlas Tawjih</div>
            <div style={{ fontSize:10, color:'#94A3B8', letterSpacing:1 }}>ORIENTATION</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ display:'flex', gap:2, background:'#F1F5F9', borderRadius:8, padding:3 }}>
            {['fr','en'].map(l => (
              <button key={l} onClick={() => setLang(l)} style={{ padding:'4px 10px', borderRadius:6, border:'none', background:lang===l?'#7C3AED':'transparent', color:lang===l?'#fff':'#64748B', fontSize:12, fontWeight:lang===l?600:400, cursor:'pointer' }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ÉTAPES */}
      <div style={{ background:'#fff', borderBottom:'1px solid #E2E8F0', padding:'10px 24px' }}>
        <div style={{ maxWidth:600, margin:'0 auto', display:'flex', justifyContent:'space-between' }}>
          {[
            { num:1, label:lang==='fr'?'Code':'Code', done:true },
            { num:2, label:lang==='fr'?'Profil':'Profile', done:true },
            { num:3, label:lang==='fr'?'Test':'Test', done:true },
            { num:4, label:lang==='fr'?'Résultats':'Results', active:true },
          ].map(e => (
            <div key={e.num} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
              <div style={{ width:26, height:26, borderRadius:'50%', background:e.done?'#10B981':e.active?'#7C3AED':'#E2E8F0', color:e.done||e.active?'#fff':'#94A3B8', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700 }}>
                {e.done?'✓':e.num}
              </div>
              <span style={{ fontSize:10, color:e.active?'#7C3AED':e.done?'#059669':'#94A3B8', fontWeight:e.active||e.done?600:400 }}>{e.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* HEADER RÉSULTAT */}
      <div style={{ background:'linear-gradient(135deg, #7C3AED, #5B21B6)', padding:'28px 24px', textAlign:'center', color:'#fff' }}>
        <div style={{ fontSize:12, opacity:.8, marginBottom:6 }}>
          {eleve.prenom} {eleve.nom} · {eleve.filiere} · {eleve.ville}
        </div>
        <div style={{ fontSize:16, fontWeight:500, marginBottom:14, opacity:.9 }}>
          {lang==='fr' ? 'Ton profil dominant' : 'Your dominant profile'}
        </div>
        <div style={{ display:'inline-flex', alignItems:'center', gap:14, background:'rgba(255,255,255,0.15)', borderRadius:12, padding:'12px 20px' }}>
          <div style={{ fontSize:44 }}>{profilDom.emoji}</div>
          <div style={{ textAlign:'left' }}>
            <div style={{ fontSize:26, fontWeight:700 }}>{profilDom.nom}</div>
            <div style={{ fontSize:14, opacity:.85 }}>
              {lang==='fr'?'Score :':' Score:'} {scores[classement[0]]}% · Code Holland : {code3}
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex:1, padding:'24px 20px', maxWidth:800, margin:'0 auto', width:'100%' }}>

        {/* ── PROFIL EN DETAIL ── */}
        <div style={{ marginBottom:20 }}>
          <div style={{ background:`linear-gradient(135deg,${DIM_COLORS[classement[0]]},${DIM_COLORS[classement[0]]}CC)`, borderRadius:14, padding:'18px 20px', marginBottom:14 }}>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.75)', fontWeight:600, letterSpacing:1, marginBottom:4 }}>
              {lang==='fr' ? 'PROFIL EN DETAIL' : 'PROFILE IN DETAIL'}
            </div>
            <div style={{ fontSize:15, color:'#fff', lineHeight:1.7 }}>{profilDom.desc}</div>
          </div>

          {/* Tu seras bon dans */}
          {profilDom.bonsEn && (
            <div style={{ background:'#fff', border:`1.5px solid ${DIM_COLORS[classement[0]]}30`, borderRadius:12, padding:'16px 18px', marginBottom:14 }}>
              <div style={{ fontSize:12, fontWeight:700, color:DIM_COLORS[classement[0]], marginBottom:10, display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ width:3, height:14, background:DIM_COLORS[classement[0]], borderRadius:2, display:'inline-block' }}></span>
                {lang==='fr' ? 'Tu seras très bon dans' : 'You will excel in'}
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {profilDom.bonsEn.map((b,i) => (
                  <span key={i} style={{ padding:'5px 14px', background:`${DIM_COLORS[classement[0]]}12`, border:`1px solid ${DIM_COLORS[classement[0]]}30`, borderRadius:20, fontSize:12, fontWeight:500, color:DIM_COLORS[classement[0]] }}>{b}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── SCORES ── */}
        <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:12, padding:'18px', marginBottom:14 }}>
          <div style={{ fontSize:13, fontWeight:700, color:'#1E293B', marginBottom:14, display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ width:3, height:14, background:'#1E293B', borderRadius:2, display:'inline-block' }}></span>
            {lang==='fr' ? 'Tes scores RIASEC' : 'Your RIASEC scores'}
          </div>
          {getClassement(scores).map((dim, rank) => (
            <div key={dim} style={{ marginBottom:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                <span style={{ fontSize:12, fontWeight:600, color:DIM_COLORS[dim], display:'flex', alignItems:'center', gap:5 }}>
                  <span style={{ fontSize:14 }}>{rank===0?'🥇':rank===1?'🥈':rank===2?'🥉':''}</span>
                  {dim} — {PROFILS[dim][lang].nom}
                </span>
                <span style={{ fontSize:12, fontWeight:700, color:DIM_COLORS[dim] }}>{scores[dim]}%</span>
              </div>
              <div style={{ height:8, background:'#F1F5F9', borderRadius:4, overflow:'hidden' }}>
                <div style={{ width:`${scores[dim]}%`, height:'100%', background:DIM_COLORS[dim], borderRadius:4, transition:'width 1s ease' }} />
              </div>
            </div>
          ))}
        </div>

        {/* ── POINTS FORTS ── */}
        <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:12, padding:'18px', marginBottom:14 }}>
          <div style={{ fontSize:13, fontWeight:700, color:'#1E293B', marginBottom:12, display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ width:3, height:14, background:DIM_COLORS[classement[0]], borderRadius:2, display:'inline-block' }}></span>
            {lang==='fr' ? 'Points forts' : 'Key strengths'}
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
            {profilDom.forts.map(([titre,desc],i) => (
              <div key={i} style={{ display:'grid', gridTemplateColumns:'160px 1fr', gap:12, padding:'10px 12px', background:i%2===0?`${DIM_COLORS[classement[0]]}08`:'#fff', borderRadius:8 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ width:3, height:'100%', minHeight:14, background:DIM_COLORS[classement[0]], borderRadius:2, display:'inline-block', flexShrink:0 }}></span>
                  <span style={{ fontSize:12, fontWeight:700, color:DIM_COLORS[classement[0]] }}>{titre}</span>
                </div>
                <span style={{ fontSize:12, color:'#475569', lineHeight:1.6 }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── PLAN A ── */}
        <div style={{ marginBottom:6 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
            <div style={{ background:`linear-gradient(135deg,${DIM_COLORS[classement[0]]},${DIM_COLORS[classement[0]]}99)`, borderRadius:10, padding:'8px 16px', display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:16 }}>🥇</span>
              <div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,0.75)', fontWeight:600, letterSpacing:1 }}>{lang==='fr'?'PLAN A — PRIORITÉ':'PLAN A — PRIORITY'}</div>
                <div style={{ fontSize:13, color:'#fff', fontWeight:700 }}>{classement[0]} — {profilDom.nom} ({scores[classement[0]]}%)</div>
              </div>
            </div>
          </div>

          {/* Domaines Plan A */}
          <div style={{ background:'#fff', border:`1.5px solid ${DIM_COLORS[classement[0]]}25`, borderRadius:12, padding:'16px 18px', marginBottom:10 }}>
            <div style={{ fontSize:12, fontWeight:700, color:DIM_COLORS[classement[0]], marginBottom:10, display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ width:3, height:14, background:DIM_COLORS[classement[0]], borderRadius:2, display:'inline-block' }}></span>
              {lang==='fr' ? "Domaines d'études" : 'Fields of study'}
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
              {profilDom.domaines.map((d,i) => (
                <span key={i} style={{ padding:'5px 12px', background:`${DIM_COLORS[classement[0]]}10`, border:`1px solid ${DIM_COLORS[classement[0]]}25`, borderRadius:20, fontSize:12, color:DIM_COLORS[classement[0]], fontWeight:500 }}>{d}</span>
              ))}
            </div>
          </div>

          {/* Métiers Plan A */}
          <div style={{ background:'#fff', border:`1.5px solid ${DIM_COLORS[classement[0]]}25`, borderRadius:12, padding:'16px 18px' }}>
            <div style={{ fontSize:12, fontWeight:700, color:DIM_COLORS[classement[0]], marginBottom:12, display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ width:3, height:14, background:DIM_COLORS[classement[0]], borderRadius:2, display:'inline-block' }}></span>
              {lang==='fr' ? 'Métiers recommandés' : 'Recommended careers'}
            </div>
            {profilDom.metiers.map(({cat,liste},ci) => (
              <div key={ci} style={{ marginBottom:12 }}>
                <div style={{ fontSize:11, fontWeight:700, color:'#fff', background:DIM_COLORS[classement[0]], padding:'4px 10px', borderRadius:6, display:'inline-block', marginBottom:8 }}>{cat}</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:6 }}>
                  {liste.map(([nom,desc],i) => (
                    <div key={i} style={{ padding:'8px 12px', background:`${DIM_COLORS[classement[0]]}06`, border:`1px solid ${DIM_COLORS[classement[0]]}20`, borderRadius:8 }}>
                      <div style={{ fontSize:12, fontWeight:600, color:DIM_COLORS[classement[0]], marginBottom:3 }}>✓ {nom}</div>
                      <div style={{ fontSize:11, color:'#64748B', lineHeight:1.5 }}>{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SEPARATEUR ── */}
        <div style={{ display:'flex', alignItems:'center', gap:10, margin:'20px 0' }}>
          <div style={{ flex:1, height:1, background:'linear-gradient(90deg,transparent,#E2E8F0)' }} />
          <div style={{ background:'#F1F5F9', border:'1px solid #E2E8F0', borderRadius:20, padding:'5px 14px', fontSize:11, color:'#64748B', fontWeight:600 }}>
            {lang==='fr' ? '↓ Alternative complémentaire ↓' : '↓ Complementary alternative ↓'}
          </div>
          <div style={{ flex:1, height:1, background:'linear-gradient(90deg,#E2E8F0,transparent)' }} />
        </div>

        {/* ── PLAN B ── */}
        {(() => {
          const profB2  = PROFILS[classement[1]][lang]
          const colorB2 = DIM_COLORS[classement[1]]
          return (
            <div style={{ marginBottom:6 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                <div style={{ background:`linear-gradient(135deg,${colorB2},${colorB2}99)`, borderRadius:10, padding:'8px 16px', display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:16 }}>🥈</span>
                  <div>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,0.75)', fontWeight:600, letterSpacing:1 }}>{lang==='fr'?'PLAN B — ALTERNATIVE':'PLAN B — ALTERNATIVE'}</div>
                    <div style={{ fontSize:13, color:'#fff', fontWeight:700 }}>{classement[1]} — {profB2.nom} ({scores[classement[1]]}%)</div>
                  </div>
                </div>
              </div>
              <div style={{ background:'#fff', border:`1.5px solid ${colorB2}25`, borderRadius:12, padding:'16px 18px', marginBottom:10 }}>
                <div style={{ fontSize:12, fontWeight:700, color:colorB2, marginBottom:10, display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ width:3, height:14, background:colorB2, borderRadius:2, display:'inline-block' }}></span>
                  {lang==='fr' ? "Domaines d'études" : 'Fields of study'}
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
                  {profB2.domaines.map((d,i) => (
                    <span key={i} style={{ padding:'5px 12px', background:`${colorB2}10`, border:`1px solid ${colorB2}25`, borderRadius:20, fontSize:12, color:colorB2, fontWeight:500 }}>{d}</span>
                  ))}
                </div>
              </div>
              <div style={{ background:'#fff', border:`1.5px solid ${colorB2}25`, borderRadius:12, padding:'16px 18px' }}>
                <div style={{ fontSize:12, fontWeight:700, color:colorB2, marginBottom:12, display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ width:3, height:14, background:colorB2, borderRadius:2, display:'inline-block' }}></span>
                  {lang==='fr' ? 'Métiers recommandés' : 'Recommended careers'}
                </div>
                {profB2.metiers.map(({cat,liste},ci) => (
                  <div key={ci} style={{ marginBottom:12 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:'#fff', background:colorB2, padding:'4px 10px', borderRadius:6, display:'inline-block', marginBottom:8 }}>{cat}</div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:6 }}>
                      {liste.map(([nom,desc],i) => (
                        <div key={i} style={{ padding:'8px 12px', background:`${colorB2}06`, border:`1px solid ${colorB2}20`, borderRadius:8 }}>
                          <div style={{ fontSize:12, fontWeight:600, color:colorB2, marginBottom:3 }}>✓ {nom}</div>
                          <div style={{ fontSize:11, color:'#64748B', lineHeight:1.5 }}>{desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })()}

        {/* ── ENVIRONNEMENT ── */}
        <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:12, padding:'18px', marginBottom:14, marginTop:20 }}>
          <div style={{ fontSize:13, fontWeight:700, color:'#1E293B', marginBottom:10, display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ width:3, height:14, background:DIM_COLORS[classement[0]], borderRadius:2, display:'inline-block' }}></span>
            {lang==='fr' ? 'Environnement de travail idéal' : 'Ideal work environment'}
          </div>
          <div style={{ fontSize:13, color:'#475569', lineHeight:1.7, background:`${DIM_COLORS[classement[0]]}08`, borderRadius:8, padding:'12px 14px', borderLeft:`3px solid ${DIM_COLORS[classement[0]]}` }}>
            {profilDom.env}
          </div>
          {profilDom.envIdeal && (
            <div style={{ marginTop:10, display:'flex', flexWrap:'wrap', gap:7 }}>
              {profilDom.envIdeal.map((e,i) => (
                <span key={i} style={{ padding:'5px 12px', background:`${DIM_COLORS[classement[0]]}08`, border:`1px solid ${DIM_COLORS[classement[0]]}25`, borderRadius:20, fontSize:11, color:DIM_COLORS[classement[0]] }}>{e}</span>
              ))}
            </div>
          )}
        </div>

        {/* ── A EVITER ── */}
        {profilDom.eviter && (
          <div style={{ background:'#fff', border:'1px solid #FECACA', borderRadius:12, padding:'18px', marginBottom:14 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'#DC2626', marginBottom:12, display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ width:3, height:14, background:'#DC2626', borderRadius:2, display:'inline-block' }}></span>
              {lang==='fr' ? 'À éviter' : 'To avoid'}
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {profilDom.eviter.map(([titre,desc],i) => (
                <div key={i} style={{ padding:'10px 14px', background:'#FEF2F2', borderRadius:8, borderLeft:'3px solid #EF4444' }}>
                  <div style={{ fontSize:12, fontWeight:700, color:'#DC2626', marginBottom:4 }}>✕ {titre}</div>
                  <div style={{ fontSize:12, color:'#7F1D1D', lineHeight:1.6 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── NOTE PARENTS ── */}
        <div style={{ background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:12, padding:'18px', marginBottom:20 }}>
          <div style={{ fontSize:13, fontWeight:700, color:'#92400E', marginBottom:8, display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ width:3, height:14, background:'#D97706', borderRadius:2, display:'inline-block' }}></span>
            {lang==='fr' ? '👨‍👩‍👧 Note pour les parents' : '👨‍👩‍👧 Note for parents'}
          </div>
          <div style={{ fontSize:12, color:'#78350F', lineHeight:1.8 }}>
            {lang==='fr'
              ? `${eleve.prenom} présente un profil ${profilDom.nom} dominant (${scores[classement[0]]}%). Ce rapport est un point de départ, pas un verdict définitif. Les recommandations d'établissements seront communiquées par l'équipe Atlas Tawjih selon sa situation et ses préférences.`
              : `${eleve.prenom} has a dominant ${profilDom.nom} profile (${scores[classement[0]]}%). This report is a starting point, not a final verdict. Institution recommendations will be provided by the Atlas Tawjih team based on their situation and preferences.`}
          </div>
          <div style={{ marginTop:10, fontSize:12, color:'#7C3AED', fontWeight:600 }}>
            📧 atlastawjih.maroc@gmail.com
          </div>
        </div>

        {/* REFAIRE */}
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <button onClick={() => { sessionStorage.clear(); navigate('/') }} style={{ padding:'10px 20px', border:'1.5px solid #E2E8F0', borderRadius:8, background:'#fff', color:'#64748B', fontSize:13, cursor:'pointer' }}>
            {lang==='fr' ? "🔄 Retour à l’accueil" : "🔄 Back to home"}
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background:'#1E293B', padding:'16px 24px', textAlign:'center' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:4 }}>
          <span style={{ color:'#E2E8F0', fontSize:13, fontWeight:600 }}>Atlas Tawjih</span>
          <span style={{ color:'#64748B' }}>·</span>
          <span style={{ color:'#94A3B8', fontSize:13 }}>أطلس توجيه</span>
        </div>
        <div style={{ fontSize:11, color:'#475569' }}>atlastawjih.maroc@gmail.com</div>
      </footer>
    </div>
  )
}
