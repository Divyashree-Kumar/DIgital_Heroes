import { SummarizerApp } from "@/components/summarizer-app";

export const metadata = {
  title: "TF-IDF Summarizer",
  description: "Frontend and backend text summarizer powered by TF-IDF sentence scoring"
};

export default function SummarizerPage() {
  return <SummarizerApp />;
}
