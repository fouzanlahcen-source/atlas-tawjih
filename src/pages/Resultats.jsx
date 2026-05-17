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
      desc: "Tu es une personne concrète, pratique et manuelle. Tu préfères agir plutôt que de trop réfléchir, et tu t'épanouis dans les activités qui produisent des résultats tangibles. Tu as un sens aigu du concret et tu sais utiliser tes mains et tes outils avec habileté.",
      forts: ['Sens pratique développé', 'Habileté manuelle', 'Autonomie dans le travail', 'Résolution de problèmes concrets', 'Endurance et persévérance', 'Fiabilité et constance'],
      domaines: [
        { nom: 'Génie Civil & BTP', sous: ['Génie civil', 'Architecture', 'Urbanisme', 'Topographie', 'Génie électrique', 'Génie mécanique', 'Génie industriel', 'Géotechnique'] },
        { nom: 'Agriculture & Agronomie', sous: ['Agronomie générale', 'Agriculture biologique', 'Élevage & Zootechnie', 'Horticulture', 'Sylviculture', 'Génie rural', 'Hydraulique agricole'] },
        { nom: 'Mécanique & Électromécanique', sous: ['Mécanique automobile', 'Électromécanique', 'Maintenance industrielle', 'Génie des procédés', 'Robothique', 'Chaudronnerie'] },
        { nom: 'Électricité & Électronique', sous: ['Électrotechnique', 'Électronique industrielle', 'Automatisme', 'Énergies renouvelables', 'Froid & Climatisation'] },
        { nom: 'Géologie & Mines', sous: ['Géologie appliquée', 'Mines & Carrières', 'Pétrochimie', 'Hydrogéologie', 'Géophysique'] },
        { nom: 'Informatique Industrielle', sous: ['Systèmes embarqués', 'Automatique & Contrôle', 'Réseaux industriels', 'SCADA & Instrumentation'] },
        { nom: 'Topographie & Géomatique', sous: ['Topographie', 'SIG & Cartographie', 'Photogrammétrie', 'Cadastre & Foncier'] },
        { nom: 'Transport & Logistique', sous: ['Logistique', 'Transport routier', 'Supply chain', 'Gestion des stocks', 'Commerce international'] },
      ],
      metiers: [
        'Ingénieur civil', 'Ingénieur en génie mécanique', 'Ingénieur électrotechnicien', 'Ingénieur agronome',
        'Technicien en électromécanique', 'Technicien de maintenance industrielle', 'Topographe', 'Géologue',
        'Pilote de ligne', 'Mécanicien aéronautique', 'Conducteur de travaux', 'Chef de chantier',
        'Technicien en énergies renouvelables', 'Dessinateur projeteur', 'Technicien en automatisme',
        'Responsable logistique', 'Ingénieur en géotechnique', 'Technicien en froid et climatisation',
        'Agent technique des eaux et forêts', 'Ingénieur en génie industriel', 'Électricien industriel',
        'Carrossier automobile', 'Soudeur industriel', 'Technicien en instrumentation',
      ],
      env: "Environnement de travail en extérieur ou en atelier, activités concrètes et techniques, peu de travail de bureau, résultats mesurables et visibles.",
    },
    en: {
      nom: 'Realistic', emoji: '🔧',
      desc: "You are a concrete, practical and hands-on person. You prefer acting rather than overthinking, and you thrive in activities that produce tangible results.",
      forts: ['Strong practical sense', 'Manual dexterity', 'Work autonomy', 'Concrete problem solving', 'Endurance and perseverance', 'Reliability and consistency'],
      domaines: [
        { nom: 'Civil Engineering & Construction', sous: ['Civil engineering', 'Architecture', 'Urban planning', 'Surveying', 'Electrical engineering', 'Mechanical engineering'] },
        { nom: 'Agriculture & Agronomy', sous: ['General agronomy', 'Organic farming', 'Livestock & Zootechnics', 'Horticulture', 'Forestry', 'Rural engineering'] },
        { nom: 'Mechanics & Electromechanics', sous: ['Automotive mechanics', 'Electromechanics', 'Industrial maintenance', 'Process engineering', 'Robotics'] },
        { nom: 'Electricity & Electronics', sous: ['Electrical engineering', 'Industrial electronics', 'Automation', 'Renewable energies', 'HVAC'] },
        { nom: 'Geology & Mining', sous: ['Applied geology', 'Mining', 'Petrochemistry', 'Hydrogeology', 'Geophysics'] },
        { nom: 'Industrial Computing', sous: ['Embedded systems', 'Automation & Control', 'Industrial networks', 'SCADA & Instrumentation'] },
        { nom: 'Topography & Geomatics', sous: ['Topography', 'GIS & Cartography', 'Photogrammetry', 'Cadastre'] },
        { nom: 'Transport & Logistics', sous: ['Logistics', 'Road transport', 'Supply chain', 'Stock management', 'International trade'] },
      ],
      metiers: [
        'Civil engineer', 'Mechanical engineer', 'Electrical engineer', 'Agricultural engineer',
        'Electromechanical technician', 'Industrial maintenance technician', 'Surveyor', 'Geologist',
        'Airline pilot', 'Aeronautical mechanic', 'Site manager', 'Construction supervisor',
        'Renewable energy technician', 'Technical draughtsman', 'Automation technician',
        'Logistics manager', 'Geotechnical engineer', 'HVAC technician',
        'Forestry agent', 'Industrial engineer', 'Industrial electrician', 'Auto body technician',
      ],
      env: "Outdoor or workshop environment, concrete and technical activities, minimal desk work, measurable and visible results.",
    },
  },
  I: {
    fr: {
      nom: 'Investigateur', emoji: '🔬',
      desc: "Tu es une personne curieuse, analytique et scientifique. Tu aimes observer, apprendre, enquêter et résoudre des problèmes complexes. Tu préfères réfléchir avant d'agir et tu t'épanouis dans les environnements intellectuellement stimulants.",
      forts: ['Esprit analytique poussé', 'Curiosité intellectuelle', 'Autonomie dans la réflexion', 'Rigueur scientifique', 'Capacité de synthèse', 'Pensée critique développée'],
      domaines: [
        { nom: 'Médecine & Pharmacie', sous: ['Médecine générale', 'Chirurgie', 'Pédiatrie', 'Gynécologie', 'Cardiologie', 'Neurologie', 'Radiologie', 'Pharmacie clinique', 'Médecine dentaire', 'Ophtalmologie', 'Dermatologie', 'Médecine interne'] },
        { nom: 'Informatique & Intelligence Artificielle', sous: ['Génie logiciel', 'Intelligence artificielle', 'Data Science & Big Data', 'Cybersécurité', 'Réseaux & Télécommunications', 'Cloud computing', 'Développement web & mobile', 'Blockchain'] },
        { nom: 'Biologie & Biotechnologie', sous: ['Biologie moléculaire', 'Biochimie', 'Microbiologie', 'Génétique', 'Biologie marine', 'Biotechnologie végétale', 'Immunologie', 'Virologie'] },
        { nom: 'Mathématiques & Physique', sous: ['Mathématiques pures', 'Mathématiques appliquées', 'Physique théorique', 'Physique des matériaux', 'Mécanique quantique', 'Astrophysique', 'Modélisation & Simulation'] },
        { nom: 'Chimie & Génie chimique', sous: ['Chimie organique', 'Chimie analytique', 'Chimie industrielle', 'Génie des procédés chimiques', 'Chimie verte', 'Pétrochimie', 'Chimie pharmaceutique'] },
        { nom: 'Sciences de la Terre & Environnement', sous: ['Écologie', 'Environnement & Développement durable', 'Météorologie', 'Océanographie', 'Géographie physique', 'Climatologie'] },
        { nom: 'Statistiques & Data Science', sous: ['Statistiques appliquées', 'Actuariat', 'Biostatistiques', 'Machine learning', 'Analyse quantitative', 'Économétrie'] },
        { nom: 'Recherche & Développement', sous: ['Recherche fondamentale', 'Recherche appliquée', 'Innovation technologique', 'Propriété intellectuelle', 'Veille scientifique'] },
      ],
      metiers: [
        'Médecin généraliste', 'Médecin spécialiste (cardiologue, neurologue...)', 'Pharmacien', 'Chirurgien-dentiste',
        'Data Scientist', 'Ingénieur en intelligence artificielle', 'Chercheur scientifique', 'Biologiste',
        'Ingénieur informatique', 'Mathématicien', 'Physicien', 'Chimiste', 'Biochimiste',
        'Ingénieur en cybersécurité', 'Développeur full-stack', 'Ingénieur en télécommunications',
        'Actuaire', 'Statisticien', 'Épidémiologiste', 'Ingénieur en génie chimique',
        'Environnementaliste', 'Vétérinaire', 'Ingénieur en biotechnologie', 'Ingénieur en IA',
      ],
      env: "Environnement intellectuellement stimulant, travail en autonomie, accès aux ressources scientifiques, équipe de pairs compétents, liberté de recherche.",
    },
    en: {
      nom: 'Investigative', emoji: '🔬',
      desc: "You are a curious, analytical and scientific person. You love to observe, learn, investigate and solve complex problems.",
      forts: ['Strong analytical mind', 'Intellectual curiosity', 'Independent thinking', 'Scientific rigor', 'Synthesis ability', 'Developed critical thinking'],
      domaines: [
        { nom: 'Medicine & Pharmacy', sous: ['General medicine', 'Surgery', 'Pediatrics', 'Gynecology', 'Cardiology', 'Neurology', 'Radiology', 'Clinical pharmacy', 'Dentistry', 'Ophthalmology'] },
        { nom: 'Computer Science & AI', sous: ['Software engineering', 'Artificial intelligence', 'Data Science & Big Data', 'Cybersecurity', 'Networks & Telecom', 'Cloud computing', 'Web & Mobile dev', 'Blockchain'] },
        { nom: 'Biology & Biotechnology', sous: ['Molecular biology', 'Biochemistry', 'Microbiology', 'Genetics', 'Marine biology', 'Plant biotechnology', 'Immunology', 'Virology'] },
        { nom: 'Mathematics & Physics', sous: ['Pure mathematics', 'Applied mathematics', 'Theoretical physics', 'Materials physics', 'Quantum mechanics', 'Astrophysics', 'Modeling & Simulation'] },
        { nom: 'Chemistry & Chemical Engineering', sous: ['Organic chemistry', 'Analytical chemistry', 'Industrial chemistry', 'Chemical process engineering', 'Green chemistry', 'Pharmaceutical chemistry'] },
        { nom: 'Earth Sciences & Environment', sous: ['Ecology', 'Environment & Sustainability', 'Meteorology', 'Oceanography', 'Physical geography', 'Climatology'] },
        { nom: 'Statistics & Data Science', sous: ['Applied statistics', 'Actuarial science', 'Biostatistics', 'Machine learning', 'Quantitative analysis', 'Econometrics'] },
        { nom: 'Research & Development', sous: ['Fundamental research', 'Applied research', 'Technological innovation', 'Intellectual property', 'Scientific monitoring'] },
      ],
      metiers: [
        'General practitioner', 'Medical specialist (cardiologist, neurologist...)', 'Pharmacist', 'Dentist',
        'Data Scientist', 'AI engineer', 'Scientific researcher', 'Biologist',
        'Software engineer', 'Mathematician', 'Physicist', 'Chemist', 'Biochemist',
        'Cybersecurity engineer', 'Full-stack developer', 'Telecommunications engineer',
        'Actuary', 'Statistician', 'Epidemiologist', 'Chemical engineer',
        'Environmental scientist', 'Veterinarian', 'Biotechnology engineer',
      ],
      env: "Intellectually stimulating environment, autonomous work, access to scientific resources, team of competent peers, freedom of research.",
    },
  },
  A: {
    fr: {
      nom: 'Artistique', emoji: '🎨',
      desc: "Tu es une personne créative, expressive et imaginative. Tu aimes créer, imaginer, t'exprimer à travers différents médias. Tu penses souvent de façon originale et tu as une sensibilité particulière à l'esthétique et à la beauté.",
      forts: ['Créativité et originalité', 'Sensibilité artistique', 'Expression personnelle forte', "Capacité d'adaptation", 'Vision esthétique développée', 'Ouverture aux nouvelles idées'],
      domaines: [
        { nom: 'Architecture & Design', sous: ['Architecture', 'Design industriel', 'Design graphique', 'Design intérieur', 'Design de mode', 'UX/UI Design', 'Design de produit', 'Architecture paysagère'] },
        { nom: 'Arts Plastiques & Beaux-Arts', sous: ['Peinture', 'Sculpture', 'Gravure', 'Art numérique', 'Illustration', 'Arts appliqués', 'Bande dessinée', 'Art contemporain'] },
        { nom: 'Cinéma & Audiovisuel', sous: ['Réalisation', 'Scénario', 'Montage vidéo', 'Direction artistique', 'Photographie', 'Animation 3D', 'Production audiovisuelle', 'Son & Bruitage'] },
        { nom: 'Journalisme & Communication', sous: ['Journalisme de presse', 'Journalisme TV & radio', 'Communication digitale', 'Relations publiques', 'Publicité & Création', 'Rédaction web', 'Community management'] },
        { nom: 'Littérature & Langues', sous: ['Littérature arabe', 'Littérature française', 'Littérature anglaise', 'Linguistique', 'Traduction & Interprétation', 'Philologie', 'Écriture créative'] },
        { nom: 'Musique & Arts du Spectacle', sous: ['Musique classique', 'Musique moderne', 'Théâtre', 'Danse', 'Arts du cirque', 'Mise en scène', 'Chant', 'Production musicale'] },
        { nom: 'Mode & Textile', sous: ['Stylisme', 'Couture', 'Modélisme', 'Textile & Habillement', 'Merchandising mode', 'Accessoires de mode'] },
        { nom: 'Artisanat & Patrimoine', sous: ['Artisanat traditionnel marocain', 'Calligraphie arabe', 'Zellige & Mosaïque', 'Poterie', 'Tapis & Tissage', 'Restauration du patrimoine'] },
      ],
      metiers: [
        'Architecte', 'Designer graphique', 'Designer UX/UI', 'Illustrateur', 'Journaliste',
        'Réalisateur', 'Scénariste', 'Photographe', 'Directeur artistique', 'Rédacteur web',
        'Traducteur-interprète', 'Écrivain', 'Community manager', 'Animateur 3D',
        'Décorateur intérieur', 'Styliste de mode', 'Musicien', 'Comédien',
        'Chef de publicité', 'Chargé de communication', 'Monteur vidéo', 'Graphiste',
        'Artisan d\'art', 'Calligraphe', 'Directeur de création',
      ],
      env: "Environnement créatif et flexible, liberté d'expression, peu de contraintes rigides, travail sur des projets variés et stimulants.",
    },
    en: {
      nom: 'Artistic', emoji: '🎨',
      desc: "You are a creative, expressive and imaginative person. You love to create, imagine, and express yourself through different media.",
      forts: ['Creativity and originality', 'Artistic sensitivity', 'Strong personal expression', 'Adaptability', 'Developed aesthetic vision', 'Openness to new ideas'],
      domaines: [
        { nom: 'Architecture & Design', sous: ['Architecture', 'Industrial design', 'Graphic design', 'Interior design', 'Fashion design', 'UX/UI Design', 'Product design', 'Landscape architecture'] },
        { nom: 'Fine Arts & Visual Arts', sous: ['Painting', 'Sculpture', 'Engraving', 'Digital art', 'Illustration', 'Applied arts', 'Comics', 'Contemporary art'] },
        { nom: 'Cinema & Audiovisual', sous: ['Film directing', 'Screenwriting', 'Video editing', 'Art direction', 'Photography', '3D animation', 'Production', 'Sound design'] },
        { nom: 'Journalism & Communication', sous: ['Print journalism', 'TV & radio journalism', 'Digital communication', 'Public relations', 'Advertising', 'Copywriting', 'Community management'] },
        { nom: 'Literature & Languages', sous: ['Arabic literature', 'French literature', 'English literature', 'Linguistics', 'Translation & Interpretation', 'Philology', 'Creative writing'] },
        { nom: 'Music & Performing Arts', sous: ['Classical music', 'Modern music', 'Theater', 'Dance', 'Circus arts', 'Stage direction', 'Singing', 'Music production'] },
        { nom: 'Fashion & Textile', sous: ['Styling', 'Couture', 'Pattern making', 'Textile & Clothing', 'Fashion merchandising', 'Fashion accessories'] },
        { nom: 'Crafts & Heritage', sous: ['Traditional Moroccan crafts', 'Arabic calligraphy', 'Zellige & Mosaic', 'Pottery', 'Carpet weaving', 'Heritage restoration'] },
      ],
      metiers: [
        'Architect', 'Graphic designer', 'UX/UI designer', 'Illustrator', 'Journalist',
        'Film director', 'Screenwriter', 'Photographer', 'Art director', 'Copywriter',
        'Translator-interpreter', 'Writer', 'Community manager', '3D animator',
        'Interior decorator', 'Fashion stylist', 'Musician', 'Actor',
        'Advertising manager', 'Communication officer', 'Video editor', 'Graphic artist',
        'Craftsman', 'Calligrapher', 'Creative director',
      ],
      env: "Creative and flexible environment, freedom of expression, few rigid constraints, work on varied and stimulating projects.",
    },
  },
  S: {
    fr: {
      nom: 'Social', emoji: '🤝',
      desc: "Tu es une personne empathique, coopérative et communicative. Tu aimes aider, enseigner, conseiller et interagir avec les autres. Tu as un sens naturel du service et tu t'épanouis dans les relations humaines.",
      forts: ["Empathie et écoute active", "Sens de la communication", "Esprit de coopération", "Patience et bienveillance", "Capacité à motiver", "Leadership naturel bienveillant"],
      domaines: [
        { nom: 'Médecine & Soins de Santé', sous: ['Médecine générale', 'Infirmerie', 'Soins infirmiers spécialisés', 'Sage-femme', 'Kinésithérapie', 'Ergothérapie', 'Orthophonie', 'Psychomotricité'] },
        { nom: 'Éducation & Enseignement', sous: ['Enseignement primaire', 'Enseignement collégial', 'Enseignement lycéen', 'Enseignement supérieur', 'Formation professionnelle', 'Éducation spécialisée', 'Pédagogie & Didactique', 'Orthopédagogie'] },
        { nom: 'Psychologie & Santé mentale', sous: ['Psychologie clinique', 'Psychologie scolaire', 'Psychologie du travail', 'Psychothérapie', 'Neuropsychologie', 'Psychiatrie', 'Addictologie'] },
        { nom: 'Travail Social & Humanitaire', sous: ['Travail social', 'Animation socioculturelle', 'ONG & Associations', 'Aide humanitaire', 'Développement communautaire', 'Protection de l\'enfance', 'Insertion professionnelle'] },
        { nom: 'Droit & Justice', sous: ['Droit civil', 'Droit pénal', 'Droit de la famille', 'Droit administratif', 'Notariat', 'Magistrature', 'Avocature'] },
        { nom: 'Ressources Humaines & Management', sous: ['Recrutement', 'Formation & Développement RH', 'Relations sociales', 'Paie & Administration RH', 'GPEC', 'Coaching professionnel'] },
        { nom: 'Tourisme & Hôtellerie', sous: ['Hôtellerie', 'Restauration', 'Guide touristique', 'Tour opérateur', 'Agence de voyages', 'Accueil & Réception'] },
        { nom: 'Sport & Animation', sous: ['Éducation physique', 'Coaching sportif', 'Animation jeunesse', 'Management sportif', 'Kinésithérapie sportive', 'Psychologie du sport'] },
      ],
      metiers: [
        'Enseignant (primaire / collège / lycée)', 'Professeur universitaire', 'Conseiller d\'orientation',
        'Psychologue clinicien', 'Infirmier(ère)', 'Sage-femme', 'Kinésithérapeute',
        'Médecin généraliste', 'Assistante sociale', 'Éducateur spécialisé',
        'Responsable RH', 'Chargé de formation', 'Coach professionnel',
        'Animateur socioculturel', 'Guide touristique', 'Responsable hôtelier',
        'Avocat', 'Notaire', 'Magistrat', 'Médiateur social',
        'Chargé de mission ONG', 'Directeur d\'école', 'Orthophoniste',
        'Conseiller en insertion professionnelle', 'Responsable accueil',
      ],
      env: "Environnement humain et chaleureux, travail en équipe, contact permanent avec les gens, impact social visible et gratifiant.",
    },
    en: {
      nom: 'Social', emoji: '🤝',
      desc: "You are an empathetic, cooperative and communicative person. You love to help, teach, advise and interact with others.",
      forts: ['Empathy and active listening', 'Communication skills', 'Cooperative spirit', 'Patience and kindness', 'Motivating ability', 'Benevolent natural leadership'],
      domaines: [
        { nom: 'Medicine & Healthcare', sous: ['General medicine', 'Nursing', 'Specialized nursing', 'Midwifery', 'Physiotherapy', 'Occupational therapy', 'Speech therapy'] },
        { nom: 'Education & Teaching', sous: ['Primary education', 'Secondary education', 'Higher education', 'Vocational training', 'Special education', 'Pedagogy & Didactics'] },
        { nom: 'Psychology & Mental Health', sous: ['Clinical psychology', 'School psychology', 'Work psychology', 'Psychotherapy', 'Neuropsychology', 'Psychiatry', 'Addiction'] },
        { nom: 'Social Work & Humanitarian', sous: ['Social work', 'Sociocultural activities', 'NGOs & Associations', 'Humanitarian aid', 'Community development', 'Child protection'] },
        { nom: 'Law & Justice', sous: ['Civil law', 'Criminal law', 'Family law', 'Administrative law', 'Notary', 'Magistracy', 'Advocacy'] },
        { nom: 'Human Resources & Management', sous: ['Recruitment', 'Training & HR development', 'Labor relations', 'Payroll & HR admin', 'Professional coaching'] },
        { nom: 'Tourism & Hospitality', sous: ['Hotel management', 'Catering', 'Tour guide', 'Tour operator', 'Travel agency', 'Reception & Welcome'] },
        { nom: 'Sports & Animation', sous: ['Physical education', 'Sports coaching', 'Youth activities', 'Sports management', 'Sports physiotherapy'] },
      ],
      metiers: [
        'Teacher (primary / secondary)', 'University professor', 'Career counselor',
        'Clinical psychologist', 'Nurse', 'Midwife', 'Physiotherapist',
        'General practitioner', 'Social worker', 'Special education teacher',
        'HR manager', 'Training officer', 'Professional coach',
        'Sociocultural animator', 'Tour guide', 'Hotel manager',
        'Lawyer', 'Notary', 'Magistrate', 'Social mediator',
        'NGO project officer', 'School principal', 'Speech therapist',
        'Professional integration counselor', 'Reception manager',
      ],
      env: "Human and warm environment, teamwork, permanent contact with people, visible and rewarding social impact.",
    },
  },
  E: {
    fr: {
      nom: 'Entreprenant', emoji: '🚀',
      desc: "Tu es une personne ambitieuse, persuasive et dynamique. Tu aimes diriger, convaincre, initier des projets et prendre des risques calculés. Tu as un fort sens du leadership et tu t'épanouis dans les environnements compétitifs.",
      forts: ['Leadership naturel', 'Sens de la persuasion', 'Initiative et audace', 'Vision stratégique', 'Énergie et enthousiasme', 'Capacité à convaincre'],
      domaines: [
        { nom: 'Commerce & Marketing', sous: ['Marketing digital', 'Commerce international', 'E-commerce', 'Merchandising', 'Vente & Négociation', 'Marketing stratégique', 'Brand management', 'Trade marketing'] },
        { nom: 'Management & Gestion', sous: ['Management général', 'Gestion de projet', 'Management de la qualité', 'Supply chain management', 'Management stratégique', 'Lean management', 'Gestion du changement'] },
        { nom: 'Finance & Banque', sous: ['Finance d\'entreprise', 'Banque de détail', 'Banque d\'affaires', 'Marchés financiers', 'Assurance', 'Finance islamique', 'Microfinance', 'Audit financier'] },
        { nom: 'Droit des Affaires & Juridique', sous: ['Droit commercial', 'Droit des sociétés', 'Droit fiscal', 'Droit de la propriété intellectuelle', 'Droit du travail', 'Arbitrage & Médiation'] },
        { nom: 'Entrepreneuriat & Innovation', sous: ['Création d\'entreprise', 'Start-up & Innovation', 'Management de l\'innovation', 'Incubateur & Accélérateur', 'Franchise & Licence', 'Business development'] },
        { nom: 'Communication & Relations publiques', sous: ['Relations publiques', 'Communication corporate', 'Événementiel', 'Lobbying', 'Presse & Médias', 'Communication de crise'] },
        { nom: 'Immobilier & Promotion', sous: ['Promotion immobilière', 'Gestion de patrimoine', 'Transaction immobilière', 'Expertise immobilière', 'Property management'] },
        { nom: 'Administration & Politique', sous: ['Administration publique', 'Sciences politiques', 'Diplomatie', 'Management public', 'Concours administratifs', 'Collectivités territoriales'] },
      ],
      metiers: [
        "Chef d'entreprise / Entrepreneur", 'Directeur commercial', 'Responsable marketing digital',
        'Manager de projet', 'Directeur financier (DAF)', 'Banquier d\'affaires',
        "Avocat d'affaires", 'Consultant en stratégie', 'Directeur général',
        'Chargé de développement commercial', 'Responsable export', 'Agent immobilier',
        'Directeur de communication', 'Attaché de presse', 'Chargé de relations publiques',
        'Responsable de formation', 'Directeur des achats', 'Chef de produit marketing',
        'Auditeur', 'Analyste financier', 'Trader', 'Gestionnaire de portefeuille',
        'Haut fonctionnaire', 'Diplomate', 'Chargé de mission',
      ],
      env: "Environnement compétitif et stimulant, liberté de prendre des décisions, travail sur des objectifs ambitieux, contacts nombreux et variés.",
    },
    en: {
      nom: 'Enterprising', emoji: '🚀',
      desc: "You are an ambitious, persuasive and dynamic person. You love to lead, convince, initiate projects and take calculated risks.",
      forts: ['Natural leadership', 'Persuasion skills', 'Initiative and boldness', 'Strategic vision', 'Energy and enthusiasm', 'Convincing ability'],
      domaines: [
        { nom: 'Business & Marketing', sous: ['Digital marketing', 'International trade', 'E-commerce', 'Merchandising', 'Sales & Negotiation', 'Strategic marketing', 'Brand management'] },
        { nom: 'Management', sous: ['General management', 'Project management', 'Quality management', 'Supply chain management', 'Strategic management', 'Lean management'] },
        { nom: 'Finance & Banking', sous: ['Corporate finance', 'Retail banking', 'Investment banking', 'Financial markets', 'Insurance', 'Islamic finance', 'Microfinance', 'Financial audit'] },
        { nom: 'Business & Legal Law', sous: ['Commercial law', 'Corporate law', 'Tax law', 'Intellectual property law', 'Labor law', 'Arbitration & Mediation'] },
        { nom: 'Entrepreneurship & Innovation', sous: ['Business creation', 'Startups & Innovation', 'Innovation management', 'Incubator & Accelerator', 'Franchise & License', 'Business development'] },
        { nom: 'Communication & PR', sous: ['Public relations', 'Corporate communication', 'Events', 'Lobbying', 'Press & Media', 'Crisis communication'] },
        { nom: 'Real Estate & Development', sous: ['Real estate development', 'Wealth management', 'Real estate transactions', 'Property valuation', 'Property management'] },
        { nom: 'Administration & Politics', sous: ['Public administration', 'Political science', 'Diplomacy', 'Public management', 'Administrative exams', 'Local government'] },
      ],
      metiers: [
        'Business owner / Entrepreneur', 'Sales director', 'Digital marketing manager',
        'Project manager', 'Chief Financial Officer (CFO)', 'Investment banker',
        'Business lawyer', 'Strategy consultant', 'Chief Executive Officer (CEO)',
        'Business development manager', 'Export manager', 'Real estate agent',
        'Communication director', 'Press attaché', 'PR manager',
        'Training manager', 'Purchasing director', 'Product marketing manager',
        'Auditor', 'Financial analyst', 'Trader', 'Portfolio manager',
        'Senior civil servant', 'Diplomat', 'Project officer',
      ],
      env: "Competitive and stimulating environment, freedom to make decisions, work on ambitious goals, numerous and varied contacts.",
    },
  },
  C: {
    fr: {
      nom: 'Conventionnel', emoji: '📊',
      desc: "Tu es une personne organisée, précise et méthodique. Tu aimes les tâches structurées, les données chiffrées et les procédures claires. Tu t'épanouis dans les environnements ordonnés où les règles et les processus sont bien définis.",
      forts: ['Organisation et rigueur', 'Précision et exactitude', 'Sens du détail', 'Fiabilité et constance', 'Maîtrise des procédures', 'Capacité à gérer les données'],
      domaines: [
        { nom: 'Comptabilité & Audit', sous: ['Comptabilité générale', 'Comptabilité analytique', 'Audit interne', 'Audit externe', 'Contrôle de gestion', 'Comptabilité publique', 'Expertise comptable', 'Commissariat aux comptes'] },
        { nom: 'Administration & Secrétariat', sous: ['Administration des affaires', 'Secrétariat de direction', 'Gestion administrative', 'Office management', 'Archivage & Documentation', 'Administration publique'] },
        { nom: 'Informatique de Gestion & ERP', sous: ['Systèmes d\'information', 'ERP & SAP', 'Gestion de bases de données', 'Business intelligence', 'Développement d\'applications de gestion', 'Sécurité des SI'] },
        { nom: 'Banque, Assurance & Finance', sous: ['Gestion de trésorerie', 'Gestion des risques', 'Compliance & Contrôle interne', 'Banque islamique', 'Assurance vie', 'Assurance dommages', 'Réassurance'] },
        { nom: 'Statistiques & Actuariat', sous: ['Statistiques appliquées', 'Actuariat vie', 'Actuariat non-vie', 'Modélisation stochastique', 'Data analytics', 'Biostatistiques'] },
        { nom: 'Logistique & Supply Chain', sous: ['Gestion des stocks', 'Transport & Distribution', 'Achats & Approvisionnement', 'Planification de la production', 'Douane & Commerce international', 'Entrepôt & Préparation de commandes'] },
        { nom: 'Droit & Notariat', sous: ['Droit civil', 'Droit notarial', 'Droit fiscal', 'Droit des successions', 'Droit foncier', 'Huissariat'] },
        { nom: 'Qualité, Hygiène, Sécurité & Environnement (QHSE)', sous: ['Management de la qualité (ISO)', 'Hygiène et sécurité au travail', 'Audit qualité', 'Normalisation', 'Environnement & RSE'] },
      ],
      metiers: [
        'Comptable', 'Expert-comptable', 'Auditeur interne / externe', 'Contrôleur de gestion',
        'Gestionnaire de paie', 'Responsable administratif et financier (RAF)',
        'Secrétaire de direction', 'Assistant de gestion', 'Archiviste',
        'Responsable logistique', 'Gestionnaire des stocks', 'Agent douanier',
        'Actuaire', 'Statisticien', 'Data analyst', 'Responsable SI',
        'Notaire', 'Huissier de justice', 'Fiscaliste',
        'Responsable qualité (QHSE)', 'Auditeur qualité', 'Responsable compliance',
        'Gestionnaire de trésorerie', 'Analyste risques', 'Gestionnaire back-office',
      ],
      env: "Environnement stable et structuré, tâches bien définies, procédures claires, peu de surprises, valorisation de la précision et de l'exactitude.",
    },
    en: {
      nom: 'Conventional', emoji: '📊',
      desc: "You are an organized, precise and methodical person. You like structured tasks, numerical data and clear procedures.",
      forts: ['Organization and rigor', 'Precision and accuracy', 'Attention to detail', 'Reliability and consistency', 'Process mastery', 'Data management ability'],
      domaines: [
        { nom: 'Accounting & Audit', sous: ['General accounting', 'Management accounting', 'Internal audit', 'External audit', 'Management control', 'Public accounting', 'Chartered accountancy'] },
        { nom: 'Administration & Secretariat', sous: ['Business administration', 'Executive secretariat', 'Administrative management', 'Office management', 'Archiving & Documentation'] },
        { nom: 'Management IT & ERP', sous: ['Information systems', 'ERP & SAP', 'Database management', 'Business intelligence', 'Management application development', 'IT security'] },
        { nom: 'Banking, Insurance & Finance', sous: ['Cash management', 'Risk management', 'Compliance & Internal control', 'Islamic banking', 'Life insurance', 'Property insurance', 'Reinsurance'] },
        { nom: 'Statistics & Actuarial Science', sous: ['Applied statistics', 'Life actuarial', 'Non-life actuarial', 'Stochastic modeling', 'Data analytics', 'Biostatistics'] },
        { nom: 'Logistics & Supply Chain', sous: ['Inventory management', 'Transport & Distribution', 'Purchasing & Procurement', 'Production planning', 'Customs & International trade', 'Warehouse management'] },
        { nom: 'Law & Notary', sous: ['Civil law', 'Notarial law', 'Tax law', 'Inheritance law', 'Land law', 'Enforcement officer'] },
        { nom: 'Quality, Health, Safety & Environment (QHSE)', sous: ['Quality management (ISO)', 'Occupational health & safety', 'Quality audit', 'Standardization', 'Environment & CSR'] },
      ],
      metiers: [
        'Accountant', 'Chartered accountant', 'Internal / External auditor', 'Management controller',
        'Payroll manager', 'Chief Administrative and Financial Officer',
        'Executive secretary', 'Management assistant', 'Archivist',
        'Logistics manager', 'Stock manager', 'Customs agent',
        'Actuary', 'Statistician', 'Data analyst', 'IT manager',
        'Notary', 'Enforcement officer', 'Tax specialist',
        'Quality manager (QHSE)', 'Quality auditor', 'Compliance manager',
        'Treasury manager', 'Risk analyst', 'Back-office manager',
      ],
      env: "Stable and structured environment, well-defined tasks, clear procedures, few surprises, appreciation of precision and accuracy.",
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
  const DRK = [30,41,59], GRY = [71,85,105], LGT = [148,163,184], WHT = [255,255,255]
  const RED = [239,68,68], AMB = [217,119,6]

  const clp = v => Math.min(255, Math.max(0, Math.round(v)))
  const mix = (c, w) => c.map(v => clp(v*(1-w)+255*w))
  const drk = (c, w) => c.map(v => clp(v*(1-w)))

  const sf = (bold, size, col) => {
    doc.setFont('helvetica', bold?'bold':'normal')
    doc.setFontSize(size)
    doc.setTextColor(col[0], col[1], col[2])
  }
  const fl = col => doc.setFillColor(col[0], col[1], col[2])
  const dr = col => doc.setDrawColor(col[0], col[1], col[2])
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
    return y+ls.length*(lh||5.5)
  }

  let curPage=1, y=0

  const logoBar = () => {
    bx(0,0,W,12,0,DRK)
    sf(true,11,WHT); tx('ATLAS TAWJIH',ML,8)
    sf(false,8,LGT); tx(`${eleve.prenom} ${eleve.nom}  |  Code Holland : ${code3}`,W-MR,8,'right')
  }
  const newPage = () => {
    doc.addPage(); bx(0,0,W,H,0,WHT); logoBar(); curPage++; y=18
  }
  const chk = n => { if(y+n>H-13) newPage() }
  const ftr = () => {
    bx(0,H-10,W,10,0,DRK); sf(false,8,LGT)
    tx('Atlas Tawjih  |  atlastawjih.maroc@gmail.com',ML,H-4)
    tx(`${curPage}`,W-MR,H-4,'right')
  }
  const sec = (label,col) => {
    chk(14); bx(ML,y,TW,9,2,col)
    sf(true,12,WHT); tx(label,ML+6,y+6.3)
    y+=13
  }
  const sub = (label,col) => {
    chk(10); sf(true,11,col); tx(label,ML,y)
    dr(col); doc.setLineWidth(0.5); doc.line(ML,y+1.8,W-MR,y+1.8); y+=8
  }
  const tblk = (s,col) => {
    const c=cl(s), ls=doc.splitTextToSize(c,TW-9)
    const h=ls.length*5.8+10; chk(h+4)
    bx(ML,y,TW,h,2,mix(col,0.93))
    fl(col); doc.rect(ML,y,3,h,'F')
    sf(false,10,DRK); doc.text(ls,ML+7,y+7); y+=h+6
  }
  const hbar = (x,yy,w,h,pct,col) => {
    bx(x,yy,w,h,2,[226,232,240]); bx(x,yy,Math.max(1,w*pct/100),h,2,col)
  }

  // ── All labels (backticks = apostrophes safe) ──────────
  const L = {
    rapport:    lang==='fr' ? `Rapport d'Orientation RIASEC` : `RIASEC Orientation Report`,
    profDom:    lang==='fr' ? `Profil dominant` : `Dominant profile`,
    scores:     lang==='fr' ? `Scores RIASEC` : `RIASEC Scores`,
    ptsForts:   lang==='fr' ? `Points forts` : `Key strengths`,
    profDetail: lang==='fr' ? `Profil en detail` : `Profile in detail`,
    plansT:     lang==='fr' ? `Plans d'orientation - A, B et C` : `Orientation Plans - A, B and C`,
    domaines:   lang==='fr' ? `Domaines et specialites` : `Fields and specialties`,
    envT:       lang==='fr' ? `Environnement et Conseils` : `Environment and Advice`,
    envIdeal:   lang==='fr' ? `Environnement de travail ideal` : `Ideal work environment`,
    aEviter:    lang==='fr' ? `A eviter` : `To avoid`,
    message:    lang==='fr' ? `Message personnel` : `Personal message`,
    parents:    lang==='fr' ? `Note pour les parents` : `Note for parents`,
    recap:      lang==='fr' ? `Recapitulatif` : `Summary`,
    infoEleve:  lang==='fr' ? `Informations de l'eleve` : `Student information`,
    scores6:    lang==='fr' ? `Tes 6 scores RIASEC` : `Your 6 RIASEC scores`,
    apropos:    `Atlas Tawjih`,
    nom:        lang==='fr' ? `Nom` : `Name`,
    filiere:    lang==='fr' ? `Filiere` : `Field`,
    ville:      `Ville`,
    mobilite:   lang==='fr' ? `Mobilite` : `Mobility`,
    prive:      lang==='fr' ? `Prive` : `Private`,
    dateTest:   lang==='fr' ? `Date` : `Date`,
    holland:    `Code Holland`,
    mobOui:     lang==='fr' ? `Oui - toute ville` : `Yes - any city`,
    mobNon:     lang==='fr' ? `Non - ma ville` : `No - home city`,
    mobPart:    lang==='fr' ? `Oui - certaines villes` : `Yes - certain cities`,
    priveOui:   lang==='fr' ? `Oui` : `Yes`,
    priveNon:   lang==='fr' ? `Non` : `No`,
    motiv: lang==='fr'
      ? `${eleve.prenom}, ce rapport est un point de depart, pas un verdict definitif. Ton profil ${profA.nom} est un veritable atout. Fais confiance a tes forces et construis ton avenir avec passion et determination !`
      : `${eleve.prenom}, this report is a starting point, not a final verdict. Your ${profA.nom} profile is a real asset. Trust your strengths and build your future with passion!`,
    parentText: lang==='fr'
      ? `Chers parents,\n\nVotre enfant ${eleve.prenom} a un profil ${profA.nom} dominant (${scores[classement[0]]}%). Ce resultat est une base de reflexion, pas un verdict definitif. Ce rapport ouvre des pistes, il ne ferme pas de portes.\n\nNous vous recommandons d'explorer ensemble les domaines compatibles. Les recommandations d'etablissements seront communiquees par l'equipe Atlas Tawjih selon la situation, la mobilite et les preferences de votre enfant.`
      : `Dear parents,\n\nYour child ${eleve.prenom} has a dominant ${profA.nom} profile (${scores[classement[0]]}%). This result is a basis for reflection, not a final verdict. This report opens paths, it does not close doors.\n\nWe recommend exploring compatible fields together. Institution recommendations will be provided by the Atlas Tawjih team.`,
    aboutText: lang==='fr'
      ? `Atlas Tawjih est une plateforme d'orientation dediee aux bacheliers marocains. Notre mission : aider chaque eleve a decouvrir son profil et s'orienter vers la filiere qui lui correspond. Nous gerons les candidatures aux ecoles et bourses avec un suivi national jusqu'a la fin du parcours.`
      : `Atlas Tawjih is an orientation platform for Moroccan students. We help every student find their path and handle applications to schools and scholarships with full national follow-up.`,
  }

  // Points forts avec description
  const fortsDesc = {
    fr: {
      R: [
        [`Sens pratique`,`Tu preferes agir concretement plutot que de rester dans la theorie.`],
        [`Habilete manuelle`,`Tu travailles facilement avec tes mains et les outils.`],
        [`Autonomie`,`Tu avances seul sur les taches sans avoir besoin d'aide constante.`],
        [`Resolution de problemes`,`Tu trouves des solutions concretes aux problemes du quotidien.`],
        [`Endurance`,`Tu maintiens ton effort dans le temps, meme sur des taches difficiles.`],
        [`Fiabilite`,`Les autres peuvent compter sur toi, tu tiens tes engagements.`],
      ],
      I: [
        [`Esprit analytique`,`Tu decompose les problemes complexes pour mieux les comprendre.`],
        [`Curiosite intellectuelle`,`Tu aimes apprendre et decouvrir de nouvelles connaissances.`],
        [`Rigueur scientifique`,`Tu verifie tes hypotheses et tu travailles avec precision.`],
        [`Capacite de synthese`,`Tu resumes l'essentiel rapidement a partir d'informations complexes.`],
        [`Pensee critique`,`Tu questionnes les idees recues avant d'accepter une conclusion.`],
        [`Autonomie intellectuelle`,`Tu peux travailler seul sur des sujets complexes sans aide.`],
      ],
      A: [
        [`Creativite`,`Tu imagines des solutions et des idees originales que les autres n'ont pas.`],
        [`Sensibilite artistique`,`Tu percois la beaute et l'esthetique avec un regard particulier.`],
        [`Expression personnelle`,`Tu sais exprimer tes emotions et idees a travers differents medias.`],
        [`Adaptation`,`Tu t'ajustes facilement aux nouvelles situations et aux changements.`],
        [`Vision esthetique`,`Tu as un sens developpe du beau et de l'harmonie visuelle.`],
        [`Ouverture`,`Tu acceptes facilement les nouvelles idees et les points de vue differents.`],
      ],
      S: [
        [`Empathie`,`Tu comprends facilement ce que les autres ressentent et tu les ecoutes vraiment.`],
        [`Communication`,`Tu expliques clairement tes idees et tu crees facilement le dialogue.`],
        [`Cooperation`,`Tu travailles bien en equipe et tu favorises l'entente dans le groupe.`],
        [`Patience`,`Tu restes calme et bienveillant meme dans les situations difficiles.`],
        [`Motivation des autres`,`Tu sais encourager et motiver les personnes autour de toi.`],
        [`Leadership bienveillant`,`Tu guides naturellement sans imposer, avec respect et douceur.`],
      ],
      E: [
        [`Leadership`,`Tu prends naturellement les devants et tu guides les autres vers un objectif.`],
        [`Persuasion`,`Tu sais convaincre les autres et defendre tes idees avec efficacite.`],
        [`Initiative`,`Tu passes a l'action sans attendre qu'on te le demande.`],
        [`Vision strategique`,`Tu vois loin et tu planifies tes actions avec une vision globale.`],
        [`Energie`,`Tu apportes de l'enthousiasme et de la dynamique dans tout ce que tu fais.`],
        [`Prise de decision`,`Tu decides rapidement et assumes tes choix avec confiance.`],
      ],
      C: [
        [`Organisation`,`Tu structures ton travail avec methode et tu planifies avec precision.`],
        [`Rigueur`,`Tu travailles avec exactitude et tu fais attention aux moindres details.`],
        [`Sens du detail`,`Tu remarques ce que les autres oublient et tu corriges les erreurs.`],
        [`Fiabilite`,`On peut compter sur toi pour rendre un travail propre et dans les delais.`],
        [`Maitrise des procedures`,`Tu suis les regles et les processus etablis avec discipline.`],
        [`Gestion des donnees`,`Tu manipules facilement les chiffres, tableaux et informations structurees.`],
      ],
    },
    en: {
      R: [
        [`Practical sense`,`You prefer taking concrete action rather than staying in theory.`],
        [`Manual dexterity`,`You work easily with your hands and tools.`],
        [`Autonomy`,`You move forward on tasks independently without constant help.`],
        [`Problem solving`,`You find concrete solutions to everyday problems.`],
        [`Endurance`,`You maintain effort over time, even on difficult tasks.`],
        [`Reliability`,`Others can count on you - you keep your commitments.`],
      ],
      I: [
        [`Analytical mind`,`You break down complex problems to better understand them.`],
        [`Intellectual curiosity`,`You love learning and discovering new knowledge.`],
        [`Scientific rigor`,`You verify hypotheses and work with precision.`],
        [`Synthesis ability`,`You quickly summarize the essentials from complex information.`],
        [`Critical thinking`,`You question assumptions before accepting conclusions.`],
        [`Intellectual autonomy`,`You can work alone on complex subjects without help.`],
      ],
      A: [
        [`Creativity`,`You imagine original solutions and ideas that others don't have.`],
        [`Artistic sensitivity`,`You perceive beauty and aesthetics with a special eye.`],
        [`Personal expression`,`You express emotions and ideas through different media.`],
        [`Adaptability`,`You adjust easily to new situations and changes.`],
        [`Aesthetic vision`,`You have a developed sense of beauty and visual harmony.`],
        [`Openness`,`You easily accept new ideas and different points of view.`],
      ],
      S: [
        [`Empathy`,`You easily understand what others feel and truly listen.`],
        [`Communication`,`You explain ideas clearly and create dialogue naturally.`],
        [`Cooperation`,`You work well in teams and promote group harmony.`],
        [`Patience`,`You stay calm and kind even in difficult situations.`],
        [`Motivating others`,`You know how to encourage and motivate people around you.`],
        [`Benevolent leadership`,`You guide naturally without imposing, with respect.`],
      ],
      E: [
        [`Leadership`,`You naturally take the lead and guide others toward a goal.`],
        [`Persuasion`,`You convince others and defend your ideas effectively.`],
        [`Initiative`,`You take action without waiting to be asked.`],
        [`Strategic vision`,`You think ahead and plan with a global perspective.`],
        [`Energy`,`You bring enthusiasm and drive to everything you do.`],
        [`Decision making`,`You decide quickly and own your choices with confidence.`],
      ],
      C: [
        [`Organization`,`You structure your work methodically and plan with precision.`],
        [`Rigor`,`You work with accuracy and pay attention to every detail.`],
        [`Attention to detail`,`You notice what others miss and correct errors.`],
        [`Reliability`,`You deliver clean work on time, every time.`],
        [`Process mastery`,`You follow established rules and processes with discipline.`],
        [`Data management`,`You handle numbers, tables, and structured information easily.`],
      ],
    },
  }

  // Environnements adaptés par profil
  const envAdaptes = {
    fr: {
      R:[`Atelier ou chantier avec activites manuelles concretes`,`Terrain : agriculture, nature, exterieur`,`Usine ou laboratoire technique`,`Garage automobile ou atelier mecanique`,`Bureau technique avec outils et machines`],
      I:[`Laboratoire de recherche scientifique`,`Bureau d'etudes ou centre de R&D`,`Universite ou organisme de recherche`,`Entreprise tech ou startup innovante`,`Cabinet medical ou pharmaceutique`],
      A:[`Studio creatif ou agence de communication`,`Redaction de presse ou maison d'edition`,`Theatre, studio de musique ou galerie d'art`,`Agence de design ou architecture`,`Environnement flexible avec liberte d'expression`],
      S:[`Ecole ou centre de formation`,`Hopital, clinique ou centre de soin`,`Association humanitaire ou ONG`,`Cabinet de psychologie ou de coaching`,`Administration publique ou service social`],
      E:[`Entreprise commerciale dynamique`,`Startup ou projet entrepreneurial`,`Cabinet de conseil en strategie`,`Environnement de vente et negociation`,`Poste de direction ou de management`],
      C:[`Cabinet comptable ou service financier`,`Administration publique ou entreprise structuree`,`Service juridique ou notarial`,`Departement logistique ou supply chain`,`Back-office bancaire ou assurance`],
    },
    en: {
      R:[`Workshop or construction site with hands-on activities`,`Field work: agriculture, nature, outdoors`,`Factory or technical laboratory`,`Auto repair shop or mechanical workshop`,`Technical office with tools and machines`],
      I:[`Scientific research laboratory`,`Engineering office or R&D center`,`University or research institution`,`Tech company or innovative startup`,`Medical or pharmaceutical practice`],
      A:[`Creative studio or communication agency`,`Press room or publishing house`,`Theater, music studio or art gallery`,`Design or architecture agency`,`Flexible environment with freedom of expression`],
      S:[`School or training center`,`Hospital, clinic or care center`,`Humanitarian association or NGO`,`Psychology or coaching practice`,`Public administration or social services`],
      E:[`Dynamic commercial company`,`Startup or entrepreneurial project`,`Strategy consulting firm`,`Sales and negotiation environment`,`Management or leadership position`],
      C:[`Accounting firm or financial department`,`Public administration or structured company`,`Legal or notary office`,`Logistics or supply chain department`,`Bank back-office or insurance`],
    },
  }

  // A eviter avec explication
  const eviterDesc = {
    fr: {
      R:[
        [`Bureaux fermes sans activite physique`,`Tu as besoin de bouger et d'agir. Un travail purement sedentaire te demotivera vite.`],
        [`Travail purement administratif`,`Les taches de bureau repetitives sans resultat concret ne te conviennent pas.`],
        [`Environnement tres theorique`,`Tu preferes voir des resultats tangibles. La theorie pure te freine.`],
      ],
      I:[
        [`Sans stimulation intellectuelle`,`Tu as besoin de defis complexes. Un travail repetitif t'ennuiera rapidement.`],
        [`Tres repetitif sans reflexion`,`Tu as besoin de penser et d'analyser. L'execution mecanique ne te correspond pas.`],
        [`Pression commerciale excessive`,`Tu preferes un travail de fond. La vente aggressive va a l'encontre de ta nature.`],
      ],
      A:[
        [`Rigide et tres bureaucratique`,`Les regles strictes bloquent ta creativite et eteignent ton potentiel.`],
        [`Routinier sans creativite`,`Faire toujours la meme chose te demotive. Tu as besoin de variation et de nouveaute.`],
        [`Milieu tres conservateur`,`Tu penses differemment. Un milieu ferme aux idees nouvelles te frustre.`],
      ],
      S:[
        [`Travail totalement isole`,`Tu as besoin de contact humain. Travailler seul toute la journee te vide.`],
        [`Environnement froid et competitif`,`Tu travailles mieux dans la bienveillance. La competition agressive te stresse.`],
        [`Taches purement techniques`,`Tu as besoin de sens et de relation. Le travail machine ne te nourrit pas.`],
      ],
      E:[
        [`Tres hierarchique et rigide`,`Tu as besoin de liberte d'action. Une structure tres rigide t'etouffe.`],
        [`Sans objectifs ambitieux`,`Tu as besoin de defis. Un travail sans perspective de croissance te lasse.`],
        [`Peu de liberte de decision`,`Tu as besoin d'autonomie. Devoir tout demander a quelqu'un te freine.`],
      ],
      C:[
        [`Desorganise et chaotique`,`Tu as besoin de structure et de clarte. Le desordre reduit ton efficacite.`],
        [`Taches floues sans regles`,`Tu travailles mieux avec des consignes precises. Le flou te genere du stress.`],
        [`Changements trop frequents`,`Tu preferes la stabilite et la routine. Les changements permanents te perturbent.`],
      ],
    },
    en: {
      R:[
        [`Closed offices without physical activity`,`You need to move and act. Purely sedentary work will quickly demotivate you.`],
        [`Pure administrative work`,`Repetitive desk tasks without concrete results don't suit you.`],
        [`Theoretical environments`,`You prefer visible results. Pure theory holds you back.`],
      ],
      I:[
        [`No intellectual stimulation`,`You need complex challenges. Repetitive work will bore you quickly.`],
        [`Very repetitive work`,`You need to think and analyze. Mechanical execution doesn't suit you.`],
        [`Excessive commercial pressure`,`You prefer deep work. Aggressive sales go against your nature.`],
      ],
      A:[
        [`Very rigid and bureaucratic`,`Strict rules block your creativity and extinguish your potential.`],
        [`Routine without creativity`,`Doing the same thing demotivates you. You need variation and novelty.`],
        [`Conservative environment`,`You think differently. Closed-minded environments frustrate you.`],
      ],
      S:[
        [`Totally isolated work`,`You need human contact. Working alone all day drains you.`],
        [`Cold and competitive`,`You work better with kindness. Aggressive competition stresses you.`],
        [`Purely technical tasks`,`You need meaning and relationships. Machine-like work doesn't fulfil you.`],
      ],
      E:[
        [`Very hierarchical and rigid`,`You need freedom to act. A very rigid structure stifles you.`],
        [`No ambitious goals`,`You need challenges. Work without growth prospects bores you.`],
        [`Little decision freedom`,`You need autonomy. Having to ask permission for everything holds you back.`],
      ],
      C:[
        [`Disorganized and chaotic`,`You need structure and clarity. Disorder reduces your efficiency.`],
        [`Vague tasks without rules`,`You work better with precise instructions. Vagueness generates stress.`],
        [`Too frequent changes`,`You prefer stability. Permanent changes disturb you.`],
      ],
    },
  }

  const fortsData   = (lang==='fr' ? fortsDesc.fr : fortsDesc.en)[classement[0]]
  const envData     = (lang==='fr' ? envAdaptes.fr : envAdaptes.en)[classement[0]]
  const eviterData  = (lang==='fr' ? eviterDesc.fr : eviterDesc.en)[classement[0]]

  // ══════════════════════════════════════════
  // PAGE 1 - COUVERTURE
  // ══════════════════════════════════════════
  bx(0,0,W,H,0,WHT)
  bx(0,0,W,55,0,cA)
  // Logo box
  bx(ML,9,22,22,3,WHT); sf(true,13,cA); tx('AT',ML+11,23,'center')
  sf(true,20,WHT); tx('ATLAS TAWJIH',ML+28,19)
  sf(false,9,mix(cA,0.55)); tx(L.rapport,ML+28,27)
  sf(false,8,mix(cA,0.5)); tx(new Date().toLocaleDateString(lang==='fr'?'fr-FR':'en-US'),W-MR,19,'right')
  bx(ML,37,TW,14,2,drk(cA,0.12))
  sf(true,12,WHT); tx(`${eleve.prenom} ${eleve.nom}`,ML+5,44)
  sf(false,8.5,mix(cA,0.5)); tx(`${eleve.filiere}   |   ${eleve.ville}`,ML+5,50)

  y=66
  bx(ML,y,TW,30,3,mix(cA,0.93))
  bx(ML+4,y+4,22,22,3,cA); sf(true,15,WHT); tx(classement[0],ML+15,y+18,'center')
  sf(true,15,DRK); tx(profA.nom,ML+32,y+13)
  sf(false,9,GRY); tx(L.profDom,ML+32,y+20)
  sf(true,13,cA); tx(code3,ML+32,y+27)
  bx(W-MR-24,y+5,20,20,3,cA); sf(true,14,WHT); tx(`${scores[classement[0]]}%`,W-MR-14,y+17,'center')
  sf(false,7,WHT); tx('score',W-MR-14,y+23,'center')
  y+=36

  sub(L.scores,DRK)
  classement.forEach((dim,i) => {
    const sc=scores[dim], cc=RGB[dim], pn=cl(PROFILS[dim][lang].nom)
    sf(true,9.5,cc); tx(dim,ML,y+3.5); sf(false,9.5,GRY); tx(pn,ML+8,y+3.5)
    hbar(ML+54,y,86,6,sc,cc)
    sf(true,9.5,cc); tx(`${sc}%`,ML+144,y+4.5)
    const medals=['[A]','[B]','[C]']; if(i<3){sf(true,9,DRK);tx(medals[i],ML+154,y+4.5)}
    y+=9
  })
  y+=3

  sub(L.profDetail,cA)
  sf(false,10,DRK); y=txw(profA.desc,ML,y,TW,5.5)+4
  ftr()

  // ══════════════════════════════════════════
  // PAGE 2 - POINTS FORTS (tableau)
  // ══════════════════════════════════════════
  newPage()
  sec(L.ptsForts,cA)

  // Table header
  chk(10)
  bx(ML,y,TW,8,2,cA)
  sf(true,10,WHT)
  tx(lang==='fr'?'Point fort':'Strength',ML+4,y+5.5)
  tx(lang==='fr'?'Ce que ca signifie pour toi':'What it means for you',ML+TW*0.38,y+5.5)
  y+=10

  fortsData.forEach(([fort,desc],i) => {
    const dLines=doc.splitTextToSize(cl(desc),TW*0.6-6)
    const rowH=Math.max(10,dLines.length*5.5+6)
    chk(rowH+2)
    bx(ML,y,TW,rowH,0,i%2===0?mix(cA,0.95):WHT)
    // Left border
    fl(cA); doc.rect(ML,y,3,rowH,'F')
    // Fort name
    sf(true,10,cA); tx(cl(fort),ML+6,y+rowH/2+1.5)
    // Separator line
    dr(mix(cA,0.7)); doc.setLineWidth(0.3)
    doc.line(ML+TW*0.37,y+2,ML+TW*0.37,y+rowH-2)
    // Description
    sf(false,9.5,DRK); doc.text(dLines,ML+TW*0.38,y+5)
    y+=rowH+1
  })
  y+=6
  ftr()

  // ══════════════════════════════════════════
  // PAGE 3 - PLAN A (full page)
  // ══════════════════════════════════════════
  newPage()
  // Big plan header
  bx(ML,y,TW,22,3,cA)
  sf(true,9,mix(cA,0.45)); tx(lang==='fr'?'PLAN A - PROFIL DOMINANT - PRIORITE':'PLAN A - DOMINANT PROFILE - PRIORITY',ML+5,y+7)
  sf(true,17,WHT); tx(`${classement[0]}  -  ${profA.nom}  (${scores[classement[0]]}%)`,ML+5,y+17)
  bx(W-MR-30,y+3,26,16,2,drk(cA,0.15))
  sf(true,8,WHT); tx(lang==='fr'?'Score dominant':'Top score',W-MR-17,y+9,'center')
  sf(true,16,WHT); tx(`${scores[classement[0]]}%`,W-MR-17,y+18,'center')
  y+=27
  sub(L.domaines,cA)
  profA.domaines.forEach(d => {
    const dn=typeof d==='object'?d.nom:String(d)
    const sous=typeof d==='object'?d.sous:[]
    chk(14)
    bx(ML,y,TW,8,2,mix(cA,0.88))
    fl(cA); doc.rect(ML,y,3,8,'F')
    sf(true,10,cA); tx(cl(dn),ML+7,y+5.5); y+=10
    if(sous.length>0){
      let sx=ML+4, rowY=y
      sous.forEach(s => {
        const sc2=cl(s), sw=doc.getTextWidth(sc2)+8
        if(sx+sw>W-MR){ sx=ML+4; rowY+=7.5; chk(9) }
        bx(sx,rowY,sw,6.5,3,mix(cA,0.93))
        dr(mix(cA,0.6)); doc.setLineWidth(0.3)
        doc.roundedRect(sx,rowY,sw,6.5,3,3,'FD')
        sf(false,8.5,DRK); tx(sc2,sx+4,rowY+4.5)
        sx+=sw+3
      })
      y=rowY+9
    }
    y+=2
  })
  ftr()

  // ══════════════════════════════════════════
  // PAGE 4 - PLAN B (full page)
  // ══════════════════════════════════════════
  newPage()
  bx(ML,y,TW,22,3,cB)
  sf(true,9,mix(cB,0.45)); tx(lang==='fr'?'PLAN B - PROFIL SECONDAIRE - ALTERNATIVE':'PLAN B - SECONDARY PROFILE - ALTERNATIVE',ML+5,y+7)
  sf(true,17,WHT); tx(`${classement[1]}  -  ${profB.nom}  (${scores[classement[1]]}%)`,ML+5,y+17)
  bx(W-MR-30,y+3,26,16,2,drk(cB,0.15))
  sf(true,8,WHT); tx(lang==='fr'?'Score':'Score',W-MR-17,y+9,'center')
  sf(true,16,WHT); tx(`${scores[classement[1]]}%`,W-MR-17,y+18,'center')
  y+=27
  sub(L.domaines,cB)
  profB.domaines.forEach(d => {
    const dn=typeof d==='object'?d.nom:String(d)
    const sous=typeof d==='object'?d.sous:[]
    chk(14)
    bx(ML,y,TW,8,2,mix(cB,0.88))
    fl(cB); doc.rect(ML,y,3,8,'F')
    sf(true,10,cB); tx(cl(dn),ML+7,y+5.5); y+=10
    if(sous.length>0){
      let sx=ML+4, rowY=y
      sous.forEach(s => {
        const sc2=cl(s), sw=doc.getTextWidth(sc2)+8
        if(sx+sw>W-MR){ sx=ML+4; rowY+=7.5; chk(9) }
        bx(sx,rowY,sw,6.5,3,mix(cB,0.93))
        dr(mix(cB,0.6)); doc.setLineWidth(0.3)
        doc.roundedRect(sx,rowY,sw,6.5,3,3,'FD')
        sf(false,8.5,DRK); tx(sc2,sx+4,rowY+4.5)
        sx+=sw+3
      })
      y=rowY+9
    }
    y+=2
  })
  ftr()

  // ══════════════════════════════════════════
  // PAGE 5 - PLAN C (full page)
  // ══════════════════════════════════════════
  newPage()
  bx(ML,y,TW,22,3,cC)
  sf(true,9,mix(cC,0.45)); tx(lang==='fr'?'PLAN C - PROFIL TERTIAIRE - OPTION DE REPLI':'PLAN C - TERTIARY PROFILE - BACKUP',ML+5,y+7)
  sf(true,17,WHT); tx(`${classement[2]}  -  ${profC.nom}  (${scores[classement[2]]}%)`,ML+5,y+17)
  bx(W-MR-30,y+3,26,16,2,drk(cC,0.15))
  sf(true,8,WHT); tx(lang==='fr'?'Score':'Score',W-MR-17,y+9,'center')
  sf(true,16,WHT); tx(`${scores[classement[2]]}%`,W-MR-17,y+18,'center')
  y+=27
  sub(L.domaines,cC)
  profC.domaines.forEach(d => {
    const dn=typeof d==='object'?d.nom:String(d)
    const sous=typeof d==='object'?d.sous:[]
    chk(14)
    bx(ML,y,TW,8,2,mix(cC,0.88))
    fl(cC); doc.rect(ML,y,3,8,'F')
    sf(true,10,cC); tx(cl(dn),ML+7,y+5.5); y+=10
    if(sous.length>0){
      let sx=ML+4, rowY=y
      sous.forEach(s => {
        const sc2=cl(s), sw=doc.getTextWidth(sc2)+8
        if(sx+sw>W-MR){ sx=ML+4; rowY+=7.5; chk(9) }
        bx(sx,rowY,sw,6.5,3,mix(cC,0.93))
        dr(mix(cC,0.6)); doc.setLineWidth(0.3)
        doc.roundedRect(sx,rowY,sw,6.5,3,3,'FD')
        sf(false,8.5,DRK); tx(sc2,sx+4,rowY+4.5)
        sx+=sw+3
      })
      y=rowY+9
    }
    y+=2
  })
  ftr()

  // ══════════════════════════════════════════
  // PAGE - ENVIRONNEMENT
  // ══════════════════════════════════════════
  newPage()
  sec(L.envT,cA)

  // Environnement ideal
  sub(L.envIdeal,cA)
  tblk(profA.env,cA)

  // Environnements adaptes
  chk(12)
  sf(true,11,cA)
  tx(lang==='fr'?`Environnements qui te correspondent`:`Environments that suit you`,ML,y)
  dr(cA); doc.setLineWidth(0.5); doc.line(ML,y+1.8,W-MR,y+1.8); y+=8
  envData.forEach((e,i) => {
    chk(9)
    bx(ML,y,TW,8,2,i%2===0?mix(cA,0.94):mix(cA,0.88))
    fl(cA); doc.rect(ML,y,3,8,'F')
    sf(false,10,DRK); tx(cl(e),ML+8,y+5.5); y+=10
  })
  y+=4

  // A eviter avec explication
  sub(L.aEviter,[239,68,68])
  eviterData.forEach(([titre,desc],i) => {
    const dLines=doc.splitTextToSize(cl(desc),TW-14)
    const rowH=dLines.length*5.5+14; chk(rowH+3)
    bx(ML,y,TW,rowH,2,[254,242,242])
    fl(RED); doc.rect(ML,y,3,rowH,'F')
    sf(true,10,RED); tx(cl(titre),ML+7,y+7)
    sf(false,9.5,[127,29,29]); doc.text(dLines,ML+7,y+13)
    y+=rowH+4
  })
  y+=4

  sub(L.message,cA)
  tblk(L.motiv,cA)
  ftr()

  // ══════════════════════════════════════════
  // PAGE - PARENTS
  // ══════════════════════════════════════════
  newPage()
  sec(L.parents,AMB)
  const ptxt=cl(L.parentText)
  const pls=doc.splitTextToSize(ptxt,TW-9)
  const ph=pls.length*5.8+12; chk(ph+6)
  bx(ML,y,TW,ph,3,[255,251,235])
  fl(AMB); doc.rect(ML,y,3,ph,'F')
  sf(false,10,[120,53,15]); doc.text(pls,ML+7,y+8); y+=ph+8

  sf(true,11,AMB); tx(lang==='fr'?`Comment accompagner votre enfant`:`Support your child`,ML,y)
  dr(AMB); doc.setLineWidth(0.5); doc.line(ML,y+1.8,W-MR,y+1.8); y+=8
  const cpFr=[
    [`Ne pas imposer de filiere`,`Laissez votre enfant explorer ses interets naturels. Votre role est de soutenir, pas de decider.`],
    [`Valoriser ses interets`,`Soutenez ses passions meme si elles semblent inhabituelles. C'est sa force principale.`],
    [`Offrir des ressources`,`Livres, stages, visites de metiers : tout ce qui nourrit son projet est utile.`],
    [`Respecter son autonomie`,`Il a besoin d'espace pour reflechir et construire son projet a son rythme.`],
    [`Contacter Atlas Tawjih`,`Notre equipe est disponible pour vous accompagner dans ses demarches d'orientation.`],
  ]
  const cpEn=[
    [`Do not impose a field`,`Let your child explore their natural interests. Your role is to support, not decide.`],
    [`Value their interests`,`Support their passions even if unusual. This is their main strength.`],
    [`Offer resources`,`Books, internships, career visits: anything that builds their project is useful.`],
    [`Respect their autonomy`,`They need space to think and build their project at their own pace.`],
    [`Contact Atlas Tawjih`,`Our team is available to guide you through the orientation process.`],
  ]
  const cpData=lang==='fr'?cpFr:cpEn
  cpData.forEach(([titre,desc]) => {
    const dls=doc.splitTextToSize(cl(desc),TW-12)
    const dh=dls.length*5.5+16; chk(dh+4)
    bx(ML,y,TW,dh,2,[255,251,235])
    fl(AMB); doc.rect(ML,y,3,dh,'F')
    sf(true,10,[146,64,14]); tx(cl(titre),ML+7,y+8)
    sf(false,9.5,[120,53,15]); doc.text(dls,ML+7,y+14)
    y+=dh+4
  })
  ftr()

  // ══════════════════════════════════════════
  // PAGE - RECAP
  // ══════════════════════════════════════════
  newPage()
  sec(L.recap,DRK)
  sub(L.infoEleve,cA)
  const mobVal=eleve.mobilite==='oui'?L.mobOui:eleve.mobilite==='non'?L.mobNon:L.mobPart
  const priveVal=eleve.prive==='oui'?L.priveOui:L.priveNon
  const rows=[
    [L.nom,`${eleve.prenom} ${eleve.nom}`],
    [L.filiere,eleve.filiere],
    [L.ville,eleve.ville],
    [L.mobilite,mobVal],
    [L.prive,priveVal],
    [L.dateTest,new Date().toLocaleDateString(lang==='fr'?'fr-FR':'en-US')],
    [L.holland,`${code3}  -  ${profA.nom} / ${profB.nom} / ${profC.nom}`],
  ]
  rows.forEach(([k,v],i) => {
    chk(9); bx(ML,y,TW,8,0,i%2===0?mix(cA,0.93):WHT)
    sf(true,9.5,DRK); tx(cl(String(k)),ML+3,y+5.5)
    sf(false,9.5,GRY)
    const vls=doc.splitTextToSize(cl(String(v||'')),TW-52)
    doc.text(vls,ML+52,y+5.5); y+=8
  })
  y+=8

  sub(L.scores6,cA)
  const bW=26,bMH=40,bGap=5,bSX=ML+6,bBY=y+bMH+8
  Object.entries(scores).forEach(([dim,sc],i)=>{
    const bh=Math.max(2,(sc/100)*bMH),bx2=bSX+i*(bW+bGap),by2=bBY-bh,cc=RGB[dim]
    bx(bx2,bBY-bMH,bW,bMH,2,[226,232,240]); bx(bx2,by2,bW,bh,2,cc)
    sf(true,9,cc); tx(`${sc}%`,bx2+bW/2,by2-2,'center')
    sf(true,10,DRK); tx(dim,bx2+bW/2,bBY+5,'center')
    sf(false,8,GRY)
    const pn=cl(PROFILS[dim][lang].nom)
    const pnL=doc.splitTextToSize(pn,bW+2); pnL.forEach((line,li)=>tx(line,bx2+bW/2,bBY+10+li*4.5,'center'))
  })
  y=bBY+20

  sub(L.apropos,cA)
  tblk(L.aboutText,cA)

  chk(32)
  dr([220,220,220]); doc.setLineWidth(0.8); doc.line(ML,y,W-MR,y); y+=7
  sf(false,9,GRY)
  tx(lang==='fr'?'Certifie par':'Certified by',ML,y)
  tx(lang==='fr'?'Cachet':'Stamp',W/2,y)
  y+=6
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

      <div style={{ flex:1, padding:'20px 24px', maxWidth:720, margin:'0 auto', width:'100%' }}>

        {/* DESCRIPTION */}
        <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:12, padding:'18px', marginBottom:14, borderLeft:`4px solid ${DIM_COLORS[classement[0]]}` }}>
          <div style={{ fontSize:13, fontWeight:600, color:'#1E293B', marginBottom:6 }}>
            {lang==='fr' ? '👤 Description de ton profil' : '👤 Your profile description'}
          </div>
          <div style={{ fontSize:13, color:'#475569', lineHeight:1.7 }}>{profilDom.desc}</div>
        </div>

        {/* SCORES BARRES */}
        <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:12, padding:'18px', marginBottom:14 }}>
          <div style={{ fontSize:13, fontWeight:600, color:'#1E293B', marginBottom:14 }}>
            {lang==='fr' ? '📊 Tes scores RIASEC' : '📊 Your RIASEC scores'}
          </div>
          {getClassement(scores).map((dim, rank) => (
            <div key={dim} style={{ marginBottom:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                <span style={{ fontSize:12, fontWeight:600, color:DIM_COLORS[dim] }}>
                  {rank===0?'🥇':rank===1?'🥈':rank===2?'🥉':'  '} {dim} — {PROFILS[dim][lang].nom}
                </span>
                <span style={{ fontSize:12, fontWeight:700, color:DIM_COLORS[dim] }}>{scores[dim]}%</span>
              </div>
              <div style={{ height:10, background:'#F1F5F9', borderRadius:5, overflow:'hidden' }}>
                <div style={{ width:`${scores[dim]}%`, height:'100%', background:DIM_COLORS[dim], borderRadius:5, transition:'width 1s ease' }} />
              </div>
            </div>
          ))}
        </div>

        {/* POINTS FORTS */}
        <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:12, padding:'18px', marginBottom:14 }}>
          <div style={{ fontSize:13, fontWeight:600, color:'#1E293B', marginBottom:12 }}>
            {lang==='fr' ? '⭐ Tes points forts' : '⭐ Your strengths'}
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {profilDom.forts.map((f,i) => (
              <div key={i} style={{ padding:'6px 12px', background:DIM_BG[classement[0]], border:`1px solid ${DIM_COLORS[classement[0]]}40`, borderRadius:20, fontSize:12, color:DIM_COLORS[classement[0]], fontWeight:500 }}>
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* ══ PLAN A ══ */}
        <div style={{ marginBottom:20 }}>
          {/* Badge Plan A */}
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
            <div style={{ background:`linear-gradient(135deg,${DIM_COLORS[classement[0]]},${DIM_COLORS[classement[0]]}99)`, borderRadius:10, padding:'8px 18px', display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:18 }}>🥇</span>
              <div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.8)', fontWeight:600, letterSpacing:1 }}>
                  {lang==='fr' ? 'PLAN A — PROFIL DOMINANT' : 'PLAN A — DOMINANT PROFILE'}
                </div>
                <div style={{ fontSize:15, color:'#fff', fontWeight:800 }}>
                  {classement[0]} — {profilDom.nom} ({scores[classement[0]]}%)
                </div>
              </div>
            </div>
            <div style={{ flex:1, height:2, background:`linear-gradient(90deg,${DIM_COLORS[classement[0]]}40,transparent)`, borderRadius:1 }} />
          </div>

          <div style={{ background:'#fff', border:`2px solid ${DIM_COLORS[classement[0]]}30`, borderRadius:12, padding:'18px', marginBottom:10 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'#1E293B', marginBottom:14, display:'flex', alignItems:'center', gap:6 }}>
              <span>📚</span> {lang==='fr' ? 'Domaines & sous-domaines — Plan A' : 'Fields & sub-fields — Plan A'}
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {profilDom.domaines.map((d,i) => (
                <div key={i} style={{ border:`1px solid ${DIM_COLORS[classement[0]]}25`, borderRadius:10, overflow:'hidden' }}>
                  <div style={{ background:`${DIM_COLORS[classement[0]]}12`, padding:'8px 14px', fontWeight:700, fontSize:12, color:DIM_COLORS[classement[0]], display:'flex', alignItems:'center', gap:6 }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:DIM_COLORS[classement[0]], display:'inline-block' }}></span>
                    {d.nom}
                  </div>
                  <div style={{ padding:'8px 12px', display:'flex', flexWrap:'wrap', gap:5 }}>
                    {d.sous.map((s,j) => (
                      <span key={j} style={{ padding:'3px 10px', background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:20, fontSize:11, color:'#475569' }}>{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background:'#fff', border:`2px solid ${DIM_COLORS[classement[0]]}30`, borderRadius:12, padding:'18px' }}>
            <div style={{ fontSize:13, fontWeight:700, color:'#1E293B', marginBottom:12, display:'flex', alignItems:'center', gap:6 }}>
              <span>💼</span> {lang==='fr' ? 'Métiers recommandés — Plan A' : 'Recommended careers — Plan A'}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:7 }}>
              {profilDom.metiers.map((m,i) => (
                <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:7, padding:'8px 12px', background:`${DIM_COLORS[classement[0]]}08`, border:`1px solid ${DIM_COLORS[classement[0]]}20`, borderRadius:8, fontSize:12, color:'#1E293B' }}>
                  <span style={{ color:DIM_COLORS[classement[0]], fontWeight:700, flexShrink:0, marginTop:1 }}>✓</span>
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ SÉPARATEUR ══ */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
          <div style={{ flex:1, height:1, background:'linear-gradient(90deg,transparent,#E2E8F0)' }} />
          <div style={{ background:'#F1F5F9', border:'1px solid #E2E8F0', borderRadius:20, padding:'6px 16px', fontSize:12, color:'#64748B', fontWeight:600, whiteSpace:'nowrap' }}>
            {lang==='fr' ? '↓ Alternative complémentaire ↓' : '↓ Complementary alternative ↓'}
          </div>
          <div style={{ flex:1, height:1, background:'linear-gradient(90deg,#E2E8F0,transparent)' }} />
        </div>

        {/* ══ PLAN B ══ */}
        {(() => {
          const profilB = PROFILS[classement[1]][lang]
          const colorB  = DIM_COLORS[classement[1]]
          return (
            <div style={{ marginBottom:20 }}>
              {/* Badge Plan B */}
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                <div style={{ background:`linear-gradient(135deg,${colorB},${colorB}99)`, borderRadius:10, padding:'8px 18px', display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:18 }}>🥈</span>
                  <div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.8)', fontWeight:600, letterSpacing:1 }}>
                      {lang==='fr' ? 'PLAN B — PROFIL SECONDAIRE' : 'PLAN B — SECONDARY PROFILE'}
                    </div>
                    <div style={{ fontSize:15, color:'#fff', fontWeight:800 }}>
                      {classement[1]} — {profilB.nom} ({scores[classement[1]]}%)
                    </div>
                  </div>
                </div>
                <div style={{ flex:1, height:2, background:`linear-gradient(90deg,${colorB}40,transparent)`, borderRadius:1 }} />
              </div>

              <div style={{ background:'#fff', border:`2px solid ${colorB}30`, borderRadius:12, padding:'18px', marginBottom:10 }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#1E293B', marginBottom:14, display:'flex', alignItems:'center', gap:6 }}>
                  <span>📚</span> {lang==='fr' ? 'Domaines & sous-domaines — Plan B' : 'Fields & sub-fields — Plan B'}
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {profilB.domaines.map((d,i) => (
                    <div key={i} style={{ border:`1px solid ${colorB}25`, borderRadius:10, overflow:'hidden' }}>
                      <div style={{ background:`${colorB}12`, padding:'8px 14px', fontWeight:700, fontSize:12, color:colorB, display:'flex', alignItems:'center', gap:6 }}>
                        <span style={{ width:6, height:6, borderRadius:'50%', background:colorB, display:'inline-block' }}></span>
                        {d.nom}
                      </div>
                      <div style={{ padding:'8px 12px', display:'flex', flexWrap:'wrap', gap:5 }}>
                        {d.sous.map((s,j) => (
                          <span key={j} style={{ padding:'3px 10px', background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:20, fontSize:11, color:'#475569' }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background:'#fff', border:`2px solid ${colorB}30`, borderRadius:12, padding:'18px' }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#1E293B', marginBottom:12, display:'flex', alignItems:'center', gap:6 }}>
                  <span>💼</span> {lang==='fr' ? 'Métiers recommandés — Plan B' : 'Recommended careers — Plan B'}
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:7 }}>
                  {profilB.metiers.map((m,i) => (
                    <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:7, padding:'8px 12px', background:`${colorB}08`, border:`1px solid ${colorB}20`, borderRadius:8, fontSize:12, color:'#1E293B' }}>
                      <span style={{ color:colorB, fontWeight:700, flexShrink:0, marginTop:1 }}>✓</span>
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })()}

        {/* ENVIRONNEMENT */}
        <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:12, padding:'18px', marginBottom:14 }}>
          <div style={{ fontSize:13, fontWeight:600, color:'#1E293B', marginBottom:8 }}>
            {lang==='fr' ? '🏢 Environnement de travail idéal' : '🏢 Ideal work environment'}
          </div>
          <div style={{ fontSize:13, color:'#475569', lineHeight:1.7 }}>{profilDom.env}</div>
        </div>

        {/* NOTE PARENTS */}
        <div style={{ background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:12, padding:'18px', marginBottom:20 }}>
          <div style={{ fontSize:13, fontWeight:600, color:'#92400E', marginBottom:8 }}>
            {lang==='fr' ? '👨‍👩‍👧 Note pour les parents' : '👨‍👩‍👧 Note for parents'}
          </div>
          <div style={{ fontSize:12, color:'#78350F', lineHeight:1.7 }}>
            {lang==='fr'
              ? `${eleve.prenom} présente un profil ${profilDom.nom} dominant (${scores[classement[0]]}%). Les recommandations d'établissements et de filières spécifiques seront communiquées par l'équipe Atlas Tawjih. N'hésitez pas à nous contacter.`
              : `${eleve.prenom} shows a dominant ${profilDom.nom} profile (${scores[classement[0]]}%). Recommendations for specific institutions and fields will be provided by the Atlas Tawjih team. Feel free to contact us.`}
          </div>
          <div style={{ marginTop:10, fontSize:12, color:'#7C3AED', fontWeight:600 }}>
            📧 atlastawjih.maroc@gmail.com
          </div>
        </div>

        {/* FEEDBACK + PDF */}
        {/* ── SECTION PDF ── */}
        <div style={{ marginBottom:24 }}>
          {/* Étape 1 : choisir la langue du PDF */}
          {!showFeedback && !feedbackDone && (
            <div style={{ background:'linear-gradient(135deg,#7C3AED,#5B21B6)', borderRadius:14, padding:'24px', textAlign:'center', boxShadow:'0 8px 24px rgba(124,58,237,0.3)', marginBottom:12 }}>
              <div style={{ fontSize:22, marginBottom:8 }}>📄</div>
              <div style={{ fontSize:15, fontWeight:700, color:'#fff', marginBottom:6 }}>
                {lang==='fr' ? 'Télécharge ton rapport PDF gratuit' : 'Download your free PDF report'}
              </div>
              <div style={{ fontSize:12, color:'#DDD6FE', marginBottom:16 }}>
                {lang==='fr' ? '4 pages · Plan A, B, C · Environnement · Conseils · Note parents' : '4 pages · Plan A, B, C · Environment · Tips · Parent note'}
              </div>

              {/* Sélecteur langue PDF */}
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:12, color:'#C4B5FD', marginBottom:8 }}>
                  {lang==='fr' ? '1️⃣ Choisis la langue de ton rapport :' : '1️⃣ Choose your report language:'}
                </div>
                <div style={{ display:'flex', justifyContent:'center', gap:8 }}>
                  {['fr','en'].map(l => (
                    <button key={l} onClick={() => setPdfLang(l)} style={{ padding:'8px 20px', borderRadius:8, border:`2px solid ${pdfLang===l?'#fff':'rgba(255,255,255,0.3)'}`, background:pdfLang===l?'#fff':'transparent', color:pdfLang===l?'#7C3AED':'#fff', fontSize:13, fontWeight:700, cursor:'pointer', transition:'all 0.15s' }}>
                      {l==='fr'?'🇫🇷 Français':'🇬🇧 English'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bouton donner avis */}
              <div style={{ fontSize:12, color:'#C4B5FD', marginBottom:10 }}>
                {lang==='fr' ? '2️⃣ Donne ton avis (obligatoire) puis ton PDF se télécharge automatiquement' : '2️⃣ Give your feedback (required) then your PDF downloads automatically'}
              </div>
              <button onClick={() => setShowFeedback(true)} style={{ background:'#fff', color:'#7C3AED', border:'none', padding:'12px 28px', borderRadius:10, fontSize:14, fontWeight:700, cursor:'pointer', boxShadow:'0 4px 12px rgba(0,0,0,0.15)' }}>
                {lang==='fr' ? '💬 Donner mon avis → télécharger le PDF' : '💬 Give feedback → download PDF'}
              </button>
            </div>
          )}

          {/* Étape 2 : formulaire feedback */}
          {showFeedback && !feedbackDone && (
            <Feedback
              lang={lang}
              profilRiasec={code3}
              onValide={() => {
                setFeedbackDone(true)
                setTimeout(() => handlePDF(), 1800)
              }}
            />
          )}

          {/* Étape 3 : PDF téléchargé — option de retélécharger */}
          {feedbackDone && (
            <div style={{ background:'linear-gradient(135deg,#7C3AED,#5B21B6)', borderRadius:14, padding:'24px', textAlign:'center', boxShadow:'0 8px 24px rgba(124,58,237,0.3)' }}>
              <div style={{ fontSize:22, marginBottom:8 }}>✅</div>
              <div style={{ fontSize:15, fontWeight:700, color:'#fff', marginBottom:6 }}>
                {lang==='fr' ? 'Merci ! Ton PDF est prêt.' : 'Thank you! Your PDF is ready.'}
              </div>
              <div style={{ fontSize:12, color:'#DDD6FE', marginBottom:16 }}>
                {lang==='fr' ? "Si le téléchargement ne s’est pas lancé, clique ci-dessous :" : 'If the download did not start, click below:'}
              </div>
              {/* Changer la langue et retélécharger */}
              <div style={{ display:'flex', justifyContent:'center', gap:8, marginBottom:12 }}>
                {['fr','en'].map(l => (
                  <button key={l} onClick={() => setPdfLang(l)} style={{ padding:'6px 14px', borderRadius:6, border:`2px solid ${pdfLang===l?'#fff':'rgba(255,255,255,0.3)'}`, background:pdfLang===l?'#fff':'transparent', color:pdfLang===l?'#7C3AED':'#fff', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                    {l==='fr'?'🇫🇷 FR':'🇬🇧 EN'}
                  </button>
                ))}
              </div>
              <button onClick={handlePDF} disabled={pdfLoading} style={{ background:pdfLoading?'rgba(255,255,255,0.3)':'#fff', color:pdfLoading?'#DDD6FE':'#7C3AED', border:'none', padding:'11px 24px', borderRadius:9, fontSize:13, fontWeight:700, cursor:pdfLoading?'wait':'pointer' }}>
                {pdfLoading ? (lang==='fr'?'⏳ Génération...':'⏳ Generating...') : (lang==='fr'?'📄 Retélécharger':'📄 Re-download')}
              </button>
            </div>
          )}
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
