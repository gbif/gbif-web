// Quiz data for children learning about Asian biodiversity

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation?: string;
}

export interface QuizCategory {
  id: string;
  name: string;
  icon?: string;
  questions: QuizQuestion[];
}

export interface QuizLevel {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  categories: QuizCategory[];
}

// Level 1: Easy - For 8-year-olds just starting to learn
const easyLevel: QuizLevel = {
  id: 'level-1',
  name: 'Explorer',
  difficulty: 'easy',
  description: 'Start your journey learning about amazing Asian wildlife!',
  categories: [
    {
      id: 'animals',
      name: 'Animals of Asia',
      questions: [
        {
          id: 'e-a-1',
          question: 'What is the largest land animal in Asia?',
          options: ['Tiger', 'Elephant', 'Bear', 'Rhino'],
          correctAnswer: 1,
          explanation: 'The Asian elephant is the largest land animal in Asia!'
        },
        {
          id: 'e-a-2',
          question: 'Where do pandas live?',
          options: ['Japan', 'India', 'China', 'Thailand'],
          correctAnswer: 2,
          explanation: 'Giant pandas live in the mountains of China and love eating bamboo.'
        },
        {
          id: 'e-a-3',
          question: 'What color is a tiger?',
          options: ['Black', 'Orange with stripes', 'Brown', 'White'],
          correctAnswer: 1,
          explanation: 'Tigers are orange with beautiful black stripes!'
        },
        {
          id: 'e-a-4',
          question: 'What do monkeys like to eat?',
          options: ['Grass', 'Fish', 'Bananas', 'Leaves only'],
          correctAnswer: 2,
          explanation: 'Monkeys love fruits like bananas, but they also eat other things!'
        },
        {
          id: 'e-a-5',
          question: 'Which animal has a very long trunk?',
          options: ['Monkey', 'Elephant', 'Tiger', 'Bear'],
          correctAnswer: 1,
          explanation: 'Elephants use their long trunks to drink water and pick up food.'
        }
      ]
    },
    {
      id: 'plants',
      name: 'Plants and Trees',
      questions: [
        {
          id: 'e-p-1',
          question: 'What do pandas eat the most?',
          options: ['Bamboo', 'Apples', 'Grass', 'Flowers'],
          correctAnswer: 0,
          explanation: 'Pandas eat bamboo almost all day long!'
        },
        {
          id: 'e-p-2',
          question: 'What grows on trees?',
          options: ['Rocks', 'Leaves', 'Sand', 'Water'],
          correctAnswer: 1,
          explanation: 'Trees have leaves that help them make food from sunlight!'
        },
        {
          id: 'e-p-3',
          question: 'What color are most leaves?',
          options: ['Blue', 'Green', 'Red', 'Yellow'],
          correctAnswer: 1,
          explanation: 'Most leaves are green because of chlorophyll!'
        },
        {
          id: 'e-p-4',
          question: 'What do plants need to grow?',
          options: ['Sunlight', 'Toys', 'Candy', 'Music'],
          correctAnswer: 0,
          explanation: 'Plants need sunlight, water, and air to grow big and strong!'
        },
        {
          id: 'e-p-5',
          question: 'Which is a fruit that grows in Asia?',
          options: ['Mango', 'Pizza', 'Bread', 'Cheese'],
          correctAnswer: 0,
          explanation: 'Mangoes are delicious fruits that grow on trees in Asia!'
        }
      ]
    },
    {
      id: 'birds',
      name: 'Birds',
      questions: [
        {
          id: 'e-b-1',
          question: 'What do birds use to fly?',
          options: ['Legs', 'Wings', 'Tail', 'Beak'],
          correctAnswer: 1,
          explanation: 'Birds flap their wings to fly through the sky!'
        },
        {
          id: 'e-b-2',
          question: 'What is a peacock known for?',
          options: ['Big ears', 'Beautiful tail feathers', 'Long neck', 'Sharp teeth'],
          correctAnswer: 1,
          explanation: 'Peacocks have amazing colorful tail feathers they can spread out!'
        },
        {
          id: 'e-b-3',
          question: 'Where do birds lay eggs?',
          options: ['In water', 'In nests', 'Underground', 'In caves'],
          correctAnswer: 1,
          explanation: 'Birds build nests to keep their eggs safe and warm!'
        },
        {
          id: 'e-b-4',
          question: 'What sound do birds make?',
          options: ['Bark', 'Chirp', 'Meow', 'Roar'],
          correctAnswer: 1,
          explanation: 'Birds chirp and sing beautiful songs!'
        },
        {
          id: 'e-b-5',
          question: 'What color is a parrot often?',
          options: ['Black', 'Colorful', 'Only white', 'Only brown'],
          correctAnswer: 1,
          explanation: 'Parrots come in many bright, beautiful colors!'
        }
      ]
    },
    {
      id: 'insects',
      name: 'Insects',
      questions: [
        {
          id: 'e-i-1',
          question: 'How many legs does an insect have?',
          options: ['4', '6', '8', '10'],
          correctAnswer: 1,
          explanation: 'All insects have 6 legs!'
        },
        {
          id: 'e-i-2',
          question: 'What do butterflies have on their wings?',
          options: ['Stripes', 'Patterns', 'Fur', 'Feathers'],
          correctAnswer: 1,
          explanation: 'Butterflies have beautiful patterns on their wings!'
        },
        {
          id: 'e-i-3',
          question: 'What does a bee make?',
          options: ['Milk', 'Honey', 'Eggs', 'Silk'],
          correctAnswer: 1,
          explanation: 'Bees make sweet honey in their hives!'
        },
        {
          id: 'e-i-4',
          question: 'What was a butterfly before?',
          options: ['A worm', 'A caterpillar', 'A spider', 'A bird'],
          correctAnswer: 1,
          explanation: 'Butterflies start as caterpillars before they transform!'
        },
        {
          id: 'e-i-5',
          question: 'What do ants like to carry?',
          options: ['Food', 'Rocks', 'Water', 'Sticks'],
          correctAnswer: 0,
          explanation: 'Ants work together to carry food back to their homes!'
        }
      ]
    },
    {
      id: 'marine',
      name: 'Marine Life',
      questions: [
        {
          id: 'e-m-1',
          question: 'Where do fish live?',
          options: ['In trees', 'In water', 'In caves', 'In nests'],
          correctAnswer: 1,
          explanation: 'Fish live in water and breathe through gills!'
        },
        {
          id: 'e-m-2',
          question: 'What helps fish swim?',
          options: ['Legs', 'Wings', 'Fins', 'Arms'],
          correctAnswer: 2,
          explanation: 'Fish use their fins to swim through the water!'
        },
        {
          id: 'e-m-3',
          question: 'What is the biggest animal in the ocean?',
          options: ['Shark', 'Whale', 'Dolphin', 'Fish'],
          correctAnswer: 1,
          explanation: 'Blue whales are the biggest animals in the ocean and in the world!'
        },
        {
          id: 'e-m-4',
          question: 'What do turtles have on their back?',
          options: ['Fur', 'A shell', 'Wings', 'Spikes'],
          correctAnswer: 1,
          explanation: 'Turtles carry their home on their back - their shell!'
        },
        {
          id: 'e-m-5',
          question: 'Where is coral found?',
          options: ['On mountains', 'In deserts', 'In the ocean', 'In rivers'],
          correctAnswer: 2,
          explanation: 'Coral reefs are found in warm ocean waters!'
        }
      ]
    },
    {
      id: 'habitats',
      name: 'Habitats',
      questions: [
        {
          id: 'e-h-1',
          question: 'Where do tigers live?',
          options: ['Desert', 'Forest', 'Ocean', 'Sky'],
          correctAnswer: 1,
          explanation: 'Tigers live in forests where they can hide and hunt!'
        },
        {
          id: 'e-h-2',
          question: 'What is a very dry place called?',
          options: ['Ocean', 'Desert', 'River', 'Lake'],
          correctAnswer: 1,
          explanation: 'A desert is a dry place with very little rain!'
        },
        {
          id: 'e-h-3',
          question: 'Where do monkeys like to climb?',
          options: ['Trees', 'Rocks', 'Water', 'Sand'],
          correctAnswer: 0,
          explanation: 'Monkeys are great climbers and love being in trees!'
        },
        {
          id: 'e-h-4',
          question: 'What is a big area of trees called?',
          options: ['Desert', 'Ocean', 'Forest', 'Mountain'],
          correctAnswer: 2,
          explanation: 'A forest is an area with many trees growing together!'
        },
        {
          id: 'e-h-5',
          question: 'Where does it rain a lot?',
          options: ['Desert', 'Rainforest', 'Ice', 'Cave'],
          correctAnswer: 1,
          explanation: 'Rainforests get lots of rain and have many plants and animals!'
        }
      ]
    },
    {
      id: 'conservation',
      name: 'Conservation',
      questions: [
        {
          id: 'e-c-1',
          question: 'Why should we protect animals?',
          options: ['They are special', 'They are boring', 'They are scary', 'They are mean'],
          correctAnswer: 0,
          explanation: 'Every animal is special and important to nature!'
        },
        {
          id: 'e-c-2',
          question: 'What should we not throw on the ground?',
          options: ['Trash', 'Leaves', 'Water', 'Air'],
          correctAnswer: 0,
          explanation: 'We should keep our planet clean by not littering!'
        },
        {
          id: 'e-c-3',
          question: 'What can we do to help Earth?',
          options: ['Waste water', 'Recycle', 'Litter', 'Be messy'],
          correctAnswer: 1,
          explanation: 'Recycling helps keep our Earth clean and healthy!'
        },
        {
          id: 'e-c-4',
          question: 'Are trees important?',
          options: ['Yes', 'No', 'Maybe', 'Never'],
          correctAnswer: 0,
          explanation: 'Trees give us oxygen to breathe and homes for animals!'
        },
        {
          id: 'e-c-5',
          question: 'Should we be kind to animals?',
          options: ['Yes', 'No', 'Sometimes', 'Never'],
          correctAnswer: 0,
          explanation: 'We should always be kind and gentle with animals!'
        }
      ]
    },
    {
      id: 'funfacts',
      name: 'Fun Facts',
      questions: [
        {
          id: 'e-f-1',
          question: 'Can elephants swim?',
          options: ['Yes', 'No', 'Maybe', 'Never'],
          correctAnswer: 0,
          explanation: 'Elephants are great swimmers and love playing in water!'
        },
        {
          id: 'e-f-2',
          question: 'How long is a giraffe\'s tongue?',
          options: ['Short', 'Very long', 'Tiny', 'No tongue'],
          correctAnswer: 1,
          explanation: 'Giraffes have very long tongues to reach leaves on tall trees!'
        },
        {
          id: 'e-f-3',
          question: 'Do butterflies taste with their feet?',
          options: ['Yes', 'No', 'Maybe', 'Never'],
          correctAnswer: 0,
          explanation: 'Butterflies can taste leaves with their feet!'
        },
        {
          id: 'e-f-4',
          question: 'Can penguins fly?',
          options: ['Yes', 'No', 'Sometimes', 'Always'],
          correctAnswer: 1,
          explanation: 'Penguins can\'t fly in the air, but they "fly" underwater!'
        },
        {
          id: 'e-f-5',
          question: 'What makes a panda special?',
          options: ['Black and white fur', 'Green fur', 'No fur', 'Red fur'],
          correctAnswer: 0,
          explanation: 'Pandas are special with their black and white fur!'
        }
      ]
    }
  ]
};

