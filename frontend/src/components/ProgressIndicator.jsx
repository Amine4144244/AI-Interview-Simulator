import React from 'react';
import { motion } from 'framer-motion';

const ProgressIndicator = ({ current, total }) => {
    const progressPercentage = (current / total) * 100;

    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Progress
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {current} / {total}
                </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <motion.div
                    className="bg-blue-500 h-2.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>
        </div>
    );
};

export default ProgressIndicator;