import React from 'react';
import { motion } from 'framer-motion';
import { marked } from 'marked';

const QuestionCard = ({ question, questionNumber, totalQuestions }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6"
        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    Question {questionNumber} of {totalQuestions}
                </h2>
                <div className="flex space-x-1">
                    {[...Array(totalQuestions)].map((_, i) => (
                        <div
                            key={i}
                            className={`h-2 w-8 rounded-full ${i < questionNumber - 1
                                    ? 'bg-green-500'
                                    : i === questionNumber - 1
                                        ? 'bg-blue-500'
                                        : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                        />
                    ))}
                </div>
            </div>

            <div className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: marked(question) }} />
            </div>
        </motion.div>
    );
};

export default QuestionCard;