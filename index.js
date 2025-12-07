(function() {
    // ==========================================
    // 0. 插件配置与上下文
    // ==========================================
    const extensionName = "CTE_Map";
    const extensionPath = `scripts/extensions/third-party/${extensionName}`;
    let stContext = null;
    const DEFAULT_NATIONAL_BG = "https://files.catbox.moe/8z3pnp.png";

    // 确保全局命名空间存在
    window.CTEMap = window.CTEMap || {};

    // ==========================================
    // 1. 数据定义
    // ==========================================
    
    // RPG 数据状态
    window.CTEMap.RPG = {
        state: {
            funds: 2450000,
            fans: 824000,
            morale: "High"
        }
    };

    // 亲密互动数据
    window.CTEMap.Heartbeat = {
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
    Object.assign(window.CTEMap, {
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

        // 角色档案：包含 image, rpgStats (Vocal/Dance), status (Desire/Affection)
        characterProfiles: {
            '魏月华': { image: 'https://files.catbox.moe/auqnct.jpeg', age: 27, role: '万城娱乐CEO', personality: '严肃、冷酷', rpgStats: { vocal: 60, dance: 60, stamina: 90 }, status: { desire: 0, affection: 0 } },
            '秦述': { image: 'https://files.catbox.moe/c2khbl.jpeg', age: 24, role: '队长、主舞', personality: '沉默、清冷', rpgStats: { vocal: 88, dance: 96, stamina: 92 }, status: { desire: 0, affection: 0 } },
            '司洛': { image: 'https://files.catbox.moe/pohz52.jpeg', age: 24, role: '全能ACE', personality: '慵懒、随性', rpgStats: { vocal: 92, dance: 95, stamina: 88 }, status: { desire: 0, affection: 0 } },
            '鹿言': { image: 'https://files.catbox.moe/parliq.jpeg', age: 23, role: '主唱担当', personality: '温柔、谦逊', rpgStats: { vocal: 96, dance: 85, stamina: 85 }, status: { desire: 0, affection: 0 } },
            '魏星泽': { image: 'https://files.catbox.moe/syo0ze.jpeg', age: 20, role: '舞蹈、气氛', personality: '开朗、感性', rpgStats: { vocal: 85, dance: 93, stamina: 95 }, status: { desire: 0, affection: 0 } },
            '周锦宁': { image: 'https://files.catbox.moe/1loxsn.jpeg', age: 20, role: 'Rapper、门面', personality: '傲娇、矜贵', rpgStats: { vocal: 88, dance: 90, stamina: 80 }, status: { desire: 0, affection: 0 } },
            '谌绪': { image: 'https://files.catbox.moe/9tnuva.png', age: 18, role: '主唱、忙内', personality: '腹黑、恶劣', rpgStats: { vocal: 90, dance: 88, stamina: 85 }, status: { desire: 0, affection: 0 } },
            '孟明赫': { image: 'https://files.catbox.moe/m446ro.jpeg', age: 20, role: 'Rapper', personality: '阴郁、厌世', rpgStats: { vocal: 89, dance: 85, stamina: 82 }, status: { desire: 0, affection: 0 } },
            '亓谢': { image: 'https://files.catbox.moe/ev2g1l.png', age: 18, role: '舞蹈、副Rapper', personality: '疯批、天才', rpgStats: { vocal: 80, dance: 94, stamina: 90 }, status: { desire: 0, affection: 0 } },
            '桑洛凡': { image: 'https://files.catbox.moe/syudzu.png', age: 27, role: '传奇Solo', personality: '慵懒、桀骜', rpgStats: { vocal: 98, dance: 90, stamina: 88 }, status: { desire: 0, affection: 0 } },
            '你': { image: '', age: '?', role: 'CTE宿舍成员', personality: '由你定义', rpgStats: { vocal: 50, dance: 50, stamina: 50 }, status: { desire: 0, affection: 0 } }
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

    // 2.1 扫描 RPG 状态 (Funds, Fans, Morale)
    window.CTEMap.scanForRPGStats = function() {
        if (window.CTEMap.RPG && window.CTEMap.RPG.state) {
            const fundsEl = document.querySelector('#cte-map-panel #rpg-val-funds');
            const fansEl = document.querySelector('#cte-map-panel #rpg-val-fans');
            const moraleEl = document.querySelector('#cte-map-panel #rpg-val-morale');

            if (fundsEl) fundsEl.innerText = window.CTEMap.RPG.state.funds.toLocaleString();
            if (fansEl) fansEl.innerText = window.CTEMap.RPG.state.fans.toLocaleString();
            if (moraleEl) moraleEl.innerText = window.CTEMap.RPG.state.morale;
        }
    };

    // [新增] 从 status_bottom1 读取角色动态状态 (欲望/好感) - 文本解析
    window.CTEMap.readCharacterStatsFromChat = function() {
        // 1. 获取 ST 上下文
        let context = stContext;
        if (!context && window.SillyTavern) {
            context = window.SillyTavern.getContext();
        }
        if (!context || !context.chat || context.chat.length === 0) return;

        // 2. 倒序查找包含 <status_bottom1> 的消息
        let statusContent = null;
        for (let i = context.chat.length - 1; i >= 0; i--) {
            const msg = context.chat[i].mes || "";
            // 正则匹配标签内容
            const match = msg.match(/<status_bottom1>([\s\S]*?)<\/status_bottom1>/i);
            if (match) {
                statusContent = match[1];
                break; // 找到最新的就停止
            }
        }

        if (!statusContent) return; // 没找到数据则退出

        // 3. 遍历所有角色并提取数据
        for (const [name, profile] of Object.entries(window.CTEMap.characterProfiles)) {
            if (name === '你') continue; // 跳过用户

            // 构造正则：查找 <角色名>内容</角色名>
            const charBlockRegex = new RegExp(`<${name}>([\\s\\S]*?)<\\/${name}>`, 'i');
            const charMatch = statusContent.match(charBlockRegex);

            if (charMatch) {
                const blockText = charMatch[1];
                
                // 提取欲望 (支持 "欲望: 50" 或 "欲望：50%")
                const desireMatch = blockText.match(/欲望[：:]\s*(\d+)/);
                if (desireMatch) {
                    profile.status.desire = parseInt(desireMatch[1]);
                }

                // 提取好感 (支持 "好感: 50" 或 "好感度：50")
                const affMatch = blockText.match(/好感(?:度)?[：:]\s*(\d+)/);
                if (affMatch) {
                    profile.status.affection = parseInt(affMatch[1]);
                }
            }
        }
        console.log("[CTE Map] Character stats updated from chat (text tag).");
    };

    // [新增] 读取 MVU (stat_data) 变量逻辑 - 支持 SillyTavern 变量系统
    window.CTEMap.readStatsFromMVU = function() {
        let ST = window.SillyTavern;
        if (!ST && window.parent) ST = window.parent.SillyTavern;
        if (!ST) return;

        let statDataRaw = null;

        // 1. 尝试从 Extension Settings 读取 (最新的变量状态)
        try {
            const extVars = ST.extension_settings?.variables;
            if (extVars) {
                if (extVars.global && extVars.global['stat_data']) statDataRaw = extVars.global['stat_data'];
                else if (extVars.local && extVars.local['stat_data']) statDataRaw = extVars.local['stat_data'];
            }
        } catch (e) { console.warn("[CTE] Error reading ext settings:", e); }

        // 2. 如果没找到，扫描聊天记录 (回退方案)
        if (!statDataRaw && stContext && stContext.chat) {
            const chat = stContext.chat;
            for (let i = chat.length - 1; i >= 0; i--) {
                const msg = chat[i];
                const vars = msg.variables || (msg.data && msg.data.variables);
                if (vars) {
                    // 兼容对象或数组结构
                    if (typeof vars === 'object' && !Array.isArray(vars) && vars['stat_data']) {
                        statDataRaw = vars['stat_data'];
                        break;
                    } else if (Array.isArray(vars)) {
                        // 某些版本可能是数组
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
                // 如果是字符串则解析 JSON
                const statData = typeof statDataRaw === 'string' ? JSON.parse(statDataRaw) : statDataRaw;
                
                if (statData && statData.MainCharacters) {
                    for (const [name, profile] of Object.entries(window.CTEMap.characterProfiles)) {
                        if (name === '你') continue;
                        
                        // 尝试匹配角色名 (stat_data中的Key通常是中文名)
                        const charData = statData.MainCharacters[name];
                        
                        if (charData) {
                            // 读取欲望
                            if (charData['欲望'] !== undefined) profile.status.desire = parseInt(charData['欲望']);
                            
                            // 读取好感 (兼容 '好感' 和 '好感度')
                            if (charData['好感'] !== undefined) profile.status.affection = parseInt(charData['好感']);
                            else if (charData['好感度'] !== undefined) profile.status.affection = parseInt(charData['好感度']);
                        }
                    }
                    console.log("[CTE Map] Success: Stats updated from MVU stat_data.");
                }
            } catch (e) {
                console.error("[CTE Map] Failed to parse stat_data:", e);
            }
        }
    };

    // 2.2 渲染事务所内容
    window.CTEMap.renderRPGContent = function(viewType) {
        // 使用限定范围的选择器，确保获取到的是当前面板内的元素
        const container = document.querySelector('#cte-map-panel #cte-rpg-content-area');
        
        if (!container) {
            console.error("[CTE Map] Critical: RPG content container not found.");
            return;
        }

        let htmlContent = '';

        try {
            if (viewType === 'roster') {
                htmlContent += '<div class="cte-rpg-roster-grid">';
                for (const [name, profile] of Object.entries(window.CTEMap.characterProfiles)) {
                    if (name === '你') continue;
                    
                    const roleText = (profile.role && typeof profile.role === 'string') ? profile.role.split('、')[0] : '成员';
                    const stats = profile.rpgStats || { vocal: 50, dance: 50 };
                    
                    // Warning logic for High Desire
                    let warningHtml = '';
                    if (profile.status && profile.status.desire > 80) {
                        warningHtml = `<div class="cte-rpg-warning-box"><span><i class="fa-solid fa-triangle-exclamation"></i> 欲望值过高</span><button class="cte-heartbeat-shortcut" onclick="window.CTEMap.switchView('heartbeat')"><i class="fa-solid fa-heart"></i></button></div>`;
                    }

                    htmlContent += `
                    <div class="cte-rpg-card">
                        <div style="display:flex; gap:15px;">
                            <div class="cte-rpg-avatar-box"><img src="${profile.image}"><div class="cte-rpg-role-tag">${roleText}</div></div>
                            <div style="flex:1;">
                                <div style="display:flex; justify-content:space-between;">
                                    <div style="color:#fff; font-weight:bold; font-size:14px;">${name}</div>
                                    <div style="font-size:10px; color:#888;">${profile.personality}</div>
                                </div>
                                
                                <!-- 原有 Vocal/Dance 数据 (金色/C5A065) -->
                                <div class="cte-rpg-stat-row">
                                    <div class="cte-rpg-stat-bar-container">
                                        <div class="label" style="display:flex; justify-content:space-between;">
                                            <span>Vocal</span> <span>${stats.vocal}</span>
                                        </div>
                                        <div class="bar-bg">
                                            <div class="bar-fill" style="width:${stats.vocal}%; background:#c5a065;"></div>
                                        </div>
                                    </div>
                                    <div class="cte-rpg-stat-bar-container">
                                        <div class="label" style="display:flex; justify-content:space-between;">
                                            <span>Dance</span> <span>${stats.dance}</span>
                                        </div>
                                        <div class="bar-bg">
                                            <div class="bar-fill" style="width:${stats.dance}%; background:#c5a065;"></div>
                                        </div>
                                    </div>
                                </div>

                                <!-- 新增 欲望/好感 数据 (粉色/EC4899 & 红色/F43F5E) -->
                                <div class="cte-rpg-stat-row" style="margin-top: 5px;">
                                    <div class="cte-rpg-stat-bar-container">
                                        <div class="label" style="display:flex; justify-content:space-between;">
                                            <span>欲望</span> <span style="color:#ec4899;">${profile.status.desire}%</span>
                                        </div>
                                        <div class="bar-bg">
                                            <div class="bar-fill" style="width:${profile.status.desire}%; background:#ec4899; box-shadow:0 0 5px #ec4899;"></div>
                                        </div>
                                    </div>
                                    <div class="cte-rpg-stat-bar-container">
                                        <div class="label" style="display:flex; justify-content:space-between;">
                                            <span>好感</span> <span style="color:#f43f5e;">${profile.status.affection}%</span>
                                        </div>
                                        <div class="bar-bg">
                                            <div class="bar-fill" style="width:${profile.status.affection}%; background:#f43f5e;"></div>
                                        </div>
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
                // Dashboard
                htmlContent = `
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                        <div class="cte-rpg-card">
                            <h3 style="color:#fff; font-size:14px; margin-top:0;">近期通告</h3>
                            <ul style="list-style:none; padding:0; font-size:12px; color:#ccc;">
                                <li style="padding:5px 0; border-bottom:1px solid rgba(255,255,255,0.1);">京港电视台专访 <span style="float:right; color:#c5a065;">完成</span></li>
                                <li style="padding:5px 0; border-bottom:1px solid rgba(255,255,255,0.1);">新专辑《NEON》筹备 <span style="float:right; color:#888;">进行中</span></li>
                                <li style="padding:5px 0; border-bottom:1px solid rgba(255,255,255,0.1);">练习生月度考核 <span style="float:right; color:#888;">下周</span></li>
                            </ul>
                        </div>
                        <div class="cte-rpg-card" style="display:flex; align-items:center; justify-content:center;">
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
            console.error("[CTE Map] Error rendering RPG content:", e);
            container.innerHTML = `<div style="color:red; padding:20px;">渲染错误: ${e.message}</div>`;
        }
    };

    // 2.3 渲染 Heartbeat 界面
    window.CTEMap.Heartbeat.renderGrid = function() {
        const container = document.querySelector('#cte-map-panel #cte-hb-activity-grid');
        if (!container) return;
        
        let html = '';
        try {
            window.CTEMap.Heartbeat.activities.forEach(act => {
                html += `
                    <div class="cte-hb-activity-card">
                        <div class="cte-hb-activity-icon"><i class="fa-solid ${act.icon}"></i></div>
                        <div class="cte-hb-activity-name">${act.name}</div>
                        <div class="cte-hb-activity-desc">${act.desc}</div>
                        <button class="cte-hb-btn" onclick="window.CTEMap.Heartbeat.openModal('${act.name}')">安排互动</button>
                    </div>
                `;
            });
            container.innerHTML = html;
        } catch(e) {
            console.error("[CTE Map] Error rendering Heartbeat:", e);
        }
    };

    window.CTEMap.Heartbeat.openModal = function(actName) {
        window.CTEMap.Heartbeat.currentActivity = actName;
        const list = document.getElementById('cte-hb-member-list');
        if (!list) return;
        
        let html = '';
        for (const [name, profile] of Object.entries(window.CTEMap.characterProfiles)) {
            if (name === '你') continue;
            html += `
                <div class="cte-hb-member-item" onclick="$(this).toggleClass('selected')">
                    <div class="cte-hb-member-avatar" style="background-image: url('${profile.image}')"></div>
                    <div class="cte-hb-member-name">${name}</div>
                </div>
            `;
        }
        list.innerHTML = html;
        $('#cte-hb-modal').addClass('active');
    };

    window.CTEMap.Heartbeat.closeModal = function() {
        $('#cte-hb-modal').removeClass('active');
    };

    window.CTEMap.Heartbeat.confirmAssignment = function() {
        const selected = [];
        $('.cte-hb-member-item.selected').each(function() {
            selected.push($(this).find('.cte-hb-member-name').text());
        });
        
        if (selected.length === 0) {
            alert("请至少选择一名成员！");
            return;
        }
        
        const activity = window.CTEMap.Heartbeat.currentActivity;
        const text = `{{user}} 决定与 ${selected.join('、')} 进行亲密互动：${activity}。`;
        
        if (stContext) {
            stContext.executeSlashCommandsWithOptions(`/setinput ${text}`);
            window.CTEMap.closeAllPopups();
            window.CTEMap.Heartbeat.closeModal();
            $('#cte-map-panel').fadeOut();
        }
    };

    // 2.4 视图切换
    window.CTEMap.switchView = function(viewName, btn) {
        console.log("[CTE Map] Switching to view:", viewName);
        
        // 更新导航按钮状态
        const panel = document.getElementById('cte-map-panel');
        if(panel) {
            const btns = panel.querySelectorAll('.cte-nav-btn');
            btns.forEach(b => b.classList.remove('active'));
            if (btn) btn.classList.add('active');
            else if (viewName === 'map' && btns[0]) btns[0].classList.add('active');
            
            // 切换视图显示
            const views = panel.querySelectorAll('.cte-view');
            views.forEach(v => v.classList.remove('active'));
            const targetView = panel.querySelector(`#cte-view-${viewName}`);
            if (targetView) targetView.classList.add('active');
        }

        // 调用对应渲染逻辑
        try {
            if (viewName === 'schedule') {
                window.CTEMap.refreshSchedule();
            }
            if (viewName === 'manager') {
                window.CTEMap.scanForRPGStats();
                window.CTEMap.readStatsFromMVU();
                window.CTEMap.readCharacterStatsFromChat();
                window.CTEMap.renderRPGContent('dashboard'); 
            }
            if (viewName === 'heartbeat') {
                window.CTEMap.Heartbeat.renderGrid();
            }
        } catch (e) {
            console.error("[CTE Map] Error switching view:", e);
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
        // 使用事件委托，绑定到静态的父元素，防止子元素刷新后事件丢失
        $(document).off('click', '.cte-rpg-nav-btn').on('click', '.cte-rpg-nav-btn', function() {
            $('.cte-rpg-nav-btn').removeClass('active');
            $(this).addClass('active');
            const subView = $(this).data('subview');
            window.CTEMap.renderRPGContent(subView);
        });
    }

    function fixPanelPosition() {
        const panel = document.getElementById('cte-map-panel');
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
                const panel = document.getElementById('cte-map-panel');
                if (panel && panel.style.display !== 'none') {
                    fixPanelPosition();
                }
            }, 100);
        });
        window.addEventListener('orientationchange', () => setTimeout(fixPanelPosition, 300));
    }

    async function initializeExtension() {
        console.log("[CTE Map] Initializing Extension...");

        // 彻底清理旧的 DOM 元素，防止 ID 冲突
        document.querySelectorAll('#cte-map-panel, #cte-toggle-btn').forEach(el => el.remove());
        document.querySelectorAll('link[href*="CTE_Map/style.css"]').forEach(el => el.remove());

        const timestamp = Date.now();
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `${extensionPath}/style.css?v=${timestamp}`;
        document.head.appendChild(link);

        const panelHTML = `
            <div id="cte-toggle-btn" title="点击打开 / 长按拖动" 
                 style="position:fixed; top:130px; left:10px; z-index:9000; width:40px; height:40px; background:#b38b59; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:move; box-shadow:0 4px 10px rgba(0,0,0,0.3); color:#fff; font-size:20px;">
                🗺️
            </div>
            <div id="cte-map-panel" style="display:none;">
                <div id="cte-drag-handle">
                    <span>CTE 偶像地图系统</span>
                    <div class="cte-nav-group">
                        <button class="cte-nav-btn active" onclick="window.CTEMap.switchView('map', this)">地图</button>
                        <button class="cte-nav-btn" onclick="window.CTEMap.switchView('schedule', this)">行程</button>
                        <button class="cte-nav-btn" onclick="window.CTEMap.switchView('manager', this)">事务所</button>
                        <button class="cte-nav-btn" style="color: #FF69B4;" onclick="window.CTEMap.switchView('heartbeat', this)">♥</button>
                        <span id="cte-close-btn" style="cursor:pointer; margin-left:10px;">❌</span>
                    </div>
                </div>
                <div id="cte-content-area" style="position:relative; height:calc(100% - 40px);">Loading Map...</div>
            </div>
        `;
        $('body').append(panelHTML);

        try {
            const response = await fetch(`${extensionPath}/map.html?v=${timestamp}`);
            if (!response.ok) throw new Error("Map file not found");
            const htmlContent = await response.text();
            
            // 注入 HTML 内容
            const contentArea = document.getElementById('cte-content-area');
            if(contentArea) contentArea.innerHTML = htmlContent;
            
            // 初始化各个模块
            bindMapEvents();
            loadSavedPositions();
            loadSavedBg();
            window.CTEMap.initNationalMap();
            window.CTEMap.loadSavedNationalBg();
            
            bindRPGEvents();

        } catch (e) {
            console.error("[CTE Map] Initialization Error:", e);
            const contentArea = document.getElementById('cte-content-area');
            if(contentArea) contentArea.innerHTML = `<p style="padding:20px; color:white;">无法加载地图文件 (map.html)。<br>错误信息: ${e.message}</p>`;
        }

        // 绑定主面板事件
        let isIconDragging = false;
        $('#cte-toggle-btn').off('click').on('click', (e) => {
            if (isIconDragging) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }

            const panel = $('#cte-map-panel');
            if (panel.is(':visible')) {
                panel.fadeOut();
            } else {
                window.CTEMap.scanForRPGStats();
                panel.fadeIn(200, function() {
                    fixPanelPosition();
                    // 检查当前视图并刷新
                    if ($('#cte-view-schedule').hasClass('active')) window.CTEMap.refreshSchedule();
                    if ($('#cte-view-manager').hasClass('active')) {
                        window.CTEMap.readStatsFromMVU();
                        window.CTEMap.readCharacterStatsFromChat();
                        window.CTEMap.renderRPGContent('dashboard');
                    }
                    if ($('#cte-view-heartbeat').hasClass('active')) window.CTEMap.Heartbeat.renderGrid();
                });
            }
        });
        
        $('#cte-close-btn').off('click').on('click', () => $('#cte-map-panel').fadeOut());

        if ($.fn.draggable) {
            $('#cte-map-panel').draggable({ 
                handle: '#cte-drag-handle',
                containment: 'window'
            });

            $('#cte-toggle-btn').draggable({
                containment: 'window', 
                start: function() { isIconDragging = true; },
                stop: function() { setTimeout(() => { isIconDragging = false; }, 50); }
            });
        }

        setupResizeListener();
    }

    // ==========================================
    // 4. 其他辅助功能 (保持原有功能，仅确保全局可访问)
    // ==========================================

    function loadSavedNationalPositions() {
        const data = localStorage.getItem('cte_national_map_positions');
        return data ? JSON.parse(data) : {};
    }

    function saveNationalPosition(id, left, top) {
        let data = loadSavedNationalPositions();
        data[id] = { left, top };
        localStorage.setItem('cte_national_map_positions', JSON.stringify(data));
    }

    window.CTEMap.initNationalMap = function() {
        const mapContainer = document.querySelector('#cte-map-panel #national-game-map');
        const infoContent = document.querySelector('#cte-map-panel #national-info-content');
        
        if (!mapContainer || !infoContent) return;

        mapContainer.innerHTML = '';
        const savedPositions = loadSavedNationalPositions();

        window.CTEMap.nationalCities.forEach(city => {
            const cityEl = document.createElement('div');
            cityEl.className = 'national-city';
            const elementId = `national-city-${city.id}`;
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
                             window.CTEMap.switchView('map');
                        } else {
                            let html = `<h2><i class="fa-solid fa-scroll"></i> ${city.name} - 情报简报</h2><ul><li>${city.info}</li></ul>`;
                            html += `<div style="text-align:center; margin-top:15px; border-top:1px dashed #666; padding-top:10px;"><button class="cte-btn" onclick="window.CTEMap.openTravelMenu('${city.name}')" style="width:80%; padding:8px; background:#b38b59; color:#1a1a1a; font-weight:bold; font-size:14px;">🚀 前往 ${city.name}</button></div>`;
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

    window.CTEMap.changeNationalBackground = function(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const bgUrl = e.target.result;
                $('#national-game-map').css('background-image', `url(${bgUrl})`);
                localStorage.setItem('cte_national_map_bg', bgUrl);
            }
            reader.readAsDataURL(input.files[0]);
        }
    };

    window.CTEMap.resetNationalBackground = function() {
        $('#national-game-map').css('background-image', `url(${DEFAULT_NATIONAL_BG})`);
        localStorage.setItem('cte_national_map_bg', DEFAULT_NATIONAL_BG);
    };

    window.CTEMap.loadSavedNationalBg = function() {
        const saved = localStorage.getItem('cte_national_map_bg');
        const bg = saved || DEFAULT_NATIONAL_BG;
        $('#national-game-map').css('background-image', `url(${bg})`);
    };

    window.CTEMap.refreshSchedule = async function() {
        const statusEl = $('#cte-schedule-status');
        const container = $('#cte-timeline-container');
        statusEl.text('正在读取最新状态...');
        
        if (!stContext) {
            statusEl.text('错误：无法连接到 SillyTavern 上下文。');
            return;
        }

        const chat = stContext.chat || [];
        let foundContent = null;
        for (let i = chat.length - 1; i >= 0; i--) {
            const msg = chat[i].mes;
            const match = msg.match(/<status_top>([\s\S]*?)<\/status_top>/i);
            if (match) {
                foundContent = match[1].trim();
                break;
            }
        }

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
        const items = window.CTEMap.parseSchedule(scheduleContent);
        window.CTEMap.renderSchedule(items);
    };

    window.CTEMap.parseSchedule = function(text) {
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

    window.CTEMap.renderSchedule = function(items) {
        const container = $('#cte-timeline-container');
        container.empty();
        if (items.length === 0) {
            container.html('<p style="text-align:center; color:#666;">行程单为空。</p>');
            return;
        }
        items.forEach(item => {
            let displayContent = item.content;
            let tagsHtml = '';
            const tagMatch = displayContent.match(/[\(\[\（](.*?)[\)\]\）]/);
            if (tagMatch) tagsHtml = `<span class="cte-tag">${tagMatch[1]}</span>`;

            const html = `
                <div class="cte-timeline-item">
                    <div class="cte-timeline-time">${item.time}</div>
                    <div class="cte-timeline-content">
                        <div class="cte-schedule-title"><span>${displayContent}</span>${tagsHtml}</div>
                        <button class="cte-exec-btn" onclick="window.CTEMap.openParticipantSelection('${item.raw.replace(/'/g, "\\'").replace(/"/g, "&quot;")}')">⚡ 执行行程</button>
                    </div>
                </div>`;
            container.append(html);
        });
    };

    window.CTEMap.openParticipantSelection = function(itemText) {
        window.CTEMap.isSelectingForSchedule = false; 
        window.CTEMap.currentScheduleItem = itemText;
        
        // 使用更具体的原生选择器，确保在面板内部查找
        const listContainer = document.querySelector('#cte-map-panel #cte-participant-list');
        if (!listContainer) {
            console.error("[CTE Map] Participant list container not found.");
            return;
        }
        
        listContainer.innerHTML = '';
        
        window.CTEMap.availableParticipants.forEach((name, index) => {
            const id = `participant-${index}`;
            const checked = name === '{{user}}' ? 'checked' : '';
            const displayLabel = name === '{{user}}' ? '你 (User)' : name;
            
            const div = document.createElement('div');
            div.className = 'participant-item';
            div.innerHTML = `<input type="checkbox" id="${id}" value="${name}" class="cte-checkbox" ${checked}><label for="${id}">${displayLabel}</label>`;
            
            // 点击 div 也能触发 checkbox
            div.onclick = function(e) {
                if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'LABEL') {
                    const cb = this.querySelector('input');
                    if(cb) cb.checked = !cb.checked;
                }
            };
            
            listContainer.appendChild(div);
        });
        
        const customInput = document.querySelector('#cte-map-panel #participant-custom');
        if (customInput) customInput.value = '';
        
        const overlay = document.querySelector('#cte-map-panel #cte-overlay');
        const popup = document.querySelector('#cte-map-panel #cte-participant-popup');
        
        if(overlay) overlay.style.display = 'block';
        if(popup) popup.style.display = 'block';
    };

    window.CTEMap.proceedToLocationSelection = function() {
        const selected = [];
        // 使用原生查询替代 jQuery
        const checkboxes = document.querySelectorAll('#cte-map-panel #cte-participant-list .cte-checkbox:checked');
        checkboxes.forEach(cb => selected.push(cb.value));
        
        const customInput = document.querySelector('#cte-map-panel #participant-custom');
        const custom = customInput ? customInput.value.trim() : '';
        if (custom) selected.push(custom);
        
        if (selected.length === 0) { alert("请至少选择一位参与者！"); return; }

        window.CTEMap.closeAllPopups();
        window.CTEMap.tempScheduleParticipants = selected;
        window.CTEMap.isSelectingForSchedule = true; 
        window.CTEMap.switchView('map');
    };

    window.CTEMap.openTravelMenu = function(destination) {
        window.CTEMap.currentDestination = destination;
        window.CTEMap.tempNPCState = { enabled: false, content: '' };
        const defaultNPC = window.CTEMap.npcDefaults[destination] || '';
        const box = $('#travel-menu-overlay');

        if (window.CTEMap.isSelectingForSchedule) {
            box.find('.travel-options').html(`
                <div style="text-align:center; color:#e0c5a1; margin-bottom:15px; font-size:14px; border-bottom:1px solid #444; padding-bottom:10px;">
                    正在执行行程：<br><span style="color:#b38b59; font-weight:bold;">${window.CTEMap.currentScheduleItem}</span>
                </div>
                <div style="margin-bottom: 15px; border-bottom: 1px solid #444; padding-bottom: 10px;">
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
                        <span style="color:#aaa; font-size:13px;">是否遇见NPC？</span>
                        <div>
                            <button id="btn-npc-yes" class="cte-btn" style="font-size:12px; padding:2px 8px; margin-right:5px; border-color:#666;" onclick="window.CTEMap.toggleNPC(true, '${defaultNPC}')">是</button>
                            <button id="btn-npc-no" class="cte-btn" style="font-size:12px; padding:2px 8px; background:#b38b59; color:#1a1a1a;" onclick="window.CTEMap.toggleNPC(false)">否</button>
                        </div>
                    </div>
                    <input type="text" id="npc-input" class="travel-input" style="display:none; font-size:13px; margin-bottom:0;" placeholder="请输入遇见的人 (例如: 粉丝)" value="${defaultNPC}">
                </div>
                <button class="cte-btn" onclick="window.CTEMap.finalizeScheduleExecution()" style="background:#b38b59; color:#1a1a1a; font-weight:bold;">✅ 确认执行</button>
                <button class="cte-btn" style="margin-top: 10px; border-color: #666; color: #888;" onclick="window.CTEMap.closeTravelMenu()">取消</button>
            `);
        } else {
            box.find('.travel-options').html(`
                <div style="margin-bottom: 15px; border-bottom: 1px solid #444; padding-bottom: 10px;">
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
                        <span style="color:#aaa; font-size:13px;">是否遇见NPC？</span>
                        <div>
                            <button id="btn-npc-yes" class="cte-btn" style="font-size:12px; padding:2px 8px; margin-right:5px; border-color:#666;" onclick="window.CTEMap.toggleNPC(true, '${defaultNPC}')">是</button>
                            <button id="btn-npc-no" class="cte-btn" style="font-size:12px; padding:2px 8px; background:#b38b59; color:#1a1a1a;" onclick="window.CTEMap.toggleNPC(false)">否</button>
                        </div>
                    </div>
                    <input type="text" id="npc-input" class="travel-input" style="display:none; font-size:13px; margin-bottom:0;" placeholder="请输入遇见的人 (例如: 粉丝)" value="${defaultNPC}">
                </div>
                <button class="cte-btn" onclick="window.CTEMap.confirmTravel(true)">👤 独自前往</button>
                <button class="cte-btn" onclick="window.CTEMap.prepareCompanionInput()">👥 和……一起前往</button>
                <button class="cte-btn" style="margin-top: 10px; border-color: #666; color: #888;" onclick="window.CTEMap.closeTravelMenu()">关闭</button>
            `);
        }
        box.css('display', 'flex');
        $('#travel-title').text(`前往 ${destination}`);
    };

    window.CTEMap.finalizeScheduleExecution = function() {
        const participants = window.CTEMap.tempScheduleParticipants.join(', ');
        const destination = window.CTEMap.currentDestination;
        const scheduleItem = window.CTEMap.currentScheduleItem;
        let npcText = '';
        const npcInput = document.getElementById('npc-input');
        if (npcInput && npcInput.style.display !== 'none') {
             const val = npcInput.value.trim();
             if (val) npcText = `，遇见了${val}`;
        }
        const text = `${participants} 前往${destination}执行行程：${scheduleItem}${npcText}。`;
        if (stContext) {
            stContext.executeSlashCommandsWithOptions(`/setinput ${text}`);
            window.CTEMap.closeAllPopups();
            window.CTEMap.isSelectingForSchedule = false;
            window.CTEMap.tempScheduleParticipants = [];
        } else {
            alert("无法连接到 SillyTavern。");
        }
    };

    window.CTEMap.toggleNPC = function(enable, defaultText) {
        const input = document.getElementById('npc-input');
        const btnYes = document.getElementById('btn-npc-yes');
        const btnNo = document.getElementById('btn-npc-no');
        window.CTEMap.tempNPCState.enabled = enable;
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

    window.CTEMap.prepareCompanionInput = function() {
        const npcInput = document.getElementById('npc-input');
        if (npcInput && window.CTEMap.tempNPCState.enabled) window.CTEMap.tempNPCState.content = npcInput.value.trim();
        window.CTEMap.showCompanionInput();
    }

    window.CTEMap.showCompanionInput = function() {
        $('#travel-menu-overlay .travel-options').html(`
            <p style="color: #888; margin: 0 0 10px 0;">和谁一起去？</p>
            <input type="text" id="companion-name" class="travel-input" placeholder="输入角色姓名">
            <button class="cte-btn" onclick="window.CTEMap.validateAndShowActivities()">🤝 一起前往</button>
            <button class="cte-btn" style="margin-top: 10px; border-color: #666; color: #888;" onclick="window.CTEMap.openTravelMenu('${window.CTEMap.currentDestination}')">返回</button>
        `);
    };

    window.CTEMap.validateAndShowActivities = function() {
        const name = $('#companion-name').val();
        if (!name) return alert("请输入姓名");
        window.CTEMap.currentCompanion = name;
        window.CTEMap.showActivityMenu();
    };

    window.CTEMap.showActivityMenu = function() {
        const activities = ['训练', '开会', '购物', '闲逛', '吃饭', '喝酒', '约会', '做爱', '运动', '直播', '拍摄节目', '接受媒体采访'];
        let buttonsHtml = activities.map(act => `<button class="cte-btn" style="margin: 3px; min-width: 60px; font-size: 13px;" onclick="window.CTEMap.finalizeTravel('${act}')">${act}</button>`).join('');

        $('#travel-menu-overlay .travel-options').html(`
            <p style="color: #e0c5a1; margin: 0 0 10px 0;">去做什么？</p>
            <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:4px; margin-bottom:15px; max-height: 200px; overflow-y: auto;">${buttonsHtml}</div>
            <div style="border-top: 1px solid #444; padding-top: 10px; width: 100%;">
                <input type="text" id="custom-activity" class="travel-input" placeholder="自定义活动..." style="margin-bottom: 8px;">
                <button class="cte-btn" onclick="window.CTEMap.finalizeTravel(null)">🚀 确认出发</button>
            </div>
            <button class="cte-btn" style="margin-top: 10px; border-color: #666; color: #888; font-size: 12px; padding: 4px 10px;" onclick="window.CTEMap.showCompanionInput()">返回上一步</button>
        `);
    };

    window.CTEMap.closeTravelMenu = function(shouldReset = true) {
        $('#travel-menu-overlay').hide();
        if (shouldReset && window.CTEMap.isSelectingForSchedule) {
            window.CTEMap.isSelectingForSchedule = false;
            window.CTEMap.tempScheduleParticipants = [];
        }
    };

    window.CTEMap.goToCustomDestination = function() {
        const val = $('#custom-destination-input').val();
        if (val) {
            window.CTEMap.closeAllPopups();
            window.CTEMap.openTravelMenu(val);
        } else {
            alert('请输入地点名称');
        }
    };

    window.CTEMap.confirmTravel = function(isAlone) {
        const dest = window.CTEMap.currentDestination;
        let npcText = '';
        const npcInput = document.getElementById('npc-input');
        if (npcInput && window.CTEMap.tempNPCState.enabled) {
             const val = npcInput.value.trim();
             if (val) npcText = `，遇见了${val}`;
        }
        if (isAlone) {
            let text = `{{user}} 决定独自前往${dest}${npcText}。`;
            if (stContext) {
                stContext.executeSlashCommandsWithOptions(`/setinput ${text}`);
                window.CTEMap.closeAllPopups();
            }
        }
    };

    window.CTEMap.finalizeTravel = function(activity) {
        const dest = window.CTEMap.currentDestination;
        let finalActivity = activity;
        if (!finalActivity) finalActivity = $('#custom-activity').val();
        if (!finalActivity) return alert("请选择或输入活动内容");

        const name = window.CTEMap.currentCompanion;
        let npcText = '';
        if (window.CTEMap.tempNPCState.enabled && window.CTEMap.tempNPCState.content) {
            npcText = `，期间遇见了${window.CTEMap.tempNPCState.content}`;
        }
        const text = `{{user}} 邀请 ${name} 一起前往${dest}，${finalActivity}${npcText}。`;
        if (stContext) {
            stContext.executeSlashCommandsWithOptions(`/setinput ${text}`);
            window.CTEMap.closeAllPopups();
        }
    };

    window.CTEMap.openSubMenu = function(title, items) {
        const overlay = document.getElementById('interior-sub-menu');
        const titleEl = document.getElementById('sub-menu-title');
        const contentEl = document.getElementById('sub-menu-content');
        titleEl.textContent = title;
        contentEl.innerHTML = '';
        items.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'sub-item-btn';
            btn.textContent = item;
            btn.onclick = () => window.CTEMap.openThirdLevelMenu(item, title, items);
            contentEl.appendChild(btn);
        });
        overlay.style.display = 'flex';
    };

    window.CTEMap.closeSubMenu = function() { $('#interior-sub-menu').hide(); };

    window.CTEMap.openThirdLevelMenu = function(roomName, floorTitle, floorItems) {
        const titleEl = document.getElementById('sub-menu-title');
        const contentEl = document.getElementById('sub-menu-content');
        titleEl.textContent = roomName;
        const desc = window.CTEMap.roomDetails[roomName] || "暂无详细介绍。";
        const profile = window.CTEMap.characterProfiles[roomName];
        let contentHTML = '';
        
        if (profile) {
            if (roomName === '你') {
                const savedAvatar = localStorage.getItem('cte_user_avatar');
                const avatarSrc = savedAvatar || '';
                const hasAvatar = avatarSrc !== '';
                
                contentHTML = `
                    <div class="character-room-detail">
                        <div class="character-portrait user-portrait ${hasAvatar ? '' : 'no-avatar'}">
                            ${hasAvatar 
                                ? `<img src="${avatarSrc}" alt="你" class="character-image" id="user-avatar-img">` 
                                : `<div class="avatar-placeholder" id="user-avatar-placeholder"><span class="placeholder-icon">👤</span><span class="placeholder-text">点击上传头像</span></div>`
                            }
                        </div>
                        <div class="avatar-upload-section">
                            <button class="cte-btn avatar-upload-btn" onclick="document.getElementById('user-avatar-upload').click()">📷 ${hasAvatar ? '更换头像' : '上传头像'}</button>
                            <input type="file" id="user-avatar-upload" accept="image/*" style="display:none;" onchange="window.CTEMap.uploadUserAvatar(this)">
                            ${hasAvatar ? `<button class="cte-btn avatar-delete-btn" onclick="window.CTEMap.deleteUserAvatar()">🗑️ 删除头像</button>` : ''}
                        </div>
                        <div class="character-info">
                            <div class="info-row"><span class="info-label">姓名</span><span class="info-value">你</span></div>
                            <div class="info-row"><span class="info-label">年龄</span><span class="info-value">${profile.age}</span></div>
                            <div class="info-row"><span class="info-label">身份</span><span class="info-value">${profile.role}</span></div>
                            <div class="info-row"><span class="info-label">性格</span><span class="info-value">${profile.personality}</span></div>
                        </div>
                        <div class="room-description"><p>${desc}</p></div>
                        <div class="action-buttons"><button class="cte-btn" onclick="window.CTEMap.openTravelMenu('你的房间')">🚀 前往</button><button class="sub-item-btn" id="temp-back-btn">[ < 返回上一级 ]</button></div>
                    </div>`;
            } else {
                contentHTML = `
                    <div class="character-room-detail">
                        <div class="character-portrait"><img src="${profile.image}" alt="${roomName}" class="character-image"></div>
                        <div class="character-info">
                            <div class="info-row"><span class="info-label">姓名</span><span class="info-value">${roomName}</span></div>
                            <div class="info-row"><span class="info-label">年龄</span><span class="info-value">${profile.age}岁</span></div>
                            <div class="info-row"><span class="info-label">身份</span><span class="info-value">${profile.role}</span></div>
                            <div class="info-row"><span class="info-label">性格</span><span class="info-value">${profile.personality}</span></div>
                        </div>
                        <div class="room-description"><p>${desc}</p></div>
                        <div class="action-buttons"><button class="cte-btn" onclick="window.CTEMap.openTravelMenu('${roomName}的房间')">🚀 前往</button><button class="sub-item-btn" id="temp-back-btn">[ < 返回上一级 ]</button></div>
                    </div>`;
            }
        } else {
            contentHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; gap: 15px; width: 100%;">
                    <p style="text-align:justify; font-size:14px; line-height:1.6;">${desc}</p>
                    <button class="cte-btn" onclick="window.CTEMap.openTravelMenu('${roomName}')">🚀 前往</button>
                    <button class="sub-item-btn" id="temp-back-btn">[ < 返回上一级 ]</button>
                </div>`;
        }
        contentEl.innerHTML = contentHTML;
        document.getElementById('temp-back-btn').onclick = () => window.CTEMap.openSubMenu(floorTitle, floorItems);
    };

    window.CTEMap.uploadUserAvatar = function(input) {
        if (input.files && input.files[0]) {
            const file = input.files[0];
            if (file.size > 2 * 1024 * 1024) { alert('图片大小不能超过2MB，请选择较小的图片'); return; }
            const reader = new FileReader();
            reader.onload = function(e) {
                localStorage.setItem('cte_user_avatar', e.target.result);
                window.CTEMap.openThirdLevelMenu('你', '五楼：私人宿舍区', ['秦述', '司洛', '鹿言', '魏星泽', '周锦宁', '谌绪', '孟明赫', '亓谢', '魏月华', '桑洛凡', '你', '公共书房/阅览区']);
            };
            reader.readAsDataURL(file);
        }
    };

    window.CTEMap.deleteUserAvatar = function() {
        if (confirm('确定要删除头像吗？')) {
            localStorage.removeItem('cte_user_avatar');
            window.CTEMap.openThirdLevelMenu('你', '五楼：私人宿舍区', ['秦述', '司洛', '鹿言', '魏星泽', '周锦宁', '谌绪', '孟明赫', '亓谢', '魏月华', '桑洛凡', '你', '公共书房/阅览区']);
        }
    };

    window.CTEMap.openRooftopMenu = function() {
        window.CTEMap.openSubMenu('天台花园酒吧', []);
        const contentEl = document.getElementById('sub-menu-content');
        contentEl.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 15px; width: 100%;">
                <p style="text-align:justify; font-size:14px; line-height:1.6;">
                    种植着四季花草，设有舒适的露天沙发、吧台和烧烤架，可以远眺京港的夜景，是成员们聚会放松的绝佳地点。
                </p>
                <button class="cte-btn" onclick="window.CTEMap.openTravelMenu('天台花园酒吧')">🚀 前往</button>
            </div>`;
    };

    function bindMapEvents() {
        const mapContainer = document.getElementById('cte-map-container');
        if (!mapContainer) return;
        const locations = mapContainer.querySelectorAll('.location');
        
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
                        if (popupId) window.CTEMap.showPopup(popupId);
                    } else {
                        savePosition(elm.id, elm.style.left, elm.style.top);
                    }
                };
            };
        });
    }

    function savePosition(id, left, top) {
        let data = localStorage.getItem('cte_map_positions');
        data = data ? JSON.parse(data) : {};
        data[id] = { left, top };
        localStorage.setItem('cte_map_positions', JSON.stringify(data));
    }

    function loadSavedPositions() {
        const data = JSON.parse(localStorage.getItem('cte_map_positions'));
        if (!data) return;
        for (const [id, pos] of Object.entries(data)) {
            const el = document.getElementById(id);
            if (el) { el.style.left = pos.left; el.style.top = pos.top; }
        }
    }

    function loadSavedBg() {
        const bg = localStorage.getItem('cte_map_bg');
        if (bg) document.getElementById('cte-map-container').style.backgroundImage = `url(${bg})`;
    }

    window.CTEMap.changeBackground = function(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('cte-map-container').style.backgroundImage = `url(${e.target.result})`;
                localStorage.setItem('cte_map_bg', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    };

    window.CTEMap.showPopup = function(id) {
        if (id === 'dorm-detail-popup') window.CTEMap.closeAllPopups();
        const popup = document.querySelector(`#cte-map-panel #${id}`);
        const overlay = document.querySelector(`#cte-map-panel #cte-overlay`);
        if (popup) {
            if (overlay) overlay.style.display = 'block';
            popup.style.display = 'block';
            popup.scrollTop = 0;
        }
    };

    window.CTEMap.closeAllPopups = function() {
        const isTravelMenuVisible = $('#travel-menu-overlay').is(':visible');
        $('#cte-map-panel #cte-overlay').hide();
        $('#cte-map-panel .cte-popup').hide();
        window.CTEMap.closeSubMenu();
        window.CTEMap.Heartbeat.closeModal();
        window.CTEMap.closeTravelMenu(isTravelMenuVisible);
    };

})(); // End IIFE
