// 角色游戏观察项目数据（小班）
const OBS_ITEMS_ROLE_XIAOBAN = [
  {
    num: 1,
    title: '我是否关注了游戏环境：',
    options: [
      '空间规划合理安全，活动空间不少于2平方米/人',
      '场景设置贴近幼儿生活经验（如娃娃家、超市等）',
      '材料投放丰富且有层次（成品玩具+低结构材料）',
      '角色标识清晰，帮助幼儿识别角色'
    ],
    selected: [false, false, false, false]
  },
  {
    num: 2,
    title: '我是否关注了幼儿的兴趣与情绪：',
    options: [
      '幼儿对角色表演活动感兴趣，情绪愉悦',
      '幼儿愿意进入角色区并主动摆弄材料',
      '幼儿能自主选择自己喜欢的角色'
    ],
    selected: [false, false, false]
  },
  {
    num: 3,
    title: '我是否能识别幼儿的角色意识与扮演行为：',
    options: [
      '幼儿知道自己扮演的角色（能说出"我是妈妈""我是医生"等）',
      '幼儿能在形象玩具诱导下出现连贯有序的装扮动作',
      '幼儿能模仿角色的典型动作（如抱娃娃、做饭、打针等）',
      '幼儿角色意识逐渐清晰，但主题情节较为单一'
    ],
    selected: [false, false, false, false]
  },
  {
    num: 4,
    title: '我是否关注了幼儿的以物代物与想象行为：',
    options: [
      '幼儿能在有形象玩具的情况下使用替代物（如用积木代替奶瓶）',
      '幼儿能对物品进行简单的假想和象征性使用',
      '幼儿能通过动作和语言想象游戏情景'
    ],
    selected: [false, false, false]
  },
  {
    num: 5,
    title: '我是否关注了幼儿的社会交往与规则意识：',
    options: [
      '幼儿愿意与同伴一起游戏，能进行简单的对应性合作',
      '幼儿能在教师指导下遵守基本游戏规则',
      '幼儿能与同伴进行简单的角色对话（如"你吃饭了吗？""我生病了"等）'
    ],
    selected: [false, false, false]
  },
  {
    num: 6,
    title: '我是否关注了幼儿的语言发展：',
    options: [
      '幼儿能使用简单的角色语言进行交流',
      '幼儿能模仿角色的典型语言',
      '幼儿在游戏中愿意用语言表达自己的想法'
    ],
    selected: [false, false, false]
  },
  {
    num: 7,
    title: '我是否关注了幼儿的学习品质：',
    options: [
      '幼儿喜欢并乐意参与角色表演活动',
      '幼儿能较专注地参与游戏，较稳定地扮演自己选择的角色',
      '幼儿能在教师指导下尝试解决简单问题'
    ],
    selected: [false, false, false]
  }
];

// 角色游戏中班
const OBS_ITEMS_ROLE_ZHONGBAN = [
  {
    num: 1,
    title: '我是否关注了游戏环境：',
    options: [
      '空间规划合理安全',
      '场景设置体现多样性（如可呈现医院、超市、餐厅、理发店等不同社会场景）',
      '材料投放丰富且有层次（成品玩具+低结构材料+可自制材料）',
      '场景和角色能根据主题变化及时更新'
    ],
    selected: [false, false, false, false]
  },
  {
    num: 2,
    title: '我是否关注了游戏主题与计划性：',
    options: [
      '幼儿有明确的游戏主题',
      '幼儿能围绕主题持续开展游戏',
      '幼儿开始出现简单的游戏计划（如"我今天想开医院"）',
      '幼儿能根据生活经验丰富游戏情节'
    ],
    selected: [false, false, false, false]
  },
  {
    num: 3,
    title: '我是否能识别幼儿的角色意识与扮演行为：',
    options: [
      '幼儿有比较清晰的角色意识，能较好理解所扮演的角色',
      '幼儿能逼真地表现角色行为，角色分工相对明确',
      '幼儿能根据自己的生活经验构思日益丰富和复杂的游戏情节（如"医院"主题中会有挂号、开药、住院、开刀等情节）',
      '幼儿能主动寻找材料来展开游戏主题'
    ],
    selected: [false, false, false, false]
  },
  {
    num: 4,
    title: '我是否关注了幼儿的以物代物与想象行为：',
    options: [
      '幼儿能在没有形象玩具的情况下根据意愿寻找替代物',
      '幼儿追求替代物与被替代物之间的相似性',
      '幼儿能通过简单制作实现替代',
      '幼儿能运用多种材料进行创造性想象'
    ],
    selected: [false, false, false, false]
  },
  {
    num: 5,
    title: '我是否关注了幼儿的社会交往与规则意识：',
    options: [
      '幼儿能与同伴合作游戏，有主题、情节、角色之间的协商和协调',
      '幼儿能运用游戏规则协调玩伴关系',
      '幼儿能在教师提示下基本遵守游戏规则',
      '幼儿能使用礼貌用语，与同伴互帮互助'
    ],
    selected: [false, false, false, false]
  },
  {
    num: 6,
    title: '我是否关注了幼儿的语言发展：',
    options: [
      '幼儿能使用较丰富的角色语言进行交流',
      '幼儿能结合情境使用连贯的句子进行表达',
      '幼儿能在游戏中用语言推动情节发展'
    ],
    selected: [false, false, false]
  },
  {
    num: 7,
    title: '我是否关注了幼儿的学习品质：',
    options: [
      '幼儿积极主动参与游戏，敢于介绍自己的角色',
      '幼儿能较专注地参与游戏，不随意更换扮演的角色',
      '幼儿在遇到困难时愿意尝试解决'
    ],
    selected: [false, false, false]
  }
];

