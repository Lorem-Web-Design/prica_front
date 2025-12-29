type ErrorPage = {
    code: string, message: string, description: string
}
export default function ErrorPage({code, message, description}:ErrorPage){
    return <div className="errorContainer">
        <p className="notFoundTitle">{code}</p>
        <p className="notFoundMessage">{message}</p>
        <p className="notFoundTrack">{description}</p>
    </div>
}