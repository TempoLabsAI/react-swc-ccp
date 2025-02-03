import { useNavigate } from "react-router-dom";

export default function Success() {
    const navigate = useNavigate();

    const handleReturn = () => {
        navigate("/dashboard", { replace: true });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Success! 🎉</h1>
                    <p className="text-lg text-gray-600 mb-8">Your payment has been processed successfully.</p>
                    <button
                        onClick={handleReturn}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        Return Back
                    </button>
                </div>
            </div>
        </div>
    );
}

// ?customer_session_token=polar_cst_t33RWpZJ1CzVSJkq7eJ5bDuG36OJRX11HpCD93zVZ5n