// 角色游戏大班
const OBS_ITEMS_ROLE_DABAN = [
  {
    num: 1,
    title: '我是否关注了游戏环境：',
    options: [
      '空间规划合理安全',
      '场景设置体现多样性、开放性',
      '材料投放丰富且有层次（鼓励幼儿参与材料收集与制作）',
      '幼儿能参与环境创设与场景布置'
    ],
    selected: [false, false, false, false]
  },
  {
    num: 2,
    title: '我是否关注了游戏主题与计划性：',
    options: [
      '幼儿能自主确定游戏主题',
      '幼儿有明确的游戏计划，能事先讨论或设计游戏脚本',
      '幼儿能按计划开展游戏，并在过程中灵活调整',
      '游戏主题新颖，能反映较为复杂的社会关系和生活经验'
    ],
    selected: [false, false, false, false]
  },
  {
    num: 3,
    title: '我是否能识别幼儿的角色意识与扮演行为：',
    options: [
      '幼儿能深刻理解所扮演的角色，角色意识清晰、稳定',
      '幼儿能生动、形象地表现角色的一系列复杂行为'
    ],
    selected: [false, false]
  },
  {
    num: 4,
    title: '我是否关注了幼儿的以物代物与想象行为：',
    options: [
      '幼儿能灵活运用多种材料进行创造性替代',
      '幼儿假想行为丰富、奇特且有逻辑'
    ],
    selected: [false, false]
  },
  {
    num: 5,
    title: '我是否关注了幼儿的社会交往与规则意识：',
    options: [
      '幼儿能主动发起合作，有领导力和协调能力',
      '幼儿能灵活运用游戏规则解决冲突',
      '幼儿能关注并尊重同伴的游戏体验'
    ],
    selected: [false, false, false]
  },
  {
    num: 6,
    title: '我是否关注了幼儿的语言发展：',
    options: [
      '幼儿语言丰富、生动，能灵活运用角色语言',
      '幼儿能创造性地推动游戏情节发展'
    ],
    selected: [false, false]
  },
  {
    num: 7,
    title: '我是否关注了幼儿的学习品质：',
    options: [
      '幼儿积极主动、专注持久',
      '遇到困难能主动思考、调整策略',
      '善于反思总结，能提出改进建议'
    ],
    selected: [false, false, false]
  }
];

