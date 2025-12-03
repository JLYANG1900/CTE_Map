const extensionName = "CTE_Map";
const extensionPath = `scripts/extensions/third-party/${extensionName}`;

let stContext = null;
// 默认国家地图背景
const DEFAULT_NATIONAL_BG = "https://files.catbox.moe/8z3pnp.png";

// 定义全局命名空间
window.CTEMap = {
    currentDestination: '',
    currentCompanion: '', 
    currentScheduleItem: '', 
    
    // 标记是否处于“行程执行-选择地点”模式
    isSelectingForSchedule: false,
    // 暂存行程参与者
    tempScheduleParticipants: [],

    // 暂存NPC设置状态
    tempNPCState: { enabled: false, content: '' },
    // 预定义的可选角色列表
    availableParticipants: ['{{user}}', '秦述', '司洛', '鹿言', '魏星泽', '周锦宁', '谌绪', '孟明赫', '亓谢', '魏月华', '桑洛凡'],
    
    // 地点对应的默认NPC配置
    npcDefaults: {
        '机场': '粉丝、工作人员、其他团队成员',
        '京港电视台': '粉丝、工作人员、其他团队成员',
        '私人会所': '社交名流'
    },

    // 国家地图城市数据
    nationalCities: [
        { id: 'jinggang', name: '京港', icon: 'fa-landmark-dome', top: '20%', left: '70%', isReturn: true, info: '<strong><i class="fa-solid fa-crown"></i> 权力漩涡:</strong> 首都，政治中心。远洋、万城、隆桑、盛华四大集团总部所在地。国家的权力根基，也是你商业帝国的指挥中心。目前，东区深水泊位项目已解决，城市基建将迎来新一轮扩张。' },
        { id: 'langjing', name: '琅京', icon: 'fa-gem', top: '40%', left: '80%', info: '<strong><i class="fa-solid fa-coins"></i> 豪门金库:</strong> 金融与地产重镇，钰明珠宝总部。老钱家族盘踞，是周锦宁母亲家族势力的核心。近期慈善音乐节在此举办，CTE的声望达到新高。' },
        { id: 'shenzhou', name: '深州', icon: 'fa-microchip', top: '80%', left: '75%', info: '<strong><i class="fa-solid fa-chart-line"></i> 科技前沿:</strong> 沿海经济特区，高新科技产业发达。你在此地成功收服陈默，为远洋集团的供应链增添了重要一环。即将到来的“潮音盛典”将是CTE展示创新舞台的绝佳机会。' },
        { id: 'haizhou', name: '海洲', icon: 'fa-anchor', top: '75%', left: '55%', info: '<strong><i class="fa-solid fa-skull-crossbones"></i> 灰色地带:</strong> 港口城市，地下势力活跃。洪兴社陈伯在此拥有绝对话语权。此地是‘天罗地网’计划的关键棋子，也是海外非法资金流入的重要通道。' },
        { id: 'taihe', name: '台河', icon: 'fa-book-open', top: '30%', left: '40%', info: '<strong><i class="fa-solid fa-graduation-cap"></i> 学术之城:</strong> 历史名城，名校云集。秦述的故乡，代表着他与之决裂的传统学术家庭。这里的氛围与京港的浮华形成鲜明对比。' },
        { id: 'huashao', name: '化邵', icon: 'fa-industry', top: '50%', left: '20%', info: '<strong><i class="fa-solid fa-wrench"></i> 工业心脏:</strong> 重工业城市，工人阶层为主。代表着国家经济的基石，也是政策变动最敏感的区域之一。远洋集团的某些大宗商品业务与此地紧密相关。' },
        { id: 'yucheng', name: '玉城', icon: 'fa-martini-glass-citrus', top: '65%', left: '35%', info: '<strong><i class="fa-solid fa-sun"></i> 度假天堂:</strong> 风景优美的旅游胜地，富豪的休闲后花园。这里是资本进行非正式交易和人脉巩固的温床。' },
    ],

    // 角色资料数据
    characterProfiles: {
        '魏月华': {
            image: 'https://files.catbox.moe/auqnct.jpeg',
            age: 27,
            role: '万城娱乐CEO、CTE男团缔造者',
            personality: '严肃、冷酷、认真、严谨'
        },
        '秦述': {
            image: 'https://files.catbox.moe/c2khbl.jpeg',
            age: 24,
            role: 'CTE男团队长、主舞担当、艺名Qshot',
            personality: '沉默、清冷、内敛'
        },
        '司洛': {
            image: 'https://files.catbox.moe/pohz52.jpeg',
            age: 24,
            role: 'CTE男团全能ACE、主舞担当、艺名SOLO',
            personality: '慵懒、随性、玩世不恭'
        },
        '鹿言': {
            image: 'https://files.catbox.moe/parliq.jpeg',
            age: 23,
            role: 'CTE男团主唱担当、艺名DEER',
            personality: '温柔、谦逊、善良'
        },
        '魏星泽': {
            image: 'https://files.catbox.moe/syo0ze.jpeg',
            age: 20,
            role: 'CTE男团舞蹈担当、气氛担当、艺名STARS',
            personality: '开朗、感性、大大咧咧'
        },
        '周锦宁': {
            image: 'https://files.catbox.moe/1loxsn.jpeg',
            age: 20,
            role: 'CTE男团Rapper、门面担当、艺名JinNa',
            personality: '傲娇、矜贵、毒舌'
        },
        '谌绪': {
            image: 'https://files.catbox.moe/9tnuva.png',
            age: 18,
            role: 'CTE男团主唱担当、忙内、艺名Chase',
            personality: '腹黑、恶劣、隐藏病娇'
        },
        '孟明赫': {
            image: 'https://files.catbox.moe/m446ro.jpeg',
            age: 20,
            role: 'CTE男团Rapper、艺名Hades',
            personality: '阴郁、厌世、内向、大胆叛逆'
        },
        '亓谢': {
            image: 'https://files.catbox.moe/ev2g1l.png',
            age: 18,
            role: 'CTE男团舞蹈担当、副Rapper、艺名KNIFE',
            personality: '疯批、天才、毒舌、直白'
        },
        '桑洛凡': {
            image: 'https://files.catbox.moe/syudzu.png',
            age: 27,
            role: '传奇Solo爱豆、CTE精神支柱、艺名Lovan',
            personality: '慵懒随性、桀骜不驯、腹黑'
        },
        '你': {
            image: '', // 用户自定义头像，默认为空
            age: '?',
            role: 'CTE宿舍成员',
            personality: '由你定义'
        }
    },
    roomDetails: {
        '前院与玄关': '设有小型日式枯山水庭院与智能安防通道，风格低调奢华。',
        '客厅/公共休息区': '挑高设计，拥有整面墙的落地窗，配有超大尺寸的模块化沙发、顶级家庭影院系统和复古黑胶唱片机，是成员们放松、看电影或聊天的地方。',
        '开放式厨房与餐厅': '拥有设备齐全的专业级中西厨，长条形的大理石餐桌足够所有人一起用餐。鹿言经常在这里为成员们准备餐点。',
        '储藏室与洗衣房': '分门别类地存放着各种生活用品和演出服装。',
        '后院与露天泳池': '拥有精心打理的草坪、烧烤区和一个恒温露天泳池，是举办小型派对或夏日放松的好去处。耶耶（萨摩耶）最喜欢在草坪上打滚。',
        '周锦宁个人工作室': '为对创作有需求的成员配备的独立空间，内部有顶级的音乐制作设备和隔音设计。',
        '孟明赫个人工作室': '为对创作有需求的成员配备的独立空间，内部有顶级的音乐制作设备和隔音设计。',
        '乐器练习室': '存放着钢琴、吉他、架子鼓等多种乐器，供成员练习或寻找灵感。',
        '游戏娱乐室': '配备了最新款的游戏主机、电竞椅和高清曲面屏，是司洛、亓谢等人主要的娱乐场所。',
        '私人会客厅': '用于接待少数的亲密朋友或家人，风格更为温馨私密。',
        '收藏室': '专门用来存放粉丝赠送的珍贵礼物和成员们获得的奖杯、奖牌。',
        '主舞蹈室': '面积巨大，三面环绕着顶天立地的镜墙，配备了专业的音响和灯光系统，是CTE日常排练和练习舞蹈的核心场所。',
        '声乐录音棚': '拥有录音室和控制室，设备达到行业顶尖标准，供鹿言、谌绪等人录制歌曲demo或练习发声。',
        '造型与衣帽间': '一个巨大的衣帽间，整齐地挂满了成员们的私服、演出服以及各大品牌的赞助衣物。旁边连接着一个配有专业化妆镜和灯光的造型室。',
        '成员休息室': '紧邻练习区，放着舒适的懒人沙发和零食饮料，供成员在练习间隙短暂休息。',
        '会议室': '配备投影仪、大会议桌等设施的专业会议室。',
        '健身房': '空间宽敞，器材种类齐全，从有氧到力量器械应有尽有，是秦述、桑洛凡等人保持身材的必备场所。',
        '瑜伽与冥想室': '环境安静，铺着柔软的地板，适合进行拉伸、瑜伽或冥想，帮助成员缓解压力。',
        '水疗与按摩室': '设有大型按摩浴缸和专业的理疗床，可供成员在结束一天高强度工作后进行身体放松与恢复。',
        '健康管理室': '配备了基础医疗用品和专业的身体数据监测设备，定期会有营养师和队医上门服务。',
        '秦述': '每个成员都拥有独立的卧室套间，风格根据个人喜好进行装修，均配备了独立的豪华卫浴和步入式衣帽间，保证了绝对的私密性。',
        '司洛': '每个成员都拥有独立的卧室套间，风格根据个人喜好进行装修，均配备了独立的豪华卫浴和步入式衣帽间，保证了绝对的私密性。',
        '鹿言': '每个成员都拥有独立的卧室套间，风格根据个人喜好进行装修，均配备了独立的豪华卫浴和步入式衣帽间，保证了绝对的私密性。',
        '魏星泽': '每个成员都拥有独立的卧室套间，风格根据个人喜好进行装修，均配备了独立的豪华卫浴和步入式衣帽间，保证了绝对的私密性。',
        '周锦宁': '每个成员都拥有独立的卧室套间，风格根据个人喜好进行装修，均配备了独立的豪华卫浴和步入式衣帽间，保证了绝对的私密性。',
        '谌绪': '每个成员都拥有独立的卧室套间，风格根据个人喜好进行装修，均配备了独立的豪华卫浴和步入式衣帽间，保证了绝对的私密性。',
        '孟明赫': '每个成员都拥有独立的卧室套间，风格根据个人喜好进行装修，均配备了独立的豪华卫浴和步入式衣帽间，保证了绝对的私密性。',
        '亓谢': '每个成员都拥有独立的卧室套间，风格根据个人喜好进行装修，均配备了独立的豪华卫浴和步入式衣帽间，保证了绝对的私密性。',
        '魏月华': '每个成员都拥有独立的卧室套间，风格根据个人喜好进行装修，均配备了独立的豪华卫浴和步入式衣帽间，保证了绝对的私密性。',
        '桑洛凡': '每个成员都拥有独立的卧室套间，风格根据个人喜好进行装修，均配备了独立的豪华卫浴和步入式衣帽间，保证了绝对的私密性。',
        '你': '每个成员都拥有独立的卧室套间，风格根据个人喜好进行装修，均配备了独立的豪华卫浴和步入式衣帽间，保证了绝对的私密性。',
        '公共书房/阅览区': '位于楼层中间，有一个巨大的书架，藏书丰富，供成员阅读或安静地处理个人事务。'
    }
};

