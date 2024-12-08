import { PageLayout, PageMiddleColumn } from '@/components/layout';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { usePageTitle } from '@/hooks/use-page-title';
import { cn } from '@/lib/utils';
import { AnswerVariant, Question, QuestionType } from '@/types';
import { ArrowRight, BadgeIcon } from 'lucide-react';
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';

type CurrentQuestionNumberProps = {
    currentQuestionNumber: number;
    setCurrentQuestionNumber: Dispatch<SetStateAction<number>>;
};

const CurrentQuestionNumberContext = createContext<CurrentQuestionNumberProps>({
    currentQuestionNumber: 0,
    setCurrentQuestionNumber: () => {},
});

const useCurrentQuestionNumberContext = () => useContext(CurrentQuestionNumberContext);

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

    useEffect(() => {
        sessionStorage.setItem('currentQuestionNumber', currentQuestionNumber.toString());
    }, [currentQuestionNumber]);

    return (
        <CurrentQuestionNumberContext.Provider value={{ currentQuestionNumber, setCurrentQuestionNumber }}>
            <IsNextQuestionAvailableContext.Provider value={{ isNextQuestionAvailable, setIsNextQuestionAvailable }}>
                {children}
            </IsNextQuestionAvailableContext.Provider>
        </CurrentQuestionNumberContext.Provider>
    );
};

export const SurveyViewerPage = () => {
    const { surveyId } = useParams();
    usePageTitle(`Прохождение опроса  ${surveyId}`);

    return (
        <SurveyPageProvider>
            <PageLayout>
                <PageMiddleColumn>
                    <div className='rounded-lg bg-slate-50 p-2 '>Название опроса</div>
                    <SurveyViewerPageContent />
                </PageMiddleColumn>
            </PageLayout>
        </SurveyPageProvider>
    );
};

