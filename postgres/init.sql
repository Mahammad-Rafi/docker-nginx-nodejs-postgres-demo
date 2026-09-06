CREATE TABLE IF NOT EXISTS users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email)
VALUES
    ('Aisha Khan', 'aisha.khan@example.com'),
    ('Omar Hassan', 'omar.hassan@example.com'),
    ('Maya Patel', 'maya.patel@example.com'),
    ('Daniel Kim', 'daniel.kim@example.com'),
    ('Sofia Martinez', 'sofia.martinez@example.com')
ON CONFLICT (email) DO NOTHING;

