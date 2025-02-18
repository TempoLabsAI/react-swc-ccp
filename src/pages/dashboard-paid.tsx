import { useUser } from "@clerk/clerk-react";
import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Footer } from "../components/footer";
import { Navbar } from "../components/navbar";

export default function DashboardPaid() {
    const { user } = useUser();
    const userData = useQuery(api.users.getUserByToken,
        user?.id ? { tokenIdentifier: user.id } : "skip"
    );
    const subscription = useQuery(api.subscriptions.getUserSubscription);
    const getDashboardUrl = useAction(api.subscriptions.getUserDashboardUrl);

    const handleManageSubscription = async () => {
        try {
            const result = await getDashboardUrl({
                customerId: subscription?.customerId
            });
            if (result?.url) {
                window.location.href = result.url;
            }
        } catch (error) {
            console.error("Error getting dashboard URL:", error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600 mt-2">View and manage your account information</p>
                        <div className="mt-[1rem]">
                            <button
                                onClick={handleManageSubscription}
                                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Manage Subscription
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Clerk User Data */}
                        <DataCard title="Clerk User Information">
                            <div className="space-y-2">
                                <DataRow label="Full Name" value={user?.fullName} />
                                <DataRow label="Email" value={user?.primaryEmailAddress?.emailAddress} />
                                <DataRow label="User ID" value={user?.id} />
                                <DataRow label="Created" value={new Date(user?.createdAt || "").toLocaleDateString()} />
                                <DataRow
                                    label="Email Verified"
                                    value={user?.primaryEmailAddress?.verification.status === "verified" ? "Yes" : "No"}
                                />
                            </div>
                        </DataCard>

                        {/* Database User Data */}
                        <DataCard title="Database User Information">
                            <div className="space-y-2">
                                <DataRow label="Database ID" value={userData?._id} />
                                <DataRow label="Name" value={userData?.name} />
                                <DataRow label="Email" value={userData?.email} />
                                <DataRow label="Token ID" value={userData?.tokenIdentifier} />
                                <DataRow
                                    label="Last Updated"
                                    value={userData?._creationTime ? new Date(userData._creationTime).toLocaleDateString() : undefined}
                                />
                            </div>
                        </DataCard>

                        {/* Session Information */}
                        <DataCard title="Current Session">
                            <div className="space-y-2">
                                <DataRow label="Last Active" value={new Date(user?.lastSignInAt || "").toLocaleString()} />
                                <DataRow label="Auth Strategy" value={user?.primaryEmailAddress?.verification.strategy} />
                            </div>
                        </DataCard>

                        {/* Additional User Details */}
                        <DataCard title="Profile Details">
                            <div className="space-y-2">
                                <DataRow label="Username" value={user?.username} />
                                <DataRow label="First Name" value={user?.firstName} />
                                <DataRow label="Last Name" value={user?.lastName} />
                                <DataRow
                                    label="Profile Image"
                                    value={user?.imageUrl ? "Available" : "Not Set"}
                                />
                            </div>
                        </DataCard>
                    </div>

                    {/* Subscription Data Grid */}
                    <div className="mt-8">
                        <DataCard title="Subscription Information">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Status</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <StatusBadge status={subscription?.status} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Plan Amount</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatCurrency(subscription?.amount, subscription?.currency)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Billing Interval</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subscription?.interval || "—"}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Current Period</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(subscription?.currentPeriodStart)} - {formatDate(subscription?.currentPeriodEnd)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Started At</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(subscription?.startedAt)}</td>
                                        </tr>
                                        {subscription?.canceledAt && (
                                            <>
                                                <tr>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Canceled At</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(subscription?.canceledAt)}</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Cancellation Reason</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subscription?.customerCancellationReason || "—"}</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Cancellation Comment</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subscription?.customerCancellationComment || "—"}</td>
                                                </tr>
                                            </>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </DataCard>
                    </div>

                    {/* JSON Data Preview */}
                    <div className="mt-8">
                        <DataCard title="Raw Data Preview">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">Clerk User Data</h3>
                                    <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto max-h-64">
                                        {JSON.stringify(user, null, 2)}
                                    </pre>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">Database User Data</h3>
                                    <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto max-h-64">
                                        {JSON.stringify(userData, null, 2)}
                                    </pre>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">Subscription Data</h3>
                                    <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto max-h-64">
                                        {JSON.stringify(subscription, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </DataCard>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

function DataCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">{title}</h2>
            {children}
        </div>
    );
}

function DataRow({ label, value }: { label: string; value: string | number | null | undefined }) {
    return (
        <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
            <span className="text-gray-600">{label}</span>
            <span className="text-gray-900 font-medium">{value || "—"}</span>
        </div>
    );
}

function formatDate(timestamp: number | undefined) {
    if (!timestamp) return "—";
    return new Date(timestamp).toLocaleDateString();
}

function formatCurrency(amount: number | undefined, currency: string = "USD") {
    if (amount === undefined) return "—";
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
    }).format(amount / 100);
}

function StatusBadge({ status }: { status: string | undefined }) {
    const getStatusColor = (status: string | undefined) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-800";
            case "canceled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(status)}`}>
            {status || "No status"}
        </span>
    );
}