export enum QuestionType {
    ONE_QUESTION = 0,
    MULTI_QUESTION = 1,
    FREE_INPUT = 2,
    SCALE = 3,
    SEQUENCE = 4,
}

export type Question = {
    id: number;
    content: string;
    type: QuestionType;
    answers_amount: number;
    survey_id: number;
    t_created_at: Date;
    t_updated_at: Date;
    t_deleted: boolean;
    image: number | null;
    image_url: string | null;
};

export type AnswerVariant = {
    id: number;
    content: string;
    t_created_at: Date;
    t_updated_at: Date;
    t_deleted: boolean;
    question_id: number;
};

export type Survey = {
    id: number;
    name: string;
    description: string;
    questions_amount: number;
    answers_amount: number;
    created_by: number;
    organisation_id: number;
    t_created_at: Date;
    t_updated_at: Date;
    t_deleted: boolean;
};

export type Tag = {
    id: number;
    name: string;
    t_created_at: Date;
    t_updated_at: Date;
    t_deleted: boolean;
};

export type Organisation = {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    web_site: string | null;
    inn: string | null;
    t_created_at: Date;
    t_updated_at: Date;
    t_deleted: boolean;
    logo: number | null;
    logo_url: string | null;
};
