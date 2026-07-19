import type {
  Analysis,
  LessonPlan,
  StudentMaterials,
  LessonPlanActivity,
  RubricCriterion,
  Flashcard,
} from '@/types/analysis';

export interface GeneratedLesson {
  lessonPlan: LessonPlan;
  studentMaterials: StudentMaterials;
}

// ─── helpers ────────────────────────────────────────────────
function topWords(analysis: Analysis, n = 8): string[] {
  if (analysis.keyWords?.length) {
    return analysis.keyWords
      .sort((a, b) => b.count - a.count)
      .slice(0, n)
      .map((w) => w.word);
  }
  // fallback: extract from theme/idea
  return (analysis.theme + ' ' + analysis.idea)
    .split(/[\s,;.]+/)
    .filter((w) => w.length > 3)
    .slice(0, n);
}

function pickKeyThoughts(analysis: Analysis): string[] {
  const sources: string[] = [];
  if (analysis.literaryTheory?.theme)    sources.push(analysis.literaryTheory.theme);
  if (analysis.literaryTheory?.idea)     sources.push(analysis.literaryTheory.idea);
  if (analysis.philosophicalMeaning)     sources.push(analysis.philosophicalMeaning.slice(0, 180));
  if (analysis.mainThought)              sources.push(analysis.mainThought);
  if (analysis.idea)                     sources.push(analysis.idea);
  return sources.slice(0, 4);
}