// Level 2: Medium - For kids with some knowledge
const mediumLevel: QuizLevel = {
  id: 'level-2',
  name: 'Adventurer',
  difficulty: 'medium',
  description: 'You know the basics! Let\'s learn more about Asian nature!',
  categories: [
    {
      id: 'animals',
      name: 'Animals of Asia',
      questions: [
        {
          id: 'm-a-1',
          question: 'Which is the smallest bear in Asia?',
          options: ['Polar Bear', 'Sun Bear', 'Brown Bear', 'Panda'],
          correctAnswer: 1,
          explanation: 'The Sun Bear is the smallest bear and lives in Southeast Asian forests!'
        },
        {
          id: 'm-a-2',
          question: 'What special ability does a gecko have?',
          options: ['Flying', 'Climbing walls', 'Swimming fast', 'Changing colors'],
          correctAnswer: 1,
          explanation: 'Geckos can climb walls and even walk upside down on ceilings!'
        },
        {
          id: 'm-a-3',
          question: 'How many horns does an Indian rhinoceros have?',
          options: ['None', 'One', 'Two', 'Three'],
          correctAnswer: 1,
          explanation: 'Indian rhinos have one horn, while African rhinos have two!'
        },
        {
          id: 'm-a-4',
          question: 'What makes the slow loris unique?',
          options: ['Very fast', 'Venomous bite', 'Can fly', 'Changes color'],
          correctAnswer: 1,
          explanation: 'The slow loris is one of the few venomous mammals!'
        },
        {
          id: 'm-a-5',
          question: 'Where do snow leopards live?',
          options: ['Beaches', 'Deserts', 'Mountains', 'Oceans'],
          correctAnswer: 2,
          explanation: 'Snow leopards live high in the cold mountains of Central Asia!'
        }
      ]
    },
    {
      id: 'plants',
      name: 'Plants and Trees',
      questions: [
        {
          id: 'm-p-1',
          question: 'What special plant do silkworms eat?',
          options: ['Bamboo', 'Mulberry leaves', 'Rice', 'Grass'],
          correctAnswer: 1,
          explanation: 'Silkworms only eat mulberry leaves to make their silk!'
        },
        {
          id: 'm-p-2',
          question: 'Which tree loses its leaves in winter?',
          options: ['Pine', 'Deciduous', 'Palm', 'Cactus'],
          correctAnswer: 1,
          explanation: 'Deciduous trees lose their leaves in autumn and grow new ones in spring!'
        },
        {
          id: 'm-p-3',
          question: 'What is the tallest type of grass?',
          options: ['Lawn grass', 'Bamboo', 'Rice', 'Wheat'],
          correctAnswer: 1,
          explanation: 'Bamboo is actually a type of grass that can grow very tall!'
        },
        {
          id: 'm-p-4',
          question: 'What do lotus flowers do at night?',
          options: ['Glow', 'Close', 'Die', 'Move'],
          correctAnswer: 1,
          explanation: 'Lotus flowers close their petals at night and open them during the day!'
        },
        {
          id: 'm-p-5',
          question: 'Which spice comes from tree bark?',
          options: ['Pepper', 'Cinnamon', 'Ginger', 'Turmeric'],
          correctAnswer: 1,
          explanation: 'Cinnamon comes from the bark of cinnamon trees!'
        }
      ]
    },
    {
      id: 'birds',
      name: 'Birds',
      questions: [
        {
          id: 'm-b-1',
          question: 'Which bird can mimic human speech?',
          options: ['Eagle', 'Parrot', 'Sparrow', 'Owl'],
          correctAnswer: 1,
          explanation: 'Parrots are smart birds that can learn to copy words and sounds!'
        },
        {
          id: 'm-b-2',
          question: 'What does a hummingbird eat?',
          options: ['Seeds', 'Nectar', 'Fish', 'Insects only'],
          correctAnswer: 1,
          explanation: 'Hummingbirds drink sweet nectar from flowers!'
        },
        {
          id: 'm-b-3',
          question: 'Which bird is known for its beautiful song?',
          options: ['Crow', 'Nightingale', 'Vulture', 'Pelican'],
          correctAnswer: 1,
          explanation: 'Nightingales are famous for their lovely singing!'
        },
        {
          id: 'm-b-4',
          question: 'What makes the hornbill special?',
          options: ['Long tail', 'Big beak', 'Small size', 'No feathers'],
          correctAnswer: 1,
          explanation: 'Hornbills have large, colorful beaks with a casque on top!'
        },
        {
          id: 'm-b-5',
          question: 'Which bird cannot fly but is a great swimmer?',
          options: ['Eagle', 'Penguin', 'Pigeon', 'Hawk'],
          correctAnswer: 1,
          explanation: 'Penguins can\'t fly but they\'re excellent swimmers!'
        }
      ]
    },
    {
      id: 'insects',
      name: 'Insects',
      questions: [
        {
          id: 'm-i-1',
          question: 'What do fireflies produce at night?',
          options: ['Sound', 'Heat', 'Light', 'Color'],
          correctAnswer: 2,
          explanation: 'Fireflies make their own light through bioluminescence!'
        },
        {
          id: 'm-i-2',
          question: 'What insect can lift 50 times its weight?',
          options: ['Butterfly', 'Ant', 'Bee', 'Fly'],
          correctAnswer: 1,
          explanation: 'Ants are incredibly strong for their size!'
        },
        {
          id: 'm-i-3',
          question: 'What do monarch butterflies do?',
          options: ['Hibernate', 'Migrate', 'Hide', 'Sleep all winter'],
          correctAnswer: 1,
          explanation: 'Monarch butterflies migrate long distances to warmer places!'
        },
        {
          id: 'm-i-4',
          question: 'What makes the praying mantis special?',
          options: ['Its speed', 'Hunting pose', 'Bright color', 'Large size'],
          correctAnswer: 1,
          explanation: 'Praying mantises hold their front legs like they\'re praying!'
        },
        {
          id: 'm-i-5',
          question: 'How do crickets make their chirping sound?',
          options: ['Singing', 'Rubbing wings', 'Clapping', 'Jumping'],
          correctAnswer: 1,
          explanation: 'Male crickets chirp by rubbing their wings together!'
        }
      ]
    },
    {
      id: 'marine',
      name: 'Marine Life',
      questions: [
        {
          id: 'm-m-1',
          question: 'What makes clownfish special?',
          options: ['They juggle', 'Live in anemones', 'Can fly', 'Make sounds'],
          correctAnswer: 1,
          explanation: 'Clownfish live safely in sea anemones that would sting other fish!'
        },
        {
          id: 'm-m-2',
          question: 'How do dolphins talk to each other?',
          options: ['Sign language', 'Clicks and whistles', 'Bubbles', 'Colors'],
          correctAnswer: 1,
          explanation: 'Dolphins communicate using clicks, whistles, and other sounds!'
        },
        {
          id: 'm-m-3',
          question: 'What special ability do octopuses have?',
          options: ['Flying', 'Changing color', 'Breathing air', 'Running'],
          correctAnswer: 1,
          explanation: 'Octopuses can change color to hide from predators!'
        },
        {
          id: 'm-m-4',
          question: 'How many arms does a starfish typically have?',
          options: ['Three', 'Five', 'Eight', 'Ten'],
          correctAnswer: 1,
          explanation: 'Most starfish have five arms, but some species have more!'
        },
        {
          id: 'm-m-5',
          question: 'What do sea turtles eat?',
          options: ['Only fish', 'Jellyfish and plants', 'Birds', 'Coral'],
          correctAnswer: 1,
          explanation: 'Sea turtles eat jellyfish, seagrass, and other ocean plants!'
        }
      ]
    },
    {
      id: 'habitats',
      name: 'Habitats',
      questions: [
        {
          id: 'm-h-1',
          question: 'What is special about mangrove forests?',
          options: ['They grow underwater', 'They grow in salt water', 'They float', 'They glow'],
          correctAnswer: 1,
          explanation: 'Mangroves are special trees that can grow in salty coastal water!'
        },
        {
          id: 'm-h-2',
          question: 'What is the largest rainforest region in Asia?',
          options: ['Siberia', 'Gobi', 'Southeast Asia', 'Middle East'],
          correctAnswer: 2,
          explanation: 'Southeast Asia has large tropical rainforests!'
        },
        {
          id: 'm-h-3',
          question: 'What makes a wetland special?',
          options: ['Always dry', 'Water and land mix', 'Only rocks', 'Very cold'],
          correctAnswer: 1,
          explanation: 'Wetlands are areas where water and land meet, home to many species!'
        },
        {
          id: 'm-h-4',
          question: 'Where would you find a yak?',
          options: ['Beach', 'High mountains', 'Desert', 'Jungle'],
          correctAnswer: 1,
          explanation: 'Yaks live in the high mountains of the Himalayas!'
        },
        {
          id: 'm-h-5',
          question: 'What is a coral reef?',
          options: ['A type of fish', 'Underwater community', 'A plant', 'A rock'],
          correctAnswer: 1,
          explanation: 'Coral reefs are underwater ecosystems built by tiny animals!'
        }
      ]
    },
    {
      id: 'conservation',
      name: 'Conservation',
      questions: [
        {
          id: 'm-c-1',
          question: 'What does "endangered" mean?',
          options: ['Very common', 'In danger of dying out', 'Very big', 'Very fast'],
          correctAnswer: 1,
          explanation: 'Endangered animals are at risk of disappearing forever!'
        },
        {
          id: 'm-c-2',
          question: 'Why are bees important?',
          options: ['They make noise', 'They pollinate plants', 'They are scary', 'They dig'],
          correctAnswer: 1,
          explanation: 'Bees help plants grow by spreading pollen from flower to flower!'
        },
        {
          id: 'm-c-3',
          question: 'What is a nature reserve?',
          options: ['A zoo', 'Protected wild area', 'A farm', 'A park'],
          correctAnswer: 1,
          explanation: 'Nature reserves are protected areas where wildlife can live safely!'
        },
        {
          id: 'm-c-4',
          question: 'What causes habitat loss?',
          options: ['Rain', 'Cutting forests', 'Wind', 'Clouds'],
          correctAnswer: 1,
          explanation: 'When we cut down forests, animals lose their homes!'
        },
        {
          id: 'm-c-5',
          question: 'How can we save water?',
          options: ['Waste it', 'Turn off taps', 'Keep it running', 'Ignore it'],
          correctAnswer: 1,
          explanation: 'Turning off taps when not using water helps save this precious resource!'
        }
      ]
    },
    {
      id: 'funfacts',
      name: 'Fun Facts',
      questions: [
        {
          id: 'm-f-1',
          question: 'How long can a crocodile hold its breath?',
          options: ['1 minute', 'Over an hour', '5 minutes', '10 seconds'],
          correctAnswer: 1,
          explanation: 'Crocodiles can hold their breath underwater for over an hour!'
        },
        {
          id: 'm-f-2',
          question: 'What is special about a chameleon?',
          options: ['It flies', 'Changes color', 'Lives in water', 'Has no tail'],
          correctAnswer: 1,
          explanation: 'Chameleons can change their color to match their surroundings!'
        },
        {
          id: 'm-f-3',
          question: 'How do flying squirrels fly?',
          options: ['Wings', 'Gliding with skin flaps', 'Magic', 'Jumping'],
          correctAnswer: 1,
          explanation: 'Flying squirrels glide using flaps of skin between their legs!'
        },
        {
          id: 'm-f-4',
          question: 'What makes the stink bug defend itself?',
          options: ['Biting', 'Bad smell', 'Loud noise', 'Bright light'],
          correctAnswer: 1,
          explanation: 'Stink bugs release a bad smell when they feel threatened!'
        },
        {
          id: 'm-f-5',
          question: 'Can elephants recognize themselves in a mirror?',
          options: ['Yes', 'No', 'Sometimes', 'Never'],
          correctAnswer: 0,
          explanation: 'Elephants are smart enough to recognize themselves in mirrors!'
        }
      ]
    }
  ]
};

