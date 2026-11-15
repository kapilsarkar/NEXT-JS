type ContactLayoutProps = Readonly<{
    children: React.ReactNode;
}>;

export default function ContactLayout({ children }: ContactLayoutProps) {
    return (
        <div>
            <h1>Header</h1>
            <p>Contact Layout</p>
            {children}
            <h1>Footer By Kapil Sarkar</h1>
        </div>
    );
}
