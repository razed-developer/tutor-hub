import type { Question } from '../types'

export const questionBank: Question[] = [
  {
    id: 'fractions-g6-add-001',
    topic: 'fractions',
    grade: 6,
    difficulty: 1,
    skill: 'Add fractions with unlike denominators',
    curriculum: ['BC-MATH-6-NUMBER'],
    prompt: String.raw`\frac{2}{3}+\frac{1}{6}`,
    finalAnswer: String.raw`\frac{5}{6}`,
    choices: [
      { id: 'a', value: String.raw`\frac{3}{9}` },
      { id: 'b', value: String.raw`\frac{5}{6}` },
      { id: 'c', value: String.raw`\frac{3}{6}` },
      { id: 'd', value: String.raw`\frac{2}{9}` }
    ],
    correctChoiceId: 'b',
    solutionSteps: [
      { title: 'Find a common denominator', body: 'The least common denominator of 3 and 6 is 6.' },
      { title: 'Rename the first fraction', body: 'Multiply the numerator and denominator of 2/3 by 2.', math: String.raw`\frac{2}{3}=\frac{4}{6}` },
      { title: 'Add the numerators', body: 'Keep the denominator 6 and add 4 + 1.', math: String.raw`\frac{4}{6}+\frac{1}{6}=\frac{5}{6}` }
    ]
  },
  {
    id: 'fractions-g6-subtract-001',
    topic: 'fractions',
    grade: 6,
    difficulty: 2,
    skill: 'Subtract fractions with unlike denominators',
    curriculum: ['BC-MATH-6-NUMBER'],
    prompt: String.raw`\frac{5}{8}-\frac{1}{4}`,
    finalAnswer: String.raw`\frac{3}{8}`,
    choices: [
      { id: 'a', value: String.raw`\frac{4}{4}` },
      { id: 'b', value: String.raw`\frac{1}{2}` },
      { id: 'c', value: String.raw`\frac{3}{8}` },
      { id: 'd', value: String.raw`\frac{4}{8}` }
    ],
    correctChoiceId: 'c',
    solutionSteps: [
      { title: 'Use eighths', body: 'The denominator 8 is already a multiple of 4.' },
      { title: 'Rename one fourth', body: 'Multiply its numerator and denominator by 2.', math: String.raw`\frac{1}{4}=\frac{2}{8}` },
      { title: 'Subtract', body: 'Subtract the numerators and keep the denominator.', math: String.raw`\frac{5}{8}-\frac{2}{8}=\frac{3}{8}` }
    ]
  },
  {
    id: 'fractions-g7-multiply-001',
    topic: 'fractions',
    grade: 7,
    difficulty: 2,
    skill: 'Multiply and simplify fractions',
    curriculum: ['BC-MATH-7-NUMBER'],
    prompt: String.raw`\frac{3}{5}\times\frac{10}{9}`,
    finalAnswer: String.raw`\frac{2}{3}`,
    choices: [
      { id: 'a', value: String.raw`\frac{30}{14}` },
      { id: 'b', value: String.raw`\frac{13}{14}` },
      { id: 'c', value: String.raw`\frac{2}{3}` },
      { id: 'd', value: String.raw`\frac{1}{3}` }
    ],
    correctChoiceId: 'c',
    solutionSteps: [
      { title: 'Multiply across', body: 'Multiply the numerators together and the denominators together.', math: String.raw`\frac{3\times10}{5\times9}=\frac{30}{45}` },
      { title: 'Simplify', body: 'The greatest common factor of 30 and 45 is 15.', math: String.raw`\frac{30\div15}{45\div15}=\frac{2}{3}` }
    ]
  },
  {
    id: 'fractions-g7-divide-001',
    topic: 'fractions',
    grade: 7,
    difficulty: 3,
    skill: 'Divide fractions',
    curriculum: ['BC-MATH-7-NUMBER'],
    prompt: String.raw`\frac{7}{12}\div\frac{14}{15}`,
    finalAnswer: String.raw`\frac{5}{8}`,
    choices: [
      { id: 'a', value: String.raw`\frac{5}{8}` },
      { id: 'b', value: String.raw`\frac{98}{180}` },
      { id: 'c', value: String.raw`\frac{7}{10}` },
      { id: 'd', value: String.raw`\frac{8}{5}` }
    ],
    correctChoiceId: 'a',
    solutionSteps: [
      { title: 'Keep, change, flip', body: 'Keep the first fraction, change division to multiplication, and use the reciprocal of the second fraction.', math: String.raw`\frac{7}{12}\times\frac{15}{14}` },
      { title: 'Cross-cancel', body: 'Divide 7 and 14 by 7, and divide 15 and 12 by 3.', math: String.raw`\frac{1}{4}\times\frac{5}{2}` },
      { title: 'Multiply', body: 'Multiply the remaining numerators and denominators.', math: String.raw`\frac{1\times5}{4\times2}=\frac{5}{8}` }
    ]
  },
  {
    id: 'exponents-g8-product-001',
    topic: 'exponents',
    grade: 8,
    difficulty: 1,
    skill: 'Product law of exponents',
    curriculum: ['BC-MATH-8-NUMBER'],
    prompt: String.raw`x^3\cdot x^5`,
    finalAnswer: String.raw`x^8`,
    choices: [
      { id: 'a', value: String.raw`x^{15}` },
      { id: 'b', value: String.raw`2x^8` },
      { id: 'c', value: String.raw`x^8` },
      { id: 'd', value: String.raw`x^2` }
    ],
    correctChoiceId: 'c',
    solutionSteps: [
      { title: 'Identify like bases', body: 'Both factors have the same base, x.' },
      { title: 'Apply the product law', body: 'When multiplying powers with the same base, add the exponents.', math: String.raw`x^3\cdot x^5=x^{3+5}` },
      { title: 'Simplify', body: 'Add 3 and 5.', math: String.raw`x^{3+5}=x^8` }
    ]
  },
  {
    id: 'exponents-g8-quotient-001',
    topic: 'exponents',
    grade: 8,
    difficulty: 2,
    skill: 'Quotient law of exponents',
    curriculum: ['BC-MATH-8-NUMBER'],
    prompt: String.raw`\frac{a^9}{a^4}`,
    finalAnswer: String.raw`a^5`,
    choices: [
      { id: 'a', value: String.raw`a^{13}` },
      { id: 'b', value: String.raw`a^5` },
      { id: 'c', value: String.raw`a^{36}` },
      { id: 'd', value: String.raw`\frac{1}{a^5}` }
    ],
    correctChoiceId: 'b',
    solutionSteps: [
      { title: 'Identify like bases', body: 'The numerator and denominator both use the base a.' },
      { title: 'Apply the quotient law', body: 'Subtract the denominator exponent from the numerator exponent.', math: String.raw`\frac{a^9}{a^4}=a^{9-4}` },
      { title: 'Simplify', body: 'Subtract 4 from 9.', math: String.raw`a^{9-4}=a^5` }
    ]
  },
  {
    id: 'exponents-g8-power-001',
    topic: 'exponents',
    grade: 8,
    difficulty: 2,
    skill: 'Power of a power',
    curriculum: ['BC-MATH-8-NUMBER'],
    prompt: String.raw`(m^3)^4`,
    finalAnswer: String.raw`m^{12}`,
    choices: [
      { id: 'a', value: String.raw`m^7` },
      { id: 'b', value: String.raw`4m^3` },
      { id: 'c', value: String.raw`m^{12}` },
      { id: 'd', value: String.raw`m^{81}` }
    ],
    correctChoiceId: 'c',
    solutionSteps: [
      { title: 'Recognize the structure', body: 'A power is being raised to another power.' },
      { title: 'Multiply the exponents', body: 'The power-of-a-power law says to multiply 3 by 4.', math: String.raw`(m^3)^4=m^{3\times4}` },
      { title: 'Simplify', body: 'Multiply 3 × 4.', math: String.raw`m^{3\times4}=m^{12}` }
    ]
  },
  {
    id: 'exponents-g9-negative-001',
    topic: 'exponents',
    grade: 9,
    difficulty: 3,
    skill: 'Negative exponents',
    curriculum: ['BC-MATH-9-NUMBER'],
    prompt: String.raw`z^{-3}`,
    finalAnswer: String.raw`\frac{1}{z^3}`,
    choices: [
      { id: 'a', value: String.raw`-z^3` },
      { id: 'b', value: String.raw`\frac{1}{z^3}` },
      { id: 'c', value: String.raw`\frac{1}{3z}` },
      { id: 'd', value: String.raw`z^3` }
    ],
    correctChoiceId: 'b',
    solutionSteps: [
      { title: 'Use the negative exponent law', body: 'A negative exponent means take the reciprocal of the base expression.', math: String.raw`z^{-3}=\frac{1}{z^3}` },
      { title: 'Check the sign', body: 'The exponent is negative, but the value is not automatically negative.' }
    ]
  }
]
