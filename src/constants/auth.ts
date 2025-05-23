export const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;

// 환경에 따른 REDIRECT_URI 설정
const getRedirectUri = () => {
  if (typeof window !== 'undefined') {
    // 클라이언트 사이드에서 현재 도메인 확인
    const isProduction = window.location.hostname === 'over-time-front.vercel.app';

    console.log('isProduction', isProduction);

    if (isProduction) {
      return 'https://over-time-front.vercel.app/login/callback';
    } else {
      return 'http://localhost:3000/login/callback';
    }
  }

  // 서버 사이드에서는 환경 변수나 NODE_ENV로 판단
  if (process.env.NODE_ENV === 'production') {
    return 'https://over-time-front.vercel.app/login/callback';
  }

  return 'http://localhost:3000/login/callback';
};

export const REDIRECT_URI = getRedirectUri();
