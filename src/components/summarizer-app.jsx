"use client";

import { startTransition, useDeferredValue, useState } from "react";
import { TopNav } from "@/components/common";

const SAMPLE_TEXT =
  "TF-IDF summarization ranks sentences by how distinctive their words are within the full passage. " +
  "Common words appear in many sentences and carry less weight. " +
  "Specific terms that show up in only a few sentences receive stronger scores. " +
  "That makes the method useful for extractive summaries where the goal is to keep the original wording. " +
  "It is simple to implement, fast to run, and often a solid baseline before moving to more advanced models.";

export function SummarizerApp() {
  const [text, setText] = useState(SAMPLE_TEXT);
  const [sentenceCount, setSentenceCount] = useState("3");
  const [summary, setSummary] = useState("");
  const [details, setDetails] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const deferredText = useDeferredValue(text);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text,
          sentenceCount: Number.parseInt(sentenceCount, 10)
        })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Failed to summarize the text.");
      }

      startTransition(() => {
        setSummary(payload.summary);
        setDetails(payload);
      });
    } catch (requestError) {
      setSummary("");
      setDetails(null);
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  function loadSample() {
    setText(SAMPLE_TEXT);
    setSummary("");
    setDetails(null);
    setError("");
  }

  const liveSentenceEstimate =
    deferredText.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.filter(Boolean).length || 0;

  return (
    <main className="page-shell">
      <TopNav />
      <section className="summarizer-hero">
        <div className="hero-copy">
          <p className="eyebrow">TF-IDF text summarizer</p>
          <h1>
            Extract the most distinctive sentences
            <span>from any passage you paste in.</span>
          </h1>
          <p className="hero-text">
            The frontend sends your text to a backend API route, which scores each sentence with TF-IDF and
            returns the strongest extractive summary.
          </p>
          <div className="hero-metrics">
            <article>
              <strong>{deferredText.length}</strong>
              <span>Characters entered</span>
            </article>
            <article>
              <strong>{liveSentenceEstimate}</strong>
              <span>Detected sentences</span>
            </article>
            <article>
              <strong>{summary ? details?.sentenceCount ?? 0 : 0}</strong>
              <span>Summary sentences</span>
            </article>
          </div>
        </div>
        <aside className="panel-card summarizer-note">
          <p className="card-label">How it works</p>
          <h2>Frontend and backend included</h2>
          <p>
            The UI collects input, the API validates it, and the shared summarizer library computes sentence
            scores so the same logic can be reused from the CLI.
          </p>
          <div className="action-row">
            <button className="button button-secondary" onClick={loadSample} type="button">
              Load sample text
            </button>
          </div>
        </aside>
      </section>

      <section className="summarizer-grid">
        <form className="panel-card summarizer-form" onSubmit={handleSubmit}>
          <div className="section-heading stack-mobile">
            <div>
              <p className="card-label">Input</p>
              <h2>Paste source text</h2>
            </div>
          </div>

          <label className="full-span">
            Text to summarize
            <textarea
              className="summarizer-textarea"
              name="text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Paste an article, paragraph, or notes here."
            />
          </label>

          <div className="form-grid compact-grid">
            <label>
              Summary length
              <select
                name="sentenceCount"
                value={sentenceCount}
                onChange={(event) => setSentenceCount(event.target.value)}
              >
                <option value="1">1 sentence</option>
                <option value="2">2 sentences</option>
                <option value="3">3 sentences</option>
                <option value="4">4 sentences</option>
                <option value="5">5 sentences</option>
              </select>
            </label>
            <div className="action-row">
              <button className="button button-primary" disabled={isLoading} type="submit">
                {isLoading ? "Summarizing..." : "Generate summary"}
              </button>
            </div>
          </div>

          <p className="inline-note">
            Use longer input for better results. Very short passages do not give TF-IDF much signal.
          </p>
          <p className="inline-error">{error}</p>
        </form>

        <article className="panel-card summarizer-results">
          <p className="card-label">Output</p>
          <h2>Summary</h2>
          <div className="summary-output">
            {summary ? (
              <p>{summary}</p>
            ) : (
              <p className="summary-note">Your extracted summary will appear here after the API returns.</p>
            )}
          </div>

          <div className="summary-list">
            <div>
              <strong>{details?.originalSentenceCount ?? 0}</strong>
              <span>Original sentences</span>
            </div>
            <div>
              <strong>{details?.sentenceCount ?? 0}</strong>
              <span>Selected sentences</span>
            </div>
          </div>

          {details?.extractedSentences?.length ? (
            <div className="sentence-stack">
              {details.extractedSentences.map((sentence, index) => (
                <article className="sentence-card" key={`${index}-${sentence.slice(0, 20)}`}>
                  <span className="pill">Sentence {index + 1}</span>
                  <p>{sentence}</p>
                </article>
              ))}
            </div>
          ) : null}
        </article>
      </section>
    </main>
  );
}
