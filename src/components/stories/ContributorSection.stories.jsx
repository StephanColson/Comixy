import { useState } from 'react';
import { ContributorSection } from '../ContributorSection.jsx';

const meta = {
  component: ContributorSection,
  tags: ["autodocs"],
  render: (args) => {
    // Local state so Storybook can simulate editing
    const [contributors, setContributors] = useState(args.contributors);
    const [contributorDraft, setContributorDraft] = useState(args.contributorDraft);
    const [searchQuery, setSearchQuery] = useState(args.searchQuery);

    return (
        <ContributorSection
            {...args}
            contributors={contributors}
            setContributors={setContributors}
            contributorDraft={contributorDraft}
            setContributorDraft={setContributorDraft}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
        />
    );
  },
  args: {
    peoples: [
      { id: "p1", name: "Kentaro Miura" },
      { id: "p2", name: "Hajime Isayama" },
      { id: "p3", name: "Eiichiro Oda" }
    ],
    roles: [
      { id: "r1", type: "Writer" },
      { id: "r2", type: "Artist" },
      { id: "r3", type: "Editor" }
    ],
    filteredPersons: [
      { id: "p1", name: "Kentaro Miura" },
      { id: "p2", name: "Hajime Isayama" }
    ],
    filteredRoles: [
      { id: "r1", type: "Writer" },
      { id: "r2", type: "Artist" }
    ],
    contributors: [
      { peopleName: "Kentaro Miura", roleName: "Writer" },
      { peopleName: "Kentaro Miura", roleName: "Artist" }
    ],
    contributorDraft: {
      peopleID: null,
      peopleName: "",
      roleID: null,
      roleName: ""
    },
    searchQuery: {
      person: "",
      role: ""
    }
  }
};

export default meta;

export const Default = {
  args: {}
};