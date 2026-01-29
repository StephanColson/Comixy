export function Publisher(props) {
    const { publisher, comics } = props;

    return (
        <>
            <h2>{publisher?.name}</h2>

            <h4>Comics by this publisher</h4>
            <ul>
                {comics?.map(c => (
                    <li key={c.id}>{c.title}</li>
                ))}
            </ul>
        </>
    );
}
