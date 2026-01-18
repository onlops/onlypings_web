/* --- 0. GLOBAL CONFIG & THEME INIT --- */
const IMG_ASSETS = {
    logoLight: 'namelogo.jpg',
    logoDark:  'namelogodark.jpg',
    iconMoon:  'solar--moon-stars-linear.svg',
    iconSun:   'solar--sun-2-bold.svg'
};

const body = document.body;
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    const splashLogo = document.getElementById('splashLogo');
    if(splashLogo) splashLogo.src = IMG_ASSETS.logoDark;
}

/* --- 1. SPLASH SCREEN --- */
window.addEventListener('load', () => {
    const splash = document.getElementById('splash-screen');
    const splashImg = document.getElementById('splashLogo');

    if (body.classList.contains('dark-mode')) {
        splashImg.src = IMG_ASSETS.logoDark;
    } else {
        splashImg.src = IMG_ASSETS.logoLight;
    }
    
    setTimeout(() => {
        splash.classList.add('fade-out');
        setTimeout(() => {
            splash.remove();
        }, 500); 
    }, 1500);
});

/* --- 2. SCROLL SPY --- */
document.addEventListener('DOMContentLoaded', () => {
    updateHeaderIcons();

    const scrollContainer = document.querySelector('.content-area');
    const sections = document.querySelectorAll('#main-wrapper > div[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: scrollContainer,
        rootMargin: '-30% 0px -70% 0px', 
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    const onclickAttr = link.getAttribute('onclick');
                    if (onclickAttr && onclickAttr.includes(`'${currentId}'`)) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});

/* --- 3. PING TEST --- */
function startPingTest() {
    const btn = document.getElementById('pingBtn');
    const res = document.getElementById('pingResult');
    
    // 1. მომზადება: ღილაკის გათიშვა და სპინერის ჩართვა
    btn.disabled = true;
    
    // ძველი ტექსტის ("--- ms") წაშლა
    res.innerText = ""; 
    // სპინერის კლასის დამატება, რაც CSS ანიმაციას ჩართავს
    res.classList.add("loading-spinner"); 

    // პინგის სიმულაცია (იგივე რჩება)
    let pings = [];
    let count = 0;
    const maxPings = 5;

    const interval = setInterval(() => {
        count++;
        const start = Date.now();
        
        // რეალური მოთხოვნა (შენი სერვერის მისამართი ჩაწერე თუ გაქვს)
        fetch('https://api.mytbilisi.ge/ping') 
            .then(() => {
                pings.push(Date.now() - start);
            })
            .catch(() => {
                pings.push(null); // ჩავთვალოთ რომ ვერ დაუკავშირდა
            })
            .finally(() => {
                if (count === maxPings) {
                    clearInterval(interval);
                    finishPingTest(pings, btn, res);
                }
            });
            
    }, 300); // ყოველ 300ms-ში აგზავნის პინგს
}

function finishPingTest(pings, btn, res) {
    const successPings = pings.filter(p => p !== null);
    const total = successPings.reduce((a, b) => a + b, 0);
    const successCount = successPings.length;

    // 2. დასრულება: სპინერის გამორთვა
    // აუცილებლად წავშალოთ სპინერის კლასი სანამ ტექსტს ჩავწერთ
    res.classList.remove("loading-spinner");

    if (successCount > 0) {
        const avg = Math.round(total / successCount);
        res.innerText = `${avg} ms`; // შედეგის ჩაწერა

        // ფერების მიცემა შედეგის მიხედვით
        if(avg < 30) res.style.color = "#27ae60"; // მწვანე
        else if(avg < 70) res.style.color = "#f39c12"; // ყვითელი
        else res.style.color = "#e74c3c"; // წითელი

    } else {
        res.innerText = "Error";
        res.style.color = "#e74c3c";
    }

    // ღილაკის ისევ ჩართვა
    btn.disabled = false;
}

/* --- 4. LANGUAGE SYSTEM (UPDATED) --- */

const translations = {
    en: {
        signin: "Sign In",
        startnow: "Start Now",
        nav_radar: "Radar",
        nav_warroom: "War Room",
        nav_armory: "Armory",
        nav_intel: "Intel",
        
        // Radar
        hq_title: "ONLYPINGS HQ",
        system_status: "System Status:",
        operational: "OPERATIONAL",
        region: "Region:",
        caucasus: "Caucasus",
        online: "ONLINE",
        restarting: "RESTARTING",
        players: "👥 Players:",
        map: "🗺️ Map:",
        uptime: "⏱️ Uptime:",
        season: "📅 Season:",
        copy_ip: "COPY IP",
        copied: "COPIED! ✅",
        loading: "Loading...",
        sonar_title: "SONAR",
        latency: "LATENCY",
        check_ping: "🔍 CHECK",
        datacenter: "Tbilisi Datacenter",

        // War Room
        war_subtitle: "Global Leaderboards & Statistics",
        cpu_load: "CPU LOAD",
        ram_usage: "RAM USAGE",
        total_online: "TOTAL ONLINE",
        capacity: "Capacity: 500+",
        show_more: "SHOW MORE ▼",
        show_less: "SHOW LESS ▲",
        th_rank: "#",
        th_operator: "OPERATOR",
        th_score: "K/D",
        th_kills: "KILLS",
        th_sniper: "SNIPER",
        th_survivor: "SURVIVOR",
        th_time: "TIME",
        th_deaths: "DEATHS",
        th_tycoon: "TYCOON",
        th_balance: "BALANCE",
        th_level: "LEVEL",

        // Armory (CS2)
        armory_subtitle: "Tactical Upgrades & Supply Crates",
        cs_division: "COUNTER-STRIKE 2 DIVISION",
        mc_supply: "MINECRAFT SUPPLY",
        price_free: "FREE",
        period_mo: "/mo",
        btn_active: "ACTIVE",
        btn_equip: "EQUIP",
        btn_dominate: "DOMINATE",
        btn_unlock: "UNLOCK",
        btn_ascend: "ASCEND",
        
        tier_recruit: "RECRUIT",
        tier_soldier: "SOLDIER",
        tier_general: "GENERAL",
        tier_king: "KING",
        ribbon_best: "BEST VALUE",
        ribbon_popular: "POPULAR",

        // CS Features
        feat_public: "Public Access",
        feat_drop_rates: "Standard Drop Rates",
        feat_no_reserved: "No Reserved Slot",
        feat_default_skins: "Default Skins",
        feat_vip: "VIP Status in Chat",
        feat_ws_knife: "Access to !ws !knife",
        feat_reserved: "Reserved Slot",
        feat_no_admin: "No Admin Rights",
        feat_all_soldier: "Everything in Soldier",
        feat_agents: "Custom Agent Models",
        feat_immunity: "Vote Immunity",
        feat_sound: "Round End Sound",
        feat_full_access: "FULL ACCESS",
        feat_ban_rights: "Vote Ban/Kick Rights",
        feat_gold_tag: "Golden Chat Tag",
        feat_discord_role: "Personal Discord Role",

        // Minecraft Tiers
        tier_wanderer: "WANDERER",
        tier_phantom: "PHANTOM",
        tier_wither: "WITHER",
        tier_herobrine: "HEROBRINE",

        // MC Features
        feat_surv_sky: "Survival & SkyBlock",
        feat_1_home: "1x Home Set",
        feat_basic_claim: "Basic Land Claim",
        feat_no_fly: "No Fly / No Kits",
        feat_fly_hub: "Fly in Hub",
        feat_color_chat: "Colored Chat",
        feat_2_homes: "2x Home Sets",
        feat_no_god: "No God Mode",
        feat_kit_hero: "Kit: Hero (Weekly)",
        feat_tpa: "Fast Travel (/tpa)",
        feat_5_homes: "5x Home Sets",
        feat_keep_inv: "Keep Inventory (Nether)",
        feat_op_kit: "OP Kit (Daily)",
        feat_creative_fly: "Creative Flight (Plot)",
        feat_custom_prefix: "Custom Prefix & Color",
        feat_vault: "Private Vault (Large)",

        // Intel
        intel_subtitle: "Classified Server Documentation",
        tab_cs2: "CS2 DIRECTIVES",
        tab_mc: "MC MANUAL",
        tab_rules: "PROTOCOLS (RULES)",
        
        // Commands
        desc_ws: "Opens Weapon Skin menu. Pick any skin.",
        desc_knife: "Equip any Knife model (Karambit, Butterfly...)",
        desc_gloves: "Change your agent gloves instantly.",
        desc_rtv: "Rock The Vote. Start a map change vote.",
        desc_agents: "Choose a custom player model (VIP Only).",
        desc_nominate: "Add a specific map to the next voting cycle.",
        desc_tpa: "Request teleport to another player.",
        desc_sethome: "Set a teleport point at your current location.",
        desc_claim: "Protect your land using the Golden Shovel.",
        desc_shop: "Open the server market GUI to buy/sell.",
        desc_ah: "Auction House. Sell items to other players.",
        desc_jobs: "Join a job to earn money by mining/farming.",

        // Rules
        rule_zero_tol: "ZERO TOLERANCE",
        rule_zero_desc: "Cheating, Scripting, Exploiting, or DDOS threats result in a <strong>PERMANENT BAN</strong> without appeal.",
        rule_behavior: "BEHAVIOR",
        rule_behavior_desc: "No racism, excessive toxicity, or spawn camping. First offense: <strong>Mute/Gag</strong>. Second: <strong>Temp Ban</strong>.",
        rule_refunds: "REFUNDS",
        rule_refunds_desc: "All purchases in the Armory are final. Chargebacks will result in an automatic account suspension.",

        // Legal - Privacy
        legal_privacy_title: "PRIVACY PROTOCOLS",
        legal_privacy_sub: "DATA INTEGRITY & USER SECURITY",
        priv_1_title: "1. Data Collection",
        priv_1_desc: "OnlyPings collects minimal data necessary for server operations. This includes your SteamID, IP address (for connection logs), and in-game chat logs to ensure community safety. We do not store sensitive payment information; all transactions are processed by third-party providers.",
        priv_2_title: "2. Usage of Information",
        priv_2_desc: "Your data is utilized solely for: generating global leaderboards (War Room), maintaining server security (bans/mutes), and account verification for Armory purchases.",
        priv_3_title: "3. Third-Party Sharing",
        priv_3_desc: "We do not sell or trade user identities. Data may only be shared with law enforcement if required by Georgian law or to protect the safety of our infrastructure.",
        priv_4_title: "4. Cookies & Local Storage",
        priv_4_desc: "This website uses Local Storage to remember your theme preference (Dark/Light) and language settings. No tracking cookies are used for advertising.",

        // Legal - Terms
        legal_terms_title: "TERMS OF ENGAGEMENT",
        legal_terms_sub: "USER AGREEMENT & LIABILITY",
        term_1_title: "1. Acceptance of Terms",
        term_1_desc: "By connecting to OnlyPings servers (CS2, Minecraft) or accessing this website, you agree to be bound by these Terms. If you do not agree, please disconnect immediately.",
        term_2_title: "2. Code of Conduct",
        term_2_desc: "We enforce a strict \"Fair Play\" doctrine. Cheating, exploiting bugs, DDoSing, or engaging in hate speech will result in an immediate, non-negotiable permanent ban. Respect the admins and fellow players.",
        term_3_title: "3. Virtual Goods & Refunds",
        term_3_desc: "All purchases made in the \"Armory\" (VIP status, kits, skins) are for virtual items only. These items have no real-world value. <strong>All sales are final.</strong> Chargebacks will result in a permanent suspension across all our services.",
        term_4_title: "4. Service Availability",
        term_4_desc: "OnlyPings strives for 99.9% uptime but does not guarantee uninterrupted service. Maintenance or technical issues may cause temporary downtime. No compensation is owed for scheduled outages.",

        // Footer
        privacy_link: "Privacy Policy",
        terms_link: "Terms of Service",
        copyright: "© 2026 OnlyPings. All rights reserved.",
        support: "Get Support:",
        join_server: "Join Server"
    },
    ge: {
        signin: "შესვლა",
        startnow: "დაწყება",
        nav_radar: "რადარი",
        nav_warroom: "შტაბი",
        nav_armory: "არსენალი",
        nav_intel: "დაზვერვა",
        
        // Radar
        hq_title: "ONLYPINGS ბაზა",
        system_status: "სისტემის სტატუსი:",
        operational: "აქტიური",
        region: "რეგიონი:",
        caucasus: "კავკასია",
        online: "ონლაინშია",
        restarting: "რესტარტდება",
        players: "👥 მოთამაშეები:",
        map: "🗺️ რუკა:",
        uptime: "⏱️ დრო:",
        season: "📅 სეზონი:",
        copy_ip: "IP კოპირება",
        copied: "კოპირებულია! ✅",
        loading: "იტვირთება...",
        sonar_title: "სონარი",
        latency: "დაყოვნება",
        check_ping: "🔍 შემოწმება",
        datacenter: "თბილისის დატაცენტრი",

        // War Room
        war_subtitle: "გლობალური რეიტინგი და სტატისტიკა",
        cpu_load: "CPU დატვირთვა",
        ram_usage: "RAM გამოყენება",
        total_online: "ჯამში ონლაინ",
        capacity: "ტევადობა: 500+",
        show_more: "მეტის ნახვა ▼",
        show_less: "აკეცვა ▲",
        th_rank: "#",
        th_operator: "ოპერატორი",
        th_score: "K/D",
        th_kills: "მკვლელობა",
        th_sniper: "სნაიპერი",
        th_survivor: "გადარჩენილი",
        th_time: "დრო",
        th_deaths: "სიკვდილი",
        th_tycoon: "მაგნატი",
        th_balance: "ბალანსი",
        th_level: "დონე",

        // Armory (CS2)
        armory_subtitle: "ტაქტიკური აღჭურვილობა და მარაგი",
        cs_division: "COUNTER-STRIKE 2 დივიზიონი",
        mc_supply: "MINECRAFT-ის მარაგი",
        price_free: "უფასო",
        period_mo: "/თვე",
        btn_active: "აქტიური",
        btn_equip: "აღჭურვა",
        btn_dominate: "დომინაცია",
        btn_unlock: "განბლოკვა",
        btn_ascend: "ამაღლება",
        
        tier_recruit: "ახალწვეული",
        tier_soldier: "ჯარისკაცი",
        tier_general: "გენერალი",
        tier_king: "მეფე",
        ribbon_best: "რჩეული",
        ribbon_popular: "პოპულარული",

        // CS Features
        feat_public: "საჯარო წვდომა",
        feat_drop_rates: "სტანდარტული დროპი",
        feat_no_reserved: "დაჯავშნილი ადგილი არა",
        feat_default_skins: "სტანდარტული სკინები",
        feat_vip: "VIP სტატუსი ჩატში",
        feat_ws_knife: "წვდომა !ws !knife-ზე",
        feat_reserved: "დაჯავშნილი ადგილი",
        feat_no_admin: "ადმინის უფლებები არა",
        feat_all_soldier: "ყველაფერი რაც ჯარისკაცს აქვს",
        feat_agents: "აგენტის მოდელები",
        feat_immunity: "Vote Immunity (დაცვა)",
        feat_sound: "რაუნდის ბოლო ხმები",
        feat_full_access: "სრული წვდომა",
        feat_ban_rights: "Vote Ban/Kick უფლებები",
        feat_gold_tag: "ოქროსფერი ჩატი",
        feat_discord_role: "როლი დისკორდზე",

        // Minecraft Tiers
        tier_wanderer: "მოხეტიალე",
        tier_phantom: "ფანტომი",
        tier_wither: "ვიზერი",
        tier_herobrine: "ჰერობრაინი",

        // MC Features
        feat_surv_sky: "Survival და SkyBlock",
        feat_1_home: "1x სახლის წერტილი",
        feat_basic_claim: "მიწის დაცვა (Claim)",
        feat_no_fly: "ფრენა/კიტები არა",
        feat_fly_hub: "ფრენა ჰაბში",
        feat_color_chat: "ფერადი ჩატი",
        feat_2_homes: "2x სახლის წერტილი",
        feat_no_god: "God Mode არა",
        feat_kit_hero: "კიტი: Hero (კვირაში 1x)",
        feat_tpa: "სწრაფი ტელეპორტი (/tpa)",
        feat_5_homes: "5x სახლის წერტილი",
        feat_keep_inv: "ინვენტარის შენახვა (Nether)",
        feat_op_kit: "OP კიტი (დღიური)",
        feat_creative_fly: "კრეატივ ფრენა (Plot)",
        feat_custom_prefix: "საკუთარი პრეფიქსი/ფერი",
        feat_vault: "პირადი სეიფი (დიდი)",

        // Intel
        intel_subtitle: "სერვერის გასაიდუმლოებული დოკუმენტაცია",
        tab_cs2: "CS2 დირექტივები",
        tab_mc: "MC სახელმძღვანელო",
        tab_rules: "პროტოკოლი (წესები)",
        
        // Commands
        desc_ws: "ხსნის სკინების მენიუს. აირჩიე ნებისმიერი.",
        desc_knife: "აირჩიე დანის მოდელი (Karambit, Butterfly...)",
        desc_gloves: "აგენტის ხელთათმანების შეცვლა.",
        desc_rtv: "Rock The Vote. ხმის მიცემა რუკის შესაცვლელად.",
        desc_agents: "სპეციალური აგენტის მოდელები (მხოლოდ VIP).",
        desc_nominate: "შემდეგი რუკის არჩევანში დამატება.",
        desc_tpa: "ტელეპორტის მოთხოვნა სხვა მოთამაშესთან.",
        desc_sethome: "ლოკაციის შენახვა ტელეპორტისთვის.",
        desc_claim: "ტერიტორიის დაცვა (ოქროს ნიჩბით).",
        desc_shop: "სერვერის მაღაზიის გახსნა (ყიდვა/გაყიდვა).",
        desc_ah: "აუქციონი. ნივთების გაყიდვა მოთამაშეებზე.",
        desc_jobs: "სამსახურის დაწყება ფულის საშოვნელად.",

        // Rules
        rule_zero_tol: "ნულოვანი ტოლერანტობა",
        rule_zero_desc: "ჩეთები, სკრიპტები, ბაგების გამოყენება ან DDOS მუქარა ისჯება <strong>სამუდამო ბანით</strong> გასაჩივრების გარეშე.",
        rule_behavior: "ქცევის წესები",
        rule_behavior_desc: "აკრძალულია რასიზმი, ტოქსიკურობა და Spawn Kill. პირველი: <strong>Mute/Gag</strong>. მეორე: <strong>დროებითი ბანი</strong>.",
        rule_refunds: "თანხის დაბრუნება",
        rule_refunds_desc: "არსენალში შეძენილი ნივთები არ ბრუნდება. გადახდის გაუქმება (Chargeback) გამოიწვევს ანგარიშის ავტომატურ დაბლოკვას.",

        // Legal - Privacy
        legal_privacy_title: "კონფიდენციალობა",
        legal_privacy_sub: "მონაცემთა დაცვა და უსაფრთხოება",
        priv_1_title: "1. მონაცემთა შეგროვება",
        priv_1_desc: "OnlyPings აგროვებს მხოლოდ აუცილებელ მონაცემებს: SteamID, IP მისამართი (კავშირისთვის) და ჩატის ისტორია უსაფრთხოებისთვის. ჩვენ არ ვინახავთ საბანკო მონაცემებს.",
        priv_2_title: "2. ინფორმაციის გამოყენება",
        priv_2_desc: "თქვენი მონაცემები გამოიყენება: გლობალური რეიტინგისთვის (War Room), უსაფრთხოებისთვის (ბანი/მუტი) და შესყიდვების დასადასტურებლად.",
        priv_3_title: "3. მესამე მხარეები",
        priv_3_desc: "ჩვენ არ ვყიდით მომხმარებლის მონაცემებს. ინფორმაცია გაიცემა მხოლოდ კანონმდებლობით გათვალისწინებულ შემთხვევებში.",
        priv_4_title: "4. ქუქი ფაილები",
        priv_4_desc: "საიტი იყენებს Local Storage-ს თემისა და ენის დასამახსოვრებლად. სარეკლამო ქუქი ფაილები არ გამოიყენება.",

        // Legal - Terms
        legal_terms_title: "მომსახურების პირობები",
        legal_terms_sub: "შეთანხმება და პასუხისმგებლობა",
        term_1_title: "1. პირობების მიღება",
        term_1_desc: "სერვერზე ან საიტზე შემოსვლით თქვენ ეთანხმებით ამ წესებს. თუ არ ეთანხმებით, გთხოვთ დატოვოთ სერვერი.",
        term_2_title: "2. ქცევის კოდექსი",
        term_2_desc: "ჩვენ ვიცავთ \"Fair Play\" პრინციპს. ჩეთინგი, ბაგების გამოყენება ან სიძულვილის ენა გამოიწვევს მყისიერ ბანს.",
        term_3_title: "3. ვირტუალური ნივთები",
        term_3_desc: "ყველა შენაძენი (VIP, კიტები) არის ვირტუალური და არ აქვს რეალური ღირებულება. <strong>თანხა არ ბრუნდება.</strong>",
        term_4_title: "4. სერვერის ხელმისაწვდომობა",
        term_4_desc: "ჩვენ ვცდილობთ 99.9% აფთაიმს, თუმცა ტექნიკური ხარვეზების გამო შესაძლოა სერვერი დროებით გაითიშოს კომპენსაციის გარეშე.",

        // Footer
        privacy_link: "კონფიდენციალობა",
        terms_link: "მომსახურების პირობები",
        copyright: "© 2026 OnlyPings. ყველა უფლება დაცულია.",
        support: "მხარდაჭერა:",
        join_server: "სერვერზე შესვლა"
    }
};

const languagesList = [
    { code: 'en', src: 'circle-flags--en.svg' },
    { code: 'ge', src: 'circle-flags--ge.svg' } // Make sure this matches your file name
];

let currentLang = localStorage.getItem('language') || 'en';

function toggleLang() {
    // ენის გადართვა
    currentLang = currentLang === 'en' ? 'ge' : 'en';
    
    // ლოკალურ მეხსიერებაში შენახვა
    localStorage.setItem('language', currentLang);
    
    // განახლება
    updateLanguage();
}

function updateLanguage() {
    // 1. დროშის შეცვლა
    const selectedLangObj = languagesList.find(l => l.code === currentLang);
    const mainFlag = document.getElementById('mainFlag');
    const mobileLangText = document.getElementById('mobileLangText');

    if(mainFlag) {
        mainFlag.src = selectedLangObj.src;
        mainFlag.alt = selectedLangObj.code;
    }

    if(mobileFlag) {
        mobileFlag.src = selectedLangObj.src;
    }
    if(mobileLangText) {
        mobileLangText.innerText = currentLang === 'en' ? 'English' : 'ქართული';
    }

    // 2. CSS კლასის მართვა (ეს არის ახალი ნაწილი!)
    // თუ ენა ქართულია, body-ს დაემატება კლასი "lang-ge"
    if (currentLang === 'ge') {
        document.body.classList.add('lang-ge');
    } else {
        document.body.classList.remove('lang-ge');
    }

    // 3. ტექსტების შეცვლა
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translations[currentLang][key];
            } else {
                el.innerHTML = translations[currentLang][key]; 
            }
        }
    });
}

