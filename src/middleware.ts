import { type NextRequest, type MiddlewareConfig, NextResponse } from "next/server";

const publicRoutes = [
  { path: '/login', whenAutenticated: 'redirect' }
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATION_ROUTE = '/login';

function isValidToken(token: string): boolean {
  try {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp && payload.exp > currentTime;
  } catch (error) {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find(route => route.path === path);
  const authToken = request.cookies.get('token');

  // Se existir um token, verifique se ele é válido
  if (authToken) {
    if (!isValidToken(authToken.value)) {
      // Token inválido ou expirado: apaga o cookie e redireciona para /login
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATION_ROUTE;
      const response = NextResponse.redirect(redirectUrl);
      response.cookies.delete('token');
      return response;
    }
  }

  // Se não houver token e a rota não for pública, redireciona para /login
  if (!authToken && !publicRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATION_ROUTE;
    return NextResponse.redirect(redirectUrl);
  }

  // Se não houver token, mas a rota for pública, permite a requisição
  if (!authToken && publicRoute) {
    return NextResponse.next();
  }

  // Se houver token (válido) e a rota for pública com flag de redirecionamento,
  // redireciona para a listagem de empresas
  if (authToken && publicRoute && publicRoute.whenAutenticated === 'redirect') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/dashboard';
    return NextResponse.redirect(redirectUrl);
  }

  // Em qualquer outro caso, permite a requisição
  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: [
    /*
     * Filtra todas as rotas, exceto as que iniciam com:
     * - api (rotas de API)
     * - _next/static (arquivos estáticos)
     * - _next/image (arquivos de otimização de imagens)
     * - favicon.ico, sitemap.xml, robots.txt (arquivos de metadados)
     */
    '/((?!api|_next/static|_next/image|public|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
