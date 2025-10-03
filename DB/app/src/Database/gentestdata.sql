-- Генерация тестовых данных для StandartTraining
INSERT INTO StandartTraining (name, AdminID, CoachID, HallID, capacity, datetime, duration)
SELECT
    -- Генерация названий тренировок
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

    -- AdminID от 1 до 4 (циклически)
    (i % 4) + 1,

    -- CoachID от 1 до 4 (циклически)
    ((i + 1) % 4) + 1,

    -- HallID от 1 до 4 (циклически)
    ((i + 2) % 3) + 1,

    -- capacity от 5 до 20
    (random() * 15 + 5)::int,

    -- datetime в пределах 2023 года с 8:00 до 22:00
    TIMESTAMP '2023-01-01' +
    (random() * 365)::int * INTERVAL '1 day' +
    (8 + random() * 14)::int * INTERVAL '1 hour' +
    (random() * 60)::int * INTERVAL '1 minute',

    -- duration от 0.5 до 2.5 часов
    (random() * 2 + 0.5)::numeric(3,1)
FROM generate_series(1, 100000) AS i;  -- Вставляем 10,000 записей

-- Проверка количества добавленных записей
SELECT COUNT(*) FROM StandartTraining;