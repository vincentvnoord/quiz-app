

export default function QuestionEditor() {

    return (
        <div className="flex w-full flex-grow gap-4">
            <div className="flex flex-col truncate text-ellipsis max-w-48 h-full gap-2 overflow-y-auto">
                <ListedQuestion question="What is the capital of france?" index={0} selected={true} />
                <ListedQuestion question="Are dogs' tongues cleaner than that of a human?" index={1} />
            </div>

            <div className="h-full w-[1px] bg-foreground/50"></div>

            <div className="flex flex-grow flex-col gap-8 items-center">
                <p className="bg-white text-2xl text-center">What is the capital of france?</p>
                <div className="grid grid-cols-2 gap-2 w-full">
                    <ListedAnswer answer="Paris" />
                    <ListedAnswer answer="London" />
                    <ListedAnswer answer="Amsterdam" />
                    <ListedAnswer answer="Brussels" />
                </div>
            </div>
        </div>
    )
}

const ListedAnswer = ({ answer }: { answer: string }) => {
    return (
        <div className="flex items-center border-[1px] border-foreground/50 rounded-lg p-2">
            <p className="text-lg flex items-center gap-2 text-clip overflow-hidden truncate">
                {answer}
            </p>
        </div>
    )
}

const ListedQuestion = ({ index, question, selected = false }: { index: number, question: string, selected?: boolean }) => {

    return (
        <div className={`${selected && "bg-background/60"} flex items-center rounded-lg p-2`}>
            <p className="text-lg flex items-center gap-2 text-clip overflow-hidden truncate">
                <span>{index + 1}.</span>
                <span>{question}</span>
            </p>
        </div>
    )
}