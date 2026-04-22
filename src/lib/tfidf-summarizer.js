const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "been", "being", "but", "by",
  "for", "from", "had", "has", "have", "he", "her", "hers", "him", "his",
  "i", "if", "in", "into", "is", "it", "its", "me", "my", "of", "on", "or",
  "our", "ours", "she", "so", "than", "that", "the", "their", "theirs",
  "them", "they", "this", "those", "to", "too", "us", "was", "we", "were",
  "what", "when", "where", "which", "who", "will", "with", "you", "your",
  "yours"
]);

function splitIntoSentences(text) {
  return text
    .replace(/\s+/g, " ")
    .match(/[^.!?]+[.!?]+|[^.!?]+$/g)
    ?.map((sentence) => sentence.trim())
    .filter(Boolean) || [];
}

function tokenize(text) {
  return (text.toLowerCase().match(/[a-z0-9']+/g) || []).filter(
    (token) => !STOP_WORDS.has(token)
  );
}

function buildTfIdfScores(sentences) {
  const tokenizedSentences = sentences.map(tokenize);
  const documentFrequency = new Map();

  for (const tokens of tokenizedSentences) {
    for (const token of new Set(tokens)) {
      documentFrequency.set(token, (documentFrequency.get(token) || 0) + 1);
    }
  }

  const totalSentences = sentences.length;

  return tokenizedSentences.map((tokens, index) => {
    if (tokens.length === 0) {
      return { index, sentence: sentences[index], score: 0 };
    }

    const termFrequency = new Map();
    for (const token of tokens) {
      termFrequency.set(token, (termFrequency.get(token) || 0) + 1);
    }

    let score = 0;
    for (const [token, count] of termFrequency.entries()) {
      const tf = count / tokens.length;
      const df = documentFrequency.get(token) || 1;
      const idf = Math.log(totalSentences / df);
      score += tf * idf;
    }

    return {
      index,
      sentence: sentences[index],
      score
    };
  });
}

function summarizeText(text, sentenceCount = 3) {
  const normalizedText = typeof text === "string" ? text.trim() : "";
  const sentences = splitIntoSentences(normalizedText);

  if (sentences.length === 0) {
    return {
      summary: "",
      extractedSentences: [],
      sentenceCount: 0,
      originalSentenceCount: 0
    };
  }

  const limitedCount = Math.max(1, Math.min(sentenceCount, sentences.length));
  const scoredSentences = buildTfIdfScores(sentences);
  const extractedSentences = scoredSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, limitedCount)
    .sort((a, b) => a.index - b.index)
    .map((item) => item.sentence);

  return {
    summary: extractedSentences.join(" "),
    extractedSentences,
    sentenceCount: extractedSentences.length,
    originalSentenceCount: sentences.length
  };
}

module.exports = {
  summarizeText
};
