export interface Herb {
  id: string;
  name: string;
  scientificName: string;
  benefits: string[];
  uses: string;
  precautions: string;
  history: string;
  imageUrl: string;
  wikipediaUrl: string;
}

export interface Remedy {
  id: string;
  name: string;
  symptoms: string[];
  ingredients: string[];
  preparation: string;
  benefits: string;
  precautions: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    text: string;
    dosha: 'Vata' | 'Pitta' | 'Kapha';
  }[];
}

export const herbs: Herb[] = [
  {
    id: 'tulsi',
    name: 'Tulsi (Holy Basil)',
    scientificName: 'Ocimum tenuiflorum',
    benefits: ['Boosts immunity', 'Relieves stress', 'Respiratory health'],
    uses: 'Chew fresh leaves or brew as tea.',
    precautions: 'Avoid if pregnant or trying to conceive.',
    history: 'Considered sacred in India, known as the "Queen of Herbs".',
    imageUrl: 'https://picsum.photos/seed/tulsi/400/300',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Ocimum_tenuiflorum'
  },
  {
    id: 'neem',
    name: 'Neem',
    scientificName: 'Azadirachta indica',
    benefits: ['Blood purifier', 'Skin health', 'Anti-bacterial'],
    uses: 'Apply paste on skin or consume juice (bitter).',
    precautions: 'Not for long-term internal use.',
    history: 'Referred to as "Aristha" in Sanskrit, meaning perfect, complete, and imperishable.',
    imageUrl: 'https://picsum.photos/seed/neem/400/300',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Azadirachta_indica'
  },
  {
    id: 'ashwagandha',
    name: 'Ashwagandha',
    scientificName: 'Withania somnifera',
    benefits: ['Reduces anxiety', 'Improves sleep', 'Energy booster'],
    uses: 'Mix powder with warm milk or water.',
    precautions: 'May interact with thyroid or blood pressure medications.',
    history: 'Used for over 3,000 years to relieve stress and increase energy.',
    imageUrl: 'https://picsum.photos/seed/ashwagandha/400/300',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Withania_somnifera'
  },
  {
    id: 'turmeric',
    name: 'Turmeric (Haldi)',
    scientificName: 'Curcuma longa',
    benefits: ['Anti-inflammatory', 'Antioxidant', 'Joint health'],
    uses: 'Add to food or drink as "Golden Milk".',
    precautions: 'High doses may thin blood.',
    history: 'Used in India for thousands of years as both a spice and medicinal herb.',
    imageUrl: 'https://picsum.photos/seed/turmeric/400/300',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Turmeric'
  },
  {
    id: 'amla',
    name: 'Amla (Indian Gooseberry)',
    scientificName: 'Phyllanthus emblica',
    benefits: ['Vitamin C rich', 'Hair health', 'Digestion'],
    uses: 'Eat fresh, dried, or as juice.',
    precautions: 'May lower blood sugar levels.',
    history: 'A central herb in Ayurvedic medicine, known for its rejuvenating properties.',
    imageUrl: 'https://picsum.photos/seed/amla/400/300',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Phyllanthus_emblica'
  },
  {
    id: 'brahmi',
    name: 'Brahmi',
    scientificName: 'Bacopa monnieri',
    benefits: ['Memory booster', 'Cognitive health', 'Reduces anxiety'],
    uses: 'Consume as powder or oil application.',
    precautions: 'May cause nausea or stomach cramps in some.',
    history: 'Named after Brahma, the creator god of the Hindu pantheon.',
    imageUrl: 'https://picsum.photos/seed/brahmi/400/300',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Bacopa_monnieri'
  }
];

export const remedies: Remedy[] = [
  {
    id: 'cold-remedy',
    name: 'Ginger Tulsi Tea',
    symptoms: ['Cold', 'Cough', 'Sore Throat'],
    ingredients: ['Ginger', 'Tulsi leaves', 'Honey'],
    preparation: 'Boil ginger and tulsi in water, add honey when warm.',
    benefits: 'Relieves congestion and boosts immunity.',
    precautions: 'Do not add honey to boiling water.',
    severity: 'Mild'
  },
  {
    id: 'digestion-remedy',
    name: 'Cumin-Coriander-Fennel (CCF) Tea',
    symptoms: ['Bloating', 'Indigestion', 'Gas'],
    ingredients: ['Cumin seeds', 'Coriander seeds', 'Fennel seeds'],
    preparation: 'Boil equal parts of seeds in water and strain.',
    benefits: 'Balances all three doshas and aids digestion.',
    precautions: 'Safe for most, but consult if pregnant.',
    severity: 'Mild'
  },
  {
    id: 'insomnia-remedy',
    name: 'Ashwagandha Moon Milk',
    symptoms: ['Insomnia', 'Stress', 'Anxiety'],
    ingredients: ['Milk', 'Ashwagandha powder', 'Nutmeg', 'Honey'],
    preparation: 'Warm milk with ashwagandha and nutmeg. Add honey before bed.',
    benefits: 'Promotes deep sleep and calms the nervous system.',
    precautions: 'Avoid if you have a fever or high toxins (Ama).',
    severity: 'Moderate'
  },
  {
    id: 'skin-remedy',
    name: 'Neem & Turmeric Paste',
    symptoms: ['Acne', 'Skin Rash', 'Itching'],
    ingredients: ['Neem powder', 'Turmeric powder', 'Water'],
    preparation: 'Make a thick paste and apply to affected areas for 20 mins.',
    benefits: 'Anti-bacterial and anti-inflammatory for skin.',
    precautions: 'May stain clothes yellow due to turmeric.',
    severity: 'Mild'
  },
  {
    id: 'headache-remedy',
    name: 'Peppermint & Sandalwood Oil',
    symptoms: ['Headache', 'Migraine', 'Stress'],
    ingredients: ['Peppermint oil', 'Sandalwood paste'],
    preparation: 'Apply to temples and forehead with gentle massage.',
    benefits: 'Cooling effect reduces pitta-type headaches.',
    precautions: 'Keep away from eyes.',
    severity: 'Moderate'
  },
  {
    id: 'joint-pain-remedy',
    name: 'Mahanarayan Oil Massage',
    symptoms: ['Joint Pain', 'Arthritis', 'Muscle Stiffness'],
    ingredients: ['Mahanarayan Oil', 'Warm compress'],
    preparation: 'Warm the oil and massage into joints. Follow with warm compress.',
    benefits: 'Reduces Vata in joints and improves mobility.',
    precautions: 'Consult a doctor if pain is acute or accompanied by fever.',
    severity: 'Severe'
  }
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'body-frame',
    question: 'How would you describe your body frame?',
    options: [
      { text: 'Thin, light, bony', dosha: 'Vata' },
      { text: 'Medium, athletic, well-proportioned', dosha: 'Pitta' },
      { text: 'Large, solid, heavy', dosha: 'Kapha' }
    ]
  },
  {
    id: 'skin-type',
    question: 'What is your skin type?',
    options: [
      { text: 'Dry, rough, cool', dosha: 'Vata' },
      { text: 'Oily, warm, sensitive', dosha: 'Pitta' },
      { text: 'Thick, smooth, moist', dosha: 'Kapha' }
    ]
  },
  {
    id: 'digestion',
    question: 'How is your digestion?',
    options: [
      { text: 'Irregular, prone to gas', dosha: 'Vata' },
      { text: 'Strong, intense hunger', dosha: 'Pitta' },
      { text: 'Slow, heavy after meals', dosha: 'Kapha' }
    ]
  }
];
