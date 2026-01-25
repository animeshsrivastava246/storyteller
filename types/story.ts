export type StoryLine = {
  text: string;
  prompt: string;
};

export type StoryEntry = {
  id: string;
  seed: string;
  createdAt: string;
  story: StoryLine[];
};