// ინიციალიზაცია ჩატვირთვისას
document.addEventListener('DOMContentLoaded', () => {
    updateLanguage();
});

/* --- 5. THEME TOGGLE --- */

function toggleTheme() {
    const isDark = body.classList.contains('dark-mode');
    applyTheme(!isDark); 
}

function applyTheme(isDark) {
    if (isDark) {
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }
    updateHeaderIcons();
}

/* --- MOBILE MENU LOGIC --- */

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu-overlay');
    
    if (menu.classList.contains('active')) {
        menu.classList.remove('active');
        
        // აქ 'auto'-ს მაგივრად ვიყენებთ ცარიელ სტრინგს.
        // ეს "ასუფთავებს" JS-ის ჩარევას და CSS-ს აბრუნებს ძალაში.
        document.body.style.overflow = ''; 
        
    } else {
        menu.classList.add('active');
        
        // მენიუ როცა ღიაა, სქროლი იბლოკება
        document.body.style.overflow = 'hidden'; 
    }
}



function updateHeaderIcons() {
    const mobileThemeIcon = document.getElementById('mobileThemeIcon');
    const isDark = body.classList.contains('dark-mode');
    const themeIcon = document.getElementById('themeIcon');
    const headerLogo = document.getElementById('headerLogo');
    const splashLogo = document.getElementById('splashLogo');
    const footerLogo = document.getElementById('footerLogo');

    if(mobileThemeIcon) {
        mobileThemeIcon.src = isDark ? IMG_ASSETS.iconMoon : IMG_ASSETS.iconSun;
    }

    if (themeIcon) {
        themeIcon.classList.remove('anim-sun', 'anim-moon');
        void themeIcon.offsetWidth;
    }

    if (isDark) {
        if(themeIcon) {
            themeIcon.src = IMG_ASSETS.iconMoon;
            themeIcon.classList.add('anim-sun');
        }
        if(headerLogo) headerLogo.src = IMG_ASSETS.logoDark;
        if(splashLogo) splashLogo.src = IMG_ASSETS.logoDark;
        if(footerLogo) footerLogo.src = IMG_ASSETS.logoDark;
    } else {
        if(themeIcon) {
            themeIcon.src = IMG_ASSETS.iconSun;
            themeIcon.classList.add('anim-moon');
        }
        if(headerLogo) headerLogo.src = IMG_ASSETS.logoLight;
        if(splashLogo) splashLogo.src = IMG_ASSETS.logoLight;
        if(footerLogo) footerLogo.src = IMG_ASSETS.logoLight;
    }
}

