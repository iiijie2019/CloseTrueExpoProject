import type { Localized } from '../domain/models';

export type SentenceRole = 'subject' | 'verb' | 'object' | 'time' | 'place' | 'source' | 'destination' | 'manner' | 'frequency' | 'auxiliary' | 'question' | 'complement';
export type SentenceTopic = 'basics' | 'time' | 'place' | 'questions';
export interface SentenceChunk { id: string; text: string; meaning: Localized; role: SentenceRole; explanation: Localized }
export interface SentenceOrder { ids: string[]; note: Localized; commaAfter?: string }
export interface SentenceLesson {
  id: string; title: Localized; topic: SentenceTopic; translation: string; summary: Localized;
  chunks: SentenceChunk[]; orders: SentenceOrder[]; punctuation?: '?'; tip: Localized;
}

const l = (zh: string, en: string): Localized => ({ zh, en });
const chunk = (id: string, text: string, role: SentenceRole, meaning: Localized, explanation: Localized): SentenceChunk => ({ id, text, role, meaning, explanation });
const order = (ids: string[], note: Localized, commaAfter?: string): SentenceOrder => ({ ids, note, ...(commaAfter ? { commaAfter } : {}) });

export const sentenceRoles: Record<SentenceRole, { label: Localized; question: Localized; color: 'mint' | 'peach' | 'blue' | 'lavender' }> = {
  subject: { label: l('主语', 'Subject'), question: l('谁／什么？', 'Who or what?'), color: 'mint' },
  verb: { label: l('动词', 'Verb'), question: l('做什么／是什么状态？', 'What action or state?'), color: 'peach' },
  object: { label: l('宾语', 'Object'), question: l('动作涉及谁／什么？', 'Whom or what?'), color: 'blue' },
  time: { label: l('时间', 'Time'), question: l('什么时候？', 'When?'), color: 'lavender' },
  place: { label: l('地点', 'Place'), question: l('在哪里？', 'Where?'), color: 'blue' },
  source: { label: l('来源／起点', 'Source'), question: l('来自哪里？', 'Where from?'), color: 'lavender' },
  destination: { label: l('目的地', 'Destination'), question: l('到哪里去？', 'Where to?'), color: 'blue' },
  manner: { label: l('方式', 'Manner'), question: l('以什么方式？', 'How?'), color: 'lavender' },
  frequency: { label: l('频率', 'Frequency'), question: l('多常发生？', 'How often?'), color: 'lavender' },
  auxiliary: { label: l('助动词', 'Auxiliary'), question: l('怎样组成疑问句？', 'What helps form the question?'), color: 'peach' },
  question: { label: l('疑问词', 'Question word'), question: l('在问哪类信息？', 'What information is missing?'), color: 'lavender' },
  complement: { label: l('表语', 'Complement'), question: l('主语是什么／怎么样？', 'What is the subject like?'), color: 'blue' },
};

export const sentenceTopics: Record<SentenceTopic, Localized> = {
  basics: l('句子骨架', 'Sentence basics'), time: l('时间与时态', 'Time & tense'), place: l('地点与来源', 'Place & source'), questions: l('提问方式', 'Questions'),
};

