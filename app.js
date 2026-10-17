/**
 * THOR TACTICAL HEALTH & WORKOUT ENGINE
 * Tactical RPG System & Supabase Integration Module
 */

const supabaseUrl = 'https://cvzjnrnnegdqoyuzkwhq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2empucm5uZWdkcW95dXprd2hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MTI4OTIsImV4cCI6MjEwNjA4ODg5Mn0.94FH2z2hhAdxF_1SNoqyhPtuWj8NHtHKzJXN9JgTais';

// Inisialisasi client Supabase jika library tersedia
const supabaseClient = (typeof supabase !== 'undefined' && supabase.createClient)
    ? supabase.createClient(supabaseUrl, supabaseKey)
    : null;

/**
 * Buat struktur default Misi Harian (Daily Quests)
 */
export function createFreshDailyQuests(dateStr = new Date().toISOString().split('T')[0]) {
    return {
        date: dateStr,
        all_cleared: false,
        quest_str: { current: 0, target: 1, completed: false },
        quest_sta: { current: 0, target: 150, completed: false },
        quest_vit: { current: 0, target: 2, completed: false }
    };
}

/**
 * NORSE-CYBERPUNK BOSS ROSTER (5 TIERS)
 */
export const BOSS_ROSTER = [
    {
        tier: 1,
        name: "FENRIR MK-I (Cybernetic Wolf)",
        shortName: "FENRIR MK-I",
        maxHp: 2500,
        element: "Kinetic",
        icon: "🐺",
        desc: "Srigala sibernetik pelacak kinetik berkecepatan tinggi dengan cakar pemotong plasma."
    },
    {
        tier: 2,
        name: "JORMUNGANDR EXO-SERPENT",
        shortName: "JORMUNGANDR",
        maxHp: 4000,
        element: "Bio-Hazard",
        icon: "🐍",
        desc: "Ular raksasa berlapis baja bertenaga reaktor asam korosif dan bio-hazard toksik."
    },
    {
        tier: 3,
        name: "LOKI PHANTOM DRONE",
        shortName: "LOKI PHANTOM",
        maxHp: 6000,
        element: "Stealth/Optical",
        icon: "🛸",
        desc: "Drone siluman dengan kamuflase optik dan proyeksi bayangan holografik frekuensi tinggi."
    },
    {
        tier: 4,
        name: "SURTUR PLASMA TITAN",
        shortName: "SURTUR TITAN",
        maxHp: 8500,
        element: "Thermal",
        icon: "🔥",
        desc: "Titan tempur lapis baja magma berbahan bakar plasma termal bersuhu ribuan derajat."
    },
    {
        tier: 5,
        name: "ODIN PRIME OVERLORD",
        shortName: "ODIN PRIME",
        maxHp: 12000,
        element: "Quantum",
        icon: "👁️",
        desc: "Kecerdasan buatan komando pusat tertinggi dengan daya manipulasi komputasi quantum mutlak."
    }
];

/**
 * Default RPG Profile Template (Table: thor_rpg_profile, id = 1)
 */
export const defaultThorRpgProfile = {
    id: 1,
    player_name: 'NGURAH',
    rank_title: '[TACTICAL RECRUIT]',
    level: 1,
    current_exp: 0,
    max_exp: 100,
    hp: 100,
    max_hp: 100,
    str_stat: 10,
    sta_stat: 10,
    vit_stat: 10,
    streak_days: 1,
    boss_name: 'FENRIR MK-I (Cybernetic Wolf)',
    boss_hp: 2500,
    boss_max_hp: 2500,
    boss_tier: 0,
    ng_plus_cycle: 0,
    defeated_bosses: [],
    last_active_date: new Date().toISOString().split('T')[0],
    daily_quests: createFreshDailyQuests(),
    unlocked_badges: [],
    equipped_gear: ['recruit_exo_suit'],
    total_lift_volume: 0,
    clean_food_count: 0,
    boss_damage_total: 0,
    boss_kill_count: 0
};

/**
 * Menghitung Rank Title berdasarkan level Player
 */
