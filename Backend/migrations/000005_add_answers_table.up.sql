CREATE TABLE IF NOT EXISTS answers(
    id BIGSERIAL PRIMARY KEY,
    submission_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    answer VARCHAR(255) NOT NULL,
    Foreign Key (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
    Foreign Key (question_id) REFERENCES questions(id) ON DELETE CASCADE
);