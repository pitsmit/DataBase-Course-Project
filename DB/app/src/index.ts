import 'dotenv/config';
import { Person } from "@essences/person";
import {AdminExperience, ClientExperience, CoachExperience, VisitorExperience} from "@front/Experience";
import { Facade } from "@facade/Facade";

async function bootstrap(): Promise<void> {
    try {
        const visitor = new Person(0, ``, ``, ``, -1);
        const admin = new Person(3, "Евгений", "Матусов", "evgmatss", 0);
        const client = new Person(4, "Владимир", "Новиков", "vldmrnov", 1);
        const coach = new Person(6, "Андрей", "Кондукторов", "oltpzss4", 2);
        const facade = new Facade();

        /// client
        /// vldmrnov
        /// v8chr1435

        /// admin
        /// evgmatss
        /// anapa2007ws

        /// coach
        /// oltpzss4
        /// wzstmk28

        const app = new VisitorExperience(facade, visitor);
        //const app = new AdminExperience(facade, admin);
        //const app = new ClientExperience(facade, client);
        await app.main();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

process.on('SIGINT', () => {
    process.exit(0);
});

process.on('SIGTERM', () => {
    process.exit(0);
});

bootstrap()
    .catch(error => {
        console.error(error);
        process.exit(1);
    });


/*import 'dotenv/config';
import { DBconnection } from "@repository/DBconnection";
import * as fs from "node:fs";
import * as path from "node:path";

class ResearchLogger {
    private static readonly LOG_FILE = path.join(__dirname, 'index_research_results.log');
    private static readonly SEPARATOR = '--------------------------------------------------';

    static initialize() {
        fs.writeFileSync(this.LOG_FILE, '');
        this.log('Инициализация логгера исследования индексов\n');
    }

    static logSize(size: number) {
        this.log(`\nТЕСТИРОВАНИЕ ДЛЯ РАЗМЕРА ДАННЫХ: ${size.toLocaleString()} записей`);
    }

    static logTestResults(
        testName: string,
        noIndexPlan: number,
        withIndexPlan: number,
        noIndexExec: number,
        withIndexExec: number
    ) {
        this.log(`\nРезультаты теста ${testName}:`);
        this.log(`  Время планирования: Без индекса ${noIndexPlan.toFixed(4)}ms | С индексом ${withIndexPlan.toFixed(4)}ms`);
        this.log(`  Время выполнения:   Без индекса ${noIndexExec.toFixed(4)}ms | С индексом ${withIndexExec.toFixed(4)}ms`);
        this.log(`  Ускорение:          Планирование ${(noIndexPlan / withIndexPlan).toFixed(2)}x | Выполнение ${(noIndexExec / withIndexExec).toFixed(2)}x`);
    }

    static logSeparator() {
        this.log(`\n${this.SEPARATOR}\n`);
    }

    private static log(message: string) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${message}\n`;

        fs.appendFileSync(this.LOG_FILE, logMessage, { encoding: 'utf8' });
        console.log(message);
    }
}

async function runResearch() {
    const DB = new DBconnection();
    const client = await DB.pool.connect();

    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS StandartTraining_noindex AS 
            SELECT * FROM StandartTraining;
        `);

        await client.query('VACUUM ANALYZE StandartTraining');
        await client.query('VACUUM ANALYZE StandartTraining_noindex');

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_stdtraining_name_btree 
            ON StandartTraining USING BTREE(name);
            
            CREATE INDEX IF NOT EXISTS idx_stdtraining_datetime_hash 
            ON StandartTraining USING HASH(datetime);
            
            CREATE INDEX IF NOT EXISTS idx_stdtraining_coach_hall_gin 
            ON StandartTraining USING GIN((array[CoachID, HallID]));
        `);

        // 3. Выполняем тесты и собираем результаты
        const results = {
            btreeTest: {} as any,
            hashTest: {} as any,
            ginTest: {} as any
        };

        // Тест 1: B-tree индекс по имени
        const btreeNoIndex = await client.query(`
            EXPLAIN ANALYZE SELECT * FROM StandartTraining_noindex 
            WHERE name = 'Йога для начинающих';
        `);
        results.btreeTest.noIndex = btreeNoIndex.rows;

        const btreeWithIndex = await client.query(`
            EXPLAIN ANALYZE SELECT * FROM StandartTraining 
            WHERE name = 'Йога для начинающих';
        `);
        results.btreeTest.withIndex = btreeWithIndex.rows;

        // Тест 2: Hash индекс по дате/времени
        const hashNoIndex = await client.query(`
            EXPLAIN ANALYZE SELECT * FROM StandartTraining_noindex 
            WHERE datetime = '2025-06-01 10:00:00';
        `);
        results.hashTest.noIndex = hashNoIndex.rows;

        const hashWithIndex = await client.query(`
            EXPLAIN ANALYZE SELECT * FROM StandartTraining 
            WHERE datetime = '2025-06-01 10:00:00';
        `);
        results.hashTest.withIndex = hashWithIndex.rows;

        // Тест 3: GIN индекс для составного поиска
        const ginNoIndex = await client.query(`
            EXPLAIN ANALYZE SELECT * FROM StandartTraining_noindex 
            WHERE CoachID = 2 AND HallID = 3;
        `);
        results.ginTest.noIndex = ginNoIndex.rows;

        const ginWithIndex = await client.query(`
            EXPLAIN ANALYZE SELECT * FROM StandartTraining 
            WHERE array[CoachID, HallID] @> array[2, 3];
        `);
        results.ginTest.withIndex = ginWithIndex.rows;

        // 4. Очищаем временные объекты
        await client.query(`
            DROP TABLE IF EXISTS StandartTraining_noindex;
            DROP INDEX IF EXISTS idx_stdtraining_name_btree;
            DROP INDEX IF EXISTS idx_stdtraining_datetime_hash;
            DROP INDEX IF EXISTS idx_stdtraining_coach_hall_gin;
            TRUNCATE TABLE StandartTraining RESTART IDENTITY CASCADE ;
        `);

        return results;

    } finally {
        client.release();
    }
}

function extract(res: any) {
    let need = res.slice(-2);
    let arr = []
    for (let i = 0; i < 2; i++) {
        arr.push(parseFloat(need[i]['QUERY PLAN'].split(/\s+/)[2]));
    }

    return arr;
}

async function main() {
    ResearchLogger.initialize();
    const DB = new DBconnection();
    const client = await DB.pool.connect();
    await client.query('SET max_parallel_workers_per_gather = 0');

    try {
        const GEN = `
            INSERT INTO StandartTraining (name, AdminID, CoachID, HallID, capacity, datetime, duration)
            SELECT
                CASE (i % 10)
                    WHEN 0 THEN 'Йога для начинающих'
                    WHEN 1 THEN 'Интенсивный кроссфит'
                    WHEN 2 THEN 'Пилатес утренний'
                    WHEN 3 THEN 'Силовая тренировка'
                    WHEN 4 THEN 'Стретчинг вечерний'
                    WHEN 5 THEN 'Функциональный тренинг'
                    WHEN 6 THEN 'Танцевальная аэробика'
                    WHEN 7 THEN 'Бокс продвинутый'
                    WHEN 8 THEN 'Зумба фитнес'
                    WHEN 9 THEN 'Кикбоксинг базовый'
                    END,
                (i % 4) + 1,
                ((i + 1) % 4) + 1,
                ((i + 2) % 3) + 1,
                (random() * 15 + 5)::int,
                TIMESTAMP '2025-01-01' + 
                (random() * 365)::int * INTERVAL '1 day' +
                (8 + random() * 14)::int * INTERVAL '1 hour' +
                (random() * 60)::int * INTERVAL '1 minute',
                (random() * 2 + 0.5)::numeric(3,1)
            FROM generate_series(1, $1) AS i;
        `;

        const sizes: number[] = [200, 500, 1000, 2000, 5000, 10000, 25000, 50000, 75000, 100000, 200000, 300000, 400000, 500000]
        const count_repeats: number = 10;

        for (const size of sizes) {
            let btreeTest_noIndex_plan_sum: number = 0;
            let btreeTest_noIndex_exe_sum: number = 0;
            let btreeTest_withIndex_plan_sum: number = 0;
            let btreeTest_withIndex_exe_sum: number = 0;

            let hashTest_noIndex_plan_sum: number = 0;
            let hashTest_noIndex_exe_sum: number = 0;
            let hashTest_withIndex_plan_sum: number = 0;
            let hashTest_withIndex_exe_sum: number = 0;

            let ginTest_noIndex_plan_sum: number = 0;
            let ginTest_noIndex_exe_sum: number = 0;
            let ginTest_withIndex_plan_sum: number = 0;
            let ginTest_withIndex_exe_sum: number = 0;
            for (let i = 0; i < count_repeats; i++) {
                await client.query(GEN, [size]);
                const researchResults = await runResearch();

                const btreeTest_noIndex: number[] = extract(researchResults.btreeTest.noIndex);
                const btreeTest_withIndex: number[] = extract(researchResults.btreeTest.withIndex);

                const hashTest_noIndex: number[] = extract(researchResults.hashTest.noIndex);
                const hashTest_withIndex: number[] = extract(researchResults.hashTest.withIndex);

                const ginTest_noIndex: number[] = extract(researchResults.ginTest.noIndex);
                const ginTest_withIndex: number[] = extract(researchResults.ginTest.withIndex);

                btreeTest_noIndex_plan_sum += btreeTest_noIndex[0];
                btreeTest_noIndex_exe_sum += btreeTest_noIndex[1];
                btreeTest_withIndex_plan_sum += btreeTest_withIndex[0];
                btreeTest_withIndex_exe_sum += btreeTest_withIndex[1];

                hashTest_noIndex_plan_sum += hashTest_noIndex[0];
                hashTest_noIndex_exe_sum += hashTest_noIndex[1];
                hashTest_withIndex_plan_sum += hashTest_withIndex[0];
                hashTest_withIndex_exe_sum += hashTest_withIndex[1];

                ginTest_noIndex_plan_sum += ginTest_noIndex[0];
                ginTest_noIndex_exe_sum += ginTest_noIndex[1];
                ginTest_withIndex_plan_sum += ginTest_withIndex[0];
                ginTest_withIndex_exe_sum += ginTest_withIndex[1];
            }

            btreeTest_noIndex_plan_sum /= count_repeats;
            btreeTest_noIndex_exe_sum /= count_repeats;
            btreeTest_withIndex_plan_sum /= count_repeats;
            btreeTest_withIndex_exe_sum /= count_repeats;

            hashTest_noIndex_plan_sum /= count_repeats;
            hashTest_noIndex_exe_sum /= count_repeats;
            hashTest_withIndex_plan_sum /= count_repeats;
            hashTest_withIndex_exe_sum /= count_repeats;

            ginTest_noIndex_plan_sum /= count_repeats;
            ginTest_noIndex_exe_sum /= count_repeats;
            ginTest_withIndex_plan_sum /= count_repeats;
            ginTest_withIndex_exe_sum /= count_repeats;

            ResearchLogger.logSize(size);

            ResearchLogger.logTestResults(
                'B-Tree индекс (по имени)',
                btreeTest_noIndex_plan_sum,
                btreeTest_withIndex_plan_sum,
                btreeTest_noIndex_exe_sum,
                btreeTest_withIndex_exe_sum
            );

            ResearchLogger.logTestResults(
                'Hash индекс (по дате/времени)',
                hashTest_noIndex_plan_sum,
                hashTest_withIndex_plan_sum,
                hashTest_noIndex_exe_sum,
                hashTest_withIndex_exe_sum
            );

            ResearchLogger.logTestResults(
                'GIN индекс (составной)',
                ginTest_noIndex_plan_sum,
                ginTest_withIndex_plan_sum,
                ginTest_noIndex_exe_sum,
                ginTest_withIndex_exe_sum
            );

            ResearchLogger.logSeparator();
        }
    } finally {
        client.release();
    }
}

main().catch(console.error);*/