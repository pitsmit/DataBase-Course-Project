import psycopg2
import time

# SQL-запрос с параметром %s для количества записей
GEN = """
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
FROM generate_series(1, %s) AS i;
"""

if __name__ == "__main__":
    DB_HOST = "localhost"
    DB_PORT = "5432"
    DB_USER = "postgres"
    DB_PASSWORD = "1234"
    DB_NAME = "postgres"

    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            dbname=DB_NAME,
            connect_timeout=3
        )

        with conn.cursor() as cursor:
            # Очищаем таблицу перед началом
            #cursor.execute("TRUNCATE TABLE StandartTraining CASCADE ;")
            conn.commit()

            # Цикл с разным количеством записей (100, 1000, 10000, 100000)
            for num_records in [100, 1000, 10000, 100000]:
                start_time = time.time()

                # Выполняем вставку с текущим количеством записей
                cursor.execute(GEN, (num_records,))
                conn.commit()

                # Проверяем количество записей
                cursor.execute("SELECT COUNT(*) FROM StandartTraining;")
                count = cursor.fetchone()[0]

                elapsed_time = time.time() - start_time
                print(f"Добавлено {num_records} записей. Всего в таблице: {count}. Время: {elapsed_time:.2f} сек.")

                # Можно добавить паузу между итерациями
                # time.sleep(1)

    except psycopg2.Error as e:
        print(f"Ошибка подключения к базе данных: {e}")
    finally:
        if conn:
            conn.close()