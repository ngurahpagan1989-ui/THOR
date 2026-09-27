// Dapatkan URL dan Key dari menu 'Project Settings > API' di Supabase
const supabaseUrl = 'https://cvzjnrnnegdqoyuzkwhq.supabase.co/rest/v1/';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2empucm5uZWdkcW95dXprd2hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MTI4OTIsImV4cCI6MjEwNjA4ODg5Mn0.94FH2z2hhAdxF_1SNoqyhPtuWj8NHtHKzJXN9JgTais';
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
