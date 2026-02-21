EXPLAIN ANALYZE SELECT * FROM StandartTraining 
                WHERE array[CoachID, HallID] @> array[2, 3];