const initInterval = setInterval(() => {
    if (window.SillyTavern && window.SillyTavern.getContext && window.jQuery) {
        clearInterval(initInterval);
        stContext = window.SillyTavern.getContext();
        initializeExtension();
    }
}, 500);

/**
 * 动态计算并设置面板位置
 */
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
        
        if (parseFloat(panel.style.top) < 10) {
            panel.style.top = '10px';
        }
        
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

    window.addEventListener('orientationchange', () => {
        setTimeout(fixPanelPosition, 300);
    });
}

async function initializeExtension() {
    console.log("[CTE Map] Initializing...");

    $('#cte-map-panel').remove();
    $('#cte-toggle-btn').remove();
    $('link[href*="CTE_Map/style.css"]').remove();
    $('link[href*="font-awesome"]').remove();

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${extensionPath}/style.css`;
    document.head.appendChild(link);

    const faLink = document.createElement('link');
    faLink.rel = 'stylesheet';
    faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
    document.head.appendChild(faLink);

    const panelHTML = `
        <div id="cte-toggle-btn" title="点击打开 / 长按拖动" 
             style="position:fixed; top:130px; left:10px; z-index:9000; width:40px; height:40px; background:#b38b59; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:move; box-shadow:0 4px 10px rgba(0,0,0,0.3); color:#fff; font-size:20px;">
            🗺️
        </div>
        <div id="cte-map-panel">
            <div id="cte-drag-handle">
                <span>CTE 档案地图</span>
                <div class="cte-nav-group">
                    <button class="cte-nav-btn active" onclick="window.CTEMap.switchView('map', this)">地图</button>
                    <button class="cte-nav-btn" onclick="window.CTEMap.switchView('schedule', this)">行程表</button>
                    <span id="cte-close-btn" style="cursor:pointer; margin-left:10px;">❌</span>
                </div>
            </div>
            <div id="cte-content-area">Loading Map...</div>
        </div>
    `;
    $('body').append(panelHTML);

    try {
        const response = await fetch(`${extensionPath}/map.html`);
        if (!response.ok) throw new Error("Map file not found");
        const htmlContent = await response.text();
        $('#cte-content-area').html(htmlContent);
        
        bindMapEvents();
        loadSavedPositions();
        loadSavedBg();
        // 初始化国家地图与背景
        window.CTEMap.initNationalMap();
        window.CTEMap.loadSavedNationalBg();

    } catch (e) {
        console.error("[CTE Map] Error:", e);
        $('#cte-content-area').html(`<p style="padding:20px; color:white;">无法加载地图文件 (map.html)。<br>请检查控制台获取详细错误。</p>`);
    }

    let isIconDragging = false;

    $('#cte-toggle-btn').on('click', (e) => {
        if (isIconDragging) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        const panel = $('#cte-map-panel');
        if (panel.is(':visible')) {
            panel.fadeOut();
        } else {
            panel.fadeIn(200, function() {
                fixPanelPosition();
                if ($('#cte-view-schedule').is(':visible')) {
                    window.CTEMap.refreshSchedule();
                }
            });
        }
    });
    
    $('#cte-close-btn').on('click', () => $('#cte-map-panel').fadeOut());

    if ($.fn.draggable) {
        $('#cte-map-panel').draggable({ 
            handle: '#cte-drag-handle',
            containment: 'window'
        });

        $('#cte-toggle-btn').draggable({
            containment: 'window', 
            start: function() {
                isIconDragging = true; 
            },
            stop: function() {
                setTimeout(() => {
                    isIconDragging = false;
                }, 50); 
            }
        });
    }

    setupResizeListener();
}

// [新增] 加载保存的国家地图城市位置
function loadSavedNationalPositions() {
    const data = localStorage.getItem('cte_national_map_positions');
    return data ? JSON.parse(data) : {};
}

// [新增] 保存国家地图城市位置
function saveNationalPosition(id, left, top) {
    let data = loadSavedNationalPositions();
    data[id] = { left, top };
    localStorage.setItem('cte_national_map_positions', JSON.stringify(data));
}

// 初始化国家地图 DOM (包含拖拽逻辑)
window.CTEMap.initNationalMap = function() {
    const mapContainer = document.getElementById('national-game-map');
    const infoContent = document.getElementById('national-info-content');
    
    if (!mapContainer || !infoContent) return;

    mapContainer.innerHTML = '';
    
    // 读取保存的位置
    const savedPositions = loadSavedNationalPositions();

    window.CTEMap.nationalCities.forEach(city => {
        const cityEl = document.createElement('div');
        cityEl.className = 'national-city';
        const elementId = `national-city-${city.id}`;
        cityEl.id = elementId;
        
        // 优先使用保存的位置
        if (savedPositions[elementId]) {
            cityEl.style.top = savedPositions[elementId].top;
            cityEl.style.left = savedPositions[elementId].left;
        } else {
            cityEl.style.top = city.top;
            cityEl.style.left = city.left;
        }

        cityEl.innerHTML = `<i class="fa-solid ${city.icon}"></i><span class="name">${city.name}</span>`;

        // [重点] 拖拽与点击逻辑整合
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

                let newLeft = initialLeft + dx;
                let newTop = initialTop + dy;
                
                // 边界限制
                newLeft = Math.max(0, Math.min(newLeft, mapContainer.offsetWidth));
                newTop = Math.max(0, Math.min(newTop, mapContainer.offsetHeight));

                cityEl.style.left = newLeft + 'px';
                cityEl.style.top = newTop + 'px';
            };

            document.onmouseup = function() {
                isDragging = false;
                document.onmousemove = null;
                document.onmouseup = null;

                if (!hasMoved) {
                    // 没有移动，视为点击事件
                    if (city.isReturn) {
                         window.CTEMap.switchView('map');
                    } else {
                        let html = `<h2><i class="fa-solid fa-scroll"></i> ${city.name} - 情报简报</h2><ul><li>${city.info}</li></ul>`;
                        html += `
                            <div style="text-align:center; margin-top:15px; border-top:1px dashed #666; padding-top:10px;">
                                <button class="cte-btn" onclick="window.CTEMap.openTravelMenu('${city.name}')" style="width:80%; padding:8px; background:#b38b59; color:#1a1a1a; font-weight:bold; font-size:14px;">🚀 前往 ${city.name}</button>
                            </div>
                        `;
                        infoContent.innerHTML = html;
                    }
                } else {
                    // 发生了移动，保存新位置
                    saveNationalPosition(elementId, cityEl.style.left, cityEl.style.top);
                }
            };
        };

        mapContainer.appendChild(cityEl);
    });
};

// 更换国家地图背景
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

// 恢复默认国家地图背景
window.CTEMap.resetNationalBackground = function() {
    $('#national-game-map').css('background-image', `url(${DEFAULT_NATIONAL_BG})`);
    localStorage.setItem('cte_national_map_bg', DEFAULT_NATIONAL_BG);
};

// 加载保存的国家地图背景
window.CTEMap.loadSavedNationalBg = function() {
    const saved = localStorage.getItem('cte_national_map_bg');
    const bg = saved || DEFAULT_NATIONAL_BG;
    $('#national-game-map').css('background-image', `url(${bg})`);
};


// 视图切换功能 (地图/行程表/国家地图)
window.CTEMap.switchView = function(viewName, btn) {
    $('.cte-nav-btn').removeClass('active');
    if (btn) {
        $(btn).addClass('active');
    } else {
        const btns = document.querySelectorAll('.cte-nav-btn');
        if (viewName === 'map' && btns[0]) $(btns[0]).addClass('active');
        if (viewName === 'schedule' && btns[1]) $(btns[1]).addClass('active');
    }

    $('.cte-view').removeClass('active');
    $(`#cte-view-${viewName}`).addClass('active');

    if (viewName === 'schedule') {
        window.CTEMap.refreshSchedule();
    }
};

