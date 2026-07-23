import { db } from "..";
import {
  usersTable, coursesTable, lessonsTable, exercisesTable,
  vocabularyTable, grammarTable, achievementsTable, activityTable,
} from "../schema";

async function seed() {
  console.log("Seeding LMS data…");

  // ── Default user ──────────────────────────────────────────────────────────
  await db.insert(usersTable).values({
    id: 1,
    name: "Айдана Бекова",
    email: "aidana@example.com",
    role: "student",
    level: 3,
    xp: 1240,
    streak: 7,
    avatar: "А",
    bio: "Қазақ тілін жетілдіруге ұмтыламын",
    educationLevel: "grade9",
  }).onConflictDoNothing();

  // ── Courses ───────────────────────────────────────────────────────────────
  const courses = await db.insert(coursesTable).values([
    { title: "Қазақ тілінің негіздері", description: "Бастауыш сынып оқушыларына арналған қазақ тілінің негіздері", level: "grade1", category: "basics", duration: 120, difficulty: "beginner", xpReward: 200, coverColor: "#6366f1", coverIcon: "BookOpen", featured: true },
    { title: "Дыбыстар мен әріптер", description: "Қазақ алфавиті және дыбыстық жүйе", level: "grade2", category: "phonetics", duration: 90, difficulty: "beginner", xpReward: 180, coverColor: "#8b5cf6", coverIcon: "Music", featured: true },
    { title: "Сөз таптары", description: "Зат есім, сын есім, етістік — сөз таптарын меңгеру", level: "grade5", category: "grammar", duration: 150, difficulty: "intermediate", xpReward: 300, coverColor: "#0ea5e9", coverIcon: "Layers", featured: true },
    { title: "Синтаксис пен пунктуация", description: "Сөйлем мүшелері және тыныс белгілері", level: "grade8", category: "syntax", duration: 180, difficulty: "intermediate", xpReward: 350, coverColor: "#14b8a6", coverIcon: "AlignLeft", featured: true },
    { title: "Олимпиада дайындығы", description: "Республикалық олимпиадаға жан-жақты дайындық", level: "olympiad", category: "olympiad", duration: 300, difficulty: "advanced", xpReward: 600, coverColor: "#f59e0b", coverIcon: "Trophy", featured: true },
    { title: "Жазба жұмыстары", description: "Шығарма, мазмұндама, диктант жазу дағдылары", level: "grade10", category: "writing", duration: 200, difficulty: "advanced", xpReward: 400, coverColor: "#ef4444", coverIcon: "PenLine", featured: false },
    { title: "Мұғалімдерге арналған курс", description: "Қазақ тілін оқыту методикасы мен инновациялық тәсілдер", level: "teacher", category: "methodology", duration: 240, difficulty: "advanced", xpReward: 500, coverColor: "#ec4899", coverIcon: "GraduationCap", featured: false },
    { title: "Ғылыми стиль", description: "Академиялық жазу және ғылыми мақала құрастыру", level: "researcher", category: "academic", duration: 280, difficulty: "advanced", xpReward: 550, coverColor: "#84cc16", coverIcon: "FlaskConical", featured: false },
    { title: "Колледж бағдарламасы", description: "Орта кәсіптік білім беру деңгейіне арналған қазақ тілі", level: "college", category: "language", duration: 160, difficulty: "intermediate", xpReward: 320, coverColor: "#06b6d4", coverIcon: "School", featured: false },
    { title: "Жоғары оқу орны", description: "ЖОО студенттеріне арналған іскери қазақ тілі", level: "university", category: "business", duration: 200, difficulty: "advanced", xpReward: 450, coverColor: "#a78bfa", coverIcon: "Building2", featured: false },
  ]).returning();

  // ── Lessons ───────────────────────────────────────────────────────────────
  const lessons = await db.insert(lessonsTable).values([
    // Course 1: Basics
    { courseId: courses[0].id, title: "Алфавитпен танысу", type: "theory", order: 1, duration: 15, xpReward: 30, content: "Қазақ тілінің алфавиті 42 әріптен тұрады. Бүгін біз алғашқы 10 әріпті үйренеміз: А, Ә, Б, В, Г, Ғ, Д, Е, Ё, Ж." },
    { courseId: courses[0].id, title: "Дауысты дыбыстар", type: "theory", order: 2, duration: 12, xpReward: 25, content: "Қазақ тілінде 15 дауысты дыбыс бар: А, Ә, Е, И, І, О, Ө, У, Ұ, Ү, Ы. Олар сөздің буын жасайды." },
    { courseId: courses[0].id, title: "Дауыссыз дыбыстар", type: "theory", order: 3, duration: 12, xpReward: 25, content: "Дауыссыз дыбыстар: Б, В, Г, Ғ, Д, Ж, З, Й, К, Қ, Л, М, Н, Ң, П, Р, С, Т, У, Х, Ч, Ш, Щ." },
    { courseId: courses[0].id, title: "Алфавит жаттығулары", type: "practice", order: 4, duration: 20, xpReward: 40, content: "Алфавитті дұрыс оқу және жазу жаттығулары." },
    // Course 2: Grammar
    { courseId: courses[2].id, title: "Зат есім", type: "theory", order: 1, duration: 20, xpReward: 35, content: "Зат есім — заттың атын білдіретін сөз табы. Кім? Не? деген сұрақтарға жауап береді. Мысалы: бала, кітап, үй." },
    { courseId: courses[2].id, title: "Сын есім", type: "theory", order: 2, duration: 18, xpReward: 30, content: "Сын есім — заттың сынын, белгісін білдіреді. Қандай? деген сұраққа жауап береді. Мысалы: жақсы, үлкен, қызыл." },
    { courseId: courses[2].id, title: "Етістік", type: "theory", order: 3, duration: 22, xpReward: 40, content: "Етістік — іс-әрекетті, қимылды білдіреді. Не істейді? деген сұраққа жауап береді. Мысалы: оқиды, жазады, келеді." },
    { courseId: courses[2].id, title: "Сөз таптары жаттығуы", type: "practice", order: 4, duration: 25, xpReward: 50, content: "Сөз таптарын ажырата білу жаттығулары." },
    // Olympiad
    { courseId: courses[4].id, title: "Тіл тарихы", type: "theory", order: 1, duration: 30, xpReward: 60, content: "Қазақ тілінің тарихы мен даму кезеңдері. Түркі тілдері тобындағы орны." },
    { courseId: courses[4].id, title: "Диалектология", type: "theory", order: 2, duration: 25, xpReward: 55, content: "Қазақ тілінің диалектілері мен говорлары. Батыс, Шығыс және Оңтүстік диалектілер." },
  ]).returning();

  // ── Exercises ─────────────────────────────────────────────────────────────
  await db.insert(exercisesTable).values([
    { lessonId: lessons[0].id, type: "multiple_choice", question: "Қазақ алфавитінде неше әріп бар?", options: ["36", "39", "42", "45"], correctAnswer: "42", explanation: "Қазақ алфавиті 42 әріптен тұрады", order: 1 },
    { lessonId: lessons[0].id, type: "multiple_choice", question: "Алфавитте бірінші келетін әріп:", options: ["Ә", "А", "Б", "В"], correctAnswer: "А", explanation: "А — қазақ алфавитінің бірінші әрпі", order: 2 },
    { lessonId: lessons[0].id, type: "fill_blank", question: "Қазақ тілінің алфавиті ___ әріптен тұрады.", options: null, correctAnswer: "42", order: 3 },
    { lessonId: lessons[4].id, type: "multiple_choice", question: "'Кітап' сөзі қандай сөз табына жатады?", options: ["Сын есім", "Зат есім", "Етістік", "Үстеу"], correctAnswer: "Зат есім", explanation: "Кітап — зат есім, «не?» деген сұраққа жауап береді", order: 1 },
    { lessonId: lessons[4].id, type: "multiple_choice", question: "Зат есім қандай сұраққа жауап береді?", options: ["Қандай?", "Қалай?", "Кім? Не?", "Не істейді?"], correctAnswer: "Кім? Не?", order: 2 },
    { lessonId: lessons[5].id, type: "multiple_choice", question: "'Жақсы' сөзі қандай сөз табы?", options: ["Зат есім", "Сын есім", "Етістік", "Сан есім"], correctAnswer: "Сын есім", explanation: "Жақсы — сын есім, «қандай?» сұрағына жауап береді", order: 1 },
    { lessonId: lessons[6].id, type: "multiple_choice", question: "'Оқиды' сөзі қандай сөз табы?", options: ["Зат есім", "Сын есім", "Етістік", "Есімдік"], correctAnswer: "Етістік", explanation: "Оқиды — етістік, іс-әрекетті білдіреді", order: 1 },
    { lessonId: lessons[6].id, type: "translate", question: "Аудар: «Ол кітап оқиды»", options: null, correctAnswer: "Он читает книгу", order: 2 },
  ]);

  // ── Vocabulary ────────────────────────────────────────────────────────────
  await db.insert(vocabularyTable).values([
    // Family
    { kazakh: "Ана", russian: "Мать", english: "Mother", category: "family", level: "grade1", examples: ["Менің анам жақсы.", "Ана балаларын жақсы көреді."] },
    { kazakh: "Әке", russian: "Отец", english: "Father", category: "family", level: "grade1", examples: ["Менің әкем мұғалім.", "Әке жұмыстан келді."] },
    { kazakh: "Аға", russian: "Старший брат", english: "Older brother", category: "family", level: "grade1", examples: ["Менің ағам студент.", "Аға кітап оқиды."] },
    { kazakh: "Апа", russian: "Старшая сестра", english: "Older sister", category: "family", level: "grade1", examples: ["Апам мені жақсы көреді."] },
    { kazakh: "Іні", russian: "Младший брат", english: "Younger brother", category: "family", level: "grade2", examples: ["Менің інім 5 жаста."] },
    { kazakh: "Сіңлі", russian: "Младшая сестра", english: "Younger sister", category: "family", level: "grade2", examples: ["Сіңлім мектепте оқиды."] },
    { kazakh: "Ата", russian: "Дедушка", english: "Grandfather", category: "family", level: "grade1", examples: ["Атам ауылда тұрады."] },
    { kazakh: "Әже", russian: "Бабушка", english: "Grandmother", category: "family", level: "grade1", examples: ["Әжем баурсақ пісіреді."] },
    // Nature
    { kazakh: "Күн", russian: "Солнце / День", english: "Sun / Day", category: "nature", level: "grade1", examples: ["Күн жылы.", "Бүгін күн аспанда жарқырайды."] },
    { kazakh: "Ай", russian: "Луна / Месяц", english: "Moon / Month", category: "nature", level: "grade1", examples: ["Ай түнде жарқырайды."] },
    { kazakh: "Жұлдыз", russian: "Звезда", english: "Star", category: "nature", level: "grade2", examples: ["Аспанда жұлдыздар жарқырайды."] },
    { kazakh: "Өзен", russian: "Река", english: "River", category: "nature", level: "grade2", examples: ["Өзен ағып жатыр."] },
    { kazakh: "Тау", russian: "Гора", english: "Mountain", category: "nature", level: "grade2", examples: ["Алатау тауы биік."] },
    { kazakh: "Дала", russian: "Степь", english: "Steppe", category: "nature", level: "grade3", examples: ["Қазақ даласы кең."] },
    // Colors
    { kazakh: "Қызыл", russian: "Красный", english: "Red", category: "colors", level: "grade1", examples: ["Алма қызыл."] },
    { kazakh: "Көк", russian: "Синий/Голубой", english: "Blue/Sky blue", category: "colors", level: "grade1", examples: ["Аспан көк."] },
    { kazakh: "Жасыл", russian: "Зелёный", english: "Green", category: "colors", level: "grade1", examples: ["Шөп жасыл."] },
    { kazakh: "Сары", russian: "Жёлтый", english: "Yellow", category: "colors", level: "grade1", examples: ["Күн сары."] },
    { kazakh: "Ақ", russian: "Белый", english: "White", category: "colors", level: "grade1", examples: ["Қар ақ."] },
    { kazakh: "Қара", russian: "Чёрный", english: "Black", category: "colors", level: "grade1", examples: ["Түн қара."] },
    // School
    { kazakh: "Мектеп", russian: "Школа", english: "School", category: "school", level: "grade1", examples: ["Мен мектепке барамын."] },
    { kazakh: "Кітап", russian: "Книга", english: "Book", category: "school", level: "grade1", examples: ["Мен кітап оқимын."] },
    { kazakh: "Қалам", russian: "Ручка", english: "Pen", category: "school", level: "grade1", examples: ["Мен қаламмен жазамын."] },
    { kazakh: "Дәптер", russian: "Тетрадь", english: "Notebook", category: "school", level: "grade1", examples: ["Дәптерге жаздым."] },
    { kazakh: "Тақта", russian: "Доска", english: "Blackboard", category: "school", level: "grade1", examples: ["Мұғалім тақтаға жазды."] },
    { kazakh: "Мұғалім", russian: "Учитель", english: "Teacher", category: "school", level: "grade1", examples: ["Мұғалім сабақ береді."] },
    { kazakh: "Оқушы", russian: "Ученик", english: "Student", category: "school", level: "grade1", examples: ["Оқушы сабақ оқиды."] },
    // Body
    { kazakh: "Бас", russian: "Голова", english: "Head", category: "body", level: "grade2", examples: ["Менің басым ауырады."] },
    { kazakh: "Қол", russian: "Рука", english: "Hand/Arm", category: "body", level: "grade2", examples: ["Қолыңды жу!"] },
    { kazakh: "Аяқ", russian: "Нога", english: "Leg/Foot", category: "body", level: "grade2", examples: ["Аяғым ауырады."] },
    { kazakh: "Көз", russian: "Глаз", english: "Eye", category: "body", level: "grade2", examples: ["Менің көзім қоңыр."] },
    // Food
    { kazakh: "Нан", russian: "Хлеб", english: "Bread", category: "food", level: "grade1", examples: ["Нан дәмді."] },
    { kazakh: "Ет", russian: "Мясо", english: "Meat", category: "food", level: "grade1", examples: ["Бешбармақ — ет тағамы."] },
    { kazakh: "Сүт", russian: "Молоко", english: "Milk", category: "food", level: "grade1", examples: ["Сүт пайдалы."] },
    { kazakh: "Алма", russian: "Яблоко", english: "Apple", category: "food", level: "grade1", examples: ["Алма тәтті."] },
    { kazakh: "Су", russian: "Вода", english: "Water", category: "food", level: "grade1", examples: ["Таза су ішу керек."] },
  ]);

  // ── Grammar Rules ─────────────────────────────────────────────────────────
  await db.insert(grammarTable).values([
    {
      title: "Септік жалғаулары",
      level: "grade5",
      topic: "case",
      description: "Қазақ тілінде 7 септік бар. Септіктер зат есімнің басқа сөздермен байланысын білдіреді.",
      examples: [
        { kazakh: "Бала (Атау септік)", translation: "Ребёнок (Именительный)", highlight: "Бала" },
        { kazakh: "Баланың (Ілік септік)", translation: "Ребёнка (Родительный)", highlight: "Баланың" },
        { kazakh: "Балаға (Барыс септік)", translation: "Ребёнку (Дательный)", highlight: "Балаға" },
        { kazakh: "Баланы (Табыс септік)", translation: "Ребёнка (Винительный)", highlight: "Баланы" },
        { kazakh: "Баладан (Шығыс септік)", translation: "От ребёнка (Исходный)", highlight: "Баладан" },
        { kazakh: "Балада (Жатыс септік)", translation: "У ребёнка (Местный)", highlight: "Балада" },
        { kazakh: "Баламен (Көмектес септік)", translation: "С ребёнком (Творительный)", highlight: "Баламен" },
      ],
    },
    {
      title: "Етіс категориясы",
      level: "grade7",
      topic: "verb",
      description: "Қазақ тілінде етістіктің 5 етісі бар: ырықты, өздік, өзгелік, ортақ, ырықсыз.",
      examples: [
        { kazakh: "Ол кітап оқиды (ырықты)", translation: "Он читает книгу (активный залог)", highlight: "оқиды" },
        { kazakh: "Ол жуынады (өздік)", translation: "Он умывается (возвратный залог)", highlight: "жуынады" },
        { kazakh: "Ол баланы оқытады (өзгелік)", translation: "Он учит ребёнка (понудительный залог)", highlight: "оқытады" },
      ],
    },
    {
      title: "Үнді үндестік заңы",
      level: "grade6",
      topic: "phonetics",
      description: "Қазақ тілінде буын үндестігі заңы бойынша жалғаулар алдыңғы буынның дауысты дыбысына үйлесімді болады.",
      examples: [
        { kazakh: "бала + лар = балалар", translation: "ребёнок + мн.ч. = дети", highlight: "лар" },
        { kazakh: "үй + лер = үйлер", translation: "дом + мн.ч. = дома", highlight: "лер" },
        { kazakh: "кітап + тар = кітаптар", translation: "книга + мн.ч. = книги", highlight: "тар" },
      ],
    },
    {
      title: "Сан есімнің түрлері",
      level: "grade5",
      topic: "numeral",
      description: "Сан есім заттың санын, мөлшерін, реттік орнын білдіреді. Негізгі, реттік, жинақтық, болжалды, бөлшек сан есімдер болады.",
      examples: [
        { kazakh: "бес (негізгі)", translation: "пять (количественное)", highlight: "бес" },
        { kazakh: "бесінші (реттік)", translation: "пятый (порядковое)", highlight: "бесінші" },
        { kazakh: "бесеу (жинақтық)", translation: "пятеро (собирательное)", highlight: "бесеу" },
      ],
    },
    {
      title: "Шылаулар",
      level: "grade8",
      topic: "particle",
      description: "Шылаулар сөздер мен сөйлемдер арасындағы байланысты білдіреді. Септеулік, жалғаулық, демеулік шылаулар болады.",
      examples: [
        { kazakh: "Мен де барамын", translation: "Я тоже иду", highlight: "де" },
        { kazakh: "Ол үшін жасадым", translation: "Я сделал это ради него", highlight: "үшін" },
        { kazakh: "Бала сияқты", translation: "Как ребёнок", highlight: "сияқты" },
      ],
    },
    {
      title: "Күрделі сөйлем",
      level: "grade9",
      topic: "syntax",
      description: "Күрделі сөйлем екі немесе одан да көп жай сөйлемнің бірігуінен жасалады. Салалас және сабақтас күрделі сөйлемдер болады.",
      examples: [
        { kazakh: "Жаңбыр жауды, бірақ біз сыртқа шықтық.", translation: "Шёл дождь, но мы вышли на улицу.", highlight: "бірақ" },
        { kazakh: "Ол келгенде, мен оқып жатқанмын.", translation: "Когда он пришёл, я читал.", highlight: "келгенде" },
      ],
    },
  ]);

  // ── Achievements ──────────────────────────────────────────────────────────
  await db.insert(achievementsTable).values([
    { title: "Бірінші қадам", description: "Алғашқы сабақты аяқтаңыз", icon: "Star", xpRequired: 0, category: "learning", color: "#f59e0b" },
    { title: "Оқуға деген жігер", description: "3 күн қатарынан оқыңыз", icon: "Flame", xpRequired: 0, category: "streak", color: "#ef4444" },
    { title: "Сөзқор", description: "50 сөзді меңгеріңіз", icon: "BookMarked", xpRequired: 100, category: "vocabulary", color: "#8b5cf6" },
    { title: "Грамматик", description: "10 грамматика ережесін үйреніңіз", icon: "BookOpen", xpRequired: 200, category: "grammar", color: "#0ea5e9" },
    { title: "500 XP", description: "500 тәжірибе ұпай жинаңыз", icon: "Zap", xpRequired: 500, category: "xp", color: "#f59e0b" },
    { title: "Жеті күн", description: "7 күн қатарынан оқыңыз", icon: "Calendar", xpRequired: 0, category: "streak", color: "#10b981" },
    { title: "Курс чемпионы", description: "Толық курсты аяқтаңыз", icon: "Trophy", xpRequired: 0, category: "learning", color: "#f59e0b" },
    { title: "1000 XP", description: "1000 тәжірибе ұпай жинаңыз", icon: "Award", xpRequired: 1000, category: "xp", color: "#6366f1" },
    { title: "Сөздік қорыңды байыт", description: "100 сөзді меңгеріңіз", icon: "Library", xpRequired: 200, category: "vocabulary", color: "#ec4899" },
    { title: "Күнделікті оқырман", description: "30 күн қатарынан оқыңыз", icon: "Medal", xpRequired: 0, category: "streak", color: "#84cc16" },
  ]);

  // ── Seed activity ─────────────────────────────────────────────────────────
  await db.insert(activityTable).values([
    { userId: 1, type: "lesson_complete", title: "Алфавитпен танысу сабағы аяқталды", description: "100% нәтиже", xp: 30 },
    { userId: 1, type: "lesson_complete", title: "Дауысты дыбыстар сабағы аяқталды", description: "90% нәтиже", xp: 25 },
    { userId: 1, type: "achievement", title: "Жетістік алынды: Бірінші қадам", description: "Алғашқы сабақ аяқталды", xp: 50 },
    { userId: 1, type: "streak", title: "7 күндік серия!", description: "Тамаша! Жалғастыр!", xp: 70 },
    { userId: 1, type: "lesson_complete", title: "Зат есім сабағы аяқталды", description: "95% нәтиже", xp: 35 },
  ]);

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch(err => {
  console.error("Seed error:", err);
  process.exit(1);
});
