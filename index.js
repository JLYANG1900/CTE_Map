(function() {
    // ==========================================
    // 0. 插件配置与上下文
    // ==========================================
    const extensionName = "CTE_Map"; 
    const extensionPath = `scripts/extensions/third-party/${extensionName}`;
    let stContext = null;
    const DEFAULT_NATIONAL_BG = "https://files.catbox.moe/8z3pnp.png";

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
            futureLog: [], // 新增
            activeTasks: [] // 新增
        }
    };

    // 亲密互动数据
    window.CTEIdolManager.Heartbeat = {
        activities: [
            { name: "私人练歌", icon: "fa-microphone", desc: "关上隔音室的门，只有你们两个人的呼吸声。" },
            { name: "舞蹈特训", icon: "fa-person-running", desc: "贴身指导每一个动作，汗水交织。" },
            { name: "浴室水蒸气", icon: "fa-shower", desc: "在湿热的雾气中，探索彼此身体的每一寸。" },
            { name: "深夜卧室", icon: "fa-bed", desc: "用最温柔的方式，陪伴彼此度过漫漫长夜。" },
            { name: "角色扮演", icon: "fa-masks-theater", desc: "尝试不同的身份，解锁不一样的刺激体验。" },
            { name: "镜前诱惑", icon: "fa-wand-magic-sparkles", desc: "让他看清自己为你疯狂的模样。" },
            { name: "专属女仆", icon: "fa-broom", desc: "换上那套特别的服装，提供全方位服务。" },
            { name: "厨房幻想", icon: "fa-utensils", desc: "在充满烟火气的地方做最疯狂的事。" },
            { name: "按摩室SPA", icon: "fa-hot-tub-person", desc: "指尖划过肌肤，理智逐渐蒸发。" },
            { name: "天台夜风", icon: "fa-wind", desc: "城市的霓虹灯在脚下闪烁，我们在风中沉沦。" }
        ],
        currentActivity: null
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
            { id: 'jinggang', name: '京港', icon: 'fa-landmark-dome', top: '20%', left: '70%', isReturn: true, info: '<strong><i class="fa-solid fa-crown"></i> 权力漩涡:</strong> 首都...' },
            { id: 'langjing', name: '琅京', icon: 'fa-gem', top: '40%', left: '80%', info: '<strong><i class="fa-solid fa-coins"></i> 豪门金库:</strong> 金融与地产重镇...' },
            { id: 'shenzhou', name: '深州', icon: 'fa-microchip', top: '80%', left: '75%', info: '<strong><i class="fa-solid fa-chart-line"></i> 科技前沿:</strong> 沿海经济特区...' },
            { id: 'haizhou', name: '海洲', icon: 'fa-anchor', top: '75%', left: '55%', info: '<strong><i class="fa-solid fa-skull-crossbones"></i> 灰色地带:</strong> 港口城市...' },
            { id: 'taihe', name: '台河', icon: 'fa-book-open', top: '30%', left: '40%', info: '<strong><i class="fa-solid fa-graduation-cap"></i> 学术之城:</strong> 历史名城...' },
            { id: 'huashao', name: '化邵', icon: 'fa-industry', top: '50%', left: '20%', info: '<strong><i class="fa-solid fa-wrench"></i> 工业心脏:</strong> 重工业城市...' },
            { id: 'yucheng', name: '玉城', icon: 'fa-martini-glass-citrus', top: '65%', left: '35%', info: '<strong><i class="fa-solid fa-sun"></i> 度假天堂:</strong> 旅游胜地...' },
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
    // 2. 核心功能函数
    // ==========================================

    // [新增] 2.0 解析 status_top XML 文本
    window.CTEIdolManager.parseStatusTop = function(text) {
        if (!text) return null;
        
        const timeMatch = text.match(/时间[:：]\s*(.*?)(?:\n|$)/);
        const locMatch = text.match(/地点[:：]\s*(.*?)(?:\n|$)/);
        // 今日安排：匹配到 "最近演出安排" 或 字符串结束
        const todayMatch = text.match(/今日安排[:：]\s*([\s\S]*?)(?=最近演出安排[:：]|$)/);
        const upcomingMatch = text.match(/最近演出安排[:：]\s*([\s\S]*?)(?:\n|$)/);

        return {
            dateStr: timeMatch ? timeMatch[1].trim() : '未知时间',
            locationStr: locMatch ? locMatch[1].trim() : '未知地点',
            todaySchedule: todayMatch ? todayMatch[1].trim() : '无今日安排',
            upcoming: upcomingMatch ? upcomingMatch[1].trim() : '无近期演出'
        };
    };

    // [修改] 获取 status_top 内容的辅助函数
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

    // 2.1 扫描 RPG 状态 (纯渲染)
    window.CTEIdolManager.scanForRPGStats = function() {
        if (window.CTEIdolManager.RPG && window.CTEIdolManager.RPG.state) {
            const fundsEl = document.querySelector('#cte-idol-map-panel #cte-idol-rpg-val-funds');
            const fansEl = document.querySelector('#cte-idol-map-panel #cte-idol-rpg-val-fans');
            const moraleEl = document.querySelector('#cte-idol-map-panel #cte-idol-rpg-val-morale');

            // 资金
            if (fundsEl) {
                const val = window.CTEIdolManager.RPG.state.funds;
                fundsEl.innerText = (typeof val === 'number') ? val.toLocaleString() : val;
            }

            // 粉丝
            if (fansEl) {
                const val = window.CTEIdolManager.RPG.state.fans;
                fansEl.innerText = (typeof val === 'number') ? val.toLocaleString() : val;
            }

            // 团魂
            if (moraleEl) {
                moraleEl.innerText = window.CTEIdolManager.RPG.state.morale;
            }
        }
    };

    // 从 status_bottom1 读取角色动态状态
    window.CTEIdolManager.readCharacterStatsFromChat = function() {
        let context = stContext;
        if (!context && window.SillyTavern) {
            context = window.SillyTavern.getContext();
        }
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

    // [修改] 读取 MVU (stat_data) 并解析
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
                
                // --- 1. 解析经营组数据 (Management['CTE经营组']) ---
                if (statData.Management && statData.Management['CTE经营组']) {
                    const cteGroup = statData.Management['CTE经营组'];

                    // 资金: 去除逗号转整数
                    if (cteGroup['资金'] !== undefined) {
                        const fundsStr = String(cteGroup['资金']).replace(/,/g, '');
                        window.CTEIdolManager.RPG.state.funds = parseInt(fundsStr, 10) || 0;
                    }

                    // 粉丝: 去除逗号转整数
                    if (cteGroup['粉丝'] !== undefined) {
                        const fansStr = String(cteGroup['粉丝']).replace(/,/g, '');
                        window.CTEIdolManager.RPG.state.fans = parseInt(fansStr, 10) || 0;
                    }

                    // 团魂
                    if (cteGroup['团魂']) {
                        window.CTEIdolManager.RPG.state.morale = cteGroup['团魂'];
                    }

                    // 待办事项 (futureLog)
                    if (cteGroup['待办']) {
                        window.CTEIdolManager.RPG.state.futureLog = Array.isArray(cteGroup['待办']) 
                            ? cteGroup['待办'] 
                            : [cteGroup['待办']];
                    }

                    // 现有通告 (activeTasks)
                    if (cteGroup['现有通告']) {
                        window.CTEIdolManager.RPG.state.activeTasks = Array.isArray(cteGroup['现有通告']) 
                            ? cteGroup['现有通告'] 
                            : [cteGroup['现有通告']];
                    }
                }

                // --- 2. 解析角色数据 (MainCharacters) ---
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

                // 刷新 UI 显示
                window.CTEIdolManager.scanForRPGStats();

            } catch (e) {
                console.error("[CTE Idol Map] Failed to parse stat_data:", e);
            }
        }
    };

    // 2.2 渲染事务所内容 (Dashboard updated with Archive Card)
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

            } else if (viewType === 'agency') {
                htmlContent = '<div style="color:#888; text-align:center; padding:50px;">事务所运营功能正在开发中...<br>请先管理好现有艺人。</div>';
            } else {
                // ==========================
                // Dashboard (Archive Card)
                // ==========================
                const statusTopRaw = window.CTEIdolManager.getStatusTopContent();
                const parsedStatus = window.CTEIdolManager.parseStatusTop(statusTopRaw) || {
                    dateStr: '数据同步中...',
                    locationStr: '位置未知',
                    todaySchedule: '暂无行程信息',
                    upcoming: '待定'
                };

                // Split Date string if possible (e.g. "2025年1月22日 | 星期五 | 06:30 | 训练日")
                let timeBadge = '';
                let dateParts = parsedStatus.dateStr.split('|');
                if (dateParts.length >= 3) timeBadge = dateParts[2].trim();

                const funds = window.CTEIdolManager.RPG.state.funds.toLocaleString();
                
                // Generate Lists
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

                htmlContent = `
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; height:100%;">
                        <!-- Left: Archive Card (Replaces Recent Announcements) -->
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

                        <!-- Right: Stats & Score (Existing) -->
                        <div class="cte-idol-rpg-card" style="display:flex; align-items:center; justify-content:center;">
                            <div style="text-align:center;">
                                <div style="font-size:32px; color:#c5a065; font-weight:bold;">S+</div>
                                <div style="font-size:12px; color:#666;">综合评价</div>
                            </div>
                        </div>
                    </div>
                `;
            }

            container.innerHTML = htmlContent;

        } catch (e) {
            console.error("[CTE Idol Map] Error rendering RPG content:", e);
            container.innerHTML = `<div style="color:red; padding:20px;">渲染错误: ${e.message}</div>`;
        }
    };

    // 2.3 渲染 Heartbeat 界面
    window.CTEIdolManager.Heartbeat.renderGrid = function() {
        const container = document.querySelector('#cte-idol-map-panel #cte-idol-hb-activity-grid');
        if (!container) return;
        
        let html = '';
        try {
            window.CTEIdolManager.Heartbeat.activities.forEach(act => {
                html += `
                    <div class="cte-idol-hb-activity-card">
                        <div class="cte-idol-hb-activity-icon"><i class="fa-solid ${act.icon}"></i></div>
                        <div class="cte-idol-hb-activity-name">${act.name}</div>
                        <div class="cte-idol-hb-activity-desc">${act.desc}</div>
                        <button class="cte-idol-hb-btn" onclick="window.CTEIdolManager.Heartbeat.openModal('${act.name}')">安排互动</button>
                    </div>
                `;
            });
            container.innerHTML = html;
        } catch(e) {
            console.error("[CTE Idol Map] Error rendering Heartbeat:", e);
        }
    };

    window.CTEIdolManager.Heartbeat.openModal = function(actName) {
        window.CTEIdolManager.Heartbeat.currentActivity = actName;
        const list = document.getElementById('cte-idol-hb-member-list');
        if (!list) return;
        
        let html = '';
        for (const [name, profile] of Object.entries(window.CTEIdolManager.characterProfiles)) {
            if (name === '你') continue;
            html += `
                <div class="cte-idol-hb-member-item" onclick="$(this).toggleClass('selected')">
                    <div class="cte-idol-hb-member-avatar" style="background-image: url('${profile.image}')"></div>
                    <div class="cte-idol-hb-member-name">${name}</div>
                </div>
            `;
        }
        list.innerHTML = html;
        $('#cte-idol-hb-modal').addClass('active');
    };

    window.CTEIdolManager.Heartbeat.closeModal = function() {
        $('#cte-idol-hb-modal').removeClass('active');
    };

    window.CTEIdolManager.Heartbeat.confirmAssignment = function() {
        const selected = [];
        $('.cte-idol-hb-member-item.selected').each(function() {
            selected.push($(this).find('.cte-idol-hb-member-name').text());
        });
        
        if (selected.length === 0) {
            alert("请至少选择一名成员！");
            return;
        }
        
        const activity = window.CTEIdolManager.Heartbeat.currentActivity;
        const text = `{{user}} 决定与 ${selected.join('、')} 做爱：${activity}。`;
        
        if (stContext) {
            stContext.executeSlashCommandsWithOptions(`/setinput ${text}`);
            window.CTEIdolManager.closeAllPopups();
            window.CTEIdolManager.Heartbeat.closeModal();
            $('#cte-idol-map-panel').fadeOut();
        }
    };

    // 2.4 视图切换
    window.CTEIdolManager.switchView = function(viewName, btn) {
        console.log("[CTE Idol Map] Switching to view:", viewName);
        
        // 更新导航按钮状态
        const panel = document.getElementById('cte-idol-map-panel');
        if(panel) {
            const btns = panel.querySelectorAll('.cte-idol-nav-btn');
            btns.forEach(b => b.classList.remove('active'));
            if (btn) btn.classList.add('active');
            else if (viewName === 'map' && btns[0]) btns[0].classList.add('active');
            
            // 切换视图显示
            const views = panel.querySelectorAll('.cte-idol-view');
            views.forEach(v => v.classList.remove('active'));
            const targetView = panel.querySelector(`#cte-idol-view-${viewName}`);
            if (targetView) targetView.classList.add('active');
        }

        // 调用对应渲染逻辑
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
                window.CTEIdolManager.Heartbeat.renderGrid();
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
        // 使用事件委托
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

        // 彻底清理旧的 DOM 元素
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
                    <span>CTE 偶像地图系统</span>
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
            
            // 注入 HTML 内容
            const contentArea = document.getElementById('cte-idol-content-area');
            if(contentArea) contentArea.innerHTML = htmlContent;
            
            // 初始化各个模块
            bindMapEvents();
            loadSavedPositions();
            loadSavedBg();
            window.CTEIdolManager.initNationalMap();
            window.CTEIdolManager.loadSavedNationalBg();
            
            bindRPGEvents();

        } catch (e) {
            console.error("[CTE Idol Map] Initialization Error:", e);
            const contentArea = document.getElementById('cte-idol-content-area');
            if(contentArea) contentArea.innerHTML = `<p style="padding:20px; color:white;">无法加载地图文件 (map.html)。<br>错误信息: ${e.message}</p>`;
        }

        // 绑定主面板事件
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
                    // 检查当前视图并刷新
                    if ($('#cte-idol-view-schedule').hasClass('active')) window.CTEIdolManager.refreshSchedule();
                    if ($('#cte-idol-view-manager').hasClass('active')) {
                        window.CTEIdolManager.readStatsFromMVU();
                        window.CTEIdolManager.readCharacterStatsFromChat();
                        window.CTEIdolManager.renderRPGContent('dashboard');
                    }
                    if ($('#cte-idol-view-heartbeat').hasClass('active')) window.CTEIdolManager.Heartbeat.renderGrid();
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
        window.CTEIdolManager.Heartbeat.closeModal();
        window.CTEIdolManager.closeTravelMenu(isTravelMenuVisible);
    };

})(); // End IIFE
