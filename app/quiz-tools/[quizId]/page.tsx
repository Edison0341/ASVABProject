import { Suspense } from 'react'
import { DuplicateRemover } from '@/components/quiz/duplicate-remover'
import { QuizFixer } from '@/components/quiz/quiz-fixer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface QuizToolsPageProps {
  params: {
    quizId: string
  }
  searchParams?: {
    tab?: string
  }
}

export default function QuizToolsPage({ params, searchParams }: QuizToolsPageProps) {
  const { quizId } = params
  const defaultTab = searchParams?.tab === 'missing-options' ? 'missing-options' : 'duplicates'

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Quiz Tools</h1>
      <p className="text-muted-foreground mb-8">
        Use these tools to fix issues with your quiz
      </p>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="duplicates">Remove Duplicates</TabsTrigger>
          <TabsTrigger value="missing-options">Fix Missing Options</TabsTrigger>
        </TabsList>
        
        <TabsContent value="duplicates">
          <Card>
            <CardHeader>
              <CardTitle>Duplicate Question Remover</CardTitle>
              <CardDescription>
                Find and remove duplicate questions in your quiz
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                <DuplicateRemover 
                  quizId={quizId} 
                  onComplete={() => {
                    // You could add a refresh function here
                  }} 
                />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="missing-options">
          <Card>
            <CardHeader>
              <CardTitle>Missing Options Fixer</CardTitle>
              <CardDescription>
                Check and fix questions with missing options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                <QuizFixer 
                  quizId={quizId} 
                />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 
