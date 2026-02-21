CREATE OR REPLACE FUNCTION register_client_for_training(
    p_client_id INT,
    p_training_id INT
)
    RETURNS TABLE(success BOOLEAN, message TEXT)
    LANGUAGE plpgsql
AS $$
DECLARE
    v_capacity INT;
    v_count INT;
    v_already_registered BOOLEAN;
BEGIN
    SELECT capacity INTO v_capacity
    FROM standarttraining
    WHERE id = p_training_id AND datetime > now()
        FOR UPDATE;

    IF NOT FOUND THEN
        RETURN QUERY SELECT false, 'Тренировка не найдена или уже началась';
        RETURN;
    END IF;

    SELECT COUNT(*) INTO v_count
    FROM trainingsigns
    WHERE stdtrainingid = p_training_id;

    SELECT EXISTS (
        SELECT 1 FROM trainingsigns
        WHERE clientid = p_client_id AND stdtrainingid = p_training_id
    ) INTO v_already_registered;

    IF v_count >= v_capacity THEN
        RETURN QUERY SELECT false, 'Мест на данное мероприятие не осталось';
    ELSIF v_already_registered THEN
        RETURN QUERY SELECT false, 'Вы уже записаны на это мероприятие';
    ELSE
        INSERT INTO trainingsigns(clientid, stdtrainingid)
        VALUES (p_client_id, p_training_id);

        RETURN QUERY SELECT true, 'Вы успешно записаны';
    END IF;
END;
$$;