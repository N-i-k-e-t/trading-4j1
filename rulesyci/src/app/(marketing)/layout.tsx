export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-[100dvh]">
            {children}
        </div>
    );
}
