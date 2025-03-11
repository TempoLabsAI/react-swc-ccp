import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Success() {
    const navigate = useNavigate();

    const handleReturn = () => {
        navigate("/dashboard-paid", { replace: true });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FBFBFD]">
            <div className="relative">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#FBFBFD] via-white to-[#FBFBFD] opacity-80 blur-3xl -z-10" />
                
                <div className="max-w-md w-full space-y-8 p-12 bg-white rounded-[20px] shadow-sm hover:shadow-lg transition-all">
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E3F3E3] text-[#1D7D1D] text-2xl mb-4">
                            ✓
                        </div>
                        <h1 className="text-4xl font-semibold text-[#1D1D1F] tracking-tight">Payment Successful</h1>
                        <p className="text-xl text-[#86868B] leading-relaxed">
                            Thank you for your purchase. Your payment has been processed successfully.
                        </p>
                        <div className="pt-4">
                            <button
                                onClick={handleReturn}
                                className="inline-flex items-center h-12 px-8 text-base rounded-[14px] bg-[#0066CC] hover:bg-[#0077ED] text-white shadow-sm transition-all"
                            >
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Return to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ?customer_session_token=polar_cst_t33RWpZJ1CzVSJkq7eJ5bDuG36OJRX11HpCD93zVZ5n