// 科学探究区小班
const OBS_ITEMS_SCI_XIAOBAN = [
  {
    num: 1,
    title: '我是否关注了游戏环境与材料：',
    options: [
      '空间安全、光线充足，便于幼儿操作',
      '材料丰富、直观，贴近生活（如磁铁、放大镜、沉浮材料）',
      '有自然角，投放了生长变化明显的动植物（如豆芽、小金鱼）'
    ],
    selected: [false, false, false]
  },
  {
    num: 2,
    title: '我是否关注了幼儿的兴趣与参与度：',
    options: [
      '幼儿对材料表现出好奇和摆弄的愿望',
      '幼儿愿意用手、眼等感官去感知材料（摸、看、闻）',
      '幼儿在探索时情绪愉悦、神情专注'
    ],
    selected: [false, false, false]
  },
  {
    num: 3,
    title: '我是否能识别幼儿的初步探究行为：',
    options: [
      '幼儿能重复摆弄材料，尝试简单的动作（如按、推、倒）',
      '幼儿能发现材料明显的特征（如"磁铁能吸铁钉"）',
      '幼儿能用简单的词语或动作表达自己的发现'
    ],
    selected: [false, false, false]
  },
  {
    num: 4,
    title: '我是否关注了幼儿的习惯与安全：',
    options: [
      '幼儿不将小物件放入口、耳、鼻中，有基本的安全意识',
      '在教师提醒下能简单收拾材料',
      '愿意爱护动植物，不粗暴对待'
    ],
    selected: [false, false, false]
  },
  {
    num: 5,
    title: '我是否关注了幼儿在科学领域的学习与发展：',
    options: [
      '感知特征：关注事物的颜色、形状、软硬、光滑/粗糙等明显特征',
      '观察能力：能注视或短暂观察事物的变化（如种子发芽）',
      '自然探索：对常见的动植物、自然现象（影、水）有兴趣'
    ],
    selected: [false, false, false]
  },
  {
    num: 6,
    title: '我是否关注了幼儿的学习品质：',
    options: [
      '幼儿对新鲜事物表现出好奇与兴趣',
      '能专注地摆弄材料一会儿',
      '愿意模仿同伴的探索行为',
      '遇到小困难（如盖子拧不开）愿意再试试'
    ],
    selected: [false, false, false, false]
  }
];

// 科学探究区中班
const OBS_ITEMS_SCI_ZHONGBAN = [
  {
    num: 1,
    title: '我是否关注了游戏环境与材料：',
    options: [
      '空间规划合理，便于小组合作',
      '材料丰富且有层次（有基础材料和挑战性材料）',
      '有记录工具（纸、笔、简单的记录表）'
    ],
    selected: [false, false, false]
  },
  {
    num: 2,
    title: '我是否关注了游戏的目的性与计划性：',
    options: [
      '幼儿有简单的探索想法（如"我想看看什么会浮起来"）',
      '幼儿能围绕一个目标进行短暂探索',
      '幼儿开始出现"先猜后做"的迹象'
    ],
    selected: [false, false, false]
  },
  {
    num: 3,
    title: '我是否能识别幼儿的探究过程与合作：',
    options: [
      '幼儿能运用多种感官和简单工具（放大镜、镊子）进行探究',
      '幼儿能发现事物或现象的简单变化',
      '幼儿愿意与同伴一起探索，有简单交流（如"你看，它动了"）'
    ],
    selected: [false, false, false]
  },
  {
    num: 4,
    title: '我是否关注了幼儿在科学领域的学习与发展：',
    options: [
      '猜想与观察：能进行大胆的猜测并尝试验证',
      '比较与分类：能比较两个物体的异同，进行简单分类',
      '记录与表达：能用图画或符号进行简单记录',
      '自然探索：能关注动植物的生长过程和基本需求'
    ],
    selected: [false, false, false, false]
  },
  {
    num: 5,
    title: '我是否关注了幼儿的学习品质：',
    options: [
      '幼儿积极主动参与探索，有好奇心和求知欲',
      '遇到困难愿意尝试自己解决问题（如换一种方法）',
      '愿意合作探究，交流发现，协商工具使用',
      '能持续探索一段时间，表现出一定的专注力'
    ],
    selected: [false, false, false, false]
  }
];

