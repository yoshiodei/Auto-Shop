import { Timestamp } from 'firebase/firestore';

export default function TextBubble({message, isMine}: {
  message: { text: string; createdAt: any };
  isMine:  boolean;
}) {

    const time = message.createdAt instanceof Timestamp
    ? message.createdAt.toDate().toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit',
      })
    : '';


  return (
    // <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
    //   <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
    //     isMine
    //       ? 'bg-[#FF6B7A] text-white rounded-br-sm'
    //       : 'bg-gray-100 text-gray-900 rounded-bl-sm'
    //   }`}>
    //     <p className="text-sm leading-relaxed break-words">{message.text}</p>
    //     <p className={`text-[10px] mt-1 text-right ${
    //       isMine ? 'text-white/70' : 'text-gray-400'
    //     }`}>
    //       {time}
    //     </p>
    //   </div>
    // </div>

     <div
    //    key={message.id}
       className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
     >
       <div
         className={`max-w-xs px-4 py-2 rounded-lg ${
                       isMine
                       ? 'bg-[#FF6B7A] text-white rounded-br-none'
                       : 'bg-gray-100 text-gray-900 rounded-bl-none'
                      }`
                    }
    >
        <p className="text-sm">{message.text}</p>
        <p className={`text-xs mt-1 ${isMine ? 'text-white text-opacity-70' : 'text-gray-500'}`}>
          {time}
        </p>
      </div>
    </div>
  )
}