// Original teaching examples. Roles mix syntax (subject/object) and meaning (time/source)
// for beginner-friendly phrase analysis; they are not part-of-speech classifications.
export const sentences: SentenceLesson[] = [
  {
    id: 'evening-reading', title: l('先说谁，再说做什么', 'Who does what?'), topic: 'basics', translation: '我每天晚上读书。',
    summary: l('主语 + 动词 + 宾语，再补充时间。', 'Start with subject + verb + object, then add a time.'),
    chunks: [
      chunk('s', 'I', 'subject', l('我', 'the speaker'), l('I 是动作的发出者，放在陈述句的动词前。', 'I identifies the person doing the action and comes before the verb in this statement.')),
      chunk('v', 'read', 'verb', l('读', 'look at and understand written words'), l('一般现在时 read 表示习惯。这里与 I 搭配，不加 -s。', 'The present simple read describes a habit. With I, use read without -s.')),
      chunk('o', 'books', 'object', l('书', 'books in general'), l('books 回答“读什么”，跟在及物动词 read 后。', 'Books answers “read what?” and follows the transitive verb read.')),
      chunk('t', 'every evening', 'time', l('每天晚上', 'each evening'), l('every evening 是完整时间短语，通常放在句末，也可以置于句首。', 'Every evening is a complete time phrase. It can go at the end or the beginning.')),
    ],
    orders: [order(['s', 'v', 'o', 't'], l('先表达主要动作，最后交代时间。', 'Give the main action first, then the time.')), order(['t', 's', 'v', 'o'], l('时间放句首，为整句话设置背景。', 'A fronted time phrase sets the scene.'), 't')],
    tip: l('英语陈述句常用“谁 → 做什么 → 对象”的骨架；时间可以灵活移动，但不要把 read 和 books 随意拆开。', 'Many English statements use “who → action → object.” Time can move, but keep read and books together here.'),
  },
  {
    id: 'study-at-home', title: l('地点和时间怎么排', 'Place before time'), topic: 'place', translation: '我们星期天在家学英语。',
    summary: l('常见顺序：动作 + 地点 + 时间。', 'A common order is action + place + time.'),
    chunks: [
      chunk('s', 'we', 'subject', l('我们', 'the speaker and others'), l('we 是主语，指出谁在学习。', 'We is the subject: the people who study.')),
      chunk('v', 'study', 'verb', l('学习', 'spend time learning'), l('与 we 搭配的一般现在时动词用原形 study。', 'Use the base form study in the present simple with we.')),
      chunk('o', 'English', 'object', l('英语', 'the English language'), l('English 是学习的内容；语言名称首字母大写。', 'English is what we study. Language names start with a capital letter.')),
      chunk('p', 'at home', 'place', l('在家', 'in our home'), l('at home 是地点短语。这里不说 at the home。', 'At home is a place phrase. No article is needed in this expression.')),
      chunk('t', 'on Sundays', 'time', l('每逢星期天', 'every Sunday'), l('on + 星期表示在某天；Sundays 的复数在这里表达习惯。', 'Use on with days. The plural Sundays describes a repeated habit here.')),
    ],
    orders: [order(['s', 'v', 'o', 'p', 't'], l('先地点、后时间是自然的常见顺序。', 'Place before time is a natural common order.')), order(['t', 's', 'v', 'o', 'p'], l('也可以先交代星期天这个时间背景。', 'You can also set the time at the beginning.'), 't')],
    tip: l('地点在前、时间在后是实用起点，并非所有句子都只能这样排列。先看清每个短语的整体作用。', 'Place before time is a useful starting point, not an absolute rule. Notice how each phrase works as a unit.'),
  },
  {
    id: 'comes-from', title: l('用 from 说明来自哪里', 'Say where someone is from'), topic: 'place', translation: '玛雅来自加拿大。',
    summary: l('主语 + comes + from 来源。', 'Subject + comes + from a place of origin.'),
    chunks: [
      chunk('s', 'Maya', 'subject', l('玛雅', 'a person named Maya'), l('Maya 是第三人称单数主语。人名首字母大写。', 'Maya is a third-person singular subject. Names begin with a capital letter.')),
      chunk('v', 'comes', 'verb', l('来自（与 from 搭配）', 'has an origin, with from'), l('一般现在时中，Maya 搭配 comes。come from 合起来表示“来自”。', 'In the present simple, Maya takes comes. Come from together expresses origin.')),
      chunk('src', 'from Canada', 'source', l('来自加拿大', 'from the country Canada'), l('from 是介词，后接来源地 Canada；“来源”是短语含义，不是词性。', 'From is a preposition followed by Canada. “Source” describes the phrase’s meaning, not its part of speech.')),
    ],
    orders: [order(['s', 'v', 'src'], l('先介绍人物，再用 comes from 连接来源地。', 'Name the person, then connect the origin with comes from.'))],
    tip: l('也可以说 Maya is from Canada，但这需要把 comes 换成 is，并不是只移动现有词块。', 'Maya is from Canada is another option, but it changes comes to is rather than merely moving the same chunks.'),
  },
  {
    id: 'train-route', title: l('从哪里，到哪里', 'From one place to another'), topic: 'place', translation: '这班火车每天早上从牛津开往伦敦。',
    summary: l('from 起点 + to 终点，把一条路线说完整。', 'Use from for the starting point and to for the destination.'),
    chunks: [
      chunk('s', 'this train', 'subject', l('这班火车', 'the train being discussed'), l('this train 是一个完整名词短语，作为单数主语。', 'This train is one noun phrase and a singular subject.')),
      chunk('v', 'travels', 'verb', l('行驶', 'moves between places'), l('单数主语搭配 travels；这里描述固定运行安排。', 'The singular subject takes travels, describing a regular service.')),
      chunk('src', 'from Oxford', 'source', l('从牛津', 'starting in Oxford'), l('from 引出旅程起点。介词和地名一起组成词块。', 'From introduces the starting point. Keep the preposition with its place name.')),
      chunk('dest', 'to London', 'destination', l('到伦敦', 'ending in London'), l('to 引出目的地，和 from Oxford 一起描述路线。', 'To introduces the destination and completes the route begun with from Oxford.')),
      chunk('t', 'every morning', 'time', l('每天早上', 'each morning'), l('every morning 说明行程何时重复发生，不需要再加 on。', 'Every morning describes when the trip repeats. Do not add on before every.')),
    ],
    orders: [order(['s', 'v', 'src', 'dest', 't'], l('先介绍路线，再补充运行时间。', 'Give the route first, then its regular time.')), order(['t', 's', 'v', 'src', 'dest'], l('先说明每天早上，再介绍整条路线。', 'Set the time first, then describe the route.'), 't')],
    tip: l('from A to B 常作为一组理解。from 还可以表示材料、来源等；本句专门学习出发地点。', 'Learn from A to B as a useful pair. From has other uses, but here it marks the starting place.'),
  },
  {
    id: 'usually-tea', title: l('usually 应该放哪里', 'Find a place for usually'), topic: 'time', translation: '她通常在午饭后喝茶。',
    summary: l('频率副词通常放在普通实义动词前。', 'Frequency adverbs often come before a main lexical verb.'),
    chunks: [
      chunk('s', 'she', 'subject', l('她', 'the woman being discussed'), l('she 是第三人称单数主语。', 'She is a third-person singular subject.')),
      chunk('f', 'usually', 'frequency', l('通常', 'on most occasions'), l('本句把 usually 放在主语 she 与实义动词 drinks 之间。', 'Here, usually goes between the subject she and the main verb drinks.')),
      chunk('v', 'drinks', 'verb', l('喝', 'takes liquid into the mouth'), l('she 后用 drinks，词尾 -s 表示一般现在时的第三人称单数。', 'With she, drinks has the third-person singular -s of the present simple.')),
      chunk('o', 'tea', 'object', l('茶', 'a drink made with tea leaves'), l('tea 是 drinks 的宾语，指喝的东西。', 'Tea is the object of drinks: what she drinks.')),
      chunk('t', 'after lunch', 'time', l('午饭后', 'following the midday meal'), l('after lunch 说明相对于午饭的时间，保持为一个词块。', 'After lunch gives a time relative to a meal and stays together as a phrase.')),
    ],
    orders: [order(['s', 'f', 'v', 'o', 't'], l('usually 放在 drinks 前，具体时间放在句末。', 'Usually comes before drinks; the specific time comes last.')), order(['t', 's', 'f', 'v', 'o'], l('时间放到句首，usually 仍可留在 drinks 前。', 'Front the time phrase while leaving usually before drinks.'), 't')],
    tip: l('这是普通实义动词的常见位置。与 be 搭配时常放在 be 后，如 She is usually busy。', 'This is a common position with lexical verbs. With be, usually often follows it: She is usually busy.'),
  },
  {
    id: 'garden-reading', title: l('把正在进行的动作连起来', 'Keep the verb phrase together'), topic: 'place', translation: '利奥正在花园里读一本书。',
    summary: l('is + -ing 作为动词词块，表达正在进行。', 'Treat is + -ing as a verb phrase for an action in progress.'),
    chunks: [
      chunk('s', 'Leo', 'subject', l('利奥', 'a person named Leo'), l('Leo 是句子的主语，与 is 搭配。', 'Leo is the subject and takes is.')),
      chunk('v', 'is reading', 'verb', l('正在读', 'is in the middle of reading'), l('is 是助动词，reading 是现在分词；本课把二者合为动词词块。', 'Is is an auxiliary and reading is a present participle. This lesson groups them as one verb phrase.')),
      chunk('o', 'a book', 'object', l('一本书', 'one book'), l('a book 是宾语。a 和 book 一起构成名词短语。', 'A book is the object. The article and noun form one noun phrase.')),
      chunk('p', 'in the garden', 'place', l('在花园里', 'inside the garden'), l('in the garden 交代读书地点，通常可以放在句末。', 'In the garden locates the action and naturally goes at the end.')),
    ],
    orders: [order(['s', 'v', 'o', 'p'], l('先介绍正在进行的动作，再说明地点。', 'Describe the action in progress, then its location.')), order(['p', 's', 'v', 'o'], l('地点也可以前置，为动作设置场景。', 'The place can also come first to set the scene.'), 'p')],
    tip: l('比较 Leo reads（习惯）与 Leo is reading（这里指正在读）。动词形式和时间信息共同表达意思。', 'Compare Leo reads, a habit, with Leo is reading, an action in progress here. Verb forms and time context work together.'),
  },
  {
    id: 'museum-yesterday', title: l('时间词与过去式', 'Match a past time with a past verb'), topic: 'time', translation: '我们昨天参观了博物馆。',
    summary: l('yesterday 表示过去，visit 变为 visited。', 'Yesterday refers to the past; visit becomes visited.'),
    chunks: [
      chunk('s', 'we', 'subject', l('我们', 'the speaker and others'), l('we 仍然放在陈述句动词前。', 'We still comes before the verb in the statement.')),
      chunk('v', 'visited', 'verb', l('参观了', 'went to see a place'), l('visit 的规则过去式是 visited，用来讲已经发生的事。', 'Visited is the regular past form of visit and describes a completed past event.')),
      chunk('o', 'the museum', 'object', l('博物馆', 'the museum in context'), l('visit 是及物动词，可直接接 the museum，不加 to。', 'Visit is transitive and directly takes the museum without to.')),
      chunk('t', 'yesterday', 'time', l('昨天', 'the day before today'), l('yesterday 单独就能表示时间，无需 in、on 或 at。', 'Yesterday expresses time on its own; no in, on, or at is needed.')),
    ],
    orders: [order(['s', 'v', 'o', 't'], l('过去的动作在前，yesterday 放句末。', 'State the past action and put yesterday last.')), order(['t', 's', 'v', 'o'], l('把 yesterday 放在句首也很自然。', 'Yesterday also works naturally at the beginning.'), 't')],
    tip: l('时间短语的移动不会把 visited 变回 visit；语序与时态是两个需要一起考虑的层面。', 'Moving the time phrase does not change visited back to visit. Word order and tense work together.'),
  },
  {
    id: 'station-tomorrow', title: l('安排将来的见面', 'Talk about a future meeting'), topic: 'time', translation: '他们明天将在车站与我们见面。',
    summary: l('will + 动词原形，再补充地点和时间。', 'Use will + a base verb, then add place and time.'),
    chunks: [
      chunk('s', 'they', 'subject', l('他们', 'the people being discussed'), l('they 表示进行见面动作的人。', 'They identifies the people who will meet us.')),
      chunk('v', 'will meet', 'verb', l('将见面', 'will come together with someone'), l('will 后用动词原形 meet。本课把它们合为一个动词词块。', 'Will is followed by the base form meet. They form one verb chunk in this lesson.')),
      chunk('o', 'us', 'object', l('我们（宾格）', 'the speaker and others, as an object'), l('动词 meet 后用宾格 us，不能用主格 we。', 'Use the object form us after meet, not the subject form we.')),
      chunk('p', 'at the station', 'place', l('在车站', 'at the station being discussed'), l('at the station 标出见面的地点。', 'At the station identifies the meeting place.')),
      chunk('t', 'tomorrow', 'time', l('明天', 'the day after today'), l('tomorrow 直接表示时间，不需要前加 on。', 'Tomorrow gives the time directly without on.')),
    ],
    orders: [order(['s', 'v', 'o', 'p', 't'], l('先说和谁见面，再说地点、时间。', 'Say whom they will meet, then where and when.')), order(['t', 's', 'v', 'o', 'p'], l('也可以先说 tomorrow，再给出见面安排。', 'You can also start with tomorrow, then describe the meeting.'), 't')],
    tip: l('will meet 只是表达未来的一种方式。本课专注词块顺序；实际表达还可使用 be going to 等结构。', 'Will meet is one way to talk about the future. This lesson focuses on phrase order; other structures also express future plans.'),
  },
  {
    id: 'speak-clearly', title: l('在动作后补充方式', 'Explain how an action happens'), topic: 'basics', translation: '艾娃说英语很清楚。',
    summary: l('主语 + 动词 + 宾语 + 方式。', 'Subject + verb + object + manner.'),
    chunks: [
      chunk('s', 'Ava', 'subject', l('艾娃', 'a person named Ava'), l('Ava 是进行说话动作的主语。', 'Ava is the subject who does the speaking.')),
      chunk('v', 'speaks', 'verb', l('说', 'uses a language'), l('Ava 是单数，因此一般现在时使用 speaks。', 'Ava is singular, so the present simple verb is speaks.')),
      chunk('o', 'English', 'object', l('英语', 'the English language'), l('English 回答“说什么语言”。', 'English answers which language she speaks.')),
      chunk('m', 'clearly', 'manner', l('清楚地', 'in an easy-to-understand way'), l('clearly 是方式副词，说明说话的方式；这里放在宾语之后。', 'Clearly is a manner adverb describing how she speaks. Here it follows the object.')),
    ],
    orders: [order(['s', 'v', 'o', 'm'], l('保持 speaks English 相连，再加 clearly 描述方式。', 'Keep speaks English together, then add clearly to describe manner.'))],
    tip: l('方式副词可以有其他位置，也可能改变强调点。本练习采用句末 clearly，避免把它插进动词和宾语之间。', 'Manner adverbs can have other positions and change emphasis. This exercise uses final clearly and keeps the verb beside its object.'),
  },
  {
    id: 'where-live', title: l('疑问词站在句首', 'Put the question word first'), topic: 'questions', translation: '你住在哪里？', punctuation: '?',
    summary: l('Where + do + 主语 + 动词原形？', 'Where + do + subject + base verb?'),
    chunks: [
      chunk('q', 'where', 'question', l('哪里', 'in what place'), l('Where 放在句首，表明要询问地点。', 'Where goes first to ask for a place.')),
      chunk('a', 'do', 'auxiliary', l('帮助构成疑问句', 'helps form the question'), l('do 在这里是助动词，放在主语前，并不翻译成“做”。', 'Do is an auxiliary here. It comes before the subject and does not mean “perform.”')),
      chunk('s', 'you', 'subject', l('你', 'the person being asked'), l('主语 you 位于助动词 do 后、实义动词 live 前。', 'The subject you comes after do and before the main verb live.')),
      chunk('v', 'live', 'verb', l('居住', 'have your home somewhere'), l('do 后的实义动词用原形 live。', 'The main verb uses its base form live after do.')),
    ],
    orders: [order(['q', 'a', 's', 'v'], l('疑问词 → 助动词 → 主语 → 动词原形。', 'Question word → auxiliary → subject → base verb.'))],
    tip: l('这一结构用于询问地点。不是所有特殊疑问句都加 do，例如 Who lives here? 中 who 本身就是主语。', 'This pattern asks about place. Not every wh-question needs do: in Who lives here?, who itself is the subject.'),
  },
  {
    id: 'did-learn', title: l('过去的事怎么提问', 'Ask about a past action'), topic: 'questions', translation: '你昨天学了这些单词吗？', punctuation: '?',
    summary: l('Did + 主语 + 动词原形 + 宾语 + 时间？', 'Did + subject + base verb + object + time?'),
    chunks: [
      chunk('a', 'did', 'auxiliary', l('过去时疑问助动词', 'the past-tense question auxiliary'), l('did 把过去时和疑问结构一起带入句子，放在主语前。', 'Did carries the past tense and forms a question before the subject.')),
      chunk('s', 'you', 'subject', l('你', 'the person being asked'), l('主语 you 跟在助动词 did 后面。', 'The subject you follows the auxiliary did.')),
      chunk('v', 'learn', 'verb', l('学习', 'gain knowledge of something'), l('did 已表达过去时，所以后面的 learn 用原形，而非 learned。', 'Did already marks the past, so use the base form learn rather than learned.')),
      chunk('o', 'these words', 'object', l('这些单词', 'the words being discussed'), l('these words 是宾语；复数 words 搭配 these。', 'These words is the object. The plural noun words takes these.')),
      chunk('t', 'yesterday', 'time', l('昨天', 'the day before today'), l('yesterday 指明提问涉及哪一天。', 'Yesterday identifies the day the question is about.')),
    ],
    orders: [order(['a', 's', 'v', 'o', 't'], l('本课使用 did 开头的常见一般疑问句顺序。', 'This lesson uses the common yes/no question order starting with did.'))],
    tip: l('肯定陈述句是 You learned these words yesterday；提问时改为 Did you learn…?，不要重复标记过去式。', 'The statement is You learned these words yesterday. The question is Did you learn…? Do not mark the past on both verbs.'),
  },
  {
    id: 'useful-lesson', title: l('描述“是什么／怎么样”', 'Describe a state or quality'), topic: 'basics', translation: '这节课很有用。',
    summary: l('主语 + 系动词 + 表语，不一定需要动作宾语。', 'Subject + linking verb + complement: a sentence can describe a quality.'),
    chunks: [
      chunk('s', 'this lesson', 'subject', l('这节课', 'the lesson being discussed'), l('this lesson 是被描述的事物，作为单数主语。', 'This lesson names what is being described and is a singular subject.')),
      chunk('v', 'is', 'verb', l('是／处于某种状态', 'links the subject to a description'), l('is 在这里是系动词，连接主语和描述它的形容词。', 'Is is a linking verb here, connecting the subject to an adjective that describes it.')),
      chunk('c', 'useful', 'complement', l('有用的', 'helpful for a purpose'), l('useful 是形容词，在这里作表语，描述 lesson 的性质；它不是宾语。', 'Useful is an adjective functioning as a subject complement. It describes the lesson rather than receiving an action.')),
    ],
    orders: [order(['s', 'v', 'c'], l('被描述的事物 → is → 对它的描述。', 'The thing described → is → its description.'))],
    tip: l('“词性”与“句子成分”是不同维度：useful 的词性是形容词，在本句的作用是表语。', 'Part of speech and sentence function are different: useful is an adjective, and its function here is a subject complement.'),
  },
];