// 科学探究区大班
const OBS_ITEMS_SCI_DABAN = [
  {
    num: 1,
    title: '我是否关注了游戏环境与材料：',
    options: [
      '空间开放，支持多人、多组同时探究',
      '材料更具探究性，支持"做实验"（如电路、天平、显微镜）',
      '有丰富的记录、查阅资料的工具（如ipad、科学绘本）'
    ],
    selected: [false, false, false]
  },
  {
    num: 2,
    title: '我是否关注了游戏的计划性与目的性：',
    options: [
      '幼儿能事先做计划或画出设计图/猜想图',
      '幼儿能按计划进行探究，并在过程中灵活调整',
      '幼儿有明确的探究主题，并能坚持完成'
    ],
    selected: [false, false, false]
  },
  {
    num: 3,
    title: '我是否能识别幼儿的探究技能与创新思维：',
    options: [
      '幼儿能熟练使用多种工具和材料进行实验',
      '幼儿能系统地观察、比较、验证，并做出合理解释',
      '幼儿能设计简单的实验或创造性地使用材料解决问题',
      '幼儿在合作中能清晰地表达观点，并能听取他人意见进行修正'
    ],
    selected: [false, false, false, false]
  },
  {
    num: 4,
    title: '我是否关注了幼儿在科学领域的学习与发展：',
    options: [
      '预测与推断：能基于已有经验预测，并验证结果',
      '变量控制：开始关注单一变量对结果的影响（简单对比实验）',
      '记录与交流：能用图表、文字等多种方式记录，并能完整地分享探究过程和结论',
      '自然探索：理解动植物与环境的相互关系，了解生物的生命周期'
    ],
    selected: [false, false, false, false]
  },
  {
    num: 5,
    title: '我是否关注了幼儿的学习品质：',
    options: [
      '幼儿积极主动、认真专注、敢于探究和尝试',
      '遇到困难能主动思考，尝试多种解决方法，不轻言放弃',
      '能进行自我反思，提出改进想法或新的探究问题',
      '能与同伴有效分工、协商，共同完成复杂的探究任务'
    ],
    selected: [false, false, false, false]
  }
];

// 沙水游戏小班
const OBS_ITEMS_SAND_XIAOBAN = [
  {
    num: 1,
    title: '我是否关注了游戏环境：',
    options: [
      '材料投放丰富且有层次（主体材料：挖、装、沙工具、玩水、管道、沙水工具+辅助材料）',
      '满足幼儿当前游戏需求'
    ],
    selected: [false, false]
  },
  {
    num: 2,
    title: '我是否关注了幼儿的兴趣与情绪：',
    options: [
      '幼儿对沙水活动感兴趣，情绪愉悦',
      '幼儿愿意进入沙水区并主动摆弄材料'
    ],
    selected: [false, false]
  },
  {
    num: 3,
    title: '我是否能关注幼儿的感官探索行为：',
    options: [
      '用手/脚直接接触沙水，感受质地温度',
      '观察沙水流动、滴落的现象',
      '闻沙水气味，听沙水声音'
    ],
    selected: [false, false, false]
  },
  {
    num: 4,
    title: '我是否关注幼儿的动作发展：',
    options: [
      '抓、捏、拍、舀等基本动作',
      '倒、灌、挤等双手协调动作',
      '工具使用：勺子、小桶、漏斗'
    ],
    selected: [false, false, false]
  },
  {
    num: 5,
    title: '我是否关注了幼儿的社会交往水平与游戏规则：',
    options: [
      '平行游戏：在旁边玩相同材料',
      '短暂眼神/语言交流',
      '简单物品交换/分享',
      '不随意扬沙、扔摔材料，遵守游戏规则',
      '在教师提醒下能简单归位'
    ],
    selected: [false, false, false, false, false]
  },
  {
    num: 6,
    title: '我是否关注了幼儿的认知表现：',
    options: [
      '发现填充与倒空的关系',
      '体验干湿沙的不同特性',
      '尝试简单的堆高、挖洞'
    ],
    selected: [false, false, false]
  },
  {
    num: 7,
    title: '我是否关注了幼儿的学习品质：',
    options: [
      '幼儿能专注玩一会儿',
      '遇到小困难愿意再试试',
      '幼儿能在教师指导下尝试解决简单问题'
    ],
    selected: [false, false, false]
  }
];

