import React from 'react';

export default function MessageItem({ isAuthor, data }) {
  // Determine alignment and styling based on author
  const isYou = isAuthor === 'you';

  return (
    <div
      className={`flex flex-col flex-nowrap gap-0.5 my-2 mx-4 ${
        isYou ? 'items-end' : 'items-start'
      }`}
    >
      <div
        className={`flex items-center justify-center gap-2 ${
          isYou ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        <div
          className={`
            font-semibold 
            ${isYou ? 'text-base font-semibold tracking-widest' : 'font-semibold tracking-widest'}
            ${isYou ? '' : ''}
            text-sm sm:text-xs
          `}
          style={{ letterSpacing: '1px' }}
        >
          {isYou ? 'You' : data.USER_NAME}
        </div>
        <div
          className="text-xs sm:text-[0.7rem]"
          style={{ letterSpacing: '1px' }}
        >
          {data.TIME}
        </div>
      </div>
      <div
        className={`
          max-w-[30rem] sm:max-w-[25rem] xs:max-w-[18rem] 
          xsm:max-w-[15rem]
          p-2 sm:p-1.5 
          break-words whitespace-pre-wrap
          ${isYou
            ? 'bg-blue-600 text-white rounded-[0.75rem_0_0.75rem_0.75rem]'
            : 'bg-gray-800 text-white rounded-[0_0.75rem_0.75rem_0.75rem]'
          }
        `}
        style={{ minWidth: '3rem' }}
      >
        {data.CONTENT}
      </div>
    </div>
  );
}
