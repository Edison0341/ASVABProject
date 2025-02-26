"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { QuizService } from '@/services/quiz-service'

interface QuizFixerProps {
  quizId: string
}

export function QuizFixer({ quizId }: QuizFixerProps) {
  const [isFixing, setIsFixing] = useState(false)
  const [result, setResult] = useState<{
    success?: boolean
    message?: string
    error?: string
  } | null>(null)

  const handleFixQuiz = async () => {
    try {
      setIsFixing(true)
      setResult(null)
      
      // Call the service to fix the quiz
      const fixResult = await QuizService.checkAndFixQuiz(quizId)
      setResult(fixResult)
      
      // If successful, reload the page after a short delay
      if (fixResult.success) {
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      })
    } finally {
      setIsFixing(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto my-4">
      <CardHeader>
        <CardTitle>Quiz Fixer</CardTitle>
        <CardDescription>
          Fix issues with missing options in quiz questions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {result && (
          <Alert className={result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
            {result.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>
              {result.message || result.error || "Operation completed"}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleFixQuiz} 
          disabled={isFixing}
          className="w-full"
        >
          {isFixing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Fixing Quiz...
            </>
          ) : (
            "Fix Missing Options"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
} 
