import { SectionCard } from '../SectionCard.jsx';

const meta = {
  component: SectionCard,
  tags: ["autodocs"],
  args: {
    coverImg: "https://m.media-amazon.com/images/M/MV5BMTk1MGM5ZDQtMWFkZS00YTUyLWIzYWYtZTQwYWYzNzQ3MTMyXkEyXkFqcGc%40._V1_FMjpg_UX1000_.jpg",
    children:
        <>
          <div className="fw-bold">Goblin Slayer #1</div>
          <hr/>
          <div className="text-muted">Action, Fantasy</div>
          <div className="mt-2 text-info fw-bold bg-secondary-subtle p-1 rounded">15 €</div>
        </>
  }
};

export default meta;

export const Default = {
  args: {}
};