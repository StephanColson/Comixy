import { Comics } from '../Comics.jsx';

const testComics = [
  {id: 1, title: "Goblin Slayer", price: 15, released: 2010, cover: "https://cdn.kobo.com/book-images/82833312-93c9-4700-a8b2-7d327a81b83f/1200/1200/False/goblin-slayer-vol-1-light-novel-2.jpg"},
  {id: 2, title: "Bofuri", price: 15, released: 2014, cover: "https://i.ebayimg.com/images/g/L0sAAOSweMtl0Fdp/s-l400.jpg"},
  {id: 3, title: "Assassin's Creed", price: 15, released: 2001, cover: "https://i.ebayimg.com/images/g/fZUAAOSw0vBUbisK/s-l1200.jpg"},
  {id: 4, title: "Angel of death", price: 15, released: 2005, cover: "https://m.media-amazon.com/images/I/81P3I8C8zbL._UF1000,1000_QL80_.jpg"},
  {id: 5, title: "Angel of death", price: 15, released: 2005, cover: "https://m.media-amazon.com/images/I/81P3I8C8zbL._UF1000,1000_QL80_.jpg"},
  {id: 6, title: "Angel of death", price: 15, released: 2005, cover: "https://m.media-amazon.com/images/I/81P3I8C8zbL._UF1000,1000_QL80_.jpg"},
  {id: 7, title: "Angel of death", price: 15, released: 2005, cover: "https://m.media-amazon.com/images/I/81P3I8C8zbL._UF1000,1000_QL80_.jpg"},
]

const meta = {
  component: Comics,
  tags: ["autodocs"],
  args: {
    comics: testComics
  }
};

export default meta;

export const Default = {
  args: {}
};