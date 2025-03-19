'use client'

import { useState } from 'react'
import { addCompleteQuiz, sampleQuizData } from '@/utils/quiz-manager'
import { Button } from '@/components/ui/button'

export default function AddQuizPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Add sample quiz for testing
  const handleAddSampleQuiz = async () => {
    setLoading(true)
    setMessage(null)

    try {
      await addCompleteQuiz(sampleQuizData)
      setMessage({ 
        type: 'success', 
        text: 'Sample quiz added successfully! You can now view it in the quizzes list.' 
      })
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'An unknown error occurred' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Add Quiz</h1>

      {message && (
        <div className={`p-4 mb-4 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        <Button 
          onClick={handleAddSampleQuiz}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Adding Sample Quiz...' : 'Add Sample Math Quiz'}
        </Button>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">How to Add Quizzes</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Click the button above to add a sample Mathematics Knowledge quiz</li>
            <li>Check the console for detailed logs of the process</li>
            <li>If successful, you&apos;ll see a success message with the quiz ID</li>
            <li>View the quiz data structure in <code>utils/quiz-manager.ts</code></li>
            <li>Use the <code>addCompleteQuiz</code> function to add your own quizzes</li>
          </ol>
        </div>
      </div>
    </div>
  )
} 
