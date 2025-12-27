# Asian Wildlife Quiz for Children

An educational quiz system designed for 8-year-old children learning about Asian biodiversity and nature while travelling in Asia.

## Overview

The quiz features three difficulty levels with engaging questions about Asian wildlife, plants, habitats, and conservation. Each level contains 8 categories with 5 questions each, for a total of 120 questions across all difficulty levels.

## Structure

### Difficulty Levels

1. **Level 1 - Explorer (Easy)**
   - Designed for beginners
   - Basic questions about common Asian animals and plants
   - Simple concepts and easy-to-understand content
   - Focus: Recognition and basic facts

2. **Level 2 - Adventurer (Medium)**
   - For children with some knowledge
   - More detailed questions about behavior and characteristics
   - Introduction to ecological concepts
   - Focus: Understanding and relationships

3. **Level 3 - Expert (Hard)**
   - For young nature enthusiasts
   - Complex questions about unique species and ecosystems
   - Conservation and biodiversity concepts
   - Focus: Critical thinking and deeper knowledge

### Categories (All Levels)

1. **Animals of Asia** 🐘
   - Elephants, tigers, pandas, bears, and more
   - Unique mammals of the Asian continent

2. **Plants and Trees** 🌺
   - Bamboo, lotus, tropical plants
   - Asian flora and vegetation

3. **Birds** 🦜
   - Peacocks, parrots, eagles, and songbirds
   - Avian diversity across Asia

4. **Insects** 🦋
   - Butterflies, bees, beetles, and more
   - Invertebrate life and their importance

5. **Marine Life** 🐠
   - Ocean creatures, coral reefs
   - Coastal and marine biodiversity

6. **Habitats** 🏞️
   - Rainforests, mountains, wetlands
   - Different ecosystems across Asia

7. **Conservation** 💚
   - Protecting nature and wildlife
   - Environmental responsibility

8. **Fun Facts** ✨
   - Amazing trivia and interesting behaviors
   - Surprising facts about Asian nature

## Features

- **Interactive Learning**: Immediate feedback on answers with explanations
- **Progress Tracking**: Visual progress bar and score tracking
- **Educational Explanations**: Each question includes a learning moment
- **Engaging UI**: Colorful, child-friendly design with emoji icons
- **Difficulty Progression**: Start easy and gradually increase challenge
- **Category Selection**: Choose topics based on interest

## Data Structure

```typescript
interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizCategory {
  id: string;
  name: string;
  questions: QuizQuestion[];
}

interface QuizLevel {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  categories: QuizCategory[];
}
```

## Usage

The quiz is accessible at the `/quiz` route on the GBIF website.

### Navigation Flow

1. **Level Selection**: Choose from Easy, Medium, or Hard difficulty
2. **Category Selection**: Pick a topic to explore
3. **Quiz Taking**: Answer questions with immediate feedback
4. **Results**: View score and performance summary
5. **Continue Learning**: Try another category or difficulty level

## Educational Goals

The quiz aims to:
- Introduce children to Asian biodiversity
- Foster appreciation for nature and conservation
- Encourage curiosity about the natural world
- Teach ecological concepts in an engaging way
- Promote environmental awareness from a young age

## Technical Implementation

- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **Routing**: React Router integration
- **State Management**: React hooks for quiz state

## Files

- `quizData.ts` - Quiz questions and data structure
- `Quiz.tsx` - Main quiz component with UI logic
- `index.tsx` - Route configuration

## Future Enhancements

Possible improvements:
- Add more languages for international children
- Include images of animals and plants
- Sound effects for correct/incorrect answers
- Achievements and badges system
- Save progress and high scores
- Multiplayer/competitive mode
- Additional regional focuses (Africa, South America, etc.)

## Content Guidelines

Questions follow these principles:
- Age-appropriate language for 8-year-olds
- Factually accurate information
- Positive, encouraging tone
- Educational value in every question
- Cultural sensitivity to Asian contexts
- No scary or upsetting content

## Maintenance

To add new questions:
1. Open `quizData.ts`
2. Find the appropriate level and category
3. Add a new question object following the structure
4. Ensure the explanation is educational and age-appropriate
5. Test the question for clarity and accuracy

## Credits

Designed for the Global Biodiversity Information Facility (GBIF) to support educational outreach and promote biodiversity awareness among young learners.
