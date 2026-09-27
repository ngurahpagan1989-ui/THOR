// Dapatkan URL dan Key dari menu 'Project Settings > API' di Supabase
const supabaseUrl = 'URL_PROYEK_SUPABASE_MU';
const supabaseKey = 'ANON_KEY_PROYEK_SUPABASE_MU';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Fungsi sementara untuk dummy user (karena sistem login belum dibuat)
const DUMMY_USER_ID = 'isi-dengan-uuid-user-dari-tabel-auth'; 

// Fungsi menambah data minum air
async function addWater(amount) {
    const { data, error } = await supabase
        .from('water_logs')
        .insert([
            { user_id: DUMMY_USER_ID, amount_ml: amount } 
        ]);
        
    if (error) {
        console.error('Gagal mencatat air:', error);
        alert('Gagal menambah data!');
    } else {
        alert(`Berhasil menambah ${amount}ml air!`);
        // Logika untuk memperbarui angka di elemen <progress> akan ditambahkan di sini
    }
}
