import { Editions } from '../Editions.jsx';

const meta = {
  component: Editions,
  tags: ["autodocs"],
  args: {
    editions: [
      {
        id: "ed1",
        imgURL: "https://m.media-amazon.com/images/I/81NIli1PuqL.jpg",
        format: "Paperback",
        printType: "First Print",
        numberInCollection: "1",
        price: 12.99,
        publisherDisplay: "Dark Horse Comics",
        displayContributors: [
          { peopleName: "Kentaro Miura", roleName: "Writer" },
          { peopleName: "Kentaro Miura", roleName: "Artist" }
        ]
      },
      {
        id: "ed2",
        imgURL: "https://m.media-amazon.com/images/I/71tbalAHYCL.jpg",
        format: "Hardcover",
        printType: "Collector's Edition",
        numberInCollection: "2",
        price: 29.99,
        publisherDisplay: "Kodansha",
        displayContributors: [
          { peopleName: "Hajime Isayama", roleName: "Writer" }
        ]
      }
    ],
    onEditEdition: (edition) => console.log("Edit clicked:", edition)
  }
};

export default meta;

export const Default = {
  args: {}
};