## 📸 Gallery (实机演示)

<details>
<summary><strong>🗺️ Map & Navigation (地图与导航)</strong></summary>
<br>
<div align="center">
  <img src="<img width="1302" height="862" alt="CTE男团12" src="https://github.com/user-attachments/assets/4cf43ab0-e653-466e-98de-b2c6a4f7a65a" />" width="45%" />
  <img src="path/to/national_map.jpg" width="45%" />
  <br>
  <img src="path/to/location_detail.jpg" width="45%" />
  <img src="path/to/travel_menu.jpg" width="45%" />
</div>
</details>

<details>
<summary><strong>📊 RPG Dashboard & Agency (经营与事务所)</strong></summary>
<br>
<div align="center">
  <img src="path/to/dashboard.jpg" width="30%" />
  <img src="path/to/agency_contracts.jpg" width="30%" />
  <img src="path/to/shop.jpg" width="30%" />
</div>
</details>

<details>
<summary><strong>❤️ Heartbeat Interaction (心跳互动)</strong></summary>
<br>
<div align="center">
  <img src="path/to/netflix_home.jpg" width="45%" />
  <img src="path/to/member_select.jpg" width="45%" />
</div>
</details>

## CTE Map Idol Manager (CTE偶像男团模拟经营)
An Immersive Idol Management RPG Extension for SillyTavern. 
专为 SillyTavern 打造的沉浸式偶像团体经营 RPG 扩展。

**📖 Introduction (简介)**
CTE Map Idol Manager is a comprehensive extension designed to transform your SillyTavern roleplay experience into a fully visualized simulation game. It serves as a frontend interface for the "CTE Boy Group" storyline, visualizing data such as funds, schedules, and locations, while providing interactive modules for agency management and intimate interactions.

CTE Map Idol Manager 是一个全面的扩展插件，旨在将你的 SillyTavern 角色扮演体验转化为一个完全可视化的模拟经营游戏。它作为“CTE男团”剧情的前端界面，将资金、行程、地点等数据可视化，并提供了事务所管理和亲密互动的交互模块。

This extension is specifically built to work with the CTE男团日常mvu4.json character card. The card handles the logic and text generation, while this extension renders the UI and handles user inputs.

本插件是专门为 CTE男团日常mvu4.json 角色卡构建的。角色卡负责逻辑处理和文本生成，而本插件负责渲染用户界面（UI）并处理用户输入。

**✨ Key Features (核心玩法)**
1. Visualized City Map & Navigation (可视化城市地图与导航)
Explore the fictional city of "Jinggang". Users can drag the map, click on locations (Dorms, Office, Airport, etc.) to view details, and trigger travel events directly through the UI. It supports sub-menus for interior rooms (e.g., specific floors in the dorm).

探索虚构的“京港市”。用户可以拖动地图，点击地点（如宿舍、办公室、机场等）查看详情，并通过 UI 直接触发移动事件。支持室内房间的二级菜单（例如宿舍的具体楼层）。

2. Idol Management Dashboard (偶像管理仪表盘)
A real-time dashboard that tracks RPG stats synced from the chat context, including Funds, Fan Count, and Group Morale. It also displays the current date, location, and a to-do list derived from the roleplay context.

一个实时仪表盘，用于追踪从聊天上下文中同步的 RPG 属性，包括资金、粉丝数和团魂。它还会显示当前日期、地点以及从角色扮演文本中提取的待办事项列表。

3. "Heartbeat" Interaction System (心跳互动系统)
A generic "Netflix-style" interface for selecting intimate interactions. Browse through categories like "Trending", "Intimate", and "Public", select a scenario (e.g., "Midnight Whispers"), and choose which member(s) to interact with.

一个类似“Netflix风格”的通用界面，用于选择亲密互动。浏览“热门”、“亲密”和“公开”等分类，选择一个场景（如“深夜私语”），并指定互动的成员。

4. Agency Contracts & Shop (事务所通告与商店)
Contracts: View available jobs (Movies, Music, Variety Shows) parsed from the chat. The UI displays requirements and pay, allowing you to assign members to specific contracts. Shop: A purchasing system where you can spend group funds on items like Marketing PR, Training Courses, or Luxury Gifts, directly impacting the RPG stats.

通告： 查看从聊天中解析出的可用工作（电影、音乐、综艺）。UI 会显示要求和薪酬，允许你指派成员接取特定通告。 商店： 一个采购系统，你可以花费团队资金购买营销公关、培训课程或奢侈礼物等物品，直接影响 RPG 数值。

5. Daily News & Schedule (每日快报与行程表)
News: An automatically generated "Daily News" page that reflects the game world's events, parsing headlines and trending topics from the LLM's output. Schedule: A timeline view of the day's agenda, allowing users to execute schedule items with a single click.

快报： 自动生成的“每日快报”页面，反映游戏世界的事件，解析 LLM 输出中的头条新闻和热搜话题。 行程： 当日日程的时间轴视图，允许用户一键执行特定的行程项目。

