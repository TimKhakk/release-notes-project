import { LINEAR_API_COOKIE_KEY_NAME } from '$lib/constants/cookieKeyNames';
import { LINEAR_API_KEY_NAME } from '$lib/constants/formDataNames';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
  const apiKey = JSON.parse(cookies.get(LINEAR_API_COOKIE_KEY_NAME) ?? '');
  return { apiKey };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const apiKey = formData.get(LINEAR_API_KEY_NAME);

    if (false) {
      return {
        success: false,
        message: 'Something went wrong. Linear api key was not updated!'
      }
    }

    cookies.set(LINEAR_API_COOKIE_KEY_NAME, JSON.stringify(apiKey));

    return { success: true, message: 'Linear api key was successfully updated!' };
  }
};