// 从ST聊天记录中提取 status_top 并渲染行程表
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

// 解析行程文本
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

// 渲染行程时间轴
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
        if (tagMatch) {
            tagsHtml = `<span class="cte-tag">${tagMatch[1]}</span>`;
        }

        const html = `
            <div class="cte-timeline-item">
                <div class="cte-timeline-time">${item.time}</div>
                <div class="cte-timeline-content">
                    <div class="cte-schedule-title">
                        <span>${displayContent}</span>
                        ${tagsHtml}
                    </div>
                    
                    <button class="cte-exec-btn" onclick="window.CTEMap.openParticipantSelection('${item.raw.replace(/'/g, "\\'")}')">
                        ⚡ 执行行程
                    </button>
                </div>
            </div>
        `;
        container.append(html);
    });
};

// 打开参与者选择弹窗
window.CTEMap.openParticipantSelection = function(itemText) {
    window.CTEMap.isSelectingForSchedule = false; 
    window.CTEMap.currentScheduleItem = itemText;
    
    const listContainer = $('#cte-participant-list');
    listContainer.empty();
    
    window.CTEMap.availableParticipants.forEach((name, index) => {
        const id = `participant-${index}`;
        const checked = name === '{{user}}' ? 'checked' : '';
        const displayLabel = name === '{{user}}' ? '你 (User)' : name;
        
        const html = `
            <div class="participant-item">
                <input type="checkbox" id="${id}" value="${name}" class="cte-checkbox" ${checked}>
                <label for="${id}">${displayLabel}</label>
            </div>
        `;
        listContainer.append(html);
    });
    
    $('#participant-custom').val('');

    const overlay = $('#cte-overlay');
    if(overlay.length) overlay.show();
    $('#cte-participant-popup').show();
};