/* --- COPY IP FUNCTION --- */
function copyIp(ip, btnElement) {
    navigator.clipboard.writeText(ip).then(() => {
        
        // თარგმნილი ტექსტის წამოღება
        const originalText = btnElement.getAttribute('data-i18n') 
            ? translations[currentLang][btnElement.getAttribute('data-i18n')] 
            : btnElement.innerText; // Fallback

        // ღილაკზე დავაწეროთ "COPIED" შესაბამის ენაზე
        btnElement.innerText = translations[currentLang]['copied'];
        
        btnElement.classList.add("btn-primary");
        btnElement.classList.remove("btn-outline");

        setTimeout(() => {
            // დაბრუნება ორიგინალ ტექსტზე (ენის მიხედვით)
            btnElement.innerText = originalText;
            btnElement.classList.remove("btn-primary");
            btnElement.classList.add("btn-outline");
        }, 2000);

    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

/* --- WAR ROOM DATA GENERATOR --- */

const dummyNames = [
    "Ghost_77", "Tbilisi_Sniper", "GeoWarrior", "Kavkaz_Wolf", "Silent_Aim", 
    "Rustavi_Killer", "Batumi_Boy", "Didube_Gang", "Svaneti_Peak", "Mtatsminda",
    "Old_Tbilisi", "Khinkali_Lover", "Mcvadi_Master", "Churchkhela", "Qartveli",
    "Ilia_Chav", "Vaja_Pshav", "Akaki_C", "Galaktion", "Pirosmani", "GigaChad",
    "NoScope360", "Lag_Switch", "High_Ping", "Low_FPS"
];

function generateLeaderboard(elementId, type) {
    const container = document.getElementById(elementId);
    if(!container) return;

    let html = '';
    const count = 20; // 20 მოთამაშე თითო სერვერზე

    for (let i = 1; i <= count; i++) {
        // Random Name
        const name = dummyNames[Math.floor(Math.random() * dummyNames.length)] + "_" + Math.floor(Math.random()*99);
        
        let score, extra;

        // მონაცემების სიმულაცია სერვერის ტიპის მიხედვით
        if (type === 'cs') {
            // CS2: K/D Ratio (მაგ: 2.45) და Kills
            const kd = (Math.random() * (3.5 - 0.5) + 0.5).toFixed(2);
            score = kd; 
            extra = Math.floor(kd * 1000 + Math.random() * 500); // Kills
        } else if (type === 'mc-time') {
            // MC Survival: საათები და სიკვდილები
            score = Math.floor(Math.random() * 500) + "h";
            extra = Math.floor(Math.random() * 20) + " ☠️";
        } else if (type === 'mc-money') {
            // MC SkyBlock: ფული და ლეველი
            const money = (Math.random() * 10).toFixed(1) + "M";
            score = "$" + money;
            extra = "Lvl " + Math.floor(Math.random() * 1000);
        }

        // Top 3 კლასები ფერებისთვის
        const rankClass = i <= 3 ? `rank-${i}` : '';

        html += `
            <div class="list-row ${rankClass}">
                <div class="row-rank">#${i}</div>
                <div class="row-name">${name}</div>
                <div class="row-score">${score}</div>
                <div class="row-extra">${extra}</div>
            </div>
        `;
    }

    container.innerHTML = html;
}

// გვერდის ჩატვირთვისას ავავსოთ ოთხივე ცხრილი
document.addEventListener('DOMContentLoaded', () => {
    generateLeaderboard('list-cs-public', 'cs');
    generateLeaderboard('list-cs-awp', 'cs');
    generateLeaderboard('list-mc-survival', 'mc-time');
    generateLeaderboard('list-mc-skyblock', 'mc-money');
});

/* --- INTEL TABS LOGIC --- */
function openTab(evt, tabName) {
    // 1. ყველა კონტენტის დამალვა
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("intel-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // 2. ყველა ღილაკიდან "active" კლასის წაშლა
    tablinks = document.getElementsByClassName("intel-tab");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // 3. არჩეული ტაბის გამოჩენა და ღილაკის გააქტიურება
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

/* --- TOGGLE LEADERBOARD FUNCTION (SMOOTH SCROLL) --- */
function toggleList(listId, btn) {
    const list = document.getElementById(listId);
    
    // 1. გახსნა (Expand)
    if (list.classList.contains('collapsed')) {
        list.classList.remove('collapsed');
        list.classList.add('expanded');
        
        // ვცვლით data-i18n-ს "show_less"-ზე, რომ ენის გადართვისას სწორი თარგმანი წამოიღოს
        btn.setAttribute('data-i18n', 'show_less');
        // მომენტალურად ვცვლით ტექსტს არჩეული ენის მიხედვით
        btn.innerHTML = translations[currentLang]['show_less']; 
    } 
    // 2. დახურვა (Collapse)
    else {
        list.classList.remove('expanded');
        list.classList.add('collapsed');
        
        // ვცვლით data-i18n-ს "show_more"-ზე
        btn.setAttribute('data-i18n', 'show_more');
        // მომენტალურად ვცვლით ტექსტს
        btn.innerHTML = translations[currentLang]['show_more']; 
        
        // Smooth Scroll მაგია
        list.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

/* --- LEGAL SECTIONS TOGGLE LOGIC --- */

const mainSectionsIds = ['radar', 'warroom', 'armory', 'intel'];

function showLegal(type, event) {
    if(event) event.preventDefault();

    // 1. დავმალოთ ყველა მთავარი სექცია
    mainSectionsIds.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.style.display = 'none';
    });

    // 2. დავმალოთ ლოგო კონტეინერი (ეს დაემატა)
    const logoContainer = document.querySelector('.footer-logo-container');
    if(logoContainer) logoContainer.style.display = 'none';

    // 3. დავმალოთ ლეგალური სექციებიც ჯერ
    document.getElementById('privacy-policy').style.display = 'none';
    document.getElementById('terms-service').style.display = 'none';

    // 4. გამოვაჩინოთ საჭირო
    if (type === 'privacy') {
        document.getElementById('privacy-policy').style.display = 'flex';
    } else if (type === 'terms') {
        document.getElementById('terms-service').style.display = 'flex';
    }

    // 5. Sidebar-ის ვიზუალი
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        link.classList.add('faded');
    });

    // 6. Footer-ის აქტივაცია
    document.getElementById('link-privacy').classList.remove('active-legal');
    document.getElementById('link-terms').classList.remove('active-legal');

    if (type === 'privacy') {
        document.getElementById('link-privacy').classList.add('active-legal');
    } else {
        document.getElementById('link-terms').classList.add('active-legal');
    }
    
    // 7. სქროლი კონტენტზე
    const contentArea = document.querySelector('.content-area');
    if (contentArea) {
        contentArea.scrollTo({
            top: 0,
            behavior: 'instant'
        });
    }
}

function resetToMain() {
    // 1. აღვადგინოთ მთავარი სექციები
    mainSectionsIds.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.style.display = 'flex'; 
    });

    // 2. გამოვაჩინოთ ლოგო კონტეინერი ისევ (ეს დაემატა)
    const logoContainer = document.querySelector('.footer-logo-container');
    if(logoContainer) logoContainer.style.display = 'flex';

    // 3. დავმალოთ ლეგალური სექციები
    document.getElementById('privacy-policy').style.display = 'none';
    document.getElementById('terms-service').style.display = 'none';

    // 4. Sidebar-ის აღდგენა
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('faded');
    });

    // 5. Footer-ის სტილების მოხსნა
    document.getElementById('link-privacy').classList.remove('active-legal');
    document.getElementById('link-terms').classList.remove('active-legal');
}

