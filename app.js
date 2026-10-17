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
    boss_name: 'FENRIR MK-I',
    boss_hp: 5000,
    boss_max_hp: 5000
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
        return data || defaultThorRpgProfile;
    } catch (err) {
        console.error('Error loadThorRpgProfile:', err);
        return defaultThorRpgProfile;
    }
}

/**
 * Update Profile RPG ke Supabase (id = 1)
 */
export async function updateThorRpgProfile(profile) {
    if (!supabaseClient) return null;
    try {
        const { data, error } = await supabaseClient
            .from('thor_rpg_profile')
            .upsert([{
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
            }]);

        if (error) {
            console.error('Gagal memperbarui status RPG ke Supabase:', error.message);
            return null;
        }
        return data;
    } catch (err) {
        console.error('Error updateThorRpgProfile:', err);
        return null;
    }
}