export function calculateRankTitle(lvl) {
    if (lvl >= 30) return '[GOD OF THUNDER]';
    if (lvl >= 20) return '[ASGARDIAN COMMANDER]';
    if (lvl >= 10) return '[CYBER BERSERKER]';
    if (lvl >= 5) return '[VANGUARD OPERATOR]';
    return '[TACTICAL RECRUIT]';
}

/**
 * Load Profile RPG dari Supabase (id = 1) dengan fallback local storage
 */
export async function loadThorRpgProfile() {
    if (!supabaseClient) return defaultThorRpgProfile;
    try {
        const { data, error } = await supabaseClient
            .from('thor_rpg_profile')
            .select('*')
            .eq('id', 1)
            .maybeSingle();

        if (error) {
            console.warn('Gagal memuat profil RPG dari Supabase:', error.message);
            return defaultThorRpgProfile;
        }
        if (data) {
            if (typeof data.daily_quests === 'string') {
                try { data.daily_quests = JSON.parse(data.daily_quests); } catch(e) {}
            }
            if (typeof data.unlocked_badges === 'string') {
                try { data.unlocked_badges = JSON.parse(data.unlocked_badges); } catch(e) {}
            }
            if (typeof data.equipped_gear === 'string') {
                try { data.equipped_gear = JSON.parse(data.equipped_gear); } catch(e) {}
            }
            if (typeof data.defeated_bosses === 'string') {
                try { data.defeated_bosses = JSON.parse(data.defeated_bosses); } catch(e) {}
            }
            return { ...defaultThorRpgProfile, ...data };
        }
        return defaultThorRpgProfile;
    } catch (err) {
        console.error('Error loadThorRpgProfile:', err);
        return defaultThorRpgProfile;
    }
}

/**
 * Update Profile RPG ke Supabase (id = 1) dengan fallback jika kolom belum ada
 */
export async function updateThorRpgProfile(profile) {
    if (!supabaseClient) return null;
    const basePayload = {
        id: 1,
        player_name: profile.player_name,
        rank_title: profile.rank_title,
        level: profile.level,
        current_exp: profile.current_exp,
        max_exp: profile.max_exp,
        hp: profile.hp,
        max_hp: profile.max_hp,
        str_stat: profile.str_stat,
        sta_stat: profile.sta_stat,
        vit_stat: profile.vit_stat,
        streak_days: profile.streak_days,
        boss_name: profile.boss_name,
        boss_hp: profile.boss_hp,
        boss_max_hp: profile.boss_max_hp
    };

    try {
        const fullPayload = {
            ...basePayload,
            last_active_date: profile.last_active_date || new Date().toISOString().split('T')[0],
            daily_quests: profile.daily_quests || createFreshDailyQuests(),
            unlocked_badges: profile.unlocked_badges || [],
            equipped_gear: profile.equipped_gear || ['recruit_exo_suit'],
            defeated_bosses: profile.defeated_bosses || [],
            boss_tier: profile.boss_tier || 0,
            ng_plus_cycle: profile.ng_plus_cycle || 0
        };

        const { data, error } = await supabaseClient
            .from('thor_rpg_profile')
            .upsert([fullPayload]);

        if (error) {
            console.warn('Supabase upsert full profile gagal, mencoba fallback base columns:', error.message);
            const { data: baseData, error: baseError } = await supabaseClient
                .from('thor_rpg_profile')
                .upsert([basePayload]);

            if (baseError) {
                console.error('Fallback update thor_rpg_profile gagal:', baseError.message);
                return null;
            }
            return baseData;
        }
        return data;
    } catch (err) {
        console.error('Error updateThorRpgProfile:', err);
        return null;
    }
}

/**
 * Helper Logika Transisi Boss & New Game+ (Ragnarok Protocol)
 */
