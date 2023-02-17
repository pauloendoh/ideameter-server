export const redisKeys = {
  userLastOnline: (userId: string) =>
    `ideameter/user-last-online?userId=${userId}`,
}