// Level 3: Hard - For kids ready for more challenging questions
const hardLevel: QuizLevel = {
  id: 'level-3',
  name: 'Expert',
  difficulty: 'hard',
  description: 'You\'re becoming a nature expert! Ready for the challenge?',
  categories: [
    {
      id: 'animals',
      name: 'Animals of Asia',
      questions: [
        {
          id: 'h-a-1',
          question: 'Which bear species naturally occurs in both South America and Asia?',
          options: ['Spectacled Bear', 'Sloth Bear', 'Sun Bear', 'None - trick question'],
          correctAnswer: 3,
          explanation: 'This was a trick question! No bear species naturally lives in both continents. Spectacled bears are only in South America, and Asian bears stay in Asia!'
        },
        {
          id: 'h-a-2',
          question: 'Which big cat has the longest canine teeth?',
          options: ['Tiger', 'Clouded Leopard', 'Lion', 'Jaguar'],
          correctAnswer: 1,
          explanation: 'Clouded leopards have the longest canine teeth relative to body size!'
        },
        {
          id: 'h-a-3',
          question: 'What makes the pangolin unique among mammals?',
          options: ['It has scales', 'It can fly', 'It lives underwater', 'It has no eyes'],
          correctAnswer: 0,
          explanation: 'Pangolins are the only mammals covered in scales!'
        },
        {
          id: 'h-a-4',
          question: 'How do orangutans spend most of their time?',
          options: ['Swimming', 'In trees', 'Underground', 'In caves'],
          correctAnswer: 1,
          explanation: 'Orangutans are arboreal, spending most of their life in trees!'
        },
        {
          id: 'h-a-5',
          question: 'What makes the tarsier\'s eyes special?',
          options: ['Change color', 'Bigger than brain', 'Can see through things', 'Glow in dark'],
          correctAnswer: 1,
          explanation: 'A tarsier\'s eyes are actually bigger than its brain!'
        }
      ]
    },
    {
      id: 'plants',
      name: 'Plants and Trees',
      questions: [
        {
          id: 'h-p-1',
          question: 'What is the world\'s largest flower found in Asia?',
          options: ['Lotus', 'Rafflesia', 'Orchid', 'Sunflower'],
          correctAnswer: 1,
          explanation: 'Rafflesia arnoldii can grow up to 3 feet wide and smells like rotting meat!'
        },
        {
          id: 'h-p-2',
          question: 'How does bamboo grow compared to other plants?',
          options: ['Very slowly', 'Very quickly', 'Only at night', 'Backwards'],
          correctAnswer: 1,
          explanation: 'Bamboo is one of the fastest-growing plants, growing up to 3 feet in a day!'
        },
        {
          id: 'h-p-3',
          question: 'What carnivorous plant traps insects in Asia?',
          options: ['Venus flytrap', 'Pitcher plant', 'Cactus', 'Lily'],
          correctAnswer: 1,
          explanation: 'Asian pitcher plants trap insects in their pitcher-shaped leaves!'
        },
        {
          id: 'h-p-4',
          question: 'What does the banyan tree do that\'s unusual?',
          options: ['Walks', 'Grows aerial roots', 'Moves leaves', 'Eats insects'],
          correctAnswer: 1,
          explanation: 'Banyan trees grow roots from their branches down to the ground!'
        },
        {
          id: 'h-p-5',
          question: 'Why is the dragon\'s blood tree named that way?',
          options: ['Dragons lived there', 'Red sap', 'Shape', 'Dangerous'],
          correctAnswer: 1,
          explanation: 'It produces red sap that looks like blood when cut!'
        }
      ]
    },
    {
      id: 'birds',
      name: 'Birds',
      questions: [
        {
          id: 'h-b-1',
          question: 'Which bird builds the smallest nest?',
          options: ['Eagle', 'Hummingbird', 'Sparrow', 'Robin'],
          correctAnswer: 1,
          explanation: 'Hummingbirds build tiny nests about the size of a walnut shell!'
        },
        {
          id: 'h-b-2',
          question: 'What makes the Philippine Eagle critically endangered?',
          options: ['Too many predators', 'Habitat loss', 'Disease', 'Climate only'],
          correctAnswer: 1,
          explanation: 'Philippine Eagles are endangered mainly due to deforestation!'
        },
        {
          id: 'h-b-3',
          question: 'How do bar-headed geese migrate?',
          options: ['Over mountains', 'Underground', 'Through caves', 'By swimming'],
          correctAnswer: 0,
          explanation: 'Bar-headed geese fly over the Himalayas, the highest mountains!'
        },
        {
          id: 'h-b-4',
          question: 'What is unique about the hoopoe bird?',
          options: ['Crown of feathers', 'Four wings', 'No beak', 'Blue color'],
          correctAnswer: 0,
          explanation: 'Hoopoes have a distinctive crown of feathers they can raise!'
        },
        {
          id: 'h-b-5',
          question: 'Why are owls able to hunt at night?',
          options: ['They glow', 'Excellent hearing and vision', 'Echolocation', 'Smell'],
          correctAnswer: 1,
          explanation: 'Owls have amazing vision and hearing for hunting in darkness!'
        }
      ]
    },
    {
      id: 'insects',
      name: 'Insects',
      questions: [
        {
          id: 'h-i-1',
          question: 'What makes the Atlas moth special?',
          options: ['Smallest moth', 'One of largest moths', 'Can swim', 'Lives 10 years'],
          correctAnswer: 1,
          explanation: 'The Atlas moth is one of the largest moths with a wingspan up to 10 inches!'
        },
        {
          id: 'h-i-2',
          question: 'How do bombardier beetles defend themselves?',
          options: ['Playing dead', 'Hot chemical spray', 'Flying fast', 'Camouflage'],
          correctAnswer: 1,
          explanation: 'Bombardier beetles spray hot, toxic chemicals at predators!'
        },
        {
          id: 'h-i-3',
          question: 'What is special about the life cycle of cicadas?',
          options: ['They live 1 day', 'Underground for years', 'Born as adults', 'Never eat'],
          correctAnswer: 1,
          explanation: 'Some cicadas live underground for up to 17 years before emerging!'
        },
        {
          id: 'h-i-4',
          question: 'How do leaf insects protect themselves?',
          options: ['Poison', 'Look like leaves', 'Run fast', 'Dig holes'],
          correctAnswer: 1,
          explanation: 'Leaf insects are masters of camouflage, looking exactly like leaves!'
        },
        {
          id: 'h-i-5',
          question: 'What makes the honey bee\'s dance important?',
          options: ['Entertainment', 'Tells location of food', 'Scares predators', 'Mating ritual'],
          correctAnswer: 1,
          explanation: 'Bees do a "waggle dance" to tell others where to find flowers!'
        }
      ]
    },
    {
      id: 'marine',
      name: 'Marine Life',
      questions: [
        {
          id: 'h-m-1',
          question: 'What makes the mimic octopus remarkable?',
          options: ['Talks', 'Imitates other animals', 'Lives on land', 'Breathes air'],
          correctAnswer: 1,
          explanation: 'Mimic octopuses can imitate other sea creatures like lionfish!'
        },
        {
          id: 'h-m-2',
          question: 'How do whale sharks eat?',
          options: ['Filter feeding', 'Hunting seals', 'Eating plants', 'Catching birds'],
          correctAnswer: 0,
          explanation: 'Whale sharks filter tiny plankton from the water despite being huge!'
        },
        {
          id: 'h-m-3',
          question: 'What is bioluminescence in marine life?',
          options: ['Breathing', 'Making light', 'Swimming', 'Eating'],
          correctAnswer: 1,
          explanation: 'Some ocean creatures can produce their own light!'
        },
        {
          id: 'h-m-4',
          question: 'Why are seahorses unusual?',
          options: ['Male carries babies', 'They fly', 'They walk', 'They bark'],
          correctAnswer: 0,
          explanation: 'Male seahorses carry and give birth to the babies, not females!'
        },
        {
          id: 'h-m-5',
          question: 'What helps remora fish attach to sharks?',
          options: ['Glue', 'Suction disc', 'Teeth', 'Claws'],
          correctAnswer: 1,
          explanation: 'Remoras have a suction disc on their head to attach to larger fish!'
        }
      ]
    },
    {
      id: 'habitats',
      name: 'Habitats',
      questions: [
        {
          id: 'h-h-1',
          question: 'What creates the unique ecosystem of the Sundarbans?',
          options: ['Desert', 'Mangrove forest', 'Ice', 'Volcano'],
          correctAnswer: 1,
          explanation: 'The Sundarbans is the world\'s largest mangrove forest!'
        },
        {
          id: 'h-h-2',
          question: 'Why are alpine meadows important?',
          options: ['Shopping centers', 'Biodiversity hotspots', 'Oil production', 'Mining'],
          correctAnswer: 1,
          explanation: 'Alpine meadows in mountains are home to unique species!'
        },
        {
          id: 'h-h-3',
          question: 'What makes tropical peat forests special?',
          options: ['Store carbon', 'Produce gold', 'Always frozen', 'No animals'],
          correctAnswer: 0,
          explanation: 'Peat forests store huge amounts of carbon and prevent climate change!'
        },
        {
          id: 'h-h-4',
          question: 'What is a biodiversity hotspot?',
          options: ['Hot weather area', 'Area with many unique species', 'Volcanic region', 'Desert'],
          correctAnswer: 1,
          explanation: 'Biodiversity hotspots have many species found nowhere else!'
        },
        {
          id: 'h-h-5',
          question: 'Why are kelp forests important?',
          options: ['Provide oxygen', 'Make plastic', 'Produce oil', 'Store gold'],
          correctAnswer: 0,
          explanation: 'Kelp forests produce oxygen and provide habitat for marine life!'
        }
      ]
    },
    {
      id: 'conservation',
      name: 'Conservation',
      questions: [
        {
          id: 'h-c-1',
          question: 'What does IUCN Red List do?',
          options: ['Lists colors', 'Tracks endangered species', 'Sells animals', 'Makes rules'],
          correctAnswer: 1,
          explanation: 'The IUCN Red List tracks which species are threatened with extinction!'
        },
        {
          id: 'h-c-2',
          question: 'What is rewilding?',
          options: ['Training pets', 'Restoring wild habitats', 'Building cities', 'Hunting'],
          correctAnswer: 1,
          explanation: 'Rewilding means bringing back natural ecosystems and species!'
        },
        {
          id: 'h-c-3',
          question: 'Why is the illegal wildlife trade harmful?',
          options: ['Too expensive', 'Drives species to extinction', 'Makes noise', 'Takes time'],
          correctAnswer: 1,
          explanation: 'Illegal trade pushes many species toward extinction!'
        },
        {
          id: 'h-c-4',
          question: 'What is a keystone species?',
          options: ['Biggest animal', 'Species vital for ecosystem', 'Oldest animal', 'Fastest animal'],
          correctAnswer: 1,
          explanation: 'Keystone species are crucial - removing them harms the whole ecosystem!'
        },
        {
          id: 'h-c-5',
          question: 'How does climate change affect wildlife?',
          options: ['No effect', 'Changes habitats', 'Makes animals happy', 'Makes them dance'],
          correctAnswer: 1,
          explanation: 'Climate change disrupts habitats and food sources for wildlife!'
        }
      ]
    },
    {
      id: 'funfacts',
      name: 'Fun Facts',
      questions: [
        {
          id: 'h-f-1',
          question: 'How intelligent are crows?',
          options: ['Not smart', 'Use tools', 'Can\'t learn', 'Very simple'],
          correctAnswer: 1,
          explanation: 'Crows are highly intelligent and can make and use tools!'
        },
        {
          id: 'h-f-2',
          question: 'What is unique about the platypus?',
          options: ['Lays eggs and has venom', 'Has wings', 'Lives 100 years', 'Breathes fire'],
          correctAnswer: 0,
          explanation: 'The platypus is a mammal that lays eggs and males have venomous spurs!'
        },
        {
          id: 'h-f-3',
          question: 'How do mudskippers breathe on land?',
          options: ['Hold breath', 'Through skin', 'Don\'t breathe', 'Through gills with water'],
          correctAnswer: 3,
          explanation: 'Mudskippers keep water in their gills to breathe on land!'
        },
        {
          id: 'h-f-4',
          question: 'What makes the pistol shrimp special?',
          options: ['Shoots bubbles loudly', 'Has gun', 'Very quiet', 'Lives forever'],
          correctAnswer: 0,
          explanation: 'Pistol shrimp create bubbles so loud they can stun prey!'
        },
        {
          id: 'h-f-5',
          question: 'Why do gibbons sing?',
          options: ['Bored', 'Defend territory', 'Can\'t stop', 'No reason'],
          correctAnswer: 1,
          explanation: 'Gibbons sing beautiful songs to mark their territory and bond with mates!'
        }
      ]
    }
  ]
};

export const quizData: QuizLevel[] = [easyLevel, mediumLevel, hardLevel];
