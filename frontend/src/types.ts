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
