const rules = [
    {
        icon: "fa-id-card",
        title: "১. ID Verification",
        content: "টাকা উত্তোলনের আগে ID Verification করা আবশ্যক।\nID Verification সম্পন্ন হওয়ার দিন থেকে আপনার অ্যাকাউন্ট Withdraw-এর জন্য প্রস্তুত হওয়ার সময় গণনা শুরু হবে।"
    },
    {
        icon: "fa-hourglass-half",
        title: "২. নিরাপত্তা যাচাই সময়",
        content: "ID Verification সম্পন্ন করার পর একটি নির্দিষ্ট নিরাপত্তা সময় (Security Period) রাখা হয়।\nএই সময় শেষ হলে আপনার অ্যাকাউন্ট থেকে টাকা উত্তোলনের অপশন চালু হবে।\nএই নিয়মটি সবার জন্য সমানভাবে প্রযোজ্য।\n(নোট: এই সময়টি সিস্টেম অনুযায়ী পরিবর্তনযোগ্য)"
    },
    {
        icon: "fa-calendar-days",
        title: "৩. নির্দিষ্ট দিনে টাকা উত্তোলন",
        content: "নিরাপত্তা সময় শেষ হওয়ার পর, আপনি প্রতি মাসের নির্দিষ্ট দিনে টাকা উত্তোলন করতে পারবেন (বর্তমানে: ১০ ও ১১ তারিখ)।\nএতে করে সবার পেমেন্ট সঠিকভাবে এবং দ্রুত প্রসেস করা সম্ভব হয়।"
    },
    {
        icon: "fa-ban",
        title: "৪. নিয়মের বাইরে চেষ্টা করলে",
        content: "যদি নির্ধারিত সময় বা দিনের বাইরে Withdraw করার চেষ্টা করা হয়,\nসিস্টেম আপনাকে একটি সহজ ও পরিষ্কার নোটিস দেখাবে, যেন আপনি বুঝতে পারেন কখন Withdraw করা যাবে।"
    },
    {
        icon: "fa-bell",
        title: "৫. Withdraw Request নোটিফিকেশন",
        content: "আপনি যখনই Withdraw Request করবেন,\nতখন আমাদের টিম সাথে সাথে নোটিফিকেশন পাবে এবং যাচাই শেষে পেমেন্ট প্রসেস করা হবে।"
    },
    {
        icon: "fa-shield-halved",
        title: "৬. স্বচ্ছতা ও বিশ্বাস",
        content: "পুরো প্রক্রিয়াটি অটোমেটিক, নিরাপদ এবং স্বচ্ছ।\nইউজার যেকোনো সময় অ্যাপে ঢুকে নিজের Withdraw Status দেখতে পারবে।"
    }
];

const RuleCard = ({ icon, title, content }: { icon: string, title: string, content: string }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex items-start space-x-4 hover:shadow-cyan-100 hover:border-cyan-200 transition-shadow duration-300">
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-cyan-100 text-cyan-600 flex-shrink-0 mt-1">
            <i className={`fa-solid ${icon} fa-lg`}></i>
        </div>
        <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600 whitespace-pre-line leading-relaxed">{content}</p>
        </div>
    </div>
);

const WithdrawalRules = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Withdrawal Rules / টাকা তোলার নিয়মাবলী</h2>
            <div className="space-y-6">
                {rules.map(rule => (
                    <div key={rule.title}>
                        <RuleCard icon={rule.icon} title={rule.title} content={rule.content} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WithdrawalRules;
