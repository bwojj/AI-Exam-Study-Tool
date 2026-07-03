export function buildQuestions(test) {
  return Object.entries(test.questions).map(([key, value]) => {
    const choices = test.options?.[key] ?? []
    return {
      id: key,
      question: value,
      correctIndex: test.answers[key],
      choices,
      body: test.body[key],
      explanation: test.explanation[key],
      topic: test.topic[key],
      containsMarkdown: test.containsMarkdown[key],
      containsMath: test.containsMath?.[key] ?? false,
      // `type` is missing on tests saved before this field was persisted to the DB —
      // fall back to inferring it from whether options exist, since short-answer
      // questions never have entries in `options`.
      type: test.type?.[key] ?? (choices.length > 0 ? 'multiple choice' : 'short answer'),
    }
  })
}
