import { everydayWords } from './lexicon-everyday';
import type { Localized, Morpheme, PartOfSpeech, Word } from '@/domain/models';
import { scenarioWords } from './lexicon-scenarios';
import { foundationWords } from './lexicon-foundation';
import { dailyLifeWords } from './lexicon-daily-life';
import { practicalWords } from './lexicon-practical';
import { extraMorphemes, extraWords } from './lexicon-extra';

const bi = (zh: string, en: string): Localized => ({ zh, en });

// Small, editorial starter collection. These are learning families, not a claim
// that every member is directly derived from the modern English root spelling.
const starterMorphemes: Morpheme[] = [
  { id: 'act', label: 'act', kind: 'root', meaning: bi('做 · 行动', 'do · act'), origin: bi('拉丁语 agere', 'Latin agere'), description: bi('从行动到活动，用一组词理解「做」的不同表达。词族关系不等于直接派生关系。', 'From taking action to staying active: explore different expressions of doing. A word family is not a direct derivation tree.'), color: 'mint' },
  { id: 'spect', label: 'spect', kind: 'root', meaning: bi('看 · 观察', 'look · observe'), origin: bi('拉丁语 spectare / specere', 'Latin spectare / specere'), description: bi('把「看」放进不同语境：仔细看、回头看，以及看向未来。', 'Look closely, look back, and look ahead. Different contexts bring this family to life.'), color: 'peach' },
  { id: 'port', label: 'port', kind: 'root', meaning: bi('携带 · 运送', 'carry · transport'), origin: bi('拉丁语 portare', 'Latin portare'), description: bi('货物、信息和随身物品，都能帮助你记住「携带」这一含义。', 'Goods, information, and things you carry make this family easy to remember.'), color: 'blue' },
  { id: 'struct', label: 'struct', kind: 'root', meaning: bi('建造 · 组合', 'build · arrange'), origin: bi('拉丁语 struere', 'Latin struere'), description: bi('从建筑结构到组织事物，理解如何把不同部分组合起来。', 'From buildings to organizing ideas, explore how individual pieces fit together.'), color: 'lavender' },
  { id: 'scrib', label: 'scrib / script', kind: 'root', meaning: bi('写 · 记录', 'write · record'), origin: bi('拉丁语 scribere', 'Latin scribere'), description: bi('scrib 与 script 是这一词族中常见的形式，与书写和记录有关。', 'Scrib and script are related forms in a family concerned with writing and recording.'), color: 'peach' },
  { id: 'phon', label: 'phon', kind: 'root', meaning: bi('声音', 'sound · voice'), origin: bi('希腊语 phōnē', 'Greek phōnē'), description: bi('从电话到语音学，把抽象的声音与身边的事物联系起来。', 'Connect sound to familiar things, from a telephone to the study of speech.'), color: 'blue' },
  { id: 'bio', label: 'bio', kind: 'root', meaning: bi('生命 · 生活', 'life · living'), origin: bi('希腊语 bios', 'Greek bios'), description: bi('生命的研究、一个人的生平，以及生活环境，都属于这个词族。', 'Study life, tell a life story, and explore living environments through this family.'), color: 'mint' },
  { id: 'patho', label: 'path / patho', kind: 'root', meaning: bi('感受 · 痛苦 · 疾病', 'feeling · suffering · disease'), origin: bi('希腊语 pathos', 'Greek pathos'), description: bi('这一词族连接感受、同理心与疾病。表示「小路」的英语 path 不属于这个词根。', 'This family connects feelings, empathy, and disease. The English word path meaning a walkway has a different origin.'), color: 'lavender' },
  { id: 're', label: 're-', kind: 'prefix', meaning: bi('再次 · 向后', 'again · back'), origin: bi('拉丁语前缀 re-', 'Latin prefix re-'), description: bi('把已有的动作再做一次。并非每个以 re 开头的词都能这样拆解。', 'Do something once more. Not every word beginning with re can be split this way.'), color: 'mint' },
  { id: 'un', label: 'un-', kind: 'prefix', meaning: bi('不 · 相反', 'not · reverse'), origin: bi('古英语前缀 un-', 'Old English prefix un-'), description: bi('常用来表达相反的性质，或撤销一个动作。', 'Often expresses the opposite quality, or reverses an action.'), color: 'peach' },
  { id: 'ful', label: '-ful', kind: 'suffix', meaning: bi('充满 · 具有', 'full of · having'), origin: bi('英语 full 的相关后缀', 'English suffix related to full'), description: bi('常把名词变成描述性质的形容词。注意后缀只有一个 l。', 'Often turns a noun into an adjective describing a quality. Notice the single l.'), color: 'blue' },
  { id: 'less', label: '-less', kind: 'suffix', meaning: bi('没有 · 缺少', 'without · lacking'), origin: bi('古英语后缀 -lēas', 'Old English suffix -lēas'), description: bi('用来描述缺少某种事物的状态，与 -ful 对照着学习。', 'Describes the absence of something. Compare it with -ful to build connections.'), color: 'lavender' },
];

