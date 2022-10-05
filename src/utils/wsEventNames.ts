export const wsEventNames = {
  updateUserNotifications: (userId: string) =>
    `updateUserNotifications-${userId}`,
  deleteIdea: "deleteIdea",
  moveIdeasToTab: `/ideas/move-to-tab`,
};
