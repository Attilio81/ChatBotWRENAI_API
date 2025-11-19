import { useEffect, useState } from 'react';
import { wrenService } from '../services/wren';
import './QuickQuestions.css';

interface QuickQuestionsProps {
    onSelectQuestion: (question: string) => void;
}

interface SavedQuestion {
    id: string;
    question: string;
    sql: string;
}

export const QuickQuestions = ({ onSelectQuestion }: QuickQuestionsProps) => {
    const [savedQuestions, setSavedQuestions] = useState<SavedQuestion[]>([]);
    const [showAll, setShowAll] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSavedQuestions();
    }, []);

    const loadSavedQuestions = async () => {
        try {
            const result = await wrenService.getSqlPairs();
            if (result.data && Array.isArray(result.data)) {
                setSavedQuestions(result.data);
            }
        } catch (error) {
            console.error('Error loading saved questions:', error);
        } finally {
            setLoading(false);
        }
    };

    const getQuestionIcon = (question: string): string => {
        const lowerQ = question.toLowerCase();
        if (lowerQ.includes('venditori') || lowerQ.includes('agenti') || lowerQ.includes('venduto')) return '📊';
        if (lowerQ.includes('fatturato') || lowerQ.includes('revenue') || lowerQ.includes('soldi')) return '💰';
        if (lowerQ.includes('prodotti') || lowerQ.includes('articoli')) return '📦';
        if (lowerQ.includes('clienti') || lowerQ.includes('customer')) return '👥';
        if (lowerQ.includes('trend') || lowerQ.includes('crescita')) return '📈';
        return '❓';
    };

    if (loading) {
        return null; // Don't show anything while loading
    }

    if (savedQuestions.length === 0) {
        return null; // Don't show if no saved questions
    }

    const displayQuestions = showAll ? savedQuestions : savedQuestions.slice(0, 5);

    return (
        <div className="quick-questions">
            <div className="quick-questions-header">
                <span className="quick-questions-title">⚡ Domande rapide:</span>
            </div>
            <div className="quick-questions-pills">
                {displayQuestions.map((sq) => (
                    <button
                        key={sq.id}
                        className="quick-question-pill"
                        onClick={() => onSelectQuestion(sq.question)}
                        title={sq.question}
                    >
                        <span className="pill-icon">{getQuestionIcon(sq.question)}</span>
                        <span className="pill-text">{sq.question}</span>
                    </button>
                ))}
                {savedQuestions.length > 5 && (
                    <button
                        className="quick-question-pill show-all"
                        onClick={() => setShowAll(!showAll)}
                    >
                        <span className="pill-icon">🎯</span>
                        <span className="pill-text">{showAll ? 'Mostra meno' : `Vedi tutte (${savedQuestions.length})`}</span>
                    </button>
                )}
            </div>
        </div>
    );
};
