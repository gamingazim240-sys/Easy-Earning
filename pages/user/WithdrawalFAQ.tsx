// FIX: Import React to use React.FC for correct component typing.
import React, { useState } from 'react';

const faqData = [
    {
        question: "Withdraw কবে পাবো?",
        answer: "আপনার Withdraw Request Approve হওয়ার পর, সাধারণত ২৪-৭২ ঘণ্টার মধ্যে পেমেন্ট প্রসেস করা হয়। তবে অনেক সময় অতিরিক্ত যাচাইয়ের জন্য কিছুটা বেশি সময় লাগতে পারে।"
    },
    {
        question: "নিরাপত্তা যাচাইয়ের জন্য ৩০ দিন কেন?",
        answer: "অ্যাকাউন্টের নিরাপত্তা নিশ্চিত করতে এবং যেকোনো ধরনের সন্দেহজনক কার্যকলাপ পর্যবেক্ষণ করার জন্য এই সময়টি প্রয়োজন। এটি আপনার এবং আমাদের উভয়ের জন্য একটি সুরক্ষিত প্ল্যাটফর্ম নিশ্চিত করে।"
    },
    {
        question: " মাসের ১০–১১ তারিখ ছাড়া কেন টাকা তোলা যায় না?",
        answer: "নির্দিষ্ট দিনে Withdraw প্রক্রিয়াটি পরিচালনা করলে আমরা সকল ইউজারের পেমেন্ট একসাথে এবং দ্রুত প্রসেস করতে পারি। এটি আমাদের টিমকে আরও দক্ষতার সাথে কাজ করতে সাহায্য করে এবং ভুল হওয়ার সম্ভাবনা কমায়।"
    },
    {
        question: "আমার Withdraw request reject হয়েছে কেন?",
        answer: "আপনার Transaction History-তে reject হওয়ার কারণ উল্লেখ থাকবে। সাধারণ কারণগুলোর মধ্যে রয়েছে ভুল তথ্য প্রদান, সিস্টেমের নিয়ম লঙ্ঘন, বা নিরাপত্তা সংক্রান্ত সমস্যা। বিস্তারিত জানতে সাপোর্টে যোগাযোগ করতে পারেন।"
    },
];

// FIX: Use React.FC to correctly type the functional component props, allowing React's special 'key' prop.
const FAQItem: React.FC<{ question: string; answer: string; isOpen: boolean; onClick: () => void; }> = ({ question, answer, isOpen, onClick }) => {
    return (
        <div className="border-b border-gray-200 last:border-b-0">
            <button
                onClick={onClick}
                className="w-full flex justify-between items-center text-left p-5 hover:bg-gray-50 focus:outline-none transition duration-300"
                aria-expanded={isOpen}
            >
                <h3 className="text-lg font-semibold text-gray-800">{question}</h3>
                <i className={`fa-solid fa-chevron-down transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-cyan-600' : 'text-gray-400'}`}></i>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}
            >
                <div className="p-5 pt-0">
                    <p className="text-gray-600 leading-relaxed">{answer}</p>
                </div>
            </div>
        </div>
    );
};

const WithdrawalFAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="max-w-4xl mx-auto">
             <div className="text-center mb-10">
                <i className="fa-solid fa-circle-question text-5xl text-cyan-500 mb-4"></i>
                <h2 className="text-3xl font-bold text-gray-800">Frequently Asked Questions</h2>
                <p className="text-gray-500 mt-2">Find answers to common questions about withdrawals.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                {faqData.map((item, index) => (
                    <FAQItem
                        key={item.question}
                        question={item.question}
                        answer={item.answer}
                        isOpen={openIndex === index}
                        onClick={() => handleToggle(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default WithdrawalFAQ;