// ─── Main generator ─────────────────────────────────────────
export function generateLesson(topic: string, analysis: Analysis): GeneratedLesson {
  const { author, title, genre, theme, idea, educationalValue, summary } = analysis;

  const grade = analysis.lessonPlan?.grade ?? '9';
  const kws   = topWords(analysis);

  // ── Objectives ──────────────────────────────────────────────
  const objectives: string[] = [
    `«${topic}» тақырыбы бойынша ${author} шығармашылығын зерттейді, негізгі ой мен идеяны анықтайды`,
    `${title} шығармасының тақырыбы мен идеясын (${theme.slice(0, 60)}…) салыстыра талдайды`,
    `Оқушы «${topic}» бойынша өз ойын жазбаша немесе ауызша дұрыс жеткізе алады`,
    `${genre} жанрының ерекшеліктерін ${author} шығармасы арқылы түсінеді`,
  ];

  // ── Activities ──────────────────────────────────────────────
  const activities: LessonPlanActivity[] = [
    {
      step: 1,
      name: 'Ұйымдастыру кезеңі',
      description:
        `Психологиялық ахуал қалыптастыру. Оқушыларға «${topic}» тақырыбы туралы алғашқы ой бөлісу сұрағы қойылады: ` +
        `«${author} деп кімді білесіз?» — «Think-Pair-Share» әдісі. (3 мин)`,
    },
    {
      step: 2,
      name: 'Үй тапсырмасын тексеру',
      description:
        `Алдыңғы сабақтан «${kws.slice(0, 3).join(', ')}» кілт сөздері бойынша ауызша сауалнама. ` +
        `2 оқушы тақтада жауап береді. (5 мин)`,
    },
    {
      step: 3,
      name: 'Жаңа тақырыпты меңгерту',
      description:
        `«${topic}» тақырыбы ашылады. Мұғалім ${title} шығармасының мазмұнын, ` +
        `идеясын (${idea.slice(0, 100)}…) түсіндіреді. Интерактивті тақта, сызба-кесте қолданылады. (15 мин)`,
    },
    {
      step: 4,
      name: 'Топтық жұмыс — талдау',
      description:
        `Оқушылар 4 топқа бөлінеді: 1-топ тақырыпты, 2-топ идеяны, 3-топ кейіпкерлерді, ` +
        `4-топ бейнелеу тілін талдайды. Нәтиже плакатқа жазылады. (10 мин)`,
    },
    {
      step: 5,
      name: 'Бекіту — жазба тапсырма',
      description:
        `Оқушылар «${topic}» тақырыбы бойынша 5-7 сөйлемнен тұратын шағын эссе немесе ` +
        `синквейн жазады. Бір-бірінің жұмысын «2 жұлдыз — 1 тілек» форматында бағалайды. (8 мин)`,
    },
    {
      step: 6,
      name: 'Рефлексия және үй тапсырмасы',
      description:
        `«Бүгін не үйрендім?» сұрағына жауап (Exit ticket). ` +
        `Үй тапсырмасы: ${title} шығармасынан «${topic}» тақырыбын дәлелдейтін 3 дәйексөз тауып келу. (4 мин)`,
    },
  ];

  // ── Assessment & descriptors ─────────────────────────────────
  const assessment =
    `Оқушы «${topic}» тақырыбы бойынша ${author} шығармасын талдай отырып, негізгі ой мен идеяны ` +
    `анықтайды. Жазбаша жұмысты «2 жұлдыз — 1 тілек» форматымен өзара бағалау жүргізіледі. ` +
    `Формативтік бағалау: сабақ барысында бақылау, қорытынды эссе немесе синквейн.`;

  const descriptors: string[] = [
    `«${topic}» тақырыбының мазмұнын өз сөзімен дұрыс айта алады`,
    `${title} шығармасының тақырыбы мен идеясын анықтап, дәлел келтіре алады`,
    `Шығармадан «${topic}» тақырыбын дәлелдейтін мысалдар таба алады`,
    `Топтық талқылауға белсене қатысып, өз пікірін жеткізе алады`,
    `Шағын эссе немесе синквейн жаза алады`,
  ];

  // ── Rubric ──────────────────────────────────────────────────
  const rubric: RubricCriterion[] = [
    {
      criterion: `«${topic}» тақырыбын түсіну`,
      '4': 'Толық, терең түсінеді; мысалдар мен дәйексөздер келтіреді',
      '3': 'Жалпы түсінеді; 1-2 мысал келтіреді',
      '2': 'Жартылай түсінеді; мысал жоқ',
      '1': 'Түсінбейді немесе жауап береді',
    },
    {
      criterion: 'Шығармамен байланыс',
      '4': `${title} шығармасынан нақты мысалдар, дәйексөздер алады`,
      '3': 'Жалпы байланыс орнатады',
      '2': 'Байланыс әлсіз',
      '1': 'Байланыс жоқ',
    },
    {
      criterion: 'Жазбаша тіл деңгейі',
      '4': 'Сауатты, бай тілмен, логикалық жазады',
      '3': 'Сауатты жазады, кейде қайталайды',
      '2': '1-2 қате, ой аяқталмаған',
      '1': 'Көп қате, ой жоқ',
    },
  ];

  // ── Lesson plan ─────────────────────────────────────────────
  const lessonPlan: LessonPlan = {
    subject: 'Қазақ әдебиеті',
    grade,
    duration: '45 минут',
    topic,
    objectives,
    activities,
    assessment,
    descriptors,
    rubric,
  };

  // ── Student materials ────────────────────────────────────────
  const flashcards: Flashcard[] = [
    {
      front: `«${topic}» дегенді қалай түсінесіз?`,
      back: idea.slice(0, 120) + (idea.length > 120 ? '…' : ''),
    },
    {
      front: `${author} кім?`,
      back: `${author} — қазақтың ұлы ${genre.toLowerCase()} жанрының өкілі. Кезеңі: ${analysis.period}.`,
    },
    {
      front: `«${title}» шығармасының негізгі тақырыбы?`,
      back: theme.slice(0, 140),
    },
    {
      front: `${title} шығармасының жанры мен бағыты?`,
      back: `Жанры: ${genre}. Бағыты: ${analysis.direction}. Ағымы: ${analysis.literaryMovement}.`,
    },
    {
      front: `«${topic}» тақырыбын 1 сөйлеммен тұжырымдаңыз`,
      back: analysis.mainThought?.slice(0, 140) ?? idea.slice(0, 140),
    },
  ];

  const studentSummary =
    (summary ? summary.slice(0, 300) + (summary.length > 300 ? '…' : '') + '\n\n' : '') +
    `«${topic}» тақырыбы бойынша: ${idea}` +
    (educationalValue ? `\n\nОқу маңызы: ${educationalValue.slice(0, 200)}` : '');

  const studentMaterials: StudentMaterials = {
    summary: studentSummary,
    keywords: kws,
    flashcards,
    keyThoughts: pickKeyThoughts(analysis),
  };

  return { lessonPlan, studentMaterials };
}
