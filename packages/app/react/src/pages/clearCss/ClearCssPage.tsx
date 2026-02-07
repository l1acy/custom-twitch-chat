export default function ClearCssPage() {
    localStorage.removeItem('customCss');

    return (
        <p>Successful cleaned!</p>
    )
}