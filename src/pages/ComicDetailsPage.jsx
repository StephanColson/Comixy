import {Section} from "../components/Section.jsx";

export function ComicDetailsPage (props) {
    const {comics} = props;

    return (
        <Section>
            <div>
                {comics.cover}
            </div>

            <div>
                {comics.title}
                <div>
                    {comics.synopsis}
                </div>
            </div>
        </Section>
    )
}