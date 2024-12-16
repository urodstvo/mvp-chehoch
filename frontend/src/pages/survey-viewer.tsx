import { PageLayout, PageMiddleColumn } from '@/components/layout';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { usePageTitle } from '@/hooks/use-page-title';
import { ConfirmExit } from '@/components/ConfirmExit';
import { cn } from '@/lib/utils';
import { AnswerVariant, Question, QuestionType, Survey, Tag } from '@/types';
import { ArrowRight, BadgeIcon } from 'lucide-react';
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { api } from '@/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

type CurrentQuestionNumberProps = {
    currentQuestionNumber: number;
    setCurrentQuestionNumber: Dispatch<SetStateAction<number>>;
};

const CurrentQuestionNumberContext = createContext<CurrentQuestionNumberProps>({
    currentQuestionNumber: 0,
    setCurrentQuestionNumber: () => {},
});

const useCurrentQuestionNumberContext = () => useContext(CurrentQuestionNumberContext);

type AnswersProps = {
    answer: {
        answer_variant_id?: number;
        priority?: number;
        content: string;
    }[];
    setAnswer: Dispatch<
        SetStateAction<
            {
                answer_variant_id?: number;
                priority?: number;
                content: string;
            }[]
        >
    >;
};

const AnswerContext = createContext<AnswersProps>({
    answer: [],
    setAnswer: () => {},
});

const useAnswerContext = () => useContext(AnswerContext);

type IsNextQuestionAvailableProps = {
    isNextQuestionAvailable: boolean;
    setIsNextQuestionAvailable: Dispatch<SetStateAction<boolean>>;
};

const IsNextQuestionAvailableContext = createContext<IsNextQuestionAvailableProps>({
    isNextQuestionAvailable: false,
    setIsNextQuestionAvailable: () => {},
});

const useIsNextQuestionAvailableContext = () => useContext(IsNextQuestionAvailableContext);

const storedCurrentQuestionNumber = sessionStorage.getItem('currentQuestionNumber');

const SurveyPageProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState(
        storedCurrentQuestionNumber ? parseInt(storedCurrentQuestionNumber) : 0
    );
    const [isNextQuestionAvailable, setIsNextQuestionAvailable] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const prevcur = parseInt(sessionStorage.getItem('currentQuestionNumber') || '0');
        sessionStorage.setItem('currentQuestionNumber', currentQuestionNumber.toString());
        if (prevcur > currentQuestionNumber) {
            navigate('/');
        }
    }, [currentQuestionNumber, navigate]);

    const [answer, setAnswer] = useState<
        {
            answer_variant_id?: number;
            priority?: number;
            content: string;
        }[]
    >([]);

    return (
        <CurrentQuestionNumberContext.Provider value={{ currentQuestionNumber, setCurrentQuestionNumber }}>
            <IsNextQuestionAvailableContext.Provider value={{ isNextQuestionAvailable, setIsNextQuestionAvailable }}>
                <AnswerContext.Provider value={{ answer, setAnswer }}>{children}</AnswerContext.Provider>
            </IsNextQuestionAvailableContext.Provider>
        </CurrentQuestionNumberContext.Provider>
    );
};

export const SurveyViewerPage = () => {
    const { surveyId } = useParams();
    usePageTitle(`Прохождение опроса  ${surveyId}`);

    const { data } = useQuery({
        queryKey: ['survey', surveyId],
        queryFn: () =>
            api.get<{
                survey: Survey;
                tags: Tag[];
            }>(`/survey/${surveyId}`),
        select: (data) => data.data,
    });

    return (
        <SurveyPageProvider>
            <PageLayout>
                <PageMiddleColumn>
                    <div className='rounded-lg bg-slate-50 p-2 '>{data?.survey.name}</div>
                    <SurveyViewerPageContent />
                </PageMiddleColumn>
            </PageLayout>
        </SurveyPageProvider>
    );
};

const SurveyViewerPageContent = () => {
    const { surveyId } = useParams();
    const { currentQuestionNumber } = useCurrentQuestionNumberContext();
    const { data } = useQuery({
        queryKey: ['survey', 'questions', surveyId],
        queryFn: () => api.get<Question[]>(`/question/${surveyId}`),
        select: (data) =>
            data.data.sort((a, b) => new Date(a.t_created_at).getTime() - new Date(b.t_created_at).getTime()),
    });

    const totalQuestion = data?.length || 0;

    return (
        <>
            <ConfirmExit
                when={currentQuestionNumber > 0}
                action={() => sessionStorage.removeItem('currentQuestionNumber')}
            />

            <div className='flex gap-1 mt-[24px] mb-2'>
                {new Array(totalQuestion).fill(0).map((_, index) => (
                    <QuestionMark
                        key={index}
                        totalQuestion={totalQuestion}
                        status={
                            index === currentQuestionNumber
                                ? 'current'
                                : index < currentQuestionNumber
                                ? 'passed'
                                : 'unpassed'
                        }
                    />
                ))}
            </div>
            <div className='flex justify-center mb-[64px]'>
                {currentQuestionNumber + 1} / {totalQuestion}
            </div>
            {data && <QuestionView question={data[currentQuestionNumber]} totalQuestions={totalQuestion} />}
        </>
    );
};

