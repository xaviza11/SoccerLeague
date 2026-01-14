export default defineEventHandler(async (event) => {
  setCookie(event, "token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return {
    success: true,
    message: "Cookie have been delete",
  };
});
