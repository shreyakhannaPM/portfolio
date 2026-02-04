export async function onRequestPost(context) {
    const { request, env } = context;

    // Check if API key is configured
    if (!env.GEMINI_API_KEY) {
        return new Response(JSON.stringify({ error: "API key not configured in Cloudflare environment" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        const { question, context: resumeContext } = await request.json();

        const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`;

        // Improved prompt structure with explicit system instruction
        const systemInstruction = `You are an AI assistant on Shreya Khanna's professional portfolio website. You have full access to her resume and professional background information provided below.

YOUR ROLE:
- Answer questions about Shreya's career, skills, projects, and experience
- Be professional, concise, and highlight her strengths
- Use specific metrics and achievements when relevant
- If asked about something not in her resume, politely say you don't have that specific information

IMPORTANT: You DO have access to Shreya's complete portfolio information. Use it to answer questions accurately.

=== SHREYA'S PORTFOLIO INFORMATION ===
${resumeContext}
=== END OF PORTFOLIO INFORMATION ===`;

        const userMessage = `Based on the portfolio information above, please answer this question: ${question}`;

        const geminiResponse = await fetch(geminiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    role: 'user',
                    parts: [{ text: `${systemInstruction}\n\n${userMessage}` }]
                }]
            })
        });

        const data = await geminiResponse.json();

        return new Response(JSON.stringify(data), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
