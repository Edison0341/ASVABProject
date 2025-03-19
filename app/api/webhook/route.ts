import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Handle webhook data
    const data = await request.json();
    
    // Process data
    console.log('Chat message received:', data);
    
    // Simple response for the ASVAB assistant
    const userMessage = data.message?.toLowerCase() || '';
    
    // Generate a response based on the user's message
    let response = "I'm your ASVAB preparation assistant. How can I help you today?";
    
    if (userMessage.includes('asvab')) {
      response = "The ASVAB (Armed Services Vocational Aptitude Battery) is a multiple-choice test used to determine qualification for enlistment in the United States Armed Forces. It consists of sections like Word Knowledge, Paragraph Comprehension, Arithmetic Reasoning, and Mathematics Knowledge.";
    } else if (userMessage.includes('study') || userMessage.includes('prepare') || userMessage.includes('practice')) {
      response = "To prepare for the ASVAB, you should focus on: 1) Word Knowledge and Vocabulary, 2) Basic Mathematics, 3) Reading Comprehension, and 4) Science and Technical knowledge. Our practice tests can help you with all of these areas!";
    } else if (userMessage.includes('score') || userMessage.includes('passing')) {
      response = "There's no official 'passing score' for the ASVAB, but each branch has minimum AFQT scores. The AFQT (Armed Forces Qualification Test) score ranges from 1-99, representing your percentile compared to other test-takers. For example, the Army requires at least a 31, while the Air Force typically requires 36 or higher.";
    } else if (userMessage.includes('hello') || userMessage.includes('hi') || userMessage.includes('hey')) {
      response = "Hello! I'm here to help you prepare for your ASVAB test. What specific area would you like to focus on?";
    }
    
    return NextResponse.json({ output: response }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { output: "I'm sorry, I encountered an error while processing your request. Please try again." },
      { status: 500 }
    );
  }
} 
