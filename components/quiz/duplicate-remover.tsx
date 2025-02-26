import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { QuizService } from '@/services/quiz-service'

interface DuplicateRemoverProps {
  quizId: string
  onComplete?: () => void
}

export function DuplicateRemover({ quizId, onComplete }: DuplicateRemoverProps) {
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    error?: string
  } | null>(null)

  const handleRemoveDuplicates = async () => {
    setIsChecking(true)
    setResult(null)
    
    try {
      const response = await QuizService.removeDuplicateQuestions(quizId)
      setResult({
        success: response.success,
        message: response.message || 'Operation completed',
        error: response.error
      })
      
      if (response.success) {
        if (onComplete) {
          onComplete()
        }
        
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to check for duplicates',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Remove Duplicate Questions</CardTitle>
        <CardDescription>
          Check for and remove any duplicate questions in this quiz
        </CardDescription>
      </CardHeader>
      <CardContent>
        {result && (
          <Alert className={result.success ? "bg-green-50" : "bg-red-50"}>
            {result.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertTitle>
              {result.success ? "Success" : "Error"}
            </AlertTitle>
            <AlertDescription>
              {result.message}
              {result.error && (
                <div className="text-sm text-red-600 mt-1">{result.error}</div>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleRemoveDuplicates} 
          disabled={isChecking}
          className="w-full"
        >
          {isChecking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking for duplicates...
            </>
          ) : (
            'Check & Remove Duplicates'
          )}
        </Button>
      </CardFooter>
    </Card>
  )
} 
