export default function ScrollToTopButton() {
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
            /* you can also use 'auto' behaviour
               in place of 'smooth' */
        })
    }

    return (
        <div className="scrl-btn">
            <button onClick={scrollToTop}>^</button>
        </div>
    )
}