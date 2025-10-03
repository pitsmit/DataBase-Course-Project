import 'dotenv/config';
import {DBconnection} from "@repository/DBconnection";
import {Roles} from "@essences/Roles";


async function main() {
    const DB = new DBconnection();

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
        TIMESTAMP '2023-01-01' +
    (random() * 365)::int * INTERVAL '1 day' +
    (8 + random() * 14)::int * INTERVAL '1 hour' +
    (random() * 60)::int * INTERVAL '1 minute',
        (random() * 2 + 0.5)::numeric(3,1)
    FROM generate_series(1, $1) AS i;
`

    const client = await DB.getClient(Roles.admin);

    await client.query(GEN, [10]);
}


main()