export function Content({ className, children }) {

    const contentStyles = {
        width: "calc(100% - 300px)",
        marginLeft: "300px",
        padding: "25px 30px",
        transition: ".3s"
    }

    return (
        <section className={className} style={contentStyles}>
            {children}
        </section>
    )
}