import { AddComicModal } from '../AddComicModal.jsx';

const meta = {
  component: AddComicModal,
  tags: ["autodocs"],
  args: {
    show: true,
    onHide: () => console.log("Modal closed (storybook)"),
    onAdd: (comic) => console.log("Comic added (storybook):", comic),
  }
};

export default meta;

export const Default = {
  args: {}
};