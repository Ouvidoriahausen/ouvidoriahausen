export function Content({ className, children }) {

    const contentStyles = {
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