export function buildQuestions(test) {
  return Object.entries(test.questions).map(([key, value]) => ({
    id: key,
    question: value,
    correctIndex: test.answers[key],
    choices: test.options ? test.options[key] : [],
    body: test.body[key],
    explanation: test.explanation[key],
    topic: test.topic[key],
    containsMarkdown: test.containsMarkdown[key],
    containsMath: test.containsMath?.[key] ?? false,
    type: test.type?.[key],
  }))
}
