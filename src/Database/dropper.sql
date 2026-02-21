-- Отключаем проверку внешних ключей для безопасного удаления
SET session_replication_role = replica;

-- Удаление таблиц в обратном порядке создания (от зависимых к основным)
DROP TABLE IF EXISTS
    IndividualTraining,
    TrainingSigns,
    HallSchedule,
    StandartTraining,
    ClientDynamic,
    ClientDynamicTypes,
    Client,
    CoachSchedule,
    CoachSpecialization,
    CoachSpecializationTypes,
    Coach,
    Admin,
    Hall;

-- Включаем проверку внешних ключей обратно
SET session_replication_role = DEFAULT;