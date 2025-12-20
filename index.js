(function() {
    // ==========================================
    // 0. 插件配置与上下文
    // ==========================================
    const extensionName = "CTE_Map"; 
    const extensionPath = `scripts/extensions/third-party/${extensionName}`;
    let stContext = null;
    const DEFAULT_NATIONAL_BG = "https://files.catbox.moe/8z3pnp.png";

    // [FIX] 确保命名空间存在，防止 TypeError
    window.CTEIdolManager = window.CTEIdolManager || {};

    // ==========================================
    // 1. 数据定义
    // ==========================================
    
    // RPG 数据状态
    window.CTEIdolManager.RPG = {
        state: {
            funds: 2450000,
            fans: 824000,
            morale: "High",
            futureLog: [],
            activeTasks: [] 
        }
    };

    // ==========================================
    // [REFACTORED] Heartbeat 模块 (Netflix Style)
    // ==========================================
    window.CTEIdolManager.Heartbeat = {
        // 完整活动数据
        allActivities: [
            { name: "办公室的游戏", desc: "在落地窗前，享受一场禁忌的桌上盛宴。", icon: "fa-couch" },
            { name: "浴室水蒸气", desc: "在湿热的雾气中，探索彼此身体的每一寸。", icon: "fa-shower" },
            { name: "深夜卧室私语", desc: "用最温柔的方式，陪伴彼此度过漫漫长夜。", icon: "fa-bed" },
            { name: "角色扮演Play", desc: "尝试不同的身份，解锁不一样的刺激体验。", icon: "fa-masks-theater" },
            { name: "镜前诱惑", desc: "让他看清自己为你疯狂的模样，是最好的催情剂。", icon: "fa-wand-magic-sparkles" },
            { name: "专属女仆", desc: "换上女仆装，用羽毛轻轻挑逗他全身。", icon: "fa-broom" },
            { name: "厨房幻想", desc: "将奶油涂满全身，让他用舌头为你清洁。", icon: "fa-utensils" },
            { name: "深夜停车场车震", desc: "在狭小的密闭空间里，你只能跨坐在他身上。", icon: "fa-car-side" },
            { name: "落地窗前", desc: "赤身裸体压在窗前看风景，好像让窗外的景色格外美。", icon: "fa-city" },
            { name: "电竞桌下口交", desc: "他的手和眼都必须继续游戏哦。", icon: "fa-gamepad" },
            { name: "校园活动", desc: "和他一起穿上谌绪的高中校服吧！", icon: "fa-graduation-cap" },
            { name: "健身房的汗水游戏", desc: "好像有人做卧推时没有穿内裤呢……", icon: "fa-dumbbell" },
            { name: "按摩室SPA混浴", desc: "在氤氲的热气中，肌肤相亲的触感格外清晰。", icon: "fa-hot-tub-person" },
            { name: "私人影院", desc: "昏暗的灯光下，屏幕上的画面远不如身边的你诱人。", icon: "fa-film" },
            { name: "试衣间的秘密", desc: "门帘之外是喧嚣的人群，门帘之内是压抑的喘息。", icon: "fa-shirt" },
            { name: "豪华游艇", desc: "在无边无际的大海上，没有人能听见你的求救。", icon: "fa-ship" },
            { name: "图书馆角落", desc: "要是被图书管理员听见会怎么样呢？", icon: "fa-book-open" },
            { name: "摩天轮顶点", desc: "传说在最高点结合的恋人，会永远在一起。", icon: "fa-dharmachakra" },
            { name: "钢琴上的奏鸣曲", desc: "凌乱的音符，用身体谱写出只属于今夜的乐章。", icon: "fa-music" },
            { name: "露营帐篷", desc: "森林的虫鸣鸟叫，都成为了这场欢爱的伴奏。", icon: "fa-campground" },
            { name: "天台的夜风", desc: "城市的霓虹灯在脚下闪烁，我们在风中彻底沉沦。", icon: "fa-wind" },
            { name: "酒吧后巷", desc: "酒精麻痹了神经，却放大了感官的刺激。", icon: "fa-wine-glass-empty" },
            { name: "镜中双面", desc: "强迫你在镜前看着自己沉沦的模样，羞耻感爆棚。", icon: "fa-clone" },
            { name: "丝巾蒙眼", desc: "剥夺了视觉后，每一次触碰都变成了未知的战栗。", icon: "fa-eye-slash" },
            { name: "精油按摩", desc: "温热的精油滑过肌肤，指尖的游走让理智瞬间蒸发。", icon: "fa-bottle-droplet" },
            { name: "冰火两重天", desc: "冰块的寒冷与口腔的温热交替，极致的感官刺激。", icon: "fa-temperature-half" },
            { name: "领带束缚", desc: "那条平时系在颈间的领带，此刻成为了掌控的枷锁。", icon: "fa-user-tie" },
            { name: "甜蜜盛宴", desc: "蜂蜜涂抹在敏感带上，成为一道待品尝的甜点。", icon: "fa-spoon" },
            { name: "耳机隔离", desc: "只有对方能听到指令，旁人看来只是一场静默的狂欢。", icon: "fa-headphones" },
            { name: "高跟鞋女王", desc: "冰冷的鞋跟划过胸膛，让他臣服在你的脚下。", icon: "fa-shoe-prints" },
            { name: "私房摄影", desc: "镜头记录下每一个淫乱的瞬间，你们是彼此专属的模特。", icon: "fa-camera" },
            { name: "书房禁地", desc: "在充满墨香的桌案上，进行一场背德的授课。", icon: "fa-book" },
            { name: "楼梯激情", desc: "利用台阶的高低差，探索前所未有的深入角度。", icon: "fa-stairs" },
            { name: "红绳束缚", desc: "错综复杂的红绳将对方悬在半空，像一只待宰的羔羊。", icon: "fa-link" },
            { name: "泳池派对", desc: "水波荡漾掩盖了水下的动作，清凉与燥热的碰撞。", icon: "fa-water" },
            { name: "私人诊所", desc: "“病人”需要接受全方位的身体检查，尤其是那里。", icon: "fa-user-doctor" },
            { name: "引擎盖热度", desc: "刚刚熄火的引擎盖还发烫，正如现在的我们。", icon: "fa-fire" },
            { name: "你的礼物", desc: "除了红色的丝带，你身上一丝不挂，等他拆封。", icon: "fa-gift" },
            { name: "早安咬", desc: "在晨光中用口舌唤醒他，美好的一天从这里开始。", icon: "fa-sun" },
            { name: "电车痴汉", desc: "拥挤的车厢里，没人知道我们紧贴的身体间发生了什么。", icon: "fa-train-subway" },
            { name: "电梯惊魂", desc: "在这几十秒的上升时间里，争分夺秒地索取。", icon: "fa-elevator" },
            { name: "野外丛林", desc: "远离文明的束缚，回归最原始的野性本能，天为被地为床。", icon: "fa-tree" }
        ],
        currentActivity: null,
        
        // 模拟 Netflix 分类
        getRowsData: function() {
            const total = this.allActivities.length;
            const third = Math.ceil(total / 3);
            return {
                trending: this.allActivities.slice(0, third),
                intimate: this.allActivities.slice(third, third * 2),
                public: this.allActivities.slice(third * 2)
            };
        },

        // 渲染主视图
        renderGrid: function() {
            const data = this.getRowsData();
            this.renderRow('cte-nf-row1', data.trending);
            this.renderRow('cte-nf-row2', data.intimate);
            this.renderRow('cte-nf-row3', data.public);
        },

        // 渲染单行
        renderRow: function(containerId, items) {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            container.innerHTML = '';

            items.forEach(item => {
                const card = document.createElement('div');
                card.className = 'cte-nf-card';
                card.onclick = () => window.CTEIdolManager.Heartbeat.openModal(item.name);
                
                card.innerHTML = `
                    <div class="cte-nf-card-inner">
                        <div class="cte-nf-card-visual">
                            <i class="fa-solid ${item.icon}"></i>
                            <div class="cte-nf-card-overlay">
                                <div class="cte-nf-card-title">${item.name}</div>
                            </div>
                        </div>
                    </div>
                    <div class="cte-nf-card-details">
                        <div class="cte-nf-meta-tags">
                            <span>98% Match</span>
                            <span class="cte-nf-age-rating">18+</span>
                            <span>HD</span>
                        </div>
                        <div class="cte-nf-card-desc-text">${item.desc}</div>
                    </div>
                `;
                container.appendChild(card);
            });
        },

        // 打开成员选择弹窗
        openModal: function(activityName) {
            this.currentActivity = activityName;
            const grid = document.getElementById('cte-nf-profile-grid');
            const modal = document.getElementById('cte-nf-modal');
            
            if (!grid || !modal) return;
            grid.innerHTML = '';

            const profiles = window.CTEIdolManager.characterProfiles || {};
            
            for (const [name, profile] of Object.entries(profiles)) {
                if (name === '你') continue;
                
                const item = document.createElement('div');
                item.className = 'cte-nf-profile-item';
                item.dataset.name = name;
                item.onclick = () => item.classList.toggle('selected');
                
                let bgStyle = profile.image ? `background-image: url('${profile.image}')` : `background-color: #333; display: flex; align-items: center; justify-content: center;`;
                let innerContent = profile.image ? '' : '<i class="fa-solid fa-user" style="font-size:24px; color:#666;"></i>';

                item.innerHTML = `
                    <div class="cte-nf-profile-img" style="${bgStyle}">${innerContent}</div>
                    <div class="cte-nf-profile-name">${name}</div>
                `;
                grid.appendChild(item);
            }
            modal.style.display = 'flex';
        },

        closeModal: function() {
            const modal = document.getElementById('cte-nf-modal');
            if (modal) modal.style.display = 'none';
        },

        // 确认生成指令
        confirmAssignment: function() {
            const selectedEls = document.querySelectorAll('.cte-nf-profile-item.selected');
            const selectedNames = Array.from(selectedEls).map(el => el.dataset.name);

            if (selectedNames.length === 0) {
                alert("Who is watching? Please select at least one member.");
                return;
            }

            const actObj = this.allActivities.find(a => a.name === this.currentActivity);
            const desc = actObj ? actObj.desc : "";

            const text = `{{user}} 决定与 ${selectedNames.join('、')} 做爱：${this.currentActivity}。${desc}`;

            if (typeof stContext !== 'undefined' && stContext) {
                stContext.executeSlashCommandsWithOptions(`/setinput ${text}`);
                this.closeModal();
                
                // 尝试关闭主面板
                const panel = document.getElementById('cte-idol-map-panel');
                if (panel) {
                    if (typeof $ !== 'undefined') $(panel).fadeOut();
                    else panel.style.display = 'none';
                }
            } else {
                alert("指令已生成 (模拟): " + text);
                this.closeModal();
            }
        },

        init: function() {
            this.renderGrid();
        }
    };

    // 合并核心数据
    Object.assign(window.CTEIdolManager, {
        currentDestination: '',
        currentCompanion: '', 
        currentScheduleItem: '', 
        isSelectingForSchedule: false,
        tempScheduleParticipants: [],
        tempNPCState: { enabled: false, content: '' },
        availableParticipants: ['{{user}}', '秦述', '司洛', '鹿言', '魏星泽', '周锦宁', '谌绪', '孟明赫', '亓谢', '魏月华', '桑洛凡'],
        
        npcDefaults: {
            '机场': '粉丝、工作人员、其他团队成员',
            '京港电视台': '粉丝、工作人员、其他团队成员',
            '私人会所': '社交名流'
        },

        nationalCities: [
            { id: 'jinggang', name: '京港', icon: 'fa-landmark-dome', top: '20%', left: '70%', isReturn: true, info: '<strong><i class="fa-solid fa-crown"></i> 首都:</strong> 首都，政治经济文化中心，权贵聚集，国际化大都市，夜生活极度繁华。摩天大楼与历史建筑交错，霓虹灯下的金融街与老城区并存。' },
            { id: 'langjing', name: '琅京', icon: 'fa-gem', top: '40%', left: '80%', info: '<strong><i class="fa-solid fa-coins"></i> 豪门金库:</strong> 全国第二大城市，金融与地产重镇，豪门世家聚集。宽阔大道、豪宅林立，老钱家族与新贵共存。' },
            { id: 'shenzhou', name: '深州', icon: 'fa-microchip', top: '80%', left: '75%', info: '<strong><i class="fa-solid fa-chart-line"></i> 科技前沿:</strong> 沿海经济特区，科技与贸易发达，外企众多，生活节奏快。高科技园区、港口码头、国际社区。' },
            { id: 'haizhou', name: '海洲', icon: 'fa-anchor', top: '75%', left: '55%', info: '<strong><i class="fa-solid fa-skull-crossbones"></i> 灰色地带:</strong> 港口城市，地下势力活跃，赌场、夜店、黑市盛行。霓虹闪烁的港口、老旧仓库与豪华赌场并存。' },
            { id: 'taihe', name: '台河', icon: 'fa-book-open', top: '30%', left: '40%', info: '<strong><i class="fa-solid fa-graduation-cap"></i> 学术之城:</strong> 历史文化名城，教育与艺术氛围浓厚，名校云集。古典建筑、博物馆、大学城。' },
            { id: 'huashao', name: '化邵', icon: 'fa-industry', top: '50%', left: '20%', info: '<strong><i class="fa-solid fa-wrench"></i> 工业心脏:</strong> 重工业城市，工人阶层为主，生活节奏慢，治安一般。工厂烟囱、老旧居民区、工业遗址。' },
            { id: 'yucheng', name: '玉城', icon: 'fa-martini-glass-citrus', top: '65%', left: '35%', info: '<strong><i class="fa-solid fa-sun"></i> 旅游胜地，风景优美，度假产业发达，富人休闲首选。湖光山色、度假别墅、五星级酒店。' },
        ],

        // 角色档案
        characterProfiles: {
            '魏月华': { image: 'https://files.catbox.moe/auqnct.jpeg', age: 27, role: '万城娱乐CEO', personality: '严肃、冷酷', rpgStats: { vocal: 0, dance: 0, eloquence: 0, acting: 0 }, status: { desire: 0, affection: 0 } },
            '秦述': { image: 'https://files.catbox.moe/c2khbl.jpeg', age: 24, role: '队长、主舞', personality: '沉默、清冷', rpgStats: { vocal: 0, dance: 0, eloquence: 0, acting: 0 }, status: { desire: 0, affection: 0 } },
            '司洛': { image: 'https://files.catbox.moe/pohz52.jpeg', age: 24, role: '全能ACE', personality: '慵懒、随性', rpgStats: { vocal: 0, dance: 0, eloquence: 0, acting: 0 }, status: { desire: 0, affection: 0 } },
            '鹿言': { image: 'https://files.catbox.moe/parliq.jpeg', age: 23, role: '主唱担当', personality: '温柔、谦逊', rpgStats: { vocal: 0, dance: 0, eloquence: 0, acting: 0 }, status: { desire: 0, affection: 0 } },
            '魏星泽': { image: 'https://files.catbox.moe/syo0ze.jpeg', age: 20, role: '舞蹈、气氛', personality: '开朗、感性', rpgStats: { vocal: 0, dance: 0, eloquence: 0, acting: 0 }, status: { desire: 0, affection: 0 } },
            '周锦宁': { image: 'https://files.catbox.moe/1loxsn.jpeg', age: 20, role: 'Rapper、门面', personality: '傲娇、矜贵', rpgStats: { vocal: 0, dance: 0, eloquence: 0, acting: 0 }, status: { desire: 0, affection: 0 } },
            '谌绪': { image: 'https://files.catbox.moe/9tnuva.png', age: 18, role: '主唱、忙内', personality: '腹黑、恶劣', rpgStats: { vocal: 0, dance: 0, eloquence: 0, acting: 0 }, status: { desire: 0, affection: 0 } },
            '孟明赫': { image: 'https://files.catbox.moe/m446ro.jpeg', age: 20, role: 'Rapper', personality: '阴郁、厌世', rpgStats: { vocal: 0, dance: 0, eloquence: 0, acting: 0 }, status: { desire: 0, affection: 0 } },
            '亓谢': { image: 'https://files.catbox.moe/ev2g1l.png', age: 18, role: '舞蹈、副Rapper', personality: '疯批、天才', rpgStats: { vocal: 0, dance: 0, eloquence: 0, acting: 0 }, status: { desire: 0, affection: 0 } },
            '桑洛凡': { image: 'https://files.catbox.moe/syudzu.png', age: 27, role: '传奇Solo', personality: '慵懒、桀骜', rpgStats: { vocal: 0, dance: 0, eloquence: 0, acting: 0 }, status: { desire: 0, affection: 0 } },
            '你': { image: '', age: '?', role: 'CTE宿舍成员', personality: '由你定义', rpgStats: { vocal: 0, dance: 0, eloquence: 0, acting: 0 }, status: { desire: 0, affection: 0 } }
        },

        roomDetails: {
            '前院与玄关': '设有小型日式枯山水庭院与智能安防通道。',
            '客厅/公共休息区': '挑高设计，配有超大尺寸沙发和家庭影院。',
            '开放式厨房与餐厅': '设备齐全的专业级中西厨。',
            '储藏室与洗衣房': '存放生活用品和演出服装。',
            '后院与露天泳池': '精心打理的草坪和恒温泳池。',
            '周锦宁个人工作室': '顶级音乐制作设备。',
            '孟明赫个人工作室': '顶级音乐制作设备。',
            '乐器练习室': '存放钢琴、吉他等乐器。',
            '游戏娱乐室': '最新游戏主机和电竞椅。',
            '私人会客厅': '温馨私密的接待空间。',
            '收藏室': '存放礼物和奖杯。',
            '主舞蹈室': '巨大的排练空间，配有镜墙。',
            '声乐录音棚': '行业顶尖标准的录音室。',
            '造型与衣帽间': '挂满私服和演出服，配有化妆镜。',
            '成员休息室': '懒人沙发和零食饮料。',
            '会议室': '配备投影仪的大会议桌。',
            '健身房': '有氧和力量器械齐全。',
            '瑜伽与冥想室': '安静的环境，柔软地板。',
            '水疗与按摩室': '按摩浴缸和理疗床。',
            '健康管理室': '医疗用品和监测设备。',
            '公共书房/阅览区': '藏书丰富的大书架。'
        }
    });

    // ==========================================
    // [NEW] 2.0 合约通告模块 (Contracts Manager)
    // ==========================================
    window.CTEIdolManager.Contracts = {
        pendingCard: null,
        pendingRawContract: "",

        TYPE_CONFIG: {
            'movie': { css: 'cte-type-movie', badge: 'cte-badge-movie', label: 'Movie & TV' },
            'music': { css: 'cte-type-music', badge: 'cte-badge-music', label: 'Music' },
            'stage': { css: 'cte-type-stage', badge: 'cte-badge-stage', label: 'Stage' },
            'variety': { css: 'cte-type-variety', badge: 'cte-badge-variety', label: 'Variety' },
            'ad': { css: 'cte-type-ad', badge: 'cte-badge-ad', label: 'Ad' }
        },
        
        // Memo Type Config
        MEMO_TYPE_CONFIG: {
            'movie': { css: 'cte-memo-type-movie', bg: 'cte-memo-bg-movie', fill: 'cte-memo-fill-movie', label: 'Movie/TV' },
            'music': { css: 'cte-memo-type-music', bg: 'cte-memo-bg-music', fill: 'cte-memo-fill-music', label: 'Music' },
            'variety': { css: 'cte-memo-type-variety', bg: 'cte-memo-bg-variety', fill: 'cte-memo-fill-variety', label: 'Variety' },
            'ad': { css: 'cte-memo-type-ad', bg: 'cte-memo-bg-ad', fill: 'cte-memo-fill-ad', label: 'AD' },
            'stage': { css: 'cte-memo-type-stage', bg: 'cte-memo-bg-stage', fill: 'cte-memo-fill-stage', label: 'Stage' },
            'group': { css: 'cte-memo-type-group', bg: 'cte-memo-bg-group', fill: 'cte-memo-fill-group', label: 'Group' }
        },

        init: function() {
            // No specific init needed, functions called on demand
        },

        // --- Agency Contract Logic ---
        getContractsContent: function() {
            let context = stContext;
            if (!context && window.SillyTavern) context = window.SillyTavern.getContext();
            if (!context || !context.chat) return null;

            for (let i = context.chat.length - 1; i >= 0; i--) {
                const msg = context.chat[i].mes || "";
                const match = msg.match(/<contracts>([\s\S]*?)<\/contracts>/i);
                if (match) return match[1].trim();
            }
            return null;
        },

        detectType: function(text) {
            text = text.toLowerCase();
            if (text.includes('电影') || text.includes('电视剧') || text.includes('movie') || text.includes('tv') || text.includes('网剧')) return 'movie';
            if (text.includes('唱片') || text.includes('music') || text.includes('歌') || text.includes('专辑') || text.includes('ost')) return 'music';
            if (text.includes('舞台') || text.includes('stage') || text.includes('打歌') || text.includes('公演') || text.includes('唱跳')) return 'stage';
            if (text.includes('综艺') || text.includes('variety') || text.includes('show') || text.includes('真人秀')) return 'variety';
            if (text.includes('广告') || text.includes('ad') || text.includes('代言') || text.includes('大使')) return 'ad';
            if (text.includes('组合') || text.includes('group') || text.includes('团')) return 'group';
            return 'movie'; // Default
        },

        parseAttributes: function(attrString) {
            const attrs = [
                { key: '歌艺', label: '歌艺', val: '-' },
                { key: '舞蹈', label: '舞蹈', val: '-' },
                { key: '口才', label: '口才', val: '-' },
                { key: '表演', label: '表演', val: '-' }
            ];
            if (!attrString || attrString === '-') return attrs;
            const cleanStr = attrString.replace(/，/g, ',').replace(/\//g, '/'); 
            attrs.forEach(attr => {
                const regex = new RegExp(`${attr.key}[:\\s]*([\\d/]+)`, 'i');
                const match = cleanStr.match(regex);
                if (match) attr.val = match[1];
            });
            return attrs;
        },

        createCardHTML: function(data, index, rawString) {
            const typeKey = this.detectType(data.type);
            const style = this.TYPE_CONFIG[typeKey] || this.TYPE_CONFIG['movie'];
            const attrs = this.parseAttributes(data.reqs);
            const attrHtml = attrs.map(a => {
                const isHigh = parseInt(a.val) > 80; 
                return `<div class="cte-item-req-row"><span class="cte-item-req-label">${a.label}</span><span class="cte-item-req-val ${isHigh ? 'danger' : ''}">${a.val}</span></div>`;
            }).join('');

            const safeRawString = rawString.replace(/'/g, "\\'").replace(/"/g, '&quot;');

            return `
                <div class="cte-agency-item ${style.css}" data-category="${typeKey}" id="cte-c-${index}">
                    <div class="cte-item-stamp">AUTHORIZED</div>
                    <div class="cte-item-header">
                        <div class="cte-item-title-group">
                            <h3>${data.name}</h3>
                            <div class="cte-item-company">${data.company}</div>
                        </div>
                        <span class="cte-item-badge ${style.badge}">${data.job}</span>
                    </div>
                    <div class="cte-item-req-grid">${attrHtml}</div>
                    <div class="cte-item-footer">
                        <div>
                            <div class="cte-item-payment">${data.pay}</div>
                            <div class="cte-item-days">${data.duration}</div>
                        </div>
                        <button class="cte-item-sign-btn" onclick="window.CTEIdolManager.Contracts.openSignModal(this, '${safeRawString}')">签署合约</button>
                    </div>
                </div>
            `;
        },

        renderView: function(container) {
            const rawText = this.getContractsContent();
            let listHtml = '';
            let count = 0;
            const today = new Date();
            const dateStr = `${today.getMonth()+1}/${today.getDate()}`;
            const funds = window.CTEIdolManager.RPG.state.funds.toLocaleString();

            if (rawText) {
                const cleanText = rawText.replace(/<\/?contracts>/g, '');
                const pattern = /\[(?:通告|Contract)\s*[\|｜]\s*(.*?)\s*[\|｜]\s*(.*?)\s*[\|｜]\s*(.*?)\s*[\|｜]\s*(.*?)\s*[\|｜]\s*(.*?)\s*[\|｜]\s*(.*?)\s*[\|｜]\s*(.*?)\]/g;
                let match;
                while ((match = pattern.exec(cleanText)) !== null) {
                    const data = {
                        type: match[1].trim(),
                        name: match[2].trim(),
                        company: match[3].trim(),
                        job: match[4].trim(),
                        reqs: match[5].trim(),
                        pay: match[6].trim(),
                        duration: match[7].trim()
                    };
                    listHtml += this.createCardHTML(data, count++, match[0]);
                }
            }

            if (listHtml === '') {
                listHtml = '<div class="cte-agency-empty">暂无符合格式的通告<br>No Contracts Available</div>';
            }

            const html = `
                <div class="cte-agency-scope cte-agency-container">
                    <div class="cte-agency-card">
                        <header class="cte-agency-header">
                            <div class="cte-agency-title">
                                <h1>通告接洽</h1>
                            </div>
                            <div class="cte-agency-meta">
                                <div>AVAILABLE: ${count < 10 ? '0' + count : count}</div>
                                <div>DATE: ${dateStr}</div>
                            </div>
                        </header>

                        <div class="cte-agency-resource-bar">
                            <div class="cte-agency-res-item">
                                <i class="fa-solid fa-sack-dollar cte-agency-res-icon"></i>
                                <span class="cte-agency-res-label">资金:</span>
                                <span class="cte-agency-res-val">${funds}</span>
                            </div>
                        </div>

                        <div class="cte-agency-tabs">
                            <button class="cte-agency-tab-btn active" onclick="window.CTEIdolManager.Contracts.filter('all', this)">全部 / All</button>
                            <button class="cte-agency-tab-btn" onclick="window.CTEIdolManager.Contracts.filter('movie', this)">影视 / Movie</button>
                            <button class="cte-agency-tab-btn" onclick="window.CTEIdolManager.Contracts.filter('music', this)">唱片 / Music</button>
                            <button class="cte-agency-tab-btn" onclick="window.CTEIdolManager.Contracts.filter('stage', this)">舞台 / Stage</button>
                            <button class="cte-agency-tab-btn" onclick="window.CTEIdolManager.Contracts.filter('variety', this)">综艺 / Variety</button>
                            <button class="cte-agency-tab-btn" onclick="window.CTEIdolManager.Contracts.filter('ad', this)">广告 / Ad</button>
                        </div>

                        <div class="cte-agency-list" id="cte-agency-list-container">
                            ${listHtml}
                        </div>
                        
                        <div style="margin-top: 15px; border-top: 2px solid var(--cte-agency-text-primary); padding-top:10px; opacity:0.6; font-size:10px; display:flex; justify-content:space-between;">
                            <span>在酒馆输入框中发送"查看通告"</span>
                            <span>即可刷新</span>
                        </div>
                    </div>
                </div>

                <!-- 成员选择弹窗 (嵌入) -->
                <div class="cte-agency-modal-overlay cte-agency-scope" id="cte-agency-sign-modal">
                    <div class="cte-agency-modal-content">
                        <div class="cte-agency-modal-title">ASSIGN MEMBER</div>
                        <div class="cte-agency-modal-subtitle">请选择接取通告的成员</div>
                        
                        <div class="cte-agency-member-grid">
                            <button class="cte-agency-select-btn" onclick="window.CTEIdolManager.Contracts.confirmSign('桑洛凡')">桑洛凡</button>
                            <button class="cte-agency-select-btn" onclick="window.CTEIdolManager.Contracts.confirmSign('秦述')">秦述</button>
                            <button class="cte-agency-select-btn" onclick="window.CTEIdolManager.Contracts.confirmSign('司洛')">司洛</button>
                            <button class="cte-agency-select-btn" onclick="window.CTEIdolManager.Contracts.confirmSign('鹿言')">鹿言</button>
                            <button class="cte-agency-select-btn" onclick="window.CTEIdolManager.Contracts.confirmSign('魏星泽')">魏星泽</button>
                            <button class="cte-agency-select-btn" onclick="window.CTEIdolManager.Contracts.confirmSign('周锦宁')">周锦宁</button>
                            <button class="cte-agency-select-btn" onclick="window.CTEIdolManager.Contracts.confirmSign('谌绪')">谌绪</button>
                            <button class="cte-agency-select-btn" onclick="window.CTEIdolManager.Contracts.confirmSign('孟明赫')">孟明赫</button>
                            <button class="cte-agency-select-btn" onclick="window.CTEIdolManager.Contracts.confirmSign('亓谢')">亓谢</button>
                            <button class="cte-agency-select-btn full-width" onclick="window.CTEIdolManager.Contracts.confirmSign('CTE男团全员')">CTE男团全员</button>
                        </div>

                        <div style="margin-top: 8px; border-top: 1px dashed #ccc; padding-top: 8px;">
                            <div style="font-size: 10px; color: var(--cte-agency-text-secondary); margin-bottom: 4px; text-align: left;">其他成员 / OTHER</div>
                            <div style="display: flex; gap: 5px;">
                                <input type="text" id="cte-agency-custom-member" placeholder="输入姓名..." style="flex: 1; padding: 6px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px; outline: none;">
                                <button class="cte-agency-select-btn" onclick="window.CTEIdolManager.Contracts.confirmCustomSign()" style="width: auto; padding: 6px 12px; background: #eee;">确认</button>
                            </div>
                        </div>

                        <button class="cte-agency-close-btn" onclick="window.CTEIdolManager.Contracts.closeModal()">取消操作 / CANCEL</button>
                    </div>
                </div>
            `;
            container.innerHTML = html;
        },

        filter: function(category, btnElement) {
            const buttons = document.querySelectorAll('.cte-agency-tab-btn');
            buttons.forEach(btn => btn.classList.remove('active'));
            btnElement.classList.add('active');

            const cards = document.querySelectorAll('.cte-agency-item');
            cards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        },

        openSignModal: function(btn, rawString) {
            this.pendingCard = btn.closest('.cte-agency-item');
            this.pendingRawContract = rawString;
            document.getElementById('cte-agency-sign-modal').classList.add('active');
        },

        closeModal: function() {
            // 增加判断：只有当元素存在时才移除 active 类，防止报错
            const agencyModal = document.getElementById('cte-agency-sign-modal');
            if (agencyModal) agencyModal.classList.remove('active');

            const memoModal = document.getElementById('cte-memo-manual-modal');
            if (memoModal) memoModal.classList.remove('active');

            this.pendingCard = null;
            this.pendingRawContract = "";
    
            // 清理输入框
            const input = document.getElementById('cte-agency-custom-member');
            if(input) input.value = '';
        },

        confirmSign: function(memberName) {
            if (!this.pendingCard || !this.pendingRawContract) return;
            this.pendingCard.classList.add('signed');
            const message = `${memberName} 接取通告：${this.pendingRawContract}`;
            if (stContext) {
                stContext.executeSlashCommandsWithOptions(`/setinput ${message}`);
            }
            this.closeModal();
        },

        confirmCustomSign: function() {
            const input = document.getElementById('cte-agency-custom-member');
            const name = input.value.trim();
            if (name) {
                this.confirmSign(name);
            } else {
                input.style.borderColor = '#a84444';
                setTimeout(() => input.style.borderColor = '#ddd', 500);
            }
        },

        // --- Active Contracts Memo Logic (New) ---

        getStoryDate: function() {
            const statusTop = window.CTEIdolManager.getStatusTopContent();
            if (statusTop) {
                // Try parsing "YYYY年MM月DD日" or "YYYY/MM/DD"
                const match = statusTop.match(/(\d{4})[年/-](\d{1,2})[月/-](\d{1,2})[日\s]?/);
                if (match) {
                    const year = parseInt(match[1]);
                    const month = parseInt(match[2]) - 1; 
                    const day = parseInt(match[3]);
                    return new Date(year, month, day);
                }
            }
            return new Date(); // Fallback to real today
        },

        getStoredMemoContracts: function() {
            try {
                return JSON.parse(localStorage.getItem('cte_memo_contracts') || '[]');
            } catch (e) { return []; }
        },

        saveMemoContract: function(contract) {
            const list = this.getStoredMemoContracts();
            list.unshift(contract);
            localStorage.setItem('cte_memo_contracts', JSON.stringify(list));
        },

        removeMemoContract: function(id) {
            if(!confirm("确认结束或删除此通告？")) return;
            let list = this.getStoredMemoContracts();
            list = list.filter(c => c.id !== id);
            localStorage.setItem('cte_memo_contracts', JSON.stringify(list));
            // Re-render
            const listContainer = document.getElementById('cte-memo-list-container');
            if(listContainer) this.renderMemoList(listContainer);
            this.updateMemoSummary();
        },

        updateMemoSummary: function() {
            const list = this.getStoredMemoContracts();
            const countEl = document.getElementById('cte-memo-sum-count');
            const totalEl = document.getElementById('cte-memo-sum-total');
            if(countEl) countEl.innerText = list.length;
            if(totalEl) totalEl.innerText = list.length;
        },

        renderMemoCard: function() {
            const storyDate = this.getStoryDate();
            const dateStr = `${storyDate.getFullYear()}年${storyDate.getMonth()+1}月${storyDate.getDate()}日`;
            
            return `
                <div class="cte-memo-wrapper">
                    <div class="cte-memo-card">
                        <header class="cte-memo-header">
                            <div class="cte-memo-header-title">
                                <h1>现有通告备忘录</h1>
                                <div class="cte-memo-header-subtitle">
                                    <span>当前故事日期:</span>
                                    <span class="cte-memo-current-story-date">${dateStr}</span>
                                </div>
                            </div>
                            <div class="cte-memo-header-actions">
                                <button class="cte-memo-btn-header" onclick="window.CTEIdolManager.Contracts.openMemoModal()">+ 登记通告</button>
                            </div>
                        </header>

                        <div class="cte-memo-summary-bar">
                            <div class="cte-memo-summary-item">
                                <span class="cte-memo-sum-val" id="cte-memo-sum-count">0</span>
                                <span class="cte-memo-sum-label">执行中 / ACTIVE</span>
                            </div>
                            <div class="cte-memo-summary-item" style="border-left-color: #4a6fa5;">
                                <span class="cte-memo-sum-val" id="cte-memo-sum-total">0</span>
                                <span class="cte-memo-sum-label">存档总数</span>
                            </div>
                        </div>

                        <div class="cte-memo-list" id="cte-memo-list-container">
                            <!-- Populated by JS -->
                        </div>
                        
                        <div style="margin-top: 15px; border-top: 2px solid #1a1a1a; padding-top:10px; opacity:0.6; font-size:10px; display:flex; justify-content:space-between;">
                            <span>SYSTEM: MEMO MODE</span>
                            <span>SYNCED</span>
                        </div>
                    </div>
                </div>
            `;
        },

        renderMemoList: function(container) {
            const list = this.getStoredMemoContracts();
            const currentStoryTime = this.getStoryDate().getTime();
            
            if (list.length === 0) {
                container.innerHTML = '<div class="cte-memo-empty-state">暂无记录<br>点击右上角登记新通告</div>';
                return;
            }

            let html = '';
            list.forEach(item => {
                const style = this.MEMO_TYPE_CONFIG[item.type] || this.MEMO_TYPE_CONFIG['movie'];
                let avatarUrl = 'https://placehold.co/100x100/222/fff?text=CTE';
                
                // Try to find avatar
                const profile = window.CTEIdolManager.characterProfiles[item.relatedMember];
                if (profile) avatarUrl = profile.image;
                if (item.type === 'group') avatarUrl = 'https://placehold.co/100x100/333/fff?text=CTE';

                // Progress Calc
                let progress = 0;
                if (item.durationDays > 0) {
                    const elapsedDays = (currentStoryTime - item.startTime) / (1000 * 60 * 60 * 24);
                    progress = Math.floor((elapsedDays / item.durationDays) * 100);
                    progress = Math.max(0, Math.min(100, progress));
                } else {
                    progress = 5; 
                }
                if (progress > 0 && progress < 5) progress = 5;

                html += `
                <div class="cte-memo-item ${style.css}">
                    <div class="cte-memo-item-header">
                        <span class="cte-memo-item-type ${style.bg}">${item.typeLabel}</span>
                        <span class="cte-memo-item-status">进行中</span>
                    </div>
                    <div class="cte-memo-item-body">
                        <img src="${avatarUrl}" class="cte-memo-member-avatar">
                        <div class="cte-memo-info">
                            <div class="cte-memo-title">${item.title}</div>
                            <div class="cte-memo-company">${item.company}</div>
                            <span class="cte-memo-role-badge">${item.role}</span>
                        </div>
                    </div>
                    <div class="cte-memo-footer">
                        <div class="cte-memo-time-row">
                            <span>时长: ${item.durationStr}</span>
                            <span>薪酬: ${item.pay}</span>
                        </div>
                        <div class="cte-memo-progress-container">
                            <div class="cte-memo-progress-bar-bg"><div class="cte-memo-progress-bar-fill ${style.fill}" style="width: ${progress}%;"></div></div>
                            <span class="cte-memo-progress-val">${progress}%</span>
                        </div>
                        <div class="cte-memo-card-actions">
                            <button class="cte-memo-action-btn cte-memo-btn-complete" onclick="window.CTEIdolManager.Contracts.removeMemoContract(${item.id})">完成</button>
                            <button class="cte-memo-action-btn cte-memo-btn-delete" onclick="window.CTEIdolManager.Contracts.removeMemoContract(${item.id})">删除</button>
                        </div>
                    </div>
                </div>`;
            });
            container.innerHTML = html;
            this.updateMemoSummary();
        },

        getModalHTML: function() {
            return `
            <div class="cte-memo-modal-overlay" id="cte-memo-manual-modal">
                <div class="cte-memo-modal-box">
                    <div class="cte-memo-modal-title">登记新通告</div>
                    <p class="cte-memo-modal-subtitle">请粘贴文本：例如：鹿言 接取通告：[通告｜唱片...｜...]</p>
                    <textarea class="cte-memo-modal-textarea" id="cte-memo-contract-input" placeholder="例如：鹿言 接取通告：[通告｜唱片 / Music｜冬日恋曲｜索尼音乐｜合作单曲...｜-｜100W｜5天]"></textarea>
            
                    <div class="cte-memo-modal-input-group">
                        <label>接取日期(故事内):</label>
                        <input type="date" id="cte-memo-date-input" class="cte-memo-modal-date-input">
                    </div>

                    <div class="cte-memo-modal-actions">
                        <button class="cte-memo-modal-btn" onclick="window.CTEIdolManager.Contracts.closeModal()">取消</button>
                        <button class="cte-memo-modal-btn cte-memo-modal-btn-primary" 
                                style="background-color: #1a1a1a; color: white; border-color: #1a1a1a;"
                                onclick="window.CTEIdolManager.Contracts.parseAndAddMemo()">确认登记</button>
                    </div>
                </div>
            </div>`;
        },

        openMemoModal: function() {
            const modal = document.getElementById('cte-memo-manual-modal');
            const dateInput = document.getElementById('cte-memo-date-input');
            const textInput = document.getElementById('cte-memo-contract-input');
            
            if (modal) {
                modal.classList.add('active');
                if (textInput) textInput.value = '';
                if (dateInput) {
                    // Set default to current story date
                    const d = this.getStoryDate();
                    // Format YYYY-MM-DD for input[type=date]
                    const yyyy = d.getFullYear();
                    const mm = String(d.getMonth() + 1).padStart(2, '0');
                    const dd = String(d.getDate()).padStart(2, '0');
                    dateInput.value = `${yyyy}-${mm}-${dd}`;
                }
            }
        },

        parseAndAddMemo: function() {
            const raw = document.getElementById('cte-memo-contract-input').value.trim();
            const dateVal = document.getElementById('cte-memo-date-input').value;
            if (!raw) return;

            const match = raw.match(/\[(.*?)\]/);
            if (!match) {
                alert("未找到标准格式内容，请确保包含 [通告｜...｜...] 结构");
                return;
            }

            const cleanStr = match[1];
            const prefix = raw.substring(0, match.index);
            
            // Extract name
            let extractedName = null;
            for (const name in window.CTEIdolManager.characterProfiles) {
                if (prefix.includes(name)) {
                    extractedName = name;
                    break;
                }
            }
            if (prefix.includes('全员') || prefix.includes('男团')) extractedName = 'CTE';

            const parts = cleanStr.split(/\||｜/).map(s => s.trim());
            if (parts.length < 5) {
                alert("格式无法识别，请检查是否包含完整的分割线 (｜)。");
                return;
            }

            let typeKey = 'movie';
            try {
                const typePart = parts[1] || '';
                if (typePart.toLowerCase().includes('music')) typeKey = 'music';
                else if (typePart.toLowerCase().includes('variety')) typeKey = 'variety';
                else if (typePart.toLowerCase().includes('ad')) typeKey = 'ad';
                else if (typePart.toLowerCase().includes('stage')) typeKey = 'stage';
                else if (typePart.toLowerCase().includes('group') || typePart.toLowerCase().includes('组合')) typeKey = 'group';
            } catch(e) {}

            const durationStr = parts[7] || '待定';
            const durationNum = parseInt(durationStr) || 0; 
            
            const startDate = dateVal ? new Date(dateVal).getTime() : this.getStoryDate().getTime();

            const newContract = {
                id: Date.now(),
                type: typeKey,
                typeLabel: parts[1] ? parts[1].split('/')[0] : '通告',
                title: parts[2] || '未知标题',
                company: parts[3] || '未知公司',
                role: parts[4] || '未知角色',
                reqs: parts[5] || '-',
                pay: parts[6] || '-',
                durationStr: durationStr,
                durationDays: durationNum,
                startTime: startDate, 
                relatedMember: extractedName
            };

            this.saveMemoContract(newContract);
            this.closeModal();
            // Refresh
            const container = document.getElementById('cte-memo-list-container');
            if(container) this.renderMemoList(container);
        }
    };

    // ==========================================
    // [NEW] 3.0 采购中心模块 (Shop Manager)
    // ==========================================
    window.CTEIdolManager.Shop = {
        items: [],
        pendingItem: null,
        currentStep: 1, // 1: Buyer, 2: Beneficiary
        selectedBuyer: null,
        selectedBeneficiary: null,
        isMenuExpanded: false, // For mobile menu toggle state
        
        CATEGORY_CONFIG: {
            'marketing': { label: 'MARKETING', icon: 'fa-bullhorn', slug: 'marketing' },
            'training': { label: 'TRAINING', icon: 'fa-graduation-cap', slug: 'training' },
            'staff': { label: 'STAFF', icon: 'fa-user-tie', slug: 'staff' },
            'fan': { label: 'FAN SUPPORT', icon: 'fa-heart', slug: 'fan' },
            'travel': { label: 'TRAVEL', icon: 'fa-plane-departure', slug: 'travel' },
            'invest': { label: 'INVESTMENT', icon: 'fa-building', slug: 'invest' },
            'vehicle': { label: 'VEHICLE', icon: 'fa-car', slug: 'vehicle' },
            'fashion': { label: 'LUXURY', icon: 'fa-gem', slug: 'fashion' },
            'gear': { label: 'GEAR', icon: 'fa-sliders', slug: 'gear' },
            'living': { label: 'HOME', icon: 'fa-couch', slug: 'living' },
            'food': { label: 'FOOD', icon: 'fa-utensils', slug: 'food' },
            'gift': { label: 'GIFT', icon: 'fa-gift', slug: 'gift' }
        },

        getCategoryConfig: function(rawCat) {
            const lowerCat = rawCat.toLowerCase();
            if (lowerCat.includes('营销') || lowerCat.includes('pr') || lowerCat.includes('marketing')) return this.CATEGORY_CONFIG['marketing'];
            if (lowerCat.includes('课程') || lowerCat.includes('edu') || lowerCat.includes('training')) return this.CATEGORY_CONFIG['training'];
            if (lowerCat.includes('团队') || lowerCat.includes('staff')) return this.CATEGORY_CONFIG['staff'];
            if (lowerCat.includes('粉丝') || lowerCat.includes('fan')) return this.CATEGORY_CONFIG['fan'];
            if (lowerCat.includes('旅游') || lowerCat.includes('travel')) return this.CATEGORY_CONFIG['travel'];
            if (lowerCat.includes('投资') || lowerCat.includes('invest')) return this.CATEGORY_CONFIG['invest'];
            if (lowerCat.includes('载具') || lowerCat.includes('auto') || lowerCat.includes('vehicle')) return this.CATEGORY_CONFIG['vehicle'];
            if (lowerCat.includes('时尚') || lowerCat.includes('fashion')) return this.CATEGORY_CONFIG['fashion'];
            if (lowerCat.includes('设备') || lowerCat.includes('gear')) return this.CATEGORY_CONFIG['gear'];
            if (lowerCat.includes('家居') || lowerCat.includes('home') || lowerCat.includes('living')) return this.CATEGORY_CONFIG['living'];
            if (lowerCat.includes('饮食') || lowerCat.includes('food')) return this.CATEGORY_CONFIG['food'];
            return this.CATEGORY_CONFIG['gift'];
        },

        scanChatForShop: function() {
            let context = stContext;
            if (!context && window.SillyTavern) context = window.SillyTavern.getContext();
            if (!context || !context.chat) return null;

            for (let i = context.chat.length - 1; i >= 0; i--) {
                const msg = context.chat[i].mes || "";
                const match = msg.match(/<shop>([\s\S]*?)<\/shop>/i);
                if (match) {
                    this.parseShopData(match[1].trim());
                    return;
                }
            }
            this.items = []; // Clear if not found
        },

        parseShopData: function(content) {
            this.items = [];
            const lines = content.split('\n').filter(line => line.trim().startsWith('[') && line.trim().endsWith(']'));
            
            lines.forEach((line, index) => {
                const parts = line.slice(1, -1).split('｜');
                if (parts.length < 8) return;
                
                const [tag, categoryRaw, name, brand, desc, effect, priceStr, stock] = parts;
                
                // Parse Price
                let priceVal = 0;
                try {
                    priceVal = parseInt(priceStr.replace(/,/g, '').replace(/CNY/i, '').trim()) || 0;
                } catch(e) {}

                const catConfig = this.getCategoryConfig(categoryRaw);

                this.items.push({
                    id: `shop_item_${index}`,
                    rawCategory: categoryRaw,
                    categorySlug: catConfig.slug,
                    categoryLabel: catConfig.label,
                    icon: catConfig.icon,
                    name: name,
                    brand: brand,
                    desc: desc,
                    effect: effect,
                    priceStr: priceStr,
                    priceVal: priceVal,
                    stock: stock,
                    rawLine: line.trim() // Captured full raw line for command output
                });
            });
        },

        renderView: function(container) {
            this.scanChatForShop(); // Refresh data
            
            const funds = window.CTEIdolManager.RPG.state.funds.toLocaleString();
            
            let itemsHtml = '';
            if (this.items.length === 0) {
                itemsHtml = '<div style="text-align:center; padding:50px; color:#888;">暂无上架商品<br>请确保上下文中包含 &lt;shop&gt; 标签数据</div>';
            } else {
                this.items.forEach(item => {
                    itemsHtml += this.createItemHTML(item);
                });
            }

            // Build dynamic tabs with toggle logic for mobile
            // Use helper to construct tab HTML string
            const tabsHtml = this.generateTabsHTML();

            const html = `
                <div class="cte-shop-scope cte-agency-container">
                    <div class="cte-shop-card">
                        <header class="cte-shop-header">
                            <div class="cte-shop-title">
                                <h1>CTE 采购中心</h1>
                            </div>
                            <div class="cte-shop-meta">
                                <div>物价仅供参考</div>
                                <div>STATUS: ACTIVE</div>
                            </div>
                        </header>

                        <div class="cte-shop-resource-bar">
                            <div class="cte-shop-res-item">
                                <i class="fa-solid fa-wallet cte-shop-res-icon"></i>
                                <span class="cte-shop-res-label">预算 Budget:</span>
                            </div>
                            <div class="cte-shop-res-item">
                                <span class="cte-shop-res-val">${funds}</span> 
                            </div>
                        </div>

                        <!-- 
                           Requirement 3: Tab Container with Toggle Class Logic
                           Checks this.isMenuExpanded to set initial class if re-rendered
                        -->
                        <div class="cte-shop-tabs ${this.isMenuExpanded ? 'cte-shop-mobile-expanded' : ''}" id="cte-shop-tabs-container">
                            ${tabsHtml}
                        </div>

                        <div class="cte-shop-list" id="cte-shop-list-container">
                            ${itemsHtml}
                        </div>
                        
                        <div style="margin-top: auto; padding-top:10px; opacity:0.6; font-size:9px; display:flex; justify-content:space-between; border-top: 1px solid #ddd;">
                            <span>在酒馆输入框中发送"查看商店"</span>
                            <span>即可刷新</span>
                        </div>
                    </div>
                </div>

                <!-- 购物确认弹窗 -->
                <div class="cte-shop-modal-overlay cte-shop-scope" id="cte-shop-modal">
                    <div class="cte-shop-modal-box">
                        <div class="cte-shop-modal-header" style="display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px dashed #ccc; padding-bottom:5px;">
                            <div class="cte-shop-modal-title" id="cte-shop-modal-title" style="margin:0;">谁来购买 / WHO BUYS</div>
                            <button class="cte-shop-close-btn" style="width:auto; margin:0;" onclick="window.CTEIdolManager.Shop.closeModal()">x</button>
                        </div>
                        
                        <div class="cte-shop-grid-select">
                            <div class="cte-shop-select-btn cte-shop-span-full" onclick="window.CTEIdolManager.Shop.selectMember(this, 'CTE全员')">
                                <span class="name">CTE 全员</span><span class="role-tag">Team</span>
                            </div>
                            <div class="cte-shop-select-btn cte-shop-span-half" onclick="window.CTEIdolManager.Shop.selectMember(this, '魏月华')">
                                <span class="name">魏月华</span><span class="role-tag">Manager</span>
                            </div>
                            <div class="cte-shop-select-btn cte-shop-span-half" onclick="window.CTEIdolManager.Shop.selectMember(this, '{{user}}')">
                                <span class="name">{{user}}</span><span class="role-tag">Me</span>
                            </div>
                            <div class="cte-shop-select-btn cte-shop-span-third" onclick="window.CTEIdolManager.Shop.selectMember(this, '桑洛凡')"><span class="name">桑洛凡</span><span class="role-tag">Legend</span></div>
                            <div class="cte-shop-select-btn cte-shop-span-third" onclick="window.CTEIdolManager.Shop.selectMember(this, '秦述')"><span class="name">秦述</span><span class="role-tag">Leader</span></div>
                            <div class="cte-shop-select-btn cte-shop-span-third" onclick="window.CTEIdolManager.Shop.selectMember(this, '司洛')"><span class="name">司洛</span><span class="role-tag">ACE</span></div>
                            <div class="cte-shop-select-btn cte-shop-span-third" onclick="window.CTEIdolManager.Shop.selectMember(this, '鹿言')"><span class="name">鹿言</span><span class="role-tag">Vocal</span></div>
                            <div class="cte-shop-select-btn cte-shop-span-third" onclick="window.CTEIdolManager.Shop.selectMember(this, '魏星泽')"><span class="name">魏星泽</span><span class="role-tag">Dancer</span></div>
                            <div class="cte-shop-select-btn cte-shop-span-third" onclick="window.CTEIdolManager.Shop.selectMember(this, '周锦宁')"><span class="name">周锦宁</span><span class="role-tag">Visual</span></div>
                            <div class="cte-shop-select-btn cte-shop-span-third" onclick="window.CTEIdolManager.Shop.selectMember(this, '谌绪')"><span class="name">谌绪</span><span class="role-tag">Vocal</span></div>
                            <div class="cte-shop-select-btn cte-shop-span-third" onclick="window.CTEIdolManager.Shop.selectMember(this, '孟明赫')"><span class="name">孟明赫</span><span class="role-tag">Rapper</span></div>
                            <div class="cte-shop-select-btn cte-shop-span-third" onclick="window.CTEIdolManager.Shop.selectMember(this, '亓谢')"><span class="name">亓谢</span><span class="role-tag">Rapper</span></div>
                            
                            <input type="text" class="cte-shop-other-input" id="cte-shop-other-input" placeholder="其他 / Other (请填写)" oninput="window.CTEIdolManager.Shop.selectOther(this)">
                        </div>

                        <button class="cte-shop-confirm-btn" id="cte-shop-confirm-btn" onclick="window.CTEIdolManager.Shop.handleModalButton()">下一步 / NEXT</button>
                    </div>
                </div>
            `;
            container.innerHTML = html;
        },

        // Helper to generate the tab HTML structure with mobile toggle buttons
        generateTabsHTML: function() {
            const tabs = [
                {k:'all', l:'All'}, {k:'marketing', l:'营销 PR'}, {k:'training', l:'课程 Edu'}, 
                {k:'staff', l:'团队 Staff'}, {k:'fan', l:'粉丝 Fan'}, {k:'travel', l:'旅游 Travel'}, 
                {k:'invest', l:'投资 Invest'}, {k:'vehicle', l:'载具 Auto'}, {k:'fashion', l:'时尚 Fashion'}, 
                {k:'gear', l:'设备 Gear'}, {k:'living', l:'家居 Home'}, {k:'food', l:'饮食 Food'}, 
                {k:'gift', l:'礼物 Gift'}
            ];

            let html = '';
            
            // Render "All" Button (Always First)
            html += `<button class="cte-shop-tab-btn active" data-key="${tabs[0].k}" onclick="window.CTEIdolManager.Shop.filter('${tabs[0].k}', this)">${tabs[0].l}</button>`;

            // Render Toggle Down Button (Visible on Mobile Collapsed via CSS)
            // onclick toggles the class on parent container
            html += `<button class="cte-shop-tab-btn cte-shop-tab-toggle cte-shop-toggle-down" onclick="window.CTEIdolManager.Shop.toggleMenu()">▼</button>`;

            // Render rest of the buttons
            for (let i = 1; i < tabs.length; i++) {
                html += `<button class="cte-shop-tab-btn" data-key="${tabs[i].k}" onclick="window.CTEIdolManager.Shop.filter('${tabs[i].k}', this)">${tabs[i].l}</button>`;
            }

            // Render Toggle Up Button (Visible on Mobile Expanded via CSS, at the very end)
            html += `<button class="cte-shop-tab-btn cte-shop-tab-toggle cte-shop-toggle-up" onclick="window.CTEIdolManager.Shop.toggleMenu()">▲</button>`;

            return html;
        },

        // Toggle logic for mobile menu
        toggleMenu: function() {
            this.isMenuExpanded = !this.isMenuExpanded;
            const container = document.getElementById('cte-shop-tabs-container');
            if (container) {
                if (this.isMenuExpanded) {
                    container.classList.add('cte-shop-mobile-expanded');
                } else {
                    container.classList.remove('cte-shop-mobile-expanded');
                }
            }
        },

        createItemHTML: function(item) {
            return `
                <div class="cte-shop-item" data-category="${item.categorySlug}" id="${item.id}">
                    <div class="cte-shop-img-placeholder"><i class="fa-solid ${item.icon}"></i></div>
                    <div class="cte-shop-details">
                        <div class="cte-shop-type-brand">
                            <span>${item.categoryLabel}</span>
                            <span>${item.brand}</span>
                        </div>
                        <span class="cte-shop-name">${item.name}</span>
                        <span class="cte-shop-desc">${item.desc}</span>
                        <span class="cte-shop-effect">${item.effect}</span>
                        <span class="cte-shop-stock" style="margin-top:2px;">库存: ${item.stock}</span>
                    </div>
                    <div class="cte-shop-action">
                        <span class="cte-shop-price">${item.priceStr}</span>
                        <button class="cte-shop-buy-btn" onclick="window.CTEIdolManager.Shop.openBuyModal('${item.id}')">购买</button>
                    </div>
                </div>
            `;
        },

        filter: function(category, btnElement) {
            // Update active state
            const buttons = document.querySelectorAll('.cte-shop-tab-btn');
            buttons.forEach(btn => btn.classList.remove('active'));
            if(btnElement) btnElement.classList.add('active');

            // Do the filtering
            const items = document.querySelectorAll('.cte-shop-item');
            items.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        },

        openBuyModal: function(itemId) {
            const item = this.items.find(i => i.id === itemId);
            if (!item) return;

            // Check Budget
            if (window.CTEIdolManager.RPG.state.funds < item.priceVal) {
                alert("资金不足！无法购买此商品。");
                return;
            }

            this.pendingItem = item;
            
            // Step 1 Reset
            this.currentStep = 1;
            this.selectedBuyer = null;
            this.selectedBeneficiary = null;
            
            // Reset UI for Step 1
            document.querySelectorAll('.cte-shop-select-btn').forEach(b => b.classList.remove('selected'));
            document.getElementById('cte-shop-other-input').value = '';
            
            const titleEl = document.getElementById('cte-shop-modal-title');
            const btnEl = document.getElementById('cte-shop-confirm-btn');
            if (titleEl) titleEl.innerText = "谁来购买 / WHO BUYS";
            if (btnEl) {
                btnEl.innerText = "下一步 / NEXT";
                btnEl.classList.remove('ready');
            }

            document.getElementById('cte-shop-modal').classList.add('active');
        },

        closeModal: function() {
            document.getElementById('cte-shop-modal').classList.remove('active');
            this.pendingItem = null;
            this.selectedBuyer = null;
            this.selectedBeneficiary = null;
            this.currentStep = 1;
        },

        selectMember: function(el, name) {
            document.querySelectorAll('.cte-shop-select-btn').forEach(btn => btn.classList.remove('selected'));
            document.getElementById('cte-shop-other-input').value = '';
            el.classList.add('selected');
            
            if (this.currentStep === 1) {
                this.selectedBuyer = name;
            } else {
                this.selectedBeneficiary = name;
            }
            this.checkConfirmState();
        },

        selectOther: function(input) {
            document.querySelectorAll('.cte-shop-select-btn').forEach(btn => btn.classList.remove('selected'));
            const val = input.value.trim().length > 0 ? input.value : null;
            
            if (this.currentStep === 1) {
                this.selectedBuyer = val;
            } else {
                this.selectedBeneficiary = val;
            }
            this.checkConfirmState();
        },

        checkConfirmState: function() {
            const btn = document.getElementById('cte-shop-confirm-btn');
            // Check if current step has selection
            const hasSelection = this.currentStep === 1 ? !!this.selectedBuyer : !!this.selectedBeneficiary;
            
            if (hasSelection) btn.classList.add('ready');
            else btn.classList.remove('ready');
        },

        handleModalButton: function() {
            if (this.currentStep === 1) {
                if (!this.selectedBuyer) return;
                
                // Transition to Step 2
                this.currentStep = 2;
                
                // Reset Selection UI for Step 2
                document.querySelectorAll('.cte-shop-select-btn').forEach(b => b.classList.remove('selected'));
                document.getElementById('cte-shop-other-input').value = '';
                
                // Update Text
                const titleEl = document.getElementById('cte-shop-modal-title');
                const btnEl = document.getElementById('cte-shop-confirm-btn');
                if (titleEl) titleEl.innerText = "分配对象 / ASSIGN TO";
                if (btnEl) {
                    btnEl.innerText = "确认下单 / CONFIRM";
                    btnEl.classList.remove('ready');
                }
            } else {
                this.finalizePurchase();
            }
        },

        finalizePurchase: function() {
            if (!this.pendingItem || !this.selectedBuyer || !this.selectedBeneficiary) return;

            // 1. Mark as sold visually
            const el = document.getElementById(this.pendingItem.id);
            if(el) el.classList.add('sold');

            // 2. Send Command with strict Chinese format and rawLine
            const message = `${this.selectedBuyer} 使用CTE运营资金为 ${this.selectedBeneficiary} 购买了 ${this.pendingItem.rawLine}`;
            
            if (stContext) {
                stContext.executeSlashCommandsWithOptions(`/setinput ${message}`);
            }

            this.closeModal();
            // Optional: Switch back to dashboard or update visual state handled by AI response
        }
    };

    // ==========================================
    // [NEW] 4.0 每日快报模块 (News Manager)
    // ==========================================
    window.CTEIdolManager.News = {
        getNewsContent: function() {
            let context = stContext;
            if (!context && window.SillyTavern) context = window.SillyTavern.getContext();
            if (!context || !context.chat) return null;

            for (let i = context.chat.length - 1; i >= 0; i--) {
                const msg = context.chat[i].mes || "";
                const match = msg.match(/<news>([\s\S]*?)<\/news>/i);
                if (match) return match[1].trim();
            }
            return null;
        },

        parseNews: function(text) {
            const items = [];
            const lines = text.split('\n');
            lines.forEach(line => {
                line = line.trim();
                // Match [Type|Rank|Title|Source|Summary|Impact]
                if (line.startsWith('[') && line.endsWith(']')) {
                    const content = line.substring(1, line.length - 1);
                    // Split by full-width or half-width pipe
                    const parts = content.split(/\||｜/).map(s => s.trim());
                    if (parts.length >= 6) {
                        items.push({
                            type: parts[0],
                            rank: parts[1],
                            title: parts[2],
                            source: parts[3],
                            summary: parts[4],
                            impact: parts[5]
                        });
                    }
                }
            });
            return items;
        },

        renderView: function(container) {
            const raw = this.getNewsContent();
            let items = [];
            if (raw) items = this.parseNews(raw);

            // Logic to separate Headline, Trending, and Others
            let headline = items.find(i => i.type.includes('头条') || i.type.toLowerCase().includes('headline'));
            if (!headline && items.length > 0) headline = items[0];

            const trending = items.filter(i => (i.type.includes('热搜') || i.type.toLowerCase().includes('trending')) && i !== headline);
            const others = items.filter(i => i !== headline && !trending.includes(i));

            // Generate Headline HTML
            const headlineHtml = headline ? `
                <div class="headline-card">
                    <span class="hl-tag">${headline.type} / ${headline.rank}</span>
                    <div class="hl-title">${headline.title}</div>
                    <div class="hl-meta">
                        <span><i class="fa-solid fa-bullhorn"></i> ${headline.source}</span>
                        <span><i class="fa-regular fa-clock"></i> TODAY</span>
                    </div>
                    <div class="hl-summary">${headline.summary}</div>
                    <div class="impact-box">
                        <i class="fa-solid fa-circle-exclamation impact-icon"></i>
                        <span class="impact-text">IMPACT: ${headline.impact}</span>
                    </div>
                </div>` : '<div style="padding:20px; text-align:center; color:#888;">暂无头条新闻 / NO HEADLINES</div>';

            // Generate Trending HTML
            let trendingHtml = '';
            trending.forEach((item, idx) => {
                const rankClass = idx === 0 ? 'rank-1' : (idx === 1 ? 'rank-2' : 'rank-3');
                let tagClass = 'tag-new';
                if (item.rank.includes('爆') || item.rank.includes('HOT')) tagClass = 'tag-hot';
                
                trendingHtml += `
                    <div class="trending-item">
                        <div class="rank-num ${rankClass}">${idx + 1}</div>
                        <div class="trend-content">
                            <span class="trend-title">${item.title}</span>
                            <div class="trend-meta">
                                <span class="trend-tag ${tagClass}">${item.rank}</span>
                                <span>${item.source}</span>
                            </div>
                        </div>
                    </div>`;
            });

            // Generate Other Brief Cards
            let othersHtml = '';
            others.forEach(item => {
                let cardClass = '';
                if (item.type.includes('竞品') || item.type.includes('Rivalry')) cardClass = 'rivalry';
                
                othersHtml += `
                    <div class="brief-card ${cardClass}">
                        <div class="brief-header">
                            <span class="brief-type">${item.type}</span>
                            <span class="brief-source">${item.source}</span>
                        </div>
                        <div class="brief-title">${item.title}</div>
                        <div class="brief-text">${item.summary}</div>
                         ${item.impact ? `<div class="impact-box"><i class="fa-solid fa-chess-pawn impact-icon"></i><span class="impact-text">${item.impact}</span></div>` : ''}
                    </div>`;
            });

            const today = new Date();
            const dateStr = `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日`;

            const html = `
                <div class="cte-news-scope">
                    <div class="archive-card" id="cte-news-main-card">
                        <header class="header-section">
                            <div class="header-title">
                                <h1 title="点击刷新" onclick="window.CTEIdolManager.renderRPGContent('news')">CTE Entertainment Daily</h1>
                            </div>
                            <div class="header-meta">
                                <div>每日快报</div>
                                <div>DATE: ${dateStr}</div>
                                <div>SECURITY: INTERNAL</div>
                            </div>
                        </header>

                        <div class="sentiment-bar">
                            <div class="sent-item">
                                <span class="sent-label">CTE 舆论风向</span>
                                <span class="sent-value trend-up">POSITIVE ▲ High</span>
                            </div>
                            <div class="sent-item">
                                <span class="sent-label">公关压力指数</span>
                                <span class="sent-value trend-down">STABLE ▼ Low</span>
                            </div>
                            <div class="sent-item">
                                <span class="sent-label">今日热词 Key Words</span>
                                <span class="sent-value">#CTE #回归 #新歌</span>
                            </div>
                        </div>

                        <div class="news-grid">
                            <div class="news-main-col">
                                ${headlineHtml}
                            </div>
                            <div class="news-sidebar">
                                <div class="trending-section">
                                    <div class="sidebar-header">
                                        <span><i class="fa-brands fa-weibo" style="color:#e74c3c;margin-right:5px;"></i> Weibo / 实时热搜</span>
                                        <span style="font-size:9px;color:#999">TOP ${trending.length}</span>
                                    </div>
                                    ${trendingHtml}
                                </div>
                                ${othersHtml}
                            </div>
                        </div>
                        
                        <div class="footer-status">
                            <span>SYSTEM: MONITORING ACTIVE</span>
                            <span>舆情安全等级: <span style="color:green;font-weight:bold;">SAFE</span></span>
                            <span>GENERATED BY CTE-AI</span>
                        </div>

                    </div>
                </div>
            `;
            container.innerHTML = html;
        }
    };


    // ==========================================
    // 2. 核心功能函数
    // ==========================================

    window.CTEIdolManager.parseStatusTop = function(text) {
        if (!text) return null;
        
        const timeMatch = text.match(/时间[:：]\s*(.*?)(?:\n|$)/);
        const locMatch = text.match(/地点[:：]\s*(.*?)(?:\n|$)/);
        const todayMatch = text.match(/今日安排[:：]\s*([\s\S]*?)(?=最近演出安排[:：]|$)/);
        const upcomingMatch = text.match(/最近演出安排[:：]\s*([\s\S]*?)(?:\n|$)/);

        return {
            dateStr: timeMatch ? timeMatch[1].trim() : '未知时间',
            locationStr: locMatch ? locMatch[1].trim() : '未知地点',
            todaySchedule: todayMatch ? todayMatch[1].trim() : '无今日安排',
            upcoming: upcomingMatch ? upcomingMatch[1].trim() : '无近期演出'
        };
    };

    window.CTEIdolManager.getStatusTopContent = function() {
        let context = stContext;
        if (!context && window.SillyTavern) context = window.SillyTavern.getContext();
        if (!context || !context.chat) return null;

        for (let i = context.chat.length - 1; i >= 0; i--) {
            const msg = context.chat[i].mes || "";
            const match = msg.match(/<status_top>([\s\S]*?)<\/status_top>/i);
            if (match) return match[1].trim();
        }
        return null;
    };

    window.CTEIdolManager.scanForRPGStats = function() {
        if (window.CTEIdolManager.RPG && window.CTEIdolManager.RPG.state) {
            const fundsEl = document.querySelector('#cte-idol-map-panel #cte-idol-rpg-val-funds');
            const fansEl = document.querySelector('#cte-idol-map-panel #cte-idol-rpg-val-fans');
            const moraleEl = document.querySelector('#cte-idol-map-panel #cte-idol-rpg-val-morale');

            if (fundsEl) fundsEl.innerText = window.CTEIdolManager.RPG.state.funds.toLocaleString();
            if (fansEl) fansEl.innerText = window.CTEIdolManager.RPG.state.fans.toLocaleString();
            if (moraleEl) moraleEl.innerText = window.CTEIdolManager.RPG.state.morale;
        }
    };

    window.CTEIdolManager.readCharacterStatsFromChat = function() {
        let context = stContext;
        if (!context && window.SillyTavern) context = window.SillyTavern.getContext();
        if (!context || !context.chat || context.chat.length === 0) return;

        let statusContent = null;
        for (let i = context.chat.length - 1; i >= 0; i--) {
            const msg = context.chat[i].mes || "";
            const match = msg.match(/<status_bottom1>([\s\S]*?)<\/status_bottom1>/i);
            if (match) {
                statusContent = match[1];
                break;
            }
        }

        if (!statusContent) return;

        for (const [name, profile] of Object.entries(window.CTEIdolManager.characterProfiles)) {
            if (name === '你') continue;
            const charBlockRegex = new RegExp(`<${name}>([\\s\\S]*?)<\\/${name}>`, 'i');
            const charMatch = statusContent.match(charBlockRegex);

            if (charMatch) {
                const blockText = charMatch[1];
                const desireMatch = blockText.match(/欲望[：:]\s*(\d+)/);
                if (desireMatch) profile.status.desire = parseInt(desireMatch[1]);
                const affMatch = blockText.match(/好感(?:度)?[：:]\s*(\d+)/);
                if (affMatch) profile.status.affection = parseInt(affMatch[1]);
            }
        }
    };

    window.CTEIdolManager.readStatsFromMVU = function() {
        let ST = window.SillyTavern;
        if (!ST && window.parent) ST = window.parent.SillyTavern;
        if (!ST) return;

        let statDataRaw = null;
        try {
            const extVars = ST.extension_settings?.variables;
            if (extVars) {
                if (extVars.global && extVars.global['stat_data']) statDataRaw = extVars.global['stat_data'];
                else if (extVars.local && extVars.local['stat_data']) statDataRaw = extVars.local['stat_data'];
            }
        } catch (e) { console.warn("[CTE Idol] Error reading ext settings:", e); }

        if (!statDataRaw && stContext && stContext.chat) {
            const chat = stContext.chat;
            for (let i = chat.length - 1; i >= 0; i--) {
                const msg = chat[i];
                const vars = msg.variables || (msg.data && msg.data.variables);
                if (vars) {
                    if (typeof vars === 'object' && !Array.isArray(vars) && vars['stat_data']) {
                        statDataRaw = vars['stat_data'];
                        break;
                    } else if (Array.isArray(vars)) {
                        const found = vars.find(v => v && v['stat_data']);
                        if (found) {
                            statDataRaw = found['stat_data'];
                            break;
                        }
                    }
                }
            }
        }

        if (statDataRaw) {
            try {
                const statData = typeof statDataRaw === 'string' ? JSON.parse(statDataRaw) : statDataRaw;
                
                if (statData.Management && statData.Management['CTE经营组']) {
                    const cteGroup = statData.Management['CTE经营组'];
                    if (cteGroup['资金'] !== undefined) {
                        const fundsStr = String(cteGroup['资金']).replace(/,/g, '');
                        window.CTEIdolManager.RPG.state.funds = parseInt(fundsStr, 10) || 0;
                    }
                    if (cteGroup['粉丝'] !== undefined) {
                        const fansStr = String(cteGroup['粉丝']).replace(/,/g, '');
                        window.CTEIdolManager.RPG.state.fans = parseInt(fansStr, 10) || 0;
                    }
                    if (cteGroup['团魂']) window.CTEIdolManager.RPG.state.morale = cteGroup['团魂'];
                    if (cteGroup['待办']) window.CTEIdolManager.RPG.state.futureLog = Array.isArray(cteGroup['待办']) ? cteGroup['待办'] : [cteGroup['待办']];
                    if (cteGroup['现有通告']) window.CTEIdolManager.RPG.state.activeTasks = Array.isArray(cteGroup['现有通告']) ? cteGroup['现有通告'] : [cteGroup['现有通告']];
                }

                if (statData && statData.MainCharacters) {
                    for (const [name, profile] of Object.entries(window.CTEIdolManager.characterProfiles)) {
                        if (name === '你') continue;
                        const charData = statData.MainCharacters[name];
                        if (charData) {
                            if (charData['歌艺'] !== undefined) profile.rpgStats.vocal = parseInt(charData['歌艺']);
                            if (charData['舞蹈'] !== undefined) profile.rpgStats.dance = parseInt(charData['舞蹈']);
                            if (charData['口才'] !== undefined) profile.rpgStats.eloquence = parseInt(charData['口才']);
                            if (charData['表演'] !== undefined) profile.rpgStats.acting = parseInt(charData['表演']);
                            if (charData['欲望'] !== undefined) profile.status.desire = parseInt(charData['欲望']);
                            if (charData['好感'] !== undefined) profile.status.affection = parseInt(charData['好感']);
                            else if (charData['好感度'] !== undefined) profile.status.affection = parseInt(charData['好感度']);
                        }
                    }
                }
                window.CTEIdolManager.scanForRPGStats();
            } catch (e) {
                console.error("[CTE Idol Map] Failed to parse stat_data:", e);
            }
        }
    };

    window.CTEIdolManager.renderRPGContent = function(viewType) {
        const container = document.querySelector('#cte-idol-map-panel #cte-idol-rpg-content-area');
        
        if (!container) {
            console.error("[CTE Idol Map] Critical: RPG content container not found.");
            return;
        }

        let htmlContent = '';

        try {
            if (viewType === 'roster') {
                htmlContent += '<div class="cte-idol-rpg-roster-grid">';
                for (const [name, profile] of Object.entries(window.CTEIdolManager.characterProfiles)) {
                    if (name === '你') continue;
                    const roleText = (profile.role && typeof profile.role === 'string') ? profile.role.split('、')[0] : '成员';
                    const stats = profile.rpgStats || { vocal: 0, dance: 0, eloquence: 0, acting: 0 };
                    let warningHtml = '';
                    if (profile.status && profile.status.desire > 80) {
                        warningHtml = `<div class="cte-idol-rpg-warning-box"><span><i class="fa-solid fa-triangle-exclamation"></i> 欲望值过高</span><button class="cte-idol-heartbeat-shortcut" onclick="window.CTEIdolManager.switchView('heartbeat')"><i class="fa-solid fa-heart"></i></button></div>`;
                    }

                    htmlContent += `
                    <div class="cte-idol-rpg-card">
                        <div style="display:flex; gap:15px;">
                            <div class="cte-idol-rpg-avatar-box"><img src="${profile.image}"><div class="cte-idol-rpg-role-tag">${roleText}</div></div>
                            <div style="flex:1;">
                                <div style="display:flex; justify-content:space-between;">
                                    <div style="color:#fff; font-weight:bold; font-size:14px;">${name}</div>
                                    <div style="font-size:10px; color:#888;">${profile.personality}</div>
                                </div>
                                <div class="cte-idol-rpg-stat-row">
                                    <div class="cte-idol-rpg-stat-bar-container">
                                        <div class="label" style="display:flex; justify-content:space-between;"><span>歌艺</span> <span>${stats.vocal}</span></div>
                                        <div class="bar-bg"><div class="bar-fill" style="width:${Math.min(100, stats.vocal)}%; background:#c5a065;"></div></div>
                                    </div>
                                    <div class="cte-idol-rpg-stat-bar-container">
                                        <div class="label" style="display:flex; justify-content:space-between;"><span>舞蹈</span> <span>${stats.dance}</span></div>
                                        <div class="bar-bg"><div class="bar-fill" style="width:${Math.min(100, stats.dance)}%; background:#c5a065;"></div></div>
                                    </div>
                                </div>
                                <div class="cte-idol-rpg-stat-row" style="margin-top: 5px;">
                                    <div class="cte-idol-rpg-stat-bar-container">
                                        <div class="label" style="display:flex; justify-content:space-between;"><span>口才</span> <span>${stats.eloquence}</span></div>
                                        <div class="bar-bg"><div class="bar-fill" style="width:${Math.min(100, stats.eloquence)}%; background:#8ec565;"></div></div>
                                    </div>
                                    <div class="cte-idol-rpg-stat-bar-container">
                                        <div class="label" style="display:flex; justify-content:space-between;"><span>表演</span> <span>${stats.acting}</span></div>
                                        <div class="bar-bg"><div class="bar-fill" style="width:${Math.min(100, stats.acting)}%; background:#8ec565;"></div></div>
                                    </div>
                                </div>
                                <div class="cte-idol-rpg-stat-row" style="margin-top: 5px;">
                                    <div class="cte-idol-rpg-stat-bar-container">
                                        <div class="label" style="display:flex; justify-content:space-between;"><span>欲望</span> <span style="color:#ec4899;">${profile.status.desire}%</span></div>
                                        <div class="bar-bg"><div class="bar-fill" style="width:${profile.status.desire}%; background:#ec4899; box-shadow:0 0 5px #ec4899;"></div></div>
                                    </div>
                                    <div class="cte-idol-rpg-stat-bar-container">
                                        <div class="label" style="display:flex; justify-content:space-between;"><span>好感</span> <span style="color:#f43f5e;">${profile.status.affection}%</span></div>
                                        <div class="bar-bg"><div class="bar-fill" style="width:${profile.status.affection}%; background:#f43f5e;"></div></div>
                                    </div>
                                </div>
                                ${warningHtml}
                            </div>
                        </div>
                    </div>`;
                }
                htmlContent += '</div>';
                container.innerHTML = htmlContent;

            } else if (viewType === 'agency') {
                window.CTEIdolManager.Contracts.renderView(container);
            } else if (viewType === 'shop') {
                window.CTEIdolManager.Shop.renderView(container);
            } else if (viewType === 'news') {
                // [NEW] Render News View
                window.CTEIdolManager.News.renderView(container);
            } else {
                // ==========================
                // Dashboard
                // ==========================
                const statusTopRaw = window.CTEIdolManager.getStatusTopContent();
                const parsedStatus = window.CTEIdolManager.parseStatusTop(statusTopRaw) || {
                    dateStr: '数据同步中...',
                    locationStr: '位置未知',
                    todaySchedule: '暂无行程信息',
                    upcoming: '待定'
                };

                let timeBadge = '';
                let dateParts = parsedStatus.dateStr.split('|');
                if (dateParts.length >= 3) timeBadge = dateParts[2].trim();

                const funds = window.CTEIdolManager.RPG.state.funds.toLocaleString();
                
                const futureLogHtml = window.CTEIdolManager.RPG.state.futureLog.length > 0 
                    ? window.CTEIdolManager.RPG.state.futureLog.map(item => `
                        <li class="cte-archive-dossier-item">
                            <div class="cte-archive-item-meta"><span><i class="fa-regular fa-clock"></i> PLAN</span><span class="cte-archive-tag cte-archive-pending">LOG</span></div>
                            <div class="cte-archive-item-content">${item}</div>
                        </li>`).join('') 
                    : `<li class="cte-archive-dossier-item"><div class="cte-archive-item-content" style="color:#999">暂无待办事项</div></li>`;

                const activeTasksHtml = window.CTEIdolManager.RPG.state.activeTasks.length > 0
                    ? window.CTEIdolManager.RPG.state.activeTasks.map(item => `
                        <li class="cte-archive-dossier-item">
                            <div class="cte-archive-item-meta"><span></span><span class="cte-archive-tag cte-archive-progress">进行中</span></div>
                            <div class="cte-archive-item-content">${item}</div>
                        </li>`).join('')
                    : `<li class="cte-archive-dossier-item"><div class="cte-archive-item-content" style="color:#999">暂无进行中任务</div></li>`;

                // [UPDATED] Right side: Active Contracts Memo
                const rightColHtml = window.CTEIdolManager.Contracts.renderMemoCard();

                htmlContent = `
                    <div class="cte-dashboard-layout">
                        <div class="cte-archive-card">
                            <div class="cte-archive-card-content">
                                <header>
                                    <div class="cte-archive-header-date">
                                        <h1>今日概览</h1>
                                        ${timeBadge ? `<div class="cte-archive-time-badge">${timeBadge}</div>` : ''}
                                    </div>
                                    <div class="cte-archive-meta-block">
                                        <div class="cte-archive-meta-row cte-archive-meta-primary">
                                            ${parsedStatus.dateStr}
                                        </div>
                                        <div class="cte-archive-meta-row cte-archive-meta-secondary">
                                            <i class="fa-solid fa-location-dot" style="font-size: 10px; margin-right: 4px;"></i> 
                                            ${parsedStatus.locationStr}
                                        </div>
                                    </div>
                                </header>

                                <div class="cte-archive-briefing-box">
                                    <div class="cte-archive-briefing-row">
                                        <span class="cte-archive-b-label">Today</span>
                                        <span class="cte-archive-b-content" style="white-space: pre-line;">${parsedStatus.todaySchedule}</span>
                                    </div>
                                    <div class="cte-archive-briefing-row">
                                        <span class="cte-archive-b-label">Upcoming</span>
                                        <span class="cte-archive-b-content">
                                            ${parsedStatus.upcoming}
                                            <span class="cte-archive-status-tag-sm">准备中</span>
                                        </span>
                                    </div>
                                </div>

                                <div class="cte-archive-section-divider">
                                    <span class="cte-archive-section-label"><i class="fa-solid fa-coins"></i> Total Assets</span>
                                </div>
                                <section class="cte-archive-balance-section">
                                    <div class="cte-archive-balance-value">
                                        ${funds} <span class="cte-archive-balance-currency">CNY</span>
                                    </div>
                                </section>

                                <div class="cte-archive-section-divider">
                                    <span class="cte-archive-section-label"><i class="fa-regular fa-calendar"></i> Future Log</span>
                                </div>
                                <ul class="cte-archive-dossier-list">
                                    ${futureLogHtml}
                                </ul>

                                <div class="cte-archive-section-divider">
                                    <span class="cte-archive-section-label"><i class="fa-solid fa-list-check"></i> Active Tasks</span>
                                </div>
                                <ul class="cte-archive-dossier-list">
                                    ${activeTasksHtml}
                                </ul>

                                <div class="cte-archive-footer-stamp">
                                    <div class="cte-archive-barcode"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Right: Active Contracts Memo -->
                        ${rightColHtml}
                    </div>
                    
                    <!-- Inject Modal for Memo -->
                    ${window.CTEIdolManager.Contracts.getModalHTML()}
                `;
                container.innerHTML = htmlContent;

                // Populate the list after insertion
                setTimeout(() => {
                    const listContainer = document.getElementById('cte-memo-list-container');
                    if (listContainer) {
                        window.CTEIdolManager.Contracts.renderMemoList(listContainer);
                    }
                }, 50);
            }

        } catch (e) {
            console.error("[CTE Idol Map] Error rendering RPG content:", e);
            container.innerHTML = `<div style="color:red; padding:20px;">渲染错误: ${e.message}</div>`;
        }
    };

    window.CTEIdolManager.switchView = function(viewName, btn) {
        console.log("[CTE Idol Map] Switching to view:", viewName);
        const panel = document.getElementById('cte-idol-map-panel');
        if(panel) {
            const btns = panel.querySelectorAll('.cte-idol-nav-btn');
            btns.forEach(b => b.classList.remove('active'));
            if (btn) btn.classList.add('active');
            else if (viewName === 'map' && btns[0]) btns[0].classList.add('active');
            
            const views = panel.querySelectorAll('.cte-idol-view');
            views.forEach(v => v.classList.remove('active'));
            const targetView = panel.querySelector(`#cte-idol-view-${viewName}`);
            if (targetView) targetView.classList.add('active');
        }

        try {
            if (viewName === 'schedule') {
                window.CTEIdolManager.refreshSchedule();
            }
            if (viewName === 'manager') {
                window.CTEIdolManager.scanForRPGStats();
                window.CTEIdolManager.readStatsFromMVU();
                window.CTEIdolManager.readCharacterStatsFromChat();
                window.CTEIdolManager.renderRPGContent('dashboard'); 
            }
            if (viewName === 'heartbeat') {
                // [FIXED] Call the new consolidated method
                if (window.CTEIdolManager.Heartbeat) {
                    window.CTEIdolManager.Heartbeat.renderGrid();
                }
            }
            if (viewName === 'news') {
                window.CTEIdolManager.renderRPGContent('news');
            }
        } catch (e) {
            console.error("[CTE Idol Map] Error switching view:", e);
        }
    };

    // ==========================================
    // 3. 初始化加载逻辑
    // ==========================================

    const initInterval = setInterval(() => {
        if (window.SillyTavern && window.SillyTavern.getContext && window.jQuery) {
            clearInterval(initInterval);
            stContext = window.SillyTavern.getContext();
            initializeExtension();
        }
    }, 500);

    function bindRPGEvents() {
        $(document).off('click', '.cte-idol-rpg-nav-btn').on('click', '.cte-idol-rpg-nav-btn', function() {
            $('.cte-idol-rpg-nav-btn').removeClass('active');
            $(this).addClass('active');
            const subView = $(this).data('subview');
            window.CTEIdolManager.renderRPGContent(subView);
        });
    }

    function fixPanelPosition() {
        const panel = document.getElementById('cte-idol-map-panel');
        if (!panel) return;
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const panelRect = panel.getBoundingClientRect();
        const panelHeight = panelRect.height || panel.offsetHeight;
        const panelWidth = panelRect.width || panel.offsetWidth;
        const isMobile = viewportWidth < 768;

        if (isMobile) {
            panel.style.position = 'fixed';
            panel.style.transform = 'none';
            panel.style.top = Math.max(10, (viewportHeight - panelHeight) / 2) + 'px';
            panel.style.left = Math.max(5, (viewportWidth - panelWidth) / 2) + 'px';
            if (parseFloat(panel.style.top) < 10) panel.style.top = '10px';
            panel.style.maxHeight = (viewportHeight - 20) + 'px';
        } else {
            panel.style.position = 'fixed';
            panel.style.top = '50%';
            panel.style.left = '50%';
            panel.style.transform = 'translate(-50%, -50%)';
            panel.style.maxHeight = '85vh';
        }
    }

    function setupResizeListener() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const panel = document.getElementById('cte-idol-map-panel');
                if (panel && panel.style.display !== 'none') {
                    fixPanelPosition();
                }
            }, 100);
        });
        window.addEventListener('orientationchange', () => setTimeout(fixPanelPosition, 300));
    }

    async function initializeExtension() {
        console.log("[CTE Idol Map] Initializing Extension...");

        document.querySelectorAll('#cte-idol-map-panel, #cte-idol-toggle-btn').forEach(el => el.remove());
        document.querySelectorAll('link[href*="CTE_Map/style.css"]').forEach(el => el.remove());

        const timestamp = Date.now();
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `${extensionPath}/style.css?v=${timestamp}`;
        document.head.appendChild(link);

        const panelHTML = `
            <div id="cte-idol-toggle-btn" title="点击打开 / 长按拖动" 
                 style="position:fixed; top:130px; left:10px; z-index:9000; width:40px; height:40px; background:#b38b59; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:move; box-shadow:0 4px 10px rgba(0,0,0,0.3); color:#fff; font-size:20px;">
                🗺️
            </div>
            <div id="cte-idol-map-panel" style="display:none;">
                <div id="cte-idol-drag-handle">
                    <span>CTE 偶像管理系统</span>
                    <div class="cte-idol-nav-group">
                        <button class="cte-idol-nav-btn active" onclick="window.CTEIdolManager.switchView('map', this)">地图</button>
                        <button class="cte-idol-nav-btn" onclick="window.CTEIdolManager.switchView('schedule', this)">行程</button>
                        <button class="cte-idol-nav-btn" onclick="window.CTEIdolManager.switchView('manager', this)">事务所</button>
                        <button class="cte-idol-nav-btn" style="color: #FF69B4;" onclick="window.CTEIdolManager.switchView('heartbeat', this)">♥</button>
                        <span id="cte-idol-close-btn" style="cursor:pointer; margin-left:10px;">❌</span>
                    </div>
                </div>
                <div id="cte-idol-content-area" style="position:relative; height:calc(100% - 40px);">Loading Map...</div>
            </div>
        `;
        $('body').append(panelHTML);

        try {
            const response = await fetch(`${extensionPath}/map.html?v=${timestamp}`);
            if (!response.ok) throw new Error("Map file not found");
            const htmlContent = await response.text();
            
            const contentArea = document.getElementById('cte-idol-content-area');
            if(contentArea) contentArea.innerHTML = htmlContent;
            
            bindMapEvents();
            loadSavedPositions();
            loadSavedBg();
            window.CTEIdolManager.initNationalMap();
            window.CTEIdolManager.loadSavedNationalBg();
            window.CTEIdolManager.Contracts.init(); 
            bindRPGEvents();

        } catch (e) {
            console.error("[CTE Idol Map] Initialization Error:", e);
            const contentArea = document.getElementById('cte-idol-content-area');
            if(contentArea) contentArea.innerHTML = `<p style="padding:20px; color:white;">无法加载地图文件 (map.html)。<br>错误信息: ${e.message}</p>`;
        }

        let isIconDragging = false;
        $('#cte-idol-toggle-btn').off('click').on('click', (e) => {
            if (isIconDragging) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }

            const panel = $('#cte-idol-map-panel');
            if (panel.is(':visible')) {
                panel.fadeOut();
            } else {
                window.CTEIdolManager.scanForRPGStats();
                panel.fadeIn(200, function() {
                    fixPanelPosition();
                    if ($('#cte-idol-view-schedule').hasClass('active')) window.CTEIdolManager.refreshSchedule();
                    if ($('#cte-idol-view-manager').hasClass('active')) {
                        window.CTEIdolManager.readStatsFromMVU();
                        window.CTEIdolManager.readCharacterStatsFromChat();
                        window.CTEIdolManager.renderRPGContent('dashboard');
                    }
                    if ($('#cte-idol-view-heartbeat').hasClass('active') && window.CTEIdolManager.Heartbeat) {
                        window.CTEIdolManager.Heartbeat.renderGrid();
                    }
                });
            }
        });
        
        $('#cte-idol-close-btn').off('click').on('click', () => $('#cte-idol-map-panel').fadeOut());

        if ($.fn.draggable) {
            $('#cte-idol-map-panel').draggable({ 
                handle: '#cte-idol-drag-handle',
                containment: 'window'
            });

            $('#cte-idol-toggle-btn').draggable({
                containment: 'window', 
                start: function() { isIconDragging = true; },
                stop: function() { setTimeout(() => { isIconDragging = false; }, 50); }
            });
        }

        setupResizeListener();
    }

    // ==========================================
    // 4. 其他辅助功能
    // ==========================================

    function loadSavedNationalPositions() {
        const data = localStorage.getItem('cte_idol_national_map_positions');
        return data ? JSON.parse(data) : {};
    }

    function saveNationalPosition(id, left, top) {
        let data = loadSavedNationalPositions();
        data[id] = { left, top };
        localStorage.setItem('cte_idol_national_map_positions', JSON.stringify(data));
    }

    window.CTEIdolManager.initNationalMap = function() {
        const mapContainer = document.querySelector('#cte-idol-map-panel #cte-idol-national-game-map');
        const infoContent = document.querySelector('#cte-idol-map-panel #cte-idol-national-info-content');
        
        if (!mapContainer || !infoContent) return;

        mapContainer.innerHTML = '';
        const savedPositions = loadSavedNationalPositions();

        window.CTEIdolManager.nationalCities.forEach(city => {
            const cityEl = document.createElement('div');
            cityEl.className = 'cte-idol-national-city';
            const elementId = `cte-idol-national-city-${city.id}`;
            cityEl.id = elementId;
            
            if (savedPositions[elementId]) {
                cityEl.style.top = savedPositions[elementId].top;
                cityEl.style.left = savedPositions[elementId].left;
            } else {
                cityEl.style.top = city.top;
                cityEl.style.left = city.left;
            }

            cityEl.innerHTML = `<i class="fa-solid ${city.icon}"></i><span class="name">${city.name}</span>`;

            let isDragging = false;
            let startX, startY, initialLeft, initialTop;
            let hasMoved = false;

            cityEl.onmousedown = function(e) {
                e.preventDefault();
                e.stopPropagation();
                isDragging = true;
                hasMoved = false;
                startX = e.clientX;
                startY = e.clientY;
                initialLeft = cityEl.offsetLeft;
                initialTop = cityEl.offsetTop;

                document.onmousemove = function(e) {
                    if (!isDragging) return;
                    const dx = e.clientX - startX;
                    const dy = e.clientY - startY;
                    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved = true;
                    let newLeft = Math.max(0, Math.min(initialLeft + dx, mapContainer.offsetWidth));
                    let newTop = Math.max(0, Math.min(initialTop + dy, mapContainer.offsetHeight));
                    cityEl.style.left = newLeft + 'px';
                    cityEl.style.top = newTop + 'px';
                };

                document.onmouseup = function() {
                    isDragging = false;
                    document.onmousemove = null;
                    document.onmouseup = null;
                    if (!hasMoved) {
                        if (city.isReturn) {
                             window.CTEIdolManager.switchView('map');
                        } else {
                            let html = `<h2><i class="fa-solid fa-scroll"></i> ${city.name} - 情报简报</h2><ul><li>${city.info}</li></ul>`;
                            html += `<div style="text-align:center; margin-top:15px; border-top:1px dashed #666; padding-top:10px;"><button class="cte-idol-btn" onclick="window.CTEIdolManager.openTravelMenu('${city.name}')" style="width:80%; padding:8px; background:#b38b59; color:#1a1a1a; font-weight:bold; font-size:14px;">🚀 前往 ${city.name}</button></div>`;
                            infoContent.innerHTML = html;
                        }
                    } else {
                        saveNationalPosition(elementId, cityEl.style.left, cityEl.style.top);
                    }
                };
            };
            mapContainer.appendChild(cityEl);
        });
    };

    window.CTEIdolManager.changeNationalBackground = function(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const bgUrl = e.target.result;
                $('#cte-idol-national-game-map').css('background-image', `url(${bgUrl})`);
                localStorage.setItem('cte_idol_national_map_bg', bgUrl);
            }
            reader.readAsDataURL(input.files[0]);
        }
    };

    window.CTEIdolManager.resetNationalBackground = function() {
        $('#cte-idol-national-game-map').css('background-image', `url(${DEFAULT_NATIONAL_BG})`);
        localStorage.setItem('cte_idol_national_map_bg', DEFAULT_NATIONAL_BG);
    };

    window.CTEIdolManager.loadSavedNationalBg = function() {
        const saved = localStorage.getItem('cte_idol_national_map_bg');
        const bg = saved || DEFAULT_NATIONAL_BG;
        $('#cte-idol-national-game-map').css('background-image', `url(${bg})`);
    };

    window.CTEIdolManager.refreshSchedule = async function() {
        const statusEl = $('#cte-idol-schedule-status');
        const container = $('#cte-idol-timeline-container');
        statusEl.text('正在读取最新状态...');
        
        const foundContent = window.CTEIdolManager.getStatusTopContent();

        if (!foundContent) {
            statusEl.text('未找到最新行程信息');
            container.html('<p style="text-align:center; color:#666; margin-top:50px;">在聊天记录中未找到 &lt;status_top&gt; 标签。</p>');
            return;
        }

        const targetKeyword = "今日安排";
        const keywordIndex = foundContent.indexOf(targetKeyword);
        if (keywordIndex === -1) {
             statusEl.text(`未找到“${targetKeyword}”`);
             container.html(`<p style="text-align:center; color:#666; margin-top:50px;">在 &lt;status_top&gt; 信息中未找到“${targetKeyword}”关键词。</p>`);
             return;
        }

        let scheduleContent = foundContent.substring(keywordIndex + targetKeyword.length);
        scheduleContent = scheduleContent.replace(/^[:：\s]+/, '').trim();
        statusEl.text('行程安排 (已同步)');
        const items = window.CTEIdolManager.parseSchedule(scheduleContent);
        window.CTEIdolManager.renderSchedule(items);
    };

    window.CTEIdolManager.parseSchedule = function(text) {
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const items = [];
        lines.forEach(line => {
            let time = '';
            let content = line;
            const timeMatch = line.match(/^\[?(\d{1,2}:\d{2})\]?\s*[-:：]?\s*(.*)/);
            if (timeMatch) {
                time = timeMatch[1];
                content = timeMatch[2];
            } else {
                time = '待定';
            }
            items.push({ time, content, raw: line });
        });
        return items;
    };

    window.CTEIdolManager.renderSchedule = function(items) {
        const container = $('#cte-idol-timeline-container');
        container.empty();
        if (items.length === 0) {
            container.html('<p style="text-align:center; color:#666;">行程单为空。</p>');
            return;
        }
        items.forEach(item => {
            let displayContent = item.content;
            let tagsHtml = '';
            const tagMatch = displayContent.match(/[\(\[\（](.*?)[\)\]\）]/);
            if (tagMatch) tagsHtml = `<span class="cte-idol-tag">${tagMatch[1]}</span>`;

            const html = `
                <div class="cte-idol-timeline-item">
                    <div class="cte-idol-timeline-time">${item.time}</div>
                    <div class="cte-idol-timeline-content">
                        <div class="cte-idol-schedule-title"><span>${displayContent}</span>${tagsHtml}</div>
                        <button class="cte-idol-exec-btn" onclick="window.CTEIdolManager.openParticipantSelection('${item.raw.replace(/'/g, "\\'").replace(/"/g, "&quot;")}')">⚡ 执行行程</button>
                    </div>
                </div>`;
            container.append(html);
        });
    };

    window.CTEIdolManager.openParticipantSelection = function(itemText) {
        window.CTEIdolManager.isSelectingForSchedule = false; 
        window.CTEIdolManager.currentScheduleItem = itemText;
        
        const listContainer = document.querySelector('#cte-idol-map-panel #cte-idol-participant-list');
        if (!listContainer) {
            console.error("[CTE Idol Map] Participant list container not found.");
            return;
        }
        
        listContainer.innerHTML = '';
        
        window.CTEIdolManager.availableParticipants.forEach((name, index) => {
            const id = `cte-idol-participant-${index}`;
            const checked = name === '{{user}}' ? 'checked' : '';
            const displayLabel = name === '{{user}}' ? '你 (User)' : name;
            
            const div = document.createElement('div');
            div.className = 'cte-idol-participant-item';
            div.innerHTML = `<input type="checkbox" id="${id}" value="${name}" class="cte-idol-checkbox" ${checked}><label for="${id}">${displayLabel}</label>`;
            
            div.onclick = function(e) {
                if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'LABEL') {
                    const cb = this.querySelector('input');
                    if(cb) cb.checked = !cb.checked;
                }
            };
            
            listContainer.appendChild(div);
        });
        
        const customInput = document.querySelector('#cte-idol-map-panel #cte-idol-participant-custom');
        if (customInput) customInput.value = '';
        
        const overlay = document.querySelector('#cte-idol-map-panel #cte-idol-overlay');
        const popup = document.querySelector('#cte-idol-map-panel #cte-idol-participant-popup');
        
        if(overlay) overlay.style.display = 'block';
        if(popup) popup.style.display = 'block';
    };

    window.CTEIdolManager.proceedToLocationSelection = function() {
        const selected = [];
        const checkboxes = document.querySelectorAll('#cte-idol-map-panel #cte-idol-participant-list .cte-idol-checkbox:checked');
        checkboxes.forEach(cb => selected.push(cb.value));
        
        const customInput = document.querySelector('#cte-idol-map-panel #cte-idol-participant-custom');
        const custom = customInput ? customInput.value.trim() : '';
        if (custom) selected.push(custom);
        
        if (selected.length === 0) { alert("请至少选择一位参与者！"); return; }

        window.CTEIdolManager.closeAllPopups();
        window.CTEIdolManager.tempScheduleParticipants = selected;
        window.CTEIdolManager.isSelectingForSchedule = true; 
        window.CTEIdolManager.switchView('map');
    };

    window.CTEIdolManager.openTravelMenu = function(destination) {
        window.CTEIdolManager.currentDestination = destination;
        window.CTEIdolManager.tempNPCState = { enabled: false, content: '' };
        const defaultNPC = window.CTEIdolManager.npcDefaults[destination] || '';
        const box = $('#cte-idol-travel-menu-overlay');

        if (window.CTEIdolManager.isSelectingForSchedule) {
            box.find('.cte-idol-travel-options').html(`
                <div style="text-align:center; color:#e0c5a1; margin-bottom:15px; font-size:14px; border-bottom:1px solid #444; padding-bottom:10px;">
                    正在执行行程：<br><span style="color:#b38b59; font-weight:bold;">${window.CTEIdolManager.currentScheduleItem}</span>
                </div>
                <div style="margin-bottom: 15px; border-bottom: 1px solid #444; padding-bottom: 10px;">
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
                        <span style="color:#aaa; font-size:13px;">是否遇见NPC？</span>
                        <div>
                            <button id="cte-idol-btn-npc-yes" class="cte-idol-btn" style="font-size:12px; padding:2px 8px; margin-right:5px; border-color:#666;" onclick="window.CTEIdolManager.toggleNPC(true, '${defaultNPC}')">是</button>
                            <button id="cte-idol-btn-npc-no" class="cte-idol-btn" style="font-size:12px; padding:2px 8px; background:#b38b59; color:#1a1a1a;" onclick="window.CTEIdolManager.toggleNPC(false)">否</button>
                        </div>
                    </div>
                    <input type="text" id="cte-idol-npc-input" class="cte-idol-travel-input" style="display:none; font-size:13px; margin-bottom:0;" placeholder="请输入遇见的人 (例如: 粉丝)" value="${defaultNPC}">
                </div>
                <button class="cte-idol-btn" onclick="window.CTEIdolManager.finalizeScheduleExecution()" style="background:#b38b59; color:#1a1a1a; font-weight:bold;">✅ 确认执行</button>
                <button class="cte-idol-btn" style="margin-top: 10px; border-color: #666; color: #888;" onclick="window.CTEIdolManager.closeTravelMenu()">取消</button>
            `);
        } else {
            box.find('.cte-idol-travel-options').html(`
                <div style="margin-bottom: 15px; border-bottom: 1px solid #444; padding-bottom: 10px;">
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
                        <span style="color:#aaa; font-size:13px;">是否遇见NPC？</span>
                        <div>
                            <button id="cte-idol-btn-npc-yes" class="cte-idol-btn" style="font-size:12px; padding:2px 8px; margin-right:5px; border-color:#666;" onclick="window.CTEIdolManager.toggleNPC(true, '${defaultNPC}')">是</button>
                            <button id="cte-idol-btn-npc-no" class="cte-idol-btn" style="font-size:12px; padding:2px 8px; background:#b38b59; color:#1a1a1a;" onclick="window.CTEIdolManager.toggleNPC(false)">否</button>
                        </div>
                    </div>
                    <input type="text" id="cte-idol-npc-input" class="cte-idol-travel-input" style="display:none; font-size:13px; margin-bottom:0;" placeholder="请输入遇见的人 (例如: 粉丝)" value="${defaultNPC}">
                </div>
                <button class="cte-idol-btn" onclick="window.CTEIdolManager.confirmTravel(true)">👤 独自前往</button>
                <button class="cte-idol-btn" onclick="window.CTEIdolManager.prepareCompanionInput()">👥 和……一起前往</button>
                <button class="cte-idol-btn" style="margin-top: 10px; border-color: #666; color: #888;" onclick="window.CTEIdolManager.closeTravelMenu()">关闭</button>
            `);
        }
        box.css('display', 'flex');
        $('#cte-idol-travel-title').text(`前往 ${destination}`);
    };

    window.CTEIdolManager.finalizeScheduleExecution = function() {
        const participants = window.CTEIdolManager.tempScheduleParticipants.join(', ');
        const destination = window.CTEIdolManager.currentDestination;
        const scheduleItem = window.CTEIdolManager.currentScheduleItem;
        let npcText = '';
        const npcInput = document.getElementById('cte-idol-npc-input');
        if (npcInput && npcInput.style.display !== 'none') {
             const val = npcInput.value.trim();
             if (val) npcText = `，遇见了${val}`;
        }
        const text = `${participants} 前往${destination}执行行程：${scheduleItem}${npcText}。`;
        if (stContext) {
            stContext.executeSlashCommandsWithOptions(`/setinput ${text}`);
            window.CTEIdolManager.closeAllPopups();
            window.CTEIdolManager.isSelectingForSchedule = false;
            window.CTEIdolManager.tempScheduleParticipants = [];
        } else {
            alert("无法连接到 SillyTavern。");
        }
    };

    window.CTEIdolManager.toggleNPC = function(enable, defaultText) {
        const input = document.getElementById('cte-idol-npc-input');
        const btnYes = document.getElementById('cte-idol-btn-npc-yes');
        const btnNo = document.getElementById('cte-idol-btn-npc-no');
        window.CTEIdolManager.tempNPCState.enabled = enable;
        if (enable) {
            input.style.display = 'block';
            if (defaultText && !input.value) input.value = defaultText;
            btnYes.style.background = '#b38b59'; btnYes.style.color = '#1a1a1a'; btnYes.style.borderColor = '#b38b59';
            btnNo.style.background = 'transparent'; btnNo.style.color = '#e0c5a1'; btnNo.style.borderColor = '#666';
        } else {
            input.style.display = 'none';
            btnNo.style.background = '#b38b59'; btnNo.style.color = '#1a1a1a'; btnNo.style.borderColor = '#b38b59';
            btnYes.style.background = 'transparent'; btnYes.style.color = '#e0c5a1'; btnYes.style.borderColor = '#666';
        }
    };

    window.CTEIdolManager.prepareCompanionInput = function() {
        const npcInput = document.getElementById('cte-idol-npc-input');
        if (npcInput && window.CTEIdolManager.tempNPCState.enabled) window.CTEIdolManager.tempNPCState.content = npcInput.value.trim();
        window.CTEIdolManager.showCompanionInput();
    }

    window.CTEIdolManager.showCompanionInput = function() {
        $('#cte-idol-travel-menu-overlay .cte-idol-travel-options').html(`
            <p style="color: #888; margin: 0 0 10px 0;">和谁一起去？</p>
            <input type="text" id="cte-idol-companion-name" class="cte-idol-travel-input" placeholder="输入角色姓名">
            <button class="cte-idol-btn" onclick="window.CTEIdolManager.validateAndShowActivities()">🤝 一起前往</button>
            <button class="cte-idol-btn" style="margin-top: 10px; border-color: #666; color: #888;" onclick="window.CTEIdolManager.openTravelMenu('${window.CTEIdolManager.currentDestination}')">返回</button>
        `);
    };

    window.CTEIdolManager.validateAndShowActivities = function() {
        const name = $('#cte-idol-companion-name').val();
        if (!name) return alert("请输入姓名");
        window.CTEIdolManager.currentCompanion = name;
        window.CTEIdolManager.showActivityMenu();
    };

    window.CTEIdolManager.showActivityMenu = function() {
        const activities = ['训练', '开会', '购物', '闲逛', '吃饭', '喝酒', '约会', '做爱', '运动', '直播', '拍摄节目', '接受媒体采访'];
        let buttonsHtml = activities.map(act => `<button class="cte-idol-btn" style="margin: 3px; min-width: 60px; font-size: 13px;" onclick="window.CTEIdolManager.finalizeTravel('${act}')">${act}</button>`).join('');

        $('#cte-idol-travel-menu-overlay .cte-idol-travel-options').html(`
            <p style="color: #e0c5a1; margin: 0 0 10px 0;">去做什么？</p>
            <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:4px; margin-bottom:15px; max-height: 200px; overflow-y: auto;">${buttonsHtml}</div>
            <div style="border-top: 1px solid #444; padding-top: 10px; width: 100%;">
                <input type="text" id="cte-idol-custom-activity" class="cte-idol-travel-input" placeholder="自定义活动..." style="margin-bottom: 8px;">
                <button class="cte-idol-btn" onclick="window.CTEIdolManager.finalizeTravel(null)">🚀 确认出发</button>
            </div>
            <button class="cte-idol-btn" style="margin-top: 10px; border-color: #666; color: #888; font-size: 12px; padding: 4px 10px;" onclick="window.CTEIdolManager.showCompanionInput()">返回上一步</button>
        `);
    };

    window.CTEIdolManager.closeTravelMenu = function(shouldReset = true) {
        $('#cte-idol-travel-menu-overlay').hide();
        if (shouldReset && window.CTEIdolManager.isSelectingForSchedule) {
            window.CTEIdolManager.isSelectingForSchedule = false;
            window.CTEIdolManager.tempScheduleParticipants = [];
        }
    };

    window.CTEIdolManager.goToCustomDestination = function() {
        const val = $('#cte-idol-custom-destination-input').val();
        if (val) {
            window.CTEIdolManager.closeAllPopups();
            window.CTEIdolManager.openTravelMenu(val);
        } else {
            alert('请输入地点名称');
        }
    };

    window.CTEIdolManager.confirmTravel = function(isAlone) {
        const dest = window.CTEIdolManager.currentDestination;
        let npcText = '';
        const npcInput = document.getElementById('cte-idol-npc-input');
        if (npcInput && window.CTEIdolManager.tempNPCState.enabled) {
             const val = npcInput.value.trim();
             if (val) npcText = `，遇见了${val}`;
        }
        if (isAlone) {
            let text = `{{user}} 决定独自前往${dest}${npcText}。`;
            if (stContext) {
                stContext.executeSlashCommandsWithOptions(`/setinput ${text}`);
                window.CTEIdolManager.closeAllPopups();
            }
        }
    };

    window.CTEIdolManager.finalizeTravel = function(activity) {
        const dest = window.CTEIdolManager.currentDestination;
        let finalActivity = activity;
        if (!finalActivity) finalActivity = $('#cte-idol-custom-activity').val();
        if (!finalActivity) return alert("请选择或输入活动内容");

        const name = window.CTEIdolManager.currentCompanion;
        let npcText = '';
        if (window.CTEIdolManager.tempNPCState.enabled && window.CTEIdolManager.tempNPCState.content) {
            npcText = `，期间遇见了${window.CTEIdolManager.tempNPCState.content}`;
        }
        const text = `{{user}} 邀请 ${name} 一起前往${dest}，${finalActivity}${npcText}。`;
        if (stContext) {
            stContext.executeSlashCommandsWithOptions(`/setinput ${text}`);
            window.CTEIdolManager.closeAllPopups();
        }
    };

    window.CTEIdolManager.openSubMenu = function(title, items) {
        const overlay = document.getElementById('cte-idol-interior-sub-menu');
        const titleEl = document.getElementById('cte-idol-sub-menu-title');
        const contentEl = document.getElementById('cte-idol-sub-menu-content');
        titleEl.textContent = title;
        contentEl.innerHTML = '';
        items.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'cte-idol-sub-item-btn';
            btn.textContent = item;
            btn.onclick = () => window.CTEIdolManager.openThirdLevelMenu(item, title, items);
            contentEl.appendChild(btn);
        });
        overlay.style.display = 'flex';
    };

    window.CTEIdolManager.closeSubMenu = function() { $('#cte-idol-interior-sub-menu').hide(); };

    window.CTEIdolManager.openThirdLevelMenu = function(roomName, floorTitle, floorItems) {
        const titleEl = document.getElementById('cte-idol-sub-menu-title');
        const contentEl = document.getElementById('cte-idol-sub-menu-content');
        titleEl.textContent = roomName;
        const desc = window.CTEIdolManager.roomDetails[roomName] || "暂无详细介绍。";
        const profile = window.CTEIdolManager.characterProfiles[roomName];
        let contentHTML = '';
        
        if (profile) {
            if (roomName === '你') {
                const savedAvatar = localStorage.getItem('cte_idol_user_avatar');
                const avatarSrc = savedAvatar || '';
                const hasAvatar = avatarSrc !== '';
                
                contentHTML = `
                    <div class="cte-idol-character-room-detail">
                        <div class="cte-idol-character-portrait cte-idol-user-portrait ${hasAvatar ? '' : 'no-avatar'}">
                            ${hasAvatar 
                                ? `<img src="${avatarSrc}" alt="你" class="cte-idol-character-image" id="cte-idol-user-avatar-img">` 
                                : `<div class="cte-idol-avatar-placeholder" id="cte-idol-user-avatar-placeholder"><span class="cte-idol-placeholder-icon">👤</span><span class="cte-idol-placeholder-text">点击上传头像</span></div>`
                            }
                        </div>
                        <div class="cte-idol-avatar-upload-section">
                            <button class="cte-idol-btn cte-idol-avatar-upload-btn" onclick="document.getElementById('cte-idol-user-avatar-upload').click()">📷 ${hasAvatar ? '更换头像' : '上传头像'}</button>
                            <input type="file" id="cte-idol-user-avatar-upload" accept="image/*" style="display:none;" onchange="window.CTEIdolManager.uploadUserAvatar(this)">
                            ${hasAvatar ? `<button class="cte-idol-btn cte-idol-avatar-delete-btn" onclick="window.CTEIdolManager.deleteUserAvatar()">🗑️ 删除头像</button>` : ''}
                        </div>
                        <div class="cte-idol-character-info">
                            <div class="cte-idol-info-row"><span class="cte-idol-info-label">姓名</span><span class="cte-idol-info-value">你</span></div>
                            <div class="cte-idol-info-row"><span class="cte-idol-info-label">年龄</span><span class="cte-idol-info-value">${profile.age}</span></div>
                            <div class="cte-idol-info-row"><span class="cte-idol-info-label">身份</span><span class="cte-idol-info-value">${profile.role}</span></div>
                            <div class="cte-idol-info-row"><span class="cte-idol-info-label">性格</span><span class="cte-idol-info-value">${profile.personality}</span></div>
                        </div>
                        <div class="cte-idol-room-description"><p>${desc}</p></div>
                        <div class="cte-idol-action-buttons"><button class="cte-idol-btn" onclick="window.CTEIdolManager.openTravelMenu('你的房间')">🚀 前往</button><button class="cte-idol-sub-item-btn" id="cte-idol-temp-back-btn">[ < 返回上一级 ]</button></div>
                    </div>`;
            } else {
                contentHTML = `
                    <div class="cte-idol-character-room-detail">
                        <div class="cte-idol-character-portrait"><img src="${profile.image}" alt="${roomName}" class="cte-idol-character-image"></div>
                        <div class="cte-idol-character-info">
                            <div class="cte-idol-info-row"><span class="cte-idol-info-label">姓名</span><span class="cte-idol-info-value">${roomName}</span></div>
                            <div class="cte-idol-info-row"><span class="cte-idol-info-label">年龄</span><span class="cte-idol-info-value">${profile.age}岁</span></div>
                            <div class="cte-idol-info-row"><span class="cte-idol-info-label">身份</span><span class="cte-idol-info-value">${profile.role}</span></div>
                            <div class="cte-idol-info-row"><span class="cte-idol-info-label">性格</span><span class="cte-idol-info-value">${profile.personality}</span></div>
                        </div>
                        <div class="cte-idol-room-description"><p>${desc}</p></div>
                        <div class="cte-idol-action-buttons"><button class="cte-idol-btn" onclick="window.CTEIdolManager.openTravelMenu('${roomName}的房间')">🚀 前往</button><button class="cte-idol-sub-item-btn" id="cte-idol-temp-back-btn">[ < 返回上一级 ]</button></div>
                    </div>`;
            }
        } else {
            contentHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; gap: 15px; width: 100%;">
                    <p style="text-align:justify; font-size:14px; line-height:1.6;">${desc}</p>
                    <button class="cte-idol-btn" onclick="window.CTEIdolManager.openTravelMenu('${roomName}')">🚀 前往</button>
                    <button class="cte-idol-sub-item-btn" id="cte-idol-temp-back-btn">[ < 返回上一级 ]</button>
                </div>`;
        }
        contentEl.innerHTML = contentHTML;
        document.getElementById('cte-idol-temp-back-btn').onclick = () => window.CTEIdolManager.openSubMenu(floorTitle, floorItems);
    };

    window.CTEIdolManager.uploadUserAvatar = function(input) {
        if (input.files && input.files[0]) {
            const file = input.files[0];
            if (file.size > 2 * 1024 * 1024) { alert('图片大小不能超过2MB，请选择较小的图片'); return; }
            const reader = new FileReader();
            reader.onload = function(e) {
                localStorage.setItem('cte_idol_user_avatar', e.target.result);
                window.CTEIdolManager.openThirdLevelMenu('你', '五楼：私人宿舍区', ['秦述', '司洛', '鹿言', '魏星泽', '周锦宁', '谌绪', '孟明赫', '亓谢', '魏月华', '桑洛凡', '你', '公共书房/阅览区']);
            };
            reader.readAsDataURL(file);
        }
    };

    window.CTEIdolManager.deleteUserAvatar = function() {
        if (confirm('确定要删除头像吗？')) {
            localStorage.removeItem('cte_idol_user_avatar');
            window.CTEIdolManager.openThirdLevelMenu('你', '五楼：私人宿舍区', ['秦述', '司洛', '鹿言', '魏星泽', '周锦宁', '谌绪', '孟明赫', '亓谢', '魏月华', '桑洛凡', '你', '公共书房/阅览区']);
        }
    };

    window.CTEIdolManager.openRooftopMenu = function() {
        window.CTEIdolManager.openSubMenu('天台花园酒吧', []);
        const contentEl = document.getElementById('cte-idol-sub-menu-content');
        contentEl.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 15px; width: 100%;">
                <p style="text-align:justify; font-size:14px; line-height:1.6;">
                    种植着四季花草，设有舒适的露天沙发、吧台和烧烤架，可以远眺京港的夜景，是成员们聚会放松的绝佳地点。
                </p>
                <button class="cte-idol-btn" onclick="window.CTEIdolManager.openTravelMenu('天台花园酒吧')">🚀 前往</button>
            </div>`;
    };

    function bindMapEvents() {
        const mapContainer = document.getElementById('cte-idol-map-container');
        if (!mapContainer) return;
        const locations = mapContainer.querySelectorAll('.cte-idol-location');
        
        locations.forEach(elm => {
            let isDragging = false;
            let startX, startY, initialLeft, initialTop;
            let hasMoved = false;

            elm.onmousedown = function(e) {
                e.preventDefault(); e.stopPropagation();
                isDragging = true; hasMoved = false; elm.classList.add('dragging');
                startX = e.clientX; startY = e.clientY; initialLeft = elm.offsetLeft; initialTop = elm.offsetTop;

                document.onmousemove = function(e) {
                    if (!isDragging) return;
                    const dx = e.clientX - startX; const dy = e.clientY - startY;
                    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved = true;
                    let newLeft = Math.max(0, Math.min(initialLeft + dx, mapContainer.offsetWidth));
                    let newTop = Math.max(0, Math.min(initialTop + dy, mapContainer.offsetHeight));
                    elm.style.left = newLeft + 'px'; elm.style.top = newTop + 'px';
                };

                document.onmouseup = function() {
                    isDragging = false; elm.classList.remove('dragging');
                    document.onmousemove = null; document.onmouseup = null;
                    if (!hasMoved) {
                        const popupId = elm.getAttribute('data-popup');
                        if (popupId) window.CTEIdolManager.showPopup(popupId);
                    } else {
                        savePosition(elm.id, elm.style.left, elm.style.top);
                    }
                };
            };
        });
    }

    function savePosition(id, left, top) {
        let data = localStorage.getItem('cte_idol_map_positions');
        data = data ? JSON.parse(data) : {};
        data[id] = { left, top };
        localStorage.setItem('cte_idol_map_positions', JSON.stringify(data));
    }

    function loadSavedPositions() {
        const data = JSON.parse(localStorage.getItem('cte_idol_map_positions'));
        if (!data) return;
        for (const [id, pos] of Object.entries(data)) {
            const el = document.getElementById(id);
            if (el) { el.style.left = pos.left; el.style.top = pos.top; }
        }
    }

    function loadSavedBg() {
        const bg = localStorage.getItem('cte_idol_map_bg');
        if (bg) document.getElementById('cte-idol-map-container').style.backgroundImage = `url(${bg})`;
    }

    window.CTEIdolManager.changeBackground = function(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('cte-idol-map-container').style.backgroundImage = `url(${e.target.result})`;
                localStorage.setItem('cte_idol_map_bg', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    };

    window.CTEIdolManager.showPopup = function(id) {
        if (id === 'cte-idol-dorm-detail-popup') window.CTEIdolManager.closeAllPopups();
        const popup = document.querySelector(`#cte-idol-map-panel #${id}`);
        const overlay = document.querySelector(`#cte-idol-map-panel #cte-idol-overlay`);
        if (popup) {
            if (overlay) overlay.style.display = 'block';
            popup.style.display = 'block';
            popup.scrollTop = 0;
        }
    };

    window.CTEIdolManager.closeAllPopups = function() {
        const isTravelMenuVisible = $('#cte-idol-travel-menu-overlay').is(':visible');
        $('#cte-idol-map-panel #cte-idol-overlay').hide();
        $('#cte-idol-map-panel .cte-idol-popup').hide();
        window.CTEIdolManager.closeSubMenu();
        // [FIX] Update close logic to new consolidated object methods
        if (window.CTEIdolManager.Heartbeat && window.CTEIdolManager.Heartbeat.closeModal) {
            window.CTEIdolManager.Heartbeat.closeModal();
        }
        window.CTEIdolManager.Contracts.closeModal();
        window.CTEIdolManager.Shop.closeModal();
        window.CTEIdolManager.closeTravelMenu(isTravelMenuVisible);
    };

})();
