import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AnswerInput = ({ onSubmit, isSubmitting }) => {
    const [answer, setAnswer] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (answer.trim()) {
            onSubmit(answer);
            setAnswer('');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
        >
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Your Answer</h3>

            <form onSubmit={handleSubmit}>
                <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                    disabled={isSubmitting}
                />

                <div className="flex justify-end mt-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={!answer.trim() || isSubmitting}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Answer'}
                    </motion.button>
                </div>
            </form>
        </motion.div>
    );
};

export default AnswerInput;