/* --- UNIVERSAL SCROLL FUNCTION (RESTORED DIV SCROLL) --- */
function customScroll(targetId) {
    // 1. მენიუს დახურვა
    const menu = document.getElementById('mobile-menu-overlay');
    if (menu && menu.classList.contains('active')) {
        menu.classList.remove('active');
    }

    resetToMain();

    const element = document.getElementById(targetId);
    // ვპოულობთ კონტეინერს, რომელიც სქროლავს
    const container = document.querySelector('.content-area');
    
    if (!element || !container) return;

    // 2. სქროლის გამოთვლა (ახლა მობილურზეც კონტეინერი სქროლავს)
    // მობილურზე ჰედერის გამოკლება აღარ გვინდა, რადგან კონტეინერი უკვე ჰედერის ქვემოთაა
    const isMobile = window.innerWidth <= 768;
    
    // ვპოულობთ პირველ ელემენტს, რომ ათვლა სწორი იყოს
    const firstSection = document.querySelector('#main-wrapper > div');
    
    if (firstSection) {
        let topPos = element.offsetTop - firstSection.offsetTop;
        
        // მობილურზე პატარა კორექცია თუ საჭიროა
        if (isMobile) {
            topPos = topPos - 20; // 20px ჰაერი თავში
        }

        container.scrollTo({
            top: topPos,
            behavior: 'smooth'
        });
    }
}

/* --- FINAL EVENT LISTENERS FOR MOBILE --- */
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('mobileMenuBtn');
    
    if (btn) {
        // ფუნქცია, რომელიც მენიუს ხსნის
        const handleMenuToggle = (e) => {
            // თუ ეს არის touch ივენთი, გავაჩეროთ "Ghost Click"
            if (e.type === 'touchstart' || e.type === 'touchend') {
                e.preventDefault(); 
            }
            toggleMobileMenu();
        };

        // ვუსმენთ ორივე ივენთს იმედიანად
        btn.addEventListener('touchend', handleMenuToggle, { passive: false });
        btn.addEventListener('click', handleMenuToggle);
    }
    
    // ლოგო ლინკების ფიქსი (რომ სქროლი იმუშაოს)
    const logoLinks = document.querySelectorAll('.header-logo-link, .scroll-top-link');
    logoLinks.forEach(link => {
        link.addEventListener('touchend', (e) => {
            e.preventDefault(); // ლინკის სტანდარტული ქცევის გაჩერება
            customScroll('radar');
        }, { passive: false });
    });
});