const { pool } = require('../src/config/database');

async function seed() {
    console.log('Seeding visitor logs...');
    
    // Clear existing logs
    await pool.query('DELETE FROM visitor_logs');
    
    // Calculate local date string (for Turkey timezone compatibility)
    const localDate = new Date();
    // Offset is in minutes. Turkey is UTC+3, so offset is -180.
    const offset = localDate.getTimezoneOffset();
    const localDateAdjusted = new Date(localDate.getTime() - (offset * 60 * 1000));
    const todayStr = localDateAdjusted.toISOString().split('T')[0];
    
    console.log(`Local adjusted today string: ${todayStr}`);
    
    // Seed today's visitors (51 unique visitors)
    const todayQueries = [];
    for (let i = 1; i <= 51; i++) {
        const ip = `192.168.1.${i}`;
        todayQueries.push(pool.query(
            'INSERT IGNORE INTO visitor_logs (ip_address, visit_date) VALUES (?, ?)',
            [ip, todayStr]
        ));
    }
    await Promise.all(todayQueries);
    console.log('Seeded today\'s 51 visitors.');

    // Seed historical visitors (4333 unique visitors over the last 30 days)
    console.log('Seeding 4,333 historical visitors...');
    const historicalQueries = [];
    let count = 0;
    
    // 30 days history
    for (let day = 1; day <= 30; day++) {
        const date = new Date(localDateAdjusted);
        date.setDate(date.getDate() - day);
        const dateStr = date.toISOString().split('T')[0];
        
        // Distribute 4333 visits across 30 days (about 144 visits per day)
        const visitsPerDay = day === 30 ? (4333 - (144 * 29)) : 144;
        
        for (let i = 1; i <= visitsPerDay; i++) {
            count++;
            const ip = `10.0.${day}.${i}`;
            historicalQueries.push(pool.query(
                'INSERT IGNORE INTO visitor_logs (ip_address, visit_date) VALUES (?, ?)',
                [ip, dateStr]
            ));
        }
    }
    
    await Promise.all(historicalQueries);
    console.log(`Successfully seeded ${count} historical visitors.`);
    
    // Verify count
    const [todayCountRow] = await pool.query('SELECT COUNT(*) as count FROM visitor_logs WHERE visit_date = CURDATE()');
    const [totalCountRow] = await pool.query('SELECT COUNT(*) as count FROM visitor_logs');
    
    console.log(`Today's visitor count in DB: ${todayCountRow[0].count}`);
    console.log(`Total visitor count in DB: ${totalCountRow[0].count}`);
    
    process.exit(0);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