export function handleBossDefeat(profile) {
    if (!profile) return profile;
    const p = { ...profile };
    p.boss_hp = 0;
    p.boss_kill_count = (p.boss_kill_count || 0) + 1;

    if (!Array.isArray(p.defeated_bosses)) p.defeated_bosses = [];
    const defeatedName = p.boss_name || BOSS_ROSTER[0].name;
    p.defeated_bosses.push(defeatedName);

    const currentTier = (typeof p.boss_tier === 'number') ? p.boss_tier : 0;

    if (currentTier >= BOSS_ROSTER.length - 1) {
        // Semua 5 Boss dikalahkan! Masuk ke NEW GAME+ (RAGNAROK PROTOCOL)
        p.ng_plus_cycle = (p.ng_plus_cycle || 0) + 1;
        p.boss_tier = 0;
        const multiplier = Math.pow(2, p.ng_plus_cycle);
        const nextBoss = BOSS_ROSTER[0];
        p.boss_max_hp = nextBoss.maxHp * multiplier;
        p.boss_hp = p.boss_max_hp;
        p.boss_name = `[OVERDRIVE] ${nextBoss.name}`;
    } else {
        // Boss Tier berikutnya pada siklus saat ini
        p.boss_tier = currentTier + 1;
        const nextBoss = BOSS_ROSTER[p.boss_tier];
        const multiplier = Math.pow(2, p.ng_plus_cycle || 0);
        p.boss_max_hp = nextBoss.maxHp * multiplier;
        p.boss_hp = p.boss_max_hp;
        p.boss_name = (p.ng_plus_cycle > 0 ? '[OVERDRIVE] ' : '') + nextBoss.name;
    }

    return p;
}

/**
 * Tactical Sound Synthesizer Engine (Web Audio API)
 */
export const thorAudio = {
    audioCtx: null,
    isMuted: (typeof localStorage !== 'undefined' && localStorage.getItem('THOR_SFX_MUTED') === 'true'),

    getContext() {
        if (!this.audioCtx && typeof window !== 'undefined') {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) this.audioCtx = new AudioContextClass();
        }
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
        return this.audioCtx;
    },

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('THOR_SFX_MUTED', this.isMuted ? 'true' : 'false');
        }
        if (!this.isMuted) {
            this.playExpSound();
        }
    },

    playExpSound() {
        if (this.isMuted) return;
        try {
            const ctx = this.getContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(900, now + 0.12);
            gain.gain.setValueAtTime(0.01, now);
            gain.gain.linearRampToValueAtTime(0.35, now + 0.02);
            gain.gain.setValueAtTime(0.08, now + 0.05);
            gain.gain.setValueAtTime(0.4, now + 0.07);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.12);
        } catch (e) {}
    },

    playBossHitSound() {
        if (this.isMuted) return;
        try {
            const ctx = this.getContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(120, now);
            osc.frequency.exponentialRampToValueAtTime(40, now + 0.20);
            gain.gain.setValueAtTime(0.6, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.20);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.20);
        } catch (e) {}
    },

    playLevelUpSound() {
        if (this.isMuted) return;
        try {
            const ctx = this.getContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            const notes = [
                { f: 523.25, time: 0.00, dur: 0.10 },
                { f: 659.25, time: 0.09, dur: 0.10 },
                { f: 783.99, time: 0.18, dur: 0.12 },
                { f: 1046.50, time: 0.28, dur: 0.45 }
            ];
            notes.forEach(note => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "triangle";
                osc.frequency.setValueAtTime(note.f, now + note.time);
                gain.gain.setValueAtTime(0.01, now + note.time);
                gain.gain.linearRampToValueAtTime(0.35, now + note.time + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, now + note.time + note.dur);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + note.time);
                osc.stop(now + note.time + note.dur);
            });
        } catch (e) {}
    },

    playWarningSound() {
        if (this.isMuted) return;
        try {
            const ctx = this.getContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "square";
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.setValueAtTime(200, now + 0.08);
            osc.frequency.setValueAtTime(300, now + 0.14);
            osc.frequency.setValueAtTime(200, now + 0.20);
            gain.gain.setValueAtTime(0.35, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.26);
        } catch (e) {}
    }
};

/**
 * Tactical Gear Registry (Norse-Cyberpunk Passive Buffs)
 */
