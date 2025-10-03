-- Отключаем проверку внешних ключей
SET session_replication_role = replica;

-- Удаление всех ограничений внешнего ключа
DO $$
    DECLARE
        r RECORD;
    BEGIN
        -- Удаляем foreign key constraints
        FOR r IN (
            SELECT conname, conrelid::regclass AS table_name
            FROM pg_constraint
            WHERE contype = 'f'
              AND conrelid::regclass IN (
                                         'trainingsigns', 'individualtraining', 'standarttraining',
                                         'hallschedule', 'clientdynamic', 'coachschedule',
                                         'coachspecialization', 'client', 'coach', 'admin',
                                         'clientdynamictypes', 'coachspecializationtypes', 'hall'
                )
        ) LOOP
                EXECUTE 'ALTER TABLE ' || r.table_name || ' DROP CONSTRAINT ' || r.conname;
            END LOOP;

        -- Удаляем check constraints
        FOR r IN (
            SELECT conname, conrelid::regclass AS table_name
            FROM pg_constraint
            WHERE contype = 'c'
              AND conrelid::regclass IN (
                                         'coach', 'client', 'admin', 'standarttraining'
                )
        ) LOOP
                EXECUTE 'ALTER TABLE ' || r.table_name || ' DROP CONSTRAINT ' || r.conname;
            END LOOP;
    END $$;

-- Удаление данных из всех таблиц
TRUNCATE TABLE TrainingSigns;
TRUNCATE TABLE IndividualTraining;
TRUNCATE TABLE StandartTraining;
TRUNCATE TABLE HallSchedule;
TRUNCATE TABLE ClientDynamic;
TRUNCATE TABLE CoachSchedule;
TRUNCATE TABLE CoachSpecialization;
TRUNCATE TABLE Client;
TRUNCATE TABLE Coach;
TRUNCATE TABLE Admin;
TRUNCATE TABLE ClientDynamicTypes;
TRUNCATE TABLE CoachSpecializationTypes;
TRUNCATE TABLE Hall;

-- Сбрасываем последовательности
ALTER SEQUENCE Coach_ID_seq RESTART WITH 1;
ALTER SEQUENCE CoachSpecializationTypes_ID_seq RESTART WITH 1;
ALTER SEQUENCE CoachSpecialization_ID_seq RESTART WITH 1;
ALTER SEQUENCE CoachSchedule_ID_seq RESTART WITH 1;
ALTER SEQUENCE Client_ID_seq RESTART WITH 1;
ALTER SEQUENCE ClientDynamicTypes_ID_seq RESTART WITH 1;
ALTER SEQUENCE ClientDynamic_ID_seq RESTART WITH 1;
ALTER SEQUENCE Admin_ID_seq RESTART WITH 1;
ALTER SEQUENCE StandartTraining_ID_seq RESTART WITH 1;
ALTER SEQUENCE Hall_ID_seq RESTART WITH 1;
ALTER SEQUENCE HallSchedule_ID_seq RESTART WITH 1;
ALTER SEQUENCE TrainingSigns_ID_seq RESTART WITH 1;
ALTER SEQUENCE IndividualTraining_ID_seq RESTART WITH 1;

-- Включаем проверку внешних ключей обратно
SET session_replication_role = DEFAULT;

COMMIT;

COPY admin(name, surname, login, password) FROM 'C:\Users\User\Desktop\uni\DB\app\csv\admin.csv'  DELIMITER ',';
COPY coach(name, surname, login, password) FROM 'C:\Users\User\Desktop\uni\DB\app\csv\coach.csv' DELIMITER ',';
COPY coachschedule(coachid, date, start, stop) FROM 'C:\Users\User\Desktop\uni\DB\app\csv\coachschedule.csv' DELIMITER ',';
COPY client(name, surname, login, password) FROM 'C:\Users\User\Desktop\uni\DB\app\csv\client.csv' DELIMITER ',';
COPY hall(name) FROM 'C:\Users\User\Desktop\uni\DB\app\csv\hall.csv' DELIMITER ',';
COPY hallschedule(hallid, date, start, stop) FROM 'C:\Users\User\Desktop\uni\DB\app\csv\hallschedule.csv' DELIMITER ',';

COPY clientdynamictypes(name, unit) FROM 'C:\Users\User\Desktop\uni\DB\app\csv\clientdynamictypes.csv' DELIMITER ',';
COPY coachspecializationtypes(name, hallid) FROM 'C:\Users\User\Desktop\uni\DB\app\csv\coachspecializationtypes.csv' DELIMITER ',';
COPY coachspecialization(specid, coachid) FROM 'C:\Users\User\Desktop\uni\DB\app\csv\coachspecialization.csv' DELIMITER ',';
COPY individualtraining(coachid, clientid, hallid, datetime, duration, notes) FROM 'C:\Users\User\Desktop\uni\DB\app\csv\individualtraining.csv' DELIMITER ',';

COPY clientdynamic(clientid, dynamictypeid, value, date) FROM 'C:\Users\User\Desktop\uni\DB\app\csv\clientdynamic.csv' DELIMITER ',';
COPY standarttraining(name, adminid, coachid, hallid, capacity, datetime, duration) FROM 'C:\Users\User\Desktop\uni\DB\app\csv\standarttraining.csv' DELIMITER ',';
COPY trainingsigns(clientid, stdtrainingid) FROM 'C:\Users\User\Desktop\uni\DB\app\csv\trainingsigns.csv' DELIMITER ',';