function QuestionMark({ status, totalQuestion }: { status: 'passed' | 'current' | 'unpassed'; totalQuestion: number }) {
    return (
        <div
            style={{ width: 600 / totalQuestion }}
            className={cn('h-[8px] rounded-[2px]', {
                'bg-[#38BDF8] bg-opacity-20': status === 'passed',
                'bg-[#38BDF8]': status === 'current',
                'bg-[#D9D9D9]': status === 'unpassed',
            })}
        />
    );
}

function QuestionView({ question, totalQuestions }: { question: Question; totalQuestions: number }) {
    const { surveyId } = useParams();
    const { currentQuestionNumber, setCurrentQuestionNumber } = useCurrentQuestionNumberContext();
    const { isNextQuestionAvailable, setIsNextQuestionAvailable } = useIsNextQuestionAvailableContext();

    const { answer, setAnswer } = useAnswerContext();

    const { mutate: completeQuestion } = useMutation({
        mutationFn: (data: {
            question_id: number;
            answers: {
                answer_variant_id?: number;
                priority?: number;
                content: string;
            }[];
        }) => api.post(`/question/${data.question_id}/complete`, { answers: data.answers }),
        onSuccess: () => {},
        onError: () => {
            toast.error('Произошла ошибка при ответе на вопрос');
        },
    });

    const { mutate: completeSurvey } = useMutation({
        mutationFn: () => api.post(`/survey/complete/${surveyId}`),
        onSuccess: () => {
            toast('Вы успешно завершили опрос');
        },
        onError: () => {
            toast.error('Произошла ошибка при завершении опроса');
        },
    });

    const handleCompleteQuestion = () => {
        if (isNextQuestionAvailable) {
            completeQuestion({
                question_id: question.id,
                answers: answer,
            });
            setCurrentQuestionNumber((prev) => (prev < totalQuestions - 1 ? prev + 1 : 0));
            setIsNextQuestionAvailable(false);
            setAnswer([]);
        }
    };

    const handleCompleteSurvey = () => {
        completeSurvey();
    };

    return (
        <div className='flex items-center flex-col gap-4'>
            <div>
                <p className='text-center'>{question.content}</p>
                <p className='text-muted-foreground text-xs'>
                    {+question.type === QuestionType.ONE_QUESTION && 'Выберите один вариант ответа'}
                    {+question.type === QuestionType.MULTI_QUESTION && 'Выберите один или несколько вариантов ответа'}
                    {+question.type === QuestionType.FREE_INPUT && 'Введите свой ответ в поле ввода'}
                    {+question.type === QuestionType.SCALE && 'Выберите степень по шкале от 1 до 5'}
                </p>
            </div>

            <div className='w-[320px] h-[240px] flex justify-center items-center'>
                {question.image_url && (
                    <AspectRatio ratio={4 / 3} className='bg-slate-100 rounded-full flex items-center justify-center'>
                        <img src={question.image_url} alt='' className='h-full w-auto object-contain' />
                    </AspectRatio>
                )}
            </div>
            <div className='mt-[32px] mb-[64px] '>
                {+question.type === QuestionType.ONE_QUESTION && <OneAnswerQuestion questionId={question.id} />}
                {+question.type === QuestionType.MULTI_QUESTION && <MultiAnswerQuestion questionId={question.id} />}
                {+question.type === QuestionType.FREE_INPUT && <FreeInputAnswerQuestion />}
                {+question.type === QuestionType.SCALE && <ScaleAnswerQuestion />}
            </div>
            <div className='flex justify-end w-full'>
                {currentQuestionNumber < totalQuestions - 1 ? (
                    <Button disabled={!isNextQuestionAvailable} onClick={handleCompleteQuestion}>
                        Ответить <ArrowRight />
                    </Button>
                ) : (
                    <Button
                        disabled={!isNextQuestionAvailable}
                        onClick={() => {
                            handleCompleteQuestion();
                            handleCompleteSurvey();
                        }}
                    >
                        Завершить
                    </Button>
                )}
            </div>
        </div>
    );
}