export const TACTICAL_GEAR_REGISTRY = [
    {
        id: "recruit_exo_suit",
        name: "Recruit Exo-Suit",
        slot: "EXO-CHASSIS",
        icon: "🦿",
        unlockReq: "Level ≥ 1",
        buffBadge: "+5% BASE EXP",
        desc: "Sistem eksoskeleton standar rekrut taktis. Mengoptimalkan neural motorik sebesar +5% Base EXP.",
        checkUnlocked: (p) => (p.level || 1) >= 1
    },
    {
        id: "mjolnir_gauntlets",
        name: "Mjolnir Power Gauntlets",
        slot: "ARMS",
        icon: "🥊",
        unlockReq: "STR ≥ 15",
        buffBadge: "+20% TRUE DMG (BEBAN)",
        desc: "Sarung tangan kinetik bermuatan plasma Thor. +20% True Damage ke Boss dari angkatan beban.",
        checkUnlocked: (p) => (p.str_stat || 10) >= 15
    },
    {
        id: "valkyrie_boots",
        name: "Valkyrie Thruster Boots",
        slot: "BOOTS",
        icon: "🥾",
        unlockReq: "STA ≥ 15",
        buffBadge: "+20% EXP & +15% DMG (KARDIO)",
        desc: "Sepatu berpendorong ionik Valkyrie. +20% EXP dan +15% Boss Damage dari aktivitas kardio/MET.",
        checkUnlocked: (p) => (p.sta_stat || 10) >= 15
    },
    {
        id: "idunn_core",
        name: "Idunn Bio-Reactor Core",
        slot: "CORE",
        icon: "🔋",
        unlockReq: "VIT ≥ 15",
        buffBadge: "2X HP RECOVERY (SEHAT)",
        desc: "Reaktor biokimia esensi Idunn. Melipatgandakan (2x) pemulihan Armor HP dari makanan bernutrisi.",
        checkUnlocked: (p) => (p.vit_stat || 10) >= 15
    },
    {
        id: "aegis_armor",
        name: "Asgardian Aegis Armor",
        slot: "CHESTPLATE",
        icon: "🛡️",
        unlockReq: "Level ≥ 10",
        buffBadge: "-50% HP PENALTY & DECAY",
        desc: "Pelindung vibranium Asgardian. Meredam 50% efek penalti HP debuff dan kerusakan Armor Decay.",
        checkUnlocked: (p) => (p.level || 1) >= 10
    }
];

/**
 * Achievement Medals Registry
 */
export const ACHIEVEMENT_MEDALS = [
    {
        id: "first_blood",
        title: "FIRST BLOOD",
        icon: "🏅",
        rewardText: "+50 EXP",
        expReward: 50,
        desc: "Berikan True Damage pertama kali ke Boss Mingguan.",
        checkEarned: (p) => (p.boss_damage_total || 0) > 0
    },
    {
        id: "iron_lifter",
        title: "IRON LIFTER",
        icon: "🏋️",
        rewardText: "+100 EXP, +2 STR",
        expReward: 100,
        statGains: { str: 2 },
        desc: "Mencapai total akumulasi volume angkatan beban 5.000 kg.",
        checkEarned: (p) => (p.total_lift_volume || 0) >= 5000
    },
    {
        id: "unstoppable",
        title: "UNSTOPPABLE",
        icon: "🔥",
        rewardText: "+150 EXP",
        expReward: 150,
        desc: "Mencapai Streak aktif 7 hari berturut-turut.",
        checkEarned: (p) => (p.streak_days || 0) >= 7
    },
    {
        id: "clean_fuel",
        title: "CLEAN FUEL",
        icon: "🥩",
        rewardText: "+100 EXP, +2 VIT",
        expReward: 100,
        statGains: { vit: 2 },
        desc: "Mencatat 10 makanan bernutrisi sehat dengan AI Vision.",
        checkEarned: (p) => (p.clean_food_count || 0) >= 10
    },
    {
        id: "fenrir_slayer",
        title: "FENRIR SLAYER",
        icon: "💀",
        rewardText: "+300 EXP",
        expReward: 300,
        desc: "Mengalahkan Boss Mingguan pertama kali.",
        checkEarned: (p) => (p.boss_kill_count || 0) >= 1
    }
];


