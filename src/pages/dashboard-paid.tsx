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
        <div className="min-h-screen flex flex-col bg-[#FBFBFD]">
            <Navbar />
            <main className="flex-grow">
                <div className="container mx-auto px-4 pb-24 pt-12">
                    {/* Header Section */}
                    <div className="relative flex flex-col items-center text-center space-y-6 pb-16">
                        <div className="absolute inset-x-0 -top-24 -bottom-24 bg-gradient-to-b from-[#FBFBFD] via-white to-[#FBFBFD] opacity-80 blur-3xl -z-10" />
                        <h1 className="text-4xl font-semibold text-[#1D1D1F] tracking-tight">
                            Premium Dashboard
                        </h1>
                        <p className="text-xl text-[#86868B] max-w-[600px] leading-relaxed">
                            Manage your premium account details and subscription preferences.
                        </p>
                        <button
                            onClick={handleManageSubscription}
                            className="h-12 px-8 text-base rounded-[14px] bg-[#0066CC] hover:bg-[#0077ED] text-white shadow-sm transition-all mt-4"
                        >
                            Manage Subscription
                        </button>
                    </div>

                    {/* User Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        {/* Clerk User Data */}
                        <DataCard title="Personal Information">
                            <div className="space-y-3">
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
                        <DataCard title="Account Details">
                            <div className="space-y-3">
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
                        <DataCard title="Security & Privacy">
                            <div className="space-y-3">
                                <DataRow label="Last Active" value={new Date(user?.lastSignInAt || "").toLocaleString()} />
                                <DataRow label="Auth Strategy" value={user?.primaryEmailAddress?.verification.strategy} />
                            </div>
                        </DataCard>

                        {/* Additional User Details */}
                        <DataCard title="Profile Information">
                            <div className="space-y-3">
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

                    {/* Subscription Data Section */}
                    <div className="mb-16">
                        <DataCard title="Subscription Details">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-[#F5F5F7]">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-[#86868B]">Field</th>
                                            <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-[#86868B]">Value</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#F5F5F7]">
                                        <tr>
                                            <td className="px-6 py-4 text-sm font-medium text-[#1D1D1F]">Status</td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={subscription?.status} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 text-sm font-medium text-[#1D1D1F]">Plan Amount</td>
                                            <td className="px-6 py-4 text-sm text-[#1D1D1F]">
                                                {formatCurrency(subscription?.amount, subscription?.currency)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 text-sm font-medium text-[#1D1D1F]">Billing Interval</td>
                                            <td className="px-6 py-4 text-sm text-[#1D1D1F]">{subscription?.interval || "—"}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 text-sm font-medium text-[#1D1D1F]">Current Period</td>
                                            <td className="px-6 py-4 text-sm text-[#1D1D1F]">
                                                {formatDate(subscription?.currentPeriodStart)} - {formatDate(subscription?.currentPeriodEnd)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 text-sm font-medium text-[#1D1D1F]">Started At</td>
                                            <td className="px-6 py-4 text-sm text-[#1D1D1F]">{formatDate(subscription?.startedAt)}</td>
                                        </tr>
                                        {subscription?.canceledAt && (
                                            <>
                                                <tr>
                                                    <td className="px-6 py-4 text-sm font-medium text-[#1D1D1F]">Canceled At</td>
                                                    <td className="px-6 py-4 text-sm text-[#1D1D1F]">{formatDate(subscription?.canceledAt)}</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-6 py-4 text-sm font-medium text-[#1D1D1F]">Cancellation Reason</td>
                                                    <td className="px-6 py-4 text-sm text-[#1D1D1F]">{subscription?.customerCancellationReason || "—"}</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-6 py-4 text-sm font-medium text-[#1D1D1F]">Cancellation Comment</td>
                                                    <td className="px-6 py-4 text-sm text-[#1D1D1F]">{subscription?.customerCancellationComment || "—"}</td>
                                                </tr>
                                            </>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </DataCard>
                    </div>

                    {/* JSON Data Preview */}
                    <div>
                        <DataCard title="Technical Details">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div>
                                    <h3 className="text-sm font-medium text-[#1D1D1F] mb-3">Clerk User Data</h3>
                                    <pre className="bg-[#F5F5F7] p-4 rounded-2xl text-sm overflow-auto max-h-64 text-[#1D1D1F]">
                                        {JSON.stringify(user, null, 2)}
                                    </pre>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-[#1D1D1F] mb-3">Database User Data</h3>
                                    <pre className="bg-[#F5F5F7] p-4 rounded-2xl text-sm overflow-auto max-h-64 text-[#1D1D1F]">
                                        {JSON.stringify(userData, null, 2)}
                                    </pre>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-[#1D1D1F] mb-3">Subscription Data</h3>
                                    <pre className="bg-[#F5F5F7] p-4 rounded-2xl text-sm overflow-auto max-h-64 text-[#1D1D1F]">
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
        <div className="bg-white rounded-[20px] shadow-sm p-8 transition-all hover:shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-[#1D1D1F]">{title}</h2>
            {children}
        </div>
    );
}

function DataRow({ label, value }: { label: string; value: string | number | null | undefined }) {
    return (
        <div className="flex justify-between py-3 border-b border-[#F5F5F7] last:border-0">
            <span className="text-[#86868B]">{label}</span>
            <span className="text-[#1D1D1F] font-medium">{value || "—"}</span>
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
                return "bg-[#E3F3E3] text-[#1D7D1D]";
            case "canceled":
                return "bg-[#FFE5E5] text-[#D92D20]";
            default:
                return "bg-[#F5F5F7] text-[#86868B]";
        }
    };

    return (
        <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
            {status || "No status"}
        </span>
    );
}