// 收集参与人员，并跳转到地图界面选择地点
window.CTEMap.proceedToLocationSelection = function() {
    const selected = [];
    $('.cte-checkbox:checked').each(function() {
        selected.push($(this).val());
    });
    
    const custom = $('#participant-custom').val().trim();
    if (custom) {
        selected.push(custom);
    }
    
    if (selected.length === 0) {
        alert("请至少选择一位参与者！");
        return;
    }

    window.CTEMap.closeAllPopups();

    window.CTEMap.tempScheduleParticipants = selected;
    window.CTEMap.isSelectingForSchedule = true; 

    window.CTEMap.switchView('map');
};

// [关键复用] 打开 Travel Menu
// 这里兼容了国家地图的调用逻辑：传入 destination 为城市名
window.CTEMap.openTravelMenu = function(destination) {
    window.CTEMap.currentDestination = destination;
    
    window.CTEMap.tempNPCState = { enabled: false, content: '' };
    
    const defaultNPC = window.CTEMap.npcDefaults[destination] || '';

    const box = $('#travel-menu-overlay');

    if (window.CTEMap.isSelectingForSchedule) {
        // 行程执行模式 UI
        box.find('.travel-options').html(`
            <div style="text-align:center; color:#e0c5a1; margin-bottom:15px; font-size:14px; border-bottom:1px solid #444; padding-bottom:10px;">
                正在执行行程：<br>
                <span style="color:#b38b59; font-weight:bold;">${window.CTEMap.currentScheduleItem}</span>
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
        // 普通模式 UI (包含国家地图的“前往”逻辑)
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
    // 修改标题，适应不同场景
    $('#travel-title').text(`前往 ${destination}`);
};

// 最终执行行程指令
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
        
        btnYes.style.background = '#b38b59';
        btnYes.style.color = '#1a1a1a';
        btnYes.style.borderColor = '#b38b59';
        
        btnNo.style.background = 'transparent';
        btnNo.style.color = '#e0c5a1';
        btnNo.style.borderColor = '#666';
    } else {
        input.style.display = 'none';
        
        btnNo.style.background = '#b38b59';
        btnNo.style.color = '#1a1a1a';
        btnNo.style.borderColor = '#b38b59';

        btnYes.style.background = 'transparent';
        btnYes.style.color = '#e0c5a1';
        btnYes.style.borderColor = '#666';
    }
};

window.CTEMap.prepareCompanionInput = function() {
    const npcInput = document.getElementById('npc-input');
    if (npcInput && window.CTEMap.tempNPCState.enabled) {
        window.CTEMap.tempNPCState.content = npcInput.value.trim();
    }
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
    
    let buttonsHtml = activities.map(act => 
        `<button class="cte-btn" style="margin: 3px; min-width: 60px; font-size: 13px;" onclick="window.CTEMap.finalizeTravel('${act}')">${act}</button>`
    ).join('');

    $('#travel-menu-overlay .travel-options').html(`
        <p style="color: #e0c5a1; margin: 0 0 10px 0;">去做什么？</p>
        
        <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:4px; margin-bottom:15px; max-height: 200px; overflow-y: auto;">
            ${buttonsHtml}
        </div>
        
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
    
    if (!finalActivity) {
        finalActivity = $('#custom-activity').val();
    }
    
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

window.CTEMap.closeSubMenu = function() {
    $('#interior-sub-menu').hide();
};

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
                            : `<div class="avatar-placeholder" id="user-avatar-placeholder">
                                <span class="placeholder-icon">👤</span>
                                <span class="placeholder-text">点击上传头像</span>
                               </div>`
                        }
                    </div>
                    <div class="avatar-upload-section">
                        <button class="cte-btn avatar-upload-btn" onclick="document.getElementById('user-avatar-upload').click()">
                            📷 ${hasAvatar ? '更换头像' : '上传头像'}
                        </button>
                        <input type="file" id="user-avatar-upload" accept="image/*" style="display:none;" onchange="window.CTEMap.uploadUserAvatar(this)">
                        ${hasAvatar ? `<button class="cte-btn avatar-delete-btn" onclick="window.CTEMap.deleteUserAvatar()">🗑️ 删除头像</button>` : ''}
                    </div>
                    <div class="character-info">
                        <div class="info-row">
                            <span class="info-label">姓名</span>
                            <span class="info-value">你</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">年龄</span>
                            <span class="info-value">${profile.age}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">身份</span>
                            <span class="info-value">${profile.role}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">性格</span>
                            <span class="info-value">${profile.personality}</span>
                        </div>
                    </div>
                    <div class="room-description">
                        <p>${desc}</p>
                    </div>
                    <div class="action-buttons">
                        <button class="cte-btn" onclick="window.CTEMap.openTravelMenu('你的房间')">🚀 前往</button>
                        <button class="sub-item-btn" id="temp-back-btn">[ < 返回上一级 ]</button>
                    </div>
                </div>
            `;
        } else {
            contentHTML = `
                <div class="character-room-detail">
                    <div class="character-portrait">
                        <img src="${profile.image}" alt="${roomName}" class="character-image">
                    </div>
                    <div class="character-info">
                        <div class="info-row">
                            <span class="info-label">姓名</span>
                            <span class="info-value">${roomName}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">年龄</span>
                            <span class="info-value">${profile.age}岁</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">身份</span>
                            <span class="info-value">${profile.role}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">性格</span>
                            <span class="info-value">${profile.personality}</span>
                        </div>
                    </div>
                    <div class="room-description">
                        <p>${desc}</p>
                    </div>
                    <div class="action-buttons">
                        <button class="cte-btn" onclick="window.CTEMap.openTravelMenu('${roomName}的房间')">🚀 前往</button>
                        <button class="sub-item-btn" id="temp-back-btn">[ < 返回上一级 ]</button>
                    </div>
                </div>
            `;
        }
    } else {
        contentHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 15px; width: 100%;">
                <p style="text-align:justify; font-size:14px; line-height:1.6;">${desc}</p>
                <button class="cte-btn" onclick="window.CTEMap.openTravelMenu('${roomName}')">🚀 前往</button>
                <button class="sub-item-btn" id="temp-back-btn">[ < 返回上一级 ]</button>
            </div>
        `;
    }
    
    contentEl.innerHTML = contentHTML;
    
    document.getElementById('temp-back-btn').onclick = () => window.CTEMap.openSubMenu(floorTitle, floorItems);
};