// 沙水游戏中班
const OBS_ITEMS_SAND_ZHONGBAN = [
  {
    num: 1,
    title: '我是否关注了游戏环境：',
    options: [
      '材料投放丰富且有层次（主体材料：挖、装、沙工具、玩水、管道、沙水工具+辅助材料）',
      '满足幼儿当前游戏需求'
    ],
    selected: [false, false]
  },
  {
    num: 2,
    title: '我是否关注了游戏主题与计划性：',
    options: [
      '幼儿有明确的搭建主题',
      '幼儿能围绕主题持续搭建',
      '幼儿开始出现"先想后做"的迹象'
    ],
    selected: [false, false, false]
  },
  {
    num: 3,
    title: '我是否关注了幼儿对工具的探索：',
    options: [
      '选择合适的工具达成目的',
      '组合使用多种工具（铲子+筛子）',
      '发明新的工具使用方法'
    ],
    selected: [false, false, false]
  },
  {
    num: 4,
    title: '我是否关注到幼儿对沙水特性的探究：',
    options: [
      '系统比较沙水特性（流动性、可塑性）',
      '实验改变材料特性（加水、混合）',
      '预测并验证结果'
    ],
    selected: [false, false, false]
  },
  {
    num: 5,
    title: '我是否关注了幼儿的合作行为：',
    options: [
      '分配简单角色（你挖沙，我运水）',
      '协商解决冲突',
      '共同完成一个建构作品'
    ],
    selected: [false, false, false]
  },
  {
    num: 6,
    title: '我是否关注了幼儿的表征能力：',
    options: [
      '给作品命名并赋予意义',
      '用沙水表现熟悉物体（蛋糕、河流）',
      '结合其他材料进行情景创设'
    ],
    selected: [false, false, false]
  },
  {
    num: 7,
    title: '我是否关注了幼儿的学习品质：',
    options: [
      '幼儿积极主动参与游戏',
      '遇到困难愿意尝试解决',
      '愿意与同伴合作，尝试协商',
      '创造性地使用游戏材料，作品具有想象力'
    ],
    selected: [false, false, false, false]
  }
];

// 沙水游戏大班
const OBS_ITEMS_SAND_DABAN = [
  {
    num: 1,
    title: '我是否关注了游戏环境：',
    options: [
      '材料投放丰富且有层次（主体材料：挖、装、沙工具、玩水、管道、沙水工具+辅助材料）',
      '满足幼儿当前游戏需求'
    ],
    selected: [false, false]
  },
  {
    num: 2,
    title: '我是否关注了幼儿的游戏计划与目的性：',
    options: [
      '幼儿能事先计划或画出设计图',
      '幼儿能按计划游戏，并在过程中灵活调整',
      '幼儿有明确的游戏主题，并能坚持完成'
    ],
    selected: [false, false, false]
  },
  {
    num: 3,
    title: '我是否关注了幼儿的探究深度：',
    options: [
      '提出可探究的问题',
      '设计实验验证想法',
      '记录并分析数据'
    ],
    selected: [false, false, false]
  },
  {
    num: 4,
    title: '我是否关注了合作与分工：',
    options: [
      '幼儿能与同伴有效分工与协调',
      '幼儿能整合不同成员的想法',
      '幼儿能共同决策与问题解决'
    ],
    selected: [false, false, false]
  },
  {
    num: 5,
    title: '我是否关注幼儿的表征能力：',
    options: [
      '使用多种符号记录（图画、图表、数字）',
      '清晰表达设计思路与发现',
      '作品展示与讲解'
    ],
    selected: [false, false, false]
  },
  {
    num: 6,
    title: '我是否关注幼儿的工程思维：',
    options: [
      '分析问题与限制条件',
      '设计并改进解决方案',
      '测试与优化作品'
    ],
    selected: [false, false, false]
  }
];

// 统一的观察项目获取函数
function getObsItems(gameType, levelIndex) {
  const levelMap = { 0: 'XIAOBAN', 1: 'ZHONGBAN', 2: 'DABAN' };
  const level = levelMap[levelIndex] || 'XIAOBAN';

  const dataMap = {
    role_play: {
      XIAOBAN: OBS_ITEMS_ROLE_XIAOBAN,
      ZHONGBAN: OBS_ITEMS_ROLE_ZHONGBAN,
      DABAN: OBS_ITEMS_ROLE_DABAN
    },
    science: {
      XIAOBAN: OBS_ITEMS_SCI_XIAOBAN,
      ZHONGBAN: OBS_ITEMS_SCI_ZHONGBAN,
      DABAN: OBS_ITEMS_SCI_DABAN
    },
    sand_water: {
      XIAOBAN: OBS_ITEMS_SAND_XIAOBAN,
      ZHONGBAN: OBS_ITEMS_SAND_ZHONGBAN,
      DABAN: OBS_ITEMS_SAND_DABAN
    }
  };

  const gameMap = dataMap[gameType];
  if (!gameMap) return [];
  return JSON.parse(JSON.stringify(gameMap[level] || gameMap['XIAOBAN']));
}

module.exports = {
  getObsItems
};
