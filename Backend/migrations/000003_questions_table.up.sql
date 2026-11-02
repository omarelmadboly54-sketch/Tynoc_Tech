CREATE TABLE IF NOT EXISTS questions(
    id BIGSERIAL PRIMARY KEY,
    form_id BIGINT NOT NULL,
    question_text VARCHAR(500) NOT NULL,
    question_type VARCHAR(50) NOT NULL,
    options JSONB,
    position INT NOT NULL,
    is_required BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    Foreign Key (form_id) REFERENCES forms(id) ON DELETE CASCADE,
    CONSTRAINT question_type_check
    CHECK (question_type IN ('text', 'email', 'multiple_choice', 'yes_no'))
);


