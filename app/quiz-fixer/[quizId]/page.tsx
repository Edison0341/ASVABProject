import { QuizFixer } from "@/components/quiz/quiz-fixer"

interface QuizFixerPageProps {
  params: {
    quizId: string
  }
}

export default function QuizFixerPage({ params }: QuizFixerPageProps) {
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Quiz Fixer</h1>
      <p className="text-center mb-8 text-muted-foreground">
        This tool will fix issues with missing options in quiz questions.
      </p>
      
      <QuizFixer quizId={params.quizId} />
      
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          After fixing the quiz, you will be redirected back to the quiz page.
        </p>
      </div>
    </div>
  )
} 
