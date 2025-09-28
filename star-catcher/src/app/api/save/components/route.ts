import { NextResponse } from 'next/server';
import User from '@/models/User';
import UserPreferences from '@/models/UserPreferences';
import SavedComponent from '@/models/SavedComponent';
import { auth } from '../../auth/[...nextauth]/route';
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { component, userInputs } = body;

    const session = await auth();
    if (!(session as any)?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Analyze user inputs using OpenAI
    let analyzedPreferences = null;
    if (userInputs && userInputs.length > 0) {
      try {
        const openaiClient = openai("gpt-4o-mini");
        
        const analysisPrompt = `Analyze the following stream of user inputs that led to the creation of this component and extract design preferences, themes, and patterns. Return a JSON object with the following structure:

{
  "themes": ["theme1", "theme2"],
  "colors": ["color1", "color2"],
  "styles": ["style1", "style2"],
  "keywords": ["keyword1", "keyword2"],
  "patterns": ["pattern1", "pattern2"],
  "preferences": {
    "layout": "preference",
    "typography": "preference",
    "spacing": "preference",
    "interactions": "preference"
  }
}

User Input Stream: ${JSON.stringify(userInputs, null, 2)}

Component Code:
\`\`\`javascript
${component.code}
\`\`\`

Focus on:
- Design themes (modern, minimal, bold, elegant, playful, corporate, etc.)
- Color preferences (specific colors mentioned or implied)
- Style preferences (rounded, sharp, shadowed, flat, etc.)
- Layout patterns (centered, grid, flex, etc.)
- Typography preferences (font weights, sizes, styles)
- Interaction patterns (hover effects, animations, etc.)
- General keywords that describe their aesthetic preferences

Return only the JSON object, no other text.`;

        const response = await openaiClient.doGenerate({
          prompt: [{ role: 'user', content: [{ type: 'text', text: analysisPrompt }] }]
        });
        
        const extractedText = response.content[0].type === 'text' ? response.content[0].text.trim() : '';
        
        // Parse the JSON response
        try {
          const jsonMatch = extractedText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            analyzedPreferences = JSON.parse(jsonMatch[0]);
          }
        } catch (parseError) {
          console.error('Failed to parse OpenAI response:', parseError);
        }
      } catch (openaiError) {
        console.error('OpenAI analysis failed:', openaiError);
      }
    }

    // Save component with analysis to SavedComponent collection
    const savedComponent = new SavedComponent({
      userId: (session as any).user.email,
      ...component,
      userInputs,
      analyzedPreferences,
      savedAt: new Date()
    });
    
    await savedComponent.save();

    // Update user preferences based on analysis using the enhanced learning system
    if (analyzedPreferences) {
      try {
        // Import the PreferenceLearner to use the enhanced component analysis learning
        const { PreferenceLearner } = await import('@/lib/preferences/preferenceLearner');
        const learner = new PreferenceLearner((session as any).user.email);
        
        // Load existing preferences from UserPreferences collection
        let existingPreferences = await UserPreferences.findOne({ userId: (session as any).user.email });
        if (existingPreferences) {
          learner.setPreferences(existingPreferences);
        }
        
        // Learn from component analysis
        learner.learnFromComponentAnalysis(component.type, analyzedPreferences);
        
        // Save or update preferences in UserPreferences collection
        await UserPreferences.findOneAndUpdate(
          { userId: (session as any).user.email },
          learner.getPreferences(),
          { upsert: true, new: true }
        );
        
        console.log('Successfully updated preferences from component analysis');
      } catch (prefError) {
        console.error('Failed to update preferences with enhanced learning:', prefError);
        
        // Fallback to simple theme update
        try {
          const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/preferences`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'updateThemes',
              data: {
                userId: (session as any).user.email,
                themes: analyzedPreferences.themes || [],
                colors: analyzedPreferences.colors || [],
                styles: analyzedPreferences.styles || [],
                keywords: analyzedPreferences.keywords || []
              }
            })
          });

          if (!response.ok) {
            console.error('Failed to update preferences (fallback):', await response.text());
          }
        } catch (fallbackError) {
          console.error('Failed to update preferences (fallback):', fallbackError);
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      component: component,
      analyzedPreferences 
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
