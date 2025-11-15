import cookie from 'cookie';

export const cookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
};

export function setTokenCookie(res, token) {
  const serialized = cookie.serialize('token', token, {
    ...cookieOptions,
    maxAge: 3 * 24 * 60 * 60, // 3 days
    path: '/'
  });
  res.setHeader('Set-Cookie', serialized);
}

export function clearTokenCookie(res) {
  const serialized = cookie.serialize('token', '', {
    ...cookieOptions,
    maxAge: 0,
    path: '/'
  });
  res.setHeader('Set-Cookie', serialized);
}
