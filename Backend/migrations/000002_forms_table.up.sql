CREATE TABLE IF NOT EXISTS forms(
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255)NOT NULL,
    description VARCHAR(255)NOT NULL,
    is_public BOOLEAN NOT NULL,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    Foreign Key (created_by) REFERENCES users(id) ON DELETE CASCADE
);
