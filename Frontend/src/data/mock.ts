export type Category = {
  id: string
  name: string
}

export type Product = {
  id: string
  name: string
  subtitle: string
  description: string
  fullDescription: string
  price: number
  originalPrice?: number
  categoryId: string
  image: string
  badge?: 'bestseller' | 'new' | 'sale'
  composition: string[]
  care: string
  size: string
  sizes: { label: string; name: string; priceMultiplier: number }[]
}

export type Review = {
  id: string
  name: string
  date: string
  rating: number
  text: string
}

export type Collection = {
  id: string
  number: string
  title: string
  description: string
  image: string
  link: string
}

export const categories: Category[] = [
  { id: 'all', name: 'Все' },
  { id: 'roses', name: 'Розы' },
  { id: 'peonies', name: 'Пионы' },
  { id: 'author', name: 'Авторские' },
  { id: 'seasonal', name: 'Сезонные' },
  { id: 'bridal', name: 'Свадебные' },
]

const defaultSizes = [
  { label: 'S', name: 'Petit', priceMultiplier: 0.75 },
  { label: 'M', name: 'Moyen', priceMultiplier: 1 },
  { label: 'L', name: 'Grand', priceMultiplier: 1.4 },
]

export const products: Product[] = [
  {
    id: '1',
    name: 'Le Printemps',
    subtitle: 'Весна',
    description: 'Нежные французские пионы с ранункулюсами и эвкалиптом.',
    fullDescription: 'Букет, вдохновлённый первыми днями весны в Провансе. Нежные пионы в окружении ранункулюсов и эвкалипта создают композицию, наполненную светом и свежестью. Каждый цветок отобран вручную.',
    price: 12500,
    categoryId: 'peonies',
    image: '/ff1.png',
    badge: 'bestseller',
    composition: ['Пионы французские — 7 шт.', 'Ранункулюс — 5 шт.', 'Эвкалипт Парвифолия', 'Сезонная зелень'],
    care: 'Подрезайте стебли на 1–2 см под углом 45° перед размещением в воде. Меняйте воду каждые 2 дня. Держите вдали от прямых солнечных лучей и сквозняков.',
    size: '45–50 см',
    sizes: defaultSizes,
  },
  {
    id: '2',
    name: 'Blanc Royal',
    subtitle: 'Белый Роял',
    description: 'Монобукет из белоснежных роз премиум-класса.',
    fullDescription: 'Безупречный монобукет из белых роз сорта Playa Blanca — воплощение чистоты и аристократической элегантности. Каждая роза проходит строгий отбор по форме бутона и свежести.',
    price: 15800,
    categoryId: 'roses',
    image: '/fl1.png',
    composition: ['Розы Playa Blanca — 25 шт.', 'Зелень руски', 'Шёлковая лента'],
    care: 'Держите вдали от фруктов — этилен ускоряет увядание. Срезайте стебли каждые 2 дня. Добавьте питательный раствор в воду.',
    size: '55–60 см',
    sizes: defaultSizes,
  },
  {
    id: '3',
    name: 'Élégance Sombre',
    subtitle: 'Тёмная Элегантность',
    description: 'Бордовые георгины с персиковыми ранункулюсами.',
    fullDescription: 'Контрастная композиция, где глубокие бордовые георгины встречаются с нежными персиковыми ранункулюсами. Букет для тех, кто ценит смелость и утончённость одновременно.',
    price: 18000,
    originalPrice: 21000,
    categoryId: 'author',
    image: '/fl4.png',
    badge: 'sale',
    composition: ['Георгины бордовые — 5 шт.', 'Ранункулюс персиковый — 7 шт.', 'Скабиоза', 'Матовая ваза'],
    care: 'Георгины чувствительны к теплу. Держите букет в прохладном месте. Меняйте воду ежедневно.',
    size: '50–55 см',
    sizes: defaultSizes,
  },
  {
    id: '4',
    name: 'Jardin Secret',
    subtitle: 'Тайный Сад',
    description: 'Авторская сборная композиция в стиле английского сада.',
    fullDescription: 'Пышная композиция, вдохновлённая тайными садами английских поместий. Розы, гортензия и сезонная зелень создают объём и глубину, приглашая погрузиться в мир природной красоты.',
    price: 9800,
    categoryId: 'author',
    image: '/ff2.png',
    badge: 'new',
    composition: ['Розы садовые — 5 шт.', 'Гортензия — 2 шт.', 'Лизиантус — 3 шт.', 'Эвкалипт', 'Вибурнум'],
    care: 'Меняйте воду каждые 2 дня. Подрезайте стебли под водой. Держите вдали от прямых лучей.',
    size: '55–60 см',
    sizes: defaultSizes,
  },
  {
    id: '5',
    name: 'Rose de Soie',
    subtitle: 'Шёлковая Роза',
    description: 'Розы David Austin с бархатными лепестками и тонким ароматом.',
    fullDescription: 'Роскошный букет из английских роз David Austin — жемчужина нашего ателье. Бархатные лепестки и сложный аромат делают каждый цветок произведением искусства.',
    price: 22500,
    categoryId: 'roses',
    image: '/fl2.jpg',
    badge: 'bestseller',
    composition: ['Розы David Austin — 15 шт.', 'Эвкалипт Цинерея', 'Аспарагус перистый', 'Шёлковая лента ручной работы'],
    care: 'Срезайте стебли под углом 45°. Добавьте специальный питательный раствор. Меняйте воду каждые 2 дня.',
    size: '50–55 см',
    sizes: defaultSizes,
  },
  {
    id: '6',
    name: 'Soleil d\'Or',
    subtitle: 'Золотое Солнце',
    description: 'Солнечные тюльпаны и нарциссы — дыхание весны.',
    fullDescription: 'Жизнерадостный букет из золотистых тюльпанов и нарциссов. Каждый цветок несёт в себе энергию солнца и обещание нового дня. Идеален для тех моментов, когда хочется подарить тепло.',
    price: 7500,
    categoryId: 'seasonal',
    image: '/fl3.png',
    badge: 'new',
    composition: ['Тюльпаны золотистые — 15 шт.', 'Нарциссы — 7 шт.', 'Зелень питтоспорума', 'Рафия натуральная'],
    care: 'Тюльпаны продолжают расти в вазе. Подрезайте стебли каждый день. Держите в прохладном месте.',
    size: '40–45 см',
    sizes: defaultSizes,
  },
  {
    id: '7',
    name: 'Rêve de Lavande',
    subtitle: 'Лавандовая Мечта',
    description: 'Лавандовые оттенки — от пионов до эустомы.',
    fullDescription: 'Монохромная палитра лавандовых оттенков создаёт атмосферу прованского вечера. Нежные пионы, эустома и матиола сливаются в единую мелодию спокойствия и романтики.',
    price: 11200,
    categoryId: 'peonies',
    image: '/ff1.png',
    composition: ['Пионы лавандовые — 5 шт.', 'Эустома — 5 шт.', 'Матиола — 3 шт.', 'Лаванда сухоцвет'],
    care: 'Пионы раскрываются постепенно. Держите в прохладном помещении для более долгого цветения.',
    size: '45–50 см',
    sizes: defaultSizes,
  },
  {
    id: '8',
    name: 'La Belle Époque',
    subtitle: 'Прекрасная Эпоха',
    description: 'Роскошная композиция для особых случаев.',
    fullDescription: 'Наш авторский шедевр — композиция La Belle Époque объединяет редкие сорта роз, пионов и гортензий. Создана для моментов, которые войдут в историю. Роскошь, застывшая в лепестках.',
    price: 28000,
    categoryId: 'bridal',
    image: '/fl4.png',
    badge: 'bestseller',
    composition: ['Розы Juliet — 7 шт.', 'Пионы — 5 шт.', 'Гортензия — 3 шт.', 'Эвкалипт', 'Астильба', 'Шёлковые ленты'],
    care: 'Композиция создана на флористической губке. Поливайте основу ежедневно. Храните при температуре 18–20°С.',
    size: '60–65 см',
    sizes: defaultSizes,
  },
]

