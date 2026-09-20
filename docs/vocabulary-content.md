# 词库与句子内容维护

当前离线内容为 **248 个独立词条、32 组词根词缀、12 个句子练习**。词库由原来的 49 个词条扩充而来，采用本项目编写的简短教学释义和例句，没有批量复制参考站内容，也没有接入在线生成接口。

## 数据入口

- `src/data/lexicon.ts`：原有词条、合并后的查询 API 和稳定 ID；旧学习记录可继续匹配。
- `src/data/lexicon-extra.ts`：新增词族和词条。每条提供中英释义、词性数组、美式宽式 IPA、学习拆分、双语例句，适用时提供屈折变化或用法说明。
- `src/data/lexicon-everyday.ts`：48 个常用基础名词，含释义、IPA、双语例句与常见词形；不为基础词编造词根。
- `src/data/word-topics.ts`：六类编辑主题，通过稳定词条 ID 分类，不用释义关键词猜测。
- `src/data/sentences.ts`：12 课、词块角色、解释、目标语序和替代语序。列表与详情从相同数据渲染。

单词与词族是多对多关系，例如 photography 可同时出现在 photo 与 graph 中。统计按唯一单词 ID 计算。词根树按词性组织，是学习分组，并不声称每一层都是历史派生关系。`parts` 是教学用拆分，有时保留完整词干；不能靠字符串切割生成词源结论。

32 组包括 act、spect、port、struct、scrib、phon、bio、patho、dict、vis、aud、form、ject、tract、cred、geo、photo、graph，以及 re、un、tele、auto、dis、pre、micro、inter 等前缀／组合形式和 ful、less、able、ly、ment、ness 后缀。tele、micro 等在严格术语中属于组合形式，页面说明中已注明。

## 内容边界

目前是教学词库，不是完整权威词典：没有声称覆盖所有词义、词性、口音或历史。IPA 固定为美式宽式标注；选择英式朗读只切换系统声音，不会把已有 IPA 自动改成英式。project、extract、import 等同形异音条目在用法说明中注明词性对应读音。系统 TTS 的实际声音由设备决定。

`forms` 用于常见变化和搜索，不把这些变化计为新词；不可数名词无需生成虚假的复数。equipment、information 的不可数用法有单独说明。patho 词族不包含表示“小路”的 path。

句子中“主语／宾语”属于句法角色，“时间／来源／方式”属于语义作用。这种混合标注是面向入门者的短语解释，不是词性标签，也不是任意句子的自动解析。一般“地点在前、时间在后”只是常见顺序，部分课程提供时间前置等自然替代。练习只判定是否匹配本课的示例，不把其他所有排列断言为不合语法。

## 增补流程

1. 保留已有词条 ID，不将用户标记绑定数组序号；新词使用稳定英文词头 ID。
2. 填完整释义、例句、词性、IPA、词族关系；核对不规则变化和同形异音。
3. 新词根补齐中英文来源和说明，并确保至少关联一个词条。
4. 句子课程使用稳定的 chunk ID。每个允许顺序必须且只能包含全部词块一次，并给出适用解释；时间前置所需逗号用 `commaAfter` 表达。
5. 执行 `pnpm test`，覆盖唯一性、词族关联、双语字段、搜索、旧备份兼容、替代语序和洗牌。内容准确性还需人工编辑审校，结构测试不能代替语言校对。

后续扩展到千词或万词规模时，应先确定获准使用的词典数据来源和许可，再引入构建脚本、来源字段、版本映射和全文检索，避免用未经审核的机械拆词堆数量。

参考与核查入口：[用户提供的 Morpheme Lexicon](https://morphemelexicon.com/#/r/patho)、[Cambridge 的副词语序说明](https://dictionary.cambridge.org/grammar/british-grammar/adverbs-and-adverb-phrases-position)、[Cambridge telecommunication 词条](https://dictionary.cambridge.org/us/dictionary/english/telecommunication)。这些是参考链接，未下载其整部词典或复制例句。应用内单词详情提供对应 Morpheme Lexicon 词条链接，便于逐词核对。


## 展示与加载

词根／词缀只在词条已关联的词族中匹配，前缀限制在词首，后缀限制在词尾，支持 label 中用 `/` 列出的异形；历史拼写变化不强行高亮。例句匹配完整单词以及 `forms` 中已有的词形，保留标点和大小写，避免把 `act` 错误高亮到 `action` 中。

词库仍是离线随包内容。列表按 30 条递增提供给视图，单词、词根、句子列表用 FlatList 虚拟化；词族树按 30 个独立词条展开，兼有多词性的词会显示在对应分枝。筛选或搜索改变时恢复首批。此处是本地展示分页，不是联网下载词典。
