import { useState } from "react";
import { EditEditionModal } from "../EditEditionModal.jsx";

const meta = {
  component: EditEditionModal,
  tags: ["autodocs"],
  render: (args) => {
    // Local state so Storybook can simulate editing
    const [edition, setEdition] = useState(args.edition);

    return (
        <EditEditionModal
            {...args}
            edition={edition}
            onClose={() => console.log("Modal closed")}
        />
    );
  },
  args: {
    edition: {
      id: "ed1",
      comicID: "comic123",
      imgURL: "https://m.media-amazon.com/images/I/81NIli1PuqL.jpg",
      format: "Paperback",
      printType: "First Print",
      numberInCollection: "1",
      price: 12.99,
      selfPublished: false,
      organizationID: "org1",
      organizationName: "Dark Horse Comics",
      selfPublisherName: "",
      displayContributors: [
        { peopleName: "Kentaro Miura", roleName: "Writer" },
        { peopleName: "Kentaro Miura", roleName: "Artist" }
      ]
    },

    organizations: [
      { id: "org1", name: "Dark Horse Comics" },
      { id: "org2", name: "Kodansha" },
      { id: "org3", name: "Shueisha" }
    ],

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

    comicContributors: [
      {
        id: "cc1",
        editionID: "ed1",
        peopleID: "p1",
        roleID: "r1",
        ref: { id: "cc1" } // fake ref for Storybook
      },
      {
        id: "cc2",
        editionID: "ed1",
        peopleID: "p1",
        roleID: "r2",
        ref: { id: "cc2" }
      }
    ]
  }
};

export default meta;

export const Default = {
  args: {}
};