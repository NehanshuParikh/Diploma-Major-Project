import React from 'react';

const Card = ({ title, description }) => {
  return (
    <div className="bg-white transition-colors duration-500 ease-in-out dark:bg-gray-800 p-4 rounded static shadow-md w-auto full md:w-1/4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
      <h3 className="text-lg font-bold dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
};

export default Card;
