import type { SentenceChunk, SentenceLesson, SentenceOrder, SentenceRole, SentenceTopic } from './sentences';
const l = (zh: string, en: string) => ({ zh, en });
const c = (id: string, text: string, role: SentenceRole, zh: string, en: string, whyZh: string, whyEn: string): SentenceChunk => ({ id, text, role, meaning: l(zh, en), explanation: l(whyZh, whyEn) });
const o = (ids: string[], zh: string, en: string, commaAfter?: string): SentenceOrder => ({ ids, note: l(zh, en), ...(commaAfter ? { commaAfter } : {}) });
function lesson(id: string, topic: SentenceTopic, titleZh: string, titleEn: string, translation: string, summaryZh: string, summaryEn: string, chunks: SentenceChunk[], orders: SentenceOrder[], tipZh: string, tipEn: string, question = false): SentenceLesson {
  return { id, topic, title: l(titleZh, titleEn), translation, summary: l(summaryZh, summaryEn), chunks, orders, tip: l(tipZh, tipEn), ...(question ? { punctuation: '?' as const } : {}) };
}

export const extraSentences: SentenceLesson[] = [
  lesson('breakfast-at-seven', 'daily', '说说每天的习惯', 'Talk about a daily habit', '我通常七点吃早餐。', '主语 + 频率 + 动词 + 餐食 + 时间。', 'Subject + frequency + verb + meal + time.', [
    c('s', 'I', 'subject', '我', 'the speaker', 'I 是主语，说明谁有这个习惯。', 'I identifies the person with this habit.'),
    c('f', 'usually', 'frequency', '通常', 'on most days', 'usually 通常放在普通实义动词前。', 'Usually commonly comes before the main lexical verb.'),
    c('v', 'have', 'verb', '吃', 'eat, in this context', 'have breakfast 是“吃早餐”的常用搭配。', 'Have breakfast is a common expression meaning eat breakfast.'),
    c('o', 'breakfast', 'object', '早餐', 'the first meal', '这里 breakfast 泛指早餐，不加 a。', 'Breakfast refers to the meal generally, without an article here.'),
    c('t', 'at seven', 'time', '七点', 'at seven o’clock', '具体钟点前常用 at；seven 在这里指七点。', 'Use at with a clock time. Seven means seven o’clock here.'),
  ], [o(['s', 'f', 'v', 'o', 't'], '先说习惯，最后补充钟点。', 'Describe the habit, then give the time.')], '比较 at seven、on Monday 和 in September：不同时间表达搭配的介词不同。', 'Compare at seven, on Monday, and in September: different time expressions use different prepositions.'),
  lesson('coffee-request', 'daily', '礼貌地点一杯咖啡', 'Order a coffee politely', '请给我一杯咖啡，可以吗？', 'Could + 主语 + 动词原形，构成礼貌请求。', 'Could + subject + base verb makes a polite request.', [
    c('a', 'could', 'auxiliary', '可以……吗', 'a polite request marker', 'could 放在主语前，这里表示礼貌请求，并非过去时。', 'Could comes before the subject. Here it marks politeness rather than past time.'),
    c('s', 'I', 'subject', '我', 'the person ordering', 'I 表示想要这杯咖啡的人。', 'I is the person asking for the coffee.'),
    c('v', 'have', 'verb', '要；得到', 'receive', '情态动词 could 后使用 have 原形。', 'Use the base form have after the modal could.'),
    c('o', 'a cup of coffee', 'object', '一杯咖啡', 'one cup of coffee', 'a cup of 用容器表达饮品数量，整个短语作为宾语。', 'A cup of expresses an amount. The entire phrase is the object.'),
    c('p', 'please', 'politeness', '请', 'a polite addition', 'please 可以放在请求句末，表示礼貌。', 'Please at the end makes the request polite.'),
  ], [o(['a', 's', 'v', 'o', 'p'], '先提出请求，再用 please 收尾。', 'Make the request, then finish with please.', 'o')], 'Could I have…? 适合点餐或请求物品。please 不是动作方式，而是礼貌表达。', 'Could I have…? is useful when ordering or requesting an item. Please expresses politeness, not manner.', true),
  lesson('ticket-price', 'travel', '问价格：how much', 'Ask how much it costs', '这张票多少钱？', 'How much + does + 主语 + cost？', 'How much + does + subject + cost?', [
    c('q', 'how much', 'question', '多少钱', 'what price', 'how much 作为一个疑问词块询问价格。', 'How much forms one question phrase asking about price.'),
    c('a', 'does', 'auxiliary', '一般现在时疑问助动词', 'present question auxiliary', 'this ticket 是单数，使用 does。', 'The singular subject this ticket takes does.'),
    c('s', 'this ticket', 'subject', '这张票', 'the ticket being discussed', 'this ticket 是我们正在询问价格的物品。', 'This ticket names the thing whose price we want to know.'),
    c('v', 'cost', 'verb', '价值；花费', 'have a price', 'does 已体现第三人称单数，后面的 cost 不加 s。', 'Does carries the agreement, so cost stays in the base form.'),
  ], [o(['q', 'a', 's', 'v'], '疑问短语先行，助动词放在主语之前。', 'Put the question phrase first and the auxiliary before the subject.')], 'How much does…cost? 可用于票、食物或商品；不能同时说 does 和 costs。', 'Use How much does…cost? for tickets, food, or other items. Do not use costs after does.', true),
  lesson('train-platform', 'travel', '说清站台与发车时间', 'Name the platform and time', '火车九点从二号站台出发。', '主语 + 动词 + 起点 + 时间。', 'Subject + verb + departure point + time.', [
    c('s', 'the train', 'subject', '这班火车', 'the train in context', 'the train 指交谈双方知道的那班火车。', 'The train refers to a service known in the conversation.'),
    c('v', 'leaves', 'verb', '出发', 'departs', '固定时刻表常用一般现在时，即使说的是将来的班次。', 'Timetables often use the present simple, even for a future departure.'),
    c('src', 'from platform two', 'source', '从二号站台', 'from the second platform', 'from 说明出发位置，platform two 是站台编号。', 'From marks the departure point. Platform two identifies its number.'),
    c('t', 'at nine', 'time', '九点', 'at nine o’clock', 'at nine 表示发车钟点，通常放在句末。', 'At nine gives the departure time and naturally goes last.'),
  ], [o(['s', 'v', 'src', 't'], '先说哪班车、从哪出发，再给时间。', 'Name the service and platform, then the time.'), o(['t', 's', 'v', 'src'], '也可以先强调九点这个时间。', 'You can also set the time first.', 't')], 'leave from 强调出发点。到达某地可用 arrive at 或 arrive in，要结合地点类型。', 'Leave from highlights the departure point. For arrival, at or in depends on the kind of place.'),
  lesson('bus-destination', 'travel', '确认车是不是去机场', 'Check where a bus goes', '这辆公共汽车去机场吗？', 'Does + 单数主语 + go + to 目的地？', 'Does + singular subject + go + to a destination?', [
    c('a', 'does', 'auxiliary', '疑问助动词', 'question auxiliary', 'this bus 是单数，所以使用 does 提问。', 'Use does because this bus is singular.'),
    c('s', 'this bus', 'subject', '这辆公共汽车', 'the bus nearby', 'this 指向眼前或正在讨论的车辆。', 'This points to the bus nearby or under discussion.'),
    c('v', 'go', 'verb', '去', 'travel', '在 does 后使用 go，而不是 goes。', 'Use go after does, rather than goes.'),
    c('d', 'to the airport', 'destination', '去机场', 'toward the airport', 'to 说明目的地，和 the airport 组成完整词块。', 'To introduces the destination as part of a complete phrase.'),
  ], [o(['a', 's', 'v', 'd'], '先用 does 提问，目的地放在动词之后。', 'Begin the question with does and place the destination after go.')], '这类问句可以简答 Yes, it does 或 No, it doesn’t。', 'A short answer is Yes, it does or No, it doesn’t.', true),
  lesson('weekend-plan', 'daily', '表达已经有的打算', 'Share a plan', '我们打算星期六参观博物馆。', 'be going to + 动词原形，表达计划。', 'Be going to + base verb expresses a plan.', [
    c('s', 'we', 'subject', '我们', 'the speaker and others', '复数主语 we 与 are 搭配。', 'The plural subject we takes are.'),
    c('v', 'are going to visit', 'verb', '打算参观', 'plan to visit', '这里把 are going to visit 作为一个动词词块；going to 表示打算。', 'This verb phrase uses going to for a plan, followed by the base verb visit.'),
    c('o', 'the museum', 'object', '博物馆', 'the museum in context', 'visit 直接接宾语，不需要再加 to。', 'Visit takes its object directly without another to.'),
    c('t', 'on Saturday', 'time', '星期六', 'on that day', '星期几前用 on，说明计划安排在何时。', 'Use on with a day of the week.'),
  ], [o(['s', 'v', 'o', 't'], '先说计划，再补充时间。', 'State the plan, then give the day.'), o(['t', 's', 'v', 'o'], '把时间作为这句话的背景。', 'Put the day first to set the scene.', 't')], 'are going to visit 中第一个 to 属于 going to 结构；不能再写 visit to the museum。', 'The to in going to is part of the future construction. Do not add another to after visit.'),
  lesson('homework-finished', 'work', '用 already 表达已经完成', 'Say what you have already done', '我已经完成了家庭作业。', '主语 + have + already + 过去分词 + 宾语。', 'Subject + have + already + past participle + object.', [
    c('s', 'I', 'subject', '我', 'the speaker', '主语 I 与助动词 have 搭配。', 'I takes the auxiliary have.'),
    c('a', 'have', 'auxiliary', '完成时助动词', 'perfect auxiliary', 'have 在这里与过去分词一起构成现在完成时。', 'Have combines with a past participle to form the present perfect.'),
    c('t', 'already', 'time', '已经', 'before now', 'already 常放在 have 与过去分词之间。', 'Already commonly goes between have and the past participle.'),
    c('v', 'finished', 'verb', '完成', 'completed', 'finished 是 finish 的过去分词，和前面的 have 一起理解。', 'Finished is the past participle of finish and works with have.'),
    c('o', 'my homework', 'object', '我的家庭作业', 'the speaker’s homework', 'homework 通常不可数，不加复数 s。', 'Homework is normally uncountable and has no plural -s here.'),
  ], [o(['s', 'a', 't', 'v', 'o'], 'have 与 finished 构成完成时，already 放在它们之间。', 'Have and finished form the perfect, with already between them.')], '现在完成时把过去的完成与现在联系起来。本句强调现在作业已经做完。', 'The present perfect links a past completion to the present: the homework is done now.'),
  lesson('does-not-eat', 'daily', '把习惯改成否定句', 'Make a habit negative', '她不吃肉。', '单数主语 + does not + 动词原形。', 'Singular subject + does not + base verb.', [
    c('s', 'she', 'subject', '她', 'the person discussed', 'she 是第三人称单数主语。', 'She is a third-person singular subject.'),
    c('v', 'does not eat', 'verb', '不吃', 'does not consume', 'does not eat 是否定动词词块；eat 用原形。', 'This negative verb phrase uses does not followed by the base form eat.'),
    c('o', 'meat', 'object', '肉', 'animal flesh used as food', 'meat 泛指肉类，在这里是不可数名词。', 'Meat refers to food generally and is uncountable here.'),
  ], [o(['s', 'v', 'o'], '主语在前，否定动词词块在中，宾语在后。', 'Start with the subject, then the negative verb phrase and object.')], 'does not 可以缩写成 doesn’t。肯定句用 eats，否定句则是 does not eat。', 'Does not can become doesn’t. Compare affirmative eats with negative does not eat.'),
  lesson('lighter-bag', 'daily', '比较两件物品', 'Compare two things', '这个包比那个轻。', '主语 + be + 比较级 + than 比较对象。', 'Subject + be + comparative + than the other thing.', [
    c('s', 'this bag', 'subject', '这个包', 'the nearby bag', 'this bag 是正在描述的对象。', 'This bag is what the sentence describes.'),
    c('v', 'is', 'verb', '是', 'links subject and description', 'is 连接主语与后面的比较描述。', 'Is links the subject to the comparison.'),
    c('c', 'lighter than that one', 'complement', '比那个轻', 'less heavy than the other bag', 'lighter 是 light 的比较级；one 代替前面提到的 bag。', 'Lighter is the comparative of light. One stands for another bag.'),
  ], [o(['s', 'v', 'c'], '先说对象，再说它与另一个对象的比较。', 'Name the thing, then compare it with the other one.')], '比较级不是一律加 -er；例如 comfortable 通常用 more comfortable。', 'Not every comparative adds -er. For example, comfortable usually takes more comfortable.'),
  lesson('enjoy-listening', 'daily', 'enjoy 后面接什么', 'Use an -ing form after enjoy', '我喜欢听音乐。', 'enjoy + 动词 -ing 形式。', 'Enjoy + an -ing form.', [
    c('s', 'I', 'subject', '我', 'the speaker', 'I 表示享受这个活动的人。', 'I is the person who enjoys the activity.'),
    c('v', 'enjoy', 'verb', '喜欢；享受', 'take pleasure in', 'enjoy 后面可接名词或 -ing 形式。', 'Enjoy can take a noun or an -ing form.'),
    c('o', 'listening to music', 'object', '听音乐', 'the activity of listening to music', '这个 -ing 结构整体作宾语；listen to music 中的 to 要保留。', 'This -ing clause functions as the object. Keep to in listen to music.'),
  ], [o(['s', 'v', 'o'], '把 listening to music 当作整体活动放在 enjoy 后。', 'Treat listening to music as one activity after enjoy.')], '常说 enjoy doing something，不说 enjoy to do something。', 'Use enjoy doing something, rather than enjoy to do something.'),
  lesson('because-rain', 'basics', '用 because 接上原因', 'Add a reason with because', '我们待在家里，因为当时正在下雨。', '主句 + because 原因从句。', 'Main clause + a because clause giving the reason.', [
    c('s', 'we', 'subject', '我们', 'the people who stayed', 'we 是主句中的主语。', 'We is the subject of the main clause.'),
    c('v', 'stayed', 'verb', '待着；留下', 'remained', 'stayed 是 stay 的过去式。', 'Stayed is the past tense of stay.'),
    c('p', 'at home', 'place', '在家', 'in our home', 'at home 说明我们待在哪里。', 'At home states where we stayed.'),
    c('r', 'because it was raining', 'reason', '因为当时在下雨', 'because rain was falling', 'because 后接完整从句 it was raining；本课把原因作为整体词块。', 'Because introduces the complete clause it was raining, grouped here as one reason phrase.'),
  ], [o(['s', 'v', 'p', 'r'], '先说做了什么，再解释原因。', 'Describe what happened, then explain why.'), o(['r', 's', 'v', 'p'], '也可以先交代原因，再给出结果。', 'You can also give the reason first.', 'r')], 'because 后面可以跟句子；because of 后面通常接名词短语，如 because of the rain。', 'Because can take a clause. Because of normally takes a noun phrase, as in because of the rain.'),
  lesson('if-it-rains', 'basics', '如果下雨，我们就……', 'Talk about a possible condition', '如果下雨，我们就待在家里。', 'If + 一般现在时，主句用 will + 原形。', 'If + present simple, then will + base verb in the main clause.', [
    c('cond', 'if it rains', 'condition', '如果下雨', 'on the condition that rain falls', '这里 if 从句使用一般现在时，表达可能发生的未来条件。', 'This if-clause uses the present simple for a possible future condition.'),
    c('s', 'we', 'subject', '我们', 'the people affected', 'we 是主句的主语。', 'We is the subject of the main clause.'),
    c('v', 'will stay', 'verb', '将会待着', 'will remain', 'will 后用 stay 原形，表达条件成立时的安排。', 'Will takes the base form stay to express the result of the condition.'),
    c('p', 'at home', 'place', '在家', 'in our home', '地点短语在这里放在动词之后。', 'The place phrase follows the verb here.'),
  ], [o(['cond', 's', 'v', 'p'], '条件在前，用逗号与主句分开。', 'A fronted condition is separated from the main clause by a comma.', 'cond'), o(['s', 'v', 'p', 'cond'], '条件也可以放句末，通常不用逗号。', 'The condition can also go last, usually without a comma.')], '本课学习常见的真实条件句。这里不需要在 if 从句中再加 will。', 'This lesson covers a common real conditional. No will is needed inside this if-clause.'),
  lesson('keys-on-table', 'place', '说清东西放在哪里', 'Locate an everyday object', '钥匙在桌子上。', '复数主语 + are + 位置短语。', 'Plural subject + are + location phrase.', [
    c('s', 'the keys', 'subject', '这些钥匙', 'the keys in context', 'keys 是复数，后面用 are。', 'Keys is plural, so the verb is are.'),
    c('v', 'are', 'verb', '在；处于', 'are located', 'are 在这里连接物品和它们的位置。', 'Are connects the objects with their location.'),
    c('p', 'on the table', 'place', '在桌子上', 'on top of the table', 'on 表示在表面上；the table 是具体那张桌子。', 'On marks contact with a surface. The table is a particular table.'),
  ], [o(['s', 'v', 'p'], '先说物品，再说明位置。', 'Name the objects, then give their location.')], '比较 on the table（桌上）、under the table（桌下）和 beside the table（桌旁）。', 'Compare on the table, under the table, and beside the table.'),
  lesson('give-a-map', 'travel', '把东西给谁', 'Say who receives something', '她给了那位游客一张地图。', '主语 + gave + 物品 + to 接收者。', 'Subject + gave + thing + to the recipient.', [
    c('s', 'she', 'subject', '她', 'the person giving', 'she 是进行给予动作的人。', 'She is the person who gives something.'),
    c('v', 'gave', 'verb', '给了', 'handed to someone', 'gave 是 give 的不规则过去式。', 'Gave is the irregular past form of give.'),
    c('o', 'a map', 'object', '一张地图', 'one map', 'a map 是被给予的物品，即直接宾语。', 'A map is the thing given: the direct object.'),
    c('r', 'to the visitor', 'recipient', '给那位游客', 'to the person visiting', 'to 引出接收者，这里不是旅行目的地。', 'To introduces the recipient, not a travel destination here.'),
  ], [o(['s', 'v', 'o', 'r'], '先给出物品，再说明它交给了谁。', 'Name the thing, then the person receiving it.')], 'She gave the visitor a map 也很自然，但需要去掉 to，不能只移动本课现有词块。', 'She gave the visitor a map is also natural, but requires removing to, not simply moving these chunks.'),
  lesson('report-before-friday', 'work', '说明任务与截止时间', 'Describe a task and deadline', '我们需要在星期五之前发送报告。', 'need to + 动词原形 + 宾语 + 时间。', 'Need to + base verb + object + time.', [
    c('s', 'we', 'subject', '我们', 'the people responsible', 'we 指负责这项任务的人。', 'We identifies the people responsible.'),
    c('v', 'need to send', 'verb', '需要发送', 'must arrange to send', 'need to send 作为一个动词词块；send 用原形。', 'Need to send is grouped as a verb phrase with send in its base form.'),
    c('o', 'the report', 'object', '报告', 'the report in context', 'the report 是要发送的内容。', 'The report is what needs to be sent.'),
    c('t', 'before Friday', 'time', '星期五之前', 'earlier than Friday', 'before 表示早于这个时间点。', 'Before means earlier than that time.'),
  ], [o(['s', 'v', 'o', 't'], '任务在前，截止时间在后。', 'State the task first, then the deadline.'), o(['t', 's', 'v', 'o'], '也可以先强调时间限制。', 'You can also place the time limit first.', 't')], 'before Friday 强调星期五之前；by Friday 常指最迟到星期五。', 'Before Friday means earlier than Friday; by Friday commonly means no later than Friday.'),
  lesson('repeat-slowly', 'work', '请对方慢一点再说', 'Ask someone to repeat slowly', '请你慢慢地再说一遍，好吗？', 'Could + 主语 + 动词 + 宾语 + 方式。', 'Could + subject + verb + object + manner.', [
    c('a', 'could', 'auxiliary', '可以……吗', 'a polite request marker', 'could 在这里让请求更委婉。', 'Could makes the request more polite here.'),
    c('s', 'you', 'subject', '你', 'the person being asked', 'you 表示被请求说话的人。', 'You names the person being asked.'),
    c('v', 'repeat', 'verb', '重复', 'say again', 'could 后面使用 repeat 原形。', 'Use the base form repeat after could.'),
    c('o', 'that', 'object', '刚才的话', 'what was just said', 'that 指对方刚才说过的内容。', 'That refers to what the other person just said.'),
    c('m', 'slowly', 'manner', '慢慢地', 'at a low speed', 'slowly 表示说话方式，放在宾语之后。', 'Slowly describes the manner and follows the object here.'),
    c('p', 'please', 'politeness', '请', 'a polite addition', 'please 可以放在句末作礼貌补充。', 'Please is a polite addition at the end.'),
  ], [o(['a', 's', 'v', 'o', 'm', 'p'], '保持 repeat that 相连，后面再说明速度。', 'Keep repeat that together, then describe the speed.', 'm')], '需要别人解释时可以换成 Could you explain that?；需要重复原话时用 repeat。', 'For an explanation, ask Could you explain that? Use repeat when you want to hear the words again.', true),
  lesson('cooking-when-called', 'time', '过去正在做的事', 'Describe an action in progress in the past', '你打电话来时，我正在做饭。', '过去进行时 + when 引导的时间从句。', 'Past continuous + a time clause with when.', [
    c('s', 'I', 'subject', '我', 'the speaker', 'I 表示正在做饭的人。', 'I identifies the person cooking.'),
    c('v', 'was cooking', 'verb', '当时正在做饭', 'was in the middle of cooking', 'was + -ing 表示过去某个时刻正在进行的动作。', 'Was + -ing describes an action in progress at a past time.'),
    c('t', 'when you called', 'time', '你打电话来时', 'at the time of your call', 'when 从句提供过去的时间背景，called 是过去式。', 'The when-clause gives a past time reference, using the past form called.'),
  ], [o(['s', 'v', 't'], '先说正在做的事，再补充电话打来的时间。', 'Describe the ongoing action, then the time of the call.'), o(['t', 's', 'v'], '时间从句也可以放前面。', 'The time clause can come first too.', 't')], 'was cooking 描述背景动作，called 描述当时发生的电话事件。', 'Was cooking supplies the ongoing background; called identifies the event at that time.'),
  lesson('meeting-in-ten-minutes', 'work', '还有多久开始', 'Say how soon something begins', '会议十分钟后开始。', '主语 + starts + in 一段时间。', 'Subject + starts + in a period of time.', [
    c('s', 'the meeting', 'subject', '会议', 'the scheduled meeting', 'the meeting 是单数主语。', 'The meeting is a singular subject.'),
    c('v', 'starts', 'verb', '开始', 'begins', '用一般现在时描述已安排好的时间。', 'The present simple describes a scheduled event.'),
    c('t', 'in ten minutes', 'time', '十分钟后', 'ten minutes from now', 'in + 时间长度在这里表示“再过多久”。', 'In + a duration here tells us how much time remains before the event.'),
  ], [o(['s', 'v', 't'], '先说明什么开始，再给出等待的时间。', 'Say what begins, then how soon.')], 'in ten minutes 在这里不是“持续十分钟”；持续多长时间通常用 for ten minutes。', 'In ten minutes here does not mean lasting ten minutes. A duration often uses for ten minutes.'),
];
