import {Section} from "../components/Section.jsx";
import {Comics} from "../components/Comics.jsx";

export function ComicPage (props) {
    const {comics, title} = props;
    const comicSorted = [...comics].sort((a, b) => a.title.localeCompare(b.title))

    return (
        <>
            <div className="d-flex justify-content-between">
                <div className="bg-dark-subtle p-2">
                    <div className="mb-2">
                        <h2>Filters</h2>
                    </div>

                    <div>
                        <label>Filter Author:</label>
                        <input className="form-control" type="text"/>
                    </div>
                </div>

                <Section title="Comic List">
                    <Comics comics={comicSorted}/>
                </Section>
            </div>
        </>
    )
}