export const collections: Collection[] = [
  {
    id: 'c1',
    number: '01',
    title: 'Авторские Букеты',
    description: 'Уникальные композиции от наших флористов, созданные с безупречным мастерством.',
    image: '/ff1.png',
    link: '/catalog?cat=author',
  },
  {
    id: 'c2',
    number: '02',
    title: 'Свадебная Флористика',
    description: 'Утончённые букеты и декор для самого важного дня.',
    image: '/fl1.png',
    link: '/catalog?cat=bridal',
  },
  {
    id: 'c3',
    number: '03',
    title: 'Розы Премиум',
    description: 'Коллекция редких сортов роз со всего мира.',
    image: '/fl2.jpg',
    link: '/catalog?cat=roses',
  },
  {
    id: 'c4',
    number: '04',
    title: 'Сезонная Коллекция',
    description: 'Букеты, вдохновлённые красками текущего сезона.',
    image: '/fl3.png',
    link: '/catalog?cat=seasonal',
  },
]

export const reviews: Review[] = [
  {
    id: '1',
    name: 'Анастасия М.',
    date: '12 июня 2026',
    rating: 5,
    text: 'Le Printemps — настоящее произведение искусства. Пионы были невероятно свежими, а аромат наполнил весь дом. Спасибо L\'Art de Fleur за волшебство!',
  },
  {
    id: '2',
    name: 'Дмитрий К.',
    date: '3 июня 2026',
    rating: 5,
    text: 'Заказал Rose de Soie для жены на годовщину. Розы David Austin — это что-то невероятное. Букет простоял 12 дней. Доставка точно в срок.',
  },
  {
    id: '3',
    name: 'Елена Р.',
    date: '28 мая 2026',
    rating: 5,
    text: 'Наконец нашла место, где понимают, что цветы — это не просто подарок, а эмоция. Каждый букет как маленькая история. Рекомендую всем.',
  },
]

export const shopInfo = {
  name: "L'Art de Fleur",
  tagline: 'Элегантность в каждом лепестке',
  motto: 'Quiet Luxury',
  description: 'Цветочное ателье, где каждая композиция — результат безупречного мастерства и любви к ботанической красоте. Работаем с 2019 года.',
  phone: '+7 (495) 123-45-67',
  email: 'atelier@lartdefleur.ru',
  address: 'Москва, Патриаршие пруды, Малая Бронная 15',
  hours: 'Ежедневно: 9:00–21:00',
  delivery: {
    free: 'Бесплатно от 10 000 ₽',
    standard: '500 ₽ по Москве',
    time: '2–4 часа',
    express: 'Экспресс за 1 час — 1 000 ₽',
  },
  promises: [
    { title: 'Бесплатная доставка', description: 'По центру Москвы в течение 2 часов' },
    { title: 'Гарантия свежести', description: 'Каждый цветок проходит контроль качества' },
  ],
}
