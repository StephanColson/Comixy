import {Section} from "./Section.jsx";
import {SectionCard} from "./SectionCard.jsx";

function Comic (props) {
    const {comic} = props;

    return (
        <SectionCard
            coverImg={comic.cover}
            title={comic.title}
            price={comic.price}/>
    )
}

export function Comics (props) {
    const {comics} = props;

    return (
        <Section>
            {comics.map(c => <Comic key={c.id} comic={c}/>)}
        </Section>
    )
}