"use client"

import { useRouter } from 'next/navigation'
import { useQuiz } from '@/hooks/use-quiz'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Loader2, Wrench } from 'lucide-react'

interface QuizContainerProps {
  quizId: string
  children: React.ReactNode
}

export function QuizContainer({ quizId, children }: QuizContainerProps) {
  const router = useRouter()
  const { 
    loading, 
    error, 
    hasMissingOptions,
    hasDuplicateQuestions
  } = useQuiz(quizId)

  const handleGoToTools = (tab?: string) => {
    if (tab) {
      router.push(`/quiz-tools/${quizId}?tab=${tab}`)
    } else {
      router.push(`/quiz-tools/${quizId}`)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div>
      {hasMissingOptions && (
        <Card className="mb-6 border-yellow-300 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">Quiz Issue Detected</CardTitle>
            <CardDescription className="text-yellow-700">
              Some questions in this quiz are missing options, which may cause errors.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-700">
              This can happen if the quiz data was not properly initialized. Use the quiz tools to fix this issue.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="border-yellow-500 text-yellow-700 hover:bg-yellow-100"
              onClick={() => handleGoToTools('missing-options')}
            >
              <Wrench className="h-4 w-4 mr-2" />
              Open Quiz Tools
            </Button>
          </CardFooter>
        </Card>
      )}

      {hasDuplicateQuestions && (
        <Card className="mb-6 border-orange-300 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">Duplicate Questions Detected</CardTitle>
            <CardDescription className="text-orange-700">
              This quiz contains duplicate questions that should be removed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-700">
              Duplicate questions can affect your score calculation and quiz experience. Use the quiz tools to remove them.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="border-orange-500 text-orange-700 hover:bg-orange-100"
              onClick={() => handleGoToTools('duplicates')}
            >
              <Wrench className="h-4 w-4 mr-2" />
              Open Quiz Tools
            </Button>
          </CardFooter>
        </Card>
      )}

      {children}
    </div>
  )
} 
