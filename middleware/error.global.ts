export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path !== '/' && !to.matched.length) {
    throw createError({
      statusCode: 404,
      message: 'Trang không tồn tại',
      fatal: true
    })
  }
}) 