function OneAnswerQuestion({ questionId }: { questionId: number }) {
    const { setIsNextQuestionAvailable } = useIsNextQuestionAvailableContext();
    const { data } = useQuery({
        queryKey: ['question', 'answer_variant', questionId],
        queryFn: () => api.get<AnswerVariant[]>(`/answer-variant/${questionId}`),
        staleTime: 0,
        select: (data) => data.data,
    });

    const { answer, setAnswer } = useAnswerContext();

    useEffect(() => {
        if (answer.length > 0) setIsNextQuestionAvailable(true);
        else setIsNextQuestionAvailable(false);
    }, [answer, setIsNextQuestionAvailable]);

    if (!data) return null;

    return (
        <ToggleGroup
            type='single'
            className='grid grid-rows-2 grid-cols-2 w-full gap-x-[60px] gap-y-[32px]'
            onValueChange={(v) =>
                setAnswer([
                    {
                        answer_variant_id: +v,
                        content: data.filter((el) => el.id === +v)[0].content,
                    },
                ])
            }
        >
            {data?.map((answer) => (
                <ToggleGroupItem
                    key={answer.id}
                    value={answer.id.toString()}
                    className='w-[240px] h-10'
                    variant='outline'
                >
                    {answer.content}
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    );
}

function MultiAnswerQuestion({ questionId }: { questionId: number }) {
    const { setIsNextQuestionAvailable } = useIsNextQuestionAvailableContext();
    const { data } = useQuery({
        queryKey: ['question', 'answer_variant', questionId],
        queryFn: () => api.get<AnswerVariant[]>(`/answer-variant/${questionId}`),
        staleTime: 0,
        select: (data) => data.data,
    });

    const { answer, setAnswer } = useAnswerContext();

    useEffect(() => {
        if (answer.length > 0) setIsNextQuestionAvailable(true);
        else setIsNextQuestionAvailable(false);
    }, [answer, setIsNextQuestionAvailable]);

    if (!data) return null;

    return (
        <ToggleGroup
            type='multiple'
            className='grid grid-rows-2 grid-cols-2 w-full gap-x-[60px] gap-y-[32px]'
            onValueChange={(v) =>
                setAnswer(
                    v.map((el, ind) => ({
                        answer_variant_id: +el,
                        content: data.filter((e) => e.id === +el)[0].content,
                        priority: ind + 1,
                    }))
                )
            }
        >
            {data.map((answer) => (
                <ToggleGroupItem
                    key={answer.id}
                    value={answer.id.toString()}
                    className='w-[240px] h-10'
                    variant='outline'
                >
                    {answer.content}
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    );
}

function FreeInputAnswerQuestion() {
    const { answer, setAnswer } = useAnswerContext();
    const { setIsNextQuestionAvailable } = useIsNextQuestionAvailableContext();

    useEffect(() => {
        if (answer[0]?.content.length > 0) setIsNextQuestionAvailable(true);
        else setIsNextQuestionAvailable(false);
    }, [answer, setIsNextQuestionAvailable]);

    return (
        <Textarea
            value={answer[0]?.content || ''}
            onChange={(e) => setAnswer([{ content: e.target.value }])}
            placeholder='Введите свой ответ'
            className='w-[600px] min-h-[100px]'
        />
    );
}
const answer_variant_count = 5;
const answer_variant: { id: number }[] = new Array(answer_variant_count).fill(0).map((_, index) => ({
    id: index + 1,
}));

function ScaleAnswerQuestion() {
    const { setIsNextQuestionAvailable } = useIsNextQuestionAvailableContext();

    const { answer, setAnswer } = useAnswerContext();

    useEffect(() => {
        if (answer.length > 0) setIsNextQuestionAvailable(true);
        else setIsNextQuestionAvailable(false);
    }, [answer, setIsNextQuestionAvailable]);

    return (
        <ToggleGroup
            type='single'
            className='grid grid-cols-5 w-full'
            onValueChange={(v) =>
                setAnswer([
                    {
                        priority: +v,
                        content: v,
                    },
                ])
            }
        >
            {answer_variant.map((a) => (
                <ToggleGroupItem
                    key={a.id}
                    value={a.id.toString()}
                    className='w-[128px] h-[128px] relative [&_svg]:size-[128px] hover:bg-white data-[state=on]:bg-white '
                >
                    <BadgeIcon
                        strokeWidth={0.5}
                        className={cn({
                            'fill-current text-[#0EA5E9]': answer[0]?.priority === a.id,
                        })}
                    />
                    <span
                        className={cn('absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl', {
                            'text-white': answer[0]?.priority === a.id,
                        })}
                    >
                        {a.id}
                    </span>
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    );
}
