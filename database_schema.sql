
-- EXISTING TABLES (keeping from your current schema)
-- defaults, failed_jobs, jobs, migrations, notify_links, password_reset_tokens,
-- personal_access_tokens, roles, themes, companies, users, workflows, documents, 
-- instances, workflow_permissions

-- New tables for the AI agent management platform

-- Service Categories Table
CREATE TABLE service_categories (
    id CHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    icon VARCHAR(255) NULL, -- For category icon
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    company_id CHAR(36) NULL,
    CONSTRAINT service_categories_company_id_foreign
        FOREIGN KEY (company_id) REFERENCES companies (id)
            ON DELETE SET NULL
) COLLATE = utf8mb4_unicode_ci;

-- Services Table
CREATE TABLE services (
    id CHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    category_id CHAR(36) NOT NULL,
    cost_structure VARCHAR(255) NULL,
    cost_per_unit VARCHAR(255) NULL,
    has_freetier BOOLEAN DEFAULT 0 NOT NULL,
    logo VARCHAR(255) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    company_id CHAR(36) NULL,
    CONSTRAINT services_category_id_foreign
        FOREIGN KEY (category_id) REFERENCES service_categories (id)
            ON DELETE CASCADE,
    CONSTRAINT services_company_id_foreign
        FOREIGN KEY (company_id) REFERENCES companies (id)
            ON DELETE SET NULL
) COLLATE = utf8mb4_unicode_ci;

-- LLM Models Table
CREATE TABLE llm_models (
    id CHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    input_cost DECIMAL(20, 10) NOT NULL,
    output_cost DECIMAL(20, 10) NOT NULL,
    max_context VARCHAR(255) NULL,
    logo VARCHAR(255) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    company_id CHAR(36) NULL,
    CONSTRAINT llm_models_company_id_foreign
        FOREIGN KEY (company_id) REFERENCES companies (id)
            ON DELETE SET NULL
) COLLATE = utf8mb4_unicode_ci;

-- LLM Model Strengths
CREATE TABLE llm_model_strengths (
    id CHAR(36) NOT NULL PRIMARY KEY,
    model_id CHAR(36) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT llm_model_strengths_model_id_foreign
        FOREIGN KEY (model_id) REFERENCES llm_models (id)
            ON DELETE CASCADE
) COLLATE = utf8mb4_unicode_ci;

-- LLM Model Limitations
CREATE TABLE llm_model_limitations (
    id CHAR(36) NOT NULL PRIMARY KEY,
    model_id CHAR(36) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT llm_model_limitations_model_id_foreign
        FOREIGN KEY (model_id) REFERENCES llm_models (id)
            ON DELETE CASCADE
) COLLATE = utf8mb4_unicode_ci;

-- Agents Table
CREATE TABLE agents (
    id CHAR(36) NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    version VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255) NULL,
    description TEXT NULL,
    logo VARCHAR(255) NULL,
    is_active BOOLEAN DEFAULT 1 NOT NULL,
    total_cost DECIMAL(10, 2) DEFAULT 0 NOT NULL,
    service_cost DECIMAL(10, 2) DEFAULT 0 NOT NULL,
    llm_cost DECIMAL(10, 2) DEFAULT 0 NOT NULL,
    prompt TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    company_id CHAR(36) NULL,
    CONSTRAINT agents_company_id_foreign
        FOREIGN KEY (company_id) REFERENCES companies (id)
            ON DELETE SET NULL
) COLLATE = utf8mb4_unicode_ci;

-- Agent Scores Table
CREATE TABLE agent_scores (
    id CHAR(36) NOT NULL PRIMARY KEY,
    agent_id CHAR(36) NOT NULL,
    quality DECIMAL(3, 1) DEFAULT 0 NOT NULL,
    speed DECIMAL(3, 1) DEFAULT 0 NOT NULL,
    saving DECIMAL(3, 1) DEFAULT 0 NOT NULL,
    privacy DECIMAL(3, 1) DEFAULT 0 NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT agent_scores_agent_id_foreign
        FOREIGN KEY (agent_id) REFERENCES agents (id)
            ON DELETE CASCADE
) COLLATE = utf8mb4_unicode_ci;