function w(id: string, roots: string[], pos: PartOfSpeech[], zh: string, en: string, ipa: string, parts: string[], example: string, translation: string, forms: string[] = [], usage?: Localized): Word {
  return { id, spelling: id, morphemes: roots, pos, meaning: bi(zh, en), ipa, parts, example: bi(translation, example), forms, usage };
}

// Definitions and examples are concise, original learning notes. IPA uses a
// broad American transcription; an OS voice may realize it differently.
const starterWords: Word[] = [
  w('act', ['act'], ['verb', 'noun'], '行动；表演；行为', 'to do something; to perform; a deed', 'ækt', ['act'], 'Small acts of kindness can change someone’s day.', '小小的善举可以改变一个人的一天。', ['acts', 'acted', 'acting']),
  w('action', ['act'], ['noun', 'verb'], '行动；行为；着手处理', 'something done; to put a request into effect', 'ˈækʃən', ['act', '-ion'], 'Our team took action to reduce waste.', '我们团队采取行动来减少浪费。', ['actions', 'actioned', 'actioning'], bi('take action：采取行动。名词用法最常见；动词 action 常见于商务语境。', 'Take action means to do something about a situation. The verb action is used especially in business.')),
  w('active', ['act'], ['adjective'], '活跃的；积极的', 'involved, energetic, or doing things', 'ˈæktɪv', ['act', '-ive'], 'Walking is a simple way to stay active.', '散步是保持活力的简单方式。', ['more active', 'most active']),
  w('activity', ['act'], ['noun'], '活动；活跃状态', 'something you do; the state of being active', 'ækˈtɪvəti', ['activ-', '-ity'], 'Reading is my favorite evening activity.', '阅读是我最喜欢的晚间活动。', ['activities']),
  w('activate', ['act'], ['verb'], '激活；使运作', 'to make something start working', 'ˈæktɪveɪt', ['activ-', '-ate'], 'Press the button to activate the light.', '按下按钮来打开灯。', ['activates', 'activated', 'activating']),
  w('actively', ['act'], ['adverb'], '积极地；主动地', 'in an involved or energetic way', 'ˈæktɪvli', ['active', '-ly'], 'She actively looks for new ideas.', '她主动寻找新想法。'),
  w('inspect', ['spect'], ['verb'], '检查；仔细查看', 'to examine something carefully', 'ɪnˈspɛkt', ['in-', 'spect'], 'Please inspect the bicycle before riding.', '骑车之前请检查自行车。', ['inspects', 'inspected', 'inspecting']),
  w('inspection', ['spect'], ['noun'], '检查；检验', 'a careful examination', 'ɪnˈspɛkʃən', ['in-', 'spect', '-ion'], 'The bridge passed its safety inspection.', '这座桥通过了安全检查。', ['inspections']),
  w('spectator', ['spect'], ['noun'], '观众；旁观者', 'a person watching an event', 'ˈspɛkteɪtər', ['spect', '-ator'], 'Every spectator cheered for the runners.', '每位观众都为跑步者欢呼。', ['spectators']),
  w('perspective', ['spect'], ['noun'], '视角；看法', 'a particular way of seeing something', 'pərˈspɛktɪv', ['per-', 'spect', '-ive'], 'Travel can give you a new perspective.', '旅行能让你获得新的视角。', ['perspectives']),
  w('transport', ['port'], ['verb', 'noun'], '运输；交通运输', 'to carry people or goods; a means of travel', 'trænsˈpɔrt', ['trans-', 'port'], 'These trains transport fresh food every day.', '这些列车每天运送新鲜食物。', ['transports', 'transported', 'transporting'], bi('此处音标为动词读音。名词通常重读第一音节；系统朗读可能选择另一读音。', 'The IPA shown is for the verb. The noun usually stresses the first syllable; system speech may select a different reading.')),
  w('portable', ['port'], ['adjective'], '便携的；可携带的', 'easy to carry or move', 'ˈpɔrtəbəl', ['port', '-able'], 'A portable charger is useful on long trips.', '便携充电器在长途旅行中很有用。'),
  w('import', ['port'], ['verb', 'noun'], '进口；导入；进口商品', 'to bring in from elsewhere; an imported item', 'ɪmˈpɔrt', ['im-', 'port'], 'You can import your notes from a file.', '你可以从文件导入笔记。', ['imports', 'imported', 'importing'], bi('此处展示动词音标。名词和动词的重音可能不同。', 'The IPA shown is for the verb. Stress can differ between the noun and verb.')),
  w('export', ['port'], ['verb', 'noun'], '出口；导出；出口商品', 'to send out; an item sent to another country', 'ɪkˈspɔrt', ['ex-', 'port'], 'Export a backup before changing your phone.', '更换手机之前导出一份备份。', ['exports', 'exported', 'exporting'], bi('此处展示动词音标。名词和动词的重音可能不同。', 'The IPA shown is for the verb. Stress can differ between the noun and verb.')),
  w('construct', ['struct'], ['verb'], '建造；构建', 'to build or put parts together', 'kənˈstrʌkt', ['con-', 'struct'], 'The children construct a tower from blocks.', '孩子们用积木搭建一座塔。', ['constructs', 'constructed', 'constructing']),
  w('structure', ['struct'], ['noun', 'verb'], '结构；组织；安排', 'the arrangement of parts; to organize', 'ˈstrʌktʃər', ['struct', '-ure'], 'A clear structure makes a story easier to follow.', '清晰的结构让故事更容易理解。', ['structures', 'structured', 'structuring']),
  w('construction', ['struct'], ['noun'], '建造；施工', 'the process of building something', 'kənˈstrʌkʃən', ['con-', 'struct', '-ion'], 'Construction of the new library starts soon.', '新图书馆的建设即将开始。', ['constructions']),
  w('reconstruct', ['struct', 're'], ['verb'], '重建；还原', 'to build again or recreate', 'ˌrikənˈstrʌkt', ['re-', 'construct'], 'They used old photos to reconstruct the garden.', '他们用旧照片还原了花园。', ['reconstructs', 'reconstructed', 'reconstructing']),
  w('describe', ['scrib'], ['verb'], '描述；描写', 'to say what something is like', 'dɪˈskraɪb', ['de-', 'scrib', '-e'], 'Can you describe your favorite place?', '你能描述一下你最喜欢的地方吗？', ['describes', 'described', 'describing']),
  w('description', ['scrib'], ['noun'], '描述；说明', 'words that explain what something is like', 'dɪˈskrɪpʃən', ['de-', 'script', '-ion'], 'Her description made the town feel familiar.', '她的描述让这个小镇显得很熟悉。', ['descriptions']),
  w('script', ['scrib'], ['noun'], '剧本；文字稿；脚本', 'written words for a performance or program', 'skrɪpt', ['script'], 'The actors read the script together.', '演员们一起读剧本。', ['scripts']),
  w('manuscript', ['scrib'], ['noun'], '手稿；原稿', 'an original written or typed text', 'ˈmænjəskrɪpt', ['manu-', 'script'], 'She sent her manuscript to the publisher.', '她把原稿寄给了出版商。', ['manuscripts']),
  w('telephone', ['phon'], ['noun', 'verb'], '电话；打电话', 'a device for speaking at a distance; to call', 'ˈtɛləfoʊn', ['tele-', 'phon', '-e'], 'We spoke on the telephone for an hour.', '我们在电话里聊了一个小时。', ['telephones', 'telephoned', 'telephoning']),
  w('microphone', ['phon'], ['noun'], '麦克风；话筒', 'a device that picks up sound', 'ˈmaɪkrəfoʊn', ['micro-', 'phon', '-e'], 'Speak clearly into the microphone.', '请对着麦克风清楚地说话。', ['microphones']),
  w('phonetic', ['phon'], ['adjective'], '语音的；表示发音的', 'relating to speech sounds', 'fəˈnɛtɪk', ['phon', '-etic'], 'Phonetic symbols help us learn pronunciation.', '音标帮助我们学习发音。'),
  w('symphony', ['phon'], ['noun'], '交响曲', 'a large musical work for an orchestra', 'ˈsɪmfəni', ['sym-', 'phon', '-y'], 'The orchestra played a beautiful symphony.', '乐团演奏了一首优美的交响曲。', ['symphonies']),
  w('biology', ['bio'], ['noun'], '生物学', 'the study of living things', 'baɪˈɑlədʒi', ['bio-', '-logy'], 'Biology helps us understand living things.', '生物学帮助我们理解生命。'),
  w('biography', ['bio'], ['noun'], '传记', 'the story of someone’s life', 'baɪˈɑɡrəfi', ['bio-', '-graphy'], 'I am reading a biography of a scientist.', '我正在读一位科学家的传记。', ['biographies']),
  w('biological', ['bio'], ['adjective'], '生物的；生物学的', 'relating to living things', 'ˌbaɪəˈlɑdʒɪkəl', ['bio-', 'log', '-ical'], 'Sleep follows a biological rhythm.', '睡眠遵循生物节律。'),
  w('biologist', ['bio'], ['noun'], '生物学家', 'a scientist who studies living things', 'baɪˈɑlədʒɪst', ['bio-', 'log', '-ist'], 'The biologist studies plants in the forest.', '这位生物学家研究森林里的植物。', ['biologists']),
  w('empathy', ['patho'], ['noun'], '同理心；共情', 'the ability to understand another person’s feelings', 'ˈɛmpəθi', ['em-', 'path', '-y'], 'Listening with empathy brings people closer.', '带着同理心倾听，能拉近人与人的距离。', [], bi('empathy 强调理解他人的感受；sympathy 更常强调同情与关切。', 'Empathy emphasizes understanding another person’s feelings; sympathy often emphasizes concern or compassion.')),
  w('sympathy', ['patho'], ['noun'], '同情；关切', 'care or understanding for someone in difficulty', 'ˈsɪmpəθi', ['sym-', 'path', '-y'], 'She expressed sympathy for her friend.', '她向朋友表达了关切。', ['sympathies']),
  w('pathology', ['patho'], ['noun'], '病理学', 'the study of disease and its effects', 'pəˈθɑlədʒi', ['patho-', '-logy'], 'He chose pathology as his field of study.', '他选择了病理学作为研究领域。', ['pathologies']),
  w('sympathetic', ['patho'], ['adjective'], '有同情心的；体谅的', 'showing understanding and care', 'ˌsɪmpəˈθɛtɪk', ['sym-', 'path', '-etic'], 'My teacher was sympathetic when I felt nervous.', '我紧张时，老师很体谅我。'),
  w('rewrite', ['re'], ['verb'], '重写；改写', 'to write something again or differently', 'ˌriˈraɪt', ['re-', 'write'], 'Try to rewrite the sentence in your own words.', '试着用自己的话改写这个句子。', ['rewrites', 'rewrote', 'rewritten', 'rewriting']),
  w('rebuild', ['re'], ['verb'], '重建', 'to build something again', 'ˌriˈbɪld', ['re-', 'build'], 'The neighbors helped rebuild the playground.', '邻居们帮助重建了游乐场。', ['rebuilds', 'rebuilt', 'rebuilding']),
  w('reread', ['re'], ['verb'], '重读；再读', 'to read something again', 'ˌriˈrid', ['re-', 'read'], 'I like to reread books that make me happy.', '我喜欢重读那些让我开心的书。', ['rereads', 'rereading'], bi('这里是原形读音；过去式仍写作 reread，但 read 部分读 /rɛd/。', 'This is the base-form pronunciation. The past tense is also spelled reread, with /rɛd/ at the end.')),
  w('unhappy', ['un'], ['adjective'], '不开心的', 'not happy or satisfied', 'ʌnˈhæpi', ['un-', 'happy'], 'Tell me if you feel unhappy about the plan.', '如果你对这个计划不满意，请告诉我。', ['unhappier', 'unhappiest']),
  w('unknown', ['un'], ['adjective'], '未知的；不熟悉的', 'not known or familiar', 'ˌʌnˈnoʊn', ['un-', 'known'], 'Every new word opens an unknown door.', '每个新单词都打开了一扇未知的门。'),
  w('unfair', ['un'], ['adjective'], '不公平的', 'not treating people equally or reasonably', 'ˌʌnˈfɛr', ['un-', 'fair'], 'It is unfair to judge a book by its cover.', '只凭封面评价一本书是不公平的。'),
  w('undo', ['un'], ['verb'], '撤销；解开', 'to reverse an action or unfasten something', 'ʌnˈdu', ['un-', 'do'], 'You can undo the last change.', '你可以撤销上一次修改。', ['undoes', 'undid', 'undone', 'undoing']),
  w('hopeful', ['ful'], ['adjective'], '充满希望的', 'feeling that something good may happen', 'ˈhoʊpfəl', ['hope', '-ful'], 'A fresh start makes me feel hopeful.', '新的开始让我充满希望。'),
  w('careful', ['ful'], ['adjective'], '仔细的；小心的', 'giving attention to avoid mistakes or harm', 'ˈkɛrfəl', ['care', '-ful'], 'Be careful when you cross the road.', '过马路时要小心。'),
  w('helpful', ['ful'], ['adjective'], '有帮助的；乐于助人的', 'useful or willing to help', 'ˈhɛlpfəl', ['help', '-ful'], 'Your examples were very helpful.', '你的例子非常有帮助。'),
  w('wonderful', ['ful'], ['adjective'], '美好的；令人赞叹的', 'very good or delightful', 'ˈwʌndərfəl', ['wonder', '-ful'], 'We had a wonderful afternoon in the garden.', '我们在花园里度过了美好的下午。'),
  w('careless', ['less'], ['adjective'], '粗心的', 'not giving enough attention', 'ˈkɛrləs', ['care', '-less'], 'A careless mistake is a chance to learn.', '一次粗心的错误也是学习的机会。'),
  w('fearless', ['less'], ['adjective'], '无畏的；勇敢的', 'not afraid of difficulty or danger', 'ˈfɪrləs', ['fear', '-less'], 'The little explorer was curious and fearless.', '这位小探险家既好奇又勇敢。'),
  w('endless', ['less'], ['adjective'], '无尽的', 'seeming to have no end', 'ˈɛndləs', ['end', '-less'], 'There are endless ways to tell a story.', '讲述一个故事的方式有无数种。'),
  w('hopeless', ['less'], ['adjective'], '没有希望的', 'having little or no hope', 'ˈhoʊpləs', ['hope', '-less'], 'The situation was difficult, but not hopeless.', '情况很困难，但并非毫无希望。'),
];

export const morphemes = [...starterMorphemes, ...extraMorphemes];
// Existing word IDs remain unchanged so saved marks survive dictionary updates.
const additionalFamilies: Record<string, string[]> = {
  telephone: ['tele'], microphone: ['micro'], biography: ['graph'],
  actively: ['ly'], portable: ['able'],
};
export const words = [...starterWords.map(word => ({ ...word, morphemes: [...word.morphemes, ...(additionalFamilies[word.id] ?? [])] })), ...extraWords, ...everydayWords, ...scenarioWords, ...foundationWords, ...dailyLifeWords, ...practicalWords];
export const wordById = new Map(words.map(word => [word.id, word]));
export const morphemeById = new Map(morphemes.map(root => [root.id, root]));
export const familyWords = (id: string) => words.filter(word => word.morphemes.includes(id));

export function searchWords(query: string, pos: PartOfSpeech | 'all' = 'all') {
  const text = query.trim().toLocaleLowerCase();
  return words.filter(word => (pos === 'all' || word.pos.includes(pos)) && (!text ||
    word.spelling.includes(text) || word.meaning.zh.includes(text) || word.meaning.en.toLowerCase().includes(text) ||
    word.forms.some(form => form.toLowerCase() === text)));
}
