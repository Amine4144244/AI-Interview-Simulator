import React from 'react';
import { motion } from 'framer-motion';
import { marked } from 'marked';

const FeedbackPanel = ({ evaluation, isVisible }) => {
    if (!isVisible || !evaluation) return null;

    const { score, strengths, weaknesses, suggestions } = evaluation;

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 overflow-hidden"
        >
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">AI Feedback</h3>

            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Score</span>
                    <span className={`text-2xl font-bold ${score >= 8 ? 'text-green-500' :
                            score >= 5 ? 'text-yellow-500' :
                                'text-red-500'
                        }`}>
                        {score}/10
                    </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                        className={`h-2.5 rounded-full ${score >= 8 ? 'bg-green-500' :
                                score >= 5 ? 'bg-yellow-500' :
                                    'bg-red-500'
                            }`}
                        style={{ width: `${score * 10}%` }}
                    />
                </div>
            </div>

            {strengths && strengths.length > 0 && (
                <div className="mb-4">
                    <h4 className="font-medium text-green-600 dark:text-green-400 mb-2">Strengths</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        {strengths.map((strength, index) => (
                            <li key={index} dangerouslySetInnerHTML={{ __html: marked(strength) }} />
                        ))}
                    </ul>
                </div>
            )}

            {weaknesses && weaknesses.length > 0 && (
                <div className="mb-4">
                    <h4 className="font-medium text-red-600 dark:text-red-400 mb-2">Areas for Improvement</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        {weaknesses.map((weakness, index) => (
                            <li key={index} dangerouslySetInnerHTML={{ __html: marked(weakness) }} />
                        ))}
                    </ul>
                </div>
            )}

            {suggestions && suggestions.length > 0 && (
                <div>
                    <h4 className="font-medium text-blue-600 dark:text-blue-400 mb-2">Suggestions</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        {suggestions.map((suggestion, index) => (
                            <li key={index} dangerouslySetInnerHTML={{ __html: marked(suggestion) }} />
                        ))}
                    </ul>
                </div>
            )}
        </motion.div>
    );
};

export default FeedbackPanel;