-- Agent Services Association Table
CREATE TABLE agent_services (
    id CHAR(36) NOT NULL PRIMARY KEY,
    agent_id CHAR(36) NOT NULL,
    service_id CHAR(36) NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT agent_services_agent_id_foreign
        FOREIGN KEY (agent_id) REFERENCES agents (id)
            ON DELETE CASCADE,
    CONSTRAINT agent_services_service_id_foreign
        FOREIGN KEY (service_id) REFERENCES services (id)
            ON DELETE CASCADE
) COLLATE = utf8mb4_unicode_ci;

-- Agent LLM Models Association Table
CREATE TABLE agent_llm_models (
    id CHAR(36) NOT NULL PRIMARY KEY,
    agent_id CHAR(36) NOT NULL,
    llm_model_id CHAR(36) NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT agent_llm_models_agent_id_foreign
        FOREIGN KEY (agent_id) REFERENCES agents (id)
            ON DELETE CASCADE,
    CONSTRAINT agent_llm_models_llm_model_id_foreign
        FOREIGN KEY (llm_model_id) REFERENCES llm_models (id)
            ON DELETE CASCADE
) COLLATE = utf8mb4_unicode_ci;

-- Agent Nodes (for agent workflows)
CREATE TABLE agent_nodes (
    id CHAR(36) NOT NULL PRIMARY KEY,
    agent_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    cost DECIMAL(10, 2) DEFAULT 0 NOT NULL,
    calls INT DEFAULT 0 NOT NULL,
    tokens INT DEFAULT 0 NOT NULL,
    quality DECIMAL(3, 1) NULL,
    speed DECIMAL(3, 1) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT agent_nodes_agent_id_foreign
        FOREIGN KEY (agent_id) REFERENCES agents (id)
            ON DELETE CASCADE
) COLLATE = utf8mb4_unicode_ci;

-- Agent Categories Distribution
CREATE TABLE agent_categories_distribution (
    id CHAR(36) NOT NULL PRIMARY KEY,
    agent_id CHAR(36) NOT NULL,
    category_id CHAR(36) NOT NULL,
    percentage INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT agent_categories_distribution_agent_id_foreign
        FOREIGN KEY (agent_id) REFERENCES agents (id)
            ON DELETE CASCADE,
    CONSTRAINT agent_categories_distribution_category_id_foreign
        FOREIGN KEY (category_id) REFERENCES service_categories (id)
            ON DELETE CASCADE
) COLLATE = utf8mb4_unicode_ci;

-- Agent Sessions Table
CREATE TABLE agent_sessions (
    id CHAR(36) NOT NULL PRIMARY KEY,
    agent_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    date TIMESTAMP NOT NULL,
    total_cost DECIMAL(10, 2) DEFAULT 0 NOT NULL,
    llm_cost DECIMAL(10, 2) DEFAULT 0 NOT NULL,
    services_cost DECIMAL(10, 2) DEFAULT 0 NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT agent_sessions_agent_id_foreign
        FOREIGN KEY (agent_id) REFERENCES agents (id)
            ON DELETE CASCADE,
    CONSTRAINT agent_sessions_user_id_foreign
        FOREIGN KEY (user_id) REFERENCES users (id)
            ON DELETE CASCADE
) COLLATE = utf8mb4_unicode_ci;

-- Session Services Association Table
CREATE TABLE session_services (
    id CHAR(36) NOT NULL PRIMARY KEY,
    session_id CHAR(36) NOT NULL,
    service_id CHAR(36) NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT session_services_session_id_foreign
        FOREIGN KEY (session_id) REFERENCES agent_sessions (id)
            ON DELETE CASCADE,
    CONSTRAINT session_services_service_id_foreign
        FOREIGN KEY (service_id) REFERENCES services (id)
            ON DELETE CASCADE
) COLLATE = utf8mb4_unicode_ci;

-- Session LLM Models Association Table
CREATE TABLE session_llm_models (
    id CHAR(36) NOT NULL PRIMARY KEY,
    session_id CHAR(36) NOT NULL,
    llm_model_id CHAR(36) NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT session_llm_models_session_id_foreign
        FOREIGN KEY (session_id) REFERENCES agent_sessions (id)
            ON DELETE CASCADE,
    CONSTRAINT session_llm_models_llm_model_id_foreign
        FOREIGN KEY (llm_model_id) REFERENCES llm_models (id)
            ON DELETE CASCADE
) COLLATE = utf8mb4_unicode_ci;