export const sentenceById = new Map(sentences.map(sentence => [sentence.id, sentence]));

export function formatSentence(lesson: SentenceLesson, orderedIds: readonly string[] = lesson.orders[0].ids, commaAfter?: string): string {
  const words = orderedIds.map(id => {
    const text = lesson.chunks.find(part => part.id === id)?.text ?? '';
    return id === commaAfter ? `${text},` : text;
  }).filter(Boolean).join(' ');
  return words ? `${words.charAt(0).toUpperCase()}${words.slice(1)}${lesson.punctuation ?? '.'}` : '';
}

export function matchSentenceOrder(lesson: SentenceLesson, orderedIds: readonly string[]): SentenceOrder | undefined {
  return lesson.orders.find(candidate => candidate.ids.length === orderedIds.length && candidate.ids.every((id, index) => id === orderedIds[index]));
}

/** Fisher–Yates, with an explicit fallback so practice never starts in an accepted order. */
export function shuffledChunks(lesson: SentenceLesson, random: () => number = Math.random): string[] {
  const ids = lesson.chunks.map(part => part.id);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.min(i, Math.max(0, Math.floor(random() * (i + 1))));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  if (matchSentenceOrder(lesson, ids)) {
    const subjectIndex = ids.indexOf('s');
    const verbIndex = ids.indexOf('v');
    [ids[subjectIndex], ids[verbIndex]] = [ids[verbIndex], ids[subjectIndex]];
  }
  return ids;
}
