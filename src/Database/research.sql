-- 1. Подготовка тестовой среды
CREATE TABLE IF NOT EXISTS StandartTraining_noindex AS SELECT * FROM StandartTraining;

-- 2. Создание разных типов индексов на основной таблице
CREATE INDEX IF NOT EXISTS idx_stdtraining_name_btree ON StandartTraining USING BTREE(name);
CREATE INDEX IF NOT EXISTS idx_stdtraining_datetime_hash ON StandartTraining USING HASH(datetime);
CREATE INDEX IF NOT EXISTS idx_stdtraining_coach_hall_gin ON StandartTraining USING GIN((array[CoachID, HallID]));

-- 3. Тестирование производительности

-- Тест 1: B-tree индекс по имени
-- Без индекса
EXPLAIN ANALYZE SELECT * FROM StandartTraining_noindex WHERE name = 'Йога для начинающих';
-- С B-tree индексом
EXPLAIN ANALYZE SELECT * FROM StandartTraining WHERE name = 'Йога для начинающих';

-- Тест 2: Hash индекс по дате/времени
-- Без индекса
EXPLAIN ANALYZE SELECT * FROM StandartTraining_noindex WHERE datetime = '2023-06-15 10:00:00';
-- С Hash индексом
EXPLAIN ANALYZE SELECT * FROM StandartTraining WHERE datetime = '2023-06-15 10:00:00';

-- Тест 3: GIN индекс для составного поиска (тренер + зал)
-- Без индекса
EXPLAIN ANALYZE SELECT * FROM StandartTraining_noindex WHERE CoachID = 2 AND HallID = 3;
-- С GIN индексом
EXPLAIN ANALYZE SELECT * FROM StandartTraining WHERE array[CoachID, HallID] @> array[2, 3];

-- 5. Очистка (раскомментировать для выполнения после исследования)
DROP TABLE StandartTraining_noindex;
DROP INDEX idx_stdtraining_name_btree;
DROP INDEX idx_stdtraining_datetime_hash;
DROP INDEX idx_stdtraining_coach_hall_gin;


TRUNCATE TABLE standarttraining cascade;