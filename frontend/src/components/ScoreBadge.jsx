import React from 'react';
import { motion } from 'framer-motion';

const ScoreBadge = ({ score, maxScore = 10 }) => {
    const percentage = (score / maxScore) * 100;

    let colorClass = '';
    let label = '';

    if (percentage >= 80) {
        colorClass = 'bg-green-500';
        label = 'Excellent';
    } else if (percentage >= 60) {
        colorClass = 'bg-blue-500';
        label = 'Good';
    } else if (percentage >= 40) {
        colorClass = 'bg-yellow-500';
        label = 'Average';
    } else {
        colorClass = 'bg-red-500';
        label = 'Needs Improvement';
    }

    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="inline-flex flex-col items-center"
        >
            <div className={`w-24 h-24 rounded-full ${colorClass} flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                {score}/{maxScore}
            </div>
            <span className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                {label}
            </span>
        </motion.div>
    );
};

export default ScoreBadge;