const SurveyViewerPageContent = () => {
    const { currentQuestionNumber } = useCurrentQuestionNumberContext();
    const questions = [
        {
            id: 1,
            content: '1',
            type: QuestionType.ONE_QUESTION,
            answers_amount: 0,
            t_created_at: new Date(),
            t_updated_at: new Date(),
            t_deleted: false,
            image: null,
            image_url: null,
        },
        {
            id: 2,
            content: '2',
            type: QuestionType.MULTI_QUESTION,
            answers_amount: 0,
            t_created_at: new Date(),
            t_updated_at: new Date(),
            t_deleted: false,
            image: null,
            image_url: null,
        },
        {
            id: 3,
            content: '3',
            type: QuestionType.FREE_INPUT,
            answers_amount: 0,
            t_created_at: new Date(),
            t_updated_at: new Date(),
            t_deleted: false,
            image: null,
            image_url: null,
        },
        {
            id: 4,
            content: '4',
            type: QuestionType.SCALE,
            answers_amount: 0,
            t_created_at: new Date(),
            t_updated_at: new Date(),
            t_deleted: false,
            image: null,
            image_url: null,
        },
    ];
    const totalQuestion = questions.length;

    return (
        <>
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
            <QuestionView question={questions[currentQuestionNumber]} totalQuestions={totalQuestion} />
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
    const { currentQuestionNumber, setCurrentQuestionNumber } = useCurrentQuestionNumberContext();
    const { isNextQuestionAvailable, setIsNextQuestionAvailable } = useIsNextQuestionAvailableContext();

    return (
        <div className='flex items-center flex-col gap-4'>
            <div>
                <p className='text-center'>{question.content}</p>
                <p className='text-muted-foreground text-xs'>
                    {question.type === QuestionType.ONE_QUESTION && 'Выберите один вариант ответа'}
                    {question.type === QuestionType.MULTI_QUESTION && 'Выберите один или несколько вариантов ответа'}
                    {question.type === QuestionType.FREE_INPUT && 'Введите свой ответ в поле ввода'}
                    {question.type === QuestionType.SCALE && 'Выберите степень по шкале от 1 до 5'}
                </p>
            </div>

            <div className='w-[320px] h-[240px] flex justify-center'>
                {question.image_url && (
                    <AspectRatio ratio={4 / 3} className='bg-slate-100'>
                        <img src={question.image_url} alt='' />
                    </AspectRatio>
                )}
            </div>
            <div className='mt-[32px] mb-[64px] '>
                {question.type === QuestionType.ONE_QUESTION && <OneAnswerQuestion questionId={question.id} />}
                {question.type === QuestionType.MULTI_QUESTION && <MultiAnswerQuestion questionId={question.id} />}
                {question.type === QuestionType.FREE_INPUT && <FreeInputAnswerQuestion questionId={question.id} />}
                {question.type === QuestionType.SCALE && <ScaleAnswerQuestion questionId={question.id} />}
            </div>
            <div className='flex justify-end w-full'>
                {currentQuestionNumber < totalQuestions - 1 ? (
                    <Button
                        disabled={!isNextQuestionAvailable}
                        onClick={() => {
                            setCurrentQuestionNumber((prev) => prev + 1);
                            setIsNextQuestionAvailable(false);
                        }}
                    >
                        Ответить <ArrowRight />
                    </Button>
                ) : (
                    <Button
                        disabled={!isNextQuestionAvailable}
                        onClick={() => {
                            setIsNextQuestionAvailable(false);
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
    const answer_variant_count = 4;
    const answer_variant: AnswerVariant[] = new Array(answer_variant_count).fill(0).map((_, index) => ({
        id: index,
        content: `Ответ ${index}`,
        t_created_at: new Date(),
        t_updated_at: new Date(),
        t_deleted: false,
        question_id: questionId,
    }));
    const [selected, setSelected] = useState<number | null>(null);

    const { setIsNextQuestionAvailable } = useIsNextQuestionAvailableContext();
    useEffect(() => {
        if (selected) setIsNextQuestionAvailable(true);
        else setIsNextQuestionAvailable(false);
    }, [selected, setIsNextQuestionAvailable]);

    return (
        <ToggleGroup
            type='single'
            className='grid grid-rows-2 grid-cols-2 w-full gap-x-[60px] gap-y-[32px]'
            onValueChange={(v) => setSelected(+v || null)}
        >
            {answer_variant.map((answer) => (
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
    const answer_variant_count = 4;
    const answer_variant: AnswerVariant[] = new Array(answer_variant_count).fill(0).map((_, index) => ({
        id: index,
        content: `Ответ ${index}`,
        t_created_at: new Date(),
        t_updated_at: new Date(),
        t_deleted: false,
        question_id: questionId,
    }));

    const [selected, setSelected] = useState<number[]>([]);

    const { setIsNextQuestionAvailable } = useIsNextQuestionAvailableContext();
    useEffect(() => {
        if (selected.length) setIsNextQuestionAvailable(true);
        else setIsNextQuestionAvailable(false);
    }, [selected, setIsNextQuestionAvailable]);

    return (
        <ToggleGroup
            type='multiple'
            className='grid grid-rows-2 grid-cols-2 w-full gap-x-[60px] gap-y-[32px]'
            onValueChange={(v) => setSelected(v.map((el) => +el))}
        >
            {answer_variant.map((answer) => (
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

function FreeInputAnswerQuestion({ questionId }: { questionId: number }) {
    const [input, setInput] = useState<string>('');
    const { setIsNextQuestionAvailable } = useIsNextQuestionAvailableContext();
    useEffect(() => {
        if (input.length) setIsNextQuestionAvailable(true);
        else setIsNextQuestionAvailable(false);
    }, [input, setIsNextQuestionAvailable]);
    return (
        <Textarea
            onChange={(e) => setInput(e.target.value)}
            placeholder='Введите свой ответ'
            className='w-[600px] min-h-[100px]'
        />
    );
}

function ScaleAnswerQuestion({ questionId }: { questionId: number }) {
    const answer_variant_count = 5;
    const answer_variant: { id: number }[] = new Array(answer_variant_count).fill(0).map((_, index) => ({
        id: index,
    }));
    const [selected, setSelected] = useState<number | null>(null);
    const { setIsNextQuestionAvailable } = useIsNextQuestionAvailableContext();

    useEffect(() => {
        if (selected) setIsNextQuestionAvailable(true);
        else setIsNextQuestionAvailable(false);
    }, [selected, setIsNextQuestionAvailable]);

    return (
        <ToggleGroup type='single' className='grid grid-cols-5 w-full' onValueChange={(v) => setSelected(+v || null)}>
            {answer_variant.map((answer) => (
                <ToggleGroupItem
                    key={answer.id}
                    value={(answer.id + 1).toString()}
                    className='w-[128px] h-[128px] relative [&_svg]:size-[128px] hover:bg-white data-[state=on]:bg-white '
                >
                    <BadgeIcon
                        strokeWidth={0.5}
                        className={cn({
                            'fill-current text-[#0EA5E9]': selected === answer.id + 1,
                        })}
                    />
                    <span
                        className={cn('absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl', {
                            'text-white': selected === answer.id + 1,
                        })}
                    >
                        {answer.id + 1}
                    </span>
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    );
}