window.CTEMap.uploadUserAvatar = function(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        if (file.size > 2 * 1024 * 1024) {
            alert('图片大小不能超过2MB，请选择较小的图片');
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = e.target.result;
            try {
                localStorage.setItem('cte_user_avatar', imageData);
                window.CTEMap.openThirdLevelMenu('你', '五楼：私人宿舍区', ['秦述', '司洛', '鹿言', '魏星泽', '周锦宁', '谌绪', '孟明赫', '亓谢', '魏月华', '桑洛凡', '你', '公共书房/阅览区']);
            } catch (err) {
                alert('保存失败，图片可能太大。请尝试使用较小的图片。');
            }
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
        </div>
    `;
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
            e.preventDefault();
            e.stopPropagation(); // 阻止事件冒泡
            isDragging = true;
            hasMoved = false;
            elm.classList.add('dragging');
            
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = elm.offsetLeft;
            initialTop = elm.offsetTop;

            document.onmousemove = function(e) {
                if (!isDragging) return;
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved = true;

                let newLeft = initialLeft + dx;
                let newTop = initialTop + dy;
                
                newLeft = Math.max(0, Math.min(newLeft, mapContainer.offsetWidth));
                newTop = Math.max(0, Math.min(newTop, mapContainer.offsetHeight));

                elm.style.left = newLeft + 'px';
                elm.style.top = newTop + 'px';
            };

            document.onmouseup = function() {
                isDragging = false;
                elm.classList.remove('dragging');
                document.onmousemove = null;
                document.onmouseup = null;

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
        if (el) {
            el.style.left = pos.left;
            el.style.top = pos.top;
        }
    }
}

function loadSavedBg() {
    const bg = localStorage.getItem('cte_map_bg');
    if (bg) {
        document.getElementById('cte-map-container').style.backgroundImage = `url(${bg})`;
    }
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
    
    window.CTEMap.closeTravelMenu(isTravelMenuVisible);
};

