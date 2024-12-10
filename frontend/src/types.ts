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
    type: string;
    answers_amount: number;
    survey_id: number;
    t_created_at: string;
    t_updated_at: string;
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

export type Answer = {
    id: number;
    answer_variant_id: number;
    content: string;
    priority?: number;
    question_id: number;
    t_created_at: Date;
    t_updated_at: Date;
    t_deleted: boolean;
};

export type SurveyReport = {
    survey: Survey;
    questions: {
        question: Question;
        answers: Answer[];
        answer_variants: AnswerVariant[];
    }[];
};

export type User = {
    id: number;
    login: string;
    email: string;
    t_created_at: Date;
    t_updated_at: Date;
    t_deleted: boolean;
};

export type Profile = {
    user_id: number;
    profession: string;
    birth_date: Date;
    education_level: string;
    marital_status: string;
};
