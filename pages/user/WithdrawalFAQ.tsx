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

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-2">{question}</h3>
            <p className="text-gray-600">{answer}</p>
        </div>
    );
}

const WithdrawalFAQ = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Frequently Asked Questions (FAQ)</h2>
            <div className="space-y-4">
                {faqData.map(item => (
                    // FIX: Wrapped FAQItem in a div and moved the key to the wrapper to resolve a TypeScript error.
                    <div key={item.question}>
                        <FAQItem question={item.question} answer={item.answer} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WithdrawalFAQ;