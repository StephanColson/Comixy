import {Section} from "../components/Section.jsx";
import {Comics} from "../components/Comics.jsx";

export function ComicPage (props) {
    const {comics, title} = props;

    return (
        <>
            <Section title="Comic List">
                <Comics comics={comics}/>
            </Section>
        </>
    )
}