**🛠️ Technical Highlights (技术要点)**
Context Parsing via Regular Expressions (基于正则的上下文解析)
The extension does not rely solely on SillyTavern's variable system. Instead, it actively scans the chat history for custom XML-like tags (e.g., <status_top>, <news>, <contracts>, <shop>). This allows the LLM (Character Card) to dynamically update the UI by simply outputting structured text.

本扩展不完全依赖 SillyTavern 的变量系统。相反，它主动扫描聊天记录中的自定义 XML 风格标签（例如 <status_top>, <news>, <contracts>, <shop>）。这使得 LLM（角色卡）只需输出结构化文本即可动态更新 UI。

Slash Command Integration (斜杠指令集成)
All user actions in the UI (traveling, buying items, starting sex scenes) are converted into natural language or system instructions and sent back to the chat using SillyTavern's /setinput slash command. This ensures a seamless loop between the UI and the text generation.

UI 中的所有用户操作（移动、购买物品、开始互动）都会被转换为自然语言或系统指令，并使用 SillyTavern 的 /setinput 斜杠指令发送回聊天框。这确保了 UI 和文本生成之间的无缝闭环。

Responsive & Draggable UI (响应式与可拖拽 UI)
The panel is built with mobile adaptation in mind (using CSS Grid and Flexbox). It features a draggable window system (using jQuery UI) that solves common conflicts between CSS transforms and JavaScript positioning, ensuring the window behaves correctly on close/reopen.

面板的构建考虑了移动端适配（使用 CSS Grid 和 Flexbox）。它具有一个可拖拽的窗口系统（使用 jQuery UI），解决了 CSS 变换（transform）与 JavaScript 定位之间的常见冲突，确保窗口在关闭/重新打开时表现正常。

State Management (状态管理)
It synchronizes character stats (Affection, Desire, Skills) by reading specific variable blocks (stat_data) from the character card's specialized output, visualizing complex JSON data into readable progress bars and gauges.

它通过读取角色卡特定输出中的变量块（stat_data）来同步角色属性（好感度、欲望、技能），将复杂的 JSON 数据可视化为易读的进度条和仪表。

**📦 Installation (安装指南)**
Download the Extension (下载扩展): Clone this repository or download the zip file. Extract the contents into your SillyTavern extensions directory: 

克隆此仓库或下载压缩包。将内容解压到你的 SillyTavern 扩展目录中： /SillyTavern/public/scripts/extensions/third-party/CTE_Map

Acquire the Character Card (获取角色卡): The extension relies on the specific logic within the CTE男团日常mvu4.json card. This card is NOT included in this repository. You must obtain the authorized version from the official community: 

本扩展依赖于 CTE男团日常mvu4.json 卡片内的特定逻辑运行。本仓库不提供该角色卡。 请务必前往官方社区获取正版授权文件： 👉 Source: DISCORD.GG/CHENYEAH

Enable & Reload (启用并重载): Import the card into SillyTavern, enable the extension in settings, and reload the page. You should see a map icon button appear on the interface. 

将卡片导入 SillyTavern，在设置中启用该扩展并刷新页面。你应该会在界面上看到一个地图图标按钮。

**🎮 Usage (使用说明)**
Start a chat with the CTE Character Card. 
与 CTE 角色卡 开始对话。

Wait for the introductory message to generate the initialization tags. 
等待开场白生成初始化标签。

Click the Map Icon (🗺️) to open the dashboard. 
点击 地图图标 (🗺️) 打开仪表盘。

Use the tabs on the top right to switch between Map, Schedule, Agency, Heartbeat, etc. 
使用右上角的标签页在 地图、行程、事务所、心跳互动 等功能间切换。

If the UI looks empty, trigger the character to output the relevant status by typing keywords like "查看通告" (Check Contracts) or "刷新日报" (Refresh News). 
如果 UI 显示为空，可以通过输入关键词如“查看通告” or “刷新日报”来触发角色输出相关状态。

**📄 License & Terms (许可证与条款)**
CTE Map Idol Manager (The Extension / 插件本体): The code for this extension is Open Source for personal modification and learning. However, Commercial Use is Strictly Prohibited. You may not sell, rent, or use this code for any profit-making activities. 

本扩展的代码部分为 开源项目，仅供个人修改和学习使用。但是，绝对禁止任何形式的商业用途。不得将此代码用于售卖、租赁或任何盈利性活动。

Character Card (The Content / 角色卡内容): The accompanying character card (CTE男团日常mvu4.json) is the intellectual property of the original author. Usage Rights: The author strictly limits authorization to SillyTavern users who are also members of the official Discord community. Prohibition: Use or distribution of this character card through any non-author-authorized channels is absolutely forbidden. 

配套的角色卡 (CTE男团日常mvu4.json) 为原作者的知识产权。 使用权： 原作者仅授权 同时身为官方 Discord 社区成员的 SillyTavern 用户 使用。 禁令： 绝对禁止通过任何非作者授权的渠道（如倒卖、未经允许的转载站等）获取、传播或使用该角色卡。
